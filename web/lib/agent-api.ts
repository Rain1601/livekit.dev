import type { AgentConfig } from '@/lib/agent-config';
import { DEFAULT_CONFIG } from '@/lib/agent-config';

export interface AgentData {
  id: string;
  name: string;
  description: string;
  icon: string;
  mode: 'realtime' | 'pipeline';
  realtime_config: { provider: string; model: string; voice: string; temperature?: number } | null;
  llm_config: { provider: string; model: string; temperature?: number } | null;
  stt_config: { provider: string; model: string; language: string } | null;
  tts_config: { provider: string; voice: string } | null;
  vad_config: { provider: string; sensitivity: string } | null;
  turn_detection_config: {
    silence_duration_ms: number;
    allow_interruptions: boolean;
    min_interruption_duration_ms: number;
  } | null;
  system_prompt: string;
  greeting: string;
  created_at: string;
  updated_at: string;
}

const BASE = '/api/agents';

export async function fetchAgents(): Promise<AgentData[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
}

export async function fetchAgent(id: string): Promise<AgentData> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch agent');
  return res.json();
}

export async function createAgent(data: Partial<AgentData>): Promise<AgentData> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create agent');
  return res.json();
}

export async function updateAgent(id: string, data: Partial<AgentData>): Promise<AgentData> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update agent');
  return res.json();
}

export async function deleteAgent(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete agent');
}

export async function duplicateAgent(id: string): Promise<AgentData> {
  const res = await fetch(`${BASE}/${id}/duplicate`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to duplicate agent');
  return res.json();
}

/** Convert backend AgentData → frontend AgentConfig for use with useAgentConfig context */
export function agentDataToConfig(agent: AgentData): AgentConfig {
  return {
    mode: agent.mode,
    realtime: agent.realtime_config ?? DEFAULT_CONFIG.realtime,
    llm: agent.llm_config ?? DEFAULT_CONFIG.llm,
    stt: agent.stt_config ?? DEFAULT_CONFIG.stt,
    tts: agent.tts_config ?? DEFAULT_CONFIG.tts,
    vad: agent.vad_config ?? DEFAULT_CONFIG.vad,
    turn_detection: agent.turn_detection_config ?? DEFAULT_CONFIG.turn_detection,
    system_prompt: agent.system_prompt,
    greeting: agent.greeting,
  };
}

/** Convert frontend AgentConfig → partial AgentData fields for PUT */
export function configToAgentData(config: AgentConfig): Partial<AgentData> {
  return {
    mode: config.mode,
    realtime_config: config.realtime ?? null,
    llm_config: config.llm ?? null,
    stt_config: config.stt ?? null,
    tts_config: config.tts ?? null,
    vad_config: config.vad ?? null,
    turn_detection_config: config.turn_detection ?? null,
    system_prompt: config.system_prompt ?? '',
    greeting: config.greeting ?? '',
  };
}
