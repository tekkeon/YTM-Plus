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
  if (details.reason == "install") {
    storage
      .set({
        options: DefaultOptions,
      })
      .then(() => {
        chrome.tabs.create({ url: "html/options.html" });
      });
  }
});

chrome.tabs.onUpdated.addListener(() => {
  storage.get("options").then((options: Options) => {
    const newOptions = {
      ...DefaultOptions,
      ...options,
    };

    storage.set({ options: newOptions });
  });
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
