import React from "react";
import ReactDOM from "react-dom";
import YTMThemeEditor from "../components/YTMThemeEditor";

const App = () => {
  return (
    <div>
      <h1>YTM Theme Editor</h1>
      <YTMThemeEditor popup />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#ytm-theme-editor"));
