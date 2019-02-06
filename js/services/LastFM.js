class LastFM {
  authorizeUser() {
    const redirect_url = chrome.extension.getURL("html/options.html")
    var url = 'http://www.last.fm/api/auth/?api_key=' + config.api_key + '&cb=' + redirect_url;
    window.location = url;
  }

  finishAuth(token) {
    var data = {
      api_key: config.api_key,
      method: "auth.getSession",
      token: token
    }
    var api_sig = this.generateSignature(data)
    var url = 'https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=' + config.api_key + '&token=' + token + '&api_sig=' + api_sig + '&format=json'

    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var response = JSON.parse(xhr.response)
        if (response) {
          if (response.session) {
            var session = response.session;
            chrome.storage.sync.set({"yt-mini-lastfm-info": session}, function() {})
            document.querySelector('.last-fm-user').innerHTML = "<span>" + session.name + "</span> is currently logged in!"
            document.querySelector('.last-fm-button').textContent = "Change user"
          }
        }
      }
    };
    return xhr.send();
  }

  generateSignature(data) {
    var ss = "";
    var st = [];
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

  getCurrentUser(callback) {
    chrome.storage.sync.get("yt-mini-lastfm-info", function(result) {
      result = result["yt-mini-lastfm-info"];
      if (result) {
        callback(result);
      } else {
        callback(null);
      }
    })
  }

  scrobbleTrack(userInfo, trackInfo) {
    var d = new Date();
    var n = d.getTime()/1000;
    var data = {
      api_key: config.api_key,
      method: "track.scrobble",
      sk: userInfo.key,
      artist: trackInfo.artist,
      track: trackInfo.title,
      album: trackInfo.album,
      timestamp: n
    }
    var api_sig = this.generateSignature(data)
    var url = 'https://ws.audioscrobbler.com/2.0/?method=track.scrobble&' +
      'api_key=' + config.api_key +
      '&api_sig=' + api_sig +
      '&sk=' + userInfo.key +
      '&artist=' + encodeURIComponent(trackInfo.artist) +
      '&track=' + encodeURIComponent(trackInfo.title) +
      '&album=' + encodeURIComponent(trackInfo.album) +
      '&timestamp=' + n +
      '&format=json'

    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    return xhr.send();
  }

  loveTrack(userInfo, trackInfo) {
    var data = {
      api_key: config.api_key,
      method: "track.love",
      sk: userInfo.key,
      artist: trackInfo.artist,
      track: trackInfo.title,
    }
    var api_sig = this.generateSignature(data)
    var url = 'https://ws.audioscrobbler.com/2.0/?method=track.love&' +
      'api_key=' + config.api_key +
      '&api_sig=' + api_sig +
      '&sk=' + userInfo.key +
      '&artist=' + encodeURIComponent(trackInfo.artist) +
      '&track=' + encodeURIComponent(trackInfo.title) +
      '&format=json'

    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    return xhr.send();
  }

  unloveTrack(userInfo, trackInfo) {
    var data = {
      api_key: config.api_key,
      method: "track.unlove",
      sk: userInfo.key,
      artist: trackInfo.artist,
      track: trackInfo.title,
    }
    var api_sig = this.generateSignature(data)
    var url = 'https://ws.audioscrobbler.com/2.0/?method=track.unlove&' +
      'api_key=' + config.api_key +
      '&api_sig=' + api_sig +
      '&sk=' + userInfo.key +
      '&artist=' + encodeURIComponent(trackInfo.artist) +
      '&track=' + encodeURIComponent(trackInfo.title) +
      '&format=json'

    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    return xhr.send();
  }
}