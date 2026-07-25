import { useEffect, useState } from 'react';

export function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return fallback;
    }

    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
