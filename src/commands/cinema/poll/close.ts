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
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { createMovieEvent } from '../../../utils/eventCreator';
import { sendMovieEventMessage } from '../../../utils/messageSender';
import { setWinnerMovie } from './winner';

const buttonDisabledTimeSeconds = 30;

export interface MovieVote {
  movie: string;
  count: number;
  userId: string;
  featText?: string;
}

const getInteractionButtonRow = (disabled: boolean) => {
  const buttonLabel = disabled
    ? MSG.pollButtonDisabled.parseArgs(buttonDisabledTimeSeconds)
    : MSG.pollButtonEnabled;
  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('close')
      .setLabel(buttonLabel)
      .setEmoji(disabled ? '🔒' : '✅')
      .setDisabled(disabled)
      .setStyle(ButtonStyle.Primary),
  );
  return buttonRow;
};

export const closePoll = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
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
  const winners = movieVotes.filter((m) => m.count === winningCount);

  const embedFields: EmbedField[] = movieVotes.map((m) => ({
    name: MSG.empty,
    value: `${m.movie}: ${m.count > 0 ? '🍿'.repeat(m.count) : '✖'}`,
    inline: false,
  }));
  if (winners.length > 1) {
    const numUniqueVoters = new Set(suggestions).size;
    await DB.poll.updateOne(
      { pollId: poll.pollId, guildId: interaction.guild.id },
      { status: PollStatus.TIE_BREAK },
    );
    // WIP tiebreakVoting(interaction, winners, numUniqueVoters, poll.pollId);
  } else {
    await DB.poll.updateOne(
      { pollId: poll.pollId, guildId: interaction.guild.id },
      { status: PollStatus.FINISHED },
    );
    const winningSuggestion = movieVotes[0];
    const movie = await setWinnerMovie(poll, winningSuggestion);
    const embed = new EmbedBuilder()
      .setTitle(MSG.pollEndedTitle)
      .setFields(embedFields)
      .setDescription(
        MSG.pollSuggestionsEmbedField.parseArgs(
          winningSuggestion.movie,
          winningSuggestion.userId,
        ),
      )
      .setColor(Colors.Gold);
    const event = await createMovieEvent(
      winningSuggestion.movie,
      movie.sessionDate,
      interaction.channel.guild,
    );
    await sendMovieEventMessage(movie, event, interaction.channel.guild);

    const message = await interaction.channel.messages.fetch(poll.messageId);
    if (message) {
      await message.edit({
        embeds: [embed],
      });
    } else {
      await interaction.channel.send({ embeds: [embed] });
    }
    try {
      await interaction.deleteReply();
    } catch (error) {
      return;
    }
  }
};

export const startClosePollCollector = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  interaction.editReply({
    content: MSG.pollStarted.parseArgs(buttonDisabledTimeSeconds),
    components: [getInteractionButtonRow(true)],
  });
  setTimeout(
    () =>
      interaction.editReply({
        content: MSG.movieRatingStarted.parseArgs(buttonDisabledTimeSeconds),
        components: [getInteractionButtonRow(false)],
      }),
    buttonDisabledTimeSeconds * 1000,
  );

  let collector = interaction.channel.createMessageComponentCollector();

  collector.on('collect', async (buttonInteraction) => {
    if (buttonInteraction.customId === 'close') {
      closePoll(interaction);
    }
  });
};
