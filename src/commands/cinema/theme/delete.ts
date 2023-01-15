import { ChatInputCommandInteraction } from 'discord.js';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';

export const deleteTheme = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  let name = interaction.options.getString('nome')!;
  const theme = await DB.theme.findOne({
    name: { $regex: name, $options: 'i' },
    guildId: interaction.guild.id,
  });
  if (!theme) {
    await interaction.editReply({ content: MSG.themeNotFound.parseArgs(name) });
    return;
  }
  await DB.theme.findOneAndDelete({ name: theme.name, guildId: interaction.guild.id });
  interaction.deleteReply();
  await interaction.channel.send({
    content: MSG.themeDeleted.parseArgs(name),
  });
};
