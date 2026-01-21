import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Button Pressure';
  currentView: 'menu' | 'instructions' | 'game' = 'menu';

  showInstructions() {
    this.currentView = 'instructions';
  }

  startGame() {
    this.currentView = 'game';
  }

  backToMenu() {
    this.currentView = 'menu';
  }
}
