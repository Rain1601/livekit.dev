'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { createElement } from 'react';

const STORAGE_KEY = 'provider-keys';

type ProviderKeys = Record<string, string>;

interface ProviderKeysContextValue {
  keys: ProviderKeys;
  setKey: (envKey: string, value: string) => void;
  removeKey: (envKey: string) => void;
}

const ProviderKeysContext = createContext<ProviderKeysContextValue | null>(null);

export function ProviderKeysProvider({ children }: { children: ReactNode }) {
  const [keys, setKeys] = useState<ProviderKeys>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setKeys(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    } catch {
      // ignore
    }
  }, [keys]);

  const setKey = useCallback((envKey: string, value: string) => {
    setKeys((prev) => ({ ...prev, [envKey]: value }));
  }, []);

  const removeKey = useCallback((envKey: string) => {
    setKeys((prev) => {
      const next = { ...prev };
      delete next[envKey];
      return next;
    });
  }, []);

  return createElement(
    ProviderKeysContext.Provider,
    { value: { keys, setKey, removeKey } },
    children
  );
}

export function useProviderKeys() {
  const ctx = useContext(ProviderKeysContext);
  if (!ctx) {
    throw new Error('useProviderKeys must be used within ProviderKeysProvider');
  }
  return ctx;
}
