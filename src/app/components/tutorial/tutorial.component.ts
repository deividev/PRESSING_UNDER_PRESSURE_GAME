import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

interface TutorialStep {
  title: string;
  description: string;
  example?: string;
  icon: string;
}

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss'
})
export class TutorialComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() skip = new EventEmitter<void>();

  currentStep = 0;
  steps: TutorialStep[] = [];
  private langSubscription?: Subscription;

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.loadSteps();
    // Subscribe to language changes
    this.langSubscription = this.translationService.getLanguage$().subscribe(() => {
      this.loadSteps();
    });
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  loadSteps(): void {
    this.steps = [
      {
        title: this.translationService.translate('tutorial.steps.welcome.title'),
        description: this.translationService.translate('tutorial.steps.welcome.description'),
        example: this.translationService.translate('tutorial.steps.welcome.example'),
        icon: '🎯'
      },
      {
        title: this.translationService.translate('tutorial.steps.objective.title'),
        description: this.translationService.translate('tutorial.steps.objective.description'),
        example: this.translationService.translate('tutorial.steps.objective.example'),
        icon: '🎮'
      },
      {
        title: this.translationService.translate('tutorial.steps.controls.title'),
        description: this.translationService.translate('tutorial.steps.controls.description'),
        example: this.translationService.translate('tutorial.steps.controls.example'),
        icon: '✨'
      },
      {
        title: this.translationService.translate('tutorial.steps.time.title'),
        description: this.translationService.translate('tutorial.steps.time.description'),
        example: this.translationService.translate('tutorial.steps.time.example'),
        icon: '⏱️'
      },
      {
        title: this.translationService.translate('tutorial.steps.streak.title'),
        description: this.translationService.translate('tutorial.steps.streak.description'),
        example: this.translationService.translate('tutorial.steps.streak.example'),
        icon: '⭐'
      },
      {
        title: this.translationService.translate('tutorial.steps.difficulty.title'),
        description: this.translationService.translate('tutorial.steps.difficulty.description'),
        example: this.translationService.translate('tutorial.steps.difficulty.example'),
        icon: '🧠'
      },
      {
        title: this.translationService.translate('tutorial.steps.lives.title'),
        description: this.translationService.translate('tutorial.steps.lives.description'),
        example: this.translationService.translate('tutorial.steps.lives.example'),
        icon: '💥'
      },
      {
        title: this.translationService.translate('tutorial.steps.ready.title'),
        description: this.translationService.translate('tutorial.steps.ready.description'),
        example: this.translationService.translate('tutorial.steps.ready.example'),
        icon: '🔥'
      }
    ];
  }

  get progress(): number {
    return ((this.currentStep + 1) / this.steps.length) * 100;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  get isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else {
      this.completeTutorial();
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  completeTutorial(): void {
    this.close.emit();
  }

  skipTutorial(): void {
    this.skip.emit();
  }
}
