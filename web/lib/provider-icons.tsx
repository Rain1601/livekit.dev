import type { ComponentType } from 'react';
import { AudioLinesIcon, MicIcon } from 'lucide-react';
import {
  Anthropic,
  DeepSeek,
  Doubao,
  ElevenLabs,
  Gemini,
  Minimax,
  OpenAI,
  Qwen,
} from '@lobehub/icons';

interface IconProps {
  size?: number;
  className?: string;
}

export const PROVIDER_ICON_MAP: Record<string, ComponentType<IconProps>> = {
  openai: OpenAI,
  anthropic: Anthropic,
  google: Gemini,
  deepgram: MicIcon as ComponentType<IconProps>,
  cartesia: AudioLinesIcon as ComponentType<IconProps>,
  elevenlabs: ElevenLabs,
  deepseek: DeepSeek,
  doubao: Doubao,
  minimax: Minimax,
  qwen: Qwen,
};
