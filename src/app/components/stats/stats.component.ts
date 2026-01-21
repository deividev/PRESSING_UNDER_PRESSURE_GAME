import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatsService, PlayerStats } from '../../services/player-stats.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  stats: PlayerStats | null = null;
  Math = Math; // Expose Math to template

  constructor(
    private statsService: PlayerStatsService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.stats = this.statsService.getStats();
  }

  formatPlayTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  formatLastPlayed(date: Date | null): string {
    if (!date) return this.translationService.translate('stats.performance.lastPlayed');
    return new Date(date).toLocaleDateString(this.translationService.getCurrentLanguage() === 'es' ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  closeStats(): void {
    this.close.emit();
  }
}
