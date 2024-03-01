const addAuthHeader = ($, requestConfig) => {
  requestConfig.headers['Content-Type'] = 'application/json';

  if (
    !requestConfig.additionalProperties?.skipAddingAuthHeader &&
    $.auth.data?.accessToken
  ) {
    requestConfig.headers.Authorization = `Bearer ${$.auth.data.accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
