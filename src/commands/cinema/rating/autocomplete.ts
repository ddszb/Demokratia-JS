import { AutocompleteInteraction } from 'discord.js';
import { MovieStatus } from '../../../constants/enums/MovieStatus';
import { getMoviesByStatus } from '../../../queries';

export const movieAutocomplete = async (interaction: AutocompleteInteraction) => {
  const searchText = interaction.options.getFocused(true);
  const moviesWaitingScore = await getMoviesByStatus(
    interaction.guild.id,
    MovieStatus.WAITING_SCORE,
  );
  const moviesNotWatched = await getMoviesByStatus(
    interaction.guild.id,
    MovieStatus.NOT_WATCHED,
  );
  let filtered = [];
  if (moviesWaitingScore.length > 0) {
    filtered = moviesWaitingScore.filter((movie) =>
      movie.name.toLowerCase().startsWith(searchText.value.toLowerCase()),
    );
  } else {
    filtered = moviesNotWatched.filter((movie) =>
      movie.name.toLowerCase().startsWith(searchText.value.toLowerCase()),
    );
  }
  await interaction.respond(
    filtered.map((moviesToRate) => ({
      name: moviesToRate.name,
      value: moviesToRate.uuid,
    })),
  );
};
