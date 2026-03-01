'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAgentConfig } from '@/hooks/useAgentConfig';

export function AgentDetailConfigContextTab() {
  const { config, dispatch } = useAgentConfig();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="system-prompt" className="text-xs font-medium">
          System Prompt
        </Label>
        <Textarea
          id="system-prompt"
          className="font-mono text-xs"
          rows={12}
          placeholder="You are a helpful voice AI assistant..."
          value={config.system_prompt ?? ''}
          onChange={(e) => dispatch({ type: 'SET_SYSTEM_PROMPT', value: e.target.value })}
        />
        <p className="text-muted-foreground text-[11px]">
          Instructions that define the agent&apos;s behavior and personality.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="greeting" className="text-xs font-medium">
          Greeting
        </Label>
        <Input
          id="greeting"
          className="text-xs"
          placeholder="Hello! How can I help you today?"
          value={config.greeting ?? ''}
          onChange={(e) => dispatch({ type: 'SET_GREETING', value: e.target.value })}
        />
        <p className="text-muted-foreground text-[11px]">
          The first message the agent will say when a call starts.
        </p>
      </div>
    </div>
  );
}
