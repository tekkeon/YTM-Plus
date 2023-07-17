import React from "react";
import styled from "styled-components";
import { useMainPanelContext } from "./MainPanel";
import { usePlayerState } from "../../contexts/PlayerStateContext";
import { messaging } from "../../util/chrome";

import { MessageType } from "../../constants";
import { Prev, Pause, Play, Next, Volume, Hamburger } from "../Icons";
import useKeyControls from "../../hooks/useKeyControls";

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
    padding: 20px 0px;
    margin: 0px 15px;
    fill: ${(props) => props.theme.primaryButton};
  }

  & > .controls-play-pause {
    padding: 15px 0px;
    margin: 0px 10px;
    fill: ${(props) => props.theme.primaryButton};
  }

  & > .controls-volume {
    width: 15px;
    height: 15px;
    margin-right: 20px;
    padding: 22px 0px;
    fill: ${(props) => props.theme.secondaryButton};
  }

  & > .controls-hamburger {
    width: 15px;
    height: 15px;
    margin-left: 20px;
    padding: 22px 0px;
    fill: ${(props) => props.theme.secondaryButton};
  }

  & > .controls-play-pause[src="src/pause.png"] {
    width: 40px;
    margin: 0px 5px;
  }
`;

export default function Controls() {
  const mpContext = useMainPanelContext();
  const playerState = usePlayerState();
  useKeyControls();

  const onQueueClick = () => {
    mpContext?.setShowQueue(!mpContext.showQueue);
  };

  const onVolumeMouseOver = () => {
    mpContext?.setShowVolumeSlider(true);
  };

  const onVolumeMouseOut = () => {
    setTimeout(() => {
      mpContext?.setShowVolumeSlider(false);
    }, 1000);
  };

  const onPlayPauseClick = () => {
    messaging.sendToYTMTab({ type: MessageType.PLAY_PAUSE });
  };

  const onNextClick = () => {
    messaging.sendToYTMTab({ type: MessageType.SKIP_TRACK });
  };

  const onPrevClick = () => {
    messaging.sendToYTMTab({ type: MessageType.PREVIOUS_TRACK });
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
