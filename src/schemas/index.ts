import channel, { Channel } from './channel';
import movie, { Movie } from './movie';
import movieScore, { MovieScore } from './movie-score';
import pollSuggestion, { PollSuggestion } from './poll-suggestion';
import pollVote, { PollVote } from './poll-vote';
import poll, { Poll } from './poll';
import role, { Role } from './role';
import theme, { Theme } from './theme';
import member, { Member } from './member';
import config, { Config } from './config';

export const DB = {
  movie,
  movieScore,
  channel,
  pollSuggestion,
  pollVote,
  poll,
  role,
  theme,
  member,
  config,
};

export {
  Channel,
  Config,
  Movie,
  Member,
  MovieScore,
  PollSuggestion,
  PollVote,
  Poll,
  Role,
  Theme,
};
