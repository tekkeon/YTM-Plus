import { storage } from '../../util/chrome';
import { MessageHandler } from '../../types';

var dedupMessage = ``;

export const handleSongUpdated: MessageHandler = (payload) => {
  storage.get('options').then((options) => {
    if (options.notifications) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Don't notifify if user is on music.youtube tab
        if (!tabs[0]?.url?.includes('music.youtube')) {
          // Don't notifiy if user has popup open
          var views = chrome.extension.getViews({ type: 'popup' });
          if (views.length === 0) {
            const message = `${payload.title} \u2022 ${payload.artist} \u2022 ${payload.album} \u2022 ${payload.year}`;

            if (message === dedupMessage) {
              return;
            }

            dedupMessage = message;

            const options = {
              type: 'basic',
              iconUrl: 'assets/128-icon.png',
              title: payload.title,
              message,
            };

            chrome.notifications.create(options);
          }
        }
      });
    }
  });
};
