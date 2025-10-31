# Feature Specification: Le Monsters - Browser-Based 2D Platformer Game

**Feature Branch**: `001-le-monsters-browser`  
**Created**: 2025-10-28  
**Status**: Draft  
**Input**: User description: "Le Monsters - browser-based 2D platformer game"

## Clarifications

### Session 2025-10-31

- Q: What is the purpose of collecting coins in the game? → A: Pure score tracking only (no gameplay impact, just displayed count)
- Q: How frequently does the boss shoot projectiles during the battle? → A: Pattern-based (alternates between rapid bursts and pauses)
- Q: What happens to the gameplay timer when the player completes the level or gets Game Over? → A: Displays final time on Victory/Game Over screen for player reference
- Q: How do moving platforms behave in terms of speed and pattern? → A: Slow constant speed with visible path indicators for predictability
- Q: What happens to bird droppings after they land? → A: Disappear immediately upon landing (temporary hazard)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Gameplay Loop (Priority: P1)

A child aged 7-8 years opens the game in their browser, starts a new game, and plays through the level using keyboard controls to run, jump over obstacles, avoid enemies, and collect coins whilst progressing from left to right through the level.

**Why this priority**: This is the foundational gameplay experience - without smooth movement and controls, nothing else matters. Delivers immediate playable value.

**Independent Test**: Can be fully tested by loading the game, starting a new game, and successfully moving Hugo through a basic level segment with platforms and simple obstacles, demonstrating responsive controls and smooth animation.

**Acceptance Scenarios**:

1. **Given** player is on main menu, **When** they click "New Game", **Then** game loads the level and Hugo appears at the starting position ready to play
2. **Given** player is in active gameplay, **When** they press arrow keys, **Then** Hugo moves left/right with slight acceleration/deceleration, maintaining 60fps
3. **Given** player is moving, **When** they press spacebar, **Then** Hugo jumps with fixed height, arc adjusting based on running speed
4. **Given** Hugo is moving through level, **When** player collects a coin, **Then** coin disappears with sound effect and coin counter increases by 1
5. **Given** Hugo reaches a checkpoint flag, **When** Hugo passes it, **Then** flag raises up with visual indication and checkpoint is activated
6. **Given** player is at a pit, **When** Hugo falls into it, **Then** Hugo dies (bounce animation), respawns at last checkpoint after 2 seconds, lives decrease by 1

---

### User Story 2 - Enemy Combat & Power-ups (Priority: P2)

Player encounters enemies (birds, hovering sharks) throughout the level and can defeat them either by jumping on their heads or by collecting the wizard hat power-up which enables shooting light projectiles from a wizard staff.

**Why this priority**: Adds core challenge and variety to gameplay. Requires basic movement (P1) to be functional, but is an independent combat system that could be developed separately.

**Independent Test**: Can be fully tested by placing Hugo in a level section with enemies and a wizard hat collectible, verifying stomp mechanics work, power-up collection grants shooting ability, and enemies are defeated through both methods.

**Acceptance Scenarios**:

1. **Given** Hugo encounters a hovering shark patrolling a platform, **When** Hugo jumps and lands on the shark's head, **Then** shark is defeated and disappears
2. **Given** Hugo encounters a bird in the sky, **When** bird drops droppings and they hit Hugo, **Then** Hugo dies, bounces off screen, respawns at checkpoint after 2 seconds
3. **Given** wizard hat appears in level, **When** Hugo collects it, **Then** Hugo visually wears hat and holds staff, Shift key becomes active for shooting
4. **Given** Hugo has wizard staff, **When** player presses Shift, **Then** light projectile shoots forward in facing direction (max once per second)
5. **Given** wizard staff projectile hits an enemy, **When** collision occurs, **Then** enemy is defeated and disappears with sound effect
6. **Given** Hugo has wizard hat power-up, **When** Hugo dies from any cause, **Then** power-up is lost and respawned Hugo has no hat or staff

---

### User Story 3 - Boss Battle (Priority: P3)

