import { MessageType } from '../constants';
import { PlayerState, Session, SongInfo } from '../types';
import { messaging } from '../util/chrome';
import { updateSession } from '../util/firebase';

var tabId: number | null = null;

export function setTabId(id: number) {
  tabId = id;
}

export function setTabAsViewer() {
  setInterval(() => {
    tabId && messaging.sendToTab(tabId, {
      type: MessageType.SET_TAB_AS_VIEWER
    })
  }, 1000);
}

export function initializeHostMessageHandler(id: string) {
  let isPlaying = false;
  let recentlySent = false;

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (sender?.tab?.id !== tabId) {
      return;
    }

    switch(message.type) {
      case MessageType.SONG_UPDATED:
        const songInfo = message.payload as SongInfo;
        const next = songInfo?.queue && songInfo?.queue[0];

        updateSession({
          id,
          songInfo: {
            ...message.payload,
            queue: [next]
          },
        })
        break;

      case MessageType.PLAYER_STATE_UPDATED:
        const playerState = message.payload as PlayerState;

        if (isPlaying !== playerState.isPlaying || !recentlySent) {
          isPlaying = playerState.isPlaying;
          recentlySent = true;

          setTimeout(() => {
            recentlySent = false
          }, 10000);

          updateSession({
            id,
            playerState: message.payload
          })
        }
        break;
    }
  })
};

export function handleRemoteSessionUpdate(session: Session) {
  if (tabId) {
    messaging.sendToTab(tabId, {
      type: MessageType.REMOTE_SESSION_UPDATED,
      payload: session
    });
  }
}

window.onclose = () => {
  if (tabId) {
    messaging.sendToTab(tabId, {
      type: MessageType.SET_TAB_AS_VIEWER,
      payload: false
    })
  }
}