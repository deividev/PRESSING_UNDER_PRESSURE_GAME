import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

export type DifficultyLevel = "easy" | "normal" | "hard" | "extreme";

export interface GameSettings {
  // Audio
  masterVolume: number; // 0-100
  musicVolume: number; // 0-100
  sfxVolume: number; // 0-100
  musicEnabled: boolean;
  sfxEnabled: boolean;

  // Dificultad
  difficulty: DifficultyLevel;

  // Efectos visuales
  particlesEnabled: boolean;
  chromaticAberrationEnabled: boolean;
  screenShakeEnabled: boolean;
  glitchEffectEnabled: boolean;

  // Accesibilidad
  highContrast: boolean;
  reducedMotion: boolean;

  // Tutorial
  showTutorial: boolean;
  tutorialCompleted: boolean;
}

/**
 * Servicio para gestionar configuraciones del juego
 */
@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private readonly SETTINGS_KEY = "game_settings";
  private settings: GameSettings;

  constructor(private storage: StorageService) {
    this.settings = this.loadSettings();
  }

  /**
   * Carga las configuraciones guardadas
   */
  private loadSettings(): GameSettings {
    const settings = this.storage.get<GameSettings>(
      this.SETTINGS_KEY,
      undefined,
    );
    return settings || this.getDefaultSettings();
  }

  /**
   * Obtiene configuraciones por defecto
   */
  private getDefaultSettings(): GameSettings {
    return {
      masterVolume: 70,
      musicVolume: 50,
      sfxVolume: 70,
      musicEnabled: true,
      sfxEnabled: true,
      difficulty: "normal",
      particlesEnabled: true,
      chromaticAberrationEnabled: true,
      screenShakeEnabled: true,
      glitchEffectEnabled: true,
      highContrast: false,
      reducedMotion: false,
      showTutorial: true,
      tutorialCompleted: false,
    };
  }

  /**
   * Obtiene todas las configuraciones
   */
  getSettings(): GameSettings {
    return { ...this.settings };
  }

  /**
   * Actualiza una o varias configuraciones
   */
  updateSettings(updates: Partial<GameSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.storage.set(this.SETTINGS_KEY, this.settings);
  }

  /**
   * Obtiene el modificador de dificultad para el tiempo
   * NOTA: Siempre devuelve 1.0 porque la dificultad es progresiva (aumenta automáticamente cada 10 rondas)
   */
  getDifficultyModifier(): number {
    // La dificultad ahora es progresiva interna, no necesita modificación
    return 1.0;
  }

  /**
   * Obtiene el volumen ajustado para música
   */
  getMusicVolume(): number {
    if (!this.settings.musicEnabled) return 0;
    return (
      (this.settings.musicVolume / 100) * (this.settings.masterVolume / 100)
    );
  }

  /**
   * Obtiene el volumen ajustado para efectos de sonido
   */
  getSFXVolume(): number {
    if (!this.settings.sfxEnabled) return 0;
    return (this.settings.sfxVolume / 100) * (this.settings.masterVolume / 100);
  }

  /**
   * Resetea configuraciones a valores por defecto
   */
  resetSettings(): void {
    this.settings = this.getDefaultSettings();
    this.storage.set(this.SETTINGS_KEY, this.settings);
  }

  /**
   * Marca el tutorial como completado
   */
  completeTutorial(): void {
    this.updateSettings({ tutorialCompleted: true, showTutorial: false });
  }
}
