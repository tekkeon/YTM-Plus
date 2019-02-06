class Lyrics {
  toggleLyrics(separateWindow) {
    var body = findEl('body');
    if (body.classList.contains('expanded')) {
      body.classList.remove('expanded');
      findEl('.lyrics-panel').classList.remove('active');
      if (separateWindow) {
        window.resizeTo(260, 415)
      }
    } else {
      body.classList.add('expanded');
      findEl('.lyrics-panel').classList.add('active');
      lyrics.fetchLyrics();
      if (separateWindow) {
        window.resizeTo(520, 415)
      }
    }
  }

  fetchLyrics () {
    // get artist and trackname
    findEl('.loader').classList.remove('loaded');
    findEl('.lyrics-panel p').innerHTML = '';
    findEl('.lyrics-panel p').classList.remove('no-results');

    var track = findEl('.song-title').textContent.toLowerCase()
    var artist = findEl('.song-supp-info').textContent.split("\u2022")[0].toLowerCase();
    var xhr = new XMLHttpRequest()
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText)
        console.log(response);

        var gotLyrics = false;
        for (var i = 0; i < 10; i++) {
          if (response.result[i]) {
            var obj = response.result[i]
            if (isMatch(obj.artist.toLowerCase(), artist, obj.title.toLowerCase(), track)) {
              findEl('.lyrics-panel p').innerHTML = obj.lyrics.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/(\])/g, ']<br>');
              findEl('.loader').classList.add('loaded');
              gotLyrics = true;
              break;
            }
          }
        }

        if (response && !gotLyrics) {
          findEl('.lyrics-panel p').innerHTML = "No lyrics found for this song."
          findEl('.lyrics-panel p').classList.add('no-results');
          findEl('.loader').classList.add('loaded');
        }
      }
    }

    var url = 'https://api.audd.io/?api_token=ba402ba6f7a12f5ab662d3d55f0ce706&method=findLyrics&q=' + artist + ' ' + track;
    xhr.open('GET', url)
    xhr.send()

    function isMatch (artist1, artist2, title1, title2) {
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
  }

  isActive() {
    return findEl('.lyrics-panel').classList.contains('active');
  }
}