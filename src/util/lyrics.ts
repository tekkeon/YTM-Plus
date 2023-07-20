import levenshtein from 'fast-levenshtein';
import config from '../config';

export const getLyrics = (artist: string, track: string) => {
  track = sanitizeTitle(track);

  const artistEncoded = encodeURIComponent(artist);
  const trackEncoded = encodeURIComponent(track);

  var requestUrl = `https://api.audd.io/?api_token=${config.lyrics_api_key}&method=findLyrics&q=${artistEncoded} ${trackEncoded}`;

  return fetch(requestUrl)
    .then((result) => result.json())
    .then((json) => {
      const lyrics = extractLyrics(json, artist, track);
      console.info('Found lyrics: ', lyrics);
      return lyrics;
    });
};

const extractLyrics = (response: any, artist: string, track: string) => {
  let result: string[] | null = null;

  response.result.forEach((info: any) => {
    if (
      !result &&
      info.lyrics &&
      isMatch(
        info.artist.toLowerCase().trim(),
        artist.toLowerCase().trim(),
        info.title.toLowerCase().trim(),
        track.toLowerCase().trim()
      )
    ) {
      const decodedLyrics = decodeLyrics(info.lyrics);

      if (decodedLyrics === '') {
        return null;
      }

      result = decodedLyrics
        .split(/(?:\r\n|\r|\n)/)
        .filter((lyric) => lyric && lyric.length);
    }
  });

  return result;
};

const equalIsh = (a: string, b: string) => {
  return levenshtein.get(a, b) < 2;
};

const standardizeMatchText = (text: string) => {
  return text.toLowerCase().trim();
};

/**
 * Removes any text in parentheses or square brackets from the title.
 */
const sanitizeTitle = (title: string) => {
  return title.replace(/ *\([^)]*\) */g, '').replace(/ *\[[^)]*\] */g, '');
};

const checkArtistMatches = (artist1: string, artist2: string) => {
  const splitter = /,|and|&/;

  const artist1List = artist1.split(splitter);
  const artist2List = artist2.split(splitter);

  return artist1List.some((artist1) =>
    artist2List.some((artist2) => {
      return equalIsh(
        standardizeMatchText(artist1),
        standardizeMatchText(artist2)
      );
    })
  );
};

const checkTitleMatches = (title1: string, title2: string) => {
  title1 = sanitizeTitle(title1);
  title2 = sanitizeTitle(title2);

  return equalIsh(standardizeMatchText(title1), standardizeMatchText(title2));
};

const isMatch = (
  artist1: string,
  artist2: string,
  title1: string,
  title2: string
) => {
  var artistMatches = checkArtistMatches(artist1, artist2);
  var titleMatches = checkTitleMatches(title1, title2);

  return artistMatches && titleMatches;
};

export const decodeLyrics = (html: string) => {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};
