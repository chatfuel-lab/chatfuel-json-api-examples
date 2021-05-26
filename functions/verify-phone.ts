import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

// Verify a phone number
export const handler: Handler = async event => {
  const { access_key, number, country_code, format } = event.queryStringParameters || {};
  console.log(access_key);

  const req = `http://apilayer.net/api/validate?access_key=${access_key}&number=${number}&country_code=${country_code}&format=${format}`;
  try {
    const res: any = await fetch(req);
    const data = await resT.json();

    const response = {
      set_attributes: {
        phoneValid: data.valid
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `ERROR: ${err.message}`
    };
  }
};
