const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const MINS_TO_MS = 60000;
const HOURS_TO_MINS = 60;

const PM_OFFSET = 12;

/**
 * @param {string} timezone - time zone or number with offset in hours
 * @return {Date} current date in provided time zone
 */
const getNowInTimezone = (timezone) => {
  const now = new Date();

  if (/^-?\d*\.?\d*$/.test(timezone)) {
    const offset = parseFloat(timezone);
    return new Date(now.getTime() + now.getTimezoneOffset() * MINS_TO_MS + offset * HOURS_TO_MINS * MINS_TO_MS);
  } else {
    return new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  }
}

/**
 * @param {string} americanTime - time (in format 9:30PM)
 * @return {{hours: number, minutes: number}}
 */
const parseAmericanTime = (americanTime) => {
  const offset = americanTime.toUpperCase().endsWith('PM') ? PM_OFFSET : 0;
  const trimmedTime = americanTime.slice(0, americanTime.length - 2);
  const [hoursString, minutesString] = trimmedTime.split(':');
  return { hours: parseInt(hoursString) + offset, minutes: parseInt(minutesString) };
}

/**
 * @param {string} timeRange - time range (in format 9:30AM-7:10PM)
 * @return {{ startHours: number, startMinutes: number, endHours: number, endMinutes: number }} parsed time range
 */
const parseTimeRange = (timeRange) => {
  const [startTime, endTime] = timeRange.split('-');
  const { hours: startHours, minutes: startMinutes } = parseAmericanTime(startTime.trim());
  const { hours: endHours, minutes: endMinutes } = parseAmericanTime(endTime.trim());
  return { startHours, startMinutes, endHours, endMinutes };
}

module.exports = {
  days,
  parseTimeRange,
  getNowInTimezone
}
