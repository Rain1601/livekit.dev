'use client';

import Link from 'next/link';
import { BotIcon } from 'lucide-react';
import type { AgentData } from '@/lib/agent-api';
import { PROVIDER_ICON_MAP } from '@/lib/provider-icons';

export function AgentCard({ agent }: { agent: AgentData }) {
  const providerKey =
    agent.mode === 'realtime' ? agent.realtime_config?.provider : agent.llm_config?.provider;
  const modelName =
    agent.mode === 'realtime' ? agent.realtime_config?.model : agent.llm_config?.model;
  const ProviderIcon = PROVIDER_ICON_MAP[providerKey ?? ''] ?? BotIcon;

  return (
    <Link
      href={`/agent/${agent.id}`}
      className="bg-card hover:bg-muted/50 group flex flex-col gap-3 rounded-xl border p-5 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
          <ProviderIcon className="text-muted-foreground size-4" size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate text-sm font-medium">{agent.name}</h3>
          {modelName && <p className="text-muted-foreground truncate text-xs">{modelName}</p>}
        </div>
        <span className="bg-muted text-muted-foreground shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase">
          {agent.mode}
        </span>
      </div>
      {agent.description && (
        <p className="text-muted-foreground line-clamp-2 text-xs">{agent.description}</p>
      )}
    </Link>
  );
}
