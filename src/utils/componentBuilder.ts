import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const newConfirmationButtonRow = (confirmId: string, cancelId: string) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder()
      .setCustomId(cancelId)
      .setEmoji('✖')
      .setLabel('Cancelar')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(confirmId)
      .setEmoji('✔')
      .setLabel('Confirmar')
      .setStyle(ButtonStyle.Success),
  ]);

  return row;
};
