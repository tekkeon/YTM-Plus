import { storage } from './chrome';
import config from '../config';
import { SongInfo } from '../types';
import md5 from 'md5';

export const authorizeUser = () => {
  const redirect_url = chrome.extension.getURL('html/options.html')
  var url = 'http://www.last.fm/api/auth/?api_key=' + config.last_fm_api_key + '&cb=' + redirect_url;
  window.location.href = url;
}

export const finishAuth = (token: string) => {
  const data = {
    api_key: config.last_fm_api_key,
    method: 'auth.getSession',
    token: token
  }
  const api_sig = generateSignature(data)
  const url = 'https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=' + config.last_fm_api_key + '&token=' + token + '&api_sig=' + api_sig + '&format=json'

  return fetch(url)
    .then(res => res.json())
    .then(json => json && json.session);
}

export const getCurrentSession = () => {
  return storage.get('lastfm-info');
}

export const scrobbleTrack = (songInfo: SongInfo) => {
  console.log(songInfo);
  getCurrentSession()
    .then(session => {
      if (!session) {
        console.log('No LastFM user.');
        return;
      }

      var d = new Date();
      var n = d.getTime()/1000;
      var data = {
        api_key: config.last_fm_api_key,
        method: 'track.scrobble',
        sk: session.key,
        artist: songInfo.artist,
        track: songInfo.title,
        album: songInfo.album,
        timestamp: n
      }
      var api_sig = generateSignature(data)
      var url = 'https://ws.audioscrobbler.com/2.0/?method=track.scrobble&' +
        'api_key=' + config.last_fm_api_key +
        '&api_sig=' + api_sig +
        '&sk=' + session.key +
        '&artist=' + encodeURIComponent(songInfo.artist) +
        '&track=' + encodeURIComponent(songInfo.title) +
        '&album=' + encodeURIComponent(songInfo.album) +
        '&timestamp=' + n +
        '&format=json'

      var xhr;
      xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      return xhr.send();
    });
}

export const loveTrack = (songInfo: SongInfo) => {
  getCurrentSession()
    .then(user => {
      var data = {
        api_key: config.last_fm_api_key,
        method: 'track.love',
        sk: user.key,
        artist: songInfo.artist,
        track: songInfo.title,
      }
      var api_sig = generateSignature(data)
      var url = 'https://ws.audioscrobbler.com/2.0/?method=track.love&' +
        'api_key=' + config.last_fm_api_key +
        '&api_sig=' + api_sig +
        '&sk=' + user.key +
        '&artist=' + encodeURIComponent(songInfo.artist) +
        '&track=' + encodeURIComponent(songInfo.title) +
        '&format=json'
    
      var xhr;
      xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      return xhr.send();
    });
}

export const unloveTrack = async (songInfo: SongInfo) => {
  getCurrentSession()
    .then(user => {
      var data = {
        api_key: config.last_fm_api_key,
        method: 'track.unlove',
        sk: user.key,
        artist: songInfo.artist,
        track: songInfo.title,
      }
      var api_sig = generateSignature(data)
      var url = 'https://ws.audioscrobbler.com/2.0/?method=track.unlove&' +
        'api_key=' + config.last_fm_api_key +
        '&api_sig=' + api_sig +
        '&sk=' + user.key +
        '&artist=' + encodeURIComponent(songInfo.artist) +
        '&track=' + encodeURIComponent(songInfo.title) +
        '&format=json'
    
      var xhr;
      xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      return xhr.send();
    });
}

const generateSignature = (data: any) => {
  var ss = '';
  var st: string[] = [];
  Object.keys(data).forEach(function(key){
      st.push(key);
  });
  st.sort();
  st.forEach(function(std){
      ss = ss + std + data[std];
  });
  var signature = md5(unescape(encodeURIComponent(ss + config.secret)));
  return signature;
}