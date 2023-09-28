import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import Popup from './Popup';
import useStorage from '../hooks/useStorage';
import { DefaultMiniDarkTheme } from '../constants';
import { Options } from '../types';
import '../util/analytics';
import { TabProvider } from '../contexts/TabContext';
import { useSendEvent } from '../util/analytics';

const App = () => {
  const { result: options } = useStorage<Options>('options');
  useSendEvent({
    name: 'popup_opened',
    immediate: true,
  });

  return (
    <TabProvider>
      <ThemeProvider theme={options?.miniTheme ?? DefaultMiniDarkTheme}>
        <Popup />
      </ThemeProvider>
    </TabProvider>
  );
};

ReactDOM.render(<App />, document.querySelector('#popup'));
