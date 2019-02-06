var options = new Options()
var lastfm = new LastFM()

options.getOptions(function(options) {
  document.querySelectorAll('.checkbox').forEach(function(checkbox) {
    if (options[checkbox.id] != undefined) {
      if (options[checkbox.id]) {
        checkbox.classList.add('checked');
      } else {
        checkbox.classList.remove('checked');
      }
    }
  })
})

lastfm.getCurrentUser(function(userInfo) {
  if (userInfo) {
    document.querySelector('.last-fm-user').innerHTML = "<span>" + userInfo.name + "</span> is currently logged in!"
    document.querySelector('.last-fm-button').textContent = "Change user"
  } else {
    document.querySelector('.last-fm-user').textContent = "No current user!"
  }
})

document.querySelectorAll('.checkbox').forEach(function(checkbox) {
  checkbox.addEventListener('click', function() {
    if (checkbox.classList.contains('checked')) {
      checkbox.classList.remove('checked');
    } else {
      checkbox.classList.add('checked');
    }
  })
})

document.querySelector('.save-button').addEventListener('click', function() {
  var newOptions = {};
  document.querySelectorAll('.checkbox').forEach(function(checkbox) {
    newOptions[checkbox.id] = checkbox.classList.contains('checked');
  })

  options.saveOptions(newOptions, function() {
    document.querySelector('.save-button').innerHTML = '<i class="fa fa-check"></i> Saved'
    setTimeout(function() {
      document.querySelector('.save-button').innerHTML = 'Save'
    }, 3000)
  });
})

document.querySelector('.last-fm-button').addEventListener('click', function() {
  lastfm.authorizeUser();
})

var urlJson = getJsonFromUrl(window.location.href)
if (urlJson['token']) {
  lastfm.finishAuth(urlJson['token']);
}

function getJsonFromUrl(hashBased) {
  var query;
  if(hashBased) {
    var pos = location.href.indexOf('?');
    if(pos==-1) return [];
    query = location.href.substr(pos+1);
  } else {
    query = location.search.substr(1);
  }
  var result = {};
  query.split('&').forEach(function(part) {
    if(!part) return;
    part = part.split('+').join(' '); // replace every + with space, regexp-free version
    var eq = part.indexOf('=');
    var key = eq>-1 ? part.substr(0,eq) : part;
    var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : '';
    var from = key.indexOf('[');
    if(from==-1) result[decodeURIComponent(key)] = val;
    else {
      var to = key.indexOf(']',from);
      var index = decodeURIComponent(key.substring(from+1,to));
      key = decodeURIComponent(key.substring(0,from));
      if(!result[key]) result[key] = [];
      if(!index) result[key].push(val);
      else result[key][index] = val;
    }
  });
  return result;
}