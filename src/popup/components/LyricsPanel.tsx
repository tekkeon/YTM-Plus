import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NetworkState } from '../../types';
import { getLyrics } from '../../util/lyrics';
import { useTabs } from '../../contexts/TabContext';

const renderLyrics = (lyrics: string[]) => {
  return lyrics.map((lyric) => {
    if (lyric.match(/\[.*\]/)) {
      return <LyricHeader>{lyric.substr(1, lyric.length - 2)}</LyricHeader>;
    } else {
      return <Lyric>{lyric}</Lyric>;
    }
  });
};

export default function LyricsPanel() {
  const [lyrics, setLyrics] = useState<NetworkState>({
    loading: false,
    data: null,
    error: null,
  });
  const { tabs } = useTabs();
  const songInfo = tabs[0]?.songInfo;
  const track = songInfo?.title ?? '';
  const artist = songInfo?.artist ?? '';

  useEffect(() => {
    setLyrics({ ...lyrics, loading: true });

    getLyrics(artist, track)
      .then((lyricsResult) => {
        setLyrics({
          ...lyrics,
          loading: false,
          data: lyricsResult,
        });
      })
      .catch((e) => {
        setLyrics({
          ...lyrics,
          loading: false,
          error: e,
        });
      });
  }, [songInfo]);

  return (
    <StyledLyricsPanel>
      <h1>Lyrics</h1>
      <h2>
        powered by <a href="https://www.audd.io/">AudD.io</a>
      </h2>
      {lyrics.loading ? (
        <div className="loader"></div>
      ) : lyrics.error ? (
        <div>:(</div>
      ) : (
        <>
          {lyrics?.data ? (
            renderLyrics(lyrics.data)
          ) : (
            <NoLyrics>No lyrics found.</NoLyrics>
          )}
        </>
      )}
    </StyledLyricsPanel>
  );
}

const StyledLyricsPanel = styled.div`
  width: 260px;
  height: 395px;
  overflow-y: scroll;
  border-left: 1px solid #383838;

  &::-webkit-scrollbar {
    width: 0 !important;
  }

  h1 {
    color: #cecece;
    text-align: center;
    font-weight: 400;
    font-size: 24px;
    margin-bottom: 0;
  }

  h2 {
    color: #8f8f8f;
    text-align: center;
    font-weight: 400;
    font-size: 12px;
    margin-top: 2px;

    a,
    a:visited {
      color: #8f8f8f;
      font-weight: 400;
      font-size: 12px;
      margin-top: 2px;
    }
  }

  .loader {
    border: 5px solid #5a5a5a;
    border-radius: 50%;
    border-top: 5px solid #8e8e8e;
    display: block;
    width: 30px;
    height: 30px;
    margin: 30px auto;
    -webkit-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LyricHeader = styled.h3`
  color: ${(props) => props.theme.progressColor};
  font-size: 15px;
  margin: 20px 20px 10px;
  font-style: italic;
`;

const Lyric = styled.p`
  color: white;
  margin: 10px 20px;
  font-size: 14px;
  font-weight: 300;
`;

const NoLyrics = styled.p`
  color: white;
  font-size: 14px;
  text-align: center;
`;
