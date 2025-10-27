# Game Overview
Build a side-scrolling 2D platform game suitable for 7-8 year old kids, named "Le Monsters"

High level requirements:
- Similar in feel and playing style to Super Mario Bros, but the main character will be an orange labubu-like character named 'Hugo'
- The game should only have one level, that should take between 4-6 mins to finish, with a boss character at the end of the level which is an monster with spiky legs.
- Throughout the level, there should be enemies such as birds and sharks that move along the ground, and main character can jump on their heads to kill them, or otherwise kill them by shooting a small ball of light from a magic wizards staff
- The main character does not have the wizards staff at the start, it can be collected by picking up a wizards hat that appears in the level.
- The player will have 3 lives to complete the game/level, restarting the last seen checkpoints throughout the level.
- The art style/direction should look like hand drawings and colouring in. At some later stage, I want to add some hand-drawn images for the main character, enemies and other sprites in the game.
- The game needs to run in a desktop browser such as Chrome, and does not need to be responsive or support mobile/tablet screen size devices
- The game should perform well enough on standard laptop devices.
- The game should have nice graphical startup screen with a menu, and an option to start a "New Game" as well as "About" describing the author and project.

# Details

## Player Character (Hugo)
- Visual design: orange labubu-like
- Base abilities: run, jump
- Slight acceleration/deceleration when starting/stopping running
- Jump height is fixed, jump arc will depend on if player is running in a direction
- Advanced abilities: wizard staff shooting (collectible)
- Animation states needed: running, jumping, death bounce out of screen

## Enemies & Combat
- Enemy types: bird, hovering shark, boss at end of level
- Hovering sharks patrol back and forth on their platform
- Birds fly above in the sky through the sceen in one-direction ony, and drop droppings
- Defeat mechanics: stomp or shoot when powered up with wizard hat
- A single hit from an enemy is a death, restarting at the checkpoint with 1 less lige
- Wizard staff: unlimited ammo once collected, max one shot every second
- Shooting direction: only forward in the direction the player is facing

## Boss Enemy
- Boss has own health bar, 10 health, each staff shot = 1 damange
- Boss shoots projectiles, that can be jumped over to avoid, a hit is instant death
- A large boss character with a health bar, cannot be jumped over to move past, nor jumped on to deal damage
- Boss can only be dealt damage by shooting from the wizards staff

## Game Over & Victory States
- Gameover screen when player loses all lives
- Completed screen with celebrations when level finised

## Power-up System
- Wizard hat collectable enables power up
- Visual indication: when hat is collected, the player character wear wizard hat and holds wizard staff
- Wizard hat power up does not persist after death

## Environmental Hazards
- Hazard types: pits/bottomless falls
- Moving platforms to get across wide pits
- Falling in pit is instant death

## Level Design
- One level only
- Duration: 4-6 minutes
- Structure: side-scrolling as player moves back & forth
- Play starts at leftmost part of level, and moves right through the level to the end
- Players can backtrack
- Collectable coins throughout the level
- Checkpoints: 4 checkpoints throughout the level, last one just before boss fight
- Boss arena: at the end of the level, a large boss character. Lighting and music changes during fight

## Checkpoint Behaviour
- Visual indication, small flag pole with flag labelled "checkpoint" that raises up when the player character moves past it. 
- Enemies respawn at checkpoint restart
- Upon death, wait 2 seconds before respawning at checkpoint, player is invincible from enemies for 1 second after respawn

## Controls
- Arrow keys for movement
- Spacebar for jump
- Shift for fire from wizards staff
- ESC for pause menu

## User Interface
- Main menu: New Game, About
- HUD: lives, coin count, clock
- Pause menu: Continue, Main Menu (with confirmation to leave current game)

## Audio Requirements
- Music: one track for gameplay, and a different track for boss fight
- SFX: for jump, collect wizards hat, kill enemy, shoot, collect coin

## Technical Requirements
- Platform: Desktop Chrome
- Performance: 60 fps target
- Load time: <3 seconds
- Asset budgets: [from constitution]

## Success Criteria
- Completable by average 7-8 year old
- Responsive controls (no lag)
- Visually consistent hand-drawn style



