'use client';

import { useAgentConfig } from '@/hooks/useAgentConfig';

function ParamSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-primary font-mono text-[11px]">{value}</span>
    </div>
  );
}

export function AgentDetailParamsPanel() {
  const { config } = useAgentConfig();

  const isRealtime = config.mode === 'realtime';

  return (
    <div className="space-y-5 p-4">
      <h2 className="text-foreground text-xs font-semibold">Agent Configuration</h2>

      {/* Main model info */}
      <ParamSection title="Agent Configuration">
        {isRealtime ? (
          <>
            <ParamRow label="MODE" value="REALTIME" />
            <ParamRow
              label="REALTIME"
              value={`${config.realtime?.provider}/${config.realtime?.model}`}
            />
            <ParamRow label="VOICE" value={config.realtime?.voice ?? '–'} />
            <ParamRow label="TEMPERATURE" value={String(config.realtime?.temperature ?? 0.7)} />
          </>
        ) : (
          <>
            <ParamRow label="MODE" value="PIPELINE" />
            <ParamRow label="LLM" value={`${config.llm?.provider}/${config.llm?.model}`} />
            <ParamRow label="TEMPERATURE" value={String(config.llm?.temperature ?? 0.7)} />
            <ParamRow
              label="SPEECH-TO-TEXT"
              value={`${config.stt?.provider}/${config.stt?.model}`}
            />
            <ParamRow
              label="TEXT-TO-SPEECH"
              value={`${config.tts?.provider}/${config.tts?.voice}`}
            />
          </>
        )}
      </ParamSection>

      <ParamSection title="Voice Processing">
        <ParamRow label="VAD" value={`${config.vad?.provider} (${config.vad?.sensitivity})`} />
      </ParamSection>

      <ParamSection title="Enhancements">
        <ParamRow
          label="TURN DETECTION"
          value={`${config.turn_detection?.silence_duration_ms ?? 500}ms`}
        />
        <ParamRow
          label="INTERRUPTIONS"
          value={config.turn_detection?.allow_interruptions === false ? 'OFF' : 'ON'}
        />
        <ParamRow label="NOISE CANCELLATION" value="OFF" />
      </ParamSection>

      <ParamSection title="Latency">
        <ParamRow label="SPEECH-TO-TEXT" value="–" />
        <ParamRow label="END OF TURN" value="–" />
        <ParamRow label="LLM" value="–" />
        <ParamRow label="TEXT-TO-SPEECH" value="–" />
        <ParamRow label="OVERALL" value="–" />
      </ParamSection>
    </div>
  );
}
