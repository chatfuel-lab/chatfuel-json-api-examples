# Chatfuel JSON API examples

[![netlify-deploy](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/chatfuel-lab/chatfuel-json-api-examples)

## Installation

Click `Deploy to Netlify` button, or:

1. Fork this repository
2. Sign up to [netlify.com](https://netlify.com)
3. Choose `New site from git` option and follow the instructions

## Usage

### Business hours

Bot admin enters their business hours; an attribute is set for 'open' or 'closed' based on the current time

Your JSON API is `POST https://{your-netlify-app-name}.netlify.app/api/functions/business-hours`

**Parameters**

- `tz` - time zone, either number in hours or name [see](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
- `Monday..Sunday` - day working hour in format `h:mmAM-h:mmPM`

**Attributes**

This JSON API setups those attributes to bot user:

- `business` - `open` if current time inside working hours, `closed` otherwise

### Shopify check customer

Look up an email address in the Shopify store to check if that user has placed an order before or not

Your JSON API is `POST https://{your-netlify-app-name}.netlify.app/api/functions/shopify-check-customer-v2`

**Parameters**

- `email` - user email
- `store_url` - Shopify store url
- `password` - Shopify store password

**Attributes**

This JSON API setups those attributes to bot user:

- `customer` - `existing` if email found in shop orders, `new` otherwise

### Shopify create discount

Create a unique discount code in Shopify using different parameters like % off or % off, days until expiration, one-time use or not, etc.

Your JSON API is `POST https://{your-netlify-app-name}.netlify.app/api/functions/shopify-discount`

**Parameters**

- `store_url` - Shopify store url
- `password` - Shopify store password
- `timezone` - user timezone
- `expiration` - days until expiration
- `discount_value` - amount of discount
- `discount_type` - percentage or amount
- `one_use_per_customer` - if `true` then only one customer can use it
- `times_code_can_be_used` - number of times discount can be used

**Attributes**

This JSON API setups those attributes to bot user:

- `discount_code` - allocated code,
- `expiration_date` - discount code expiration date

### Verify email

Check if the input a user has entered is an email or not (checks to see if domain exists, not just that it uses an '@' symbol and '.') - also fixes validation loop with built-in email validation

Your JSON API is `GET https://{your-netlify-app-name}.netlify.app/api/functions/verify-email`

**Parameters**

- `email` - email

**Attributes**

This JSON API setups those attributes to bot user:

- `emailValid` - `true` if email is valid, `false` otherwise

### Verify phone

Check if the input a user has entered is a phone number or not (checks to see if phone number is registered, not just that it contains a certain amount of digits) - also fixes validation loop with built-in email validation + removes any text and special characters in message

Your JSON API is `POST https://{your-netlify-app-name}.netlify.app/api/functions/verify-phone`

**Parameters**

- `phone` - phone

**Attributes**

This JSON API setups those attributes to bot user:

- `phoneValid` - `true` if email is valid, `false` otherwise
