import appConfig from '../../config/app.js';
import { getLicense } from '../../helpers/license.ee.js';

const getAutomatischInfo = async () => {
  const license = await getLicense();

  const computedLicense = {
    id: license ? license.id : null,
    name: license ? license.name : null,
    expireAt: license ? license.expireAt : null,
    verified: license ? true : false,
  };

  return {
    isCloud: appConfig.isCloud,
    isMation: appConfig.isMation,
    license: computedLicense,
  };
};

export default getAutomatischInfo;
