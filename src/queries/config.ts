import { FrequencyConfig } from '../commands/cinema/config/frequency';
import { ConfigKey } from '../constants/enums/ConfigKey';
import { FrequencyType } from '../constants/enums/FrequencyType';
import { WeekDay } from '../constants/enums/WeekDay';
import { DB } from '../schemas';

/**
 * Get the movie frequency configuration for the specified guild
 * @param guildId The guild id
 * @returns The configuration if found, else a default one
 */
export const getFrequencyConfig = async (
  guildId: string,
): Promise<FrequencyConfig | null> => {
  const DEFAULT_CONFIG: FrequencyConfig = {
    dayOfWeek: WeekDay.SATURDAY,
    hour: 21,
    minute: 0,
    type: FrequencyType.WEEK,
    interval: 1,
  };
  const config = await DB.config.findOne({
    guildId: guildId,
    key: ConfigKey.MOVIE_FREQUENCY,
  });
  if (config) {
    return JSON.parse(config.value) as FrequencyConfig;
  } else {
    return DEFAULT_CONFIG;
  }
};
