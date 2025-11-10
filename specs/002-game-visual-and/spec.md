# Feature Specification: Game Visual and Gameplay Enhancements

**Feature Branch**: `002-game-visual-and`  
**Created**: 2025-11-09  
**Status**: Draft  
**Input**: Game visual and gameplay enhancements including 20% sprite scaling, new frog enemy, environmental graphics (grass/water/clouds), extended level length, and UI improvements

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enhanced Visual Experience (Priority: P1)

Players experience larger, more visible game elements with improved environmental graphics including animated grass, water in pits, and parallax cloud backgrounds, making the game more engaging and easier to see for young players.

**Why this priority**: Core visual improvements affect the entire gameplay experience and make the game more accessible for the 7-8 year old target audience. Larger sprites improve visibility and reduce eye strain.

**Independent Test**: Can be fully tested by launching the game and observing that all sprites (player, enemies, platforms, collectibles, checkpoints) are 20% larger than the original version, grass appears on ground surfaces with animation, water appears in pits with animation, and clouds move in the background at half the speed of foreground elements.

**Acceptance Scenarios**:

1. **Given** a player starts a new game, **When** the level loads, **Then** the player character Hugo is 20% larger in pixel size compared to the original version
2. **Given** the player is in the game level, **When** observing platforms, **Then** all platforms are 20% larger with the same visual quality
3. **Given** the player views the ground surface, **When** looking at the top of the ground, **Then** a 30-pixel thick layer of green grass appears with subtle waving animation
4. **Given** the player looks at a pit, **When** viewing the pit area, **Then** ocean blue colored water with wave animation is visible inside the pit
5. **Given** the player is playing, **When** looking at the sky background, **Then** clouds move horizontally at half the speed of foreground elements creating a parallax effect
6. **Given** the player collects coins, wizard hats, or reaches checkpoints, **When** these elements appear on screen, **Then** they are all 20% larger than the original version
7. **Given** collision detection is active, **When** the player or enemies interact with game elements, **Then** hitboxes are proportionally scaled 20% matching the visual size

---

### User Story 2 - New Frog Enemy Challenge (Priority: P2)

Players encounter a new green frog enemy that adds variety to combat by jumping toward them while being aware of platform edges and pits, creating strategic gameplay opportunities.

**Why this priority**: Adds gameplay variety and challenge without fundamentally changing core mechanics. Can be implemented and tested independently of visual enhancements.

**Independent Test**: Can be fully tested by spawning frog enemies on ground-level platforms and verifying they jump toward the player every 2 seconds, stop at platform edges near pits, and can be defeated by stomping or wizard staff projectiles.

**Acceptance Scenarios**:

1. **Given** a frog enemy is on a ground-level platform, **When** the player is within detection range, **Then** the frog jumps in the player's direction (left or right) every 2 seconds with a short jump distance and low height
2. **Given** a frog is approaching a platform edge with a pit beyond, **When** the frog reaches the edge, **Then** it stops moving and does not fall into the pit
3. **Given** a frog is stationary, **When** not jumping, **Then** it displays a stationary animation state
4. **Given** a frog is jumping, **When** performing its jump, **Then** it displays a jumping animation state
5. **Given** a player jumps on a frog's head, **When** landing on top of the frog, **Then** the frog is defeated and disappears
6. **Given** a player has the wizard staff, **When** shooting a projectile that hits the frog, **Then** the frog is defeated and disappears
7. **Given** a frog has been defeated, **When** the player continues playing without dying, **Then** the frog does not respawn
8. **Given** a player dies and respawns at a checkpoint, **When** returning to an area where frogs were defeated, **Then** those frogs respawn at their original positions

---

### User Story 3 - Extended Level Length (Priority: P2)

Players experience a longer adventure with double the level length, more platforms, pits, enemies, and strategic checkpoint placement, extending gameplay time from 4-6 minutes to 8-10 minutes.

**Why this priority**: Extends gameplay value but depends on visual and enemy systems being in place. Can be tested independently by measuring level completion time and counting level elements.

**Independent Test**: Can be fully tested by playing through the entire level and verifying it takes 8-10 minutes to complete, contains approximately double the platforms, pits, and enemies compared to the original, has exactly 4 checkpoints distributed throughout, and includes both vertical and horizontal moving platforms.

**Acceptance Scenarios**:

1. **Given** a player starts a new game, **When** completing the level at normal pace, **Then** the completion time is between 8-10 minutes (excluding boss fight)
2. **Given** the player progresses through the level, **When** encountering checkpoints, **Then** there are exactly 4 checkpoints evenly distributed throughout the level
3. **Given** the player moves through the level, **When** observing the level layout, **Then** there are approximately twice as many platforms compared to the original level design
4. **Given** the player navigates the level, **When** encountering pits, **Then** there are more pits than the original level design requiring jumping and platform navigation
5. **Given** the player fights enemies, **When** progressing through the level, **Then** there are more enemy encounters distributed throughout the extended level length
6. **Given** the player encounters platforms, **When** some platforms appear, **Then** they move vertically up and down
7. **Given** the player encounters platforms, **When** some platforms appear, **Then** they move horizontally left and right
8. **Given** a player searches for wizard hats, **When** exploring the level, **Then** a maximum of 3 wizard hats are placed throughout the level, with the last one positioned after the final checkpoint before the boss fight

