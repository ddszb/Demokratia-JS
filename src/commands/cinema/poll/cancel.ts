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
    status: { $in: [PollStatus.ACTIVE, PollStatus.VOTING, PollStatus.TIE_BREAK] },
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
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('confirm')
      .setEmoji('✔')
      .setLabel('Confirmar')
      .setStyle(ButtonStyle.Success),
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
      await DB.pollSuggestion.deleteMany({ pollId: poll.pollId, guildId: poll.guildId });
      await DB.pollVote.deleteMany({ pollId: poll.pollId, guildId: poll.guildId });
      await interaction.editReply({
        content: MSG.pollCancelledSuccess.parseArgs(poll.theme),
        components: [],
      });
      return;
    }
    await interaction.deleteReply();
  });
};
