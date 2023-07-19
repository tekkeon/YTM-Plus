import { MAIN_URL } from '../constants';
import { Message } from '../types';

export const storage = {
  set(items: any): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(items, () => {
        if (chrome.runtime.lastError?.message) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    });
  },
  get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, (result) => {
        if (chrome.runtime.lastError?.message) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(result[key]);
        }
      });
    });
  },
  remove(keys: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.remove(keys, () => {
        if (chrome.runtime.lastError?.message) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    });
  },
};

export const messaging = {
  sendToTab<T>(tabId: number, message: Message) {
    return new Promise<T>((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        resolve(response);
      });
    });
  },
  sendToYTMTab(message: Message, excludedTabs?: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ url: MAIN_URL }, (tabs) => {
        console.log('Sending message:', message);
        if (!tabs[0]?.id) {
          resolve(false);
        } else {
          chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
            resolve(response);
          });
        }
      });
    });
  },
  sendToRuntime(message: Message): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (
          chrome.runtime.lastError &&
          !chrome.runtime.lastError.message?.includes('The message port closed')
        ) {
          console.warn(chrome.runtime.lastError.message);
        } else {
          resolve(response);
        }
      });
    });
  },
};

export const tabs = {
  getYtmTabs(): Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ url: MAIN_URL }, (tabs) => {
        resolve(tabs);
      });
    });
  },
  openTab(tabId: number) {
    chrome.tabs.update(tabId, { highlighted: true });
  },
};