---

### User Story 4 - Bird Egg Visual Update (Priority: P3)

Players see birds dropping oval-shaped cream-colored eggs instead of droppings, maintaining the same gameplay mechanics while providing a more appropriate visual representation.

**Why this priority**: Visual polish that doesn't affect core gameplay. Lower priority as it's a cosmetic change to existing functionality.

**Independent Test**: Can be fully tested by observing birds in flight and verifying they drop cream-colored oval eggs that are 1.5x larger than original droppings, disappear on ground impact, and cause the same damage.

**Acceptance Scenarios**:

1. **Given** a bird enemy is flying across the screen, **When** the bird drops its projectile, **Then** the projectile is an oval-shaped cream-colored egg
2. **Given** an egg is falling, **When** comparing to original droppings, **Then** the egg is 1.5 times larger in size
3. **Given** an egg is falling, **When** it reaches the ground, **Then** it disappears on impact
4. **Given** an egg hits the player, **When** contact occurs, **Then** the player dies (same damage mechanics as original droppings)
5. **Given** an egg is falling, **When** observing fall speed, **Then** it falls at the same rate as original droppings

---

### User Story 5 - Improved HUD Layout (Priority: P3)

Players see a reorganized HUD with lives counter on the left, time counter centered (without "Time:" prefix), and coin counter on the right, all scaled 20% larger for better readability.

**Why this priority**: Quality of life improvement that enhances usability but doesn't impact core gameplay. Can be implemented last.

**Independent Test**: Can be fully tested by launching the game and verifying the HUD layout matches the specified positions and that all HUD elements are 20% larger than the original.

**Acceptance Scenarios**:

1. **Given** the player is in the game, **When** viewing the HUD at the top of the screen, **Then** the lives counter appears on the left side
2. **Given** the player is in the game, **When** viewing the HUD at the top of the screen, **Then** the time counter appears in the center without the "Time:" prefix text
3. **Given** the player is in the game, **When** viewing the HUD at the top of the screen, **Then** the coin counter appears on the right side
4. **Given** the player views HUD elements, **When** comparing to the original HUD, **Then** all HUD elements (lives, time, coins) are 20% larger in size
5. **Given** the player collects a coin, **When** the coin counter updates, **Then** it increments by exactly 1 (fixing any previous multi-increment issues)

---

### Edge Cases

- What happens when a frog is at a platform edge and the player approaches from behind?
- How does the system handle frog pathfinding if the player is on a different elevation level?
- What happens if the player dies while a frog is mid-jump?
- How are moving platforms synchronized when a player respawns at a checkpoint?
- What happens if the camera viewport cannot accommodate 20% larger sprites in certain level sections?
- How do clouds behave when the player moves backward (left) in the level?
- What happens to bird eggs that are mid-flight when the player dies?
- How are wizard hat positions preserved if a player backtracks after collecting one?

## Requirements *(mandatory)*

### Functional Requirements

#### Visual Scaling & Graphics

- **FR-001**: System MUST scale all game sprites (player, enemies, platforms, coins, wizard hats, checkpoints, projectiles) to 120% of their original pixel size
- **FR-002**: System MUST maintain the same game resolution and viewport size despite larger sprites
- **FR-003**: System MUST scale all collision hitboxes proportionally with visual sprite scaling (120% of original size)
- **FR-004**: System MUST render a 30-pixel thick layer of animated green grass on top of all ground surfaces
- **FR-005**: System MUST render animated ocean blue water inside all pit areas
- **FR-006**: System MUST display background clouds that move horizontally at 50% of the foreground movement speed
- **FR-007**: System MUST maintain consistent hand-drawn visual aesthetic for all new graphical elements (grass, water, clouds)
- **FR-008**: Grass animation MUST show subtle waving motion
- **FR-009**: Water animation MUST show wave motion
- **FR-010**: System MUST ensure clouds are positioned high in the sky background layer

#### Frog Enemy

- **FR-011**: System MUST spawn green frog enemies only on ground-level platforms
- **FR-012**: Frog enemy MUST jump toward the player's current position (left or right direction) every 2 seconds
- **FR-013**: Frog jump MUST cover a short horizontal distance with low vertical height
- **FR-014**: Frog MUST stop moving when reaching a platform edge adjacent to a pit
- **FR-015**: Frog MUST NOT jump over pits or fall into pits
- **FR-016**: Frog MUST be defeatable by player stomping on its head
- **FR-017**: Frog MUST be defeatable by wizard staff projectiles
- **FR-018**: Frog MUST display a stationary animation state when not jumping
- **FR-019**: Frog MUST display a jumping animation state when performing a jump
- **FR-020**: Defeated frogs MUST NOT respawn unless the player dies and respawns at a checkpoint
- **FR-021**: Frog MUST detect player position to determine jump direction

#### Level Extension

