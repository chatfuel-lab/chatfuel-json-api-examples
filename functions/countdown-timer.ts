import { Handler, HandlerEvent } from '@netlify/functions';
import { months, parseTime, getDateInTimezone, getNowInTimezone } from './utils/date-utils';
import { DateTime } from 'luxon';

export const handler: Handler = async (event: HandlerEvent) => {
  const payload = JSON.parse(event.body);
  const { month, day, year, time, timezone_short } = payload || {};

  // construct future date from user input
  const userMonth = Number(months.indexOf(month));
  const userTime = parseTime(time);
  const futureDate = new Date(year, userMonth, day, userTime.hours, userTime.minutes);

  //time zone adjust
  // const tzFutureDate = timezone_short ? getDateInTimezone(timezone_short, futureDate) : futureDate;
  const now = timezone_short ? getDateInTimezone(timezone_short, new Date()) : new Date();

  // set up for comparison
  const luxonNow = DateTime.fromISO(now.toISOString());
  const luxonFutureDate = DateTime.fromISO(futureDate.toISOString());

  // get the diff
  const userDiff = luxonFutureDate.diff(luxonNow, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);

  const response = {
    set_attributes: {
      time_remaining: luxonFutureDate.diff(luxonNow).toObject().milliseconds > 0 ? true : false,
      time_until: `${userDiff.days} days, ${userDiff.hours} hours, ${userDiff.minutes} minutes, ${userDiff.seconds} seconds`,
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
