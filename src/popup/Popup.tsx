import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import MainPanel from './components/MainPanel'
import LyricsPanel from './components/LyricsPanel';
import { PlayerStateProvider } from '../contexts/PlayerStateContext';
import { SongInfoProvider } from '../contexts/SongInfoContext';
import { MiniTheme } from 'src/types';

export default function App () {
  const [showLyricsPanel, setShowLyricsPanel] = useState(false);

  const toggleLyricsPanel = () => {
    setShowLyricsPanel(!showLyricsPanel);
  }

  return (
    <PlayerStateProvider>
      <SongInfoProvider>
        <AppStyled expanded={showLyricsPanel}>
          <MainPanel toggleLyricsPanel={toggleLyricsPanel} />
          {
            showLyricsPanel
              ? <LyricsPanel />
              : null
          }
        </AppStyled>
      </SongInfoProvider>
    </PlayerStateProvider>
  )
}

interface AppStyledProps {
  expanded: boolean
}

const AppStyled = styled.div<AppStyledProps>`
  margin: 0px;
  padding: 0px;
  width: ${props => props.expanded ? '520px' : '260px'};
  height: 395px;
  background-color: ${props => props.theme.backgroundColor};
  display: flex;
  transition: width 0.3s ease-in-out;
`