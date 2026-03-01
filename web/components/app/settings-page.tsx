'use client';

import { useState } from 'react';
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  ShieldCheckIcon,
  XIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProviderKeys } from '@/hooks/useProviderKeys';
import { ALL_PROVIDERS, type ProviderInfo } from '@/lib/agent-config';
import { PROVIDER_ICON_MAP } from '@/lib/provider-icons';
import { cn } from '@/lib/shadcn/utils';

const CAPABILITY_COLORS: Record<string, string> = {
  llm: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  stt: 'bg-green-500/10 text-green-600 dark:text-green-400',
  tts: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  realtime: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

function ProviderRow({
  provider,
  index,
  expanded,
  onToggle,
}: {
  provider: ProviderInfo;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { keys, setKey, removeKey } = useProviderKeys();
  const [visible, setVisible] = useState(false);
  const value = keys[provider.envKey] ?? '';
  const isConfigured = value.length > 0;
  const Icon = PROVIDER_ICON_MAP[provider.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="bg-card rounded-xl border"
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={onToggle}
        className={cn(
          'flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors',
          'hover:bg-muted/50',
          expanded && 'border-b'
        )}
      >
        {/* Provider icon */}
        {Icon && <Icon size={24} className="shrink-0" />}

        {/* Name */}
        <span className="text-foreground text-sm font-medium">{provider.label}</span>

        {/* Capability badges */}
        <div className="flex flex-wrap gap-1.5">
          {provider.capabilities.map((cap) => (
            <span
              key={cap}
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase ${CAPABILITY_COLORS[cap]}`}
            >
              {cap}
            </span>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Status dot */}
        <span
          className={cn(
            'inline-block size-2 shrink-0 rounded-full',
            isConfigured ? 'bg-green-500' : 'bg-muted-foreground/30'
          )}
        />

        {/* Chevron */}
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDownIcon className="text-muted-foreground size-4" />
        </motion.span>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-5 py-4">
              {/* Env key label + external link */}
              <div className="flex items-center justify-between">
                <label className="text-muted-foreground text-xs font-medium">
                  {provider.envKey}
                </label>
                <a
                  href={provider.consoleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
                >
                  Get API key
                  <ExternalLinkIcon className="size-3" />
                </a>
              </div>

              {/* Input row */}
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

              {/* Security note */}
              <p className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                <ShieldCheckIcon className="size-3 shrink-0" />
                Stored locally in your browser
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SettingsPage() {
  const { keys } = useProviderKeys();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const configuredCount = ALL_PROVIDERS.filter((p) => (keys[p.envKey] ?? '').length > 0).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-8 py-8">
        {/* Page header */}
        <div className="mb-8 flex items-start gap-4">
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-xl">
            <KeyRoundIcon className="text-muted-foreground size-5" />
          </div>
          <div>
            <h1 className="text-foreground text-xl font-semibold">Provider Settings</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {configuredCount} of {ALL_PROVIDERS.length} configured
            </p>
          </div>
        </div>

        {/* Provider list */}
        <div className="space-y-2">
          {ALL_PROVIDERS.map((provider, i) => (
            <ProviderRow
              key={provider.id}
              provider={provider}
              index={i}
              expanded={expandedId === provider.id}
              onToggle={() => setExpandedId(expandedId === provider.id ? null : provider.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
