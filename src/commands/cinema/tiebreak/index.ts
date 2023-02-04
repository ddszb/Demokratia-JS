import { PollStatus } from './../../../constants/enums/PollStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { Command } from '../../../structures/Command';
import { tiebreakVoting } from './tiebreak';
import { VotingStatus } from '../../../constants/enums/VotingStatus';
import { manualSelection } from './manualSelection';

export default new Command({
  name: 'desempate',
  description: MSG.pollTieBreakDescription,
  silent: true,
  callback: async ({ interaction }) => {
    const poll = await DB.poll.findOne({
      guildId: interaction.guild.id,
      status: PollStatus.TIE_BREAK,
    });
    if (!poll) {
      await interaction.editReply(MSG.pollNoDraws);
      return;
    }

    const pollVotes = await DB.pollVote.find({
      guildId: interaction.guild.id,
      pollId: poll.pollId,
    });

    const twiceTiedMovies = pollVotes.filter(
      (vote) => vote.votingIndex === VotingStatus.MANUAL_SELECTION,
    );
    if (twiceTiedMovies.length > 0) {
      manualSelection(interaction, poll, twiceTiedMovies);
    } else {
      tiebreakVoting(interaction, poll);
    }
  },
});
