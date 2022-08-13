import * as webpush from 'web-push';

import { vapidKeys } from './config';

export default (): void => {
  webpush.setVapidDetails(
    'mailto:nodetestui@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
};