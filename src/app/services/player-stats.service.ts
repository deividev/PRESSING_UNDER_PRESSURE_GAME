import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

export interface GameSession {
  score: number;
  rounds: number;
  accuracy: number;
  averageReactionTime: number;
  longestStreak: number;
  date: Date;
  duration: number; // en segundos
}

export interface PlayerStats {
  totalGames: number;
  totalScore: number;
  highScore: number;
  totalRounds: number;
  totalCorrect: number;
  totalIncorrect: number;
  averageAccuracy: number;
  averageReactionTime: number;
  longestStreak: number;
  totalPlayTime: number; // en segundos
  lastPlayed: Date | null;
  gamesHistory: GameSession[];
}

/**
 * Servicio para gestionar estadísticas del jugador
 */
@Injectable({
  providedIn: "root",
})
export class PlayerStatsService {
  private readonly STATS_KEY = "player_stats";
  private readonly MAX_HISTORY = 50; // Guardar últimas 50 partidas

  constructor(private storage: StorageService) {}

  /**
   * Obtiene las estadísticas actuales del jugador
   */
  getStats(): PlayerStats {
    const stats = this.storage.get<PlayerStats>(this.STATS_KEY, undefined);
    return stats || this.getDefaultStats();
  }

  /**
   * Guarda una nueva sesión de juego
   */
  saveGameSession(session: GameSession): void {
    const stats = this.getStats();

    // Actualizar estadísticas generales
    stats.totalGames++;
    stats.totalScore += session.score;
    stats.totalRounds += session.rounds;
    stats.totalPlayTime += session.duration;
    stats.lastPlayed = session.date;

    // Actualizar high score
    if (session.score > stats.highScore) {
      stats.highScore = session.score;
    }

    // Actualizar longest streak
    if (session.longestStreak > stats.longestStreak) {
      stats.longestStreak = session.longestStreak;
    }

    // Calcular totales de aciertos/fallos basados en accuracy
    const correct = Math.round((session.accuracy / 100) * session.rounds);
    const incorrect = session.rounds - correct;
    stats.totalCorrect += correct;
    stats.totalIncorrect += incorrect;

    // Recalcular promedios
    stats.averageAccuracy =
      (stats.totalCorrect / (stats.totalCorrect + stats.totalIncorrect)) * 100;

    // Promedio de tiempo de reacción ponderado
    const totalSessions = stats.gamesHistory.length + 1;
    stats.averageReactionTime =
      (stats.averageReactionTime * stats.gamesHistory.length +
        session.averageReactionTime) /
      totalSessions;

    // Agregar a historial
    stats.gamesHistory.unshift(session);
    if (stats.gamesHistory.length > this.MAX_HISTORY) {
      stats.gamesHistory = stats.gamesHistory.slice(0, this.MAX_HISTORY);
    }

    this.storage.set(this.STATS_KEY, stats);
  }

  /**
   * Obtiene las mejores puntuaciones (leaderboard)
   */
  getTopScores(limit: number = 10): GameSession[] {
    const stats = this.getStats();
    return stats.gamesHistory.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Resetea todas las estadísticas
   */
  resetStats(): void {
    this.storage.set(this.STATS_KEY, this.getDefaultStats());
  }

  /**
   * Obtiene estadísticas por defecto
   */
  private getDefaultStats(): PlayerStats {
    return {
      totalGames: 0,
      totalScore: 0,
      highScore: 0,
      totalRounds: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      averageAccuracy: 0,
      averageReactionTime: 0,
      longestStreak: 0,
      totalPlayTime: 0,
      lastPlayed: null,
      gamesHistory: [],
    };
  }
}
