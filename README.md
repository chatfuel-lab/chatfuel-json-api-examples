# Chatfuel JSON API examples

[![netlify-deploy](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ttypic/chatfuel-json-api-examples)

## Installation

Click `Deploy to Netlify` button, or:

1. Fork this repository
2. Sign up to [netlify.com](https://netlify.com)
3. Chose `New site from git` option and follow the instructions

## Usage 

### Current day of week and time

Your JSON API is `https://{your-netlify-app-name}.netlify.app/.netlify/functions/current-day-of-week?tz={time zone}`

**Parameters:**

- `tz` - time zone, either number in hours or name [see](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)  

**Attributes**

This JSON API setups those attributes to bot user: 

- `day` - "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun" day of week in provided time zone
- `hour` - hours in provided time zone
- `minute` - minutes in provided time zone
