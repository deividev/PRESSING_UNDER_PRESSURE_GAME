import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from "@angular/core";
import { Challenge, GAME_CHALLENGES, calculateChallengeTime } from "./game-challenges";
import { PlayerStatsService, GameSession } from "../../services/player-stats.service";
import { AchievementsService, Achievement } from "../../services/achievements.service";
import { SettingsService } from "../../services/settings.service";
import { TranslationService } from "../../services/translation.service";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface BackgroundParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  isPixel: boolean;
}

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit, OnDestroy {
  @Output() backToMenu = new EventEmitter<void>();

  score: number = 0;
  round: number = 1;
  currentChallenge: Challenge | null = null;
  timerInterval: any;
  redPresses: number = 0;
  bluePresses: number = 0;
  gameActive: boolean = false;
  totalSegments: number = 40;
  segments: any[] = [];
  gameOverVisible: boolean = false;
  gameOverReason: string = "";

  // Efectos visuales
  particles: Particle[] = [];
  backgroundParticles: BackgroundParticle[] = [];
  isShaking: boolean = false;
  isGlitching: boolean = false;
  showGameOverAnimation: boolean = false;
  screenFlash: string = "";
  showSparks: boolean = false;
  showChromaticAberration: boolean = false;
  private backgroundParticleInterval: any;

  // Sistema de Estadísticas
  private gameStartTime: number = 0;
  private totalReactionTimes: number[] = [];
  private longestStreak: number = 0;
  private currentStreak: number = 0;
  private correctAnswers: number = 0;
  private incorrectAnswers: number = 0;
  private roundStartTime: number = 0;
  newAchievements: Achievement[] = [];
  showAchievementNotification: boolean = false;

  // Sistema de Audio
  private audioContext: Map<string, HTMLAudioElement> = new Map();
  private backgroundMusic: HTMLAudioElement | null = null;
  private lastWarningPlayed: string = "";
  private musicStarted: boolean = false;

  private readonly SOUNDS = {
    BACKGROUND_MUSIC: "assets/sounds/background-music.mp3",
    BUTTON_RED: "assets/sounds/button-red-press.mp3",
    BUTTON_BLUE: "assets/sounds/button-blue-press.mp3",
    ROUND_START: "assets/sounds/round-start.mp3",
    ROUND_SUCCESS: "assets/sounds/round-success.mp3",
    ROUND_FAIL: "assets/sounds/round-fail.mp3",
    TIMER_WARNING: "assets/sounds/timer-warning.mp3",
    TIMER_DANGER: "assets/sounds/timer-danger.mp3",
    TIMER_CRITICAL: "assets/sounds/timer-critical.mp3",
    GAME_OVER_EXPLOSION: "assets/sounds/game-over-explosion.mp3",
    GAME_OVER_GLITCH: "assets/sounds/game-over-glitch.mp3",
    PARTICLE_BURST: "assets/sounds/particle-burst.mp3",
    SCREEN_SHAKE: "assets/sounds/screen-shake.mp3",
  };

  // Desafíos del juego importados desde archivo separado
  private challenges: Challenge[] = GAME_CHALLENGES;

  constructor(
    private statsService: PlayerStatsService,
    private achievementsService: AchievementsService,
    private settingsService: SettingsService,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.initAudio();
    this.initGame();
    this.initBackgroundParticles();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.backgroundParticleInterval) {
      clearInterval(this.backgroundParticleInterval);
    }
    this.stopAllSounds();
  }

  // Sistema de Audio
  initAudio() {
    // Precargar sonidos de efectos
    Object.entries(this.SOUNDS).forEach(([key, path]) => {
      if (key !== "BACKGROUND_MUSIC") {
        const audio = new Audio(path);
        audio.volume = this.getVolumeForSound(key);
        audio.preload = "auto";
        this.audioContext.set(key, audio);
      }
    });

    // Configurar música de fondo
    this.backgroundMusic = new Audio(this.SOUNDS.BACKGROUND_MUSIC);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
    this.backgroundMusic.preload = "auto";
  }

  getVolumeForSound(key: string): number {
    if (key.includes("BUTTON")) return 0.5;
    if (key.includes("GAME_OVER")) return 0.8;
    if (key.includes("TIMER")) return 0.6;
    return 0.6;
  }

  playSound(soundKey: string) {
    const audio = this.audioContext.get(soundKey);
    if (audio) {
      // Clonar el audio para permitir reproducción simultánea
      const clone = audio.cloneNode(true) as HTMLAudioElement;
      clone.volume = audio.volume;
      clone.play().catch((err) => console.warn("Error playing sound:", err));
    }
  }

  playBackgroundMusic() {
    if (this.backgroundMusic && this.backgroundMusic.paused) {
      this.backgroundMusic
        .play()
        .then(() => {
          this.musicStarted = true;
          console.log('Música de fondo iniciada correctamente');
        })
        .catch((err) => {
          console.warn("Error al reproducir música de fondo:", err);
          console.log("La música se iniciará con la primera interacción del usuario");
        });
    }
    this.musicStarted = false;
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  stopAllSounds() {
    this.stopBackgroundMusic();
    this.audioContext.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }

  // Sistema de partículas de fondo
  initBackgroundParticles() {
    // Crear partículas iniciales
    for (let i = 0; i < 50; i++) {
      this.backgroundParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() < 0.7 ? 1 : 2,
        opacity: 0.1 + Math.random() * 0.3,
        isPixel: Math.random() > 0.5,
      });
    }

    // Animar partículas de fondo
    this.backgroundParticleInterval = setInterval(() => {
      this.backgroundParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        if (Math.random() < 0.01) {
          p.opacity = 0.1 + Math.random() * 0.3;
        }
      });
    }, 50);
  }

  // Sistema de partículas
  createParticles(x: number, y: number, color: string, count: number = 20) {
    this.playSound("PARTICLE_BURST");
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
        size: 3 + Math.random() * 4,
      });
    }
    this.animateParticles();
  }

  animateParticles() {
    const animate = () => {
      this.particles = this.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.02;
        return p.life > 0;
      });

      if (this.particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  triggerShake() {
    this.playSound("SCREEN_SHAKE");
    this.isShaking = true;
    setTimeout(() => {
      this.isShaking = false;
    }, 500);
  }

  triggerGlitch(duration: number = 300) {
    this.isGlitching = true;
    setTimeout(() => {
      this.isGlitching = false;
    }, duration);
  }

  triggerFlash(color: string) {
    this.screenFlash = color;
    setTimeout(() => {
      this.screenFlash = "";
    }, 150);
  }

  initGame() {
    this.score = 0;
    this.round = 1;
    this.currentChallenge = null;
    this.gameActive = true;
    this.gameOverVisible = false;
    this.createTimerSegments();
    this.playBackgroundMusic();

    // Reset estadísticas
    this.gameStartTime = Date.now();
    this.totalReactionTimes = [];
    this.longestStreak = 0;
    this.currentStreak = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.newAchievements = [];

    setTimeout(() => {
      this.startNewRound();
    }, 1000);
  }

  createTimerSegments() {
    this.segments = [];
    const segmentsPerSide = Math.floor(this.totalSegments / 4);

    for (let i = 0; i < this.totalSegments; i++) {
      const side = Math.floor(i / segmentsPerSide);
      const indexInSide = i % segmentsPerSide;

      let style: any = {};

      if (side === 0) {
        style.left = `calc(${(indexInSide / segmentsPerSide) * 100}%)`;
        style.top = "0";
        style.width = "26px";
        style.height = "38px";
      } else if (side === 1) {
        style.right = "0";
        style.top = `calc(${(indexInSide / segmentsPerSide) * 100}%)`;
        style.width = "38px";
        style.height = "26px";
      } else if (side === 2) {
        style.right = `calc(${(indexInSide / segmentsPerSide) * 100}%)`;
        style.bottom = "0";
        style.width = "26px";
        style.height = "38px";
      } else {
        style.left = "0";
        style.bottom = `calc(${(indexInSide / segmentsPerSide) * 100}%)`;
        style.width = "38px";
        style.height = "26px";
      }

      this.segments.push({
        active: true,
        warning: false,
        danger: false,
        style: style,
      });
    }
  }

  startNewRound() {
    if (!this.gameActive) return;

    this.redPresses = 0;
    this.bluePresses = 0;
    this.lastWarningPlayed = "";
    this.roundStartTime = Date.now(); // Para medir tiempo de reacción

    // Selección aleatoria de desafío
    this.currentChallenge =
      this.challenges[Math.floor(Math.random() * this.challenges.length)];

    // Cálculo dinámico de tiempo basado en dificultad y ronda, ajustado por settings
    const baseTime = calculateChallengeTime(this.currentChallenge.difficulty, this.round);
    const difficultyModifier = this.settingsService.getDifficultyModifier();
    const finalTime = Math.round(baseTime * difficultyModifier);

    this.playSound("ROUND_START");

    this.startTimer(finalTime);
  }

  startTimer(duration: number) {
    let timeLeft = duration;
    const startTime = Date.now();

    this.showChromaticAberration = false;

    this.segments.forEach((segment) => {
      segment.active = true;
      segment.warning = false;
      segment.danger = false;
    });

    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      timeLeft = duration - elapsed;

      const percentage = timeLeft / duration;
      const activeSegments = Math.ceil(percentage * this.totalSegments);

      this.showChromaticAberration = percentage < 0.12;

      this.segments.forEach((segment, index) => {
        if (index < activeSegments) {
          segment.active = true;

          if (percentage > 0.5) {
            segment.warning = false;
            segment.danger = false;
          } else if (percentage > 0.25) {
            segment.warning = true;
            segment.danger = false;
            if (this.lastWarningPlayed !== "WARNING") {
              this.playSound("TIMER_WARNING");
              this.lastWarningPlayed = "WARNING";
            }
          } else {
            segment.warning = false;
            segment.danger = true;
            if (this.lastWarningPlayed !== "DANGER") {
              this.playSound("TIMER_DANGER");
              this.lastWarningPlayed = "DANGER";
            }
          }
        } else {
          segment.active = false;
          segment.warning = false;
          segment.danger = false;
        }
      });

      if (
        this.showChromaticAberration &&
        this.lastWarningPlayed !== "CRITICAL"
      ) {
        this.playSound("TIMER_CRITICAL");
        this.lastWarningPlayed = "CRITICAL";
      }

      if (timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.showChromaticAberration = false;
        this.checkAnswer();
      }
    }, 50);
  }

  checkAnswer() {
    if (!this.gameActive) return;

    clearInterval(this.timerInterval);
    this.gameActive = false;

    // Calcular tiempo de reacción
    const reactionTime = Date.now() - this.roundStartTime;
    this.totalReactionTimes.push(reactionTime);

    if (this.currentChallenge && this.currentChallenge.check(this.redPresses, this.bluePresses)) {
      // Respuesta correcta
      this.correctAnswers++;
      this.currentStreak++;
      
      if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
      }

      this.score += 10 * this.round;
      this.round++;

      this.playSound("ROUND_SUCCESS");
      this.triggerFlash("success");

      setTimeout(() => {
        this.gameActive = true;
        this.startNewRound();
      }, 300);
    } else {
      // Respuesta incorrecta
      this.incorrectAnswers++;
      this.currentStreak = 0;
      
      this.playSound("ROUND_FAIL");
      this.triggerShake();
      this.triggerGlitch(500);
      this.endGame("¡Respuesta incorrecta!");
    }
  }

  endGame(reason: string) {
    this.gameActive = false;
    clearInterval(this.timerInterval);
    this.gameOverReason = reason;

    // Guardar estadísticas de la partida
    this.saveGameSession();

    this.stopBackgroundMusic();

    this.showGameOverAnimation = true;
    this.showSparks = true;

    this.playSound("GAME_OVER_EXPLOSION");
    setTimeout(() => {
      this.triggerGlitch(800);
      this.playSound("GAME_OVER_GLITCH");
    }, 100);
    setTimeout(() => this.triggerFlash("error"), 300);
    setTimeout(() => this.triggerGlitch(600), 600);
    setTimeout(() => {
      this.showSparks = false;
    }, 1500);

    setTimeout(() => {
      this.showGameOverAnimation = false;
      this.gameOverVisible = true;
    // Intentar reproducir música de fondo si aún no ha comenzado
    if (!this.musicStarted && this.gameActive) {
      this.playBackgroundMusic();
    }

    }, 2000);
  }

  onRedButtonClick(event?: MouseEvent) {
    if (!this.gameActive) return;
    this.redPresses++;
// Intentar reproducir música de fondo si aún no ha comenzado
    if (!this.musicStarted && this.gameActive) {
      this.playBackgroundMusic();
    }

    
    this.playSound("BUTTON_RED");

    if (event) {
      this.createParticles(event.clientX, event.clientY, "#ff3333", 15);
    }
  }

  onBlueButtonClick(event?: MouseEvent) {
    if (!this.gameActive) return;
    this.bluePresses++;

    this.playSound("BUTTON_BLUE");

    if (event) {
      this.createParticles(event.clientX, event.clientY, "#3388ff", 15);
    }
  }

  restartGame() {
    this.gameOverVisible = false;
    this.showGameOverAnimation = false;
    this.particles = [];
    this.initGame();
  }

  goToMenu() {
    this.backToMenu.emit();
  }

  get formattedScore(): string {
    return this.score.toString().padStart(4, "0");
  }

  get formattedRound(): string {
    return this.round.toString().padStart(2, "0");
  }

  /**
   * Guarda la sesión de juego y verifica logros
   */
  private saveGameSession(): void {
    const gameDuration = Math.floor((Date.now() - this.gameStartTime) / 1000);
    const totalRounds = this.correctAnswers + this.incorrectAnswers;
    const accuracy = totalRounds > 0 ? (this.correctAnswers / totalRounds) * 100 : 0;
    const avgReactionTime = this.totalReactionTimes.length > 0 
      ? this.totalReactionTimes.reduce((a, b) => a + b, 0) / this.totalReactionTimes.length 
      : 0;

    const session: GameSession = {
      score: this.score,
      rounds: totalRounds,
      accuracy: Math.round(accuracy * 10) / 10,
      averageReactionTime: Math.round(avgReactionTime),
      longestStreak: this.longestStreak,
      date: new Date(),
      duration: gameDuration
    };

    // Guardar sesión
    this.statsService.saveGameSession(session);

    // Verificar logros
    this.newAchievements = this.achievementsService.checkAchievements(
      this.score,
      totalRounds,
      accuracy,
      this.longestStreak,
      avgReactionTime
    );

    // Mostrar notificación de logros si hay nuevos
    if (this.newAchievements.length > 0) {
      setTimeout(() => {
        this.showAchievementNotification = true;
        setTimeout(() => {
          this.showAchievementNotification = false;
        }, 5000);
      }, 3000);
    }
  }
}
