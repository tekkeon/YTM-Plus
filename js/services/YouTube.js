class YouTube {
  createTab() {
    chrome.tabs.create({url: MAIN_URL})
  }

  openTab() {
    chrome.tabs.update(State.tabs[0].id, {highlighted: true})
  }

  changeTime(options, callback) {
    var tab = options.tab;
    var percentage = options.percentage;

    var code = 'function simulateClick(x, y) {var clickEvent = document.createEvent("MouseEvents"); clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);document.elementFromPoint(x, y).dispatchEvent(clickEvent);} var rect = document.querySelector("#progress-bar").getBoundingClientRect(); var x = rect.width * (' + percentage + '/100); simulateClick(x, rect.y)'

    Chrome.executeScript({
      tab: tab,
      code: code
    }, callback)
  }

  getCurrentTab(callback) {
    chrome.tabs.query({url: MAIN_URL}, callback)
  }

  getAlbumArt(tab, callback) {
    try {
      Chrome.executeScript({
        tab: tab,
        code: 'document.querySelector("#song-image img").src'
      }, function (res) {
        var albumArt = res[0];

        callback(albumArt)
      })
    } catch(e) {}
  }

  getTitle(tab, callback) {
    try {
      Chrome.executeScript({
        tab: tab,
        code: 'document.querySelector(".title.ytmusic-player-bar").textContent'
      }, callback)
    } catch(e) {}
  }

  getSuppInfo(tab, callback) {
    try {
      Chrome.executeScript({
        tab: tab,
        code: 'document.querySelector(".byline.ytmusic-player-bar").textContent'
      }, callback)
    } catch(e) {}
  }

  getPlayOrPauseStatus(tab, callback) {
    try {
      Chrome.executeScript({
        tab: tab,
        code: 'document.querySelector(".play-pause-button").title'
      }, function (res) {
        var status = res[0];

        callback(status)
      })
    } catch(e) {}
  }

  getCurrentProgress(tab, callback) {
    try { 
      Chrome.executeScript({
        tab: tab,
        code: 'document.querySelector("#progress-bar #sliderKnob").style.left'
      }, function (res) {
        var progress = '100%'
        var sliderVal = res[0].split('%')[0];
        if (sliderVal < 100) {
          progress = sliderVal + '%';
        }
        callback(progress)
      })
    } catch(e) {}
  }

  getCurrentTime(tab, callback) {
    try {
      Chrome.executeScript({
        tab: tab,
        code: 'document.querySelector(".time-info").textContent'
      }, function (res) {
        var times = res[0];
        callback(times)
      })
    } catch(e) {}
  }

  getCurrentVolume(tab, callback) {
    try {
      Chrome.executeScript({
        tab: tab,
        code: 'document.querySelector("#volume-slider").getAttribute("value")'
      }, function(res) {
        var volume = res[0] + '%'
        callback(volume);
      })
    } catch (e) {}
  }

  getQueue(tab, callback) {
    try {
      Chrome.executeScript({
        tab: tab,
        code: '(' + function() {
          var ret = [];
          document.querySelectorAll("ytmusic-player-queue-item").forEach(function(item) {
            var title = item.getElementsByClassName('song-title')[0].textContent;
            var artist = item.getElementsByClassName('byline')[0].textContent;
            var retItem = {
              src: imageUrls[title + artist] || '../assets/image-coming-soon.png',
              title: title,
              artist: artist,
              time: item.getElementsByClassName('duration')[0].textContent
            };
            ret.push(retItem);
          });
          return {
              items: ret
          };
        } + ')()'
      }, function(res) {
        callback(res[0].items);
      })
    } catch(e) {}
  }

  selectSongFromQueue(options, callback) {
    try {
      Chrome.executeScript({
        tab: options.tab,
        code: 'document.querySelectorAll("ytmusic-player-queue-item")[' + options.index + '].getElementsByClassName("ytmusic-play-button-renderer")[0].click()'
      }, function(res) {
        callback();
      })
    } catch(e) {}
  }

  scrollQueue() {
    try {
      Chrome.executeScript({
        tab: State.tabs[0],
        code: '(' + function() {
          var queue = document.querySelector(".queue");
          var originalScroll = queue.scrollTop

          queue.scrollTop = queue.scrollHeight - queue.clientHeight;

          var scroller = setInterval(function() {
            queue.scrollTop = queue.scrollTop - 100;
          }, 50)

          setTimeout(function() {clearInterval(scroller); queue.scrollTop = originalScroll}, 1200);
        } + ')()'
      }, null)
    } catch(e) {}
  }

  click(options, callback) {
    var tab = options.tab
    var query = options.query
    var code = 'document.querySelector(\'' + query + '\').click()'

    Chrome.executeScript({
      tab: tab,
      code: code
    }, callback)
  }

  setVolume(options, callback) {
    try {
      Chrome.executeScript({
        tab: options.tab,
        code: 'document.querySelector("#volume-slider").setAttribute("value", ' + options.value + ')'
      }, callback)
    } catch(e) {}
  }
}