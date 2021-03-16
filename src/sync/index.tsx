import React from 'react';
import ReactDOM from 'react-dom';
import Sync from './Sync';
import { setTabId } from './tabController';
import { Message } from 'src/types';
import { MessageType } from 'src/constants';

chrome.runtime.onMessage.addListener((message: Message, sender) => {
  if (message.type === MessageType.SET_YTM_TAB_ID) {
    console.log('Setting tab id:', message.payload)
    setTabId(message.payload);
  }
})

ReactDOM.render(
  <Sync />,
  document.getElementById('sync')
);