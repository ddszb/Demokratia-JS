import { startRating } from './start';
import { ApplicationCommandOptionType } from 'discord.js';
import MSG from '../../../strings';
import { Command } from './../../../structures/Command';

import { movieAutocomplete } from './autocomplete';
import { closeRating } from './close';

export default new Command({
  name: 'avaliação',
  description: MSG.scoreDescription,
  silent: true,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'iniciar',
      description: MSG.scoreEvaluationDescription,
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'filme',
          description: MSG.movieRatingMovieName,
          autocomplete: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'fechar',
      description: MSG.scoreEvaluationDescription,
    },
  ],
  callback: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    const subCommand = interaction.options.getSubcommand();
    if (subCommand == 'iniciar') {
      startRating(interaction);
    } else if (subCommand == 'fechar') {
      closeRating(interaction);
    }
  },
  autoComplete: movieAutocomplete,
});
