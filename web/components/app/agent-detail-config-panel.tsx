'use client';

import { useState } from 'react';
import { AgentDetailConfigContextTab } from '@/components/app/agent-detail-config-context-tab';
import { AgentDetailConfigModelTab } from '@/components/app/agent-detail-config-model-tab';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/shadcn/utils';

type Tab = 'model' | 'context';

export function AgentDetailConfigPanel() {
  const [tab, setTab] = useState<Tab>('model');

  return (
    <div className="flex h-full flex-col">
      {/* Tab switcher */}
      <div className="border-border flex gap-1 border-b p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn('flex-1 text-xs', tab === 'model' && 'bg-muted')}
          onClick={() => setTab('model')}
        >
          Model
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn('flex-1 text-xs', tab === 'context' && 'bg-muted')}
          onClick={() => setTab('context')}
        >
          Context
        </Button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'model' ? <AgentDetailConfigModelTab /> : <AgentDetailConfigContextTab />}
      </div>
    </div>
  );
}
