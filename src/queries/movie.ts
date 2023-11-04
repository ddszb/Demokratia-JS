import { MovieStatus } from './../constants/enums/MovieStatus';
import { DB, Movie } from '../schemas';

export const getMoviesByStatus = async (guildId: string, ...status: MovieStatus[]) => {
  return await DB.movie.find({
    guildId,
    status: { $in: status },
  });
};


export const getAllMovies = async (guildId: string ) => {
  return await DB.movie.find({
    guildId,
  });
};

/**
 * Return the last movie watched that was not from an extra session
 * @param guildId The guild id
 */
export const getLastScheduledMovie = async (guildId: string): Promise<Movie | null> => {
  const movie: Movie[] = await DB.movie
    .find({
      guildId: guildId,
      status: MovieStatus.WATCHED,
      extraSession: false,
    })
    .sort({ sessionDate: 'desc' })
    .limit(1);
  if (movie) {
    return movie[0];
  }
  return null;
};
