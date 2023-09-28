import { scrobbleTrack } from '../../util/lastFM';
import { MessageHandler } from '../../types';
import { sendEvent } from '../../util/analytics';

export const handleScrobble: MessageHandler = (
  payload,
  sender,
  sendResponse
) => {
  sendEvent({
    name: 'scrobble',
  });
  scrobbleTrack(payload);
};
