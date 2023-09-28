import { v4 as uuid } from 'uuid';
import config from '../config';
import { storage } from './chrome';
import { useEffect, useState } from 'react';

const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

const SESSION_EXPIRATION_IN_MIN = 30;
const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;

async function getOrCreateSessionId() {
  // Store session in memory storage
  let sessionTimestamp = await storage.get('sessionTimestamp');
  // Check if session exists and is still valid
  const currentTimeInMs = Date.now();
  if (sessionTimestamp) {
    // Calculate how long ago the session was last updated
    const durationInMin = (currentTimeInMs - sessionTimestamp) / 60000;
    // Check if last update lays past the session expiration threshold
    if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
      // Delete old session id to start a new session
      sessionTimestamp = null;
    } else {
      // Update timestamp to keep session alive
      sessionTimestamp = currentTimeInMs;
      await storage.set({ sessionData: sessionTimestamp });
    }
  }

  if (!sessionTimestamp) {
    // Create and store a new session
    sessionTimestamp = {
      session_id: currentTimeInMs.toString(),
      timestamp: currentTimeInMs.toString(),
    };
    await storage.set({ sessionData: sessionTimestamp });
  }
  return sessionTimestamp.session_id;
}

const getOrCreateClientId = async () => {
  let clientId = await storage.get('clientId');
  if (!clientId) {
    // Generate a unique client ID, the actual value is not relevant
    clientId = uuid();
    await storage.set({ clientId });
  }
  return clientId;
};

export interface Event {
  name: string;
  params?: any;
}

export const sendEvent = async (event: Event) => {
  await sendEvents([event]);
};

export const sendEvents = async (events: Event[]) => {
  const clientId = await getOrCreateClientId();
  const sessionId = await getOrCreateSessionId();

  events.forEach((event) => {
    if (!event.params) {
      event.params = {};
    }

    event.params.session_id = sessionId;
    event.params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_IN_MSEC;
  });

  fetch(
    `${GA_ENDPOINT}?measurement_id=${config.ga.measurementId}&api_secret=${config.ga.secret}`,
    {
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        events,
      }),
    }
  );
};

interface UseSendEventProps {
  name: string;
  params?: any;
  immediate?: boolean;
}

/**
 * React hook to send events to Google Analytics
 */
export const useSendEvent = ({
  name,
  params,
  immediate,
}: UseSendEventProps) => {
  useEffect(() => {
    if (immediate) {
      sendEvent({ name, params });
    }
  }, [name, params, immediate]);

  return async (params?: any) => {
    await sendEvent({ name, params });
  };
};
