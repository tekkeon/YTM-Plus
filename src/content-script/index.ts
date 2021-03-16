import initializeChangeEmitters from './changeEmitters';
import initializePlayerHandlers from './musicPlayer';
import initializeTheme from './theme';
import initializeSync from './sync';

function docReady(fn: any) {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(() => {
  initializeChangeEmitters();
  initializePlayerHandlers();
  initializeTheme();
  initializeSync();
});