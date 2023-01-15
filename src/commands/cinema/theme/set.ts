import { ExtendedInteraction } from './../../../typings/command';
import {
  ActionRowBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ButtonBuilder,
} from 'discord.js';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { themeCreatedEmbed } from '../../../utils/embedCreator';
import { createPoll } from '../poll/create';
import { changeThemeCallback } from './change';
import { createNewTheme } from './create';

export const setTheme = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const poll = await DB.poll.findOne({
    status: { $in: [PollStatus.ACTIVE, PollStatus.VOTING] },
    guildId: interaction.guild.id,
  });
  if (poll) {
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents([
      new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel(MSG.cancel)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌'),
      new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel(MSG.confirm)
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success),
    ]);

    await interaction.editReply({
      content: MSG.pollAlreadyOpenedEditPrompt.parseArgs(poll.theme),
      components: [buttons],
    });
    await changeThemeCallback(interaction, poll);
  } else {
    const themeName = interaction.options.getString('nome')!;
    let theme = await createNewTheme(
      themeName,
      interaction.guild.id,
      interaction.user.id,
    );

    await createPoll(theme, interaction.guild.id);
    await interaction.editReply({
      embeds: [themeCreatedEmbed(themeName)],
    });
  }
};
