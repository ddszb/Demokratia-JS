import { ChatInputCommandInteraction, EmbedBuilder, userMention } from 'discord.js';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { getMovieScoreImage } from '../../../utils/imageCreator';

export const movieInfo = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
  userId?: string,
) => {
  userId = userId || interaction.user.id;
  const movieUuid = interaction.options.getString('info');
  const movie = await DB.movie.findOne({
    guildId: interaction.guild.id,
    uuid: movieUuid
  });
  
  if (!movie) {
    await interaction.editReply({ content: MSG.movieRatingMovieNotFound });
    return;
  }  
  const image = await getMovieScoreImage(movie);
  
  await interaction.editReply({
    files: [image]
  });
};
