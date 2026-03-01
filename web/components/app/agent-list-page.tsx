'use client';

import { BotIcon, InboxIcon } from 'lucide-react';
import { AgentCard } from '@/components/app/agent-card';
import { CreateAgentDialog } from '@/components/app/create-agent-dialog';
import { useAgents } from '@/hooks/useAgents';

export function AgentListPage() {
  const { agents, isLoading, refresh } = useAgents();

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-8 py-8">
        {/* Page header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-xl">
              <BotIcon className="text-muted-foreground size-5" />
            </div>
            <div>
              <h1 className="text-foreground text-xl font-semibold">Agents</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                Create and manage your voice AI agents.
              </p>
            </div>
          </div>
          <CreateAgentDialog onCreated={refresh} />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-muted-foreground flex items-center justify-center py-20 text-sm">
            Loading...
          </div>
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="bg-muted flex size-12 items-center justify-center rounded-xl">
              <InboxIcon className="text-muted-foreground size-6" />
            </div>
            <p className="text-muted-foreground text-sm">No agents yet. Create your first one!</p>
            <CreateAgentDialog onCreated={refresh} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
