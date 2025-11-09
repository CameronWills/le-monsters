# Overview

Now that I have the game basics working, I want to make updates to the game.

High level requirements:
- Increase the size of the player character by 20%, as well as the other enemies and elements on the screen, such as platforms, coins, wizard hats, checkpoints etc. Everything needs to be a little larger, but no decrease the resolution of the game.
- The top of the ground should be covered in layer of grass coloured green.
- Inside each pit should be shallow water.
- Instead of droppings, birds drop eggs coloured cream and oval shaped.
- The level needs to be 2x longer, with more platforms, pits, enemies and a maximum of 4 checkpoints spread throughout the level.
- When the player collects a coin, the coin counter should only increment 1 coin
- The time counter should be in the middle at the top of the screen, lives on the left, and coins on the right.
- There is a new enemy type, a green frog that jumps left or right, in the direction of the player, but does not jump over pits, and will stop when it gets to the edge of a platform next to a pit.
- The background should have some clouds high in the sky, that move slower than the foreground, similar to a parallax effect.
- Enemies do not respawn when they are killed, unless the player dies and respawns


# Further Details

## New Frog Enemy

- The frog can be stomped on to defeat it
- It be killed by wizard staff projectiles
- Frog jumps every 2 seconds, a short distance in the direction of the player, but not very high.
- Need two, one for stationary and one for jumping.
- The Frog does not turn around at a platform edge, it just stops.
- Frogs can only be on the ground level.

## Level Extension Impact
- Increase target completion time to 8-10 mins
- Boss fight timing - does the 2x length include the boss arena or just the platforming section?
- A maximum of 3 wizard hats placed throughout the level, the last wizard hat should be after the last checkpoint just before the boss fight, as the player needs the wizard hat to kill the boss with projectiles.
- Including some moving platforms in the level, some that can move vertically and some horizontally.

## Visual Scaling Considerations
- Camera/viewport should not be adjusted, elements just need to increase their pixel count.
- Collision box - hitboxes should scale proportionally with visuals

## Grass
- Grass should be 30 pixels thick
- only appears on the ground surface
- Has small waving animation

## Water pits
- Water should be ocean blue coloured
- Water should have small wave animation
- Players still die when falling into the pits

## Bird Eggs:
- Should be 1.5x as large as current droppings
- Oval shapped and cream coloured
- Eggs disappear when they hit the ground
- Same fall-speed and damage mechanics as the current droppings

## Clouds:
- 1 cloud layer, may be replaced with a cloud sprite image sometime later.
- Speed differential is half of foreground speed
- Visual style consistency with hand-drawn aesthetic

## UI Changes
- Lives counter on the left
- Coin counter on right
- Time in the middle, without the 'Time' prefix.
- HUD elements should also scale 20% along with other elements



