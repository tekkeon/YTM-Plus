// google analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-121697925-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

/* globals XMLHttpRequest, chrome */

var MAIN_URL = 'https://music.youtube.com/*'
var renderCount = 0;

// utils
function findEl (path) {
  return document.querySelector(path)
}

function onClick (el, callback) {
  return el.addEventListener('click', callback)
}

var Chrome = {
  executeScript: function (options, callback) {
    var tab = options.tab
    var code = options.code

    chrome.tabs.executeScript(tab.id, {
      code: code
    }, callback)
  }
}

var State = {
  tabs: []
}

var yt = new YouTube();
//yt = yt.independentWindow;
var lyrics = new Lyrics();
var opts = new Options();

function renderAlbumArt (albumArtURL) {
  findEl('.album-image').style.background = albumArtURL != undefined && albumArtURL != '' ? 'url(' + albumArtURL + ')' : 'linear-gradient(#424242, #333333)'
}

function renderTitle (name) {
  findEl('.song-title').textContent = name != undefined && name != '' ? name : '-';
}

function renderSuppInfo (suppInfo) {
  var current = findEl('.song-supp-info').textContent;
  findEl('.song-supp-info').textContent = suppInfo != undefined && suppInfo != '' ? suppInfo : '-';
  if (lyrics.isActive()) {
    if (current != suppInfo) {
      lyrics.fetchLyrics();
    }
  }
}

function renderPlayPauseState (state) {
  var playPause = findEl('.controls-play-pause')

  switch (state) {
    case 'Pause':
      playPause.src = State.light ? "../assets/light/pause.png" : "../assets/pause.png"
      break
    case 'Play':
    playPause.src = State.light ? "../assets/light/play.png" : "../assets/play.png"
      break
  }
}

function renderCurrentProgress (state) {
  findEl('.song-progress').style.width = state;
  findEl('.progress-slider').setAttribute('value', state.split('%')[0]);
}

function renderCurrentTime (state) {
  findEl('.times').textContent = state;
}

function renderCurrentVolume (state) {
  findEl('.current-volume').style.height = state;
  if (state.split('%')[0] == 0)
    findEl('.controls-volume').setAttribute('src', '../assets/volume-mute.png');
  else {
    findEl('.controls-volume').setAttribute('src', '../assets/volume-active.png');
  }
}

function renderQueue (items) {
  var queue = document.querySelector('.queue')
  var active = "";
  if (document.querySelector('.queue-header').classList.contains('active')) active = "active";
  while (queue.firstChild) {
      queue.removeChild(queue.firstChild);
  }

  var queueCloseImg = document.createElement('img');
  queueCloseImg.src = "../assets/x.png"
  queueCloseImg.className = "queue-close"
  onClick(queueCloseImg, toggleQueue)

  var queueTitle = document.createElement('h1');
  queueTitle.textContent = 'Queue';
  queueTitle.appendChild(queueCloseImg)

  var header = document.createElement('div');
  header.className = 'queue-header ' + active;
  header.appendChild(queueTitle)

  queue.appendChild(header);

  const currentSong = findEl('.song-title').textContent;

  items.forEach(function(item, index) {
    var image = document.createElement('img');
    image.className = 'queue-item-image';
    if (item.title == currentSong) {
      image.src = '../assets/128-icon.png'
    } else {
      image.src = item.src;
    }

    var time = document.createElement('h2');
    time.className = 'queue-item-time';
    time.textContent = item.time;

    var title = document.createElement('h1');
    title.className = 'queue-item-title';
    title.textContent = item.title;

    var artist = document.createElement('h2');
    artist.className = 'queue-item-artist';
    artist.textContent = item.artist;

    var info = document.createElement('div');
    info.className = 'queue-item-info';
    info.appendChild(title);
    info.appendChild(artist)

    var renderedItem = document.createElement('div');
    renderedItem.className = 'queue-item';
    if (item.title == currentSong) {
      renderedItem.classList.add('current');
    }
    renderedItem.appendChild(image);
    renderedItem.appendChild(info);
    renderedItem.appendChild(time);
    renderedItem.setAttribute('item-num', index)

    onClick(renderedItem, handleQueueItemClick);

    queue.appendChild(renderedItem)
  })
}

