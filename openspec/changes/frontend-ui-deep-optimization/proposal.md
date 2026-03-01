## Why

The settings sidebar was recently added to allow users to configure voice agent providers (LLM/STT/TTS/Realtime), but its UI was implemented as a quick prototype. It uses a right-side hover trigger (GearIcon from Phosphor) that feels disconnected from the rest of the UI, which consistently uses Lucide icons. The sidebar lacks polish — no smooth open/close toggle, no visual hierarchy, and the hover-to-dismiss interaction is fragile (mouse leaving closes it unexpectedly, especially when interacting with Select dropdowns that portal outside the sidebar). The settings panel needs to move to the left side, use a proper toggle mechanism, and match the design language of the existing control bar and UI components.

## What Changes

- **Move sidebar to the left side** with a proper slide-in/out animation using the existing `motion` library instead of raw CSS transitions
- **Replace hover trigger with a toggle button** — a persistent button in the WelcomeView that opens/closes the sidebar on click, preventing accidental dismissal
- **Replace Phosphor GearIcon with Lucide icon** (Settings2 or SlidersHorizontal) to match the project's primary icon library (Lucide throughout control bar, select, toasts)
- **Improve sidebar visual design** — add proper section headers, better spacing, a close button, and visual hierarchy consistent with existing shadcn/Radix patterns
- **Add a current config summary badge** on the WelcomeView so users can see their active configuration at a glance without opening the sidebar
- **Fix Select dropdown portal interaction** — ensure Radix Select popovers don't cause the sidebar to close by using click-based toggle instead of hover

## Capabilities

### New Capabilities
- `settings-sidebar-ui`: Complete settings sidebar component with left-side positioning, toggle-based open/close, motion animations, Lucide icons, improved layout and visual hierarchy, config summary badge

### Modified Capabilities

## Impact

- `web/components/app/settings-sidebar.tsx` — Major rewrite: position, trigger mechanism, animation, icons, layout
- `web/components/app/welcome-view.tsx` — Update sidebar integration and add config summary
- No backend changes needed
- No new dependencies (uses existing motion, Lucide, Radix UI)
