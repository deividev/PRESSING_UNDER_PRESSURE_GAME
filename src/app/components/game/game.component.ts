import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from "@angular/core";
import {
  Challenge,
  GAME_CHALLENGES,
  calculateChallengeTime,
} from "./game-challenges";
import {
  PlayerStatsService,
  GameSession,
} from "../../services/player-stats.service";
import {
  AchievementsService,
  Achievement,
} from "../../services/achievements.service";
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
  @Output() showVictory = new EventEmitter<{
    finalRound: number;
    finalScore: number;
  }>();

  score: number = 0;
  round: number = 1;
  currentChallenge: Challenge | null = null;
  timerInterval: any;
  redPresses: number = 0;
  bluePresses: number = 0;
  gameActive: boolean = false;
  totalSegments: number = 0;
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

  // MEJORA 5: Efectos visuales mejorados
  showZoomPulse: boolean = false;
  showWaveDistortion: boolean = false;
  showErrorFeedback: boolean = false;
  showVictoryFeedback: boolean = false;

  // MEJORA 4: Sistema técnico/grid
  techCoords = { x: 0, y: 0 };
  hexCode1: string = "0x0000";
  hexCode2: string = "0x0000";
  hexCode3: string = "0x0000";
  systemTemp: number = 45;
  private techUpdateInterval: any;

  // MEJORA 3: Typing effect
  displayedInstruction: string = "";
  private typingInterval: any;
  isTyping: boolean = false;

  // Timer circular mejorado
  remainingSeconds: number = 0;
  timerPercentage: number = 1;
  private lastActiveSegment: number = -1;

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
  private recentChallenges: Challenge[] = []; // Historial de desafíos recientes

  constructor(
    private statsService: PlayerStatsService,
    private achievementsService: AchievementsService,
    private settingsService: SettingsService,
    public translationService: TranslationService,
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
    if (this.techUpdateInterval) {
      clearInterval(this.techUpdateInterval);
    }
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
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
          console.log("Música de fondo iniciada correctamente");
        })
        .catch((err) => {
          console.warn("Error al reproducir música de fondo:", err);
          console.log(
            "La música se iniciará con la primera interacción del usuario",
          );
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
    this.showGameOverAnimation = false;
    this.showSparks = false;
    this.isShaking = false;
    this.isGlitching = false;
    this.showChromaticAberration = false;
    this.showZoomPulse = false;
    this.showWaveDistortion = false;
    this.showErrorFeedback = false;
    this.showVictoryFeedback = false;
    this.redPresses = 0;
    this.bluePresses = 0;
    this.lastWarningPlayed = "";
    this.screenFlash = "";
    this.recentChallenges = []; // Limpiar historial de desafíos

    // Limpiar partículas y efectos visuales
    this.particles = [];

    // Limpiar intervalos de efectos
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    // Mostrar texto de inicialización
    this.displayedInstruction = "";
    this.isTyping = false;

    // Inicializar timer con un valor por defecto (se actualizará al iniciar ronda)
    this.createTimerSegments(5000);
    this.playBackgroundMusic();

    // Reset estadísticas
    this.gameStartTime = Date.now();
    this.totalReactionTimes = [];
    this.longestStreak = 0;
    this.currentStreak = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.newAchievements = [];

    // MEJORA 4: Iniciar sistema técnico
    this.startTechnicalSystem();

    // Esperar 1.5 segundos para mostrar "SYSTEM INITIALIZING..." antes del primer desafío
    setTimeout(() => {
      this.startNewRound();
    }, 1500);
  }

  createTimerSegments(duration: number) {
    this.segments = [];
    // Crear aproximadamente 1 segmento cada 100ms para que el timer sea fluido
    // Mínimo 20 segmentos, máximo 80 segmentos
    this.totalSegments = Math.min(80, Math.max(20, Math.floor(duration / 100)));

    for (let i = 0; i < this.totalSegments; i++) {
      this.segments.push({
        active: true,
        warning: false,
        danger: false,
      });
    }
  }

  startNewRound() {
    if (!this.gameActive) return;

    // Reset de contadores
    this.redPresses = 0;
    this.bluePresses = 0;
    this.lastWarningPlayed = "";
    this.roundStartTime = Date.now();

    // Limpiar efectos visuales de la ronda anterior
    this.showChromaticAberration = false;
    this.isShaking = false;
    this.isGlitching = false;
    this.showZoomPulse = false;
    this.showWaveDistortion = false;
    this.screenFlash = "";

    // Calcular dificultad máxima permitida según la ronda (aumenta cada 10 rondas)
    // Rondas 1-10: dificultad 1
    // Rondas 11-20: dificultad 2
    // Rondas 21-30: dificultad 3
    // Rondas 31-40: dificultad 4
    // Rondas 41+: dificultad 5
    const maxDifficulty = Math.min(5, Math.ceil(this.round / 10));

    // Selección aleatoria de desafío evitando repeticiones y respetando dificultad progresiva
    let availableChallenges = this.challenges.filter(
      (challenge) =>
        !this.recentChallenges.includes(challenge) &&
        challenge.difficulty <= maxDifficulty,
    );

    // Si no hay desafíos disponibles con estas restricciones, relajar las reglas
    if (availableChallenges.length === 0) {
      // Primero intentar sin historial pero respetando dificultad
      availableChallenges = this.challenges.filter(
        (challenge) => challenge.difficulty <= maxDifficulty,
      );

      // Si aún no hay suficientes, limpiar historial y permitir cualquier dificultad
      if (availableChallenges.length === 0) {
        this.recentChallenges = [];
        availableChallenges = this.challenges;
      } else {
        // Limpiar historial para la próxima vez
        this.recentChallenges = [];
      }
    }

    this.currentChallenge =
      availableChallenges[
        Math.floor(Math.random() * availableChallenges.length)
      ];

    // Agregar al historial y mantener solo los últimos 5
    this.recentChallenges.push(this.currentChallenge);
    if (this.recentChallenges.length > 5) {
      this.recentChallenges.shift();
    }

    // Cálculo dinámico de tiempo basado en dificultad y ronda, ajustado por settings
    const baseTime = calculateChallengeTime(
      this.currentChallenge.difficulty,
      this.round,
    );
    const difficultyModifier = this.settingsService.getDifficultyModifier();
    const finalTime = Math.round(baseTime * difficultyModifier);

    // MEJORA 3: Efecto de glitch y typing al cambiar desafío
    this.glitchText();
    setTimeout(() => {
      if (this.currentChallenge) {
        this.typeText(this.currentChallenge.text, 25);
      }
    }, 300);

    this.playSound("ROUND_START");

    // Crear segmentos del timer basados en la duración
    this.createTimerSegments(finalTime);
    this.startTimer(finalTime);
  }

  startTimer(duration: number) {
    // Limpiar timer existente si hay uno
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    let timeLeft = duration;
    const startTime = Date.now();

    this.showChromaticAberration = false;
    this.lastActiveSegment = this.totalSegments;

    this.segments.forEach((segment) => {
      segment.active = true;
      segment.warning = false;
      segment.danger = false;
      segment.trail = false;
      segment.spark = false;
    });

    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      timeLeft = duration - elapsed;

      // Actualizar segundos restantes y porcentaje
      this.remainingSeconds = Math.ceil(timeLeft / 1000);
      this.timerPercentage = timeLeft / duration;

      const percentage = timeLeft / duration;
      const activeSegments = Math.ceil(percentage * this.totalSegments);

      this.showChromaticAberration = percentage < 0.12;

      // Detectar cuando un segmento se apaga para efectos
      if (activeSegments < this.lastActiveSegment) {
        // Activar trail en el segmento que se acaba de apagar
        if (this.segments[activeSegments]) {
          this.segments[activeSegments].trail = true;
          this.segments[activeSegments].spark = true;

          // Desactivar trail después de la animación
          setTimeout(() => {
            if (this.segments[activeSegments]) {
              this.segments[activeSegments].trail = false;
            }
          }, 400);

          // Desactivar spark después de la animación
          setTimeout(() => {
            if (this.segments[activeSegments]) {
              this.segments[activeSegments].spark = false;
            }
          }, 200);
        }
        this.lastActiveSegment = activeSegments;
      }

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
        this.timerInterval = null;
        this.showChromaticAberration = false;
        this.checkAnswer();
      }
    }, 50);
  }

  checkAnswer() {
    if (!this.gameActive) return;

    // Prevenir ejecuciones múltiples
    this.gameActive = false;
    clearInterval(this.timerInterval);

    // Calcular tiempo de reacción
    const reactionTime = Date.now() - this.roundStartTime;
    this.totalReactionTimes.push(reactionTime);

    if (
      this.currentChallenge &&
      this.currentChallenge.check(this.redPresses, this.bluePresses)
    ) {
      // Respuesta correcta
      this.correctAnswers++;
      this.currentStreak++;

      if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
      }

      this.score += 10 * this.round;

      const completedRounds = this.round; // Guardar rondas completadas antes de incrementar
      this.round++;

      this.playSound("ROUND_SUCCESS");
      this.triggerFlash("success");

      // MEJORA 5: Efectos visuales mejorados en acierto
      this.triggerZoomPulse();
      this.createEnhancedParticles(
        window.innerWidth / 2,
        window.innerHeight / 2,
        20,
        "#00ff88",
      );

      // Verificar victoria después de 50 rondas completadas
      if (completedRounds >= 50) {
        this.triggerVictoryGame();
        return;
      }

      setTimeout(() => {
        this.gameActive = true;
        this.startNewRound();
      }, 300);
    } else {
      // Respuesta incorrecta
      this.incorrectAnswers++;
      this.currentStreak = 0;

      this.playSound("ROUND_FAIL");

      // MEJORA: Feedback visual en rojo cuando fallas
      this.triggerErrorFeedback();
      this.triggerShake();
      this.triggerGlitch(500);

      // MEJORA 5: Efectos visuales mejorados en error
      this.triggerWaveDistortion();
      this.createEnhancedParticles(
        window.innerWidth / 2,
        window.innerHeight / 2,
        30,
        "#ff3333",
      );

      // MEJORA 4: Aumentar temperatura del sistema
      this.increaseSystemTemp(15);

      this.endGame(this.translationService.translate("game.wrongAnswer"));
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
    // Limpiar estado visual completamente
    this.gameOverVisible = false;
    this.showGameOverAnimation = false;
    this.showSparks = false;
    this.particles = [];
    this.isShaking = false;
    this.isGlitching = false;
    this.showChromaticAberration = false;
    this.showZoomPulse = false;
    this.showWaveDistortion = false;
    this.showErrorFeedback = false;
    this.showVictoryFeedback = false;
    this.screenFlash = "";
    this.recentChallenges = []; // Limpiar historial de desafíos

    // Iniciar juego limpio
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
    const accuracy =
      totalRounds > 0 ? (this.correctAnswers / totalRounds) * 100 : 0;
    const avgReactionTime =
      this.totalReactionTimes.length > 0
        ? this.totalReactionTimes.reduce((a, b) => a + b, 0) /
          this.totalReactionTimes.length
        : 0;

    const session: GameSession = {
      score: this.score,
      rounds: totalRounds,
      accuracy: Math.round(accuracy * 10) / 10,
      averageReactionTime: Math.round(avgReactionTime),
      longestStreak: this.longestStreak,
      date: new Date(),
      duration: gameDuration,
    };

    // Guardar sesión
    this.statsService.saveGameSession(session);

    // Verificar logros
    this.newAchievements = this.achievementsService.checkAchievements(
      this.score,
      totalRounds,
      accuracy,
      this.longestStreak,
      avgReactionTime,
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

  // ========================================
  // MEJORA 3: Sistema de Typing Effect
  // ========================================
  typeText(text: string, speed: number = 30) {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }

    this.displayedInstruction = "";
    this.isTyping = true;
    let index = 0;

    this.typingInterval = setInterval(() => {
      if (index < text.length) {
        this.displayedInstruction += text[index];
        index++;

        // Efecto de sonido aleatorio para tecleo (opcional)
        if (Math.random() > 0.7) {
          // Sonido sutil de typing
        }
      } else {
        clearInterval(this.typingInterval);
        this.isTyping = false;
      }
    }, speed);
  }

  // Efecto de glitch al cambiar texto
  glitchText() {
    this.isGlitching = true;
    setTimeout(() => {
      this.isGlitching = false;
    }, 300);
  }

  // ========================================
  // MEJORA 4: Sistema Técnico/Grid
  // ========================================
  startTechnicalSystem() {
    // Actualizar coordenadas y códigos hex
    this.techUpdateInterval = setInterval(() => {
      this.techCoords.x = Math.floor(Math.random() * 9999);
      this.techCoords.y = Math.floor(Math.random() * 9999);
      this.hexCode1 =
        "0x" +
        Math.floor(Math.random() * 0xffff)
          .toString(16)
          .toUpperCase()
          .padStart(4, "0");
      this.hexCode2 =
        "0x" +
        Math.floor(Math.random() * 0xffff)
          .toString(16)
          .toUpperCase()
          .padStart(4, "0");
      this.hexCode3 =
        "0x" +
        Math.floor(Math.random() * 0xffff)
          .toString(16)
          .toUpperCase()
          .padStart(4, "0");

      // Temperatura aumenta con errores, disminuye con aciertos
      if (this.systemTemp > 45) {
        this.systemTemp = Math.max(45, this.systemTemp - 1);
      }
    }, 100);
  }

  increaseSystemTemp(amount: number = 5) {
    this.systemTemp = Math.min(100, this.systemTemp + amount);
  }

  // ========================================
  // MEJORA 5: Feedback Visual Mejorado
  // ========================================
  triggerZoomPulse() {
    this.showZoomPulse = true;
    setTimeout(() => {
      this.showZoomPulse = false;
    }, 300);
  }

  triggerWaveDistortion() {
    this.showWaveDistortion = true;
    setTimeout(() => {
      this.showWaveDistortion = false;
    }, 600);
  }

  triggerErrorFeedback() {
    this.showErrorFeedback = true;
    setTimeout(() => {
      this.showErrorFeedback = false;
    }, 500);
  }

  triggerVictoryFeedback() {
    // Celebración visual espectacular
    this.showVictoryFeedback = true;

    // Crear múltiples explosiones de partículas doradas
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createEnhancedParticles(
          window.innerWidth / 2,
          window.innerHeight / 2,
          40,
          i % 2 === 0 ? "#FFD700" : "#00ff88",
        );
      }, i * 100);
    }

    // Efectos visuales combinados
    this.triggerZoomPulse();
    setTimeout(() => this.triggerZoomPulse(), 200);
    setTimeout(() => this.triggerZoomPulse(), 400);

    // Sonido de éxito (usar round success múltiples veces)
    this.playSound("ROUND_SUCCESS");
    setTimeout(() => this.playSound("ROUND_SUCCESS"), 150);

    setTimeout(() => {
      this.showVictoryFeedback = false;
    }, 1500);
  }

  triggerVictoryGame() {
    this.gameActive = false;
    clearInterval(this.timerInterval);

    // Guardar estadísticas
    this.saveGameSession();

    // Animación de victoria espectacular
    this.triggerVictoryFeedback();

    // Crear explosiones masivas de partículas
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const x = window.innerWidth / 2 + (Math.random() - 0.5) * 400;
        const y = window.innerHeight / 2 + (Math.random() - 0.5) * 300;
        this.createEnhancedParticles(
          x,
          y,
          30,
          i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#00ff88" : "#3388ff",
        );
      }, i * 150);
    }

    // Sonidos de celebración
    this.playSound("ROUND_SUCCESS");
    setTimeout(() => this.playSound("ROUND_SUCCESS"), 200);
    setTimeout(() => this.playSound("ROUND_SUCCESS"), 400);
    setTimeout(() => this.playSound("ROUND_SUCCESS"), 600);

    // Emitir evento de victoria después de las animaciones
    setTimeout(() => {
      this.showVictory.emit({
        finalRound: this.round - 1, // Restar 1 porque ya incrementamos
        finalScore: this.score,
      });
    }, 2000);
  }

  // Crear partículas más grandes y coloridas
  createEnhancedParticles(x: number, y: number, count: number, color: string) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 3 + Math.random() * 4;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: color,
        size: 8 + Math.random() * 12, // Partículas más grandes
      });
    }
  }
}
