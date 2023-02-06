import { ChatInputCommandInteraction, Colors } from 'discord.js';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { Paginator } from '../../../utils/paginator';

export const listTheme = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const themes = await DB.theme.find({ guildId: interaction.guild.id }).sort('name');

  const themesRemaining = themes.filter((t) => t.repeating || t.occurrences === 0);
  if (themesRemaining.length === 0) {
    interaction.editReply(MSG.themeNoThemesLeft);
    return;
  }

  const items = themesRemaining.map((theme) => ({
    label: `**${theme.name}** ${theme.repeating ? `⭯ (${theme.occurrences})` : ''}`,
  }));
  const paginator = new Paginator(
    MSG.themesLeftTitle,
    false,
    items,
    15,
    undefined,
    undefined,
    Colors.Gold,
    true,
  );

  interaction.editReply(paginator.getReply());

  let listCollector = interaction.channel.createMessageComponentCollector();

  listCollector.on('collect', async (btnInt) => {
    paginator.onPageChange(btnInt);
    interaction.editReply(paginator.getReply());
  });
};
