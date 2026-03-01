export interface AgentConfig {
  mode: 'realtime' | 'pipeline';
  realtime?: { provider: string; model: string; voice: string; temperature?: number };
  llm?: { provider: string; model: string; temperature?: number };
  stt?: { provider: string; model: string; language: string };
  tts?: { provider: string; voice: string };
  vad?: { provider: string; sensitivity: string };
  turn_detection?: {
    silence_duration_ms: number;
    allow_interruptions: boolean;
    min_interruption_duration_ms: number;
  };
}

// ---------------------------------------------------------------------------
// Unified provider registry
// ---------------------------------------------------------------------------

export interface ProviderInfo {
  id: string;
  label: string;
  envKey: string;
  capabilities: ('llm' | 'stt' | 'tts' | 'realtime')[];
}

export const ALL_PROVIDERS: ProviderInfo[] = [
  {
    id: 'openai',
    label: 'OpenAI',
    envKey: 'OPENAI_API_KEY',
    capabilities: ['llm', 'stt', 'tts', 'realtime'],
  },
  { id: 'anthropic', label: 'Anthropic', envKey: 'ANTHROPIC_API_KEY', capabilities: ['llm'] },
  {
    id: 'google',
    label: 'Google',
    envKey: 'GOOGLE_API_KEY',
    capabilities: ['llm', 'stt', 'tts', 'realtime'],
  },
  { id: 'deepgram', label: 'Deepgram', envKey: 'DEEPGRAM_API_KEY', capabilities: ['stt'] },
  { id: 'cartesia', label: 'Cartesia', envKey: 'CARTESIA_API_KEY', capabilities: ['tts'] },
  { id: 'elevenlabs', label: 'ElevenLabs', envKey: 'ELEVENLABS_API_KEY', capabilities: ['tts'] },
  { id: 'deepseek', label: 'DeepSeek', envKey: 'DEEPSEEK_API_KEY', capabilities: ['llm'] },
  {
    id: 'doubao',
    label: '豆包/Doubao',
    envKey: 'DOUBAO_API_KEY',
    capabilities: ['llm', 'stt', 'tts'],
  },
  {
    id: 'minimax',
    label: 'MiniMax',
    envKey: 'MINIMAX_API_KEY',
    capabilities: ['llm', 'stt', 'tts'],
  },
  { id: 'qwen', label: '千问/Qwen', envKey: 'DASHSCOPE_API_KEY', capabilities: ['llm'] },
];

// ---------------------------------------------------------------------------
// Provider definitions
// ---------------------------------------------------------------------------

export interface ProviderOption {
  label: string;
  models?: string[];
  voices?: string[];
}

export const REALTIME_PROVIDERS: Record<string, ProviderOption> = {
  openai: {
    label: 'OpenAI',
    models: ['gpt-4o-realtime-preview'],
    voices: ['alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer', 'verse'],
  },
  google: {
    label: 'Google',
    models: ['gemini-2.5-flash'],
    voices: ['Puck', 'Charon', 'Kore', 'Fenrir', 'Aoede'],
  },
};

