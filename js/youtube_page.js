var imageUrls = {};
var opts = new Options();
var lastfm = new LastFM();
var State = {
  scrobbled: []
}

cacheImages();
setInterval(cacheImages, 10000);

function cacheImages() {
  var items = document.querySelectorAll("ytmusic-player-queue-item");

  items.forEach(function(item) {
    const key = item.getElementsByClassName('song-title')[0].textContent + 
      item.getElementsByClassName('byline')[0].textContent;

    const src = item.getElementsByClassName('yt-img-shadow')[0].getAttribute('src');

    if (src.includes('http')) {
      imageUrls[key] = src;
    } else if (!imageUrls[key]) {
      imageUrls[key] = '';
    }
  })
}

lastfm.getCurrentUser(function(userInfo) {
  if (userInfo) {
    State.userInfo = userInfo
    setInterval(function() {
      try {
        var time = document.querySelector(".time-info").textContent.split(' / ')
        var curTimeSec = parseInt(time[0].split(':')[0])*60 + parseInt(time[0].split(':')[1])
        var endTimeSec = parseInt(time[1].split(':')[0])*60 + parseInt(time[1].split(':')[1])

        if (curTimeSec/endTimeSec > 0.5) {
          scrobbleTrack()
        }
      } catch(e) {
        return
      }
    }, 1000)
  }
})

function scrobbleTrack() {
  var suppInfo = document.querySelector(".byline.ytmusic-player-bar").textContent.split("\u2022");
  var songState = {
    title: document.querySelector(".title.ytmusic-player-bar").textContent,
    artist: suppInfo[0],
    album: suppInfo[1]
  }
  if (!State.scrobbled.includes(songState.title + songState.artist + songState.album)) {
    console.log("Scrobbling...")
    State.scrobbled.push(songState.title + songState.artist + songState.album)
    lastfm.scrobbleTrack(State.userInfo, songState)
  }
}

document.querySelector('.like').addEventListener('click', function() {
  var likeButton = document.querySelector('.like');
  if (State.userInfo) {
    var suppInfo = document.querySelector(".byline.ytmusic-player-bar").textContent.split("\u2022");
    var songState = {
      title: document.querySelector(".title.ytmusic-player-bar").textContent,
      artist: suppInfo[0],
      album: suppInfo[1]
    }
    setTimeout(function() {
      if (likeButton.getAttribute('aria-pressed') == "true") {
        lastfm.loveTrack(State.userInfo, songState)
      } else {
        lastfm.unloveTrack(State.userInfo, songState)
      }
    }, 1000)
  }
})

opts.getOptions(function(options) {
  if (options["yt-light-theme"]) {
    var link = document.createElement("link");
    link.href = chrome.extension.getURL("css/youtube_music_light.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
    document.querySelector('.logo.style-scope.ytmusic-nav-bar').src = 'https://s22.postimg.cc/6ubhr01rl/YTMusic_Light_Page_Logo.png'
    document.querySelectorAll('source.style-scope.ytmusic-nav-bar').forEach(function(el) {
      el.setAttribute('srcset', 'https://s22.postimg.cc/9wneskugx/YTMusic_Light_Page_Logo.png')
    })
  }

  if (options['yt-key-control']) {
    window.onkeyup = handleKeyPress;
  }
})

setInterval(function() {
  var newTitle = document.querySelector(".title.ytmusic-player-bar").textContent;
  if (!document.hasFocus()) {
    if (State.currentSong != newTitle) {
      opts.getOptions(function(options) {
        if (options["yt-notifications"]) {
          setTimeout(displayNotification, 1000)
        }
      })
    }
  }
  State.currentSong = newTitle;
}, 1000)

function displayNotification() {
  var titleEl = document.querySelector(".title.ytmusic-player-bar");
  var suppInfoEl = document.querySelector(".byline.ytmusic-player-bar");

  chrome.runtime.sendMessage({type: "checkPopup"}, function(popupOpen) {
    if (titleEl && suppInfoEl && !popupOpen) {
      var title = titleEl.textContent;
      var suppInfo = suppInfoEl.textContent;
  
      const type = "notification"
      const options = {
        type: "basic",
        iconUrl: "assets/128-icon.png",
        title: title,
        message: suppInfo,
      }
      chrome.runtime.sendMessage({type: type, options: options}, function(response) {});
    }
  })
}

function handleKeyPress(e) {
  var key = e.keyCode ? e.keyCode : e.which;

  switch(key) {
    //space: 32, left: 37, right: 39, up: 38, down: 40
    case 37:
      document.querySelector('.previous-button').click()
      break;
    case 39:
      document.querySelector('.next-button').click()
      break;
  }
}