import { MessageType } from './constants';

export interface LastFMSession {
  key: string;
  name: string;
}

export interface MiniTheme {
  primaryText: string;
  secondaryText: string;
  backgroundColor: string;
  footerBackgroundColor: string;
  primaryButton: string;
  secondaryButton: string;
  progressColor: string;
  queueBackground: string;
}

export interface PlayerState {
  isPlaying: boolean;
  progress: string | number;
  thumbDown: boolean;
  thumbUp: boolean;
  trackTime: string | null;
  volume: string;
}

export interface Message {
  type: MessageType;
  payload?: any;
}

export interface ModalState {
  connected: boolean;
  next?: any;
  playing?: boolean;
  sessionId?: string;
  timestamp?: string;
  url?: string;
  viewers?: string[];
}

export interface ModalStateFunctions {
  joinSession: (sessionId: string) => void;
  createSession: () => void;
  sendMessage: (message: Message) => void;
}

export interface NetworkState {
  loading: boolean;
  error: Error | null;
  data: any;
}

export interface Options {
  miniKeyControl: boolean;
  notifications: boolean;
  ytmKeyControl: boolean;
  lyrics: boolean;
  mediaKeyControl: boolean;
  popoutWindow: boolean;
  miniTheme: MiniTheme;
  ytmTheme: YTMTheme | null;
}

export interface QueueItem {
  src: string;
  title: string;
  artist: string;
  time: string;
}

export interface Session {
  id: string;
  playerState?: PlayerState
  url?: string;
  songInfo?: Partial<SongInfo>;
  listeners?: any;
}

export interface SongInfo {
  album: string;
  albumArtUrl: string;
  artist: string;
  queue: QueueItem[];
  title: string;
  id: string;
  year: string;
}

export interface YTMTheme {
  headerFooterBackground: string;
  headerFooterPrimaryText: string;
  headerFooterSecondaryText: string;
  headerFooterButtons: string;
  logo?: string;
  logoText?: string;
  mainBackground: string;
  mainHeading: string;
  mainPrimary: string;
  mainSecondary: string;
  queueHeading: string;
  queueBackground: string;
  queuePrimary: string;
  queueSecondary: string;
}

export type MessageHandler = (payload?: any, sender?: any, sendResponse?: (input: any) => void) => void;