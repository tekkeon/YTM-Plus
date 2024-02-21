import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

export default function SpotifyToYtmDisabledMessage() {
  const [show, setShow] = useState(true);

  return (
    <SpotifyToYtmDisabledMessageStyled show={show}>
      <GlobalStyle />
      <LogoContainer>
        <img src={chrome.runtime.getURL('assets/128-icon.png')} />
        <h1>YTM+</h1>
      </LogoContainer>
      <CloseButton onClick={() => setShow(false)}>
        <img src={chrome.runtime.getURL('assets/x.png')} />
      </CloseButton>
      <SongInfoContainer>
        <div>
          <h1>Spotify-to-YTM Disabled</h1>
          <h2>
            The Spotify-to-YTM feature has been temporarily disabled as we work
            with Spotify to re-enable it.
          </h2>
        </div>
      </SongInfoContainer>
      <SpotifyToYtmDisabledMessageButton onClick={() => setShow(false)}>
        <button>Dismiss</button>
      </SpotifyToYtmDisabledMessageButton>
    </SpotifyToYtmDisabledMessageStyled>
  );
}

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Open+Sans:wght@400;500;600;700&family=Poppins:wght@200;300;400;500;600&display=swap');
`;

interface SpotifyToYtmDisabledMessageStyledProps {
  show: boolean;
}

const SpotifyToYtmDisabledMessageStyled = styled.div<SpotifyToYtmDisabledMessageStyledProps>`
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
  /* border-radius: 5px; */
  /* padding: 8px;
  background-color: #303030;
  border: 1px solid #797979; */

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
      margin-top: 8px;
    }
  }
`;

const SpotifyToYtmDisabledMessageButton = styled.div`
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
