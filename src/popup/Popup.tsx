import React, { useState } from "react";
import styled from "styled-components";
import MainPanel from "./components/MainPanel";
import LyricsPanel from "./components/LyricsPanel";
import { useSongInfo } from "../contexts/SongInfoContext";
import NoMusicPanel from "./components/NoMusicPanel";
import LoadingPanel from "./components/LoadingPanel";

export default function App() {
  const { songInfo, loading } = useSongInfo();
  const [showLyricsPanel, setShowLyricsPanel] = useState(false);

  console.log({ loading });

  const toggleLyricsPanel = () => {
    setShowLyricsPanel(!showLyricsPanel);
  };

  const renderPanel = () => {
    if (loading) {
      return <LoadingPanel />;
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
  width: ${(props) => (props.expanded ? "520px" : "260px")};
  height: 395px;
  background-color: ${(props) => props.theme.backgroundColor};
  display: flex;
  transition: width 0.3s ease-in-out;
`;
