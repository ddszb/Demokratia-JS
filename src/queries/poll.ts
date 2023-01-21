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
