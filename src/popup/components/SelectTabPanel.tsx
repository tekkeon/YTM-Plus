import React from 'react';
import styled from 'styled-components';
import { useTabs } from '../../contexts/TabContext';
import { Tab } from './Tab';

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
  padding: 10px;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.backgroundColor};
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0 !important;
  }

  & > .title-text {
    text-align: center;
    color: ${(props) => props.theme.primaryText};
    margin: 5px 0;
    font-weight: 600;
  }

  & > .description-text {
    text-align: center;
    color: ${(props) => props.theme.secondaryText};
    margin: 5px 0;
    font-size: 14px;
  }

  & > .tab-list {
    padding: 10px 0;
  }
`;
