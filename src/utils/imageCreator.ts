import { MovieScore } from './../schemas/movie-score';
import { AttachmentBuilder } from 'discord.js';
import { IMAGE } from '../constants/enums/Image';
import { DB, Movie } from '../schemas';
import { ImageMaker } from './imageMaker';
import { client } from '..';
import { roundToFixed } from './formatter';
import { DateTime } from 'luxon';

export const getMovieScoreImage = async (movie: Movie): Promise<AttachmentBuilder> => {
  const MOVIE_GOOD_SCORE_THRESHOLD = 65;

  const AVATAR = { size: 50, x: 215, y: 180 };
  const USER = { x: 280, y: 212 };
  const MOVIE_NAME = { x: 512, y: 120 };
  const MOVIE_DATE = { x: 500, y: 216 };
  const MOVIE_SCORE = { x: 560, y: 390 };
  const MOVIE_BUCKET_GOOD = { x: 290, y: 290 };
  const MOVIE_BUCKET_BAD = { x: 275, y: 305 };

  let userScores: MovieScore[] = await DB.movieScore.find({
    guildId: movie.guildId,
    movieId: movie.uuid,
  });

  const user = await client.users.fetch(movie.userId);
  const movieCanva = new ImageMaker();
  await movieCanva.setBackground(IMAGE.movie_background);

  // Adds movie name
  let nameText = [movie.name];
  movieCanva.setFont('Cambria', 48);
  if (movie.name.length > 20) {
    movieCanva.setFont('Cambria', 35);
  }
  if (movie.name.length > 35) {
    if (movie.name.indexOf(':') > 0) {
      nameText = movie.name.split(':');
      nameText[0].concat(':');
    } else if (movie.name.indexOf('-') > 0) {
      nameText = movie.name.split('-');
    } else {
      movieCanva.setFont('Cambria', 28);
    }
  }
  for (const namePart of nameText) {
    await movieCanva.addText(namePart, MOVIE_NAME.x, MOVIE_NAME.y, '#F5C645', true);
    MOVIE_NAME.y += 50;
  }
  //  Add movie user info
  await movieCanva.addImageUrl(
    user.displayAvatarURL(),
    AVATAR.x,
    nameText.length > 1 ? AVATAR.y + 45 : AVATAR.y,
    AVATAR.size,
    AVATAR.size,
    true,
  );
  movieCanva.setFont('Futura-Medium', 25);
  await movieCanva.addText(
    user.username,
    USER.x,
    nameText.length > 1 ? USER.y + 45 : USER.y,
    '#BBB',
  );

  // Add movie date
  movieCanva.setFont('MovieTimes', 30);
  await movieCanva.addText(
    DateTime.fromJSDate(movie.sessionDate).setLocale('pt-br').toLocaleString(),
    MOVIE_DATE.x,
    nameText.length > 1 ? MOVIE_DATE.y + 45 : MOVIE_DATE.y,
    '#BBB',
  );

  // Add movie score
  await movieCanva.addImage(IMAGE.star, MOVIE_SCORE.x - 75, MOVIE_SCORE.y - 75, 75, 75);
  movieCanva.setFont('Cambria', 120);
  movieCanva.addText(
    roundToFixed(movie.score, 1),
    MOVIE_SCORE.x,
    MOVIE_SCORE.y,
    '#f0c144',
  );

  // Add movie bucket
  const highScoreAmount = userScores.filter(
    (userScore) => userScore.score >= MOVIE_GOOD_SCORE_THRESHOLD,
  ).length;

  let goodScore = false;
  if (userScores.length > 0) {
    goodScore = highScoreAmount / userScores.length > 0.7;
  } else {
    goodScore = movie.score > MOVIE_GOOD_SCORE_THRESHOLD;
  }
  if (goodScore) {
    await movieCanva.addImage(
      IMAGE.bucked_good,
      MOVIE_BUCKET_GOOD.x,
      MOVIE_BUCKET_GOOD.y,
    );
  } else {
    await movieCanva.addImage(IMAGE.bucked_bad, MOVIE_BUCKET_BAD.x, MOVIE_BUCKET_BAD.y);
  }
  // Add users scores
  let index = 0;
  for (const userScore of userScores) {
    await addUserScore(movieCanva, userScore, index, userScores.length);
    index += 1;
  }
  return await movieCanva.getAttachment(movie.name + '.png');
};

const addUserScore = async (
  movieCanva: ImageMaker,
  userScore: MovieScore,
  index: number,
  length: number,
) => {
  const BASE_X = movieCanva.getWidth() / length - 100;
  const BASE_Y = 570;
  const offset = length > 5 ? 120 : 170;
  const evenIndexOffsetY = length > 5 ? -100 : -80;
  const user = await client.users.fetch(userScore.userId);

  const avatarX = BASE_X + index * offset;
  const avatarY = index % 2 == 0 ? BASE_Y : BASE_Y + evenIndexOffsetY;

  await movieCanva.addImageUrl(user.displayAvatarURL(), avatarX, avatarY, 50, 50);
  movieCanva.setFont('Futura-Medium', 25);
  if (index % 2 == 1) {
    const textSize = movieCanva.measure(user.username);
    movieCanva.fill(avatarX + 21, avatarY - 34, textSize.width + 8, 30, '#111');
  }
  await movieCanva.addText(user.username, avatarX + 25, avatarY - 10, '#CCC');
  movieCanva.setFont('AppleColorEmoji', 25);
  await movieCanva.addText('⭐', avatarX + 55, avatarY + 35);
  movieCanva.setFont('Futura-Medium', 25);
  await movieCanva.addText(`${userScore.score}`, avatarX + 83, avatarY + 31, '#f0c144');
};