Player reaches the end of the level and faces a large boss enemy with spiky legs that shoots projectiles. Boss can only be damaged using the wizard staff, creating a final challenge requiring the power-up.

**Why this priority**: Provides climactic ending to the level. Depends on combat system (P2) and wizard staff mechanics, making it a natural final priority for implementation.

**Independent Test**: Can be fully tested by loading Hugo at the boss arena entrance with wizard staff already equipped, fighting the boss through its attack patterns, and verifying defeat leads to victory screen.

**Acceptance Scenarios**:

1. **Given** Hugo enters boss arena, **When** arena is reached, **Then** lighting changes, boss music starts, boss health bar appears showing 10 health
2. **Given** boss battle is active, **When** boss shoots projectiles, **Then** projectiles can be jumped over to avoid, hitting Hugo causes instant death
3. **Given** Hugo has wizard staff, **When** staff projectile hits boss, **Then** boss health decreases by 1, visual feedback shows hit
4. **Given** boss health reaches 0, **When** final hit lands, **Then** boss is defeated, victory screen appears with celebrations
5. **Given** Hugo dies during boss fight, **When** respawning at last checkpoint (before arena), **Then** boss health resets to 10, battle restarts fresh

---

### User Story 4 - Lives System & Game Over (Priority: P2)

Player has 3 lives to complete the level. Each death from enemies, projectiles, or pits costs one life and respawns at the last checkpoint. Losing all lives triggers Game Over screen.

**Why this priority**: Critical gameplay constraint that affects all other stories. Needs to work alongside movement (P1) but is independent enough to develop in parallel.

**Independent Test**: Can be fully tested by intentionally causing Hugo to die 3 times in succession and verifying Game Over screen appears, then testing checkpoint respawn with lives remaining.

**Acceptance Scenarios**:

1. **Given** game starts, **When** level begins, **Then** HUD displays 3 lives
2. **Given** Hugo has 2+ lives, **When** Hugo dies, **Then** lives decrease by 1, 2-second wait occurs, Hugo respawns at last checkpoint with 1 second invincibility
3. **Given** Hugo has 1 life, **When** Hugo dies, **Then** lives reach 0, Game Over screen appears after death animation
4. **Given** Game Over screen is displayed, **When** player views it, **Then** option to return to main menu is available
5. **Given** Hugo respawns with invincibility, **When** enemies touch Hugo during 1-second window, **Then** no damage occurs, Hugo continues playing

---

### User Story 5 - Menu & UI Systems (Priority: P2)

Player accesses main menu with "New Game" and "About" options, sees HUD during gameplay showing lives/coins/time, and can pause the game to continue or return to main menu.

**Why this priority**: Essential for game structure and user experience, but doesn't block core gameplay development. Can be developed in parallel with movement system.

**Independent Test**: Can be fully tested by navigating menu options, starting games, pausing mid-gameplay, and verifying all UI elements display correctly and respond to input.

**Acceptance Scenarios**:

1. **Given** game loads in browser, **When** initial load completes (under 3 seconds), **Then** polished main menu screen appears with hand-drawn art style
2. **Given** main menu is displayed, **When** player clicks "New Game", **Then** gameplay starts with level loaded and Hugo at starting position
3. **Given** main menu is displayed, **When** player clicks "About", **Then** About screen shows author and project description
4. **Given** gameplay is active, **When** player presses ESC, **Then** pause menu appears with "Continue" and "Main Menu" options
5. **Given** pause menu shows "Main Menu" option, **When** player selects it, **Then** confirmation dialogue appears asking to confirm leaving current game
6. **Given** gameplay is active, **When** HUD is visible, **Then** lives counter, coin count, and gameplay timer are always displayed and updated in real-time

---

### Edge Cases

