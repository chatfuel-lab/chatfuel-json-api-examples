const dns = require('dns');

// Check if the lookup response contains ENOTFOUND or ENODATA - if so, it's not valid
const hasMxRecordError = error => {
  return error && (error.code === 'ENOTFOUND' || error.code === 'ENODATA');
};

// Perform an MX lookup - check if the DNS record exists
const findMxRecords = email => {
  return new Promise((resolve, reject) => {
    // Find the domain name from the email
    const [, domain] = email.split('@');

    // If we get a valid MX record response, it's a valid email
    dns.resolveMx(domain, (error, addresses) => {
      if (hasMxRecordError(error)) {
        reject(new Error('Email has invalid MX record'));
      } else {
        resolve(addresses);
      }
    });
  });
};

const checkIsValid = async (email) => {
  if (!email.includes('@')) return false;

  try {
    await findMxRecords(email);
    return true;
  } catch (error) {
    return false;
  }
}

// Verify an email address
exports.handler = async (event) => {
  const { email } = event.queryStringParameters || {};

  const emailIsValid = await checkIsValid(email);

  const response = {
    set_attributes: {
      emailValid: emailIsValid,
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}

