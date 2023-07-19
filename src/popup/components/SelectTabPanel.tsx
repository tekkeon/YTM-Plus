import React from 'react';
import styled from 'styled-components';
import { useTabs } from '../../contexts/TabContext';
import { Tab } from './Tab';
import { DefaultMiniDarkTheme } from '../../constants';

export default function SelectTabPanel() {
  const { tabs, setTabs } = useTabs();

  return (
    <StyledSelectTabsPanel>
      <h2 className="title-text">Select a Tab</h2>
      <p className="description-text">
        Please select one of your YouTube Music tabs to control.
      </p>
      <div className="tab-list">
        {tabs.map((tab) => (
          <Tab
            key={tab.tab.id}
            title={tab.songInfo?.title}
            artist={tab.songInfo?.artist}
            albumArtUrl={tab.songInfo?.albumArtUrl}
            isActive={tab.songInfo?.id !== undefined}
            onClick={() => {
              setTabs([tab]);
            }}
          />
        ))}
      </div>
    </StyledSelectTabsPanel>
  );
}

const StyledSelectTabsPanel = styled.div`
  padding: 0 10px;
  width: 100%;
  height: 100%;
  background-color: ${DefaultMiniDarkTheme.backgroundColor};
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0 !important;
  }

  & > .title-text {
    text-align: center;
    color: ${DefaultMiniDarkTheme.primaryText};
    margin: 15px 0 5px;
    font-weight: 600;
  }

  & > .description-text {
    text-align: center;
    color: ${DefaultMiniDarkTheme.secondaryText};
    margin: 5px 0;
    font-size: 14px;
  }

  & > .tab-list {
    padding: 10px 0;
  }
`;
