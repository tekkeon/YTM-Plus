import React from 'react';
import styled from 'styled-components';

import ytmMiniLogo from '../../assets/128-icon.png';

interface QueueItemProps {
  imageUrl: string
  title: string
  artist: string
  time: string
  active: boolean
  onClick: React.MouseEventHandler<HTMLDivElement>
}

export default function QueueItem({ imageUrl, title, artist, time, active, onClick }: QueueItemProps) {
  return (
    <QueueItemStyled active={active} onClick={onClick}>
      <img className="queue-item-image" src={(!active && imageUrl) || ytmMiniLogo} />
      <div className="queue-item-info">
        <h1 className="queue-item-title">{title}</h1>
        <h2 className="queue-item-artist">{artist}</h2>
      </div>
      <h2 className="queue-item-time">{time || ''}</h2>
    </QueueItemStyled>
  )
}

interface QueueItemsStyledProps {
  active: boolean;
}

const QueueItemStyled = styled.div<QueueItemsStyledProps>`
  height: 50px;
  width: 95%;
  margin: auto;
  padding: 5px 0px;
  border-bottom: 1px solid rgb(107, 107, 107);
  cursor: pointer;
  background-color: ${props => props.active ? props.theme.secondaryText : props.theme.queueBackground};

  &:hover {
    background-color: ${props => props.theme.secondaryText};

    .queue-item-title, .queue-item-artist {
      color: ${props => props.theme.queueBackground};
    }
  }

  .queue-item-image {
    height: 70%;
    width: auto;
    float: left;
    margin: 3%;
  }

  .queue-item-info {
    float: left;
    max-width: 50%;
  }

  .queue-item-title {
    font-size: 15px;
    color: ${props => props.active ? props.theme.queueBackground : props.theme.secondaryText};
    font-weight: 500;
    margin: 0;
    margin-top: 5px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .queue-item-artist {
    font-size: 15px;
    color: ${props => props.active ? props.theme.queueBackground : props.theme.secondaryText};
    margin: 0;
    font-weight: 300;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .queue-item-time {
    float: right;
    font-size: 15px;
    color: ${props => props.theme.secondaryText};
    font-weight: 400;
    margin: 15px 5px;
  }
`