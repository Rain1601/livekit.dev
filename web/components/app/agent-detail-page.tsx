'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import { AgentDetailConfigPanel } from '@/components/app/agent-detail-config-panel';
import { AgentDetailDebugPanel } from '@/components/app/agent-detail-debug-panel';
import { AgentDetailParamsPanel } from '@/components/app/agent-detail-params-panel';
import { useAgentAutoSave } from '@/hooks/useAgentAutoSave';
import { useAgentConfig } from '@/hooks/useAgentConfig';
import { useAgentDetail } from '@/hooks/useAgentDetail';
import { agentDataToConfig } from '@/lib/agent-api';

export function AgentDetailPage({ id }: { id: string }) {
  const { agent, isLoading } = useAgentDetail(id);
  const { config, dispatch } = useAgentConfig();

  // Load agent data into global AgentConfig context
  useEffect(() => {
    if (agent) {
      dispatch({ type: 'LOAD', config: agentDataToConfig(agent) });
    }
  }, [agent, dispatch]);

  // Auto-save config changes back to backend
  useAgentAutoSave(id, config);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2Icon className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground text-sm">Agent not found</p>
        <Link href="/agent" className="text-primary text-sm hover:underline">
          Back to Agents
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Breadcrumb header */}
      <div className="border-border flex items-center gap-2 border-b px-4 py-2.5">
        <Link
          href="/agent"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeftIcon className="size-3.5" />
          Agents
        </Link>
        <span className="text-muted-foreground text-sm">/</span>
        <span className="text-foreground text-sm font-medium">{agent.name}</span>
      </div>

      {/* Three-panel layout */}
      <div className="flex min-h-0 flex-1">
        {/* Left: Config panel */}
        <div className="border-border w-80 shrink-0 overflow-y-auto border-r">
          <AgentDetailConfigPanel />
        </div>

        {/* Center: Debug panel (session) */}
        <div className="flex-1 overflow-hidden">
          <AgentDetailDebugPanel />
        </div>

        {/* Right: Params panel */}
        <div className="border-border w-72 shrink-0 overflow-y-auto border-l">
          <AgentDetailParamsPanel />
        </div>
      </div>
    </div>
  );
}
