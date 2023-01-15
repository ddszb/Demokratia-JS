import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Interaction,
} from 'discord.js';
import { DB, Poll } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from './../../../typings/command';
import { createNewTheme } from './create';
export const changeThemeCallback = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
  poll: Poll,
) => {
  const filter = (btnInt: Interaction) => {
    return interaction.user.id === btnInt.user.id;
  };
  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 180 * 1000,
  });

  // Button interaction collector
  collector.on('collect', async (i: ButtonInteraction) => {
    if (i.customId === 'cancel') {
      await interaction.deleteReply();
    } else if (i.customId === 'confirm') {
      const name = interaction.options.getString('nome')!;
      const newTheme = await createNewTheme(
        name,
        interaction.guild.id,
        interaction.user.id,
      );
      if (poll.messageId) {
        const message = await interaction.channel.messages.fetch(poll.messageId!);
        const originalEmbed = message.embeds[0];
        const editedEmbed = EmbedBuilder.from(originalEmbed).setDescription(
          MSG.pollVoteEmbedDescription.parseArgs(newTheme.name),
        );
        await message.edit({ embeds: [editedEmbed] });
      }
      await DB.poll.updateOne(
        { pollId: poll.pollId, guildId: poll.guildId },
        { theme: newTheme.name },
      );
      await interaction.editReply({
        content: MSG.themeSetUser.parseArgs(i.user.id, newTheme.name),
        components: [],
      });
    }
  });

  // On time or max limit reached, this callback is called
  collector.on('end', async () => {
    await interaction.editReply({
      embeds: [],
      content: MSG.timeout,
      components: [],
    });
  });
};
