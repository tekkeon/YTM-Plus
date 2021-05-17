import React, { useState } from 'react';
import styled from 'styled-components';
import HostView from './components/HostView';
import ViewerView from './components/ViewerView';
import { Button } from './components/Styled';

enum UserType {
  HOST,
  VIEWER
}

export default function Modal() {
  const [userType, setUserType] = useState<UserType | null>(null);

  return (
    <ModalStyled>
      <h2 className="handle">Listen with Friends</h2>
      {
        userType !== null && <BackButton onClick={() => setUserType(null)}>←</BackButton>
      }
      {
        userType === UserType.HOST ?
          <HostView /> :
        userType === UserType.VIEWER ?
          <ViewerView /> :
          <div className="buttons">
            <Button onClick={() => setUserType(UserType.HOST)} centered>Create Session</Button>
            <p>or</p>
            <Button onClick={() => setUserType(UserType.VIEWER)} centered>Join Session</Button>
          </div>
      }
    </ModalStyled>
  )
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
`

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
`