import SpotifyWebApi from 'spotify-web-api-js';
import levenshtein from 'fast-levenshtein';

import config from '../../config';
import { MessageHandler, SongInfo } from '../../types';
import { getAccessToken } from '../../util/spotify';

type PartialSongInfo = Omit<SongInfo, 'queue' | 'year'>;

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

  const songInfo = await findYoutubeMusicTrack(
    spotifyTrack.name,
    spotifyTrack.artists?.[0]?.name ?? ''
  );

  sendResponse && sendResponse(songInfo);
};

const sanitizeTitle = (title: string) => {
  return title.replace(/ *\([^)]*\) */g, '').replace(/ *\[[^)]*\] */g, '');
};

const getFirstSongInfo = (apiResult: any): PartialSongInfo | null => {
  const sectionsList =
    apiResult.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer
      ?.content?.sectionListRenderer?.contents;

  if (!sectionsList) {
    return null;
  }

  const resultTrack = sectionsList.find(
    (section: any) =>
      section?.musicShelfRenderer?.title?.runs?.[0]?.text === 'Songs'
  )?.musicShelfRenderer?.contents?.[0]?.musicResponsiveListItemRenderer;

  if (!resultTrack) {
    return null;
  }

  const titleObj =
    resultTrack.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer
      ?.text?.runs?.[0];
  const title = titleObj?.text;
  const id = titleObj?.navigationEndpoint?.watchEndpoint?.videoId;

  const subtitleRuns =
    resultTrack.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer
      ?.text?.runs;
  const artist = subtitleRuns?.[2]?.text;
  const album = subtitleRuns?.[4]?.text;
  const albumArtUrl =
    resultTrack.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails?.[0]
      ?.url;

  if (!id) {
    return null;
  }

  return {
    title,
    artist,
    album,
    albumArtUrl,
    id,
  };
};

const getTopResultSongInfo = (apiResult: any): PartialSongInfo | null => {
  const resultTrack =
    apiResult.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer
      ?.content?.sectionListRenderer?.contents?.[0]?.musicCardShelfRenderer;

  if (!resultTrack) {
    return null;
  }

  const title = resultTrack.title?.runs?.[0]?.text;
  const artist = resultTrack.subtitle?.runs?.[2]?.text;
  const album = resultTrack.subtitle?.runs?.[4]?.text;
  const albumArtUrl =
    resultTrack.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails?.[0]
      ?.url;
  const id = resultTrack.onTap?.watchEndpoint?.videoId;

  if (!id) {
    return null;
  }

  return {
    title,
    artist,
    album,
    albumArtUrl,
    id,
  };
};

const extractSongInfoOptions = (text: string): (PartialSongInfo | null)[] => {
  const regex = /search',.*data\: '(.*)'\}\)\;ytcfg/;
  const matches = text.match(regex);
  let match = matches?.[1];

  if (!match) {
    return [];
  }

  match = match.replace(/\\x/g, '%');
  let decodedMatch = decodeURIComponent(match);
  decodedMatch = decodedMatch.replace(/\\\"/g, '"');

  let parsedMatch: any = {};

  try {
    parsedMatch = JSON.parse(decodedMatch);
  } catch (e) {
    console.info("Couldn't parse JSON");
    console.error(e);
    return [];
  }

  const firstSongInfo = getFirstSongInfo(parsedMatch);
  const topResultSongInfo = getTopResultSongInfo(parsedMatch);

  return [firstSongInfo, topResultSongInfo];
};

const selectSongInfo = (
  songInfoOptions: (PartialSongInfo | null)[],
  title: string,
  artist: string
): PartialSongInfo | null => {
  const nonNullSongInfoOptions = songInfoOptions.filter(
    (songInfo) => songInfo !== null
  ) as PartialSongInfo[];

  if (nonNullSongInfoOptions.length === 0) {
    return null;
  }

  const matchScores = nonNullSongInfoOptions.map((songInfo) => {
    const titleScore = levenshtein.get(
      sanitizeTitle(title),
      sanitizeTitle(songInfo.title)
    );
    const artistScore = levenshtein.get(artist, songInfo.artist);
    return titleScore + artistScore;
  });

  const minScore = Math.min(...matchScores);

  if (minScore > 5) {
    return null;
  }

  const bestMatchIndex = matchScores.findIndex((score) => score === minScore);

  return nonNullSongInfoOptions[bestMatchIndex];
};

const findYoutubeMusicTrack = async (
  title: string,
  artist: string
): Promise<PartialSongInfo | null> => {
  const query = `${title} ${artist}`;
  const htmlResponse = await fetch(
    `https://music.youtube.com/search?q=${encodeURI(query)}`,
    {
      credentials: 'omit',
    }
  ).then((res) => res.text());

  const songInfoOptions = extractSongInfoOptions(htmlResponse);

  return selectSongInfo(songInfoOptions, title, artist);
};
