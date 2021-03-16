import config from '../config';

export const getLyrics = (artist: string, track: string) => {
  var requestUrl = `https://api.audd.io/?api_token=${config.lyrics_api_key}&method=findLyrics&q=${artist} ${track}`

  return fetch(requestUrl)
    .then(result => result.json())
    .then(json => {
      return extractLyrics(json, artist, track);
    })
}

const extractLyrics = (response: any, artist: string, track: string) => {
  for (var i = 0; i < 10; i++) {
    if (response.result[i]) {
      var info = response.result[i]
      console.log(info)
      if (isMatch(info.artist.toLowerCase().trim(), artist.toLowerCase().trim(), info.title.toLowerCase().trim(), track.toLowerCase().trim())) {
        return info.lyrics.replace(/(?:\r\n|\r|\n)/g, '\n\n');
      }
    }
  }

  return "No lyrics found."
}

const isMatch = (artist1: string, artist2: string, title1: string, title2: string) => {
  var artistMatches = false;
  var titleMatches = false;

  if (artist1.includes(artist2) || artist2.includes(artist1)) {
    artistMatches = true;
  }

  if (title1.includes(title2) || title2.includes(title1)) {
    titleMatches = true;
  }
  
  artist1 = artist1.replace(/and|\&/g, ',').replace(/\s/g, '')
  artist2 = artist1.replace(/and|\&/g, ',').replace(/\s/g, '')

  var artist1List = artist1.split(',');
  var artist2List = artist2.split(',');

  artist1List.forEach(function(art1) {
    if (artist2List.includes(art1.trim())) {
      artistMatches = true;
    }
  })

  artist2List.forEach(function(art2) {
    if (artist1List.includes(art2)) {
      artistMatches = true;
    }
  })

  return artistMatches && titleMatches;
}