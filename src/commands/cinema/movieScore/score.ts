import { ChatInputCommandInteraction, EmbedBuilder, userMention } from 'discord.js';
import { MovieStatus } from '../../../constants/enums/MovieStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';

export const sendScore = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
  userId?: string,
) => {
  userId = userId || interaction.user.id;

  const movie = await DB.movie.findOne({
    guildId: interaction.guild.id,
    status: MovieStatus.WAITING_SCORE,
  });
  if (!movie) {
    interaction.editReply({ content: MSG.movieRatingMovieNotFound });
    return;
  }
  const score = interaction.options.getInteger('valor');

  const res = await DB.movieScore.updateOne(
    { guildId: interaction.guild.id, userId, movieId: movie.uuid },
    { score: score },
    { upsert: true },
  );
  if (movie.rateMessageId && res.upsertedCount) {
    try {
      const message = await interaction.channel.messages.fetch(movie.rateMessageId);
      if (message && message.embeds.length > 0) {
        const movieScores = await DB.movieScore.find({ movieId: movie.uuid });
        const userVotesText = movieScores
          .map((userVote) => MSG.scoreUserSentEmbed.parseArgs(userVote.userId))
          .join('');
        let originalEmbed = message.embeds[0];
        const embed = EmbedBuilder.from(originalEmbed)
          .setFields({ name: MSG.empty, value: userVotesText })
          .setFooter({
            text: MSG.movieRatingEmbedFooter.parseArgs(movieScores.length),
          });

        await message.edit({
          embeds: [embed],
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  await interaction.editReply({
    content: MSG.scoreSent.parseArgs(movie.name, score),
  });
};
