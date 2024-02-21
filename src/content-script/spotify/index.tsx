// import { MessageType } from '../../constants';
import { storage } from '../../util/chrome';
import React from 'react';
import ReactDOM from 'react-dom';
// import RedirectOption from './RedirectOption';
import SpotifyToYtmDisabledMessage from './SpotifyToYtmDisabledMessage';
import { Options } from '../../types';

// var oldHref = document.location.href;

function docReady(fn: any) {
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

docReady(async () => {
  const options = (await storage.get('options')) as Options;
  if (!options.spotifyToYTM) {
    return;
  }

  const hasShownSpotifyDisabledMessage = (await storage.get(
    'hasShownSpotifyDisabledMessage'
  )) as boolean;

  if (hasShownSpotifyDisabledMessage) {
    return;
  }

  appendSpotifyDisabledMessage();

  await storage.set({ hasShownSpotifyDisabledMessage: true });

  // tryYTMRedirect();

  // const observer = new MutationObserver((mutations) => {
  //   mutations.forEach(() => {
  //     if (oldHref != document.location.href) {
  //       oldHref = document.location.href;
  //       tryYTMRedirect();
  //     }
  //   });
  // });

  // observer.observe(document.body, {
  //   childList: true,
  //   subtree: true,
  // });
});

// const tryYTMRedirect = () => {
//   const urlParams = new URLSearchParams(window.location.search);

//   let spotifyTrackId: string | undefined;

//   if (urlParams.get('highlight')) {
//     spotifyTrackId = urlParams.get('highlight')?.split(':')[2];
//   } else if (window.location.pathname.includes('track')) {
//     const urlParts = window.location.pathname.split('/');
//     spotifyTrackId = urlParts[urlParts.length - 1].split('?')[0];
//   }

//   if (spotifyTrackId) {
//     messaging
//       .sendToRuntime({
//         type: MessageType.SPOTIFY_TO_YTM,
//         payload: {
//           trackId: spotifyTrackId,
//         },
//       })
//       .then(appendRedirectOption);
//   }
// };

// const appendRedirectOption = (songInfo: Omit<SongInfo, 'queue' | 'year'>) => {
//   let redirectOptionDiv = document.getElementById('redirect-option-div');
//   if (redirectOptionDiv) {
//     document.body.removeChild(redirectOptionDiv);
//   }

//   redirectOptionDiv = document.createElement('div');
//   redirectOptionDiv.style.display = 'block';
//   redirectOptionDiv.id = 'redirect-option-div';
//   document.body.appendChild(redirectOptionDiv);

//   ReactDOM.render(<RedirectOption songInfo={songInfo} />, redirectOptionDiv);
// };

const appendSpotifyDisabledMessage = () => {
  let spotifyDisabledDiv = document.getElementById('spotify-disabled-div');
  if (spotifyDisabledDiv) {
    document.body.removeChild(spotifyDisabledDiv);
  }

  spotifyDisabledDiv = document.createElement('div');
  spotifyDisabledDiv.style.display = 'block';
  spotifyDisabledDiv.id = 'spotify-disabled-div';
  document.body.appendChild(spotifyDisabledDiv);

  ReactDOM.render(<SpotifyToYtmDisabledMessage />, spotifyDisabledDiv);
};
