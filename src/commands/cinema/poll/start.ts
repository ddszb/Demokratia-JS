import {
  ChatInputCommandInteraction,
  Colors,
  EmbedField,
  EmbedBuilder,
} from 'discord.js';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { startClosePollCollector } from './close';

export const startPoll = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  // Checks for active poll
  const poll = await DB.poll.findOne({
    status: { $in: [PollStatus.ACTIVE, PollStatus.VOTING] },
    guildId: interaction.guild.id,
  });
  if (!poll) {
    await interaction.editReply({
      content: MSG.pollNoneOpened,
    });
    return;
  }

  // Checks if voting for current poll has already started
  if (poll.status === PollStatus.VOTING) {
    await interaction.editReply({
      content: MSG.pollAlreadyOpenedEditPrompt.parseArgs(poll.theme),
    });
    return;
  }

  const suggestions = await DB.pollSuggestion.find({
    pollId: poll.pollId,
    guildId: interaction.guild.id,
  });
  if (suggestions.length === 0) {
    interaction.editReply({
      content: MSG.pollNoSuggestionsReceived.parseArgs(poll.theme),
    });
    return;
  }

  const movies: EmbedField[] = suggestions
    .sort((a, b) => a.movie.localeCompare(b.movie))
    .map((suggestion, index) => {
      return {
        name: MSG.empty,
        value: MSG.pollVotingEmbedField.parseArgs(index + 1, suggestion.movie),
        inline: false,
      } as EmbedField;
    });
  movies.concat(
    {
      name: MSG.empty,
      value: MSG.empty,
      inline: false,
    },
    {
      name: MSG.votes,
      value: MSG.empty,
      inline: false,
    },
    {
      name: MSG.empty,
      value: MSG.empty,
      inline: false,
    },
  );

  const embed = new EmbedBuilder()
    .setTitle(MSG.pollVoteEmbedTitle)
    .setDescription(MSG.pollVoteEmbedDescription.parseArgs(poll.theme))
    .setFields(movies)
    .addFields({ name: MSG.empty, value: MSG.empty })
    .setColor(Colors.Yellow)
    .setFooter({ text: MSG.pollVotingEmbedFooter.parseArgs(0) });

  startClosePollCollector(interaction);

  const message = await interaction.channel.send({
    embeds: [embed],
    content: MSG.empty,
  });
  poll.messageId = message.id;
  poll.status = PollStatus.VOTING;
  await DB.poll.updateOne({ pollId: poll.pollId, guildId: interaction.guild.id }, poll);
};
