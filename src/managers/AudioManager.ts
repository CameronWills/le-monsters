/**
 * Audio Manager
 * Centralized audio management for music and sound effects
 */

import Phaser from 'phaser';
import type { IAudioSettings } from '../types/entities';

export class AudioManager {
  private scene!: Phaser.Scene;
  private music: Map<string, Phaser.Sound.BaseSound> = new Map();
  private sfx: Map<string, Phaser.Sound.BaseSound> = new Map();
  
  private currentMusic: Phaser.Sound.BaseSound | null = null;
  private settings: IAudioSettings = {
    musicVolume: 0.7,
    sfxVolume: 0.8,
    musicMuted: false,
    sfxMuted: false,
  };

  /**
   * Initialize audio manager
   */
  init(scene: Phaser.Scene): void {
    this.scene = scene;
    this.loadSettings();
    console.log('[AudioManager] Initialized');
  }

  /**
   * Load audio settings from localStorage
   */
  private loadSettings(): void {
    const saved = localStorage.getItem('le-monsters-audio');
    if (saved) {
      try {
        this.settings = JSON.parse(saved);
        console.log('[AudioManager] Settings loaded from storage');
      } catch (e) {
        console.warn('[AudioManager] Failed to load settings, using defaults');
      }
    }
  }

  /**
   * Save audio settings to localStorage
   */
  private saveSettings(): void {
    localStorage.setItem('le-monsters-audio', JSON.stringify(this.settings));
  }

  /**
   * Play background music
   */
  playMusic(key: string, loop = true): void {
    // Stop current music
    this.stopMusic();

    // Check if music track exists in cache
    if (!this.scene.cache.audio.exists(key)) {
      console.warn(`[AudioManager] Music '${key}' not found in cache`);
      return;
    }

    // Create or get music sound
    if (!this.music.has(key)) {
      const sound = this.scene.sound.add(key, {
        loop,
        volume: this.settings.musicVolume,
      });
      this.music.set(key, sound);
    }

    this.currentMusic = this.music.get(key)!;
    
    if (!this.settings.musicMuted) {
      this.currentMusic.play();
      console.log(`[AudioManager] Playing music: ${key}`);
    }
  }

  /**
   * Stop current music
   */
  stopMusic(): void {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  /**
   * Pause current music
   */
  pauseMusic(): void {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      (this.currentMusic as Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound).pause();
    }
  }

  /**
   * Resume current music
   */
  resumeMusic(): void {
    if (this.currentMusic && this.currentMusic.isPaused) {
      (this.currentMusic as Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound).resume();
    }
  }

  /**
   * Play sound effect
   */
  playSfx(key: string, config?: Phaser.Types.Sound.SoundConfig): void {
    // Check if sound exists in cache
    if (!this.scene.cache.audio.exists(key)) {
      console.warn(`[AudioManager] SFX '${key}' not found in cache`);
      return;
    }

    if (this.settings.sfxMuted) {
      return;
    }

    // Create or get sound effect
    if (!this.sfx.has(key)) {
      const sound = this.scene.sound.add(key, {
        volume: this.settings.sfxVolume,
        ...config,
      });
      this.sfx.set(key, sound);
    }

    const sound = this.sfx.get(key)!;
    sound.play();
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume: number): void {
    this.settings.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
    
    if (this.currentMusic) {
      (this.currentMusic as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound).setVolume(
        this.settings.musicVolume
      );
    }
    
    this.saveSettings();
  }

  /**
   * Set SFX volume
   */
  setSfxVolume(volume: number): void {
    this.settings.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
    
    // Update all SFX sounds
    this.sfx.forEach((sound) => {
      (sound as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound).setVolume(
        this.settings.sfxVolume
      );
    });
    
    this.saveSettings();
  }

  /**
   * Toggle music mute
   */
  toggleMusicMute(): void {
    this.settings.musicMuted = !this.settings.musicMuted;
    
    if (this.settings.musicMuted) {
      this.pauseMusic();
    } else {
      this.resumeMusic();
    }
    
    this.saveSettings();
  }

  /**
   * Toggle SFX mute
   */
  toggleSfxMute(): void {
    this.settings.sfxMuted = !this.settings.sfxMuted;
    this.saveSettings();
  }

  /**
   * Get current settings
   */
  getSettings(): IAudioSettings {
    return { ...this.settings };
  }

  /**
   * Apply settings
   */
  applySettings(settings: Partial<IAudioSettings>): void {
    this.settings = { ...this.settings, ...settings };
    
    // Apply music volume
    if (this.currentMusic && settings.musicVolume !== undefined) {
      (this.currentMusic as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound).setVolume(
        settings.musicVolume
      );
    }
    
    // Apply SFX volume
    if (settings.sfxVolume !== undefined) {
      this.sfx.forEach((sound) => {
        (sound as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound).setVolume(
          settings.sfxVolume!
        );
      });
    }
    
    // Apply mute states
    if (settings.musicMuted !== undefined) {
      if (settings.musicMuted) {
        this.pauseMusic();
      } else {
        this.resumeMusic();
      }
    }
    
    this.saveSettings();
  }

  /**
   * Destroy all sounds and cleanup
   */
  destroy(): void {
    this.stopMusic();
    
    this.music.forEach((sound) => sound.destroy());
    this.sfx.forEach((sound) => sound.destroy());
    
    this.music.clear();
    this.sfx.clear();
    
    console.log('[AudioManager] Destroyed');
  }
}
