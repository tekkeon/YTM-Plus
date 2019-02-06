class Options {
  constructor() {
    this.defaultOpts = {
      "mini-light-theme": false,
      "mini-key-control": true,
      "yt-light-theme": false,
      "yt-notifications": true,
      "yt-key-control": true,
      "lyrics-enabled": true
    }
  }

  saveOptions(options, callback) {
    chrome.storage.sync.set({'yt-music-mini-options': options}, callback);
  }

  getOptions(callback) {
    chrome.storage.sync.get('yt-music-mini-options', function(result) {
      if (result['yt-music-mini-options']) {
        callback(result['yt-music-mini-options']);
      }
    })
  }

  setDefaultOptions() {
    this.saveOptions(this.defaultOpts);
  }
}

var opts = new Options();

try {
  chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
      opts.setDefaultOptions()
      chrome.tabs.create({ url: "html/options.html" });
    }
  });
} catch(e) {}