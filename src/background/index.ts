import { MessageType } from "../constants";
import { storage } from "../util/chrome";
import { DefaultOptions } from "../constants";
import { Options } from "../types";

import {
  handleLaunchSync,
  handleSongUpdated,
  handleScrobble,
  handleSpotifyToYTM,
} from "./handlers";

chrome.runtime.onInstalled.addListener(function (details) {
  switch (details.reason) {
    case "install":
      storage
        .set({
          options: DefaultOptions,
        })
        .then(() => {
          chrome.tabs.create({ url: "html/options.html" });
        });

    case "update":
      // Add any new default options fields on update
      storage
        .get("options")
        .then((options) =>
          storage.set({
            options: {
              ...DefaultOptions,
              ...options,
            },
          })
        )
        .then(() => {
          chrome.tabs.create({ url: "html/options.html" });
        });
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case MessageType.LAUNCH_SYNC:
      handleLaunchSync(message.payload, sender, sendResponse);
      break;

    case MessageType.SONG_UPDATED:
      handleSongUpdated(message.payload, sender, sendResponse);
      break;

    case MessageType.SCROBBLE_TRACK:
      handleScrobble(message.payload, sender, sendResponse);
      break;

    case MessageType.SPOTIFY_TO_YTM:
      handleSpotifyToYTM(message.payload, sender, sendResponse);
      return true;
  }
});
