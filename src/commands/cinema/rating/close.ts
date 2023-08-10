import { getMovieScoreImage } from './../../../utils/imageCreator';
import { ChatInputCommandInteraction, roleMention } from 'discord.js';
import { MovieStatus } from '../../../constants/enums/MovieStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { movieRatingEmbed } from '../../../utils/embedCreator';
import { calculateExp, calculateRank } from '../../../utils/expCalcs';

export const closeRating = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const movie = await DB.movie.findOne({
    guildId: interaction.guild.id,
    status: MovieStatus.WAITING_SCORE,
  });

  if (!movie) await interaction.editReply({ content: MSG.movieRatingMovieNotFound });

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

  const image = await getMovieScoreImage(movie);
  let messageText = membersRole ? roleMention(membersRole.roleId) : '';
  messageText = messageText + ` 🍿 **${movie.name}** 🍿`;
  await interaction.deleteReply();
  await interaction.channel.send({
    content: membersRole ? roleMention(membersRole.roleId) : '',
    files: [image],
  });
};
