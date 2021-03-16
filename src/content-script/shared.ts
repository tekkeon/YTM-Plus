import { PlayerState, QueueItem, SongInfo } from '../types';

export const getSongInfo = (): SongInfo => {
  const additionalInfo = document.querySelector('.byline.ytmusic-player-bar')?.textContent?.split('\u2022');
  const album = additionalInfo ? additionalInfo[1].trim() : '';
  const albumArtUrl = document.querySelector('#song-image img')?.getAttribute('src') ?? '';
  const artist = additionalInfo ? additionalInfo[0].trim() : '';
  const queue = getQueueItems();
  const title = document.querySelector('.title.ytmusic-player-bar')?.textContent ?? '';
  const year = additionalInfo ? additionalInfo[2].trim() : '';

  const url = (document.querySelector('a.ytp-title-link.yt-uix-sessionlink') as HTMLElement).getAttribute('href') ?? '';
  const urlObj = new URL(url);
  const id = urlObj.searchParams.get('v') ?? '';
  
  return {
    album,
    albumArtUrl,
    artist,
    queue,
    title,
    id,
    year,
  }
}

export const getPlayerState = (): PlayerState => {
  const isPlaying = (document.querySelector('.play-pause-button') as HTMLElement).title === 'Pause';
  const progress = (document.querySelector('#progress-bar #sliderKnob') as HTMLElement).style.left;
  const thumbDown = (document.querySelector('.ytmusic-like-button-renderer.dislike') as HTMLElement).getAttribute('aria-pressed') === 'true';
  const thumbUp = (document.querySelector('.ytmusic-like-button-renderer.like') as HTMLElement).getAttribute('aria-pressed') === 'true';
  const trackTime = (document.querySelector('.time-info') as HTMLElement).textContent;
  const volume = (document.querySelector('#volume-slider') as HTMLElement).getAttribute('value') ?? '';

  return {
    isPlaying,
    progress,
    thumbDown,
    thumbUp,
    trackTime,
    volume
  }
}

const getQueueItems = (retry?: boolean): QueueItem[] => {
  const queue = [...document.querySelectorAll('.side-panel.modular ytmusic-player-queue-item')].map(function(itemElement) {
    const itemTitle = itemElement.getElementsByClassName('song-title')[0].textContent ?? '';
    const itemArtist = itemElement.getElementsByClassName('byline')[0].textContent ?? '';
    const itemTime = itemElement.getElementsByClassName('duration')[0].textContent ?? '';
    const queueItem: QueueItem = {
      src: itemElement.querySelector('yt-img-shadow.thumbnail img')?.getAttribute('src') ?? '',
      title: itemTitle,
      artist: itemArtist,
      time: itemTime
    };

    return queueItem;
  });

  // if (!queue[0].src.includes('googleusercontent.com') && retry) {
  //   return promisify(() => {
  //     scrollQueue();
  //     return getQueueItems(false);
  //   });
  // }

  return queue;
}

const scrollQueue = (callback: () => void) => {
  // var queue = document.querySelector('.queue');
  // var originalScroll = queue.scrollTop

  // queue.scrollTop = queue.scrollHeight - queue.clientHeight;

  // var scroller = setInterval(() => {
  //   queue.scrollTop = queue.scrollTop - 100;
  // }, 10)

  // setTimeout(() => {
  //   clearInterval(scroller);
  //   queue.scrollTop = originalScroll;
  //   callback()
  // }, 1200);
}