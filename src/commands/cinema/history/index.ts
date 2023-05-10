import { ApplicationCommandOptionType } from 'discord.js';
import MSG from '../../../strings';
import { Command } from '../../../structures/Command';
import { movieHistory } from './movies';

export default new Command({
  name: 'historico',
  description: 'Comandos relacionados a históricos',
  silent: false,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'filmes',
      description: MSG.historyMoviesDescription,
      options: [
        {
          name: 'filtro',
          type: ApplicationCommandOptionType.String,
          description: MSG.historyMoviesFilter,
          required: true,
          choices: [
            { name: 'todos', value: 'all' },
            { name: 'meus', value: 'user' },
          ],
        },
        {
          name: 'ordenacao',
          type: ApplicationCommandOptionType.String,
          description: MSG.historyMoviesSorter,
          required: false,
          choices: [
            { name: 'nota', value: 'score' },
            { name: 'sessão', value: 'mId' },
          ],
        },
      ],
    },
  ],
  callback: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    // Get the subCommand, check if guild exists and send a temp message
    const subCommand = interaction.options.getSubcommand();
    switch (subCommand) {
      case 'filmes':
        movieHistory(interaction);
        break;
    }
  },
});
