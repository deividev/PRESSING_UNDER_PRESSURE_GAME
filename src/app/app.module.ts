import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { MenuComponent } from './components/menu/menu.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { StatsComponent } from './components/stats/stats.component';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { SettingsComponent } from './components/settings/settings.component';

// Servicios
import { StorageService } from './services/storage.service';
import { PlayerStatsService } from './services/player-stats.service';
import { AchievementsService } from './services/achievements.service';
import { SettingsService } from './services/settings.service';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MenuComponent,
    ScoreboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TutorialComponent,
    LeaderboardComponent,
    StatsComponent,
    AchievementsComponent,
    SettingsComponent
  ],
  providers: [
    StorageService,
    PlayerStatsService,
    AchievementsService,
    SettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
