import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

export type WeekDay =
	| 'SUNDAY'
	| 'MONDAY'
	| 'TUESDAY'
	| 'WEDNESDAY'
	| 'THURSDAY'
	| 'FRIDAY'
	| 'SATURDAY';
export enum DayOfTheWeek {
	'SUNDAY' = 0,
	'MONDAY' = 1,
	'TUESDAY' = 2,
	'WEDNESDAY' = 3,
	'THURSDAY' = 4,
	'FRIDAY' = 5,
	'SATURDAY' = 6,
}

/**
 * Gets the date of the next one of WeekDay
 * @param day 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY' or 'SATURDAY'
 * @param skipOneWeek If true, adds one week to the date returned
 * @returns the date (moment) of the next corresponding weekday
 */
export const nextWeekDay = (day: WeekDay, skipOneWeek?: boolean) => {
	const dayOfTheWeek = _getDayOfTheWeek(day);
	const today = moment().day();
	let nextDay;
	const skip = skipOneWeek ? 1 : 0;
	if (today <= dayOfTheWeek) {
		nextDay = moment().add(skip, 'weeks').day(dayOfTheWeek);
	} else {
		nextDay = moment()
			.add(skip + 1, 'weeks')
			.day(dayOfTheWeek);
	}
	return nextDay;
};

/**
 * Parses an hour date in the format hh:mm
 * @param hour Hour string
 * @returns Return a moment of the specified hour, valid or not
 */
export const getHourMoment = (hour: string) => moment(hour, 'HH:mm', true);

const _getDayOfTheWeek = (weekday: WeekDay): DayOfTheWeek => {
	let day = DayOfTheWeek.SATURDAY;
	if (weekday in DayOfTheWeek) {
		day = DayOfTheWeek[weekday];
	}
	return day;
};
