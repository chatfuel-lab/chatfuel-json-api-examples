const days = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];
const MINS_TO_MS = 60000;
const HOURS_TO_MINS = 60;

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { timezone } = JSON.parse(event.body);
  const now = new Date();
  const adjustedDate = new Date(now.getTime() + now.getTimezoneOffset() * MINS_TO_MS + timezone * HOURS_TO_MINS * MINS_TO_MS);

  const response = {
    set_attributes: {
      day: days[adjustedDate.getDay() - 1],
      hour: adjustedDate.getHours(),
      minute: adjustedDate.getMinutes()
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
