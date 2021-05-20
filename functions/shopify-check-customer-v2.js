const fetch = require('node-fetch');

const handleCheckShopifyCustomer = async event => {
  const payload = JSON.parse(event.body);

  const { email, store_url, password } = payload;
  const shopifyOrdersUrl = `https://${store_url}/admin/api/2021-04/orders.json?status=any&email=${email}`;

  try {
    const data = await fetch(shopifyOrdersUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': password
      }
    }).then(r => r.json());

    const { orders } = data;

    if (!orders) {
      return { hasError: true, errorMessage: `Shopify error: ${data.errors}` };
    }

    return {
      hasError: false,
      response: {
        set_attributes: {
          customer: orders.length ? 'existing' : 'new'
        }
      }
    };
  } catch (error) {
    return { hasError: true, errorMessage: `Error: ${error}` };
  }
};

exports.handler = async event => {
  const { hasError, errorMessage, response } = await handleCheckShopifyCustomer(event);

  return {
    statusCode: hasError ? 400 : 200,
    body: hasError ? errorMessage : JSON.stringify(response)
  };
};
