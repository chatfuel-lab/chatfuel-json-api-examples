import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const validateQueryParams = queryParams => {
  const { email, shop, key, pw } = queryParams;
  if (!email) {
    return { hasError: true, errorMessage: 'Missing email' };
  }
  if (!shop) {
    return { hasError: true, errorMessage: 'Missing shop name' };
  }
  if (!key) {
    return { hasError: true, errorMessage: 'Missing API key' };
  }
  if (!pw) {
    return { hasError: true, errorMessage: 'Missing API password' };
  }
  return { hasError: false };
};

const handleCheckShopifyCustomer = async (event): Promise<any> => {
  const queryParams = event.queryStringParameters || {};
  const validation = validateQueryParams(queryParams);

  if (validation.hasError) {
    return validation;
  }

  const { email, shop, key, pw } = queryParams;
  const shopifyOrdersUrl = `https://${key}:${pw}@${shop}.myshopify.com/admin/api/2021-04/orders.json`;

  try {
    const data = await fetch(shopifyOrdersUrl).then(r => r.json());
    const { orders } = data;

    if (!orders) {
      return { hasError: true, errorMessage: "Error: Couldn't connect to Shopify store." };
    }

    const lowerEmail = email.trim().toLowerCase();

    const hasEmailInOrders = orders.some(order => {
      const { email, contact_email } = order;
      const emailIsOrderEmail = email && email.trim().toLowerCase() === lowerEmail;
      const emailIsOrderContactEmail = contact_email && contact_email.trim().toLowerCase() === lowerEmail;

      return emailIsOrderEmail || emailIsOrderContactEmail;
    });

    return {
      hasError: false,
      response: {
        set_attributes: {
          customer: hasEmailInOrders ? 'existing' : 'new'
        }
      }
    };
  } catch (error) {
    return { hasError: true, errorMessage: `Error: ${error}` };
  }
};

export const handler: Handler = async event => {
  const { hasError, errorMessage, response } = await handleCheckShopifyCustomer(event);

  return {
    statusCode: hasError ? 400 : 200,
    body: hasError ? errorMessage : JSON.stringify(response)
  };
};
