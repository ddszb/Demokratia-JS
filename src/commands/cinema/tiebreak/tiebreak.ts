import { PollVote } from './../../../schemas/poll-vote';
import { VotingStatus } from './../../../constants/enums/VotingStatus';
import {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
import { DB, Poll } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { truncateText } from '../../../utils/formatter';
import { MovieVote } from '../poll/close';
import { voteCollector } from './voteCollector';

const getConfirmButtonRow = () => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('confirm')
      .setEmoji('✅')
      .setLabel(MSG.pollTiebreakConfirmButton)
      .setStyle(ButtonStyle.Success),
  );
};

const getMoviesSelectionMenu = (tiedMovies: PollVote[]) => {
  const actionRow: ActionRowBuilder<StringSelectMenuBuilder>[] = [];
  const selectMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('vote')
      .setPlaceholder(MSG.pollPickPrompt)
      .addOptions(
        tiedMovies.map((movieVote) => ({
          label: movieVote.movie,
          value: movieVote.movie,
        })),
      ),
  );
  actionRow.push(selectMenu);
  return actionRow;
};

export const tiebreakVoting = async (interaction: ExtendedInteraction, poll: Poll) => {
  const tiedMovies = await DB.pollVote.find({
    poll: poll.pollId,
    votingIndex: VotingStatus.TIEBREAK,
  });

  await interaction.editReply({
    content: MSG.pollTiedFinishPrompt.parseArgs(` 0 votos`),
    components: [getConfirmButtonRow()],
  });

  const tiebreakMessage = await interaction.channel.send({
    content: MSG.pollTiedVotingPrompt,
    components: getMoviesSelectionMenu(tiedMovies),
  });

  voteCollector(interaction, poll, tiedMovies, tiebreakMessage);
};
