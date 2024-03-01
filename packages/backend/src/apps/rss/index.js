import defineApp from '../../helpers/define-app.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'RSS',
  key: 'rss',
  iconUrl: '{BASE_URL}/apps/rss/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/rss/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: 'ff8800',
  triggers,
});
