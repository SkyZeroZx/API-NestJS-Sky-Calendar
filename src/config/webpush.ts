const webpush = require("web-push");
import { vapidKeys } from './config';

 

export default (): void => {
  webpush.setVapidDetails(
    'mailto:test@test.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
};