- **FR-022**: System MUST extend the level length to support 8-10 minute completion time (excluding boss fight)
- **FR-023**: System MUST place exactly 4 checkpoints distributed throughout the extended level
- **FR-024**: System MUST include approximately double the number of platforms compared to the original level design
- **FR-025**: System MUST include more pits than the original level design
- **FR-026**: System MUST include more enemy spawns distributed throughout the extended level
- **FR-027**: System MUST place a maximum of 3 wizard hats throughout the level
- **FR-028**: System MUST position the final wizard hat after the last checkpoint before the boss fight
- **FR-029**: System MUST include moving platforms that move vertically (up and down)
- **FR-030**: System MUST include moving platforms that move horizontally (left and right)

#### Bird Egg Projectiles

- **FR-031**: Bird enemies MUST drop oval-shaped cream-colored eggs instead of droppings
- **FR-032**: Egg projectiles MUST be 1.5 times larger than the original dropping projectiles
- **FR-033**: Eggs MUST disappear immediately upon hitting the ground
- **FR-034**: Eggs MUST fall at the same speed as original droppings
- **FR-035**: Eggs MUST cause instant player death on contact (same damage mechanics as original)

#### HUD Improvements

- **FR-036**: System MUST display the lives counter on the left side of the top HUD
- **FR-037**: System MUST display the time counter in the center of the top HUD
- **FR-038**: System MUST display the coin counter on the right side of the top HUD
- **FR-039**: Time counter MUST NOT display the "Time:" prefix text
- **FR-040**: System MUST scale all HUD elements to 120% of their original size
- **FR-041**: System MUST increment the coin counter by exactly 1 when a coin is collected

#### Enemy Respawn Behavior

- **FR-042**: Defeated enemies (all types) MUST NOT respawn during continuous gameplay
- **FR-043**: All defeated enemies MUST respawn at their original positions when the player dies and respawns at a checkpoint

### Key Entities

- **Player Character (Hugo)**: 20% larger sprite, maintains all original abilities (run, jump, shoot with wizard hat), scaled collision hitbox
- **Frog Enemy**: New enemy type, green color, ground-level only, jumps toward player every 2 seconds, stops at platform edges, two animation states (stationary, jumping), can be defeated by stomping or projectiles
- **Platform**: 20% larger sprite, includes regular static platforms and new moving platforms (vertical and horizontal movement patterns), scaled collision hitbox
- **Grass Layer**: 30-pixel thick green animated layer on top of ground surfaces, subtle waving animation
- **Water**: Ocean blue animated hazard rendered inside pits, wave animation, causes instant death on contact
- **Background Clouds**: High-altitude visual element, moves at 50% of foreground speed (parallax effect), hand-drawn aesthetic
- **Bird Egg**: Projectile dropped by bird enemies, oval-shaped, cream-colored, 1.5x size of original droppings, disappears on ground impact
- **Checkpoint**: 20% larger sprite, maintains flag-raising behavior, 4 placed throughout extended level
- **Wizard Hat**: Power-up collectible, 20% larger sprite, maximum 3 in level with last one before boss fight
- **Coin**: Collectible currency, 20% larger sprite, increments counter by 1
- **HUD Elements**: Lives counter (left), time counter (center, no prefix), coin counter (right), all 120% scaled
- **Moving Platform**: Special platform type with vertical or horizontal movement patterns, 20% larger sprite
- **Boss**: Positioned at end of extended level, requires wizard staff to defeat (unchanged from original)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All game sprites (player, enemies, platforms, collectibles) are visibly 20% larger than the original version when measured in pixels
- **SC-002**: Players can complete the extended level in 8-10 minutes at normal gameplay pace (excluding boss fight time)
- **SC-003**: Frog enemies successfully detect and jump toward player position every 2 seconds with 95% accuracy
- **SC-004**: Frog enemies stop at platform edges adjacent to pits 100% of the time without falling
- **SC-005**: Game maintains 60 fps performance target on standard laptop devices with all new visual enhancements active
- **SC-006**: Grass animation displays continuous waving motion at consistent framerate
- **SC-007**: Water animation displays wave motion at consistent framerate
- **SC-008**: Background clouds move at exactly 50% of foreground movement speed creating visible parallax effect
- **SC-009**: Players can identify and distinguish the new frog enemy from other enemy types immediately
- **SC-010**: Coin counter increments by exactly 1 per coin collected with 100% accuracy
- **SC-011**: HUD layout correctly positions lives (left), time (center), coins (right) with proper 20% scaling
- **SC-012**: All 4 checkpoints are discoverable during normal level progression
- **SC-013**: Players can find and collect all 3 wizard hats during level exploration
- **SC-014**: Bird eggs are visually distinguishable from original droppings and clearly identifiable as eggs
- **SC-015**: Game remains completable by average 7-8 year old players despite increased level length and challenge
- **SC-016**: Collision detection accuracy remains consistent with scaled hitboxes (no false positives/negatives)
- **SC-017**: Moving platforms provide reliable transportation across gaps without unexpected behavior
- **SC-018**: Enemy respawn behavior correctly prevents respawning during continuous play and correctly respawns after checkpoint death 100% of the time
