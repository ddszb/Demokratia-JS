import { EmbedBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, Colors } from 'discord.js';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';

export const pollStatus = async (interaction: ChatInputCommandInteraction) => {
  const poll = await DB.poll.findOne({
    status: { $in: [PollStatus.ACTIVE, PollStatus.VOTING, PollStatus.TIE_BREAK] },
    guildId: interaction.guild.id,
  });
  if (!poll) {
    await interaction.editReply({
      content: MSG.pollNoneOpened,
    });
    return;
  }
  const suggestions = await DB.pollSuggestion
    .find({
      pollId: poll.pollId,
      guildId: interaction.guild.id,
    })
    .sort('movie');
  const embed = new EmbedBuilder()
    .setTitle(MSG.themeNext)
    .setDescription(MSG.themeNextFormatter.parseArgs(poll.theme))
    .setColor(Colors.Gold);
  if (suggestions.length > 0) {
    embed.addFields({
      name: MSG.pollSuggestions,
      value: suggestions
        .map((u) => `<@{0}>: **{1}**`.parseArgs(u.userId, u.movie))
        .join('\n'),
    });
  } else {
    embed.addFields({
      name: MSG.empty,
      value: MSG.pollNoSuggestionsReceived.parseArgs(poll.theme),
    });
  }

  let statusText = '';
  switch (poll.status) {
    case PollStatus.ACTIVE:
      statusText = MSG.pollReceivingSuggestions;
      break;
    case PollStatus.VOTING:
      statusText = MSG.pollVotingStage;
      break;
    default:
      statusText = MSG.pollTieBreakStage;
  }
  embed.addFields({
    name: MSG.pollStatusTitle,
    value: statusText,
  });

  interaction.editReply({
    embeds: [embed],
  });
};
