import { FrequencyConfig } from '../commands/cinema/config/frequency';
import { FrequencyType } from '../constants/enums/FrequencyType';
import { DateTime } from 'luxon';

export type WeekDay =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';
export enum DayOfTheWeek {
  'MONDAY' = 1,
  'TUESDAY' = 2,
  'WEDNESDAY' = 3,
  'THURSDAY' = 4,
  'FRIDAY' = 5,
  'SATURDAY' = 6,
  'SUNDAY' = 7,
}
export type WeekdayNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const calculateMovieDate = (
  configuration: FrequencyConfig,
  lastMovieDate: DateTime,
): DateTime => {
  const weekDayConfig = Number(configuration.dayOfWeek);
  var movieDate = lastMovieDate;
  switch (configuration.type) {
    case FrequencyType.DAY:
      movieDate = movieDate
        .plus({ days: configuration.interval })
        .set({ hour: configuration.hour, minute: configuration.minute, second: 0 });
      break;
    case FrequencyType.WEEK:
      movieDate = movieDate
        .plus({ weeks: configuration.interval })
        .set({ hour: configuration.hour, minute: configuration.minute, second: 0 });
      break;
    case FrequencyType.MONTH:
      movieDate = movieDate
        .plus({ months: configuration.interval })
        .set({ hour: configuration.hour, minute: configuration.minute, second: 0 });
      break;
  }
  if (movieDate.weekday !== weekDayConfig) {
    // if it isn't the same weekday configured, sets to the closest one;
    movieDate = movieDate.plus({ days: weekDayConfig - movieDate.weekday });
  }
  return movieDate;
};
