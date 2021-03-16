import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './Popup';
import useStorage from '../hooks/useStorage';
import { ThemeProvider } from 'styled-components';
import { DefaultMiniDarkTheme } from '../constants';
import { Options } from '../types';

const App = () => {
  const { result: options } = useStorage<Options>('options');

  return (
    <ThemeProvider theme={options?.miniTheme ?? DefaultMiniDarkTheme}>
      <Popup />
    </ThemeProvider>
  )
}

ReactDOM.render(
  <App />,
  document.querySelector('#popup')
);