import firebase from 'firebase';
import { nanoid } from 'nanoid'
import { Session } from '../types';

var firebaseConfig = {
  apiKey: "AIzaSyDkCekqdfW3aR43cJmwgjlpN0B_d8BzULU",
  authDomain: "music-mini.firebaseapp.com",
  databaseURL: "https://music-mini-default-rtdb.firebaseio.com",
  projectId: "music-mini",
  storageBucket: "music-mini.appspot.com",
  messagingSenderId: "65304442346",
  appId: "1:65304442346:web:f70bac77d3b0f801802e93",
  measurementId: "G-DK1NMQX490"
};

const app = firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const createSession = () => {
  const id = nanoid();
  const sessionRef = app.database().ref('sessions/' + id);

  const newSession: Session = { id };

  return sessionRef.set(newSession)
    .then(() => id);
}

export const updateSession = (session: Partial<Session>) => {
  const sessionRef = app.database().ref('sessions/' + session.id);

  return sessionRef.once('value', (snapshot) => {
    const prevSession: Session = snapshot.val();
    sessionRef.set({
      ...prevSession,
      ...session
    });
  });
}

export const subscribeToSession = (id: string, name: string, messageHandler: (data: Session) => void) => {
  const sessionRef = app.database().ref('sessions/' + id);

  sessionRef.on('value', (snapshot) => {
    const data: Session = snapshot.val();
    messageHandler(data);
  });

  if (name !== 'HOST') {
    const listenerId = nanoid();
    const sessionListenersRef = sessionRef.child(`listeners/${listenerId}`);
    sessionListenersRef.set(name);

    return listenerId;
  }
}

export const unsubscribeFromSession = (sessionId: string, listenerId: string) => {
  const sessionViewerRef = app.database().ref(`sessions/${sessionId}/listeners/${listenerId}`);
  sessionViewerRef.remove();
}

export default app;