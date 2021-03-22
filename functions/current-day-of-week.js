const days = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];
const MINS_TO_MS = 60000;
const HOURS_TO_MINS = 60;


/**
 * @param timezone: string timezone or number with offset in hours
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

exports.handler = async (event) => {
  const { tz = "0" } = event.queryStringParameters || {};

  const nowInTimezone = getNowInTimezone(tz);

  const response = {
    set_attributes: {
      day: days[nowInTimezone.getDay() - 1],
      hour: nowInTimezone.getHours(),
      minute: nowInTimezone.getMinutes(),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
