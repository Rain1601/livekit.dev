'use client';

import { useMemo } from 'react';
import { TokenSource } from 'livekit-client';
import { useSession } from '@livekit/components-react';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr';
import type { AppConfig } from '@/app-config';
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider';
import { StartAudioButton } from '@/components/agents-ui/start-audio-button';
import { AppLayout } from '@/components/app/app-layout';
import { Toaster } from '@/components/ui/sonner';
import { AgentConfigProvider, useAgentConfig } from '@/hooks/useAgentConfig';
import { useAgentErrors } from '@/hooks/useAgentErrors';
import { useDebugMode } from '@/hooks/useDebug';
import { ProviderKeysProvider, useProviderKeys } from '@/hooks/useProviderKeys';
import { getSandboxTokenSource } from '@/lib/utils';

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';

function AppSetup() {
  useDebugMode({ enabled: IN_DEVELOPMENT });
  useAgentErrors();

  return null;
}

interface AppProps {
  appConfig: AppConfig;
}

function AppInner({ appConfig }: AppProps) {
  const { config: agentConfig } = useAgentConfig();
  const { keys: providerKeys } = useProviderKeys();

  const tokenSource = useMemo(() => {
    if (typeof process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT === 'string') {
      return getSandboxTokenSource(appConfig);
    }

    // Custom token source that sends agent_config in the request body
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
      <AppLayout appConfig={appConfig} />
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

export function App({ appConfig }: AppProps) {
  return (
    <AgentConfigProvider>
      <ProviderKeysProvider>
        <AppInner appConfig={appConfig} />
      </ProviderKeysProvider>
    </AgentConfigProvider>
  );
}
