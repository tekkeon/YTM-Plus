import { useEffect, useMemo } from 'react';
import { MessageType, VOLUME_INCREMENT } from '../constants';
import useStorage from './useStorage';
import { Options } from '../types';
import { useTabs } from '../contexts/TabContext';

export const useKeyControls = () => {
  const { tabs, sendMessageToTabs } = useTabs();
  const { result: options } = useStorage<Options>('options');

  const playerState = useMemo(() => tabs[0]?.playerState, [tabs]);

  const handleSpacebar = () => {
    sendMessageToTabs({ type: MessageType.PLAY_PAUSE });
  };

  const handleArrowUp = () => {
    const currentVolume = playerState?.volume;

    if (currentVolume) {
      const currentVolumeNum = parseFloat(currentVolume);
      const newVolume = currentVolumeNum + VOLUME_INCREMENT;

      sendMessageToTabs({
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

      sendMessageToTabs({
        type: MessageType.SET_VOLUME,
        payload: newVolume.toString(),
      });
    }
  };

  const handleArrowRight = () => {
    sendMessageToTabs({ type: MessageType.SKIP_TRACK });
  };

  const handleArrowLeft = () => {
    sendMessageToTabs({ type: MessageType.PREVIOUS_TRACK });
  };

  useEffect(() => {
    if (!options?.miniKeyControl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          handleSpacebar();
          break;

        case 'ArrowUp':
          handleArrowUp();
          break;

        case 'ArrowDown':
          handleArrowDown();
          break;

        case 'ArrowRight':
          handleArrowRight();
          break;

        case 'ArrowLeft':
          handleArrowLeft();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerState?.volume, options?.miniKeyControl]);
};

export default useKeyControls;
