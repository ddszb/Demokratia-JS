import { WeekDay } from '../constants/enums/WeekDay';
import { FrequencyType } from '../constants/enums/FrequencyType';
import MSG from '../strings';

export const truncateText = (text: string, size?: number) =>
  text.substring(0, size || 10) + (text.length > size ? '…' : '');

export const roundToFixed = (input: number, digits: number) => {
  const rounded = Math.pow(10, digits);
  return (Math.round(input * rounded) / rounded).toFixed(digits);
};

export const getFrequencyTypeLabel = (type: FrequencyType, plural?: boolean) => {
  switch (type) {
    case FrequencyType.DAY:
      return plural ? 'dias' : 'dia';
    case FrequencyType.WEEK:
      return plural ? 'semanas' : 'semana';
    case FrequencyType.MONTH:
      return plural ? 'meses' : 'mês';
  }
};

export const getHourString = (hours: number, minutes: number) => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getDayOfWeekLabel = (dayOfWeek: WeekDay, pronoun?: boolean) => {
  const pronouns = ['no', 'na', 'na', 'na', 'na', 'na', 'no'];
  const daysOfWeek = [
    MSG.weekdaySunday,
    MSG.weekdayMonday,
    MSG.weekdayTuesday,
    MSG.weekdayWedsneday,
    MSG.weekdayThursday,
    MSG.weekdayFriday,
    MSG.weekdaySaturday,
  ];
  var label = pronoun ? pronouns[dayOfWeek] + ' ' : '';
  var label = label + daysOfWeek[dayOfWeek];
  return label;
};
