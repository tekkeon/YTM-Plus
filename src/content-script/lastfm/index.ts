import { MessageType } from "../../constants";
import { messaging } from "../../util/chrome";

function docReady(fn: any) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  messaging.sendToRuntime({
    type: MessageType.REDIRECT_TO_OPTIONS,
    payload: { query: `?token=${token}` },
  });
});
