import Peer, { DataConnection, LogLevel } from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button } from "./components/Styled";

export default function Modal() {
  const [mode, setMode] = useState("HOST");
  const [connection, setConnection] = useState<DataConnection | undefined>();
  const [peer, setPeer] = useState<Peer | undefined>();
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (!searchParams.has("roomId")) {
      return;
    }

    setMode("GUEST");

    const roomId = searchParams.get("roomId")!;

    const peer = new Peer({
      debug: 3,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:0.peerjs.com:3478",
            username: "peerjs",
            credential: "peerjsp",
          },
        ],
        sdpSemantics: "unified-plan",
      },
    });

    const conn = peer.connect(roomId);

    conn.on("open", () => {
      conn.on("data", (data) => {
        console.log("data received!", data);
      });
      console.log("connection open!");
      conn.send("hello world!");
    });

    setPeer(peer);
  }, []);

  const handleCreateRoom = () => {
    const peer = new Peer({
      debug: 3,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:0.peerjs.com:3478",
            username: "peerjs",
            credential: "peerjsp",
          },
        ],
        sdpSemantics: "unified-plan",
      },
    });

    peer.on("open", setRoomId);
    peer.on("connection", (connection) => {
      console.log("connected!");
      connection.on("data", (data) => {
        console.log("Received message!", data);
      });

      setConnection(connection);
      connection.send("hello back!");
    });

    setPeer(peer);
  };

  return (
    <ModalStyled>
      {mode === "HOST" ? (
        <div className="buttons">
          <Button onClick={handleCreateRoom} centered>
            Create Room
          </Button>
          <div>Your Room ID: {roomId}</div>
        </div>
      ) : (
        <div></div>
      )}
    </ModalStyled>
  );
}

const ModalStyled = styled.div`
  backdrop-filter: blur(5px);
  background-color: #292929;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 5000;

  h2 {
    text-align: center;
    color: white;
    font-size: 20px;
    margin-top: 15px;
    cursor: default;
  }

  .buttons {
    margin-top: 50px;

    p {
      color: #acacac;
      text-align: center;
      font-size: 16px;
    }
  }
`;

const BackButton = styled.button`
  background: red;
  border-radius: 3px;
  border: none;
  color: white;
  font-size: 20px;
  left: 8px;
  padding: 2px 8px;
  position: absolute;
  top: 14px;
`;
