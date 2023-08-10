import { PollSuggestion } from '../../../schemas/poll-suggestion';
import { DB, Movie, Poll } from '../../../schemas';
import { calculateMovieDate } from '../../../utils/dateFunctions';
import { MovieStatus } from '../../../constants/enums/MovieStatus';
import { ExtendedInteraction } from '../../../typings/command';
import { ChatInputCommandInteraction, userMention } from 'discord.js';
import MSG from '../../../strings';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { newConfirmationButtonRow } from '../../../utils/componentBuilder';
import { v4 as uuid } from 'uuid';
import { createMovieEvent } from '../../../utils/eventCreator';
import { sendMovieEventMessage } from '../../../utils/messageSender';
import { DateTime } from 'luxon';
import { getFrequencyConfig } from '../../../queries/config';
import { getLastScheduledMovie } from '../../../queries/movie';

export const setWinnerMovie = async (
  poll: Poll,
  winningSuggestion: PollSuggestion,
): Promise<Movie> => {
  await DB.pollSuggestion.updateOne(
    { pollId: poll.pollId, guildId: poll.guildId, movie: winningSuggestion.movie },
    { winner: true },
  );
  const movieIdx = (await DB.movie.countDocuments({ guildId: poll.guildId })) + 1;
  const frequencySettings = await getFrequencyConfig(poll.guildId);
  const lastMovie = await getLastScheduledMovie(poll.guildId);

  const movieDate = calculateMovieDate(
    frequencySettings,
    DateTime.fromJSDate(lastMovie.sessionDate),
  );
  const movie: Movie = {
    mId: movieIdx,
    uuid: uuid(),
    name: winningSuggestion.movie,
    guildId: poll.guildId,
    userId: winningSuggestion.userId,
    theme: poll.theme,
    sessionDate: movieDate.toJSDate(),
    winningText: winningSuggestion.winningText,
    score: -1,
    legacy: false,
    status: MovieStatus.NOT_WATCHED,
    extraSession: false,
  };

  await DB.movie.create(movie);
  return movie;
};

export const setWinnerManually = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const winnerMovieName = interaction.options.getString('vencedor');
  if (!winnerMovieName) {
    await interaction.editReply(MSG.pollMovieNotFound);
    return;
  }
  const poll = await DB.poll.findOne({
    status: { $in: [PollStatus.ACTIVE, PollStatus.VOTING, PollStatus.TIE_BREAK] },
    guildId: interaction.guild.id,
  });
  if (!poll) {
    await interaction.editReply({
      content: MSG.pollNoneOpened,
    });
    return;
  }
  const confirmId = uuid();
  const cancelId = uuid();
  const buttons = newConfirmationButtonRow(confirmId, cancelId);
  await interaction.editReply({
    content: MSG.pollManualConfirmPrompt.parseArgs(winnerMovieName),
    components: [buttons],
  });

  let collector = interaction.channel.createMessageComponentCollector();
  collector.on('collect', async (btnInt) => {
    if (btnInt.customId === cancelId) {
      await interaction.deleteReply();
    } else if (btnInt.customId === confirmId) {
      try {
        await DB.pollVote.deleteMany({
          guildId: interaction.guild.id,
          pollId: poll.pollId,
        });
        await DB.pollVote.create({
          pollId: poll.pollId,
          guildId: poll.guildId,
          userId: interaction.client.user.id,
          date: new Date(),
          movie: winnerMovieName,
          votingIndex: 0,
        });
        poll.status = PollStatus.FINISHED;
        await DB.poll.updateOne({ pollId: poll.pollId }, poll);

        const winningSuggestion = await DB.pollSuggestion.findOne({
          movie: winnerMovieName,
          pollId: poll.pollId,
        });
        if (!winningSuggestion) {
          await interaction.editReply({
            content: MSG.pollMovieNotFound,
          });
          return;
        }

        if (winningSuggestion) {
          const movie = await setWinnerMovie(poll, winningSuggestion);
          const event = await createMovieEvent(
            winningSuggestion.movie,
            movie.sessionDate,
            interaction.channel.guild,
          );
          await sendMovieEventMessage(movie, event, interaction.channel.guild);
        }

        await interaction.channel.send({
          content: MSG.pollManualWinner.parseArgs(
            winnerMovieName,
            userMention(interaction.user.id),
          ),
        });
        await interaction.deleteReply();
      } catch (error) {
        return;
      }
    }
  });
};
