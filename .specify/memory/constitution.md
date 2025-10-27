<!--
Sync Impact Report:
Version change: (template) → 1.0.0
Modified principles: N/A (initial ratification)
Added sections: Core Principles, Performance & Technical Standards, Governance
Removed sections: N/A (replacing template placeholders)
Templates requiring updates:
✅ plan-template.md (Constitution Check to be updated)
✅ spec-template.md (no changes required; acceptance criteria examples apply)
✅ tasks-template.md (polish tasks already emphasised; unit tests optional)
Follow-up TODOs: None
-->

# Le Monsters Constitution

## Core Principles

### I. Smooth Gameplay & Responsive Controls (NON-NEGOTIABLE)
Game MUST maintain 60 fps during active gameplay on standard laptop hardware. Player input (keyboard controls for movement, jump, shoot) MUST respond within one frame (16ms). Physics and collision detection MUST be deterministic and consistent. Frame drops or input lag are blockers that MUST be resolved before feature completion.

**Rationale**: Platformers depend entirely on precise player control and timing; any performance degradation breaks the core experience and frustrates players, especially younger audiences.

### II. Hand-Drawn Visual Polish & Consistency
All visual assets (sprites, backgrounds, UI elements) MUST follow the hand-drawn colouring-in art style. Character sprites (Hugo, enemies, boss) MUST have smooth animations with clear silhouettes for gameplay clarity. Menu screens MUST present polished graphics with consistent typography and layout. No placeholder art, mismatched styles, or unpolished visual elements in production builds.

**Rationale**: Visual consistency creates an immersive world; the hand-drawn aesthetic is a core differentiator that appeals to the target age group and supports future integration of custom artwork.

### III. Static Asset Efficiency & Fast Loading
All game assets (sprites, audio, level data) MUST be static files optimised for browser delivery. Initial page load (splash screen to playable menu) MUST complete within 3 seconds on standard broadband. Sprite sheets MUST be used instead of individual images. Audio files MUST use compressed formats (OGG/MP3). Level data MUST be JSON or similar lightweight format. Total initial bundle size MUST remain under 2 MB compressed.

**Rationale**: Browser games require fast loading to retain player attention; efficient static assets enable simple hosting and distribution without server infrastructure.

### IV. Kid-Friendly Playability & Clear Feedback
Game mechanics MUST be intuitive for 7-8 year old players without requiring complex instructions. Visual and audio feedback MUST be immediate for all player actions (jump, land, collect, damage, enemy defeat). Checkpoint system MUST auto-save progress with clear visual indicators. Lives system MUST be visible and understood. Difficulty progression MUST be fair with learnable patterns, not random or punishing.

**Rationale**: Target age group requires clear cause-effect relationships and forgiving gameplay loops; frustration leads to abandonment, whilst clear feedback builds confidence and skill.

## Performance & Technical Standards

### Frame Rate & Responsiveness
- **Target FPS**: Sustained 60 fps during gameplay (measuring via `requestAnimationFrame` timing)
- **Input Latency**: Keyboard input processed within 16ms (single frame)
- **Load Time**: Menu interactive within 3 seconds of page load
- **Asset Streaming**: Background assets loaded without blocking gameplay

### Asset Size Budgets
- **Initial Bundle**: <2 MB compressed (HTML, core JS, critical sprites, menu assets)
- **Sprite Sheets**: Individual sheets <500 KB, optimised PNG or WebP
- **Audio Files**: Compressed OGG/MP3, background music <1 MB, SFX <100 KB each
- **Level Data**: JSON format, minified, <50 KB per level

### Browser Compatibility
- **Primary Target**: Desktop Chrome (latest 2 versions)
- **Screen Resolution**: Optimised for 1920×1080, minimum 1366×768
- **No Mobile Support**: Game designed for keyboard controls only

### Code Organisation
- Clear separation: game engine, entity logic, level data, asset loading, UI/menu systems
- Modular JavaScript with ES6+ features (classes, modules, async/await)
- No external game frameworks required (vanilla Canvas API acceptable)
- Static file hosting only—no server-side processing or databases

## Governance

### Amendment Process
Constitution amendments require:
1. Written proposal documenting rationale and impact on gameplay, performance, or art direction
2. Discussion and consensus approval
3. Update of affected templates and documentation
4. Migration plan for existing assets or code if applicable

### Versioning Policy
Semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Core principle changed or removed (e.g., abandoning 60 fps target, changing art style)
- **MINOR**: New principle added or significant expansion of standards (e.g., adding mobile support)
- **PATCH**: Clarifications, numeric threshold adjustments, editorial improvements

### Compliance Review
Before any feature merge or release build:
- Manual playtest on target hardware to verify 60 fps and input responsiveness
- Visual inspection for art style consistency and absence of placeholder assets
- Asset size audit to confirm bundle budgets maintained
- Playtesting with target age group (or proxy) to verify intuitive controls and feedback clarity

Violations MUST be resolved or explicitly deferred with documented justification in release notes.

**Version**: 1.0.0 | **Ratified**: 2025-10-27 | **Last Amended**: 2025-10-27