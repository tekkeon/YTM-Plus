import React, { useState, createContext, useContext, useEffect } from 'react';
import styled from 'styled-components';

import AlbumArt from './AlbumArt'
import Footer from './Footer';
import VolumeSlider from './VolumeSlider';
import Queue from './Queue';
import { useSongInfo } from '../../contexts/SongInfoContext';
import { openTab } from '../../util/youtube';

import youtubeMusicLogo from '../../assets/YoutubeMusicLogo.png';
import useStorage from '../../hooks/useStorage';
import { Options } from '../../types';

interface IMainPanelContext {
  showVolumeSlider: boolean
  setShowVolumeSlider: (value: boolean) => void
  showQueue: boolean
  setShowQueue: (value: boolean) => void
}

export const MainPanelContext = createContext<IMainPanelContext | null>(null);
export const useMainPanelContext = () => useContext(MainPanelContext);

interface MainPanelProps {
  toggleLyricsPanel: React.MouseEventHandler<HTMLButtonElement>;
}

export default function MainPanel({ toggleLyricsPanel }: MainPanelProps) {
  const songInfo = useSongInfo();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const { result: options } = useStorage<Options>('options');

  const contextValue: IMainPanelContext = {
    showVolumeSlider,
    setShowVolumeSlider,
    showQueue,
    setShowQueue
  }

  return (
    <MainPanelContext.Provider value={contextValue}>
      <MainPanelStyled>
        <img className="youtube-logo" src={youtubeMusicLogo} onClick={openTab} />
        <AlbumArt />
        <div className="song-info">
          <h1 className="song-title">{songInfo?.title || '-'}</h1>
          <h2 className="song-add-info">
            {
              songInfo?.artist || songInfo?.album || songInfo?.year ?
                `${songInfo?.artist} \u2022 ${songInfo?.album} \u2022 ${songInfo?.year}` :
                '-'
            }
          </h2>
        </div>
        <Footer />
        <VolumeSlider />
        <Queue />
        {
          options && options.lyrics
            ? <>
              <button className="lyrics-toggle" onClick={toggleLyricsPanel}>Lyrics</button>
            </>
            : null
        }
      </MainPanelStyled>
    </MainPanelContext.Provider>
  )
}

const MainPanelStyled = styled.div`
  width: 260px;
  height: 395px;

  & .youtube-logo {
    height: 32px;
    display: block;
    margin: 15px auto;
    cursor: pointer;
  }
  
  .song-title {
    color: ${props => props.theme.primaryText};
    font-weight: 400;
    text-align: center;
    font-size: 23px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
    margin: 0 auto;
  }
  
  .song-add-info {
    color: ${props => props.theme.secondaryText};
    text-align: center;
    margin: 5px;
    font-weight: 400;
    font-size: 16px;
    height: 35px;
    overflow-y: hidden;
  }

  .lyrics-toggle {
    position: absolute;
    top: 60px;
    right: -12px;
    padding: 5px 8px;
    background: transparent;
    transform: rotate(-90deg);
    color: ${props => props.theme.secondaryText};
    border-style: solid;
    border-color: ${props => props.theme.secondaryText};
    border-bottom: none;
    outline: none;
  }
  
  .lyrics-toggle:hover {
    color: ${props => props.theme.primaryText};
    border-color: ${props => props.theme.primaryText};
    cursor: pointer;
  }
`