'use client';

import {
  ActivityIcon,
  BrainIcon,
  MicIcon,
  ThermometerIcon,
  TimerIcon,
  Volume2Icon,
  ZapIcon,
} from 'lucide-react';
import { Card, Field, SectionHeading } from '@/components/app/shared-ui';
import { useAgentConfig } from '@/hooks/useAgentConfig';
import {
  LLM_PROVIDERS,
  MIN_INTERRUPTION_DURATION_OPTIONS,
  REALTIME_PROVIDERS,
  SILENCE_DURATION_OPTIONS,
  STT_LANGUAGES,
  STT_PROVIDERS,
  TEMPERATURE_OPTIONS,
  TTS_PROVIDERS,
  VAD_PROVIDERS,
  VAD_SENSITIVITY_OPTIONS,
} from '@/lib/agent-config';
import { PROVIDER_ICON_MAP } from '@/lib/provider-icons';

export function AgentDetailConfigModelTab() {
  const { config, dispatch } = useAgentConfig();

  const rtProvider = REALTIME_PROVIDERS[config.realtime?.provider ?? 'openai'];
  const llmProvider = LLM_PROVIDERS[config.llm?.provider ?? 'openai'];
  const sttProvider = STT_PROVIDERS[config.stt?.provider ?? 'deepgram'];
  const ttsProvider = TTS_PROVIDERS[config.tts?.provider ?? 'openai'];

  return (
    <div className="space-y-5">
      {/* Mode */}
      <div>
        <SectionHeading title="General" description="Agent operating mode." />
        <Field
          label="Mode"
          value={config.mode}
          options={[
            { value: 'realtime', label: 'Realtime' },
            { value: 'pipeline', label: 'Pipeline (STT + LLM + TTS)' },
          ]}
          onValueChange={(v) => dispatch({ type: 'SET_MODE', mode: v as 'realtime' | 'pipeline' })}
        />
      </div>

      <hr className="border-border" />

      {/* Models */}
      <div>
        <SectionHeading
          title="Models"
          description={
            config.mode === 'realtime' ? 'Realtime multimodal model.' : 'LLM, STT, and TTS models.'
          }
        />

        {config.mode === 'realtime' ? (
          <div className="space-y-4">
            <Card
              icon={PROVIDER_ICON_MAP[config.realtime?.provider ?? 'openai'] ?? ZapIcon}
              title="Realtime Model"
            >
              <Field
                label="Provider"
                value={config.realtime?.provider ?? 'openai'}
                options={Object.entries(REALTIME_PROVIDERS).map(([k, v]) => ({
                  value: k,
                  label: v.label,
                }))}
                onValueChange={(v) => dispatch({ type: 'SET_REALTIME_PROVIDER', provider: v })}
              />
              <Field
                label="Model"
                value={config.realtime?.model ?? ''}
                options={(rtProvider?.models ?? []).map((m) => ({ value: m, label: m }))}
                onValueChange={(v) => dispatch({ type: 'SET_REALTIME_MODEL', model: v })}
              />
              <Field
                label="Voice"
                value={config.realtime?.voice ?? ''}
                options={(rtProvider?.voices ?? []).map((v) => ({ value: v, label: v }))}
                onValueChange={(v) => dispatch({ type: 'SET_REALTIME_VOICE', voice: v })}
              />
            </Card>
            <Card icon={ThermometerIcon} title="Parameters">
              <Field
                label="Temperature"
                value={String(config.realtime?.temperature ?? '0.7')}
                options={TEMPERATURE_OPTIONS}
                onValueChange={(v) =>
                  dispatch({ type: 'SET_REALTIME_TEMPERATURE', temperature: parseFloat(v) })
                }
              />
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {/* LLM */}
            <Card
              icon={PROVIDER_ICON_MAP[config.llm?.provider ?? 'openai'] ?? BrainIcon}
              title="LLM"
            >
              <Field
                label="Provider"
                value={config.llm?.provider ?? 'openai'}
                options={Object.entries(LLM_PROVIDERS).map(([k, v]) => ({
                  value: k,
                  label: v.label,
                }))}
                onValueChange={(v) => dispatch({ type: 'SET_LLM_PROVIDER', provider: v })}
              />
              <Field
                label="Model"
                value={config.llm?.model ?? ''}
                options={(llmProvider?.models ?? []).map((m) => ({ value: m, label: m }))}
                onValueChange={(v) => dispatch({ type: 'SET_LLM_MODEL', model: v })}
              />
              <Field
                label="Temperature"
                value={String(config.llm?.temperature ?? '0.7')}
                options={TEMPERATURE_OPTIONS}
                onValueChange={(v) =>
                  dispatch({ type: 'SET_LLM_TEMPERATURE', temperature: parseFloat(v) })
                }
              />
            </Card>

            {/* STT */}
            <Card
              icon={PROVIDER_ICON_MAP[config.stt?.provider ?? 'deepgram'] ?? MicIcon}
              title="STT / ASR"
            >
              <Field
                label="Provider"
                value={config.stt?.provider ?? 'deepgram'}
                options={Object.entries(STT_PROVIDERS).map(([k, v]) => ({
                  value: k,
                  label: v.label,
                }))}
                onValueChange={(v) => dispatch({ type: 'SET_STT_PROVIDER', provider: v })}
              />
              <Field
                label="Model"
                value={config.stt?.model ?? ''}
                options={(sttProvider?.models ?? []).map((m) => ({ value: m, label: m }))}
                onValueChange={(v) => dispatch({ type: 'SET_STT_MODEL', model: v })}
              />
              <Field
                label="Language"
                value={config.stt?.language ?? 'en'}
                options={STT_LANGUAGES}
                onValueChange={(v) => dispatch({ type: 'SET_STT_LANGUAGE', language: v })}
              />
            </Card>

            {/* TTS */}
            <Card
              icon={PROVIDER_ICON_MAP[config.tts?.provider ?? 'openai'] ?? Volume2Icon}
              title="TTS"
            >
              <Field
                label="Provider"
                value={config.tts?.provider ?? 'openai'}
                options={Object.entries(TTS_PROVIDERS).map(([k, v]) => ({
                  value: k,
                  label: v.label,
                }))}
                onValueChange={(v) => dispatch({ type: 'SET_TTS_PROVIDER', provider: v })}
              />
              <Field
                label="Voice"
                value={config.tts?.voice ?? ''}
                options={(ttsProvider?.voices ?? []).map((v) => ({ value: v, label: v }))}
                onValueChange={(v) => dispatch({ type: 'SET_TTS_VOICE', voice: v })}
              />
            </Card>
          </div>
        )}
      </div>

      <hr className="border-border" />

      {/* Voice Processing */}
      <div>
        <SectionHeading title="Voice Processing" description="VAD and turn-taking." />
        <div className="space-y-4">
          <Card icon={ActivityIcon} title="VAD">
            <Field
              label="Provider"
              value={config.vad?.provider ?? 'silero'}
              options={Object.entries(VAD_PROVIDERS).map(([k, v]) => ({
                value: k,
                label: v.label,
              }))}
              onValueChange={(v) => dispatch({ type: 'SET_VAD_PROVIDER', provider: v })}
            />
            <Field
              label="Sensitivity"
              value={config.vad?.sensitivity ?? 'medium'}
              options={VAD_SENSITIVITY_OPTIONS}
              onValueChange={(v) => dispatch({ type: 'SET_VAD_SENSITIVITY', sensitivity: v })}
            />
          </Card>

          <Card icon={TimerIcon} title="Turn Detection">
            <Field
              label="Silence Duration"
              value={String(config.turn_detection?.silence_duration_ms ?? 500)}
              options={SILENCE_DURATION_OPTIONS}
              onValueChange={(v) => dispatch({ type: 'SET_SILENCE_DURATION', value: Number(v) })}
            />
            <Field
              label="Allow Interruptions"
              value={config.turn_detection?.allow_interruptions === false ? 'no' : 'yes'}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
              onValueChange={(v) =>
                dispatch({ type: 'SET_ALLOW_INTERRUPTIONS', value: v === 'yes' })
              }
            />
            <Field
              label="Min Interruption Duration"
              value={String(config.turn_detection?.min_interruption_duration_ms ?? 100)}
              options={MIN_INTERRUPTION_DURATION_OPTIONS}
              onValueChange={(v) =>
                dispatch({ type: 'SET_MIN_INTERRUPTION_DURATION', value: Number(v) })
              }
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
