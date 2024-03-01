import { URLSearchParams } from 'url';

const refreshToken = async ($) => {
  // ref: https://docs.gitlab.com/ee/api/oauth2.html#authorization-code-flow

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    refresh_token: $.auth.data.refreshToken,
  });

  const { data } = await $.http.post('/oauth/token', params.toString());

  await $.auth.set({
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
    refreshToken: data.refresh_token,
  });
};

export default refreshToken;
