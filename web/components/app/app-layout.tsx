'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AppConfig } from '@/app-config';
import { AgentPage } from '@/components/app/agent-page';
import { NavSidebar } from '@/components/app/nav-sidebar';
import { SettingsPage } from '@/components/app/settings-page';
import { ViewController } from '@/components/app/view-controller';

const COLLAPSED_KEY = 'nav-sidebar-collapsed';

type Page = 'main' | 'agent' | 'settings';

interface AppLayoutProps {
  appConfig: AppConfig;
}

export function AppLayout({ appConfig }: AppLayoutProps) {
  const [activePage, setActivePage] = useState<Page>('main');
  const [collapsed, setCollapsed] = useState(true);

  // Load collapsed state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COLLAPSED_KEY);
      if (saved !== null) {
        setCollapsed(saved === 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCollapsedChange = useCallback((value: boolean) => {
    setCollapsed(value);
    try {
      localStorage.setItem(COLLAPSED_KEY, String(value));
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="flex h-svh">
      <NavSidebar
        activePage={activePage}
        onPageChange={setActivePage}
        collapsed={collapsed}
        onCollapsedChange={handleCollapsedChange}
      />
      <main className="relative h-full flex-1 overflow-hidden">
        {activePage === 'main' && <ViewController appConfig={appConfig} />}
        {activePage === 'agent' && <AgentPage />}
        {activePage === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}
