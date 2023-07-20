import React, { useEffect, useState } from 'react';
import { SongInfo } from '../../types';
import styled, { createGlobalStyle } from 'styled-components';

const YTM_LISTEN_URL = 'https://music.youtube.com/watch?v=';

interface RedirectOptionProps {
  songInfo: Omit<SongInfo, 'queue' | 'year'>;
}

export default function RedirectOption({ songInfo }: RedirectOptionProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, [songInfo]);

  return (
    <RedirectOptionStyled show={show}>
      <GlobalStyle />
      <LogoContainer>
        <img src={chrome.runtime.getURL('assets/128-icon.png')} />
        <h1>YTM+</h1>
      </LogoContainer>
      <CloseButton onClick={() => setShow(false)}>
        <img src={chrome.runtime.getURL('assets/x.png')} />
      </CloseButton>
      <SongInfoContainer>
        <SongImage src={songInfo.albumArtUrl} />
        <div>
          <h1>{songInfo.title}</h1>
          <h2>{songInfo.artist}</h2>
        </div>
      </SongInfoContainer>
      <RedirectOptionButton href={`${YTM_LISTEN_URL}${songInfo.id}`}>
        <button>Listen on YTM →</button>
      </RedirectOptionButton>
    </RedirectOptionStyled>
  );
}

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Open+Sans:wght@400;500;600;700&family=Poppins:wght@200;300;400;500;600&display=swap');
`;

interface RedirectOptionStyledProps {
  show: boolean;
}

const RedirectOptionStyled = styled.div<RedirectOptionStyledProps>`
  position: fixed;
  padding: 15px;
  top: 20px;
  right: ${(props) => (props.show ? 20 : -300)}px;
  background: #222222;
  border-radius: 8px;
  transition: right 0.2s ease-out;
  width: 290px;

  * {
    font-family: 'Open Sans', sans-serif;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Poppins', cursive;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0px auto 10px;

  img {
    width: 25px;
    height: 25px;
  }

  h1 {
    font-size: 15px;
    margin-left: 5px;
    font-family: 'Comfortaa', sans-serif;
    color: white;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 10px;
  border: none;
  background: none;
  padding: 5px;
  cursor: pointer;

  img {
    width: 10px;
    height: 10px;
  }

  &:hover {
    filter: brightness(1.5);
  }
`;

const SongInfoContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  border-radius: 5px;
  padding: 8px;
  background-color: #303030;
  border: 1px solid #797979;

  div {
    margin-left: 10px;

    h1 {
      font-size: 15px;
      margin: 0;
      color: white;
      line-height: 18px;
    }

    h2 {
      font-size: 14px;
      margin: 0;
      color: #b3b3b3;
      line-height: 18px;
    }
  }
`;

const SongImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 5px;
`;

const RedirectOptionButton = styled.a`
  display: block;
  text-decoration: none;

  &:hover {
    text-decoration: none;

    button {
      filter: brightness(1.1);
    }
  }

  button {
    background-color: #e84844;
    border-radius: 5px;
    border: none;
    box-shadow: rgb(0 0 0 / 23%) 0px 0px 10px 1px;
    color: white;
    cursor: pointer;
    margin: 15px 0px 0;
    padding: 5px 42px;
    font-size: 16px;
    display: block;
    width: 100%;
  }
`;
