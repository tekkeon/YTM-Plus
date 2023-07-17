import { PlayerState, QueueItem, SongInfo } from "../types";

export const getSongInfo = (): SongInfo => {
  const additionalInfo = document
    .querySelector(".byline.ytmusic-player-bar")
    ?.textContent?.split("\u2022");
  const album = additionalInfo ? additionalInfo[1].trim() : "";
  const albumArtUrl =
    document.querySelector("#song-image img")?.getAttribute("src") ?? "";
  const artist = additionalInfo ? additionalInfo[0].trim() : "";
  const queue = getQueueItems();
  const title =
    document.querySelector(".title.ytmusic-player-bar")?.textContent ?? "";
  const year = additionalInfo ? additionalInfo[2].trim() : "";

  const url =
    (
      document.querySelector(
        "a.ytp-title-link.yt-uix-sessionlink"
      ) as HTMLElement
    ).getAttribute("href") ?? "";
  const urlObj = new URL(url);
  const id = urlObj.searchParams.get("v") ?? "";

  return {
    album,
    albumArtUrl,
    artist,
    queue,
    title,
    id,
    year,
  };
};

export const getPlayerState = (): PlayerState => {
  const isPlaying =
    (document.querySelector(".play-pause-button") as HTMLElement).title ===
    "Pause";
  const progress = (
    document.querySelector("#progress-bar #sliderKnob") as HTMLElement
  ).style.left;
  const thumbDown =
    (
      document.querySelector(
        ".ytmusic-like-button-renderer.dislike"
      ) as HTMLElement
    ).getAttribute("aria-pressed") === "true";
  const thumbUp =
    (
      document.querySelector(
        ".ytmusic-like-button-renderer.like"
      ) as HTMLElement
    ).getAttribute("aria-pressed") === "true";
  const trackTime = (document.querySelector(".time-info") as HTMLElement)
    .textContent;
  const volume =
    (document.querySelector("#volume-slider") as HTMLElement).getAttribute(
      "value"
    ) ?? "";

  return {
    isPlaying,
    progress,
    thumbDown,
    thumbUp,
    trackTime,
    volume,
  };
};

const getQueueItems = (): QueueItem[] => {
  const queue = [
    ...document.querySelectorAll(
      ".side-panel.modular ytmusic-player-queue-item"
    ),
  ].map(function (itemElement) {
    const itemTitle =
      itemElement.getElementsByClassName("song-title")[0].textContent ?? "";
    const itemArtist =
      itemElement.getElementsByClassName("byline")[0].textContent ?? "";
    const itemTime =
      itemElement.getElementsByClassName("duration")[0].textContent ?? "";
    const queueItem: QueueItem = {
      src:
        itemElement
          .querySelector("yt-img-shadow.thumbnail img")
          ?.getAttribute("src") ?? "",
      title: itemTitle,
      artist: itemArtist,
      time: itemTime,
    };

    return queueItem;
  });

  return queue;
};

export const playPauseTrack = () => {
  (document.querySelector(".play-pause-button") as HTMLElement).click();
};

export const skipTrack = () => {
  (document.querySelector(".next-button") as HTMLElement).click();
};

export const previousTrack = () => {
  (document.querySelector(".previous-button") as HTMLElement).click();
};

export const setCurrentTrack = (index: number) => {
  (
    document
      .querySelectorAll("ytmusic-player-queue-item")
      [index].getElementsByClassName(
        "ytmusic-play-button-renderer"
      )[0] as HTMLElement
  ).click();
};

export const setTrackProgress = (progress: number) => {
  var progressBarRect = (
    document.getElementById("progress-bar") as HTMLElement
  ).getBoundingClientRect();
  var y = progressBarRect.y;
  var x = progressBarRect.width * (progress / 100);

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

export const setVolume = (volume: string) => {
  const volumeSlider = document.getElementById("volume-slider") as HTMLElement;
  volumeSlider.setAttribute("value", volume);

  const changeEvent = new Event("change");
  volumeSlider.dispatchEvent(changeEvent);
};

export const likeTrack = () => {
  (
    document.querySelector(".ytmusic-like-button-renderer.like") as HTMLElement
  ).click();
};

export const dislikeTrack = () => {
  (
    document.querySelector(
      ".ytmusic-like-button-renderer.dislike"
    ) as HTMLElement
  ).click();
};
