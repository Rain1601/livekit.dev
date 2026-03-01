'use client';

import { type ReactNode, createContext, useContext, useEffect, useReducer } from 'react';
import { createElement } from 'react';
import {
  type AgentConfig,
  DEFAULT_CONFIG,
  LLM_PROVIDERS,
  REALTIME_PROVIDERS,
  STT_PROVIDERS,
  TTS_PROVIDERS,
} from '@/lib/agent-config';

const STORAGE_KEY = 'agent-config';

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type Action =
  | { type: 'SET_MODE'; mode: 'realtime' | 'pipeline' }
  | { type: 'SET_REALTIME'; provider: string; model: string; voice: string }
  | { type: 'SET_REALTIME_PROVIDER'; provider: string }
  | { type: 'SET_REALTIME_MODEL'; model: string }
  | { type: 'SET_REALTIME_VOICE'; voice: string }
  | { type: 'SET_REALTIME_TEMPERATURE'; temperature: number | undefined }
  | { type: 'SET_LLM_PROVIDER'; provider: string }
  | { type: 'SET_LLM_MODEL'; model: string }
  | { type: 'SET_LLM_TEMPERATURE'; temperature: number | undefined }
  | { type: 'SET_STT_PROVIDER'; provider: string }
  | { type: 'SET_STT_MODEL'; model: string }
  | { type: 'SET_STT_LANGUAGE'; language: string }
  | { type: 'SET_TTS_PROVIDER'; provider: string }
  | { type: 'SET_TTS_VOICE'; voice: string }
  | { type: 'SET_VAD_PROVIDER'; provider: string }
  | { type: 'SET_VAD_SENSITIVITY'; sensitivity: string }
  | { type: 'SET_SILENCE_DURATION'; value: number }
  | { type: 'SET_ALLOW_INTERRUPTIONS'; value: boolean }
  | { type: 'SET_MIN_INTERRUPTION_DURATION'; value: number }
  | { type: 'SET_SYSTEM_PROMPT'; value: string }
  | { type: 'SET_GREETING'; value: string }
  | { type: 'LOAD'; config: AgentConfig };

function reducer(state: AgentConfig, action: Action): AgentConfig {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'SET_REALTIME':
      return {
        ...state,
        realtime: { provider: action.provider, model: action.model, voice: action.voice },
      };

    case 'SET_REALTIME_PROVIDER': {
      const info = REALTIME_PROVIDERS[action.provider];
      return {
        ...state,
        realtime: {
          provider: action.provider,
          model: info?.models?.[0] ?? '',
          voice: info?.voices?.[0] ?? '',
        },
      };
    }
    case 'SET_REALTIME_MODEL':
      return { ...state, realtime: { ...state.realtime!, model: action.model } };
    case 'SET_REALTIME_VOICE':
      return { ...state, realtime: { ...state.realtime!, voice: action.voice } };
    case 'SET_REALTIME_TEMPERATURE':
      return { ...state, realtime: { ...state.realtime!, temperature: action.temperature } };

    case 'SET_LLM_PROVIDER': {
      const info = LLM_PROVIDERS[action.provider];
      return {
        ...state,
        llm: { provider: action.provider, model: info?.models?.[0] ?? '' },
      };
    }
    case 'SET_LLM_MODEL':
      return { ...state, llm: { ...state.llm!, model: action.model } };
    case 'SET_LLM_TEMPERATURE':
      return { ...state, llm: { ...state.llm!, temperature: action.temperature } };

    case 'SET_STT_PROVIDER': {
      const info = STT_PROVIDERS[action.provider];
      return {
        ...state,
        stt: { ...state.stt!, provider: action.provider, model: info?.models?.[0] ?? '' },
      };
    }
    case 'SET_STT_MODEL':
      return { ...state, stt: { ...state.stt!, model: action.model } };
    case 'SET_STT_LANGUAGE':
      return { ...state, stt: { ...state.stt!, language: action.language } };

    case 'SET_TTS_PROVIDER': {
      const info = TTS_PROVIDERS[action.provider];
      return {
        ...state,
        tts: { provider: action.provider, voice: info?.voices?.[0] ?? '' },
      };
    }
    case 'SET_TTS_VOICE':
      return { ...state, tts: { ...state.tts!, voice: action.voice } };

    case 'SET_VAD_PROVIDER':
      return { ...state, vad: { ...state.vad!, provider: action.provider } };
    case 'SET_VAD_SENSITIVITY':
      return { ...state, vad: { ...state.vad!, sensitivity: action.sensitivity } };

    case 'SET_SILENCE_DURATION':
      return {
        ...state,
        turn_detection: { ...state.turn_detection!, silence_duration_ms: action.value },
      };
    case 'SET_ALLOW_INTERRUPTIONS':
      return {
        ...state,
        turn_detection: { ...state.turn_detection!, allow_interruptions: action.value },
      };
    case 'SET_MIN_INTERRUPTION_DURATION':
      return {
        ...state,
        turn_detection: { ...state.turn_detection!, min_interruption_duration_ms: action.value },
      };

    case 'SET_SYSTEM_PROMPT':
      return { ...state, system_prompt: action.value };
    case 'SET_GREETING':
      return { ...state, greeting: action.value };

    case 'LOAD':
      return action.config;

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AgentConfigContextValue {
  config: AgentConfig;
  dispatch: React.Dispatch<Action>;
}

const AgentConfigContext = createContext<AgentConfigContextValue | null>(null);

export function AgentConfigProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(reducer, DEFAULT_CONFIG);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AgentConfig;
        dispatch({ type: 'LOAD', config: { ...DEFAULT_CONFIG, ...parsed } });
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  return createElement(AgentConfigContext.Provider, { value: { config, dispatch } }, children);
}

export function useAgentConfig() {
  const ctx = useContext(AgentConfigContext);
  if (!ctx) {
    throw new Error('useAgentConfig must be used within AgentConfigProvider');
  }
  return ctx;
}
