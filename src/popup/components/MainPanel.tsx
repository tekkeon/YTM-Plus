import React, { useState, createContext, useContext, useMemo } from 'react';
import styled from 'styled-components';

import AlbumArt from './AlbumArt';
import Footer from './Footer';
import VolumeSlider from './VolumeSlider';
import Queue from './Queue';
import { tabs as chromeTabs } from '../../util/chrome';

import ytmPlusIcon from '../../assets/128-icon.png';
import useStorage from '../../hooks/useStorage';
import { Options } from '../../types';
import { useTabs } from '../../contexts/TabContext';

interface IMainPanelContext {
  showVolumeSlider: boolean;
  setShowVolumeSlider: (value: boolean) => void;
  showQueue: boolean;
  setShowQueue: (value: boolean) => void;
}

export const MainPanelContext = createContext<IMainPanelContext | null>(null);
export const useMainPanelContext = () => useContext(MainPanelContext);

interface MainPanelProps {
  toggleLyricsPanel: React.MouseEventHandler<HTMLButtonElement>;
}

export default function MainPanel({ toggleLyricsPanel }: MainPanelProps) {
  const { tabs } = useTabs();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const { result: options } = useStorage<Options>('options');

  const songInfo = useMemo(() => tabs[0]?.songInfo, [tabs]);

  const contextValue: IMainPanelContext = {
    showVolumeSlider,
    setShowVolumeSlider,
    showQueue,
    setShowQueue,
  };

  const handleLogoClick = () => {
    if (tabs.length !== 1) return;

    chromeTabs.openTab(tabs[0].tab.id!);
  };

  const renderByLine = () => {
    if (!songInfo?.artist && !songInfo?.album && !songInfo?.year) {
      return '-';
    }

    let line = '';

    if (songInfo?.artist) {
      line += songInfo?.artist;
    }

    if (songInfo?.album) {
      line += ` \u2022 ${songInfo?.album}`;
    }

    if (songInfo?.year) {
      line += ` \u2022 ${songInfo?.year}`;
    }

    return line;
  };

  return (
    <MainPanelContext.Provider value={contextValue}>
      <MainPanelStyled>
        <div className="logo-container">
          <img className="logo" src={ytmPlusIcon} onClick={handleLogoClick} />
          <h1 className="logo-text">YTM+</h1>
        </div>
        <AlbumArt />
        <div className="song-info">
          <h1 className="song-title">{songInfo?.title || '-'}</h1>
          <h2 className="song-add-info">{renderByLine()}</h2>
        </div>
        <Footer />
        <VolumeSlider />
        <Queue />
        {options && options.lyrics ? (
          <>
            <button className="lyrics-toggle" onClick={toggleLyricsPanel}>
              Lyrics
            </button>
          </>
        ) : null}
      </MainPanelStyled>
    </MainPanelContext.Provider>
  );
}

const MainPanelStyled = styled.div`
  width: 260px;
  height: 395px;

  & .logo-container {
    display: flex;
    margin-top: 10px;
    justify-content: center;
    align-items: center;

    & .logo {
      height: 30px;
      width: 30px;
      display: block;
      cursor: pointer;
    }

    & .logo-text {
      margin: 0;
      margin-left: 5px;
      font-family: 'Comfortaa', sans-serif;
      color: ${(props) => props.theme.primaryText};
      font-size: 18px;
    }
  }

  .song-title {
    color: ${(props) => props.theme.primaryText};
    font-weight: 500;
    text-align: center;
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
    margin: 0px auto;
    margin-top: 20px;
  }

  .song-add-info {
    color: ${(props) => props.theme.secondaryText};
    text-align: center;
    margin: 0px auto;
    font-weight: 400;
    font-size: 15px;
    height: 40px;
    overflow-y: hidden;
    width: 95%;
  }

  .lyrics-toggle {
    position: absolute;
    top: 60px;
    right: -12px;
    padding: 5px 8px;
    background: transparent;
    transform: rotate(-90deg);
    color: ${(props) => props.theme.secondaryText};
    border-style: solid;
    border-color: ${(props) => props.theme.secondaryText};
    border-bottom: none;
    outline: none;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border-width: 1px;
  }

  .lyrics-toggle:hover {
    color: ${(props) => props.theme.primaryText};
    border-color: ${(props) => props.theme.primaryText};
    cursor: pointer;
  }
`;
