import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  EmbedField,
} from 'discord.js';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { VotingStatus } from '../../../constants/enums/VotingStatus';
import { DB, PollSuggestion, PollVote } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { createMovieEvent } from '../../../utils/eventCreator';
import { sendMovieEventMessage } from '../../../utils/messageSender';
import { setWinnerMovie } from './winner';

const buttonDisabledTimeSeconds = 30;

export interface MovieVote {
  movie: string;
  count: number;
}

export const getVotes = (pollVotes: PollVote[]) => {
  let votedMovies = [...new Set(pollVotes.map((s) => s.movie))];
  let movieVotes: MovieVote[] = [];
  votedMovies.forEach((movie) =>
    movieVotes.push({
      movie,
      count: pollVotes.reduce(
        (count, vote) => (vote.movie === movie ? ++count : count),
        0,
      ),
    }),
  );
  return movieVotes;
};

export const getWinners = (movieVotes: MovieVote[]) => {
  const winnerCount = Math.max.apply(
    Math,
    movieVotes.map(function (vote) {
      return vote.count;
    }),
  );
  return movieVotes.filter((movieVote) => movieVote.count == winnerCount);
};

export const closePoll = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const poll = await DB.poll.findOne({
    status: { $in: [PollStatus.ACTIVE, PollStatus.VOTING] },
    guildId: interaction.guild.id,
  });
  if (!poll) {
    await interaction.editReply({
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

  // Processing the results
  const suggestions = await DB.pollSuggestion.find({
    pollId: poll.pollId,
    guildId: interaction.guild.id,
  });
  // let movieVotes = suggestions.map(

  const pollVotes = await DB.pollVote.find({
    pollId: poll.pollId,
    guildId: interaction.guild.id,
  });

  const movieVotes = getVotes(pollVotes);
  const winners = getWinners(movieVotes);

  const embedFields: EmbedField[] = movieVotes.map((m) => ({
    name: MSG.empty,
    value: `${m.movie}: ${m.count > 0 ? '🍿'.repeat(m.count) : '✖'}`,
    inline: false,
  }));
  let message = await interaction.channel.messages.fetch(poll.messageId);
  const pollEmbed = new EmbedBuilder()
    .setTitle(MSG.pollEndedTitle)
    .setFields(embedFields)
    .setColor(Colors.Gold);
  if (winners.length > 1) {
    await DB.pollVote.updateMany(
      {
        guildId: interaction.guild.id,
        pollId: poll.pollId,
        movie: { $in: winners.map((m) => m.movie) },
      },
      { votingIndex: VotingStatus.TIEBREAK },
    );
    pollEmbed.setDescription(MSG.pollIsTied);
    if (message) {
      await message.edit({ embeds: [pollEmbed] });
    } else {
      message = await interaction.channel.send({ embeds: [pollEmbed] });
    }
    await DB.poll.updateOne(
      { pollId: poll.pollId, guildId: interaction.guild.id },
      { status: PollStatus.TIE_BREAK, messageId: message.id },
    );
  } else {
    await DB.poll.updateOne(
      { pollId: poll.pollId, guildId: interaction.guild.id },
      { status: PollStatus.FINISHED },
    );
    const winningSuggestion = movieVotes[0];
    const winner = suggestions.find((s) => s.movie === winningSuggestion.movie);

    if (winner) {
      const movie = await setWinnerMovie(poll, winner);
      pollEmbed.setDescription(
        MSG.pollSuggestionsEmbedField.parseArgs(winningSuggestion.movie),
      );
      const event = await createMovieEvent(
        winningSuggestion.movie,
        movie.sessionDate,
        interaction.channel.guild,
      );
      await sendMovieEventMessage(movie, event, interaction.channel.guild);
    }
    if (message) {
      await message.edit({
        embeds: [pollEmbed],
      });
    } else {
      await interaction.channel.send({ embeds: [pollEmbed] });
    }
    try {
      await interaction.deleteReply();
    } catch (error) {
      return;
    }
  }
};
