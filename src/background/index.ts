import { scrobbleTrack } from '../util/lastFM';
import { MessageType } from '../constants';
import { storage, messaging } from '../util/chrome';
import { MessageHandler, Options } from '../types';
import { DefaultOptions } from '../constants';

chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    storage.set({
      options: DefaultOptions
    }).then(() => {
      chrome.tabs.create({ url: "html/options.html" });
    })
  }
});

chrome.tabs.onUpdated.addListener(() => {
  storage.get('options')
    .then((options: Options) => {
      const newOptions = {
        ...DefaultOptions,
        ...options
      };

      storage.set({ options: newOptions });
    })
}); 

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch(message.type) {
    case MessageType.LAUNCH_SYNC:
      handleLaunchSync(message.payload, sender, sendResponse);
      break;

    case MessageType.SONG_UPDATED:
      handleSongUpdated(message.payload, sender, sendResponse);
      break;

    case MessageType.SCROBBLE_TRACK:
      handleScrobble(message.payload, sender, sendResponse);
      break;
  }
});

const handleLaunchSync: MessageHandler = (payload, sender, sendResponse) => {
  chrome.windows.create({
    height: 600,
    width: 300,
    url: chrome.runtime.getURL('html/sync.html'),
    type: 'popup'
  }, (window) => {
    console.log(window);

    setTimeout(() => {
      window?.tabs && window.tabs[0].id && messaging.sendToTab(window.tabs[0].id, {
        type: MessageType.SET_YTM_TAB_ID,
        payload: sender.tab.id
      })
    }, 1500);
  })
}

const handleSongUpdated: MessageHandler = (payload) => {
  storage.get('options')
    .then(options => {
      if (options.notifications) {
        chrome.tabs.query({ active: true }, tabs => {
          // Don't notifify if user is on music.youtube tab
          if (!tabs[0]?.url?.includes('music.youtube')) {
            // Don't notifiy if user has popup open
            var views = chrome.extension.getViews({ type: "popup" });
            if (views.length === 0) {
              const options = {
                type: "basic",
                iconUrl: "assets/128-icon.png",
                title: payload.title,
                message: `${payload.artist} \u2022 ${payload.album} \u2022 ${payload.year}`,
              }

              chrome.notifications.create(options);
            }
          }
        });
      }
    })
}

const handleScrobble: MessageHandler = (payload, sender, sendResponse) => {
  scrobbleTrack(payload)
}