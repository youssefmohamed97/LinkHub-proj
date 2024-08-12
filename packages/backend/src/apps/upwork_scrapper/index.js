import defineApp from '../../helpers/define-app.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'UpworkScrapper',
  key: 'upwork_scrapper',
  iconUrl: '{BASE_URL}/apps/upwork_scrapper/assets/favicon.svg',
  authDocUrl: '',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: 'ff8800',
  triggers,
});
