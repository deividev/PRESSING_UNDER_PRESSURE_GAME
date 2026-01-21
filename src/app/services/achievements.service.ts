import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { PlayerStatsService } from './player-stats.service';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji o clase de icono
  unlocked: boolean;
  unlockedDate: Date | null;
  progress: number; // 0-100
  requirement: number;
}

/**
 * Servicio para gestionar logros del juego
 */
@Injectable({
  providedIn: 'root'
})
export class AchievementsService {
  private readonly ACHIEVEMENTS_KEY = 'achievements';
  private achievements: Achievement[] = [];

  constructor(
    private storage: StorageService,
    private statsService: PlayerStatsService
  ) {
    this.initializeAchievements();
  }

  /**
   * Define todos los logros del juego
   */
  private initializeAchievements(): void {
    const defaultAchievements: Achievement[] = [
      // Achievement progression
      {
        id: 'firstSteps',
        name: 'First Steps', // Will be translated
        description: 'Complete your first game',
        icon: '🎯',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 1
      },
      {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Play 10 games',
        icon: '🎮',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 10
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Play 50 games',
        icon: '🏅',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 50
      },

      // Score achievements
      {
        id: 'centurion',
        name: 'Centurion',
        description: 'Reach 100 points in one game',
        icon: '💯',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 100
      },
      {
        id: 'champion',
        name: 'Champion',
        description: 'Reach 500 points in one game',
        icon: '⭐',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 500
      },
      {
        id: 'legend',
        name: 'Legend',
        description: 'Reach 1000 points in one game',
        icon: '👑',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 1000
      },

      // Accuracy achievements
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete a game with 100% accuracy',
        icon: '✨',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 100
      },
      {
        id: 'sharpshooter',
        name: 'Sharpshooter',
        description: 'Maintain 95% accuracy in 10 games',
        icon: '🎖️',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 10
      },

      // Streak achievements
      {
        id: 'comboMaster',
        name: 'Combo Master',
        description: 'Achieve a streak of 10',
        icon: '🔥',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 10
      },
      {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Achieve a streak of 25',
        icon: '⚡',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 25
      },

      // Speed achievements
      {
        id: 'speedDemon',
        name: 'Speed Demon',
        description: 'Average reaction time under 300ms',
        icon: '🚀',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 300
      },
      {
        id: 'lightning',
        name: 'Lightning',
        description: 'Average reaction time under 200ms',
        icon: '⚡',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 200
      },

      // Endurance achievements
      {
        id: 'marathon',
        name: 'Marathon',
        description: 'Complete 30 rounds in one game',
        icon: '🏃',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 30
      },
      {
        id: 'ironWill',
        name: 'Iron Will',
        description: 'Complete 50 rounds in one game',
        icon: '💪',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 50
      },

      // Special achievements
      {
        id: 'nightOwl',
        name: 'Night Owl',
        description: 'Play 5 games between 12 AM and 6 AM',
        icon: '🦉',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 5
      },
      {
        id: 'collector',
        name: 'Collector',
        description: 'Unlock all achievements',
        icon: '🏆',
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        requirement: 15 // Total achievements minus this one
      }
    ];

    // Cargar logros guardados o usar por defecto
    const saved = this.storage.get<Achievement[]>(this.ACHIEVEMENTS_KEY, undefined);
    if (!saved || saved.length === 0) {
      this.achievements = defaultAchievements;
      this.storage.set(this.ACHIEVEMENTS_KEY, this.achievements);
    } else {
      // Merge saved with defaults (en caso de nuevos logros)
      this.achievements = defaultAchievements.map(defaultAch => {
        const savedAch = saved.find(s => s.id === defaultAch.id);
        return savedAch || defaultAch;
      });
    }
  }

  /**
   * Obtiene todos los logros
   */
  getAchievements(): Achievement[] {
    return this.achievements;
  }

  /**
   * Obtiene logros desbloqueados
   */
  getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(a => a.unlocked);
  }

  /**
   * Obtiene logros bloqueados
   */
  getLockedAchievements(): Achievement[] {
    return this.achievements.filter(a => !a.unlocked);
  }

  /**
   * Verifica y desbloquea logros basados en la última partida
   */
  checkAchievements(score: number, rounds: number, accuracy: number, streak: number, avgReactionTime: number): Achievement[] {
    const stats = this.statsService.getStats();
    const newUnlocks: Achievement[] = [];

    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let shouldUnlock = false;
      let progress = 0;

      switch (achievement.id) {
        case 'first_win':
          shouldUnlock = stats.totalGames >= 1;
          progress = Math.min(100, stats.totalGames * 100);
          break;

        case 'score_100':
          shouldUnlock = score >= 100;
          progress = Math.min(100, (score / 100) * 100);
          break;

        case 'score_500':
          shouldUnlock = score >= 500;
          progress = Math.min(100, (score / 500) * 100);
          break;

        case 'score_1000':
          shouldUnlock = score >= 1000;
          progress = Math.min(100, (score / 1000) * 100);
          break;

        case 'streak_5':
          shouldUnlock = streak >= 5;
          progress = Math.min(100, (streak / 5) * 100);
          break;

        case 'streak_10':
          shouldUnlock = streak >= 10;
          progress = Math.min(100, (streak / 10) * 100);
          break;

        case 'streak_20':
          shouldUnlock = streak >= 20;
          progress = Math.min(100, (streak / 20) * 100);
          break;

        case 'perfect_game':
          shouldUnlock = accuracy === 100 && rounds > 0;
          progress = accuracy;
          break;

        case 'accuracy_90':
          shouldUnlock = accuracy >= 90;
          progress = Math.min(100, (accuracy / 90) * 100);
          break;

        case 'speed_demon':
          shouldUnlock = avgReactionTime < 500 && avgReactionTime > 0;
          progress = avgReactionTime > 0 ? Math.min(100, ((500 - avgReactionTime) / 500) * 100) : 0;
          break;

        case 'lightning_fast':
          shouldUnlock = avgReactionTime < 300 && avgReactionTime > 0;
          progress = avgReactionTime > 0 ? Math.min(100, ((300 - avgReactionTime) / 300) * 100) : 0;
          break;

        case 'games_10':
          shouldUnlock = stats.totalGames >= 10;
          progress = Math.min(100, (stats.totalGames / 10) * 100);
          break;

        case 'games_50':
          shouldUnlock = stats.totalGames >= 50;
          progress = Math.min(100, (stats.totalGames / 50) * 100);
          break;

        case 'games_100':
          shouldUnlock = stats.totalGames >= 100;
          progress = Math.min(100, (stats.totalGames / 100) * 100);
          break;

        case 'round_30':
          shouldUnlock = rounds >= 30;
          progress = Math.min(100, (rounds / 30) * 100);
          break;

        case 'round_50':
          shouldUnlock = rounds >= 50;
          progress = Math.min(100, (rounds / 50) * 100);
          break;
      }

      achievement.progress = Math.round(progress);

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedDate = new Date();
        achievement.progress = 100;
        newUnlocks.push(achievement);
      }
    });

    if (newUnlocks.length > 0) {
      this.storage.set(this.ACHIEVEMENTS_KEY, this.achievements);
    }

    return newUnlocks;
  }

  /**
   * Resetea todos los logros
   */
  resetAchievements(): void {
    this.achievements.forEach(a => {
      a.unlocked = false;
      a.unlockedDate = null;
      a.progress = 0;
    });
    this.storage.set(this.ACHIEVEMENTS_KEY, this.achievements);
  }
}
