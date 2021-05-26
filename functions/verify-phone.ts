import { Handler, HandlerEvent } from '@netlify/functions';
import fetch from 'node-fetch';

// Verify a phone number
export const handler: Handler = async (event: HandlerEvent) => {
  const payload = JSON.parse(event.body);
  const { access_key, number, country_code, format } = payload || {};
  const regex = /\D+/gm;
  const sanitizedNumber = number.toString().replace(regex, '');
  const req = `http://apilayer.net/api/validate?access_key=${access_key}&number=${sanitizedNumber}&country_code=${country_code}&format=${format}`;
  try {
    const res: any = await fetch(req);
    const data = await res.json();
    const response = {
      set_attributes: {
        phoneValid: data && data.valid ? data.valid : false
      }
    };
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (err) {
    const errorResponse = {
      set_attributes: {
        phoneValid: false
      }
    };
    return {
      statusCode: 200,
      body: JSON.stringify(errorResponse)
    };
  }
};
