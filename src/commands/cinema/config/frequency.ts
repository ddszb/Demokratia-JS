import { ChatInputCommandInteraction } from 'discord.js';
import { ExtendedInteraction } from '../../../typings/command';
import { ConfigKey } from '../../../constants/enums/ConfigKey';
import { Config, DB } from '../../../schemas';
import { FrequencyType } from '../../../constants/enums/FrequencyType';
import { WeekDay } from '../../../constants/enums/WeekDay';
import MSG from '../../../strings';
import {
  getDayOfWeekLabel,
  getFrequencyTypeLabel,
  getHourString,
} from '../../../utils/formatter';
import { getFrequencyConfig } from '../../../queries/config';

export interface FrequencyConfig {
  type: FrequencyType;
  interval: number;
  hour: number;
  minute: number;
  dayOfWeek: WeekDay;
}

export const setFrequency = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const DEFAULT_HOUR = 21;
  const DEFAULT_MINUTE = 0;
  const DEFAULT_DOW = WeekDay.SUNDAY;

  const type = interaction.options.getString('tipo')! as FrequencyType;
  const interval = interaction.options.getInteger('intervalo')!;
  const hour = interaction.options.getInteger('hora') || DEFAULT_HOUR;
  const minute = interaction.options.getInteger('minuto') || DEFAULT_MINUTE;
  const dayOfWeek = (interaction.options.getString('dia') || DEFAULT_DOW) as WeekDay;

  const configValue: FrequencyConfig = {
    type,
    interval,
    hour,
    minute,
    dayOfWeek,
  };

  const config: Config = {
    key: ConfigKey.MOVIE_FREQUENCY,
    guildId: interaction.guild.id,
    value: JSON.stringify(configValue),
  };
  try {
    await DB.config.updateOne(
      { guildId: interaction.guild.id, key: ConfigKey.MOVIE_FREQUENCY },
      config,
      { upsert: true },
    );

    await interaction.editReply({
      content: MSG.configChanged + '\n' + formatConfigurationText(configValue),
    });
  } catch (error) {
    await interaction.editReply({
      content: MSG.errorOcurred,
    });
  }
};

export const getFrequency = async (
  interaction: ExtendedInteraction & ChatInputCommandInteraction,
) => {
  const config = await getFrequencyConfig(interaction.guildId);
  await interaction.editReply({
    content: formatConfigurationText(config),
  });
};

const formatConfigurationText = (config: FrequencyConfig) => {
  console.log(JSON.stringify(config));
  const plural = config.interval > 1;
  return MSG.configFrequencyDisplayText.parseArgs(
    config.interval,
    getFrequencyTypeLabel(config.type, plural),
    getHourString(config.hour, config.minute),
    getDayOfWeekLabel(config.dayOfWeek, true),
  );
};
