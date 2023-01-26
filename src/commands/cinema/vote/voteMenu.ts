import { verifyActivePoll, verifyVotingPoll } from './../../../queries/poll';
import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  SelectMenuComponentOptionData,
  StringSelectMenuBuilder,
  EmbedBuilder,
} from 'discord.js';
import { ExtendedInteraction } from '../../../typings/command';
import MSG from '../../../strings';
import { DB } from '../../../schemas';
import { PollStatus } from '../../../constants/enums/PollStatus';

const VOTES_LIMIT_THRESHOLD = 4;
const MAX_OPTIONS_OVER_LIMIT = 3;
const MAX_OPTIONS_UNDER_LIMIT = 2;
const MIN_OPTIONS_OVER_LIMIT = 2;
const MIN_OPTIONS_UNDER_LIMIT = 1;
const collectorIntervalSeconds = 600;

const getMenuActionRowBuilder = (options: SelectMenuComponentOptionData[]) => {
  const maxVotes =
    options.length > VOTES_LIMIT_THRESHOLD
      ? MAX_OPTIONS_OVER_LIMIT
      : MAX_OPTIONS_UNDER_LIMIT;
  const minVotes =
    options.length > VOTES_LIMIT_THRESHOLD
      ? MIN_OPTIONS_OVER_LIMIT
      : MIN_OPTIONS_UNDER_LIMIT;

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('vote')
      .setMaxValues(maxVotes)
      .setMinValues(minVotes)
      .setPlaceholder(MSG.pollPickPrompt)
      .addOptions(options),
  );
  return row;
};

export const openVotingMenu = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const votingPoll = await verifyVotingPoll(interaction);
  if (!votingPoll) {
    interaction.editReply(MSG.pollNoneToVote);
    return;
  }
  const userVotes = await DB.pollVote.find({
    guildId: interaction.guild.id,
    userId: interaction.user.id,
    pollId: votingPoll.pollId,
    votingIndex: 0,
  });

  if (userVotes.length > 0) {
    await interaction.editReply({
      content: MSG.pollUserAlreadyVoted.parseArgs(
        userVotes.map((u) => u.movie).join(', '),
      ),
    });
    return;
  }

  const suggestions = await DB.pollSuggestion.find({
    pollId: votingPoll.pollId,
    guildId: interaction.guild.id,
    votingIndex: 0,
  });

  if (suggestions.length === 0) {
    interaction.editReply({
      content: MSG.pollNoSuggestionsReceived.parseArgs(votingPoll.theme),
    });
    return;
  }
  // Filter suggestions made by other users, because the user can't vote for their own suggestions
  const options = suggestions
    .filter((s) => s.userId !== interaction.user.id)
    .map((suggestion) => {
      return {
        label: suggestion.movie,
        value: suggestion.movie,
      };
    });

  if (options.length <= 1) {
    interaction.editReply({
      content: MSG.pollNotEnoughOptions,
    });
    return;
  }

  await interaction.editReply({
    components: [getMenuActionRowBuilder(options)],
    content: MSG.votingMenuPrompt,
  });

  const collector = interaction.channel.createMessageComponentCollector({
    time: collectorIntervalSeconds * 1000,
  });

  const votes: string[] = [];
  // Collector to grab user votes
  collector.on('collect', async (menuInteraction) => {
    if (!menuInteraction.isStringSelectMenu()) return;

    const poll = await DB.poll.findOne({
      status: PollStatus.VOTING,
      guildId: interaction.guild.id,
    });
    if (!poll) {
      interaction.editReply(MSG.votingNoPollAvailable);
      return;
    }
    const { values, user } = menuInteraction;
    for (const movie of values) {
      votes.push(movie);
      await DB.pollVote.create({
        pollId: poll.pollId,
        guildId: poll.guildId,
        userId: user.id,
        date: new Date(),
        movie,
        votingIndex: 0,
      });
    }

    await menuInteraction.update({
      content: MSG.votingSuccess.parseArgs(votes.join(', ')),
      components: [],
    });

    const currentVotes = await DB.pollVote.find({
      guildId: interaction.guild.id,
      pollId: poll.pollId,
    });
    const numVotes = [...new Set(currentVotes.map((c) => c.userId))].length;
    const pollMessage = await interaction.channel.messages.fetch(poll.messageId!);
    const originalEmbed = pollMessage.embeds[0];
    let votesSent = originalEmbed.fields.pop()!;
    votesSent.value = votesSent.value.concat(
      '\n✅<@{0}>'.parseArgs(menuInteraction.user.id),
    );
    const editedEmbed = EmbedBuilder.from(originalEmbed)
      .addFields(votesSent)
      .setFooter({ text: MSG.pollVotingEmbedFooter.parseArgs(numVotes) });
    pollMessage.edit({
      embeds: [editedEmbed],
    });
  });
};
