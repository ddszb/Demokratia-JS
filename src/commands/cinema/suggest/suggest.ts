import { verifyActivePoll } from './../../../queries/poll';
import { ChatInputCommandInteraction } from 'discord.js';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';

export const sendSuggestion = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
  userId?: string,
) => {
  let overwriteUser = !!userId;
  userId = userId || interaction.user.id;
  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ ephemeral: true });
  }
  // Checks if there's an active poll:
  const activePoll = await verifyActivePoll(interaction);
  if (!activePoll) {
    interaction.editReply(MSG.pollNoneOpened);
    return;
  }

  if (activePoll.status === PollStatus.VOTING) {
    await interaction.editReply({
      content: MSG.pollStartedCantSuggest,
    });
    return;
  }
  let movie = interaction.options.getString('filme');
  let featMessage = interaction.options.getString('feat');
  let messageContent = overwriteUser
    ? MSG.clubPollUserSuggested.parseArgs(userId, movie, interaction.user.id)
    : MSG.pollUserSuggested.parseArgs(userId, movie);
  const message = await interaction.channel.send({
    content: messageContent,
  });
  await DB.pollSuggestion.create({
    pollId: activePoll.pollId,
    guildId: interaction.guild.id,
    userId: userId,
    messageId: message.id,
    movie,
    date: new Date(),
    winningText: featMessage,
  });
  await interaction.deleteReply();
};
