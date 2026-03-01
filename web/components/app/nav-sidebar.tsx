'use client';

import {
  BotIcon,
  HomeIcon,
  KeyRoundIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/shadcn/utils';

type Page = 'main' | 'agent' | 'settings';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'main', label: 'Main', icon: HomeIcon },
  { id: 'agent', label: 'Agent', icon: BotIcon },
  { id: 'settings', label: 'Settings', icon: KeyRoundIcon },
];

interface NavSidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function NavSidebar({
  activePage,
  onPageChange,
  collapsed,
  onCollapsedChange,
}: NavSidebarProps) {
  return (
    <TooltipProvider>
      <aside
        className={cn(
          'bg-sidebar text-sidebar-foreground border-sidebar-border flex h-svh flex-col border-r transition-[width] duration-200',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-1 p-2 pt-4">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            const button = (
              <Button
                key={item.id}
                variant="ghost"
                size={collapsed ? 'icon' : 'default'}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  'w-full justify-start gap-3',
                  collapsed && 'justify-center',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
                )}
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-sidebar-border border-t p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={collapsed ? 'icon' : 'default'}
                onClick={() => onCollapsedChange(!collapsed)}
                className={cn(
                  'text-sidebar-foreground/70 hover:text-sidebar-foreground w-full justify-start gap-3',
                  collapsed && 'justify-center'
                )}
              >
                {collapsed ? (
                  <PanelLeftOpenIcon className="size-5 shrink-0" />
                ) : (
                  <>
                    <PanelLeftCloseIcon className="size-5 shrink-0" />
                    <span className="text-sm">Collapse</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" sideOffset={8}>
                Expand
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
