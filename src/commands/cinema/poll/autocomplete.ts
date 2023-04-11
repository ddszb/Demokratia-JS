import { AutocompleteInteraction } from 'discord.js';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { DB, PollSuggestion } from '../../../schemas';

export const setWinnerAutoComplete = async (interaction: AutocompleteInteraction) => {
  const searchText = interaction.options.getFocused(true);
  const poll = await DB.poll.findOne({
    status: { $in: [PollStatus.ACTIVE, PollStatus.VOTING, PollStatus.TIE_BREAK] },
    guildId: interaction.guild.id,
  });

  const suggestions: PollSuggestion[] = await DB.pollSuggestion
    .find({
      pollId: poll.pollId,
      guildId: interaction.guild.id,
    })
    .sort('movie');
  let filtered = [];

  filtered = suggestions.filter((suggestion) =>
    suggestion.movie.toLowerCase().startsWith(searchText.value.toLowerCase()),
  );

  await interaction.respond(
    filtered.map((suggestions) => ({
      name: suggestions.movie,
      value: suggestions.movie,
    })),
  );
};
