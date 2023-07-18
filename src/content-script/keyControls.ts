import { storage } from '../util/chrome';
import { VOLUME_INCREMENT } from '../constants';
import { skipTrack, previousTrack } from './lib';
import { Options } from '../types';

export const initializeKeyControls = () => {
  document.addEventListener('keydown', async (event) => {
    if (!(await keyControlsEnabled())) return;

    switch (event.key) {
      case 'ArrowRight':
        handleArrowRight();
        break;

      case 'ArrowLeft':
        handleArrowLeft();
        break;
    }
  });
};

const keyControlsEnabled = async () => {
  const options = (await storage.get('options')) as Options;

  return options?.ytmKeyControl;
};

const handleArrowRight = () => {
  skipTrack();
};

const handleArrowLeft = () => {
  previousTrack();
};

export default initializeKeyControls;
