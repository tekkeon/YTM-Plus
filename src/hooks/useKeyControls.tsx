import { useEffect } from "react";
import { messaging } from "../util/chrome";
import { MessageType, VOLUME_INCREMENT } from "../constants";
import { usePlayerState } from "../contexts/PlayerStateContext";
import useStorage from "./useStorage";
import { Options } from "../types";

export const useKeyControls = () => {
  const playerState = usePlayerState();
  const { result: options } = useStorage<Options>("options");

  const handleSpacebar = () => {
    messaging.sendToYTMTab({ type: MessageType.PLAY_PAUSE });
  };

  const handleArrowUp = () => {
    const currentVolume = playerState?.volume;

    if (currentVolume) {
      const currentVolumeNum = parseFloat(currentVolume);
      const newVolume = currentVolumeNum + VOLUME_INCREMENT;

      messaging.sendToYTMTab({
        type: MessageType.SET_VOLUME,
        payload: newVolume.toString(),
      });
    }
  };

  const handleArrowDown = () => {
    const currentVolume = playerState?.volume;

    if (currentVolume) {
      const currentVolumeNum = parseFloat(currentVolume);
      const newVolume = currentVolumeNum - VOLUME_INCREMENT;

      messaging.sendToYTMTab({
        type: MessageType.SET_VOLUME,
        payload: newVolume.toString(),
      });
    }
  };

  const handleArrowRight = () => {
    messaging.sendToYTMTab({ type: MessageType.SKIP_TRACK });
  };

  const handleArrowLeft = () => {
    messaging.sendToYTMTab({ type: MessageType.PREVIOUS_TRACK });
  };

  useEffect(() => {
    if (!options?.miniKeyControl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          handleSpacebar();
          break;

        case "ArrowUp":
          handleArrowUp();
          break;

        case "ArrowDown":
          handleArrowDown();
          break;

        case "ArrowRight":
          handleArrowRight();
          break;

        case "ArrowLeft":
          handleArrowLeft();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerState?.volume, options?.miniKeyControl]);
};

export default useKeyControls;
