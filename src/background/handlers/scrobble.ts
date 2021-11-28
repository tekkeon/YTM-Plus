import { scrobbleTrack } from "../../util/lastFM";
import { MessageHandler } from "../../types";

export const handleScrobble: MessageHandler = (
  payload,
  sender,
  sendResponse
) => {
  scrobbleTrack(payload);
};
