import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  EmbedField,
} from 'discord.js';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { createMovieEvent } from '../../../utils/eventCreator';
import { sendMovieEventMessage } from '../../../utils/messageSender';
import { setWinnerMovie } from './winner';

export interface MovieVote {
  movie: string;
  count: number;
  userId: string;
  featText?: string;
}

export const closePoll = async (interaction: ChatInputCommandInteraction) => {
  const poll = await DB.poll.findOne({
    status: { $in: [PollStatus.ACTIVE, PollStatus.VOTING, PollStatus.TIE_BREAK] },
    guildId: interaction.guild.id,
  });
  if (!poll) {
    interaction.editReply({
      content: MSG.pollNoneOpened,
    });
    return;
  }
  if (poll.status === PollStatus.ACTIVE) {
    await interaction.editReply({
      content: MSG.pollHasntStarted,
    });
    return;
  }
  if (poll.status === PollStatus.TIE_BREAK) {
    await interaction.editReply({
      content: MSG.pollIsTied,
    });
    return;
  }

  // Processing the results
  const suggestions = await DB.pollSuggestion.find({
    pollId: poll.pollId,
    guildId: interaction.guild.id,
  });
  let movieVotes = suggestions.map(
    (s) =>
      ({
        movie: s.movie,
        count: 0,
        userId: s.userId,
        featText: s.winningText,
      } as MovieVote),
  );
  const votes = await DB.pollVote.find({
    pollId: poll.pollId,
    guildId: interaction.guild.id,
  });
  votes.forEach((v) => {
    let movie = movieVotes.find((m) => m.movie === v.movie)!;
    movie.count += 1;
  });
  movieVotes = movieVotes.sort((a, b) => b.count - a.count);
  const winningCount = movieVotes[0].count;
  const mostVoted = movieVotes.filter((m) => m.count === winningCount);
  const draw = mostVoted.length > 1;

  const embedFields: EmbedField[] = movieVotes.map((m) => ({
    name: MSG.empty,
    value: `${m.movie}: ${m.count > 0 ? '🍿'.repeat(m.count) : '✖'}`,
    inline: false,
  }));
  const embed = new EmbedBuilder().setTitle(MSG.pollEmbedTitle).setFields(embedFields);
  if (draw) {
    await DB.poll.updateOne(
      { pollId: poll.pollId, guildId: interaction.guild.id },
      { status: PollStatus.TIE_BREAK },
    );
    embed.setDescription(
      MSG.pollDrawDescription.parseArgs(mostVoted.map((m) => m.movie).join(', ')),
    );
  } else {
    await DB.poll.updateOne(
      { pollId: poll.pollId, guildId: interaction.guild.id },
      { status: PollStatus.FINISHED },
    );
    const winningSuggestion = movieVotes[0];
    const movie = await setWinnerMovie(poll, winningSuggestion);
    embed.setTitle(MSG.pollEndedTitle);
    embed.setDescription(
      MSG.pollSuggestionsEmbedField.parseArgs(
        winningSuggestion.movie,
        winningSuggestion.userId,
      ),
    );
    embed.setColor(Colors.Gold);
    const event = await createMovieEvent(
      winningSuggestion.movie,
      movie.sessionDate,
      interaction.channel.guild,
    );
    await sendMovieEventMessage(movie, event, interaction.channel.guild);
  }
  await interaction.editReply({
    embeds: [embed],
  });
};
