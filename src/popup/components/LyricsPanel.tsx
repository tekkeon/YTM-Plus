import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import config from '../../config';
import { useSongInfo } from '../../contexts/SongInfoContext';
import { NetworkState } from '../../types';
import { getLyrics } from '../../util/lyrics';

export default function LyricsPanel() {
  const [lyrics, setLyrics] = useState<NetworkState>({
    loading: false,
    data: null,
    error: null
  })
  const songInfo = useSongInfo();
  const track = songInfo?.title ?? '';
  const artist = songInfo?.artist ?? '';

  useEffect(() => {
    setLyrics({ ...lyrics, loading: true });

    getLyrics(artist, track)
      .then((lyrics) => {
        console.log(lyrics);
        setLyrics({
          ...lyrics,
          loading: false,
          data: lyrics
        })
      }).catch((e) => {
        setLyrics({
          ...lyrics,
          loading: false,
          error: e
        })
      });
  }, [songInfo]);

  return (
    <StyledLyricsPanel>
      <h1>Lyrics</h1>
      <h2>powered by <a href="https://www.audd.io/">AudD.io</a></h2>
      {
        lyrics.loading
        ? <div className="loader"></div>
        : lyrics.error
        ? <div>:(</div>
        : <p>{lyrics.data}</p>
      }
    </StyledLyricsPanel>
  )
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

    a:visited {
      color: #8f8f8f;
      font-weight: 400;
      font-size: 12px;
      margin-top: 2px;
    }
  }

  p {
    max-width: 90%;
    margin: 20px auto;
    color: rgb(224, 224, 224);

    &.no-results {
      text-align: center;
      color: rgb(172, 172, 172);
      margin-top: 40px;
    }

    br {
      display: block;
      margin: 5px 0;
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
`