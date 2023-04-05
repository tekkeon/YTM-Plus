import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";

import { PlayerStateProvider } from "../contexts/PlayerStateContext";
import { SongInfoProvider } from "../contexts/SongInfoContext";
import Popup from "./Popup";
import useStorage from "../hooks/useStorage";
import { DefaultMiniDarkTheme } from "../constants";
import { Options } from "../types";
import "../util/analytics";

const App = () => {
  const { result: options } = useStorage<Options>("options");

  return (
    <PlayerStateProvider>
      <SongInfoProvider>
        <ThemeProvider theme={options?.miniTheme ?? DefaultMiniDarkTheme}>
          <Popup />
        </ThemeProvider>
      </SongInfoProvider>
    </PlayerStateProvider>
  );
};

ReactDOM.render(<App />, document.querySelector("#popup"));
