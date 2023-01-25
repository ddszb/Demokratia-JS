import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  roleMention,
} from 'discord.js';
import { MovieStatus } from '../../../constants/enums/MovieStatus';
import { DB, Movie } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { movieRatingEmbed } from '../../../utils/embedCreator';
import { calculateExp, calculateRank } from '../../../utils/expCalcs';

const buttonDisabledTimeSeconds = 30;
const collectorIntervalSeconds = 300;

const getInteractionButtonRow = (disabled: boolean) => {
  const buttonLabel = disabled
    ? MSG.movieRatingButtonDisabled.parseArgs(buttonDisabledTimeSeconds)
    : MSG.movieRatingButtonEnabled;
  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('close')
      .setLabel(buttonLabel)
      .setEmoji(disabled ? '🔒' : '✅')
      .setDisabled(disabled)
      .setStyle(ButtonStyle.Primary),
  );
  return buttonRow;
};

const closeRating = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
  movie: Movie,
) => {
  const votes = await DB.movieScore
    .find({
      movieId: movie.uuid,
    })
    .sort({ score: -1 });
  if (votes.length === 0) {
    const message = await interaction.channel.messages.fetch(movie.rateMessageId);
    movie.status = MovieStatus.NOT_WATCHED;
    movie.rateMessageId = undefined;
    await DB.movie.updateOne({ uuid: movie.uuid }, movie);
    if (message) {
      message.edit({
        content: MSG.movieRatingNoVotesReceived.parseArgs(movie.name),
        components: [],
      });
    }
    try {
      await interaction.deleteReply();
    } catch (error) {
      return;
    }
    return;
  }

  const score = votes.map((v) => v.score).reduce((a, b) => a + b) / votes.length;
  movie.score = score;
  let expEarned = calculateExp(score);
  let movedRanks = false;

  movie.status = MovieStatus.WATCHED;
  await DB.movie.updateOne({ uuid: movie.uuid }, movie);

  let winnerUser = await DB.member.findOne({
    guildId: movie.guildId,
    userId: movie.userId,
  });
  if (winnerUser !== null) {
    let currentRank = calculateRank(winnerUser.exp);
    let exp = winnerUser.exp + expEarned;
    movedRanks = calculateRank(exp) !== currentRank;
    DB.member.updateOne({ guildId: movie.guildId, userId: movie.userId }, { exp: exp });
  }

  const membersRole = await DB.role.findOne({
    guildId: interaction.guild.id,
  });

  const embed = movieRatingEmbed(movie, votes, Math.round(expEarned), movedRanks);

  await interaction.deleteReply();
  await interaction.channel.send({
    content: membersRole ? roleMention(membersRole.roleId) : '',
    embeds: [embed],
  });
};

export const startCloseRatingCollector = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
  movie: Movie,
) => {
  interaction.editReply({
    content: MSG.movieRatingStarted.parseArgs(buttonDisabledTimeSeconds),
    components: [getInteractionButtonRow(true)],
  });
  setTimeout(
    () =>
      interaction.editReply({
        content: MSG.movieRatingStarted.parseArgs(buttonDisabledTimeSeconds),
        components: [getInteractionButtonRow(false)],
      }),
    buttonDisabledTimeSeconds * 1000,
  );

  let collector = interaction.channel.createMessageComponentCollector({
    time: collectorIntervalSeconds * 1000,
  });

  collector.on('collect', async (buttonInteraction) => {
    if (buttonInteraction.customId === 'close') {
      closeRating(interaction, movie);
    }
  });

  collector.on('end', async () => closeRating(interaction, movie));
};
