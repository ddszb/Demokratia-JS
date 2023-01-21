import { ApplicationCommandOptionType } from 'discord.js';
import MSG from '../../../strings';
import { Command } from '../../../structures/Command';
import { cancelPoll } from './cancel';
import { closePoll } from './close';
import { startPoll } from './start';
import { pollStatus } from './status';

export default new Command({
  name: 'enquete',
  description: MSG.pollOptionsDescription,
  silent: false,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'iniciar',
      description: MSG.pollStartDescription,
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'fechar',
      description: MSG.pollCloseDescription,
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'status',
      description: MSG.pollStatusDescription,
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'cancelar',
      description: MSG.pollCancelDescription,
    },
  ],
  callback: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    const subCommand = interaction.options.getSubcommand();
    switch (subCommand) {
      case 'iniciar':
        startPoll(interaction);
        break;
      case 'fechar':
        closePoll(interaction);
        break;
      case 'status':
        pollStatus(interaction);
        break;
      case 'cancelar':
        cancelPoll(interaction);
        break;
      default:
        pollStatus(interaction);
    }
    return;
  },
});
