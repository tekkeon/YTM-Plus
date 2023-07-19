import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useMainPanelContext } from './MainPanel';

import { MessageType } from '../../constants';
import { Prev, Pause, Play, Next, Volume, Hamburger } from '../Icons';
import useKeyControls from '../../hooks/useKeyControls';
import { useTabs } from '../../contexts/TabContext';

const ControlsStyled = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: 2;
  width: 100%;

  .controls-next,
  .controls-prev,
  .controls-play-pause,
  .controls-volume,
  .controls-hamburger {
    cursor: pointer;
  }

  & > .controls-prev,
  & > .controls-next {
    width: 20px;
    height: 20px;
    padding: 17px 0px;
    margin: 0px 15px;
    fill: ${(props) => props.theme.primaryButton};
  }

  & > .controls-play-pause {
    padding: 12px 0px;
    margin: 0px 10px;
    fill: ${(props) => props.theme.primaryButton};
  }

  & > .controls-volume {
    width: 18px;
    height: 18px;
    margin-right: 20px;
    padding: 18px 0px;
    fill: ${(props) => props.theme.secondaryButton};
  }

  & > .controls-hamburger {
    width: 20px;
    height: 20px;
    margin-left: 20px;
    padding: 17px 0px;
    fill: ${(props) => props.theme.secondaryButton};
    stroke: ${(props) => props.theme.secondaryButton};
  }

  & > .controls-play-pause[src='src/pause.png'] {
    width: 40px;
    margin: 0px 5px;
  }
`;

export default function Controls() {
  const { tabs, sendMessageToTabs } = useTabs();
  const mpContext = useMainPanelContext();
  useKeyControls();

  const playerState = useMemo(() => tabs[0]?.playerState, [tabs]);

  const onQueueClick = () => {
    mpContext?.setShowQueue(!mpContext.showQueue);
  };

  const onVolumeMouseOver = () => {
    mpContext?.setShowVolumeSlider(true);
  };

  const onVolumeMouseOut = () => {
    mpContext?.setShowVolumeSlider(false);
  };

  const onPlayPauseClick = () => {
    sendMessageToTabs({ type: MessageType.PLAY_PAUSE });
  };

  const onNextClick = () => {
    sendMessageToTabs({ type: MessageType.SKIP_TRACK });
  };

  const onPrevClick = () => {
    sendMessageToTabs({ type: MessageType.PREVIOUS_TRACK });
  };

  return (
    <ControlsStyled>
      <svg
        className="controls-volume"
        onMouseOver={onVolumeMouseOver}
        onMouseOut={onVolumeMouseOut}
        viewBox="0 0 25 25"
        width="15"
        height="15"
      >
        <Volume />
      </svg>
      <svg
        className="controls-prev"
        onClick={onPrevClick}
        viewBox="0 0 25 25"
        width="20"
        height="20"
      >
        <Prev />
      </svg>
      <svg
        className="controls-play-pause"
        onClick={onPlayPauseClick}
        viewBox="0 0 25 25"
        width="30"
        height="30"
      >
        {playerState?.isPlaying ? <Pause /> : <Play />}
      </svg>
      <svg
        className="controls-next"
        onClick={onNextClick}
        viewBox="0 0 25 25"
        width="20"
        height="20"
      >
        <Next />
      </svg>
      <svg
        className="controls-hamburger"
        onClick={onQueueClick}
        viewBox="0 0 25 25"
        width="15"
        height="15"
      >
        <Hamburger />
      </svg>
    </ControlsStyled>
  );
}
