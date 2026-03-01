## 1. Rewrite Settings Sidebar Component

- [x] 1.1 Replace Phosphor `GearIcon` imports with Lucide `Settings2` and `X` icons in `settings-sidebar.tsx`
- [x] 1.2 Change sidebar positioning from right-side (`right-0`, `translateX(full)`) to left-side (`left-0`, `translateX(-100%)`)
- [x] 1.3 Replace hover-based open/close (`onMouseEnter`/`onMouseLeave`) with click-based toggle using `useState` boolean
- [x] 1.4 Add a close button (Lucide `X` icon) inside the sidebar header
- [x] 1.5 Replace raw CSS `transition-transform` with `motion` library: use `AnimatePresence` + `motion.div` with `initial={{ x: '-100%' }}`, `animate={{ x: 0 }}`, `exit={{ x: '-100%' }}`, ~300ms ease transition
- [x] 1.6 Improve section visual hierarchy: use proper section header labels with `Separator` component between sections, consistent spacing with the rest of the app

## 2. Update WelcomeView Integration

- [x] 2.1 Add a settings toggle button (Lucide `Settings2` icon) positioned in the top-left of the WelcomeView
- [x] 2.2 Lift sidebar open/close state to WelcomeView (or pass toggle handler down) so both the toggle button and sidebar close button can control it
- [x] 2.3 Add a config summary badge below the start button showing current config (e.g., "OpenAI Realtime · alloy" or "Pipeline: gpt-4o + nova-3 + Cartesia")
- [x] 2.4 Make the config summary badge clickable to open the sidebar

## 3. Verify and Clean Up

- [x] 3.1 Verify Radix Select dropdowns work correctly inside the sidebar (no accidental close on dropdown interaction)
- [x] 3.2 Run `next build` to verify no TypeScript or lint errors
- [x] 3.3 Remove any unused Phosphor icon imports from settings-sidebar.tsx
