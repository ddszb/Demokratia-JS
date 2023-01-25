import { startRating } from './start';
import { ApplicationCommandOptionType } from 'discord.js';
import MSG from '../../../strings';
import { Command } from './../../../structures/Command';

import { movieAutocomplete } from './autocomplete';

export default new Command({
  name: 'avaliação',
  description: MSG.scoreDescription,
  silent: true,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'filme',
      description: MSG.scoreEvaluationDescription,
      autocomplete: true,
      required: true,
    },
  ],
  callback: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    startRating(interaction);
  },
  autoComplete: movieAutocomplete,
});
