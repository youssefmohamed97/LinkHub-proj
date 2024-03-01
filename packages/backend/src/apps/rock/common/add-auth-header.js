const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.authenticationKey) {
    // const authorizationHeader = `Rock-Auth-Key ${$.auth.data.authenticationKey}`;
    // requestConfig.headers.Authorization = authorizationHeader;
  }

  // Add auth parameter to the URL
  const authParam = `auth=tNaIVOCIEYeoUx02Rf14sqPbF9S5Pm4yFfR2gNO092k`;
  const url = requestConfig.url + (authParam ? `?${authParam}` : '');

  console.log("our url is ",url)
  // Update the URL in the requestConfig
  requestConfig.url = url;

  return requestConfig;
};

export default addAuthHeader;
