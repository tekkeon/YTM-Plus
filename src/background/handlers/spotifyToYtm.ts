import SpotifyWebApi from "spotify-web-api-js";

import config from "../../config";
import { MessageHandler } from "../../types";
import { getAccessToken } from "../../util/spotify";

const spotifyApi = new SpotifyWebApi();

export const handleSpotifyToYTM: MessageHandler = (
  payload,
  sender,
  sendResponse
) => {
  const trackId = payload.trackId;

  getAccessToken(config.spotify.clientId, config.spotify.secretId)
    .then((token) => {
      spotifyApi.setAccessToken(token);
      return spotifyApi.getTrack(trackId);
    })
    .then((spotifyTrack) => {
      const query = `${spotifyTrack.name} ${
        spotifyTrack.artists?.[0]?.name ?? ""
      }`;
      console.log("query", query);
      return findYoutubeMusicTrack(query);
    })
    .then((ytmId) => {
      sendResponse && sendResponse(ytmId);
    });
};

const extractVideoId = (text: string) => {
  const regex = /(?:videoId\\x22:\\x22)(.{11})(?:\\x22,)/;
  return text.match(regex)?.[1];
};

const findYoutubeMusicTrack = (query: string) => {
  return fetch(`https://music.youtube.com/search?q=${encodeURI(query)}`)
    .then((res) => res.text())
    .then(extractVideoId);
};
