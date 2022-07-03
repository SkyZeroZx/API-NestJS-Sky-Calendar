const webpush = require("web-push");

import { vapidKeys } from './config';

export default (): void => {
  webpush.setVapidDetails(
    'mailto:nodetestui@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
};