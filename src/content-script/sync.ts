import { messaging } from '../util/chrome';
import { MessageType } from '../constants';
import Friends from '../assets/friends.svg';
import { MessageHandler, Session } from '../types';
import { getPlayerState } from './shared';

const initializeSync = () => {
  var css = `
    .sync-button {
      cursor: pointer;
      opacity: .5;
      position: fixed;
      right: 60px;
      top: 14px;
      width: 35px;
      z-index: 2000;
    }

    .sync-button:hover {
      opacity: 1;
    }

    .viewer-banner {
      background: red;
      color: white;
      font-size: 14px;
      left: 0;
      padding: 3px 0;
      position: fixed;
      text-align: center;
      top: 0;
      width: 100%;
      z-index: 1000;
    }
  `;

  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css))

  document.head.appendChild(style);

  const iconSyncButton = document.createElement('img');
  iconSyncButton.src = Friends;
  iconSyncButton.className = 'sync-button';

  iconSyncButton.addEventListener('click', () => {
    messaging.sendToRuntime({
      type: MessageType.LAUNCH_SYNC
    });
  });

  document.body.appendChild(iconSyncButton);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.type) {
      case MessageType.REMOTE_SESSION_UPDATED:
        handleRemoteSessionUpdated(message.payload);
        break;

      case MessageType.SET_TAB_AS_VIEWER:
        handleSetTabAsViewer();
        break;
    }
  })
}

const handleRemoteSessionUpdated: MessageHandler = (payload: Session) => {
  console.log('handleRemoteSessionUpdated');
  const playerState = getPlayerState();

  if (payload.playerState?.isPlaying !== playerState.isPlaying) {
    (document.querySelector('.play-pause-button') as HTMLElement).click();
  }

  if (payload?.songInfo?.id && !window.location.href.includes(payload.songInfo.id)) {
    if (playerState.isPlaying) {
      (document.querySelector('.play-pause-button') as HTMLElement).click();
    }
    window.location.href = `https://music.youtube.com/watch?v=${payload?.songInfo?.id}&viewer=true`;
  }
}

let timeoutRef: NodeJS.Timeout;
const handleSetTabAsViewer: MessageHandler = () => {
  if (timeoutRef) {
    clearTimeout(timeoutRef);
  }

  if (!document.querySelector('.viewer-banner')) {
    const viewerBanner = document.createElement('div');
    viewerBanner.textContent = 'This tab is being controlled by YT Music Mini Sync';
    viewerBanner.className = 'viewer-banner';

    document.body.appendChild(viewerBanner);
  }

  timeoutRef = setTimeout(() => {
    const viewerBanner = document.getElementsByClassName('viewer-banner')[0];
    document.body.removeChild(viewerBanner);
  }, 2000);
}

export default initializeSync;