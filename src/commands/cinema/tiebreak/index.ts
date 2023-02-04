import { PollStatus } from './../../../constants/enums/PollStatus';
import { DB, Poll } from '../../../schemas';
import MSG from '../../../strings';
import { Command } from '../../../structures/Command';
import { tiebreakVoting } from './tiebreak';

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
    await tiebreakVoting(interaction, poll);
  },
});
