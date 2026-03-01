'use client';

import { useEffect, useRef } from 'react';
import { configToAgentData, updateAgent } from '@/lib/agent-api';
import type { AgentConfig } from '@/lib/agent-config';

export function useAgentAutoSave(id: string | undefined, config: AgentConfig) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialRef = useRef(true);

  useEffect(() => {
    // Skip auto-save on first render (initial load)
    if (initialRef.current) {
      initialRef.current = false;
      return;
    }
    if (!id) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        await updateAgent(id, configToAgentData(config));
      } catch (e) {
        console.error('Auto-save failed', e);
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, config]);
}
