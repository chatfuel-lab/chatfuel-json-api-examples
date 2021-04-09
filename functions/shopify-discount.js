const fetch = require('node-fetch');
const { months, getDateInTimezone, DAY_IN_MS } = require('./utils/date-utils');

const generateRandomDC = (length = 255) => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return [...Array(length)].map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}

exports.handler = async (event) => {
  const payload = JSON.parse(event.body);
  const { timezone, expiration, discount_value, discount_type } = payload;
  const { store_url, password } = payload;

  const discountCode = generateRandomDC(8);
  const startsAt = new Date();
  const endsAt = new Date(startsAt.getTime() + expiration * DAY_IN_MS);

  const priceRulesPayload = (await fetch(`https://${store_url}/admin/api/2021-04/price_rules.json`, {
    method: 'post',
    body: JSON.stringify({
      price_rule: {
        title: discountCode,
        target_type: "line_item",
        target_selection: "all",
        allocation_method: "across",
        value_type: discount_type,
        value: discount_value,
        customer_selection: "all",
        starts_at: startsAt.toJSON(),
        ends_at: endsAt.toJSON()
      }
    }),
    headers: {'X-Shopify-Access-Token': password},
  })).json();

  const id = priceRulesPayload.price_rule.id;

  const discountPayload = (await fetch(`https://${store_url}/admin/api/2021-04/price_rules/${id}/discount_codes.json`, {
    method: 'post',
    body: JSON.stringify({
      discount_code: {
        code: discountCode
      }
    }),
    headers: {'X-Shopify-Access-Token': password},
  })).json();

  const startsAtInTimezone = getDateInTimezone(timezone, new Date(priceRulesPayload.price_rule.starts_at));
  const endsAtInTimezone = getDateInTimezone(timezone, new Date(priceRulesPayload.price_rule.ends_at));

  const endsMonth = months[endsAtInTimezone.getMonth()];
  const endsDay = endsAtInTimezone.getDate();
  const endsYear = endsAtInTimezone.getFullYear();

  const response = {
    set_attributes:
      {
        discount_code: discountPayload.discount_code.code,
        starts_at: startsAtInTimezone.toJSON(),
        ends_at: endsAtInTimezone.toJSON(),
        expiration_month: endsMonth,
        expiration_day: endsDay,
        expiration_year: endsYear,
        expiration_date: `${endsMonth} ${endsDay}, ${endsYear}`
      }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};
