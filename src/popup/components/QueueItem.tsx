import React from 'react';
import styled from 'styled-components';

import ytmMiniLogo from '../../assets/128-icon.png';
import imageComingSoon from '../../assets/image-coming-soon.png';

interface QueueItemProps {
  imageUrl: string;
  title: string;
  artist: string;
  time: string;
  active: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export default function QueueItem({
  imageUrl,
  title,
  artist,
  time,
  active,
  onClick,
}: QueueItemProps) {
  if (!imageUrl.match(/https:\/\/.*\.com\/.*/)) {
    imageUrl = imageComingSoon;
  }

  return (
    <QueueItemStyled active={active} onClick={onClick}>
      <img
        className="queue-item-image"
        src={(!active && imageUrl) || ytmMiniLogo}
      />
      <div className="queue-item-info">
        <h1 className="queue-item-title">{title}</h1>
        <h2 className="queue-item-artist">{artist}</h2>
      </div>
      <h2 className="queue-item-time">{time || ''}</h2>
    </QueueItemStyled>
  );
}

interface QueueItemsStyledProps {
  active: boolean;
}

const QueueItemStyled = styled.div<QueueItemsStyledProps>`
  height: 50px;
  margin: auto;
  padding: 5px 0px;
  border: 1px solid transparent;
  border-bottom: 1px solid rgb(107, 107, 107);
  cursor: pointer;
  background-color: ${(props) =>
    props.active ? props.theme.secondaryText : props.theme.queueBackground};

  &:hover {
    border: 1px solid ${(props) => props.theme.primaryText};
  }

  .queue-item-image {
    height: 70%;
    width: auto;
    float: left;
    margin: 3%;
  }

  .queue-item-info {
    float: left;
    max-width: 60%;
  }

  .queue-item-title {
    color: ${(props) =>
      props.active ? props.theme.queueBackground : props.theme.primaryText};
    font-size: 14px;
    font-weight: 500;
    margin: 7px 0px 0px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 18px;
  }

  .queue-item-artist {
    color: ${(props) =>
      props.active ? props.theme.queueBackground : props.theme.secondaryText};
    font-size: 14px;
    margin: 0px;
    font-weight: 300;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .queue-item-time {
    float: right;
    font-size: 14px;
    color: ${(props) => props.theme.secondaryText};
    font-weight: 400;
    margin: 15px 5px;
  }
`;
