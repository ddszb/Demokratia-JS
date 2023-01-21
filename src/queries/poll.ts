import { ExtendedInteraction } from './../typings/command';
import { ChatInputCommandInteraction } from 'discord.js';
import { PollStatus } from '../constants/enums/PollStatus';
import { Poll, DB } from '../schemas';
/**
 * Checks for an active poll
 * @param interaction The command interaction
 * @returns The active poll, if found, or an empty query result.
 */
export const verifyActivePoll = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
): Promise<Poll> => {
  const activePoll = await DB.poll.findOne({
    status: { $in: [PollStatus.ACTIVE, PollStatus.VOTING] },
    guildId: interaction.guild.id,
  });
  return activePoll;
};

/**
 * Get the interacting user movie suggestions for a certain poll
 * @param interaction The application interaction
 * @param pollId The poll id.
 * @returns The list of movie suggestions of that user, if any,
 * or an empty query result.
 */
export const getUserSuggestions = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
  pollId: string,
) => {
  const suggestions = await DB.pollSuggestion
    .find({
      guildId: interaction.guild.id,
      pollId: pollId,
      userId: interaction.user.id,
    })
    .sort('movie');
  return suggestions;
};
