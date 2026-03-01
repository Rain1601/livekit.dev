## Context

The settings sidebar was added as a prototype to let users select voice agent providers (Realtime vs Pipeline mode, LLM/STT/TTS providers and models). It currently:
- Sits on the **right side** with a hover-triggered GearIcon (Phosphor)
- Uses raw CSS `translateX` transitions
- Dismisses on `onMouseLeave`, which conflicts with Radix Select portals (dropdown opens outside sidebar → mouse leaves → sidebar closes)
- Uses Phosphor `GearIcon` while the rest of the app uses Lucide icons exclusively (control bar, selects, toasts, theme toggle)
- Has minimal visual hierarchy — flat list of selects without clear sectioning

The rest of the UI follows a consistent pattern: shadcn/Radix primitives, Lucide icons, `motion` library for animations, Tailwind CSS with oklch color tokens, and a `cn()` utility for className merging.

## Goals / Non-Goals

**Goals:**
- Move sidebar to the left side with a click-to-toggle button
- Use Lucide icons consistently (replace Phosphor GearIcon)
- Animate sidebar open/close with `motion` (AnimatePresence) to match existing view transition patterns
- Fix Select dropdown interaction (click toggle eliminates the hover-dismiss problem entirely)
- Improve visual hierarchy: section headers with separators, consistent spacing
- Add a config summary badge on WelcomeView showing the current selection at a glance

**Non-Goals:**
- Changing the backend provider registry or data flow (agent_config structure stays the same)
- Adding new providers or models (provider list stays unchanged)
- Redesigning the WelcomeView layout or SessionView
- Adding mobile-specific responsive behavior beyond what exists

## Decisions

### 1. Click toggle instead of hover trigger
**Choice:** Replace `onMouseEnter`/`onMouseLeave` with a toggle button + boolean state.
**Rationale:** Hover-to-dismiss is fragile — Radix Select portals render outside the sidebar DOM, so the mouse technically "leaves" when opening a dropdown. Click toggle is deterministic and accessible (keyboard-friendly). The existing control bar uses click toggles for chat, camera, etc.
**Alternative considered:** Overlay backdrop click-to-close — rejected because it adds complexity and the sidebar is not a modal dialog.

### 2. Left-side positioning
**Choice:** Position the sidebar on the left edge of the viewport.
**Rationale:** User requested. Left-side panels are conventional for settings/navigation in LTR layouts. The right side will remain clear for any future features.

### 3. Motion library for animations
**Choice:** Use `motion` (Framer Motion) `AnimatePresence` + `motion.div` for sidebar entrance/exit.
**Rationale:** The project already uses `motion` extensively (view-controller, tile-layout, session-view, chat-transcript). Using the same library maintains consistency and enables physics-based animations that match the existing feel.
**Pattern:** `initial={{ x: '-100%' }}` → `animate={{ x: 0 }}` → `exit={{ x: '-100%' }}` with `ease` transition, ~300ms.

### 4. Lucide icon for settings trigger
**Choice:** Use `Settings2` from `lucide-react` (the sliders-style gear icon).
**Rationale:** Lucide is the primary icon library used across the entire app (control bar, select dropdowns, toasts, disconnect button). Phosphor is only used in theme-toggle.tsx and error toasts. `Settings2` is visually cleaner than `Settings` (the classic gear) and immediately communicates "configuration."

### 5. Config summary badge
**Choice:** Show a small summary line below the start button (e.g., "OpenAI Realtime · alloy" or "Pipeline: GPT-4o + Deepgram + Cartesia") that is clickable to open the sidebar.
**Rationale:** Users should see their current configuration without opening the sidebar. This creates a second entry point to the sidebar and reduces the cognitive load of "did I configure the right thing before starting?"

### 6. Sidebar layout structure
**Choice:** Fixed sidebar with sections separated by `Separator` component, using the existing `Select` components for dropdowns.
**Rationale:** Reuses existing UI primitives. Sections: header with close button → mode selector → divider → provider-specific fields. Each section has a label styled like the existing `SelectLabel` component.

## Risks / Trade-offs

- **[Risk] AnimatePresence with fixed positioning** — Fixed elements can cause issues with stacking contexts. → Mitigation: Use `z-50` (same as current) and test with Select portals (which use `z-50` via Radix default).
- **[Risk] Config summary text overflow** — Long provider/model names could overflow on narrow screens. → Mitigation: Use `truncate` class and show full text in tooltip.
- **[Trade-off] No backdrop overlay** — The sidebar doesn't block interaction with the rest of the page. This is intentional (it's a settings panel, not a modal) but means users could click "Start call" while sidebar is open. → Acceptable: sidebar state doesn't affect the call start flow.
