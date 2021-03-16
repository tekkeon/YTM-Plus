import React from 'react';
import styled from 'styled-components';
import useStorage from '../../hooks/useStorage';
import { YTMTheme, Options } from '../../types';
import ColorSelector from './ColorSelector';
import { DefaultYTMTheme, MessageType } from '../../constants';
import { messaging } from '../../util/chrome';
import Option from './Option';

export default function YTMThemeEditor() {
  const { result: options, set } = useStorage<Options>('options');

  const handleChange = (id: keyof YTMTheme, newValue: string | boolean) => {
    if (options.ytmTheme) {
      set({
        ...options,
        ytmTheme: {
          ...options.ytmTheme,
          [id]: newValue
        }
      });
    } else {
      set({
        ...options,
        ytmTheme: {
          ...DefaultYTMTheme,
          [id]: newValue
        }
      });
    };
  
    messaging.sendToYTMTab({
      type: MessageType.YTM_THEME_UPDATED
    });
  }

  const handleReset = () => {
    set({ ...options, ytmTheme: null });
    messaging.sendToYTMTab({
      type: MessageType.YTM_THEME_UPDATED
    })
  }

  const ytmTheme = options?.ytmTheme;

  return (
    <Container>
      <ThemeOptions>
        <DefaultButton onClick={handleReset}>Default</DefaultButton>
        <h2>Header/Footer</h2>
        <i></i>
        <ColorSelector
          label="Background"
          color={ytmTheme?.headerFooterBackground ?? 'white'}
          onChange={newColor => handleChange('headerFooterBackground', newColor)}
          id="headerFooterBackground"
        />
        <ColorSelector
          label="Primary Text"
          color={ytmTheme?.headerFooterPrimaryText ?? 'white'}
          onChange={newColor => handleChange('headerFooterPrimaryText', newColor)}
          id="headerFooterPrimaryText"
        />
        <ColorSelector
          label="Secondary Text"
          color={ytmTheme?.headerFooterSecondaryText ?? 'white'}
          onChange={newColor => handleChange('headerFooterSecondaryText', newColor)}
          id="headerFooterSecondaryText"
        />
        <ColorSelector
          label="Buttons"
          color={ytmTheme?.headerFooterButtons ?? 'white'}
          onChange={newColor => handleChange('headerFooterButtons', newColor)}
          id="headerFooterButtons"
        />
        <ColorSelector
          label="Logo Color"
          color={ytmTheme?.logo ?? 'white'}
          onChange={newColor => handleChange('logo', newColor)}
          id="logoColor"
        />
        <ColorSelector
          label="logoText"
          color={ytmTheme?.logoText ?? 'white'}
          onChange={newColor => handleChange('logoText', newColor)}
          id="logoText"
        />
        <h2>Main Section</h2>
        <ColorSelector
          label="Background"
          color={ytmTheme?.mainBackground ?? 'white'}
          onChange={newColor => handleChange('mainBackground', newColor)}
          id="mainBackground"
        />
        <ColorSelector
          label="Heading Text"
          color={ytmTheme?.mainHeading ?? 'white'}
          onChange={newColor => handleChange('mainHeading', newColor)}
          id="mainHeading"
        />
        <ColorSelector
          label="Primary Text"
          color={ytmTheme?.mainPrimary ?? 'white'}
          onChange={newColor => handleChange('mainPrimary', newColor)}
          id="mainPrimary"
        />
        <ColorSelector
          label="Secondary Text"
          color={ytmTheme?.mainSecondary ?? 'white'}
          onChange={newColor => handleChange('mainSecondary', newColor)}
          id="mainSecondary"
        />
        <h2>Queue/Player</h2>
        <ColorSelector
          label="Background"
          color={ytmTheme?.queueBackground ?? 'white'}
          onChange={newColor => handleChange('queueBackground', newColor)}
          id="queueBackground"
        />
        <ColorSelector
          label="Heading Text"
          color={ytmTheme?.queueHeading ?? 'white'}
          onChange={newColor => handleChange('queueHeading', newColor)}
          id="queueHeading"
        />
        <ColorSelector
          label="Primary Text"
          color={ytmTheme?.queuePrimary ?? 'white'}
          onChange={newColor => handleChange('queuePrimary', newColor)}
          id="queuePrimary"
        />
        <ColorSelector
          label="Secondary Text"
          color={ytmTheme?.queueSecondary ?? 'white'}
          onChange={newColor => handleChange('queueSecondary', newColor)}
          id="queueSecondary"
        />
      </ThemeOptions>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;

  .popup-container {
    width: 260px;
    height: 395px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 10px 5px #0000001f;
  }
  
  h2 {
    color: #222222;
    font-size: 16px;
    margin-top: 40px;
  }
`

const ThemeOptions = styled.div`
  label {
    color: #c7c7c7;
    font-size: 16px;
  }
`

const DefaultButton = styled.button`
  background: none;
  border-radius: 3px;
  border: 1px solid red;
  color: red;
  cursor: pointer;
  font-size: 18px;
  margin-right: 10px;
  margin-top: 10px;
  outline: none;
  padding: 8px 16px;
`