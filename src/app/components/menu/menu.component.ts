import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { PlayerStatsService } from '../../services/player-stats.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  @Input() isInstructions: boolean = false;
  @Output() startGame = new EventEmitter<void>();
  @Output() showInstructions = new EventEmitter<void>();
  @Output() backToMenu = new EventEmitter<void>();

  // Modales
  showTutorial = false;
  showLeaderboard = false;
  showStats = false;
  showAchievements = false;
  showSettings = false;

  // Sistema de Audio
  private audioContext: Map<string, HTMLAudioElement> = new Map();
  private menuMusic: HTMLAudioElement | null = null;
  private musicStarted: boolean = false;

  private readonly SOUNDS = {
    MENU_MUSIC: 'assets/sounds/menu-music.mp3',
    BUTTON_HOVER: 'assets/sounds/button-hover.mp3',
    BUTTON_CLICK: 'assets/sounds/button-click.mp3',
    START_GAME: 'assets/sounds/start-game.mp3'
  };

  constructor(
    private settingsService: SettingsService,
    private statsService: PlayerStatsService,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.initAudio();
    this.playMenuMusic();
    
    // Mostrar tutorial si es primera vez
    const settings = this.settingsService.getSettings();
    if (settings.showTutorial && !settings.tutorialCompleted) {
      setTimeout(() => {
        this.showTutorial = true;
      }, 500);
    }
  }

  ngOnDestroy() {
    this.stopMenuMusic();
  }

  initAudio() {
    // Precargar sonidos de efectos con volumen ajustado desde settings
    const settings = this.settingsService.getSettings();
    const sfxVolume = this.settingsService.getSFXVolume();

    Object.entries(this.SOUNDS).forEach(([key, path]) => {
      if (key !== 'MENU_MUSIC') {
        const audio = new Audio(path);
        audio.volume = (key === 'BUTTON_HOVER' ? 0.3 : 0.5) * sfxVolume;
        audio.preload = 'auto';
        this.audioContext.set(key, audio);
      }
    });

    // Configurar música de menú
    this.menuMusic = new Audio(this.SOUNDS.MENU_MUSIC);
    this.menuMusic.loop = true;
    this.menuMusic.volume = 0.25 * this.settingsService.getMusicVolume();
    this.menuMusic.preload = 'auto';
  }

  updateVolumes() {
    // Actualizar volúmenes cuando cambien las configuraciones
    const sfxVolume = this.settingsService.getSFXVolume();
    const musicVolume = this.settingsService.getMusicVolume();

    this.audioContext.forEach((audio, key) => {
      audio.volume = (key === 'BUTTON_HOVER' ? 0.3 : 0.5) * sfxVolume;
    });

    if (this.menuMusic) {
      this.menuMusic.volume = 0.25 * musicVolume;
    }
  }

  playSound(soundKey: string) {
    const settings = this.settingsService.getSettings();
    if (!settings.sfxEnabled) return;

    const audio = this.audioContext.get(soundKey);
    if (audio) {
      const clone = audio.cloneNode(true) as HTMLAudioElement;
      clone.volume = audio.volume;
      clone.play().catch(err => console.warn('Error al reproducir sonido:', err));
    }
  }

  playMenuMusic() {
    const settings = this.settingsService.getSettings();
    if (!settings.musicEnabled) return;

    if (this.menuMusic && this.menuMusic.paused) {
      this.menuMusic.play()
        .then(() => {
          this.musicStarted = true;
        })
        .catch((err) => {
          console.warn('La música del menú se iniciará con la primera interacción');
        });
    }
  }

  stopMenuMusic() {
    if (this.menuMusic && !this.menuMusic.paused) {
      this.menuMusic.pause();
      this.menuMusic.currentTime = 0;
    }
    this.musicStarted = false;
  }

  tryStartMusic() {
    if (!this.musicStarted) {
      this.playMenuMusic();
    }
  }

  // Eventos del menu principal
  onStartGame() {
    this.tryStartMusic();
    this.playSound('START_GAME');
    this.stopMenuMusic();
    setTimeout(() => {
      this.startGame.emit();
    }, 300);
  }

  onShowInstructions() {
    this.tryStartMusic();
    this.tryStartMusic();
    this.playSound('BUTTON_CLICK');
    this.showInstructions.emit();
  }

  onBackToMenu() {
    this.tryStartMusic();
    this.playSound('BUTTON_CLICK');
    this.backToMenu.emit();
  }

  onButtonHover() {
    this.tryStartMusic();
    this.playSound('BUTTON_HOVER');
  }

  // Eventos de modales
  openLeaderboard() {
    this.tryStartMusic();
    this.playSound('BUTTON_CLICK');
    this.showLeaderboard = true;
  }

  closeLeaderboard() {
    this.showLeaderboard = false;
  }

  openStats() {
    this.tryStartMusic();
    this.playSound('BUTTON_CLICK');
    this.showStats = true;
  }

  closeStats() {
    this.showStats = false;
  }

  openAchievements() {
    this.tryStartMusic();
    this.playSound('BUTTON_CLICK');
    this.showAchievements = true;
  }

  closeAchievements() {
    this.showAchievements = false;
  }

  openSettings() {
    this.tryStartMusic();
    this.playSound('BUTTON_CLICK');
    this.showSettings = true;
  }

  closeSettings() {
    this.showSettings = false;
  }

  onSettingsChanged() {
    this.updateVolumes();
  }

  closeTutorial() {
    this.showTutorial = false;
    this.settingsService.completeTutorial();
  }

  skipTutorial() {
    this.showTutorial = false;
    this.settingsService.completeTutorial();
  }
}
