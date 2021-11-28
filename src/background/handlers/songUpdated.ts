import { storage } from "../../util/chrome";
import { MessageHandler } from "../../types";

export const handleSongUpdated: MessageHandler = (payload) => {
  storage.get("options").then((options) => {
    if (options.notifications) {
      chrome.tabs.query({ active: true }, (tabs) => {
        // Don't notifify if user is on music.youtube tab
        if (!tabs[0]?.url?.includes("music.youtube")) {
          // Don't notifiy if user has popup open
          var views = chrome.extension.getViews({ type: "popup" });
          if (views.length === 0) {
            const options = {
              type: "basic",
              iconUrl: "assets/128-icon.png",
              title: payload.title,
              message: `${payload.artist} \u2022 ${payload.album} \u2022 ${payload.year}`,
            };

            chrome.notifications.create(options);
          }
        }
      });
    }
  });
};
