'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAgent } from '@/lib/agent-api';
import { DEFAULT_CONFIG } from '@/lib/agent-config';

export function CreateAgentDialog({ onCreated }: { onCreated?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setIsCreating(true);
    try {
      const agent = await createAgent({
        name: name.trim(),
        description: description.trim(),
        mode: DEFAULT_CONFIG.mode,
        realtime_config: DEFAULT_CONFIG.realtime ?? null,
        llm_config: DEFAULT_CONFIG.llm ?? null,
        stt_config: DEFAULT_CONFIG.stt ?? null,
        tts_config: DEFAULT_CONFIG.tts ?? null,
        vad_config: DEFAULT_CONFIG.vad ?? null,
        turn_detection_config: DEFAULT_CONFIG.turn_detection ?? null,
        system_prompt: DEFAULT_CONFIG.system_prompt ?? 'You are a helpful voice AI assistant.',
        greeting: DEFAULT_CONFIG.greeting ?? '',
      });
      setOpen(false);
      setName('');
      setDescription('');
      onCreated?.();
      router.push(`/agent/${agent.id}`);
    } catch (e) {
      console.error('Failed to create agent', e);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-1.5 size-4" />
          Create Agent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Agent</DialogTitle>
          <DialogDescription>
            Create a new voice AI agent with default configuration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="agent-name">Name</Label>
            <Input
              id="agent-name"
              placeholder="My Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="agent-desc">Description (optional)</Label>
            <Input
              id="agent-desc"
              placeholder="A helpful voice assistant..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim() || isCreating}>
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
