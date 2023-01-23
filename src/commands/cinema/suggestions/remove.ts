import { PollStatus } from './../../../constants/enums/PollStatus';
import { getUserSuggestions } from './../../../queries/poll';
import { verifyActivePoll } from './../../../queries';
import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  StringSelectMenuBuilder,
} from 'discord.js';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { DB, PollSuggestion } from '../../../schemas';

let suggestions: PollSuggestion[] = [];

const collectorIntervalSeconds = 60 * 1000;

const getMenuActionRowBuilder = (suggestions: PollSuggestion[]) => {
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select')
      .setPlaceholder(MSG.suggestionRemovePlaceholder)
      .setMaxValues(suggestions.length)
      .addOptions(
        suggestions.map((s) => {
          return {
            label: s.movie,
            value: s.messageId,
          };
        }),
      ),
  );
  return row;
};

export const removeSuggestion = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const activePoll = await verifyActivePoll(interaction);
  if (!activePoll) {
    interaction.editReply(MSG.pollNoneOpened);
    return;
  }
  if (activePoll.status === PollStatus.VOTING) {
    interaction.editReply(MSG.pollStartedCantSuggest);
    return;
  }

  suggestions = await getUserSuggestions(interaction, activePoll.pollId);

  if (suggestions.length === 0) {
    await interaction.editReply({
      content: MSG.suggestionsNoneSuggested,
    });
    return;
  }

  interaction.editReply({
    content: MSG.suggestionRemovePrompt,
    components: [getMenuActionRowBuilder(suggestions)],
  });

  let collector = interaction.channel.createMessageComponentCollector({
    time: collectorIntervalSeconds,
  });

  collector.on('collect', async (menuInteraction) => {
    if (!menuInteraction.deferred) {
      await menuInteraction.deferUpdate();
    }
    if (!menuInteraction.isStringSelectMenu()) return;
    let removedSuggestions = suggestions.filter((s) =>
      menuInteraction.values.includes(s.messageId),
    );
    await DB.pollSuggestion.deleteMany({
      pollId: activePoll.pollId,
      movie: { $in: removedSuggestions.map((s) => s.movie) },
      userId: interaction.user.id,
    });
    for (const removedSuggestion of removedSuggestions) {
      if (removedSuggestion.messageId) {
        interaction.channel.messages
          .fetch(removedSuggestion.messageId)
          .then((message) => message.delete())
          .catch(console.error);
      }
    }
    suggestions = await getUserSuggestions(interaction, activePoll.pollId);
    if (suggestions.length > 0) {
      interaction.editReply({
        content: MSG.suggestionsRemovedSuccess + '\n' + MSG.suggestionRemovePrompt,
        components: [getMenuActionRowBuilder(suggestions)],
      });
    } else {
      interaction.editReply({
        content: MSG.suggestionsRemovedSuccess,
        components: [],
      });
      return;
    }
  });

  collector.on('end', async () => {
    await interaction.editReply({
      content: MSG.timeout,
      components: [],
    });
  });
};
