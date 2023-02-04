import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { DB, Poll, PollVote } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { createMovieEvent } from '../../../utils/eventCreator';
import { truncateText } from '../../../utils/formatter';
import { sendMovieEventMessage } from '../../../utils/messageSender';
import { setWinnerMovie } from '../poll/winner';

const getMovieButtons = (pollVotes: PollVote[]) => {
  const buttons: ButtonBuilder[] = [];
  pollVotes.forEach((pollVote, index) => {
    const button = new ButtonBuilder()
      .setCustomId(pollVote.movie)
      .setEmoji('✔')
      .setLabel(`#${index + 1} ${truncateText(pollVote.movie, 30)}`)
      .setStyle(ButtonStyle.Primary);
    buttons.push(button);
  });
  return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
};

export const manualSelection = async (
  interaction: ExtendedInteraction,
  poll: Poll,
  pollVotes: PollVote[],
) => {
  await interaction.editReply({
    content: MSG.pollManualSelectionPrompt,
    components: [getMovieButtons(pollVotes)],
  });

  let collector = interaction.channel.createMessageComponentCollector();
  collector.on('collect', async (buttonInteraction) => {
    const winner = pollVotes.find(
      (pollVote) => pollVote.movie === buttonInteraction.customId,
    );
    const winningSuggestion = await DB.pollSuggestion.findOne({
      pollId: winner.pollId,
      guildId: interaction.guild.id,
      movie: winner.movie,
    });
    const movie = await setWinnerMovie(poll, winningSuggestion);
    await DB.poll.updateOne(
      { pollId: winner.pollId, guildId: interaction.guild.id },
      { status: PollStatus.FINISHED },
    );
    const event = await createMovieEvent(
      winningSuggestion.movie,
      movie.sessionDate,
      interaction.channel.guild,
    );
    await sendMovieEventMessage(movie, event, interaction.channel.guild);

    await interaction.editReply({
      content: MSG.pollManualSelectionUser.parseArgs(
        interaction.member.displayName,
        movie.name,
      ),
      components: [],
    });
    await interaction.followUp({
      ephemeral: false,
      content: MSG.pollManualSelectionWinner.parseArgs(winner.movie),
    });
  });
};
