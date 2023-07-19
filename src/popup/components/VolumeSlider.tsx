import React, { ChangeEvent, useMemo } from 'react';
import styled from 'styled-components';
import { useMainPanelContext } from './MainPanel';
import { MessageType } from '../../constants';
import { useTabs } from '../../contexts/TabContext';

export default function VolumeSlider() {
  const mpContext = useMainPanelContext();
  // const playerState = usePlayerState();
  const { tabs, sendMessageToTabs } = useTabs();

  const playerState = useMemo(() => tabs[0]?.playerState, [tabs]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    sendMessageToTabs({
      type: MessageType.SET_VOLUME,
      payload: e.target.value,
    });
  };

  return (
    <VolumeSliderStyled
      show={mpContext?.showVolumeSlider ?? false}
      volume={playerState?.volume}
    >
      <div className="volume-slider-background">
        <div className="current-volume"></div>
      </div>
      <VolumeSliderInput
        type="range"
        className="volume-slider"
        onChange={onChange}
      ></VolumeSliderInput>
    </VolumeSliderStyled>
  );
}

interface VolumeSliderStyledProps {
  show: boolean;
  volume?: string;
}

const VolumeSliderStyled = styled.div<VolumeSliderStyledProps>`
  position: absolute;
  left: 0px;
  bottom: 0px;
  height: 110px;
  width: 40px;
  background-color: transparent;
  display: ${(props) => (props.show ? 'block' : 'none')};
  z-index: 105;
  padding-bottom: 56px;
  left: 3px;

  &:hover {
    display: block;
  }

  .volume-slider-background {
    background-color: transparent;
    margin: 5px 35%;
    height: 95px;
    position: absolute;
    width: 25%;
    border: 1px solid ${(props) => props.theme.secondaryText};
    border-radius: 10px;
  }

  .current-volume {
    width: 100%;
    height: ${(props) => `${props.volume || '0'}%`};
    background-color: ${(props) => props.theme.progressColor};
    position: absolute;
    bottom: 0;
    border-radius: 10px;
  }
`;

const VolumeSliderInput = styled.input`
  writing-mode: bt-lr;
  -webkit-appearance: slider-vertical;
  display: block;
  width: 25%;
  height: 95px;
  margin: 5px 35%;
  position: absolute;
  background: transparent;
  opacity: 0;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    height: 12px;
    width: 12px;
  }

  &::-moz-range-thumb {
    background: transparent;
    cursor: pointer;
    height: 12px;
    width: 12px;
  }
`;
