import { ChatInputCommandInteraction, Colors, userMention } from 'discord.js';
import { MovieStatus } from '../../../constants/enums/MovieStatus';
import { Movie, DB } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { roundToFixed } from '../../../utils/formatter';
import { Paginator } from '../../../utils/paginator';
import moment from 'moment';

export const movieHistory = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const userFilter = interaction.options.getString('filtro');
  const sortingField = interaction.options.getString('ordenacao');
  const filter =
    userFilter === 'all'
      ? { guildId: interaction.guild.id, status: MovieStatus.WATCHED }
      : {
          guildId: interaction.guild.id,
          status: MovieStatus.WATCHED,
          userId: interaction.user.id,
        };
  const movies: Movie[] = await DB.movie.find(filter).sort({ mId: 'desc' });
  var items = [];
  if (sortingField && sortingField === 'score') {
    items = orderedMoviesByScore(movies, userFilter === 'all');
  } else {
    items = orderedMoviesBySession(movies, userFilter === 'all');
  }

  const paginator = new Paginator(
    MSG.historyMoviesEmbedTitle,
    false,
    items,
    5,
    undefined,
    userFilter === 'user'
      ? MSG.historyMoviesUserList.parseArgs(userMention(interaction.user.id))
      : undefined,
    Colors.Gold,
    true,
  );

  interaction.editReply(paginator.getReply());

  let collector = interaction.channel.createMessageComponentCollector();

  collector.on('collect', async (btnInt) => {
    paginator.onPageChange(btnInt);
    interaction.editReply(paginator.getReply());
  });

  collector.on('end', async () => {
    paginator.onTimeOut();
    await interaction.editReply(paginator.getReply());
  });
};

const orderedMoviesByScore = (movies: Movie[], showUser: boolean) => {
  var movieList = movies.map((movie, i) => ({
    name: movie.name,
    score: movie.score,
    legacy: movie.legacy,
    sessionDate: movie.sessionDate,
    userId: movie.userId,
    order: movies.length - i,
  }));
  return movieList
    .sort((a, b) => b.score - a.score)
    .map((movie) => {
      var extraInfo = `⭐ ${roundToFixed(movie.score, 1)}\n`;
      if (showUser) {
        extraInfo = extraInfo + `👤${userMention(movie.userId)}\n`;
      }
      if (!movie.legacy) {
        extraInfo = extraInfo + `🗓️${moment(movie.sessionDate).format('DD/MM/YY')}\n`;
      }

      return {
        label: MSG.historyMoviesFieldFormatter.parseArgs(
          movie.order,
          movie.name,
          extraInfo,
        ),
      };
    });
};

const orderedMoviesBySession = (movies: Movie[], showUser: boolean) => {
  return movies
    .sort((a, b) => b.mId - a.mId)
    .map((movie, i) => {
      var extraInfo = `⭐ ${roundToFixed(movie.score, 1)}\n`;
      if (showUser) {
        extraInfo = extraInfo + `👤${userMention(movie.userId)}\n`;
      }
      if (!movie.legacy) {
        extraInfo = extraInfo + `🗓️${moment(movie.sessionDate).format('DD/MM/YY')}\n`;
      }
      return {
        label: MSG.historyMoviesFieldFormatter.parseArgs(
          movies.length - i,
          movie.name,
          extraInfo,
        ),
      };
    });
};
