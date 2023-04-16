import { ApplicationCommandOptionType } from 'discord.js';
import MSG from '../../../strings';
import { Command } from '../../../structures/Command';
import { getFrequency, setFrequency } from './frequency';
import { FrequencyType } from '../../../constants/enums/FrequencyType';
import { WeekDay } from '../../../constants/enums/WeekDay';

export default new Command({
  name: 'config',
  description: MSG.configFrequencyCommandDescription,
  silent: false,
  options: [
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'frequencia',
      description: MSG.configFrequencyFrequencySetDescription,
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'set',
          description: MSG.configFrequencyFrequencySetDescription,
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'tipo',
              description: MSG.configFrequencyTypeDescription,
              required: true,
              choices: [
                { name: MSG.day, value: FrequencyType.DAY },
                { name: MSG.week, value: FrequencyType.WEEK },
                { name: MSG.month, value: FrequencyType.MONTH },
              ],
            },
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'intervalo',
              description: MSG.configFrequencyIntervalDescription,
              required: true,
              min_value: 1,
              max_value: 4,
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'dia',
              description: MSG.configFrequencyDayDescription,
              required: false,
              choices: [
                { name: MSG.weekdaySunday, value: WeekDay.SUNDAY },
                { name: MSG.weekdayMonday, value: WeekDay.MONDAY },
                { name: MSG.weekdayTuesday, value: WeekDay.TUESDAY },
                { name: MSG.weekdayWedsneday, value: WeekDay.WEDNESDAY },
                { name: MSG.weekdayThursday, value: WeekDay.THURSDAY },
                { name: MSG.weekdayFriday, value: WeekDay.FRIDAY },
                { name: MSG.weekdaySaturday, value: WeekDay.SATURDAY },
              ],
            },
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'hora',
              description: MSG.configFrequencyHourDescription,
              required: false,
              min_value: 0,
              max_value: 23,
            },
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'minuto',
              description: MSG.configFrequencyMinuteDescription,
              required: false,
              min_value: 0,
              max_value: 59,
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'get',
          description: MSG.configFrequencyFrequencyGetDescription,
        },
      ],
    },
  ],
  callback: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    const subCommandGroup = interaction.options.getSubcommandGroup();
    const subCommand = interaction.options.getSubcommand();
    if (subCommandGroup == 'frequencia') {
      switch (subCommand) {
        case 'set':
          setFrequency(interaction);
        case 'get':
          getFrequency(interaction);
      }
    }
  },
});