export const LLM_PROVIDERS: Record<string, ProviderOption> = {
  openai: {
    label: 'OpenAI',
    models: ['gpt-4o', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano'],
  },
  anthropic: {
    label: 'Anthropic',
    models: ['claude-sonnet-4-5', 'claude-3-5-haiku'],
  },
  google: {
    label: 'Google',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash'],
  },
  deepseek: {
    label: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  doubao: {
    label: '豆包/Doubao',
    models: ['doubao-1.5-pro-32k', 'doubao-1.5-lite-32k'],
  },
  minimax: {
    label: 'MiniMax',
    models: ['MiniMax-Text-01', 'abab6.5s-chat'],
  },
  qwen: {
    label: '千问/Qwen',
    models: ['qwen-max', 'qwen-plus', 'qwen-turbo'],
  },
};

export const STT_PROVIDERS: Record<string, ProviderOption> = {
  openai: {
    label: 'OpenAI',
    models: ['gpt-4o-mini-transcribe', 'whisper-1'],
  },
  deepgram: {
    label: 'Deepgram',
    models: ['nova-3', 'nova-2'],
  },
  google: {
    label: 'Google',
    models: ['chirp_2', 'latest_long'],
  },
  doubao: {
    label: '豆包/Doubao',
    models: ['doubao-streaming'],
  },
  minimax: {
    label: 'MiniMax',
    models: ['speech-to-text-v1'],
  },
};

export const TTS_PROVIDERS: Record<string, ProviderOption> = {
  openai: {
    label: 'OpenAI',
    voices: ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer'],
  },
  cartesia: {
    label: 'Cartesia',
    voices: ['694f9389-aac1-45b6-b726-9d9369183238'],
  },
  elevenlabs: {
    label: 'ElevenLabs',
    voices: ['21m00Tcm4TlvDq8ikWAM', 'AZnzlk1XvdvUeBnXmlld'],
  },
  google: {
    label: 'Google',
    voices: ['en-US-Chirp3-HD-Achernar'],
  },
  doubao: {
    label: '豆包/Doubao',
    voices: ['zh_female_shuangkuaisisi_moon_bigtts'],
  },
  minimax: {
    label: 'MiniMax',
    voices: ['male-qn-qingse'],
  },
};

export const VAD_PROVIDERS: Record<string, ProviderOption> = {
  silero: {
    label: 'Silero',
  },
};

export const STT_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文 (Chinese)' },
  { value: 'ja', label: '日本語 (Japanese)' },
  { value: 'ko', label: '한국어 (Korean)' },
  { value: 'es', label: 'Español (Spanish)' },
  { value: 'fr', label: 'Français (French)' },
  { value: 'de', label: 'Deutsch (German)' },
  { value: 'pt', label: 'Português (Portuguese)' },
  { value: 'ru', label: 'Русский (Russian)' },
  { value: 'ar', label: 'العربية (Arabic)' },
  { value: 'hi', label: 'हिन्दी (Hindi)' },
  { value: 'it', label: 'Italiano (Italian)' },
];

export const VAD_SENSITIVITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const SILENCE_DURATION_OPTIONS = [
  { value: '300', label: '300ms' },
  { value: '500', label: '500ms' },
  { value: '800', label: '800ms' },
  { value: '1200', label: '1200ms' },
];

export const MIN_INTERRUPTION_DURATION_OPTIONS = [
  { value: '100', label: '100ms' },
  { value: '300', label: '300ms' },
  { value: '500', label: '500ms' },
];

export const TEMPERATURE_OPTIONS = [
  { value: '0', label: '0 (Deterministic)' },
  { value: '0.3', label: '0.3' },
  { value: '0.5', label: '0.5' },
  { value: '0.7', label: '0.7 (Default)' },
  { value: '1', label: '1.0' },
  { value: '1.5', label: '1.5' },
  { value: '2', label: '2.0 (Creative)' },
];

// ---------------------------------------------------------------------------
// Default config
// ---------------------------------------------------------------------------

export const DEFAULT_CONFIG: AgentConfig = {
  mode: 'realtime',
  realtime: {
    provider: 'openai',
    model: 'gpt-4o-realtime-preview',
    voice: 'alloy',
  },
  llm: {
    provider: 'openai',
    model: 'gpt-4o',
  },
  stt: {
    provider: 'openai',
    model: 'gpt-4o-mini-transcribe',
    language: 'en',
  },
  tts: {
    provider: 'openai',
    voice: 'alloy',
  },
  vad: {
    provider: 'silero',
    sensitivity: 'medium',
  },
  turn_detection: {
    silence_duration_ms: 500,
    allow_interruptions: true,
    min_interruption_duration_ms: 100,
  },
};
