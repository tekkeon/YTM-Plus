import SpotifyWebApi from 'spotify-web-api-js';

import config from '../../config';
import { MessageHandler } from '../../types';
import { getAccessToken } from '../../util/spotify';

const spotifyApi = new SpotifyWebApi();

export const handleSpotifyToYTM: MessageHandler = async (
  payload,
  sender,
  sendResponse
) => {
  const trackId = payload.trackId;

  const accessToken = await getAccessToken(
    config.spotify.clientId,
    config.spotify.secretId
  );

  spotifyApi.setAccessToken(accessToken);
  const spotifyTrack = await spotifyApi.getTrack(trackId);

  const query = `${spotifyTrack.name} ${spotifyTrack.artists?.[0]?.name ?? ''}`;
  const ytmId = await findYoutubeMusicTrack(query);

  sendResponse && sendResponse(ytmId);
};

const extractVideoId = (text: string) => {
  const regex = /(?:videoId\\x22:\\x22)(.{11})(?:\\x22,)/;
  return text.match(regex)?.[1];
};

const findYoutubeMusicTrack = (query: string) => {
  return fetch(`https://music.youtube.com/search?q=${encodeURI(query)}`, {
    credentials: 'omit',
  })
    .then((res) => res.text())
    .then(extractVideoId);
};
