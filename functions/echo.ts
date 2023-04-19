import { Handler, HandlerEvent } from '@netlify/functions';

export const handler: Handler = async (event: HandlerEvent) => {
  return {
    statusCode: 200,
    body: event.body
  };
};