- What happens when player tries to shoot without wizard hat power-up? (Shift key does nothing)
- What happens when player tries to backtrack past the starting position? (Cannot move further left than level start)
- What happens if player collects wizard hat, dies, but checkpoint was reached after collecting it? (Hat is lost; must recollect from original spawn point)
- What happens when moving platform carries player into a wall or ceiling? (Player is stopped by collision, platform continues moving)
- What happens when multiple enemies are defeated simultaneously? (Each triggers individual defeat animation and sound effect)
- What happens if player pauses during boss fight? (Game pauses, boss freezes, music continues softly)
- What happens when coin counter reaches maximum display digits? (Assumes reasonable maximum based on total coins in level)
- What happens if boss projectile and player projectile collide mid-air? (Both continue; no projectile-to-projectile collision)

## Requirements *(mandatory)*

### Functional Requirements

#### Gameplay Mechanics
- **FR-001**: Game MUST load in desktop browser within 3 seconds on standard broadband connection
- **FR-002**: Game MUST maintain 60 frames per second during active gameplay on standard laptop hardware
- **FR-003**: Player MUST control Hugo using arrow keys (left/right movement), spacebar (jump), Shift (shoot when powered up), and ESC (pause)
- **FR-004**: Hugo MUST have slight acceleration/deceleration when starting/stopping movement for natural feel
- **FR-005**: Jump MUST have fixed height with arc varying based on horizontal velocity (running jump travels farther than standing jump)
- **FR-006**: Player MUST have exactly 3 lives per game session, with each death reducing lives by 1
- **FR-007**: Game MUST respawn Hugo at last activated checkpoint after death, with 2-second delay before respawn
- **FR-008**: Hugo MUST have 1 second of invincibility after respawning to prevent immediate re-death

#### Level Design
- **FR-009**: Level MUST be side-scrolling, progressing from left to right with ability to backtrack
- **FR-010**: Level MUST be completable in 4-6 minutes for average player
- **FR-011**: Level MUST contain exactly 4 checkpoints, with the last checkpoint positioned just before boss arena
- **FR-012**: Checkpoints MUST be visual flag poles that raise when Hugo passes them
- **FR-013**: Level MUST contain collectible coins distributed throughout the environment for score tracking only (no gameplay impact)
- **FR-014**: Level MUST include moving platforms with slow constant speed and visible path indicators to traverse wide pits
- **FR-015**: Falling into bottomless pit MUST cause instant death and checkpoint respawn

#### Enemy System
- **FR-016**: Level MUST contain two enemy types: birds (flying overhead) and hovering sharks (platform patrol)
- **FR-017**: Birds MUST fly one direction across screen and drop droppings as hazards that disappear immediately upon landing
- **FR-018**: Hovering sharks MUST patrol back and forth on their designated platforms
- **FR-019**: Enemies MUST be defeatable by either: jumping on their heads (stomp) OR shooting with wizard staff
- **FR-020**: Any contact with enemy or enemy projectile MUST cause instant death (one-hit kill)
- **FR-021**: Enemies MUST respawn at their original positions when player respawns at checkpoint

#### Power-up System
- **FR-022**: Wizard hat MUST appear at designated location in level as collectible item
- **FR-023**: Collecting wizard hat MUST grant shooting ability via wizard staff
- **FR-024**: Hugo MUST visually wear wizard hat and hold wizard staff when power-up is active
- **FR-025**: Wizard staff MUST shoot light projectiles forward in the direction Hugo is facing
- **FR-026**: Staff shooting MUST be rate-limited to maximum one shot per second
- **FR-027**: Wizard hat power-up MUST be lost upon death and require re-collection
- **FR-028**: Wizard staff projectiles MUST have unlimited ammo once hat is collected

#### Boss Battle
- **FR-029**: Boss arena MUST be located at the rightmost end of the level
- **FR-030**: Boss MUST have 10 health points, with each wizard staff hit dealing 1 damage
- **FR-031**: Boss MUST shoot projectiles in pattern-based timing that alternates between rapid bursts and pauses
- **FR-032**: Boss projectiles MUST cause instant death on contact with Hugo
- **FR-033**: Boss MUST be immune to stomp damage; only wizard staff can damage boss
- **FR-034**: Boss MUST display health bar showing remaining health during battle
- **FR-035**: Boss arena MUST trigger lighting change and special boss music when entered
- **FR-036**: Defeating boss (reducing health to 0) MUST trigger victory screen with celebrations
- **FR-037**: Boss health MUST reset to 10 if player dies and respawns at pre-boss checkpoint

