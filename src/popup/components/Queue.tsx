import React, { useMemo } from 'react';
import styled from 'styled-components';
import QueueItem from './QueueItem';
import { useMainPanelContext } from './MainPanel';
import { MessageType } from '../../constants';

import closeIcon from '../../assets/x.png';
import { useTabs } from '../../contexts/TabContext';
import { useSendEvent } from '../../util/analytics';

export default function Queue() {
  const mpContext = useMainPanelContext();
  const { tabs, sendMessageToTabs } = useTabs();
  const sendQueueItemPlayedEvent = useSendEvent({ name: 'queue_item_played' });

  const songInfo = useMemo(() => tabs[0]?.songInfo, [tabs]);

  const onCloseClick = () => {
    mpContext?.setShowQueue(false);
  };

  const onQueueItemClick = (trackIndex: number) => {
    sendQueueItemPlayedEvent();
    sendMessageToTabs({
      type: MessageType.SET_CURRENT_TRACK,
      payload: trackIndex,
    });
  };

  return (
    <QueueStyled show={mpContext?.showQueue ?? false}>
      <div className="queue-header">
        <h1>
          Queue
          <img className="queue-close" src={closeIcon} onClick={onCloseClick} />
        </h1>
      </div>
      <div className="queue-list">
        {songInfo?.queue?.map((queueItem, index) => (
          <QueueItem
            key={index}
            title={queueItem.title}
            artist={queueItem.artist}
            time={queueItem.time}
            imageUrl={queueItem.src}
            active={
              mpContext?.showQueue === true &&
              queueItem.title == songInfo?.title
            }
            onClick={() => onQueueItemClick(index)}
          />
        ))}
      </div>
    </QueueStyled>
  );
}

interface QueueStyledProps {
  show: boolean;
}

const QueueStyled = styled.div<QueueStyledProps>`
  position: absolute;
  z-index: 3;
  top: ${(props) => (props.show ? '0' : '100%')};
  background-color: ${(props) => props.theme.queueBackground};
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
    background-color: ${(props) => props.theme.footerBackgroundColor};
    font-weight: 500;

    &.active {
      position: fixed;
    }

    & > h1 {
      font-size: 18px;
      color: ${(props) => props.theme.primaryText};
      text-align: center;
      margin: 0;
      margin-top: 7px;
      font-weight: 500;
    }

    & > h1 > img {
      height: 12px;
      width: 12px;
      position: absolute;
      right: 12px;
      top: 15px;
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
`;
