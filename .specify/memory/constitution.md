# Spec Platformer Game Constitution

<!--
Sync Impact Report:
Version change: (template) → 1.0.0
Modified principles: N/A (initial concrete set replacing template placeholders)
Added sections: Core Principles, Asset & Build Constraints, Governance
Removed sections: Unused testing/code quality heavy sections from prior draft template
Templates requiring updates:
✅ plan-template.md (needs simplified Constitution Check)
⚠ spec-template.md (no change required, but add UX polish & performance acceptance examples manually per feature)
✅ tasks-template.md (tasks should emphasise performance & polish passes, not coverage)
Follow-up TODOs: None
-->

## Core Principles

### I. Performance & Fluidity (NON-NEGOTIABLE)
Gameplay MUST maintain smooth animation and input responsiveness: target 60 fps, input processing under 16 ms per frame, no asset load stalls during active play. Any feature that degrades frame pacing MUST be refactored or deferred.

**Rationale**: A platformer lives or dies on feel; consistent frame timing preserves player control and fairness.

### II. Consistent User Experience & Polish
Visual style (tiles, sprites, UI elements) MUST follow a single cohesive art direction. Interaction feedback (jump, hit, collect, menu actions) MUST provide immediate audio/visual cues. UI layouts MUST remain stable across resolutions (16:9 baseline, graceful scaling to common desktop widths). No placeholder art or unstyled text remains in a shipped build.

**Rationale**: Consistency and polish increase player immersion and perceived quality without large code overhead.

### III. Static Asset Efficiency
All assets (images, audio, level data) MUST be static files optimised for size: spritesheets over individual images, compressed audio (e.g. OGG/MP3) where acceptable, JSON level data minified. The game MUST load core assets up front within 3 seconds on a typical broadband connection, deferring optional assets with lazy background loading.

**Rationale**: Efficient bundling ensures quick initial play access and reduces bandwidth for a static hosting model.

### IV. Deterministic Gameplay & Simple Playtesting
Game logic (physics, collision, enemy behaviour) MUST be deterministic for identical input sequences. A simple "playtest mode" MUST allow: restart level, show hitboxes toggle, frame-step for debugging. Formal unit test coverage is OPTIONAL; manual and scripted playtest verification of core loops (movement, collision, win/lose conditions) is REQUIRED before release.

**Rationale**: Determinism aids reproducible debugging and fairness; lightweight tooling replaces heavy test infrastructure for a static game.

## Asset & Build Constraints

- Initial load bundle (HTML + core JS + critical spritesheets) MUST be < 1 MB compressed.
- Each additional lazy-loaded asset group SHOULD remain < 500 KB compressed.
- Audio channel count MUST be limited to prevent clipping/performance issues (simultaneous SFX < 8).
- Level data MUST declare: spawn points, collision map, objective triggers — no implicit magic values.
- No runtime dependency on server APIs; the game MUST function fully from static hosting.

## Governance

### Amendment Process
Amendments require a brief proposal documenting: reason, impact on performance or UX, and migration notes for existing assets. Consensus approval by maintainers BEFORE merging changes.

### Versioning Policy
Semantic versions apply:
- MAJOR: Principle added/removed or deterministic model changed.
- MINOR: New asset constraints or tooling (e.g., new debug overlay feature).
- PATCH: Wording clarifications, minor numeric adjustments to targets.

### Compliance Review
Before any release:
- Verify frame rate target sustained across representative levels.
- Visually inspect all UI screens for cohesive styling and absence of placeholder content.
- Confirm initial load size and lazy asset boundaries.
- Exercise playtest mode (level restart, hitbox toggle, frame-step) to validate determinism.

Violations MUST be resolved or explicitly deferred with a documented rationale; deferred items tracked in release notes.

**Version**: 1.0.0 | **Ratified**: 2025-10-24 | **Last Amended**: 2025-10-24