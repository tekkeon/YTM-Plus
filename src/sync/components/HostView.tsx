import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Loader } from './Styled';
import { createSession, subscribeToSession } from '../../util/firebase';
import { Session } from '../../types';
import { initializeHostMessageHandler } from '../tabController';

export default function HostView() {
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session>();

  useEffect(() => {
    setLoading(true);
    createSession()
      .then(id => {
        setLoading(false);
        setSessionId(id);
        subscribeToSession(id, 'HOST', (session) => {
          setSession(session);
        })

        initializeHostMessageHandler(id);
      });
  }, []);

  return (
    <div>
      {
        loading ?
          <Loader /> :
          <>
            <Label>Session ID</Label>
            <Value>{sessionId}</Value>
            <Label>Listeners</Label>
            {
              session?.listeners &&
                Object.keys(session.listeners).length ?
                  Object.keys(session.listeners).map(id => <Value>{session.listeners[id]}</Value>) :
                <Value>N/A</Value>
            }
          </>
      }
    </div>
  )
}

const Label = styled.p`
  text-transform: capitalize;
  color: red;
  font-weight: 600;
  font-size: 14px;
  margin-top: 20px;
  text-align: center;
`

const Value = styled.p`
  color: white;
  font-size: 18px;
  text-align: center;
  margin-top: 10px;
`