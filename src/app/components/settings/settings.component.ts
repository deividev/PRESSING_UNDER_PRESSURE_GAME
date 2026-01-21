import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  SettingsService,
  GameSettings,
  DifficultyLevel,
} from "../../services/settings.service";
import {
  TranslationService,
  Language,
} from "../../services/translation.service";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss",
})
export class SettingsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() settingsChanged = new EventEmitter<GameSettings>();

  settings: GameSettings | null = null;
  currentLanguage: Language = "en";
  difficultyOptions: {
    value: DifficultyLevel;
    label: string;
    description: string;
  }[] = [];

  constructor(
    private settingsService: SettingsService,
    public translationService: TranslationService,
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.updateDifficultyOptions();

    // Subscribe to language changes
    this.translationService.getLanguage$().subscribe((lang) => {
      this.currentLanguage = lang;
      this.updateDifficultyOptions();
    });
  }

  updateDifficultyOptions(): void {
    this.difficultyOptions = [
      {
        value: "easy",
        label: this.translationService.translate("settings.difficulty.easy"),
        description: "+30% time",
      },
      {
        value: "normal",
        label: this.translationService.translate("settings.difficulty.normal"),
        description: "Standard time",
      },
      {
        value: "hard",
        label: this.translationService.translate("settings.difficulty.hard"),
        description: "-20% time",
      },
      {
        value: "extreme",
        label: this.translationService.translate("settings.difficulty.extreme"),
        description: "-40% time",
      },
    ];
  }

  loadSettings(): void {
    this.settings = this.settingsService.getSettings();
  }

  updateSetting(key: keyof GameSettings, value: any): void {
    if (!this.settings) return;
    this.settingsService.updateSettings({ [key]: value });
    this.settings = this.settingsService.getSettings();
    this.settingsChanged.emit(this.settings);
  }

  changeLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
    this.currentLanguage = lang;
  }

  resetToDefaults(): void {
    const confirmMessage =
      this.translationService.translate("settings.resetConfirm") ||
      "Are you sure you want to reset all settings?";
    if (confirm(confirmMessage)) {
      this.settingsService.resetSettings();
      this.loadSettings();
      this.settingsChanged.emit(this.settings!);
    }
  }

  closeSettings(): void {
    this.close.emit();
  }
}
