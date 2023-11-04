import { ApplicationCommandOptionType } from 'discord.js';
import MSG from '../../../strings';
import { Command } from '../../../structures/Command';

import { movieAutocomplete } from './autocomplete';
import { movieInfo } from './info';

export default new Command({
  name: 'filme',
  description: MSG.scoreValueDescription,
  silent: false,
  options: [
    {
        type: ApplicationCommandOptionType.String,
        name: 'info',
        description: MSG.movieRatingMovieName,
        autocomplete: true,
      },
  ],
  callback: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    movieInfo(interaction);
  },
  autoComplete: movieAutocomplete
});
