import React, { createContext, useEffect, useState } from 'react';
import { messaging, tabs } from '../util/chrome';
import { Message, PlayerState, SongInfo } from '../types';
import { MessageType } from '../constants';

export interface IEnrichedTab {
  tab: chrome.tabs.Tab;
  songInfo: SongInfo | null;
  playerState: PlayerState | null;
}

interface ITabContext {
  loading: boolean;
  tabs: IEnrichedTab[];
  setTabs: React.Dispatch<React.SetStateAction<IEnrichedTab[]>>;
  sendMessageToTabs: (message: any) => void;
}

const TabContext = createContext<ITabContext>({
  loading: true,
  tabs: [],
  setTabs: () => {},
  sendMessageToTabs: () => {},
});

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTabs, setSelectedTabs] = useState<IEnrichedTab[]>([]);
  const [loading, setLoading] = useState(true);

  const enrichTabs = async (tabs: chrome.tabs.Tab[]) => {
    const enrichedTabs = await Promise.all(
      tabs.map(async (tab) => {
        const songInfo = (await messaging.sendToTab(tab.id!, {
          type: MessageType.GET_SONG_INFO,
        })) as SongInfo;
        const playerState = (await messaging.sendToTab(tab.id!, {
          type: MessageType.GET_PLAYER_STATE,
        })) as PlayerState;

        return {
          tab,
          songInfo,
          playerState,
        };
      })
    );

    return enrichedTabs;
  };

  useEffect(() => {
    setLoading(true);

    const getTabs = async () => {
      const ytmTabs = await tabs.getYtmTabs();
      const enrichedTabs = await enrichTabs(ytmTabs);

      // If there's only one tab, return it
      if (ytmTabs.length === 1) {
        return enrichedTabs;
      }

      const playingTabs = enrichedTabs.filter(
        (tab) => tab.playerState?.isPlaying
      );

      // If there's only one playing tab, return it
      if (playingTabs.length === 1) {
        return playingTabs;
      }

      // Don't auto select a tab if there's more than one playing tab or no playing tabs
      return enrichedTabs;
    };

    getTabs().then((tabs) => {
      setSelectedTabs(tabs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const listeners: any[] = [];

    selectedTabs.forEach((tab, index) => {
      const listener = (
        message: Message,
        sender: chrome.runtime.MessageSender
      ) => {
        if (sender.tab?.id !== tab.tab.id) return;

        switch (message.type) {
          case MessageType.PLAYER_STATE_UPDATED:
            tab.playerState = message.payload;
            setSelectedTabs([...selectedTabs]);
            break;

          case MessageType.SONG_UPDATED:
            tab.songInfo = message.payload;
            setSelectedTabs([...selectedTabs]);
            break;
        }
      };

      listeners.push(listener);

      chrome.runtime.onMessage.addListener(listener);
    });

    return () => {
      listeners.forEach((listener) => {
        chrome.runtime.onMessage.removeListener(listener);
      });
    };
  }, [selectedTabs]);

  const sendToSelectedTab = async (message: any) => {
    if (selectedTabs.length !== 1) {
      return;
    }

    return await messaging.sendToTab(selectedTabs[0].tab.id!, message);
  };

  const value: ITabContext = {
    loading,
    tabs: selectedTabs,
    setTabs: setSelectedTabs,
    sendMessageToTabs: sendToSelectedTab,
  };

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export const useTabs = () => React.useContext(TabContext);