function execute (action) {
  State.tabs.forEach(function (tab) {
    yt[action](tab)
  })

  // Update current trackname
  setTimeout(updateTrackInfo, 2000)
}

/**
 * Show current trackname if there's one
 */
function updateTrackInfo () {
  //for (var tab of State.tabs) {
    var tab = State.tabs[0];
    yt.getAlbumArt(tab, renderAlbumArt)
    yt.getTitle(tab, renderTitle)
    yt.getSuppInfo(tab, renderSuppInfo)
    yt.getCurrentProgress(tab, renderCurrentProgress)
    yt.getCurrentTime(tab, renderCurrentTime)
    yt.getPlayOrPauseStatus(tab, renderPlayPauseState)
    yt.getCurrentVolume(tab, renderCurrentVolume)
    if (renderCount % 50 == 0) {
      yt.getQueue(tab, renderQueue)
    }
    renderCount += 1;
  //}
}

// this method is called on background.js to toggle between play/pause;
function handlePlayOrPauseClick () {
  _gaq.push(['_trackEvent', 'play-pause-button', 'clicked']);
  State.tabs.forEach(function (tab) {
    yt.click({tab: tab, query: '.play-pause-button'}, updateTrackInfo)
  })
}

function handleNextClick () {
  _gaq.push(['_trackEvent', 'next-button', 'clicked']);
  State.tabs.forEach(function (tab) {
    yt.click({tab: tab, query: '.next-button'}, updateTrackInfo)
  })
}

function handlePrevClick () {
  _gaq.push(['_trackEvent', 'previous-button', 'clicked']);
  State.tabs.forEach(function (tab) {
    yt.click({tab: tab, query: '.previous-button'}, updateTrackInfo)
  })
}

function handleVolumeClick () {
  _gaq.push(['_trackEvent', 'volume-button', 'clicked']);
  State.tabs.forEach(function (tab) {
    yt.click({tab: tab, query: '.expand-volume'}, updateTrackInfo)
  })
}

function handleLogoClick () {
  _gaq.push(['_trackEvent', 'youtube-logo', 'clicked']);
  return State.tabs.length
    ? yt.openTab(State.tabs)
    : yt.createTab()
}

function handleLogoClick () {
  return State.tabs.length
    ? yt.openTab(State.tabs)
    : yt.createTab()
}

function handleTimeChange() {
  State.tabs.forEach(function (tab) {
    yt.changeTime({tab: tab, percentage: this.value}, updateTrackInfo)
  }.bind(this))
}

function handleVolumeChange() {
  State.tabs.forEach(function (tab) {
    yt.setVolume({tab: tab, value: this.value}, updateTrackInfo)
  }.bind(this))
}

function handleQueueItemClick() {
  State.tabs.forEach(function (tab) {
    yt.selectSongFromQueue({tab: tab, index: this.getAttribute('item-num')}, updateTrackInfo)
  }.bind(this))
  toggleQueue();
  setTimeout(yt.scrollQueue, 5000);
}

function handleKeyPress(e) {
  _gaq.push(['_trackEvent', 'key', 'pressed']);
  var key = e.keyCode ? e.keyCode : e.which;

  switch(key) {
    //space: 32, left: 37, right: 39, up: 38, down: 40
    case 32:
      handlePlayOrPauseClick()
      break;
    case 37:
      handlePrevClick()
      break;
    case 39:
      handleNextClick()
      break;
    case 38:
      var volume = parseInt(findEl('.current-volume').style.height.split('%')[0])
      console.log("prev volume: " + volume)
      volume = volume + 10 < 100 ? volume += 10 : 100;
      console.log("new volume:" + volume)
      State.tabs.forEach(function (tab) {
        yt.setVolume({tab: tab, value: volume}, updateTrackInfo)
      }.bind(this))
      break;
    case 40:
      var volume = parseInt(findEl('.current-volume').style.height.split('%')[0])
      volume = volume - 10 > 0 ? volume -= 10 : 0;
      State.tabs.forEach(function (tab) {
        yt.setVolume({tab: tab, value: volume}, updateTrackInfo)
      }.bind(this))
      break;
  }
}

