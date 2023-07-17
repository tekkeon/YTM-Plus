import { MAIN_URL } from "../constants";

export const openTab = () => {
  chrome.tabs.query({ url: MAIN_URL }, (tabs) => {
    if (tabs && tabs[0]) {
      chrome.tabs.update(tabs[0].id as number, { highlighted: true });
    } else {
      chrome.tabs.create({ url: MAIN_URL });
    }
  });
};
