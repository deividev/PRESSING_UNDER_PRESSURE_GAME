import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TranslationService } from "../../services/translation.service";

@Component({
  selector: "app-victory",
  templateUrl: "./victory.component.html",
  styleUrls: ["./victory.component.scss"],
})
export class VictoryComponent implements OnInit {
  @Input() finalRound: number = 0;
  @Input() finalScore: number = 0;
  @Output() backToMenu = new EventEmitter<void>();
  @Output() playAgain = new EventEmitter<void>();

  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
    color: string;
  }> = [];

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    // Trigger massive particle celebration
    this.createMassiveParticleExplosion();
  }

  createMassiveParticleExplosion(): void {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Create 10 bursts of particles over 1.5 seconds
    for (let burst = 0; burst < 10; burst++) {
      setTimeout(() => {
        this.createParticleBurst(centerX, centerY, 30, [
          "#FFD700",
          "#00ff88",
          "#00d4ff",
        ]);
      }, burst * 150);
    }

    // Animate particles
    this.animateParticles();
  }

  createParticleBurst(
    x: number,
    y: number,
    count: number,
    colors: string[],
  ): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 3 + Math.random() * 5;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 8 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  animateParticles(): void {
    const animate = () => {
      this.particles = this.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.life -= 0.02;
        return p.life > 0;
      });

      if (this.particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  onBackToMenu(): void {
    this.backToMenu.emit();
  }

  onPlayAgain(): void {
    this.playAgain.emit();
  }

  get formattedRound(): string {
    return this.finalRound.toString().padStart(2, "0");
  }

  get formattedScore(): string {
    return this.finalScore.toString().padStart(6, "0");
  }
}
