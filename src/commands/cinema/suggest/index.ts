import { ApplicationCommandOptionType } from 'discord.js';
import MSG from '../../../strings';
import { Command } from '../../../structures/Command';
import { sendSuggestion } from './suggest';

export default new Command({
  name: 'indicar',
  description: MSG.pollSuggestionDescription,
  silent: true,
  options: [
    {
      name: 'filme',
      type: ApplicationCommandOptionType.String,
      description: MSG.sessionMovieDescription,
      required: true,
    },
    {
      name: 'feat',
      type: ApplicationCommandOptionType.String,
      description: MSG.suggestionFeatDescription,
      required: false,
    },
  ],
  callback: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    sendSuggestion(interaction);
  },
});
