import React, { createContext, useState, useContext, useEffect } from 'react';
import { MessageType } from '../constants';
import { messaging } from '../util/chrome';
import { SongInfo } from '../types';

const SongInfoContext = createContext<SongInfo | null>(null);

interface SongInfoProviderProps {
  children: React.ReactNode
}

export function SongInfoProvider({ children }: SongInfoProviderProps) {
  const [songInfo, setSongInfo] = useState<SongInfo>({
    album: '',
    albumArtUrl: '',
    artist: '',
    queue: [],
    title: '',
    id: '',
    year: '',
  });

  useEffect(() => {
    messaging
      .sendToYTMTab({ type: MessageType.GET_SONG_INFO })
      .then((info: SongInfo) => {
        setSongInfo(info);
        console.log(info);
      });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      switch(message.type) {
        case MessageType.SONG_UPDATED:
          setSongInfo(message.payload);
          console.log(message.payload);
          break;
      }
    })
  }, [])

  return (
    <SongInfoContext.Provider value={songInfo}>
      {children}
    </SongInfoContext.Provider>
  )
}

export const useSongInfo = () => useContext(SongInfoContext);
export default SongInfoContext;