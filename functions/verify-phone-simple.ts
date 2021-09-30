import { Handler, HandlerEvent } from '@netlify/functions';

// Verify a phone number
export const handler: Handler = async (event: HandlerEvent) => {
  const { phone } = event.queryStringParameters || {};

  const phoneIsValid = /^\+?([0-9\-\s()]){5,20}[0-9]$/.test(phone);

  const response = {
    set_attributes: {
      phoneValid: phoneIsValid
    }
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};
