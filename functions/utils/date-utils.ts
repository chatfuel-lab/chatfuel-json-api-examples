const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const MINS_TO_MS = 60000;
const HOURS_TO_MINS = 60;
const HOURS_IN_DAY = 24;
const DAY_TO_MS = HOURS_IN_DAY * HOURS_TO_MINS * MINS_TO_MS;

const HALF_DAY_HOURS = 12;

/**
 * @param {string} timezone - time zone or number with offset in hours
 * @param {Date} date - date
 * @return {Date} date in provided time zone
 */
const getDateInTimezone = (timezone: string, date: Date) => {
  if (/^-?\d*\.?\d*$/.test(timezone)) {
    const offset = parseFloat(timezone);
    return new Date(date.getTime() + date.getTimezoneOffset() * MINS_TO_MS + offset * HOURS_TO_MINS * MINS_TO_MS);
  } else {
    return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  }
};

/**
 * @param {string} timezone - time zone or number with offset in hours
 * @return {Date} current date in provided time zone
 */
const getNowInTimezone = (timezone: string) => {
  return getDateInTimezone(timezone, new Date());
};

/**
 * @param {Date} date - date
 * @param {number} days - number of days to add
 * @return {Date} date plus specified number of days
 */
const addDays = (date: Date, days: number) => {
  return new Date(date.getTime() + days * DAY_TO_MS);
};

/**
 * @param {string} americanTime - time (in format 9:30PM)
 * @return {{ hours: number, minutes: number }} parsed time
 */
const parseTime = (americanTime: string) => {
  const offset = americanTime.toUpperCase().endsWith('PM') ? HALF_DAY_HOURS : 0;
  const trimmedTime = americanTime.slice(0, americanTime.length - 2);
  const [hoursString, minutesString] = trimmedTime.split(':');
  return { hours: (parseInt(hoursString) % HALF_DAY_HOURS) + offset, minutes: parseInt(minutesString) };
};

/**
 * @param {string} timeRange - time range (in format 9:30AM-7:10PM)
 * @return {{ startHours: number, startMinutes: number, endHours: number, endMinutes: number }} parsed time range
 */
const parseTimeRange = (timeRange: string) => {
  const [startTime, endTime] = timeRange.split('-');
  const { hours: startHours, minutes: startMinutes } = parseTime(startTime.trim());
  const { hours: endHours, minutes: endMinutes } = parseTime(endTime.trim());
  return { startHours, startMinutes, endHours, endMinutes };
};

export { days, months, addDays, parseTime, parseTimeRange, getNowInTimezone, getDateInTimezone };
