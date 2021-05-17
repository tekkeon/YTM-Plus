import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Loader, Button } from './Styled';
import { subscribeToSession, unsubscribeFromSession } from '../../util/firebase';
import { handleRemoteSessionUpdate, setTabAsViewer } from '../tabController'
import { Session } from 'src/types';

export default function ViewerView() {
  const [sessionId, setSessionId] = useState('');
  const [listenerId, setListenerId] = useState<undefined | string>();
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [session, setSession] = useState<Session>();
  const [viewerName, setViewerName] = useState<string>('');
  
  const onJoinSession = () => {
    setLoading(true);

    const listener = subscribeToSession(sessionId, viewerName, (session) => {
      setLoading(false);
      setSession(session);
      setConnected(true);
      handleRemoteSessionUpdate(session);
      setTabAsViewer();
    });
    
    setListenerId(listener);
  }

  useEffect(() => {
    if (!listenerId) {
      return;
    }

    window.onbeforeunload = () => {
      unsubscribeFromSession(sessionId, listenerId)
    };
  
    return () => unsubscribeFromSession(sessionId, listenerId)
  }, [listenerId, sessionId]);
  
  return (
    <div>
      {
        connected ?
          <>
            <Label>Session ID</Label>
            <Value>{sessionId}</Value>
            <Label>Now Playing</Label>
            {
              session?.songInfo ?
                <UpNext>
                  <img src={session?.songInfo?.albumArtUrl ?? ''} />
                  <h3>{session?.songInfo?.title ?? ''}</h3>
                  <h4>{session?.songInfo?.artist ?? ''}</h4>
                </UpNext> :
                null
            }
          </> :
          loading ?
            <Loader /> :
            <Join>
              <input type="text" value={sessionId} onChange={e => setSessionId(e.target.value)} placeholder="Session ID" />
              <br />
              <input type="text" value={viewerName} onChange={e => setViewerName(e.target.value)} placeholder="Name" />
              <br />
              <Button onClick={onJoinSession} centered>Join</Button>
            </Join>
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

const UpNext = styled.div`
  & > h3 {
    width: 70%;
    margin: 10px auto;
    text-align: center;
    color: white;
  }

  & > h4 {
    text-align: center;
    color: grey;
    margin-top: 5px;
  }

  & > img {
    width: 180px;
    display: block;
    margin: auto;
  }
`

const Join = styled.div`
  margin-top: 60px;

  input {
    background: transparent;
    border-radius: 4px;
    border: 1px solid gray;
    color: white;
    display: block;
    font-size: 16px;
    margin: auto;
    padding: 5px;
  }
`