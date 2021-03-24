const { days, parseTimeRange, getNowInTimezone } = require('./utils/date-utils');

/**
 * @param {Date} date - date to check
 * @param {string} workingHours - working hours (in format 9:30AM-7:10PM)
 * @return {boolean} `true` if date in working hours, `false` otherwise
 */
const isDateInWorkingHours = (date, workingHours) => {
  const { startHours, startMinutes, endHours, endMinutes } = parseTimeRange(workingHours);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const dateGeStart = hours > startHours || hours === startHours && minutes >= startMinutes;
  const dateLeEnd = hours < endHours || hours === endHours && minutes <= endMinutes;

  return dateGeStart && dateLeEnd;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { timezone, ...rest } = JSON.parse(event.body);
  const nowInTimezone = getNowInTimezone(timezone);

  const dayWorkingHours = rest[days[nowInTimezone.getDay()]];
  const businessIsOpen = dayWorkingHours && isDateInWorkingHours(nowInTimezone, dayWorkingHours);

  const response = {
    set_attributes: {
      business: businessIsOpen ? 'open' : 'close'
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
