import { messaging } from "../../util/chrome";
import { MessageType } from "../../constants";
import { MessageHandler } from "../../types";

export const handleLaunchSync: MessageHandler = (
  payload,
  sender,
  sendResponse
) => {
  chrome.windows.create(
    {
      height: 600,
      width: 300,
      url: chrome.runtime.getURL("html/sync.html"),
      type: "popup",
    },
    (window) => {
      console.log(window);

      setTimeout(() => {
        window?.tabs &&
          window.tabs[0].id &&
          messaging.sendToTab(window.tabs[0].id, {
            type: MessageType.SET_YTM_TAB_ID,
            payload: sender.tab.id,
          });
      }, 1500);
    }
  );
};
