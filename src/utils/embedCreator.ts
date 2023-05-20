import { GuildScheduledEvent, EmbedBuilder, Colors } from 'discord.js';
import { Movie, MovieScore, Theme } from '../schemas';
import MSG from '../strings';
import { roundToFixed } from './formatter';
import { DateTime } from 'luxon';

// Response for movie event created
export const movieDateEmbed = async (
  movie: Movie,
  event: GuildScheduledEvent,
): Promise<EmbedBuilder> => {
  const start = DateTime.fromJSDate(movie.sessionDate);
  const dayFormatted = start.setLocale('pt-br').toLocaleString(DateTime.DATE_HUGE);
  const timeFormatted = `${start.toFormat('HH:mm')}`;
  const movieName = MSG.sessionEmbedDescription.parseArgs(movie.name);
  const featMessage = movie.winningText
    ? MSG.sessionEmbedFeatDescription.parseArgs(movie.winningText)
    : '';
  return new EmbedBuilder()
    .setTitle(MSG.sessionEmbedTitle)
    .setDescription(movieName.concat(featMessage))
    .setColor(Colors.Orange)
    .setFields([
      { name: MSG.empty, value: MSG.sessionEmbedTheme.parseArgs(movie.theme) },
      { name: MSG.empty, value: MSG.sessionEmbedUser.parseArgs(movie.userId) },
      { name: MSG.empty, value: `${dayFormatted}\n${timeFormatted}` },
      {
        name: MSG.empty,
        value: MSG.sessionInviteURL.parseArgs(await event.createInviteURL()),
      },
    ]);
};

// Response for rating already started
export const ratingAlreadyStartedEmbed = (movie: Movie) => {
  return new EmbedBuilder().setTitle(MSG.errorOcurred).setFields([
    {
      name: MSG.empty,
      value: MSG.movieRatingAlreadyStarted.parseArgs(movie.name),
    },
  ]);
};

// Response for no movies available to rate
export const noMoviesToRateEmbed = () => {
  return new EmbedBuilder()
    .setTitle(MSG.movieRatingTitle)
    .setFields([{ name: MSG.empty, value: MSG.movieRatingMovieNotFound }]);
};

// Response for movie rating available
export const movieRatePromptEmbed = (movie: Movie, userNickname: string) => {
  return new EmbedBuilder()
    .setTitle(MSG.movieRatingTitle)
    .setDescription(
      MSG.movieRatingPrompt.parseArgs(userNickname, movie.name, movie.userId),
    )
    .setColor(Colors.Green);
};

// Response for movie score
export const movieRatingEmbed = (
  movie: Movie,
  movieScores: MovieScore[],
  expEarned: number,
  movedRanks: boolean,
) => {
  const scoreFormated = roundToFixed(movie.score, 1);
  const userScores = movieScores.map((s) =>
    MSG.movieRatingUserScore.parseArgs(s.userId, s.score),
  );
  return new EmbedBuilder()
    .setTitle(MSG.movieRatingTitle)
    .setColor(Colors.Gold)
    .setFields([
      {
        name: MSG.empty,
        value: MSG.empty,
      },
      {
        name: MSG.movieRatingEmbedWinner.parseArgs(movie.name),
        value: MSG.movieRatingEmbedSuggestion.parseArgs(movie.userId, expEarned),
      },
      {
        name: MSG.empty,
        value: MSG.movieRatingEmbedScore.parseArgs(scoreFormated),
      },
      {
        name: MSG.empty,
        value: MSG.movieRatingEmbedTheme.parseArgs(movie.theme),
      },
      {
        name: MSG.empty,
        value: userScores.join('\n'),
      },
      {
        name: MSG.empty,
        value: MSG.empty,
      },
    ])
    .setFooter({ text: MSG.movieRatingEmbedFooter.parseArgs(userScores.length) });
};

export const themeRollEmbed = (theme: Theme, totalVotes: number) => {
  return new EmbedBuilder()
    .setTitle(MSG.themeSelectedEmbedTitle)
    .setFooter({ text: MSG.themeSelectedEmbedFooter.parseArgs(totalVotes) })
    .setColor(Colors.Blue)
    .setFields([
      {
        name: MSG.empty,
        value: theme.repeating
          ? MSG.themeSelectedCounter.parseArgs(theme.name, theme.occurrences)
          : MSG.themeSelected.parseArgs(theme.name),
      },
      {
        name: MSG.empty,
        value: MSG.empty,
      },
    ]);
};

// Theme created Embed
export const themeCreatedEmbed = (theme: string): EmbedBuilder => {
  return new EmbedBuilder()
    .setTitle(MSG.themeNext)
    .setDescription(MSG.empty)
    .addFields([
      {
        name: MSG.themeNextFormatter.parseArgs(theme),
        value: MSG.empty,
        inline: false,
      },
      {
        name: MSG.empty,
        value: MSG.themePickedTip,
        inline: false,
      },
    ])
    .setColor(Colors.LuminousVividPink);
};
