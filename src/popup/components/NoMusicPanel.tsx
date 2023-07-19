import React from 'react';
import styled from 'styled-components';
import { tabs as chromeTabs } from '../../util/chrome';
import HeadphoneIcon from '../../assets/HeadphoneIcon.png';
import { DefaultMiniDarkTheme } from '../../constants';
import { useTabs } from '../../contexts/TabContext';

export default function NoMusicPanel() {
  const { tabs } = useTabs();

  const handleOpenTab = () => {
    if (tabs.length !== 1) return;

    chromeTabs.openTab(tabs[0].tab.id!);
  };

  return (
    <StyledNoMusicPanel>
      <div>
        <img className="icon" src={HeadphoneIcon} />
        <h2 className="title-text">No Music Playing</h2>
        <p className="description-text">
          Start listening on Youtube Music to use the mini player!
        </p>
        <button className="action-button" onClick={handleOpenTab}>
          Open YTM →
        </button>
      </div>
    </StyledNoMusicPanel>
  );
}

const StyledNoMusicPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  width: 100%;
  height: 100%;
  background-color: ${DefaultMiniDarkTheme.backgroundColor};

  .title-text {
    font-size: 18px;
    color: ${DefaultMiniDarkTheme.primaryText};
    text-align: center;
    margin-top: 35px;
  }

  .description-text {
    font-size: 14px;
    color: ${DefaultMiniDarkTheme.secondaryText};
    text-align: center;
  }

  .action-button {
    background-color: rgb(232 72 68);
    color: rgb(255, 255, 255);
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    margin: 16px auto 0px;
    display: block;
  }

  .icon {
    display: block;
    margin: auto;
    width: 120px;
  }
`;
