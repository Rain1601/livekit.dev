'use client';

import { type ReactNode, createContext, createElement, useContext } from 'react';
import type { AppConfig } from '@/app-config';

const AppConfigContext = createContext<AppConfig | null>(null);

export function AppConfigProvider({
  appConfig,
  children,
}: {
  appConfig: AppConfig;
  children: ReactNode;
}) {
  return createElement(AppConfigContext.Provider, { value: appConfig }, children);
}

export function useAppConfig() {
  const ctx = useContext(AppConfigContext);
  if (!ctx) {
    throw new Error('useAppConfig must be used within AppConfigProvider');
  }
  return ctx;
}
