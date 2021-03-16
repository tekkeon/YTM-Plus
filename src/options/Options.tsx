import React from 'react';
import styled from 'styled-components';
import useStorage from '../hooks/useStorage';
import Option from './components/Option';
import { Options } from 'src/types';
import PopupThemeEditor from './components/PopupThemeEditor';
import YTMThemeEditor from './components/YTMThemeEditor';

export default function Options() {
  const { result: options, set: setOptions } = useStorage<Options>('options');

  const handleCheckboxClick = (id: keyof Options) => {
    const newOptions = {
      ...options,
      [id]: !options[id]
    }

    setOptions(newOptions)
  };

  const handleYTMEditorPopout = () => {
    chrome.windows.create({
      height: 520,
      width: 330,
      url: chrome.runtime.getURL('html/themePopup.html'),
      type: 'popup'
    });
  }

  return (
    <OptionsStyled>
      <h1 className="settings-page-title"><i className="fa fa-cogs" aria-hidden="true" />YT Music Mini Settings</h1>
      <div className="settings-page-container">
        <div className="settings-section">
          <h2>Mini Player</h2>
          <Option
            title="Key controls"
            checked={options?.miniKeyControl}
            description="Spacebar: Play/Pause | Up &amp; Down: Volume | Right &amp; Left: Skip"
            onClick={() => handleCheckboxClick('miniKeyControl')} />
          <p className="check-option-extra"></p>
        </div>
        <div className="settings-section">
          <h2>YouTube Music Website</h2>
          <Option title="Notifications on song change" checked={options?.notifications} onClick={() => handleCheckboxClick('notifications')} />
          <Option
            title="Key controls"
            description="Adds next and previous song controls with arrow keys when on YouTube Music page"
            checked={options?.ytmKeyControl}
            onClick={() => handleCheckboxClick('ytmKeyControl')} />
        </div>
        <div className="settings-section">
          <h2>Lyrics</h2>
          <Option title="Lyrics enabled" checked={options?.lyrics} onClick={() => handleCheckboxClick('lyrics')} />
        </div>
        <div className="settings-section">
          <h2>LastFM</h2>
          <h3 className="last-fm-user">Loading current user...</h3>
          <button className="last-fm-button">LastFM Login</button>
        </div>
        <div className="settings-section">
          <h2>Beta: Mini Player Theme</h2>
          <PopupThemeEditor />
        </div>
        <div className="settings-section">
          <h2>Beta: YouTube Music Theme</h2>
          <button onClick={handleYTMEditorPopout}>Popout Editor</button>
          <YTMThemeEditor />
        </div>
      </div>
    </OptionsStyled>
  )
}

const OptionsStyled = styled.div`
  .settings-page-title {
    font-size: 24px;
    font-weight: 500;
    width: 600px;
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
    padding: 20px;
  }

  .settings-section {
    margin-bottom: 35px;

    & > h2 {
      font-size: 28px;
      font-weight: 400;
      color: #da0000;
      margin-bottom: 15px;
      margin-top: 0;
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

  .last-fm-button:hover, .save-button:hover {
    background-color: white;
    color: #da0000;
  }
`