import getWebhooks from '../common/get-webhooks.js';

const verifyCredentials = async ($) => {
  const response = await getWebhooks($);
  const successful = Array.isArray(response.data);

  if (!successful) {
    throw new Error('Failed while authorizing!');
  }

  await $.auth.set({
    screenName: $.auth.data.username,
    username: $.auth.data.username,
    password: $.auth.data.password,
    apiKey: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
