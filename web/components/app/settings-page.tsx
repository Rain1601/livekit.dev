'use client';

import { useState } from 'react';
import { EyeIcon, EyeOffIcon, KeyRoundIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProviderKeys } from '@/hooks/useProviderKeys';
import { ALL_PROVIDERS, type ProviderInfo } from '@/lib/agent-config';

const CAPABILITY_COLORS: Record<string, string> = {
  llm: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  stt: 'bg-green-500/10 text-green-600 dark:text-green-400',
  tts: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  realtime: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

function ProviderCard({ provider }: { provider: ProviderInfo }) {
  const { keys, setKey, removeKey } = useProviderKeys();
  const [visible, setVisible] = useState(false);
  const value = keys[provider.envKey] ?? '';
  const isConfigured = value.length > 0;

  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className={`inline-block size-2 shrink-0 rounded-full ${isConfigured ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
        />
        <h3 className="text-foreground text-sm font-medium">{provider.label}</h3>
      </div>

      {/* Capability badges */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {provider.capabilities.map((cap) => (
          <span
            key={cap}
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase ${CAPABILITY_COLORS[cap]}`}
          >
            {cap}
          </span>
        ))}
      </div>

      {/* Key input */}
      <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
        {provider.envKey}
      </label>
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <Input
            type={visible ? 'text' : 'password'}
            value={value}
            onChange={(e) => setKey(provider.envKey, e.target.value)}
            placeholder="Enter API key..."
            className="h-8 pr-8 text-xs"
          />
          <Button
            variant="ghost"
            size="icon-xs"
            className="absolute top-1 right-1"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOffIcon className="size-3" /> : <EyeIcon className="size-3" />}
          </Button>
        </div>
        {isConfigured && (
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => removeKey(provider.envKey)}
          >
            <XIcon className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-8 py-8">
        {/* Page header */}
        <div className="mb-10 flex items-start gap-4">
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-xl">
            <KeyRoundIcon className="text-muted-foreground size-5" />
          </div>
          <div>
            <h1 className="text-foreground text-xl font-semibold">Provider Settings</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Configure API keys for each provider. Keys are stored locally in your browser.
            </p>
          </div>
        </div>

        {/* Provider grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ALL_PROVIDERS.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  );
}
