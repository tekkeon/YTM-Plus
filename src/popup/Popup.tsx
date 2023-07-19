import React, { useState } from 'react';
import styled from 'styled-components';
import MainPanel from './components/MainPanel';
import LyricsPanel from './components/LyricsPanel';
import NoMusicPanel from './components/NoMusicPanel';
import LoadingPanel from './components/LoadingPanel';
import { useTabs } from '../contexts/TabContext';
import SelectTabPanel from './components/SelectTabPanel';

export default function App() {
  const { tabs, loading: tabsLoading } = useTabs();
  const [showLyricsPanel, setShowLyricsPanel] = useState(false);

  const songInfo = tabs[0]?.songInfo;

  const toggleLyricsPanel = () => {
    setShowLyricsPanel(!showLyricsPanel);
  };

  const renderPanel = () => {
    if (tabsLoading) {
      return <LoadingPanel />;
    } else if (tabs.length > 1) {
      return <SelectTabPanel />;
    } else if (!songInfo?.title) {
      return <NoMusicPanel />;
    } else {
      return (
        <>
          <MainPanel toggleLyricsPanel={toggleLyricsPanel} />
          {showLyricsPanel ? <LyricsPanel /> : null}
        </>
      );
    }
  };

  return <AppStyled expanded={showLyricsPanel}>{renderPanel()}</AppStyled>;
}

interface AppStyledProps {
  expanded: boolean;
}

const AppStyled = styled.div<AppStyledProps>`
  margin: 0px;
  padding: 0px;
  width: ${(props) => (props.expanded ? '520px' : '260px')};
  height: 395px;
  background-color: ${(props) => props.theme.backgroundColor};
  display: flex;
  transition: width 0.3s ease-in-out;
`;
