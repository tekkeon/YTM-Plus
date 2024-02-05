import { PlayerState, QueueItem, SongInfo } from '../types';

export const getSongInfo = (): Omit<SongInfo, 'id'> => {
  const additionalInfo = document
    .querySelector('.byline.ytmusic-player-bar')
    ?.textContent?.split('\u2022');
  const album = additionalInfo?.[1]?.trim() ?? '';
  const albumArtUrl =
    document.querySelector('#song-image img')?.getAttribute('src') ?? '';
  const artist = additionalInfo?.[0]?.trim() ?? '';
  const queue = getQueueItems();
  const title =
    document.querySelector('.title.ytmusic-player-bar')?.textContent ?? '';
  const year = additionalInfo?.[2]?.trim() ?? '';

  return {
    album,
    albumArtUrl,
    artist,
    queue,
    title,
    year,
  };
};

export const getPlayerState = (): PlayerState => {
  const isPlaying =
    (document.querySelector('.play-pause-button') as HTMLElement)?.title ===
    'Pause';
  const progress = (
    document.querySelector('#progress-bar #sliderKnob') as HTMLElement
  )?.style.left;
  const thumbDown =
    (
      document.querySelector(
        '.ytmusic-like-button-renderer.dislike'
      ) as HTMLElement
    )?.getAttribute('aria-pressed') === 'true';
  const thumbUp =
    (
      document.querySelector(
        '.ytmusic-like-button-renderer.like'
      ) as HTMLElement
    )?.getAttribute('aria-pressed') === 'true';
  const trackTime = (document.querySelector('.time-info') as HTMLElement)
    ?.textContent;
  const volume =
    (document.querySelector('#volume-slider') as HTMLElement)?.getAttribute(
      'value'
    ) ?? '';

  return {
    isPlaying,
    progress,
    thumbDown,
    thumbUp,
    trackTime,
    volume,
  };
};

const getQueueItemFromElement = (ytmQueueItem: HTMLElement): QueueItem => {
  const itemTitle =
    ytmQueueItem?.getElementsByClassName('song-title')?.[0]?.textContent ?? '';
  const itemArtist =
    ytmQueueItem?.getElementsByClassName('byline')?.[0]?.textContent ?? '';
  const itemTime =
    ytmQueueItem?.getElementsByClassName('duration')?.[0]?.textContent ?? '';
  const queueItem: QueueItem = {
    src:
      ytmQueueItem
        ?.querySelector('yt-img-shadow.thumbnail img')
        ?.getAttribute('src') ?? '',
    title: itemTitle,
    artist: itemArtist,
    time: itemTime,
  };

  return queueItem;
};

const getQueueItems = (): QueueItem[] => {
  const queueItemElements = getQueueItemElements();

  return queueItemElements.map(getQueueItemFromElement);
};

const getQueueItemElementFromWrapperRenderer = (
  rendererWrapper: HTMLElement
): HTMLElement => {
  const renderers = rendererWrapper?.querySelectorAll(
    'div.ytmusic-playlist-panel-video-wrapper-renderer'
  );

  const renderer = Array.from(renderers)?.find(
    (renderer) => !renderer.hasAttribute('hidden')
  );

  const ytmQueueItem = renderer?.querySelector('ytmusic-player-queue-item');

  return ytmQueueItem as HTMLElement;
};

const getQueueItemElements = (): HTMLElement[] => {
  const queue = document.querySelector('.side-panel #queue');
  const contents = queue?.querySelector('#contents');

  const itemNodes = contents?.childNodes;

  if (!itemNodes) return [];

  const queueItems = Array.from(itemNodes).map((itemNode) => {
    const itemNodeType = itemNode?.nodeName?.toLowerCase();

    if (itemNodeType === 'ytmusic-player-queue-item') {
      return itemNode as HTMLElement;
    } else {
      return getQueueItemElementFromWrapperRenderer(itemNode as HTMLElement);
    }
  });

  return queueItems;
};

export const playPauseTrack = () => {
  (document.querySelector('.play-pause-button') as HTMLElement)?.click();
};

export const skipTrack = () => {
  (document.querySelector('.next-button') as HTMLElement)?.click();
};

export const previousTrack = () => {
  (document.querySelector('.previous-button') as HTMLElement)?.click();
};

export const setCurrentTrack = (index: number) => {
  const queueItems = getQueueItemElements();
  const queueItem = queueItems?.[index];
  const button = queueItem?.querySelector(
    '.ytmusic-play-button-renderer'
  ) as HTMLElement;
  button?.click();
};

export const setTrackProgress = (progress: number) => {
  var progressBarRect = (
    document.getElementById('progress-bar') as HTMLElement
  )?.getBoundingClientRect();
  var y = progressBarRect?.y;
  var x = progressBarRect?.width * (progress / 100);

  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initMouseEvent(
    'click',
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
  (document.elementFromPoint(x, y) as HTMLElement)?.dispatchEvent(clickEvent);
};

export const setVolume = (volume: string) => {
  const volumeSlider = document.getElementById('volume-slider') as HTMLElement;
  volumeSlider?.setAttribute('value', volume);

  const changeEvent = new Event('change');
  volumeSlider?.dispatchEvent(changeEvent);
};

export const likeTrack = () => {
  (
    document.querySelector('.ytmusic-like-button-renderer.like') as HTMLElement
  )?.click();
};

export const dislikeTrack = () => {
  (
    document.querySelector(
      '.ytmusic-like-button-renderer.dislike'
    ) as HTMLElement
  )?.click();
};
