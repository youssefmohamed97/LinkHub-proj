import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
export default defineApp({
  name: 'Rock',
  key: 'rock',
  iconUrl: '{BASE_URL}/apps/rock/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/rock/connection',
  supportsConnections: true,
  baseUrl: 'https://rock.so',
  apiBaseUrl: 'https://api.rock.so/webhook/bot',
  primaryColor: '000000',
  auth,
  actions,
});
