import defineApp from '../../helpers/define-app.js';
// import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
export default defineApp({
  name: 'RingCentral',
  key: 'ringcentral',
  iconUrl: '{BASE_URL}/apps/ringcentral/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/ringcentral/connection',
  supportsConnections: true,
  baseUrl: 'https://hooks.ringcentral.com',
  apiBaseUrl: 'https://hooks.ringcentral.com/webhook/v2',
  primaryColor: '000000',
  auth,
  actions,
});
