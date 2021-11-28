import { MessageType } from "../constants";
import { getSongInfo, getPlayerState } from "./shared";
import { MessageHandler } from "../types";

const initializePlayerHandlers = () => {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    switch (message.type) {
      case MessageType.GET_SONG_INFO:
        handleGetSongInfo(message.payload, sender, sendResponse);
        break;

      case MessageType.GET_PLAYER_STATE:
        handleGetPlayerState(message.payload, sender, sendResponse);
        break;

      case MessageType.PLAY_PAUSE:
        handlePlayPauseTrack();
        break;

      case MessageType.SKIP_TRACK:
        handleSkipTrack();
        break;

      case MessageType.PREVIOUS_TRACK:
        handlePreviousTrack();
        break;

      case MessageType.SET_CURRENT_TRACK:
        handleSetCurrentTrack(message.payload);
        break;

      case MessageType.SET_TRACK_PROGRESS:
        handleSetTrackProgress(message.payload);
        break;

      case MessageType.SET_VOLUME:
        handleSetVolume(message.payload);
        break;

      case MessageType.LIKE_TRACK:
        handleLikeTrack();
        break;

      case MessageType.DISLIKE_TRACK:
        handleDislikeTrack();
        break;
    }
  });
};

const handleGetSongInfo: MessageHandler = (payload, sender, sendResponse) => {
  console.log("handleGetSongInfo");
  sendResponse && sendResponse(getSongInfo());
};

const handleGetPlayerState: MessageHandler = (
  payload,
  sender,
  sendResponse
) => {
  console.log("handleGetPlayerState");
  sendResponse && sendResponse(getPlayerState());
};

const handlePlayPauseTrack: MessageHandler = () => {
  console.log("handlePlayPauseTrack");
  (document.querySelector(".play-pause-button") as HTMLElement).click();
};

const handleSkipTrack: MessageHandler = () => {
  console.log("handleSkipTrack");
  (document.querySelector(".next-button") as HTMLElement).click();
};

const handlePreviousTrack: MessageHandler = () => {
  console.log("handlePreviousTrack");
  (document.querySelector(".previous-button") as HTMLElement).click();
};

const handleSetCurrentTrack: MessageHandler = (payload) => {
  console.log("handleSetCurrentTrack");
  (
    document
      .querySelectorAll("ytmusic-player-queue-item")
      [payload].getElementsByClassName(
        "ytmusic-play-button-renderer"
      )[0] as HTMLElement
  ).click();
};

const handleSetTrackProgress: MessageHandler = (payload) => {
  console.log("handleSetTrackProgress");
  var progressBarRect = (
    document.getElementById("progress-bar") as HTMLElement
  ).getBoundingClientRect();
  var y = progressBarRect.y;
  var x = progressBarRect.width * (payload / 100);

  var clickEvent = document.createEvent("MouseEvents");
  clickEvent.initMouseEvent(
    "click",
    true,
    true,
    window,
    0,
    0,
    0,
    x,
    y,
    false,
    false,
    false,
    false,
    0,
    null
  );
  (document.elementFromPoint(x, y) as HTMLElement).dispatchEvent(clickEvent);
};

const handleSetVolume: MessageHandler = (payload) => {
  console.log("handleSetVolume");
  const volumeSlider = document.getElementById("volume-slider") as HTMLElement;
  volumeSlider.setAttribute("value", payload);

  const changeEvent = new Event("change");
  volumeSlider.dispatchEvent(changeEvent);
};

const handleLikeTrack: MessageHandler = () => {
  console.log("handleLikeTrack");
  (
    document.querySelector(".ytmusic-like-button-renderer.like") as HTMLElement
  ).click();
};

const handleDislikeTrack: MessageHandler = () => {
  console.log("handleDislikeTrack");
  (
    document.querySelector(
      ".ytmusic-like-button-renderer.dislike"
    ) as HTMLElement
  ).click();
};

export default initializePlayerHandlers;
