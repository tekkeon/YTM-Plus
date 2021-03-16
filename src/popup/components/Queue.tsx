import React from 'react';
import styled from 'styled-components';
import QueueItem from './QueueItem';
import { useSongInfo } from '../../contexts/SongInfoContext';
import { useMainPanelContext } from './MainPanel';
import { messaging } from '../../util/chrome';
import { MessageType } from '../../constants';

import closeIcon from '../../assets/x.png';

export default function Queue() {
  const mpContext = useMainPanelContext();
  const songInfo = useSongInfo()

  const onCloseClick = () => {
    mpContext?.setShowQueue(false);
  }

  const onQueueItemClick = (trackIndex: number) => {
    messaging.sendToYTMTab({
      type: MessageType.SET_CURRENT_TRACK,
      payload: trackIndex
    })
  }

  return (
    <QueueStyled show={mpContext?.showQueue ?? false}>
      <div className="queue-header">
        <h1>Queue<img className="queue-close" src={closeIcon} onClick={onCloseClick} /></h1>
      </div>
      <div className="queue-list">
        {
          songInfo?.queue?.map((queueItem, index) =>
            <QueueItem
              key={index}
              title={queueItem.title}
              artist={queueItem.artist}
              time={queueItem.time}
              imageUrl={queueItem.src}
              active={queueItem.title == songInfo?.title}
              onClick={() => onQueueItemClick(index)}
            />
          )
        }
      </div>
    </QueueStyled>
  )
}

interface QueueStyledProps {
  show: boolean
}

const QueueStyled = styled.div<QueueStyledProps>`
  position: absolute;
  z-index: 3;
  top: ${props => props.show ? '0' : '100%'};
  background-color: ${props => props.theme.queueBackground};
  height: 350px;
  width: 260px;
  transition: top 0.5s ease-in-out;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  .queue-header {
    width: 260px;
    height: 40px;
    position: absolute;
    top: 0;
    background-color: ${props => props.theme.footerBackgroundColor};

    &.active {
      position: fixed;
    }

    & > h1 {
      font-size: 20px;
      color: ${props => props.theme.primaryText};
      text-align: center;
      margin: 0;
      margin-top: 7px;
    }

    & > h1 > img {
      height: 15px;
      width: 15px;
      position: absolute;
      right: 10px;
      top: 12px;
      cursor: pointer;
    }
  }

  .queue-list {
    height: 310px;
    overflow-y: scroll;
    margin-top: 40px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`