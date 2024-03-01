const addAuthHeader = ($, requestConfig) => {
  const authData = $.auth.data;
  if (authData?.accessToken && authData?.tokenType) {
    const authorizationHeader = `${authData.tokenType} ${authData.accessToken}`;
    requestConfig.headers.Authorization = authorizationHeader;
  }

  return requestConfig;
};

export default addAuthHeader;
