'use client';

import { useCallback, useEffect, useState } from 'react';
import { type AgentData, fetchAgents } from '@/lib/agent-api';

export function useAgents() {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAgents();
      setAgents(data);
    } catch (e) {
      console.error('Failed to fetch agents', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { agents, isLoading, refresh };
}
