import MSG from '../../../strings';
import { Command } from '../../../structures/Command';
import { openVotingMenu } from './voteMenu';
export default new Command({
  name: 'votar',
  description: MSG.voteDescription,
  silent: true,
  callback: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    openVotingMenu(interaction);
  },
});
