import React, { useEffect } from 'react';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { authorizeUser, finishAuth } from '../util/lastFM';
import Option from './components/Option';
import PopupThemeEditor from './components/PopupThemeEditor';
import { LastFMSession, Options } from '../types';
import useStorage from '../hooks/useStorage';

export default function Options() {
  const { result: options, set: setOptions } = useStorage<Options>('options');
  const { result: lastFMSession, set: setLastFMSession } =
    useStorage<LastFMSession>('lastfm-info');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      finishAuth(token)
        .then((res) => {
          setLastFMSession(res);
          window.history.replaceState({}, document.title, '/options.html');
        })
        .catch(console.log);
    }
  }, []);

  const handleCheckboxClick = (id: keyof Options) => {
    const newOptions = {
      ...options,
      [id]: !options[id],
    };

    setOptions(newOptions);
  };

  return (
    <OptionsStyled>
      <h1 className="settings-page-title">
        <FontAwesomeIcon icon={faCogs} />
        &nbsp;&nbsp;YTM+ Settings
      </h1>
      <div className="settings-page-container">
        <div className="settings-section">
          <h2>Mini Player</h2>
          <Option
            title="Key controls"
            checked={options?.miniKeyControl}
            description="Spacebar: Play/Pause | Up &amp; Down: Volume | Right &amp; Left: Skip"
            onClick={() => handleCheckboxClick('miniKeyControl')}
          />
          <p className="check-option-extra"></p>
        </div>
        <div className="settings-section">
          <h2>YouTube Music Website</h2>
          <Option
            title="Notifications on song change"
            checked={options?.notifications}
            onClick={() => handleCheckboxClick('notifications')}
          />
          <Option
            title="Key controls"
            description="Adds next and previous song controls with arrow keys when on YouTube Music page"
            checked={options?.ytmKeyControl}
            onClick={() => handleCheckboxClick('ytmKeyControl')}
          />
        </div>
        <div className="settings-section">
          <h2>Lyrics</h2>
          <Option
            title="Lyrics enabled"
            checked={options?.lyrics}
            onClick={() => handleCheckboxClick('lyrics')}
          />
        </div>
        <div className="settings-section">
          <h2>Spotify</h2>
          <Option
            title="Enable Spotify Redirect Dialogue"
            description="Shows a popup on Spotify track links asking to listen on YouTube Music"
            checked={options?.spotifyToYTM}
            onClick={() => handleCheckboxClick('spotifyToYTM')}
          />
        </div>
        <div className="settings-section">
          <h2>LastFM</h2>
          <h3 className="last-fm-user">
            {lastFMSession?.name ?? 'No logged-in user.'}
          </h3>
          <p>
            Note: Per LastFM rules, scrobbles only occur after listening to more
            than half of a given song.
          </p>
          <button className="last-fm-button" onClick={authorizeUser}>
            LastFM Login
          </button>
        </div>
        <div className="settings-section">
          <h2>Mini Player Theme</h2>
          <PopupThemeEditor />
        </div>
      </div>
    </OptionsStyled>
  );
}

const OptionsStyled = styled.div`
  .settings-page-title {
    font-size: 24px;
    font-weight: 500;
    width: 650px;
    margin: 20px auto 10px auto;
    color: #da0000;

    i {
      margin-right: 10px;
    }
  }

  .settings-page-container {
    width: 675px;
    box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.164);
    margin: 20px auto;
    background-color: #4c4c4c;
    border-radius: 3px;
    padding: 20px 80px;
  }

  .settings-section {
    margin-bottom: 35px;

    & > h2 {
      font-size: 28px;
      font-weight: 600;
      color: rgb(251 12 12);
      margin-bottom: 15px;
      margin-top: 0;
    }

    & > h3 {
      color: white;
    }

    & > p {
      font-size: 12px;
      color: rgb(189, 189, 189);
    }
  }

  .checkbox i {
    color: white;
    margin-top: 2px;
    display: block;
    text-align: center;
  }

  .last-fm-user {
    color: rgb(189, 189, 189);
    font-weight: 400;

    span {
      color: white;
      font-weight: 600;
    }
  }

  .last-fm-button {
    padding: 4px 13px;
    background-color: #da0000;
    color: white;
    outline: none;
    border: 1px solid #da0000;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
  }

  .last-fm-button:hover,
  .save-button:hover {
    background-color: white;
    color: #da0000;
  }
`;
