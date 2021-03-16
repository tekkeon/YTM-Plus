import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { MessageType } from '../../constants';
import { usePlayerState } from '../../contexts/PlayerStateContext';
import { messaging } from '../../util/chrome';

import Controls from './Controls';

export default function Footer() {
  const playerState = usePlayerState();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    messaging.sendToYTMTab({
      type: MessageType.SET_TRACK_PROGRESS,
      payload: e.target.value
    })
  }

  return (
    <FooterStyled progress={playerState?.progress}>
      <div className="song-progress-container">
        <div className="song-progress"></div>
        <input type="range" className="progress-slider" onChange={onChange}></input>
      </div>
      <Controls />
    </FooterStyled>
  )
}

interface FooterStyledProps {
  progress?: string | number;
}

const FooterStyled = styled.div<FooterStyledProps>`
  position: absolute;
  bottom: 0;
  width: 260px;
  height: 60px;
  background-color: ${props => props.theme.footerBackgroundColor};
  z-index: 5;

  &:hover .song-progress-container{
    height: 5px;
    margin-top: -3px;
  }

  & > .song-progress-container {
    width: 100%;
    height: 2px;
    background-color: #606060;
    margin-top: 0px;
    transition: height 0.2s ease-in-out, margin 0.2s ease-in-out;

    & > .song-progress {
      width: ${props => props.progress || '0%'};
      height: 100%;
      background-color: ${props => props.theme.progressColor};
    }

    & > .progress-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 2px;
      outline: none;
      background: transparent;
      z-index: 100;
      position: absolute;
      top: 0;
      margin-top: -1px;
      cursor: pointer;

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
    }
  }
`