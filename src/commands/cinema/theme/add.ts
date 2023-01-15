import { ExtendedInteraction } from './../../../typings/command';
import { ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { DB } from '../../../schemas';
import { Theme } from '../../../schemas/';
import MSG from '../../../strings';

export const addTheme = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  interaction.deleteReply();

  let name = interaction.options.getString('nome')!;
  let repeating = false;
  // If theme name ends with *, it's a repeating theme
  if (name.endsWith('*')) {
    repeating = true;
    name = name.replace('*', '');
  }
  const newTheme: Theme = {
    guildId: interaction.guild.id,
    name: name!,
    occurrences: 0,
    repeating: repeating,
    userId: interaction.user.id,
  };
  // upserts the theme
  await DB.theme.updateOne(
    { name: { $regex: name, $options: 'i' }, guildId: interaction.guild.id },
    newTheme,
    {
      upsert: true,
    },
  );
  await interaction.channel.send({
    content: MSG.themeAdded.parseArgs(
      interaction.member.id,
      name,
      repeating ? ' recorrentes' : '',
    ),
  });
};
