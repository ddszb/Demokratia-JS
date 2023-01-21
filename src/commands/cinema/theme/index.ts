import { ApplicationCommandOptionType } from 'discord.js';
import MSG from '../../../strings';
import { Command } from '../../../structures/Command';
import { addTheme } from './add';
import { deleteTheme } from './delete';
import { listTheme } from './list';
import { rollTheme } from './roll';
import { setTheme } from './set';

export default new Command({
  name: 'tema',
  description: 'Comandos relacionados a temas',
  silent: false,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'lista',
      description: MSG.themeListDescription,
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'add',
      description: MSG.themeAddDescription,
      options: [
        {
          name: 'nome',
          type: ApplicationCommandOptionType.String,
          description: MSG.themeNamePrompt,
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'roll',
      description: MSG.themeRollDescription,
      options: [
        {
          name: 'votos',
          type: ApplicationCommandOptionType.Integer,
          description: MSG.themeRollOptionsDescription,
          required: true,
          minValue: 1,
          maxValue: 10,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'del',
      description: MSG.themeDelDescription,
      options: [
        {
          name: 'nome',
          type: ApplicationCommandOptionType.String,
          description: MSG.themeNamePrompt,
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'set',
      description: MSG.themeSetDescription,
      options: [
        {
          name: 'nome',
          type: ApplicationCommandOptionType.String,
          description: MSG.themeNamePrompt,
          required: true,
        },
      ],
    },
  ],
  callback: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    // Get the subCommand, check if guild exists and send a temp message
    const subCommand = interaction.options.getSubcommand();
    switch (subCommand) {
      case 'add':
        addTheme(interaction);
        break;
      case 'lista':
        listTheme(interaction);
        break;
      case 'del':
        deleteTheme(interaction);
        break;
      case 'set':
        setTheme(interaction);
        break;
      case 'roll':
        rollTheme(interaction);
        break;
    }
  },
});
