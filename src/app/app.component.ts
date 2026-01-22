import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Button Pressure";
  currentView: "menu" | "instructions" | "game" | "victory" = "menu";
  victoryData: { finalRound: number; finalScore: number } = {
    finalRound: 0,
    finalScore: 0,
  };

  showInstructions() {
    this.currentView = "instructions";
  }

  startGame() {
    this.currentView = "game";
  }

  backToMenu() {
    this.currentView = "menu";
  }

  showVictory(finalRound: number, finalScore: number) {
    this.victoryData = { finalRound, finalScore };
    this.currentView = "victory";
  }
}
