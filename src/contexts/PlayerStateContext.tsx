import React, { createContext, useState, useContext, useEffect } from 'react';
import { messaging } from '../util/chrome';
import { MessageType } from '../constants';
import { PlayerState, Message, SongInfo } from '../types';

const PlayerStateContext = createContext<PlayerState | null>(null);

interface PlayerStateProviderProps {
  children: React.ReactNode
}

export function PlayerStateProvider({ children }: PlayerStateProviderProps) {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    progress: 0,
    thumbDown: false,
    thumbUp: false,
    trackTime: null,
    volume: '50'
  });

  useEffect(() => {
    messaging
      .sendToYTMTab({ type: MessageType.GET_PLAYER_STATE })
      .then((info: PlayerState) => {
        setPlayerState(info);
        console.log(info);
      });

    chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
      switch(message.type) {
        case MessageType.PLAYER_STATE_UPDATED:
          setPlayerState(message.payload);
          break;
      }
    })
  }, [])

  return (
    <PlayerStateContext.Provider value={playerState}>
      {children}
    </PlayerStateContext.Provider>
  )
}

export const usePlayerState = (): PlayerState | null => useContext(PlayerStateContext);
export default PlayerStateContext;