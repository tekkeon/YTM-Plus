import initializeChangeEmitters from "./changeEmitters";
import initializePlayerHandlers from "./musicPlayer";
import initializeKeyControls from "./keyControls";

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
  initializeChangeEmitters();
  initializePlayerHandlers();
  initializeKeyControls();
});