#### User Interface
- **FR-038**: Main menu MUST display "New Game" and "About" options with hand-drawn art style
- **FR-039**: About screen MUST display author and project description
- **FR-040**: HUD MUST display: remaining lives, coin count, and gameplay timer during active play
- **FR-041**: Pause menu (ESC key) MUST display "Continue" and "Main Menu" options
- **FR-042**: Selecting "Main Menu" from pause MUST show confirmation dialogue before exiting active game
- **FR-043**: Game Over screen MUST appear when all 3 lives are lost and display final elapsed time
- **FR-044**: Victory screen MUST appear after boss is defeated and display final completion time

#### Visual & Audio
- **FR-045**: All visual assets MUST follow hand-drawn colouring-in art style consistently
- **FR-046**: Character animations MUST include: running, jumping, death (bounce off screen)
- **FR-047**: Game MUST play one background music track during normal gameplay
- **FR-048**: Game MUST switch to different boss music track when boss battle begins
- **FR-049**: Sound effects MUST play for: jump, collecting wizard hat, killing enemy, shooting staff, collecting coin
- **FR-050**: All sprite assets MUST use sprite sheets rather than individual image files for efficiency

### Key Entities

- **Hugo (Player Character)**: Orange labubu-like character controlled by player; tracks position, velocity, facing direction, animation state, equipped power-ups, invincibility status
- **Enemy (Bird)**: Flying enemy that crosses screen horizontally, drops droppings; tracks position, movement pattern, alive state
- **Enemy (Hovering Shark)**: Platform-patrolling enemy; tracks position, patrol range, patrol direction, alive state
- **Boss**: Large end-level enemy with spiky legs; tracks health (10 max), attack patterns, projectile timing, defeated state
- **Checkpoint**: Auto-save point marked by flag pole; tracks activation state, position, associated spawn point
- **Wizard Hat Power-up**: Collectible item granting shooting ability; tracks position, collected state, spawn location for respawn
- **Coin**: Collectible item for score; tracks position, collected state
- **Platform**: Solid surface for standing/jumping; includes moving platforms with slow constant speed, visible path indicators showing movement trajectory, position, movement pattern
- **Projectile (Player)**: Light projectile from wizard staff; tracks position, velocity, facing direction
- **Projectile (Boss)**: Boss attack projectile; tracks position, velocity, despawn conditions
- **Game Session**: Overall game state; tracks lives remaining, total coins collected, elapsed time, current checkpoint, boss defeated status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Game loads from initial page request to playable main menu within 3 seconds on standard broadband connection (5 Mbps+)
- **SC-002**: Game maintains consistent 60 frames per second during active gameplay on standard laptop hardware (tested on representative mid-range devices from last 3 years)
- **SC-003**: Player input (keyboard controls) registers and responds within one frame (16ms) during gameplay
- **SC-004**: Average 7-8 year old player can complete the level within 4-6 minutes after understanding basic controls
- **SC-005**: 90% of target age group (7-8 years) can understand core mechanics (run, jump, stomp enemies) without reading instructions
- **SC-006**: Players successfully navigate through level from start to boss in single session 80% of the time (with 3 lives available)
- **SC-007**: Boss battle provides fair challenge: average player defeats boss within 3 attempts (using 3-life system)
- **SC-008**: All visual assets maintain consistent hand-drawn colouring-in art style with no placeholder graphics in delivered build
- **SC-009**: Player feedback (visual and audio) for all actions occurs within 100ms of action trigger (jump, collect, shoot, damage)
- **SC-010**: Checkpoint system successfully saves progress: 95% of deaths result in correct respawn at last activated checkpoint
- **SC-011**: Game runs stably for continuous 10-minute session without crashes, freezes, or performance degradation
