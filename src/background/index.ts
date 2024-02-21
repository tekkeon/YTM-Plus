import { MessageType } from '../constants';
import { storage } from '../util/chrome';
import { DefaultOptions } from '../constants';
import {
  handleSongUpdated,
  handleScrobble,
  handleSpotifyToYTM,
} from './handlers';
import { LastFMSession, Options } from '../types';
import { Event, sendEvents } from '../util/analytics';

const injectContentScriptOnInstall = () => {
  const contentScripts = chrome.runtime.getManifest().content_scripts;
  if (contentScripts) {
    for (const cs of contentScripts) {
      return new Promise((resolve) => {
        chrome.tabs.query({ url: cs.matches }, (tabs: chrome.tabs.Tab[]) => {
          tabs.forEach((tab, index) => {
            chrome.tabs.executeScript(tab.id!, { file: cs.js![0] }, () => {
              if (index === tabs.length - 1) {
                resolve(undefined);
              }
            });
          });
        });
      });
    }
  }
};

const sendAnalyticsOnUpdate = async () => {
  const options = (await storage.get('options')) as Options;
  const lastFmInfo = (await storage.get('lastfm-info')) as LastFMSession;

  const events: Event[] = [];

  Object.keys(options)
    .filter((key) => !['miniTheme', 'popoutWindow'].includes(key))
    .forEach((key) => {
      events.push({
        name: `${key}_option_changed`,
        params: {
          enabled: options[key as keyof Options] ?? false,
          onUpdate: true,
        },
      });
    });

  console.log(lastFmInfo);

  if (lastFmInfo) {
    events.push({
      name: 'lastfm_logged_in',
      params: {
        onUpdate: true,
      },
    });
  }

  sendEvents(events);
};

chrome.runtime.onInstalled.addListener(function (details) {
  injectContentScriptOnInstall();

  switch (details.reason) {
    case 'install':
      storage
        .set({
          options: DefaultOptions,
        })
        .then(() => {
          chrome.tabs.create({ url: 'html/options.html' });
        });
      break;

    case 'update':
      // Add any new default options fields on update
      storage
        .get('options')
        .then((options) => {
          storage.set({
            options: {
              ...DefaultOptions,
              ...options,
            },
          });

          return options;
        })
        .then(() => sendAnalyticsOnUpdate());
      break;
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case MessageType.SONG_UPDATED:
      handleSongUpdated(message.payload, sender, sendResponse);
      break;

    case MessageType.SCROBBLE_TRACK:
      handleScrobble(message.payload, sender, sendResponse);
      break;

    case MessageType.SPOTIFY_TO_YTM:
      handleSpotifyToYTM(message.payload, sender, sendResponse);
      return true;

    case MessageType.REDIRECT_TO_OPTIONS:
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.update(tabs[0].id!, {
          url: `html/options.html${message.payload.query ?? ''}`,
        });
      });
      break;
  }
});
