import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsService, Achievement } from '../../services/achievements.service';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})
export class AchievementsComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  
  achievements: Achievement[] = [];
  showLocked = true;
  private langSubscription?: Subscription;

  constructor(
    private achievementsService: AchievementsService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadAchievements();
    // Subscribe to language changes
    this.langSubscription = this.translationService.getLanguage$().subscribe(() => {
      this.loadAchievements();
    });
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  loadAchievements(): void {
    this.achievements = this.achievementsService.getAchievements();
  }

  get unlockedAchievements(): Achievement[] {
    return this.achievements.filter(a => a.unlocked);
  }

  get lockedAchievements(): Achievement[] {
    return this.achievements.filter(a => !a.unlocked);
  }

  get totalUnlocked(): number {
    return this.unlockedAchievements.length;
  }

  get totalAchievements(): number {
    return this.achievements.length;
  }

  get completionPercentage(): number {
    if (this.totalAchievements === 0) return 0;
    return (this.totalUnlocked / this.totalAchievements) * 100;
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString(this.translationService.getCurrentLanguage() === 'es' ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getAchievementName(achievement: Achievement): string {
    return this.translationService.translate(`achievements.list.${achievement.id}.name`);
  }

  getAchievementDescription(achievement: Achievement): string {
    return this.translationService.translate(`achievements.list.${achievement.id}.description`);
  }

  toggleLocked(): void {
    this.showLocked = !this.showLocked;
  }

  closeAchievements(): void {
    this.close.emit();
  }
}
