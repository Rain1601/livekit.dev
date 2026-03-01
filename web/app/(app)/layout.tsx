import { headers } from 'next/headers';
import { AppShell } from '@/components/app/app-shell';
import { getAppConfig } from '@/lib/utils';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);

  return <AppShell appConfig={appConfig}>{children}</AppShell>;
}
