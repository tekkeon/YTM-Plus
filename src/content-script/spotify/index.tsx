import { MessageType } from "../../constants";
import { messaging, storage } from "../../util/chrome";
import React from "react";
import ReactDOM from "react-dom";
import RedirectOption from "./RedirectOption";
import { Options } from "../../types";

var oldHref = document.location.href;

function docReady(fn: any) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(async () => {
  const options = (await storage.get("options")) as Options;
  if (!options.spotifyToYTM) {
    return;
  }

  tryYTMRedirect();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      if (oldHref != document.location.href) {
        oldHref = document.location.href;
        tryYTMRedirect();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

const tryYTMRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);

  let spotifyTrackId: string | undefined;

  if (urlParams.get("highlight")) {
    spotifyTrackId = urlParams.get("highlight")?.split(":")[2];
  } else if (window.location.pathname.includes("track")) {
    const urlParts = window.location.pathname.split("/");
    spotifyTrackId = urlParts[urlParts.length - 1].split("?")[0];
  }

  if (spotifyTrackId) {
    messaging
      .sendToRuntime({
        type: MessageType.SPOTIFY_TO_YTM,
        payload: {
          trackId: spotifyTrackId,
        },
      })
      .then((id) => appendRedirectOption(id));
  }
};

const appendRedirectOption = (id: string) => {
  let redirectOptionDiv = document.getElementById("redirect-option-div");
  if (redirectOptionDiv) {
    document.body.removeChild(redirectOptionDiv);
  }

  redirectOptionDiv = document.createElement("div");
  redirectOptionDiv.style.display = "block";
  redirectOptionDiv.id = "redirect-option-div";
  document.body.appendChild(redirectOptionDiv);

  ReactDOM.render(<RedirectOption id={id} />, redirectOptionDiv);
};
