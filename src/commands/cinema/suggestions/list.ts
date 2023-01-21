import { verifyActivePoll } from './../../../queries';
import { EmbedBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, Colors } from 'discord.js';
import { DB, PollSuggestion } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';

export const listSuggestions = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const activePoll = await verifyActivePoll(interaction);
  if (!activePoll) {
    interaction.editReply(MSG.pollNoneOpened);
    return;
  }

  let suggestions: PollSuggestion[] = await DB.pollSuggestion
    .find({
      guildId: interaction.guild.id,
      pollId: activePoll.pollId,
    })
    .sort('movie');

  const userSuggestions = suggestions.filter((s) => s.userId === interaction.user.id);
  const otherSuggestions = suggestions.filter((s) => s.userId !== interaction.user.id);

  const embed = new EmbedBuilder()
    .setTitle(MSG.suggestionListTitle)
    .setDescription(MSG.suggestionListDescriptionTheme.parseArgs(activePoll.theme))
    .setColor(Colors.Red);
  const listText =
    userSuggestions.length > 0
      ? '\n' + userSuggestions.map((u) => u.movie).join('\n')
      : MSG.suggestionsNoneSuggested;
  embed.addFields({ name: MSG.suggestionsUser, value: listText });

  if (otherSuggestions.length > 0) {
    embed.addFields({
      name: MSG.suggestionOthers,
      value:
        '\n' +
        otherSuggestions
          .map((u) => `<@{0}>: **{1}**`.parseArgs(u.userId, u.movie))
          .join('\n'),
    });
  }
  embed.setFooter({
    text: MSG.suggestionTotalFooter.parseArgs(
      otherSuggestions.length + userSuggestions.length,
    ),
  });

  await interaction.editReply({
    embeds: [embed],
  });
};
