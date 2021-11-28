import React, { useEffect, useState } from "react";
import styled from "styled-components";

const YTM_LISTEN_URL = "https://music.youtube.com/watch?v=";

interface RedirectOptionProps {
  id: string;
}

export default function RedirectOption({ id }: RedirectOptionProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, [id]);

  return (
    <RedirectOptionStyled show={show}>
      <p>Listen on YouTube Music? (Beta)</p>
      <a href={`${YTM_LISTEN_URL}${id}`}>
        <RedirectOptionButton>Yes</RedirectOptionButton>
      </a>
      <RedirectOptionButton onClick={() => setShow(false)}>
        No
      </RedirectOptionButton>
    </RedirectOptionStyled>
  );
}

interface RedirectOptionStyledProps {
  show: boolean;
}

const RedirectOptionStyled = styled.div<RedirectOptionStyledProps>`
  position: fixed;
  padding: 15px;
  top: 20px;
  right: ${(props) => (props.show ? 20 : -300)}px;
  background: #444444;
  border-radius: 8px;
  transition: right 0.5s ease-out;
`;

const RedirectOptionButton = styled.button`
  background-color: rgb(255 0 0);
  border-radius: 5px;
  border: none;
  box-shadow: rgb(0 0 0 / 23%) 0px 0px 10px 1px;
  color: white;
  cursor: pointer;
  margin: 10px 5px;
  padding: 10px 42px;
  font-size: 16px;
`;
