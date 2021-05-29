import { Handler, HandlerEvent } from '@netlify/functions';
import { months, parseTime, getDateInTimezone, getNowInTimezone } from './utils/date-utils';
import { DateTime, DurationUnits } from 'luxon';

export const handler: Handler = async (event: HandlerEvent) => {
  const payload = JSON.parse(event.body);
  const { month, day, year, time, timezone_short } = payload || {};

  // construct future date from user input
  const userMonth = Number(months.indexOf(month));
  const userTime = parseTime(time);
  const futureDate = new Date(year, userMonth, day, userTime.hours, userTime.minutes);

  //time zone adjust so our "now" is in the user's timezone
  const now = timezone_short ? getDateInTimezone(timezone_short, new Date()) : new Date();

  // set up for comparison
  const luxonNow = DateTime.fromISO(now.toISOString());
  const luxonFutureDate = DateTime.fromISO(futureDate.toISOString());

  const units: DurationUnits = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];

  // get the diff
  const userDiff = luxonFutureDate.diff(luxonNow, units);

  // container for final formtted value for time_until
  const timeUntil = [];

  // make sure the first item in time_until does not have zero value
  let first = true;
  units.forEach(unitString => {
    if (first && userDiff[unitString] === 0) {
      return false;
    } else {
      timeUntil.push(`${userDiff[unitString]} ${userDiff[unitString] === 1 ? unitString.slice(0, -1) : unitString}`); // remove 's' if value is 1, e.g '1 day', not '1 days'
      first = false;
    }
  });

  timeUntil[timeUntil.length - 1] = `and ${timeUntil[timeUntil.length - 1]}`;

  const response = {
    set_attributes: {
      time_remaining: luxonFutureDate.diff(luxonNow).toObject().milliseconds > 0 ? true : false,
      time_until: timeUntil.join(', '),
      years_until: userDiff.years,
      months_until: userDiff.months,
      days_until: userDiff.days,
      hours_until: userDiff.hours,
      minutes_until: userDiff.minutes,
      seconds_until: userDiff.seconds
    }
  };
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};
