import { Handler, HandlerEvent } from '@netlify/functions';
import fetch from 'node-fetch';
import { DateTime } from 'luxon';

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

// Verify a phone number
export const handler: Handler = async (event: HandlerEvent) => {
  const payload = JSON.parse(event.body);
  const { month, day, year, time, timezone_short } = payload || {};

  const now = DateTime.now();

  // convert user's date to integer
  const userMonth = Number(months.indexOf(month) + 1);
  const userTime = time.match(/([01]?[0-9]|2[0-3]):([0-5][0-9])([A-Z][A-Z])/);
  const userHour = userTime[3] === 'PM' ? Number(userTime[1]) + 12 : userTime[1];
  const userMinute = Number(userTime[2].replace(/^0+/, ''));
  const userDate = DateTime.local(year, userMonth, day, userHour, userMinute);

  // calculate diff between userDate and current date
  const userDiff = userDate.diff(now, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);
  console.log(userDiff.as('days'));

  const response = {
    set_attributes: {
      time_remaining: userDate.diff(now).toObject().milliseconds > 0 ? true : false,
      time_until: `${Math.floor(userDiff.as('days'))} days, ${userDiff.hours} hours, ${
        userDiff.minutes
      } minutes, ${Math.round(userDiff.seconds)} seconds`,
      years_until: Math.floor(userDiff.as('years')),
      months_until: Math.floor(userDiff.as('months')),
      days_until: Math.floor(userDiff.as('days')),
      hours_until: Math.floor(userDiff.as('hours')),
      minutes_until: Math.floor(userDiff.as('minutes')),
      seconds_until: Math.floor(userDiff.as('seconds'))
    }
  };
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};
