import { Handler, HandlerEvent } from '@netlify/functions';
import { days, getDateInTimezone } from './utils/date-utils';

export const handler: Handler = async (event: HandlerEvent) => {
  const { tz = '0', millis = '0' } = event.queryStringParameters || {};

  const timeInTimezone = getDateInTimezone(tz, new Date(Number(millis)));

  const response = {
    dayOfWeek: days[timeInTimezone.getDay()],
    hour: timeInTimezone.getHours(),
    minute: timeInTimezone.getMinutes(),
    second: timeInTimezone.getSeconds(),
    month: timeInTimezone.getMonth(),
    day: timeInTimezone.getDate(),
    dateTime: timeInTimezone.toISOString(),
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
