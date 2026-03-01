'use client';

import { use } from 'react';
import { AgentDetailPage } from '@/components/app/agent-detail-page';

export default function AgentDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AgentDetailPage id={id} />;
}
