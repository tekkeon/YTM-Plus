import { MessageType } from "../constants";
import * as YtmLib from "./lib";
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
  sendResponse && sendResponse(YtmLib.getSongInfo());
};

const handleGetPlayerState: MessageHandler = (
  payload,
  sender,
  sendResponse
) => {
  console.log("handleGetPlayerState");
  sendResponse && sendResponse(YtmLib.getPlayerState());
};

const handlePlayPauseTrack: MessageHandler = () => {
  console.log("handlePlayPauseTrack");
  YtmLib.playPauseTrack();
};

const handleSkipTrack: MessageHandler = () => {
  console.log("handleSkipTrack");
  YtmLib.skipTrack();
};

const handlePreviousTrack: MessageHandler = () => {
  console.log("handlePreviousTrack");
  YtmLib.previousTrack();
};

const handleSetCurrentTrack: MessageHandler = (payload) => {
  console.log("handleSetCurrentTrack");
  YtmLib.setCurrentTrack(payload);
};

const handleSetTrackProgress: MessageHandler = (payload) => {
  console.log("handleSetTrackProgress");
  YtmLib.setTrackProgress(payload);
};

const handleSetVolume: MessageHandler = (payload) => {
  console.log("handleSetVolume");
  YtmLib.setVolume(payload);
};

const handleLikeTrack: MessageHandler = () => {
  console.log("handleLikeTrack");
  YtmLib.likeTrack();
};

const handleDislikeTrack: MessageHandler = () => {
  console.log("handleDislikeTrack");
  YtmLib.dislikeTrack();
};

export default initializePlayerHandlers;
