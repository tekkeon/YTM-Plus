chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "notification") {
    chrome.notifications.create(request.options, function() { });
  } else if (request.type = "checkPopup") {
    var views = chrome.extension.getViews({ type: "popup" });
    if (views.length > 0) {
      sendResponse(true);
    } else {
      sendResponse(false);
    }
  }
});