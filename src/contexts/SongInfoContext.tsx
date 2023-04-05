import React, { createContext, useState, useContext, useEffect } from "react";
import { MessageType } from "../constants";
import { messaging } from "../util/chrome";
import { SongInfo } from "../types";

interface SongInfoContextValue {
  songInfo: SongInfo | null;
  loading: boolean;
}

const SongInfoContext = createContext<SongInfoContextValue>({
  songInfo: null,
  loading: true,
});

interface SongInfoProviderProps {
  children: React.ReactNode;
}

export function SongInfoProvider({ children }: SongInfoProviderProps) {
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    messaging
      .sendToYTMTab({ type: MessageType.GET_SONG_INFO })
      .then((info: SongInfo) => {
        setSongInfo(info);
        setLoading(false);
        console.log(info);
      });

    chrome.runtime.onMessage.addListener(function (message) {
      switch (message.type) {
        case MessageType.SONG_UPDATED:
          setSongInfo(message.payload);
          setLoading(false);
          console.log(message.payload);
          break;
      }
    });
  }, []);

  const value: SongInfoContextValue = {
    songInfo,
    loading,
  };

  return (
    <SongInfoContext.Provider value={value}>
      {children}
    </SongInfoContext.Provider>
  );
}

export const useSongInfo = () => useContext(SongInfoContext);
export default SongInfoContext;
