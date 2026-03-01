'use client';

import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { TokenSource } from 'livekit-client';
import { useSession } from '@livekit/components-react';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr';
import type { AppConfig } from '@/app-config';
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider';
import { StartAudioButton } from '@/components/agents-ui/start-audio-button';
import { NavSidebar } from '@/components/app/nav-sidebar';
import { Toaster } from '@/components/ui/sonner';
import { AgentConfigProvider, useAgentConfig } from '@/hooks/useAgentConfig';
import { useAgentErrors } from '@/hooks/useAgentErrors';
import { AppConfigProvider } from '@/hooks/useAppConfig';
import { useDebugMode } from '@/hooks/useDebug';
import { ProviderKeysProvider, useProviderKeys } from '@/hooks/useProviderKeys';
import { getSandboxTokenSource } from '@/lib/utils';

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const COLLAPSED_KEY = 'nav-sidebar-collapsed';

function AppSetup() {
  useDebugMode({ enabled: IN_DEVELOPMENT });
  useAgentErrors();
  return null;
}

interface AppShellInnerProps {
  appConfig: AppConfig;
  children: ReactNode;
}

function AppShellInner({ appConfig, children }: AppShellInnerProps) {
  const { config: agentConfig } = useAgentConfig();
  const { keys: providerKeys } = useProviderKeys();
  const [collapsed, setCollapsed] = useState(true);

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

  const tokenSource = useMemo(() => {
    if (typeof process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT === 'string') {
      return getSandboxTokenSource(appConfig);
    }

    return TokenSource.custom(async () => {
      const agentName = appConfig.agentName;
      const res = await fetch('/api/connection-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_config: agentName ? { agents: [{ agent_name: agentName }] } : undefined,
          agent_config: { ...agentConfig, provider_keys: providerKeys },
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch connection details: ${res.statusText}`);
      }
      return res.json();
    });
  }, [appConfig, agentConfig, providerKeys]);

  const session = useSession(
    tokenSource,
    appConfig.agentName ? { agentName: appConfig.agentName } : undefined
  );

  return (
    <AgentSessionProvider session={session}>
      <AppSetup />
      <div className="flex h-svh">
        <NavSidebar collapsed={collapsed} onCollapsedChange={handleCollapsedChange} />
        <main className="relative h-full flex-1 overflow-hidden">{children}</main>
      </div>
      <StartAudioButton label="Start Audio" />
      <Toaster
        icons={{
          warning: <WarningIcon weight="bold" />,
        }}
        position="top-center"
        className="toaster group"
        style={
          {
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)',
          } as React.CSSProperties
        }
      />
    </AgentSessionProvider>
  );
}

interface AppShellProps {
  appConfig: AppConfig;
  children: ReactNode;
}

export function AppShell({ appConfig, children }: AppShellProps) {
  return (
    <AgentConfigProvider>
      <ProviderKeysProvider>
        <AppConfigProvider appConfig={appConfig}>
          <AppShellInner appConfig={appConfig}>{children}</AppShellInner>
        </AppConfigProvider>
      </ProviderKeysProvider>
    </AgentConfigProvider>
  );
}
