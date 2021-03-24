const { days, getNowInTimezone } = require('./utils/date-utils');

exports.handler = async (event) => {
  const { tz = "0" } = event.queryStringParameters || {};

  const nowInTimezone = getNowInTimezone(tz);

  const response = {
    set_attributes: {
      day: days[nowInTimezone.getDay()],
      hour: nowInTimezone.getHours(),
      minute: nowInTimezone.getMinutes(),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
