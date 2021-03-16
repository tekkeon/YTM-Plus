import { useState, useEffect } from 'react';
import { storage } from '../util/chrome';

export default function useStorage<T>(key: string) {
  const [storageResult, setStorageResult] = useState<T | null>(null);

  useEffect(() => {
    storage.get(key)
      .then(setStorageResult);
  }, []);

  const setStorage = (input: T) => {
    storage.set({
      [key]: input
    })
      .then(() => setStorageResult(input))
  };

  return {
    result: storageResult as T,
    set: setStorage
  };
}