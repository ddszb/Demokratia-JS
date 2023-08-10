import { Colors, EmbedBuilder, EmbedField, Message } from 'discord.js';
import { PollStatus } from '../../../constants/enums/PollStatus';
import { VotingStatus } from '../../../constants/enums/VotingStatus';
import { DB, Poll, PollVote } from '../../../schemas';
import MSG from '../../../strings';
import { ExtendedInteraction } from '../../../typings/command';
import { createMovieEvent } from '../../../utils/eventCreator';
import { sendMovieEventMessage } from '../../../utils/messageSender';
import { setWinnerMovie } from '../poll/winner';

let movieVotes = {};
let usersVoted = new Set<string>();
let poll: Poll;
let message: Message;

const getVotesEmbed = () => {
  const embedFields: EmbedField[] = [];
  for (const movie in movieVotes) {
    embedFields.push({
      name: MSG.empty,
      value: `${movie}: ${'🍿'.repeat(movieVotes[movie].length)}`,
      inline: false,
    });
  }
  const embed = new EmbedBuilder()
    .setTitle(MSG.pollEndedTitle)
    .setFields(embedFields)
    .setColor(Colors.Gold);
  return embed;
};

export const voteCollector = async (
  interaction: ExtendedInteraction,
  activePoll: Poll,
  tiedMovies: PollVote[],
  tieMessage: Message,
) => {
  poll = activePoll;
  message = tieMessage;
  const movieNames = tiedMovies.map((vote) => vote.movie);
  movieNames.forEach((movie) => (movieVotes[movie] = []));

  const collector = interaction.channel.createMessageComponentCollector();

  collector.on('collect', async (componentInteraction) => {
    // await menuInteraction.deferReply();
    if (componentInteraction.customId === 'confirm') {
      componentInteraction.reply({ ephemeral: true, content: 'fechar' });
      closeVoting(interaction, tiedMovies);
    } else if (componentInteraction.isStringSelectMenu()) {
      let movieName = componentInteraction.values[0];
      if (usersVoted.has(componentInteraction.user.id)) {
        await componentInteraction.reply({ ephemeral: true, content: 'Você já votou.' });
      } else {
        usersVoted.add(componentInteraction.user.id);
        movieVotes[movieName].push(componentInteraction.user.id);
        await componentInteraction.reply({
          ephemeral: true,
          content: 'Voto enviado: ' + movieName,
        });
        interaction.editReply({
          content: MSG.pollTiedFinishPrompt.parseArgs(` ${usersVoted.size} votos`),
        });
      }
    }
  });
};

const closeVoting = async (interaction: ExtendedInteraction, tiedMovies: PollVote[]) => {
  const winners = getWinner();
  if (winners.length == 1) {
    const winner = tiedMovies.find((vote) => vote.movie == winners[0]);
    await DB.poll.updateOne(
      { pollId: poll.pollId, guildId: interaction.guild.id },
      { status: PollStatus.FINISHED },
    );
    const winningSuggestion = await DB.pollSuggestion.findOne({
      pollId: poll.pollId,
      guildId: interaction.guild.id,
      movie: winner.movie,
    });

    if (winner) {
      const movie = await setWinnerMovie(poll, winningSuggestion);
      const embed = getVotesEmbed();
      await interaction.deleteReply();
      embed.setDescription(
        MSG.pollSuggestionsEmbedField.parseArgs(winningSuggestion.movie),
      );
      const event = await createMovieEvent(
        winningSuggestion.movie,
        movie.sessionDate,
        interaction.channel.guild,
      );
      await sendMovieEventMessage(movie, event, interaction.channel.guild);
      if (message) {
        await message.edit({
          embeds: [embed],
          components: [],
        });
      } else {
        await interaction.channel.send({ embeds: [embed], components: [] });
      }
    }
  } else {
    await DB.pollVote.updateMany(
      { pollId: poll.pollId, movie: { $in: winners } },
      { votingIndex: VotingStatus.MANUAL_SELECTION },
    );

    await interaction.deleteReply();
    const payload = {
      content: MSG.pollSecondTieMessage.parseArgs(winners.join(' \n ')),
      embeds: [],
      components: [],
    };
    if (message) {
      await message.edit(payload);
    } else {
      await interaction.channel.send(payload);
    }
  }
};

const getWinner = (): string[] => {
  let max = 0;
  let winners = [];
  for (const movie in movieVotes) {
    let voteCount = movieVotes[movie].length;
    if (voteCount == max) {
      winners.push(movie);
    } else if (voteCount > max) {
      winners = [movie];
      max = voteCount;
    }
  }
  return winners;
};
