import { test, expect } from '@playwright/test';

/**
 * Visual Testing Suite for Le Monsters Game
 * 
 * These tests launch the game in a real browser and take screenshots
 * to verify visual elements and gameplay mechanics.
 */

test.describe('Le Monsters - Visual & Gameplay Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for Phaser to fully initialize
    await page.waitForTimeout(2000);
  });

  test('01 - Main Menu loads correctly', async ({ page }) => {
    // Verify main menu is visible
    await page.screenshot({ 
      path: 'test-results/screenshots/01-main-menu.png',
      fullPage: true 
    });
    
    // Check for canvas element (Phaser game)
    const canvas = await page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    
    console.log('✓ Main menu screenshot saved');
  });

  test('02 - Start new game', async ({ page }) => {
    // Click in center to start game (New Game button)
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/screenshots/02-game-started.png',
      fullPage: true 
    });
    
    console.log('✓ Game start screenshot saved');
  });

  test('03 - Player movement (right)', async ({ page }) => {
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Move right for 2 seconds
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(2000);
    await page.keyboard.up('ArrowRight');
    
    await page.screenshot({ 
      path: 'test-results/screenshots/03-player-moved-right.png',
      fullPage: true 
    });
    
    console.log('✓ Player movement screenshot saved');
  });

  test('04 - Player jump', async ({ page }) => {
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Jump
    await page.keyboard.press('Space');
    await page.waitForTimeout(300); // Mid-jump
    
    await page.screenshot({ 
      path: 'test-results/screenshots/04-player-jumping.png',
      fullPage: true 
    });
    
    console.log('✓ Player jump screenshot saved');
  });

  test('05 - Collect wizard hat power-up', async ({ page }) => {
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Move right to wizard hat location (x: 1500 in level)
    // Player starts at x: 100, need to move ~1400 pixels
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(8000); // Move for 8 seconds
    await page.keyboard.up('ArrowRight');
    
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test-results/screenshots/05-wizard-hat-collected.png',
      fullPage: true 
    });
    
    console.log('✓ Wizard hat collection screenshot saved');
  });

  test('06 - Shoot projectile with wizard staff', async ({ page }) => {
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Move to wizard hat
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(8000);
    await page.keyboard.up('ArrowRight');
    await page.waitForTimeout(500);
    
    // Shoot
    await page.keyboard.press('Shift');
    await page.waitForTimeout(200); // Capture projectile in flight
    
    await page.screenshot({ 
      path: 'test-results/screenshots/06-shooting-projectile.png',
      fullPage: true 
    });
    
    console.log('✓ Shooting projectile screenshot saved');
  });

  test('07 - Enemy bird patrol', async ({ page }) => {
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Move to first bird location (x: 500)
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(3000);
    await page.keyboard.up('ArrowRight');
    
    await page.screenshot({ 
      path: 'test-results/screenshots/07-enemy-bird.png',
      fullPage: true 
    });
    
    console.log('✓ Enemy bird screenshot saved');
  });

  test('08 - Enemy shark patrol', async ({ page }) => {
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Move to first shark location (x: 1000)
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(5000);
    await page.keyboard.up('ArrowRight');
    
    await page.screenshot({ 
      path: 'test-results/screenshots/08-enemy-shark.png',
      fullPage: true 
    });
    
    console.log('✓ Enemy shark screenshot saved');
  });

  test('09 - Stomp enemy', async ({ page }) => {
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Move to first bird
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(2500);
    await page.keyboard.up('ArrowRight');
    
    // Jump and stomp
    await page.keyboard.press('Space');
    await page.waitForTimeout(600); // Wait for stomp
    
    await page.screenshot({ 
      path: 'test-results/screenshots/09-stomp-enemy.png',
      fullPage: true 
    });
    
    console.log('✓ Stomp enemy screenshot saved');
  });

  test('10 - Boss arena entrance', async ({ page }) => {
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Move all the way to boss arena (x: 2800+)
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(20000); // Move for 20 seconds
    await page.keyboard.up('ArrowRight');
    
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/screenshots/10-boss-arena.png',
      fullPage: true 
    });
    
    console.log('✓ Boss arena screenshot saved');
  });

  test('11 - Boss health bar display', async ({ page }) => {
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Move to boss arena
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(20000);
    await page.keyboard.up('ArrowRight');
    await page.waitForTimeout(1500); // Wait for boss to activate
    
    await page.screenshot({ 
      path: 'test-results/screenshots/11-boss-health-bar.png',
      fullPage: true 
    });
    
    console.log('✓ Boss health bar screenshot saved');
  });

  test('12 - Full game playthrough (first 30 seconds)', async ({ page }) => {
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Play for 30 seconds with various actions
    console.log('Playing game for 30 seconds...');
    
    // Move right and jump occasionally
    const startTime = Date.now();
    while (Date.now() - startTime < 30000) {
      await page.keyboard.down('ArrowRight');
      await page.waitForTimeout(2000);
      await page.keyboard.up('ArrowRight');
      
      await page.keyboard.press('Space');
      await page.waitForTimeout(1000);
    }
    
    await page.screenshot({ 
      path: 'test-results/screenshots/12-gameplay-30sec.png',
      fullPage: true 
    });
    
    console.log('✓ 30-second gameplay screenshot saved');
  });

});

test.describe('Le Monsters - Bug Detection', () => {
  
  test('Verify player respawn after pit death', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Move to first pit (between x=500-700)
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(3000);
    await page.keyboard.up('ArrowRight');
    
    // Screenshot before falling
    await page.screenshot({ 
      path: 'test-results/screenshots/bug-pit-before.png',
      fullPage: true 
    });
    
    // Continue moving to fall in pit
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(1000);
    await page.keyboard.up('ArrowRight');
    
    // Wait for death and respawn
    await page.waitForTimeout(3000);
    
    // Screenshot after respawn
    await page.screenshot({ 
      path: 'test-results/screenshots/bug-pit-after-respawn.png',
      fullPage: true 
    });
    
    console.log('✓ Pit death and respawn screenshots saved');
  });

  test('Verify wizard hat visuals appear', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Screenshot before collecting hat
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(7500);
    await page.screenshot({ 
      path: 'test-results/screenshots/bug-before-wizard-hat.png',
      fullPage: true 
    });
    
    // Continue to collect hat
    await page.waitForTimeout(500);
    await page.keyboard.up('ArrowRight');
    await page.waitForTimeout(500);
    
    // Screenshot after collecting hat (should show hat and staff)
    await page.screenshot({ 
      path: 'test-results/screenshots/bug-after-wizard-hat.png',
      fullPage: true 
    });
    
    console.log('✓ Wizard hat visual bug screenshots saved');
  });

  test('Verify sharks patrol horizontally', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Start game
    await page.mouse.click(640, 400);
    await page.waitForTimeout(1000);
    
    // Move to shark area
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(5000);
    await page.keyboard.up('ArrowRight');
    
    // Take screenshots at 2-second intervals to capture patrol
    for (let i = 1; i <= 5; i++) {
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: `test-results/screenshots/bug-shark-patrol-${i}.png`,
        fullPage: true 
      });
      console.log(`✓ Shark patrol screenshot ${i}/5 saved`);
    }
  });

});
