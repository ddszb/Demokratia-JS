import { MovieStatus } from './../constants/enums/MovieStatus';
import { DB } from '../schemas';

export const getMoviesByStatus = async (guildId: string, ...status: MovieStatus[]) => {
  return await DB.movie.find({
    guildId,
    status: { $in: status },
  });
};
