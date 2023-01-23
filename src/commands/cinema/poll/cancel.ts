import {
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} from 'discord.js';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from './../../../typings/command';

export const cancelPoll = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const poll = await DB.poll.findOne({
    status: { $in: [PollStatus.ACTIVE, PollStatus.VOTING] },
    guildId: interaction.guild.id,
  });
  if (!poll) {
    await interaction.editReply({
      content: MSG.pollNoneToCancel,
    });
    return;
  }
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder()
      .setCustomId('cancel')
      .setEmoji('✖')
      .setLabel('Cancelar')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('confirm')
      .setEmoji('✔')
      .setLabel('Confirmar')
      .setStyle(ButtonStyle.Primary),
  ]);
  await interaction.editReply({
    content: MSG.pollCancelPrompt.parseArgs(poll.theme),
    components: [row],
  });

  let collector = interaction.channel.createMessageComponentCollector({
    time: 60 * 1000,
  });

  collector.on('collect', async (btnInt) => {
    if (!btnInt.deferred) {
      await btnInt.deferUpdate();
    }
    if (btnInt.customId === 'confirm') {
      await DB.poll.updateOne(
        { pollId: poll.pollId, guildId: poll.guildId },
        { status: PollStatus.CANCELED },
      );
      await interaction.editReply({
        content: MSG.pollCancelledSuccess.parseArgs(poll.theme),
        components: [],
      });
      return;
    }
    await interaction.deleteReply();
  });
};
