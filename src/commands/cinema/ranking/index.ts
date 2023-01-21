import { Colors } from 'discord.js';
import { MovieStatus } from '../../../constants/enums/MovieStatus';
import { Movie, DB } from '../../../schemas';
import MSG from '../../../strings';
import { roundToFixed } from '../../../utils/formatter';
import { Paginator } from '../../../utils/paginator';
import { Command } from './../../../structures/Command';

const TIME_LIMIT_SECONDS = 1000 * 120;

export default new Command({
  name: 'ranking',
  description: MSG.rankingDescription,
  silent: false,
  callback: async ({ interaction }) => {
    const movies: Movie[] = await DB.movie
      .find({ guildId: interaction.guild.id, status: MovieStatus.WATCHED })
      .sort({ score: 'desc', name: 'asc' });
    const items = movies.map((movie, i) => ({
      label: MSG.rankingFieldFormatter.parseArgs(
        i + 1,
        movie.name,
        roundToFixed(movie.score, 1),
      ),
    }));
    const paginator = new Paginator(
      MSG.rankingEmbedTitle,
      false,
      items,
      15,
      undefined,
      undefined,
      Colors.Gold,
      true,
    );

    interaction.editReply(paginator.getReply());

    let collector = interaction.channel.createMessageComponentCollector({
      time: TIME_LIMIT_SECONDS,
    });

    collector.on('collect', async (btnInt) => {
      paginator.onPageChange(btnInt);
      interaction.editReply(paginator.getReply());
    });

    collector.on('end', async () => {
      paginator.onTimeOut();
      await interaction.editReply(paginator.getReply());
    });
  },
});
