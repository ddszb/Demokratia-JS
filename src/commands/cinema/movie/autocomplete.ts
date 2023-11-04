import { AutocompleteInteraction } from 'discord.js';
import { getAllMovies } from '../../../queries/movie';

export const movieAutocomplete = async (interaction: AutocompleteInteraction) => {
  const searchText = interaction.options.getFocused(true);
  let movies = await getAllMovies(
    interaction.guild.id,
  );
  movies = movies.sort((a, b) => a.name.localeCompare(b.name));
  let filtered = [];
  if (movies.length > 0) {
    filtered = movies.filter((movie) =>
      movie.name.toLowerCase().indexOf(searchText.value.toLowerCase()) >= 0,
    ).slice(0, 25);
  }
  await interaction.respond(
    filtered.map((movie) => ({
      name: movie.name,
      value: movie.uuid,
    })),
  );
};
