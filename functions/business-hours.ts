import { Handler } from '@netlify/functions';
import { days, parseTimeRange, getNowInTimezone } from './utils/date-utils';

/**
 * @param {Date} date - date to check
 * @param {string} workingHours - working hours (in format 9:30AM-7:10PM)
 * @return {boolean} `true` if date in working hours, `false` otherwise
 */
const isDateInWorkingHours = (date: Date, workingHours: string) => {
  const { startHours, startMinutes, endHours, endMinutes } = parseTimeRange(workingHours);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const dateGeStart = hours > startHours || (hours === startHours && minutes >= startMinutes);
  const dateLeEnd = hours < endHours || (hours === endHours && minutes <= endMinutes);

  return dateGeStart && dateLeEnd;
};

export const handler: Handler = async event => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { tz, ...rest } = JSON.parse(event.body);
  const nowInTimezone = getNowInTimezone(tz);

  const dayWorkingHours = rest[days[nowInTimezone.getDay()]];
  const businessIsClosed = !dayWorkingHours || dayWorkingHours.toLowerCase() === 'closed';
  const businessIsOpen = !businessIsClosed && isDateInWorkingHours(nowInTimezone, dayWorkingHours);

  const response = {
    set_attributes: {
      business: businessIsOpen ? 'open' : 'closed'
    }
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};