function toggleQueue() {
  _gaq.push(['_trackEvent', 'queue', 'toggled']);
  var queue = findEl('.queue');
  var queueHeader = findEl('.queue-header');
  if (queue.classList.contains('active')) {
    queue.classList.remove('active');
    queueHeader.classList.remove('active');
  } else {
    queue.classList.add('active');
    setTimeout(function() {
      queueHeader.classList.add('active');
      var current = findEl('.current');
      if (current) {
        current.scrollIntoView();
        findEl('.queue').scrollTop = findEl('.queue').scrollTop - 50;
      }
    }, 500)
  }
}

function createMiniPlayerWindow() {
  chrome.windows.create({
    //url: chrome.extension.getURL('html/popup.html'),
    url: 'https://music.youtube.com',
    type: 'popup',
    width: 260,
    height: 415
  }, function(newWindow) {
    chrome.storage.local.set({'yt-mini-popup-window': newWindow.id})
    window.close()
  })
  //window.close()
}

function setInitialState (callback) {
  yt.getCurrentTab(function (tabs) {
    State.tabs = tabs
    callback()
  })
  chrome.windows.getCurrent(function(window) {
    if (window.type == "popup") {
      State.separateWindow = true
    }
  })
  setInterval(updateTrackInfo, 100);
};

function setOptions () {
  opts.getOptions(function(options) {
    if (!options["lyrics-enabled"]) {
      findEl('.lyrics-toggle').style.display = "none";
    }

    if (options["mini-light-theme"]) {
      State.light = true;
      var link = document.createElement("link");
      link.href = "../css/popup_light.css";
      link.type = "text/css";
      link.rel = "stylesheet";
      document.getElementsByTagName("head")[0].appendChild(link);

      document.querySelector('.youtube-logo').src = '../assets/light/YoutubeMusicLogo.png'
      document.querySelector('.controls-play-pause').src = '../assets/light/play.png'
      document.querySelector('.controls-next').src = '../assets/light/next.png'
      document.querySelector('.controls-prev').src = '../assets/light/prev.png'
    }

    if (options['mini-key-control']) {
      window.onkeyup = handleKeyPress;
    }

    /*if (options['mini-player-new-window']) {
      chrome.storage.local.get('yt-mini-popup-window', function(result) {
        result = result['yt-mini-popup-window'];
      
        if (result) {
          chrome.windows.get(result, function(windowInfo) {
            if (!windowInfo) {
              createMiniPlayerWindow()
            } 
            else if (windowInfo.type != 'popup') {
              window.close()
              chrome.windows.update(windowInfo.id, {focused: true})
            }
          })
        } else {
          createMiniPlayerWindow();
        }
      })
    }*/
  })
}

// init
document.addEventListener('DOMContentLoaded', function () {
  setInitialState(function () {
    setOptions();
    yt.scrollQueue();
    updateTrackInfo();

    // events
    onClick(findEl('.youtube-logo'), handleLogoClick)
    onClick(findEl('.controls-play-pause'), handlePlayOrPauseClick);
    onClick(findEl('.controls-next'), handleNextClick);
    onClick(findEl('.controls-prev'), handlePrevClick);
    onClick(findEl('.album-container'), yt.changeTime)
    findEl('.progress-slider').oninput = handleTimeChange;
    findEl('.volume-slider').oninput = handleVolumeChange;
    onClick(findEl('.controls-volume'), handleVolumeClick);
    onClick(findEl('.controls-hamburger'), toggleQueue);
    onClick(findEl('.queue-close'), toggleQueue);
    onClick(findEl('.lyrics-toggle'), function() {
      lyrics.toggleLyrics(State.separateWindow)
    })

    findEl('.controls-volume').onmouseover = function() {
      findEl('.volume-slider-container').classList.add('active');
    }

    findEl('.controls-volume').onmouseout = function() {
      setTimeout(function() {
        findEl('.volume-slider-container').classList.remove('active');
      }, 500)
    }

    onClick(findEl('.lyrics-panel h2 a'), function() {
      chrome.tabs.create({url: 'https://www.audd.io/'})
    })
  })
})