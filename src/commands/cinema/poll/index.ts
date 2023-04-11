import { ApplicationCommandOptionType } from 'discord.js';
import MSG from '../../../strings';
import { Command } from '../../../structures/Command';
import { cancelPoll } from './cancel';
import { closePoll } from './close';
import { startPoll } from './start';
import { pollStatus } from './status';
import { setWinnerAutoComplete } from './autocomplete';
import { setWinnerManually } from './winner';

export default new Command({
  name: 'enquete',
  description: MSG.pollOptionsDescription,
  silent: true,
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
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'definir',
      description: MSG.pollCancelDescription,
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'vencedor',
          description: MSG.pollCancelDescription,
          autocomplete: true,
        },
      ],
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
      case 'definir':
        setWinnerManually(interaction);
        break;
    }
    return;
  },
  autoComplete: setWinnerAutoComplete,
});
