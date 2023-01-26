import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
} from 'discord.js';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { themeCreatedEmbed, themeRollEmbed } from '../../../utils/embedCreator';
import { createPoll } from '../poll/create';
import { createNewTheme } from './create';

export const rollTheme = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  let confirms = new Set<string>();
  let rerolls = new Set<string>();
  const totalVotes = interaction.options.getInteger('votos')!;
  const VOTES_NEEDED = Math.ceil(totalVotes / 2) + (totalVotes % 2 === 0 ? 1 : 0);
  const getButtonsRow = () =>
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('re-roll')
        .setEmoji('🔄')
        .setLabel(MSG.themeReRollCounter.parseArgs(rerolls.size, VOTES_NEEDED))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('set')
        .setEmoji('✅')
        .setLabel(MSG.themeConfirmCounter.parseArgs(confirms.size, VOTES_NEEDED))
        .setStyle(ButtonStyle.Success),
    );

  const activePoll = await DB.poll.findOne({
    guildId: interaction.guild.id,
    status: PollStatus.ACTIVE,
  });
  if (activePoll) {
    await interaction.editReply({
      content: MSG.themeActiveError.parseArgs(activePoll.theme),
    });
    return;
  }
  const themes = await DB.theme.find({ guildId: interaction.guild.id });
  const remainingThemes = themes.filter((t) => t.repeating || t.occurrences === 0);

  if (remainingThemes.length === 0) {
    await interaction.editReply({
      content: MSG.themeNoThemesLeft,
    });
  }

  let selected = remainingThemes[Math.floor(Math.random() * remainingThemes.length)];

  const embed = themeRollEmbed(selected, VOTES_NEEDED);
  await interaction.editReply({
    embeds: [embed],
    components: [getButtonsRow()],
  });

  // Button interaction collector
  const collector = interaction.channel.createMessageComponentCollector();

  collector.on('collect', async (i: ButtonInteraction) => {
    if (i.customId === 're-roll') {
      rerolls.add(i.user.id);
      confirms.delete(i.user.id);
    } else if (i.customId === 'set') {
      confirms.add(i.user.id);
      rerolls.delete(i.user.id);
    }

    if (!interaction.deferred) {
      await interaction.deferReply();
    }
    if (
      (rerolls.size + confirms.size >= totalVotes && rerolls.size === confirms.size) ||
      rerolls.size >= VOTES_NEEDED
    ) {
      rerolls = new Set<string>();
      confirms = new Set<string>();

      selected = remainingThemes[Math.floor(Math.random() * remainingThemes.length)];
      await i.update({
        embeds: [themeRollEmbed(selected, VOTES_NEEDED)],
        components: [getButtonsRow()],
      });
    } else if (confirms.size >= VOTES_NEEDED) {
      const newTheme = await createNewTheme(
        selected.name,
        interaction.channel.guildId,
        i.user.id,
      );
      await createPoll(newTheme, interaction.guild.id);
      await interaction.editReply({
        embeds: [themeCreatedEmbed(newTheme.name)],
        content: MSG.empty,
        components: [],
      });
    } else {
      i.update({
        embeds: [themeRollEmbed(selected, VOTES_NEEDED)],
        components: [getButtonsRow()],
      });
    }
  });
};
