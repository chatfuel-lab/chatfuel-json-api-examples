import { Handler, HandlerEvent } from '@netlify/functions';
import fetch from 'node-fetch';

// Verify a phone number
export const handler: Handler = async (event: HandlerEvent) => {
  const payload = JSON.parse(event.body);
  const { access_key, number } = payload || {};
  const regex = /\D+/gm;
  const sanitizedNumber = number.toString().replace(regex, '');
  const req = `https://api.apilayer.com/number_verification/validate?number=${sanitizedNumber}`;

  try {
    const res: any = await fetch(req, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        apikey: access_key
      }
    });

    const data = await res.json();
    const set_attributes = {
      phoneValid: !!data?.valid
    };

    for (const [key, value] of Object.entries(data)) {
      set_attributes[key] = value;
    }

    const response = {
      set_attributes
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
