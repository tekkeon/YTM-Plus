import React from 'react';
import styled, { ThemeProvider, css } from 'styled-components';
import Popup from '../../popup/Popup';
import useStorage from '../../hooks/useStorage';
import { MiniTheme, Options } from '../../types';
import ColorSelector from './ColorSelector';
import { DefaultMiniDarkTheme, DefaultMiniLightTheme } from '../../constants';
import { TabProvider } from '../../contexts/TabContext';

export default function PopupThemeEditor() {
  const { result: options, set } = useStorage<Options>('options');

  const handleChange = (id: keyof MiniTheme, newValue: string) => {
    set({
      ...options,
      miniTheme: {
        ...options.miniTheme,
        [id]: newValue,
      },
    });
  };

  const miniTheme = options?.miniTheme;

  return (
    <Container>
      <ThemeOptions>
        <DefaultButton
          onClick={() => set({ ...options, miniTheme: DefaultMiniDarkTheme })}
          color="dark"
        >
          Default Dark
        </DefaultButton>
        <DefaultButton
          onClick={() => set({ ...options, miniTheme: DefaultMiniLightTheme })}
          color="light"
        >
          Default Light
        </DefaultButton>
        <ColorSelector
          label="Primary Text"
          color={miniTheme?.primaryText}
          onChange={(newColor) => handleChange('primaryText', newColor)}
          id="primary-text"
        />
        <ColorSelector
          label="Secondary Text/Accent"
          color={miniTheme?.secondaryText}
          onChange={(newColor) => handleChange('secondaryText', newColor)}
          id="secondary-text"
        />
        <ColorSelector
          label="Primary Button"
          color={miniTheme?.primaryButton}
          onChange={(newColor) => handleChange('primaryButton', newColor)}
          id="primary-button"
        />
        <ColorSelector
          label="Secondary Button"
          color={miniTheme?.secondaryButton}
          onChange={(newColor) => handleChange('secondaryButton', newColor)}
          id="secondary-button"
        />
        <ColorSelector
          label="Main Background"
          color={miniTheme?.backgroundColor}
          onChange={(newColor) => handleChange('backgroundColor', newColor)}
          id="background"
        />
        <ColorSelector
          label="Footer Background"
          color={miniTheme?.footerBackgroundColor}
          onChange={(newColor) =>
            handleChange('footerBackgroundColor', newColor)
          }
          id="footer-background"
        />
        <ColorSelector
          label="Queue Background Color"
          color={miniTheme?.queueBackground}
          onChange={(newColor) => handleChange('queueBackground', newColor)}
          id="queue-background"
        />
        <ColorSelector
          label="Progress Color"
          color={miniTheme?.progressColor}
          onChange={(newColor) => handleChange('progressColor', newColor)}
          id="progress"
        />
      </ThemeOptions>
      <div className="popup-container">
        <TabProvider>
          <ThemeProvider theme={miniTheme ?? DefaultMiniDarkTheme}>
            <Popup />
          </ThemeProvider>
        </TabProvider>
      </div>
    </Container>
  );
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
`;

const ThemeOptions = styled.div`
  label {
    color: #c7c7c7;
    font-size: 16px;
  }
`;

interface DefaultButtonProps {
  color: 'light' | 'dark';
}

const DefaultButton = styled.button<DefaultButtonProps>`
  background: none;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  margin-top: 10px;
  outline: none;
  padding: 4px 13px;

  ${({ color }) =>
    color === 'light'
      ? css`
          background-color: #ffffff;
          color: #232323;
        `
      : css`
          background-color: #4b4b4b;
          color: #ffffff;
        `}
`;
