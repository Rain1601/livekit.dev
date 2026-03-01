'use client';

import {
  ActivityIcon,
  BotIcon,
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

export function AgentPage() {
  const { config, dispatch } = useAgentConfig();

  const rtProvider = REALTIME_PROVIDERS[config.realtime?.provider ?? 'openai'];
  const llmProvider = LLM_PROVIDERS[config.llm?.provider ?? 'openai'];
  const sttProvider = STT_PROVIDERS[config.stt?.provider ?? 'deepgram'];
  const ttsProvider = TTS_PROVIDERS[config.tts?.provider ?? 'openai'];

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-8 py-8">
        {/* Page header */}
        <div className="mb-10 flex items-start gap-4">
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-xl">
            <BotIcon className="text-muted-foreground size-5" />
          </div>
          <div>
            <h1 className="text-foreground text-xl font-semibold">Agent Configuration</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Configure your voice AI agent&apos;s mode, models, and voice processing pipeline.
            </p>
          </div>
        </div>

        {/* General */}
        <section className="mb-8">
          <SectionHeading title="General" description="Select the agent operating mode." />
          <div className="max-w-xs">
            <Field
              label="Mode"
              value={config.mode}
              options={[
                { value: 'realtime', label: 'Realtime' },
                { value: 'pipeline', label: 'Pipeline (STT + LLM + TTS)' },
              ]}
              onValueChange={(v) =>
                dispatch({ type: 'SET_MODE', mode: v as 'realtime' | 'pipeline' })
              }
            />
          </div>
        </section>

        <hr className="border-border mb-8" />

        {/* Models */}
        <section className="mb-8">
          <SectionHeading
            title="Models"
            description={
              config.mode === 'realtime'
                ? 'Configure the realtime multimodal model.'
                : 'Configure the LLM, speech-to-text, and text-to-speech models.'
            }
          />

          {config.mode === 'realtime' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card icon={ZapIcon} title="Realtime Model">
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* LLM */}
              <Card icon={BrainIcon} title="LLM">
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

              {/* STT / ASR */}
              <Card icon={MicIcon} title="STT / ASR">
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
              <Card icon={Volume2Icon} title="TTS">
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
        </section>

        <hr className="border-border mb-8" />

        {/* Voice Processing */}
        <section className="mb-8">
          <SectionHeading
            title="Voice Processing"
            description="Configure voice activity detection and turn-taking behavior."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* VAD */}
            <Card icon={ActivityIcon} title="VAD (Voice Activity Detection)">
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

            {/* Turn Detection & Interruption */}
            <Card icon={TimerIcon} title="Turn Detection & Interruption">
              <Field
                label="Silence Duration (end-of-turn)"
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
        </section>
      </div>
    </div>
  );
}
