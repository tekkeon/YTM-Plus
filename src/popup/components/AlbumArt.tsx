import React from 'react';
import styled from 'styled-components';
import thumbUpOutline from '../../assets/thumbupoutline.png';
import thumbDownOutline from '../../assets/thumbdownoutline.png';
import thumbUpFilled from '../../assets/thumbupfilled.png';
import thumbDownFilled from '../../assets/thumbdownfilled.png';

import { useSongInfo } from '../../contexts/SongInfoContext';
import { usePlayerState } from '../../contexts/PlayerStateContext';
import { messaging } from '../../util/chrome';
import { MessageType } from '../../constants';

export default function AlbumArt() {
  const songInfo = useSongInfo();
  const playerState = usePlayerState();

  const onThumbUpClick = () => {
    messaging.sendToYTMTab({type: MessageType.LIKE_TRACK, payload: !playerState?.thumbUp });
  }

  const onThumbDownClick = () => {
    messaging.sendToYTMTab({type: MessageType.DISLIKE_TRACK, payload: !playerState?.thumbDown });
  }

  return (
    <AlbumArtStyled url={songInfo?.albumArtUrl ?? ''}>
      <div className="album-image"></div>
      <div className="album-overlay">
        <div className="thumbs">
          <img className="thumb-up" src={playerState?.thumbUp ? thumbUpFilled : thumbUpOutline} onClick={onThumbUpClick} />
          <img className="thumb-down" src={playerState?.thumbDown ? thumbDownFilled : thumbDownOutline} onClick={onThumbDownClick} />
        </div>
        <p className="times">{playerState?.trackTime || '0:00 / 0:00'}</p>
      </div>
    </AlbumArtStyled>
  )
}

interface AlbumArtStyledProps {
  url: string;
}

const AlbumArtStyled = styled.div<AlbumArtStyledProps>`
  border: 1px solid ${props => props.theme.secondaryText};
  height: 180px;
  width: 180px;
  margin: 15px auto 15px auto;
  position: relative;

  & > .album-image {
    background: ${props => props.url ?
      `url(${props.url})` :
      'linear-gradient(#424242, #333333)'};
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain !important;
    height: 100%;
    width: 100%;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover {
    & > .album-image {
      opacity: 0.3;
    }

    & > .album-overlay {
      opacity: 1;
    }
  }

  & > .album-overlay {
    height: 100%;
    width: 100%;
    opacity: 0;
    top: 0;
    position: absolute;

    & > .thumbs {
      margin: 10px auto;
      margin-top: 45px;
      width: 100px;
      text-align: center;
    }
    
    & > .thumbs img {
      height: 35px;
      width: 35px;
      margin: 5px;
      cursor: pointer;
    }

    & > .times {
      font-size: 24px;
      font-weight: 500;
      color: white;
      text-align: center;
      top: 0;
      margin: auto;
    }
  }
`