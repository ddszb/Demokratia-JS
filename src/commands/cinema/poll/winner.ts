import { DB, Movie, Poll } from '../../../schemas';
import { nextWeekDay } from '../../../utils/dateFunctions';
import { MovieVote } from './close';
import { v4 as uuid } from 'uuid';
import { MovieStatus } from '../../../constants/enums/MovieStatus';

export const setWinnerMovie = async (
  poll: Poll,
  winningSuggestion: MovieVote,
): Promise<Movie> => {
  await DB.pollSuggestion.updateOne(
    { pollId: poll.pollId, guildId: poll.guildId, movie: winningSuggestion.movie },
    { winner: true },
  );
  const movieIdx = (await DB.movie.countDocuments({ guildId: poll.guildId })) + 1;
  const movieDate = nextWeekDay('SATURDAY').set({ hour: 21, minute: 30 });

  const movie: Movie = {
    mId: movieIdx,
    uuid: uuid(),
    name: winningSuggestion.movie,
    guildId: poll.guildId,
    userId: winningSuggestion.userId,
    theme: poll.theme,
    sessionDate: movieDate.toDate(),
    winningText: winningSuggestion.featText,
    score: -1,
    legacy: false,
    status: MovieStatus.NOT_WATCHED,
  };

  await DB.movie.create(movie);
  return movie;
};
