import { PollStatus } from './../../../constants/enums/PollStatus';
import { DB } from '../../../schemas';
import MSG from '../../../strings';
import { Command } from '../../../structures/Command';
import { getLastScheduledMovie } from '../../../queries/movie';
import { calculateMovieDate } from '../../../utils/dateFunctions';
import { ConfigKey } from '../../../constants/enums/ConfigKey';
import { FrequencyConfig } from '../../cinema/config/frequency';
import { DateTime } from 'luxon';
import { getFrequencyConfig } from '../../../queries/config';
import { createMovieEvent } from '../../../utils/eventCreator';
import { sendMovieEventMessage } from '../../../utils/messageSender';

export default new Command({
  name: 'teste',
  description: MSG.pollTieBreakDescription,
  silent: true,
  callback: async ({ interaction }) => {
    try {
      const movie = await getLastScheduledMovie(interaction.guild.id);
      if (!movie) return;
      const config = await getFrequencyConfig(interaction.guild.id);
      const nextDate = calculateMovieDate(config, DateTime.fromJSDate(movie.sessionDate));
      await interaction.editReply('Próximo filme: ' + nextDate.toLocaleString());
      movie.sessionDate = nextDate.toJSDate();
      const event = await createMovieEvent(
        movie.name,
        movie.sessionDate,
        interaction.channel.guild,
      );
      await sendMovieEventMessage(movie, event, interaction.channel.guild);
    } catch (e) {
      console.log(e);
    }
  },
});
