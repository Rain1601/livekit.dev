## ADDED Requirements

### Requirement: Sidebar positioned on the left side
The settings sidebar SHALL be positioned on the left edge of the viewport as a fixed panel.

#### Scenario: Sidebar renders on the left
- **WHEN** the sidebar is opened
- **THEN** it SHALL appear anchored to the left edge of the viewport, sliding in from the left

### Requirement: Sidebar opens and closes via click toggle
The sidebar SHALL open and close when the user clicks a toggle button. It SHALL NOT use hover-based triggering.

#### Scenario: User clicks the settings toggle button
- **WHEN** the user clicks the settings toggle button while the sidebar is closed
- **THEN** the sidebar SHALL animate open from the left

#### Scenario: User clicks the toggle button while sidebar is open
- **WHEN** the user clicks the settings toggle button while the sidebar is open
- **THEN** the sidebar SHALL animate closed to the left

#### Scenario: User clicks the close button inside the sidebar
- **WHEN** the user clicks the close button (X icon) inside the sidebar header
- **THEN** the sidebar SHALL animate closed to the left

### Requirement: Sidebar uses motion library for animations
The sidebar open/close animation SHALL use the `motion` library (AnimatePresence + motion.div) consistent with existing animation patterns in the project.

#### Scenario: Sidebar opens with slide animation
- **WHEN** the sidebar transitions from closed to open
- **THEN** it SHALL animate from `translateX(-100%)` to `translateX(0)` with an ease transition of approximately 300ms

#### Scenario: Sidebar closes with slide animation
- **WHEN** the sidebar transitions from open to closed
- **THEN** it SHALL animate from `translateX(0)` to `translateX(-100%)` with an ease transition of approximately 300ms

### Requirement: Sidebar uses Lucide icons exclusively
All icons in the sidebar component SHALL use the `lucide-react` library. No Phosphor icons SHALL be used in the sidebar.

#### Scenario: Settings trigger button icon
- **WHEN** the settings trigger button is rendered
- **THEN** it SHALL display a Lucide `Settings2` icon

#### Scenario: Close button icon
- **WHEN** the sidebar close button is rendered
- **THEN** it SHALL display a Lucide `X` icon

### Requirement: Sidebar displays mode selector
The sidebar SHALL display a mode selector allowing the user to choose between "Realtime" and "Pipeline (STT+LLM+TTS)" modes.

#### Scenario: User switches to Pipeline mode
- **WHEN** the user selects "Pipeline" from the mode selector
- **THEN** the sidebar SHALL show LLM, STT, and TTS configuration sections

#### Scenario: User switches to Realtime mode
- **WHEN** the user selects "Realtime" from the mode selector
- **THEN** the sidebar SHALL show the Realtime provider, model, and voice selectors

### Requirement: Sidebar shows provider-specific fields with auto-populated options
When the user selects a provider, the model/voice dropdown options SHALL automatically update to show that provider's available models or voices.

#### Scenario: User switches LLM provider to Anthropic
- **WHEN** the user changes the LLM provider to "Anthropic"
- **THEN** the model dropdown SHALL update to show Anthropic's models (claude-sonnet-4-5, claude-3-5-haiku) and SHALL auto-select the first model

### Requirement: Sidebar sections have clear visual hierarchy
Each configuration section (Realtime, LLM, STT, TTS) SHALL have a labeled section header and be separated from other sections by a visual divider.

#### Scenario: Pipeline mode section rendering
- **WHEN** Pipeline mode is active
- **THEN** the sidebar SHALL display three labeled sections: "LLM", "STT (Speech-to-Text)", "TTS (Text-to-Speech)", each separated by a divider

### Requirement: Config summary badge on WelcomeView
The WelcomeView SHALL display a summary of the current agent configuration below the start button, showing the active mode and key provider/model selections.

#### Scenario: Realtime mode summary
- **WHEN** the user has configured Realtime mode with OpenAI provider, gpt-4o-realtime-preview model, and alloy voice
- **THEN** the summary SHALL display text like "OpenAI Realtime · alloy"

#### Scenario: Pipeline mode summary
- **WHEN** the user has configured Pipeline mode with OpenAI LLM, Deepgram STT, and Cartesia TTS
- **THEN** the summary SHALL display text like "Pipeline: gpt-4o + nova-3 + Cartesia"

#### Scenario: Clicking the config summary opens the sidebar
- **WHEN** the user clicks on the config summary badge
- **THEN** the settings sidebar SHALL open

### Requirement: Settings toggle button visible on WelcomeView
A settings toggle button SHALL be visible on the WelcomeView, positioned in the top-left area, providing a clear entry point to the settings sidebar.

#### Scenario: Toggle button always visible
- **WHEN** the WelcomeView is displayed
- **THEN** a settings toggle button with a Lucide Settings2 icon SHALL be visible in the top-left area of the screen
