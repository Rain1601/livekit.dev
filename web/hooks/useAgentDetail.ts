'use client';

import { useCallback, useEffect, useState } from 'react';
import { type AgentData, fetchAgent } from '@/lib/agent-api';

export function useAgentDetail(id: string | undefined) {
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await fetchAgent(id);
      setAgent(data);
    } catch (e) {
      console.error('Failed to fetch agent', e);
      setAgent(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { agent, isLoading, mutate: setAgent, refresh: load };
}
