import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  const now = Date.now()

  const response = {
    millis: now,
    seconds: Math.floor(now / 1000),
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
