import { ChatInputCommandInteraction } from 'discord.js';
import { MovieStatus } from '../../../constants/enums/MovieStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { movieRatePromptEmbed } from '../../../utils/embedCreator';
import { startCloseRatingCollector } from './close';

export const startRating = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const movieUuid = interaction.options.getString('filme');
  const movie = await DB.movie.findOne({ uuid: movieUuid });
  if (!movie) {
    await interaction.editReply(MSG.movieRatingMovieNotFound);
    return;
  }
  if (movie.status === MovieStatus.WAITING_SCORE) {
    await interaction.editReply(MSG.movieRatingMovieWaitingScore.parseArgs(movie.name));
    return;
  }

  const embed = movieRatePromptEmbed(movie, interaction.member.displayName);
  const message = await interaction.channel.send({
    embeds: [embed],
  });

  movie.status = MovieStatus.WAITING_SCORE;
  movie.rateMessageId = message.id;
  await DB.movie.updateOne(
    {
      uuid: movieUuid,
      guildId: interaction.guild.id,
    },
    movie,
  );
  startCloseRatingCollector(interaction, movie);
};
