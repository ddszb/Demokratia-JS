import { listSuggestions } from './list';
import { ApplicationCommandOptionType } from 'discord.js';
import MSG from '../../../strings';
import { Command } from '../../../structures/Command';
import { removeSuggestion } from './remove';

export default new Command({
  name: 'indicacoes',
  silent: true,
  description: MSG.suggestionDescription,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'lista',
      description: MSG.suggestionListDescription,
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'remover',
      description: MSG.suggestionRemoveDescription,
    },
  ],
  callback: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    const subCommand = interaction.options.getSubcommand();
    switch (subCommand) {
      case 'lista':
        listSuggestions(interaction);
        break;
      case 'remover':
        removeSuggestion(interaction);
        break;
    }
  },
});
