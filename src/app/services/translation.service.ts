import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage$ = new BehaviorSubject<Language>('en');
  private translations: any = {};

  constructor() {
    this.loadLanguage(this.getCurrentLanguage());
  }

  getCurrentLanguage(): Language {
    const saved = localStorage.getItem('app-language') as Language;
    return saved || 'en';
  }

  setLanguage(lang: Language): void {
    localStorage.setItem('app-language', lang);
    this.currentLanguage$.next(lang);
    this.loadLanguage(lang);
  }

  getLanguage$(): Observable<Language> {
    return this.currentLanguage$.asObservable();
  }

  private loadLanguage(lang: Language): void {
    // Load translations based on language
    this.translations = this.getTranslations(lang);
  }

  translate(key: string, params?: any): string {
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value === 'string' && params) {
      return this.interpolate(value, params);
    }

    return typeof value === 'string' ? value : key;
  }

  private interpolate(text: string, params: any): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  private getTranslations(lang: Language): any {
    return lang === 'en' ? this.getEnglishTranslations() : this.getSpanishTranslations();
  }

  private getEnglishTranslations(): any {
    return {
      common: {
        close: 'Close',
        start: 'Start',
        restart: 'Restart',
        next: 'Next',
        previous: 'Previous',
        skip: 'Skip',
        reset: 'Reset to Defaults',
        save: 'Save',
        cancel: 'Cancel'
      },
      menu: {
        title: 'PRESSING UNDER PRESSURE',
        subtitle: 'High Stress Reaction Game',
        playButton: 'START GAME',
        tutorialButton: 'Tutorial',
        leaderboardButton: 'Leaderboard',
        statsButton: 'Statistics',
        achievementsButton: 'Achievements',
        settingsButton: 'Settings'
      },
      game: {
        ready: 'GET READY',
        pressKey: 'PRESS {{key}}',
        correct: 'CORRECT!',
        incorrect: 'INCORRECT!',
        timeUp: 'TIME\'S UP!',
        gameOver: 'GAME OVER',
        score: 'Score',
        streak: 'Streak',
        round: 'Round',
        time: 'Time',
        finalScore: 'Final Score: {{score}}',
        newRecord: 'NEW RECORD!',
        playAgain: 'Play Again',
        backToMenu: 'Back to Menu'
      },
      tutorial: {
        title: 'Interactive Tutorial',
        skip: 'Skip Tutorial',
        previous: '← Previous',
        next: 'Next →',
        start: 'Start!',
        stepCounter: 'Step {{current}} of {{total}}',
        steps: {
          welcome: {
            title: 'Welcome!',
            description: 'Learn how to play Pressing Under Pressure in just a few steps.',
            example: 'This is a high-stress reaction game that will test your speed and precision.'
          },
          objective: {
            title: 'Objective',
            description: 'Follow the on-screen instructions as quickly and accurately as possible.',
            example: 'Each correct answer increases your score and streak!'
          },
          controls: {
            title: 'Controls',
            description: 'Use your keyboard to respond to challenges. You\'ll see instructions like "PRESS A" or "PRESS ANY KEY".',
            example: 'Example: When you see "PRESS SPACE", press the spacebar quickly.'
          },
          time: {
            title: 'Time Pressure',
            description: 'Each challenge has a time limit. The faster you respond, the more points you earn.',
            example: 'The timer bar at the top shows remaining time.'
          },
          streak: {
            title: 'Combos',
            description: 'Chain correct answers to build combos and multiply your score.',
            example: '3 correct = 2x score, 5 correct = 3x score, 10 correct = 5x score!'
          },
          difficulty: {
            title: 'Progressive Difficulty',
            description: 'Challenges get harder as you progress. Stay focused!',
            example: 'Times get shorter and challenges more complex.'
          },
          lives: {
            title: 'Mistakes',
            description: 'You have limited attempts. Each error reduces your streak.',
            example: 'Keep calm under pressure to maintain your combo.'
          },
          ready: {
            title: 'Ready to Play?',
            description: 'You now know everything needed to become a champion!',
            example: 'Good luck and have fun!'
          }
        }
      },
      leaderboard: {
        title: 'LEADERBOARD',
        subtitle: 'Top 10 Best Scores',
        empty: 'No scores registered yet',
        emptyHint: 'Play your first game to appear here!',
        player: 'Player',
        rounds: 'rounds',
        date: 'Date'
      },
      stats: {
        title: 'DETAILED STATISTICS',
        subtitle: 'Track Your Performance',
        empty: 'No statistics yet',
        emptyHint: 'Play your first game to see your stats!',
        general: {
          title: 'General',
          gamesPlayed: 'Games Played',
          highScore: 'High Score',
          totalScore: 'Total Points',
          playTime: 'Play Time'
        },
        accuracy: {
          title: 'Accuracy',
          correct: 'Correct',
          incorrect: 'Incorrect',
          averageAccuracy: 'Average Accuracy',
          totalRounds: 'Total Rounds'
        },
        performance: {
          title: 'Performance',
          longestStreak: 'Longest Streak',
          reactionTime: 'Reaction Time',
          lastPlayed: 'Last Game',
          avgPerGame: 'Points per Game'
        }
      },
      achievements: {
        title: 'ACHIEVEMENTS',
        unlocked: 'Unlocked',
        locked: 'Locked',
        showAll: 'Show All',
        progress: '{{current}} / {{total}} Unlocked',
        empty: 'Start playing to unlock achievements!',
        list: {
          firstSteps: {
            name: 'First Steps',
            description: 'Complete your first game'
          },
          dedicated: {
            name: 'Dedicated',
            description: 'Play 10 games'
          },
          veteran: {
            name: 'Veteran',
            description: 'Play 50 games'
          },
          centurion: {
            name: 'Centurion',
            description: 'Reach 100 points in one game'
          },
          champion: {
            name: 'Champion',
            description: 'Reach 500 points in one game'
          },
          legend: {
            name: 'Legend',
            description: 'Reach 1000 points in one game'
          },
          perfectionist: {
            name: 'Perfectionist',
            description: 'Complete a game with 100% accuracy'
          },
          sharpshooter: {
            name: 'Sharpshooter',
            description: 'Maintain 95% accuracy in 10 games'
          },
          comboMaster: {
            name: 'Combo Master',
            description: 'Achieve a streak of 10'
          },
          unstoppable: {
            name: 'Unstoppable',
            description: 'Achieve a streak of 25'
          },
          speedDemon: {
            name: 'Speed Demon',
            description: 'Average reaction time under 300ms'
          },
          lightning: {
            name: 'Lightning',
            description: 'Average reaction time under 200ms'
          },
          marathon: {
            name: 'Marathon',
            description: 'Complete 30 rounds in one game'
          },
          ironWill: {
            name: 'Iron Will',
            description: 'Complete 50 rounds in one game'
          },
          nightOwl: {
            name: 'Night Owl',
            description: 'Play 5 games between 12 AM and 6 AM'
          },
          collector: {
            name: 'Collector',
            description: 'Unlock all achievements'
          }
        }
      },
      settings: {
        title: 'SETTINGS',
        subtitle: 'Customize Your Experience',
        audio: {
          title: 'Audio',
          masterVolume: 'Master Volume',
          musicVolume: 'Music Volume',
          sfxVolume: 'Sound Effects Volume',
          musicEnabled: 'Music Enabled',
          musicDesc: 'Enable or disable background music',
          sfxEnabled: 'Sound Effects Enabled',
          sfxDesc: 'Enable or disable sound effects'
        },
        difficulty: {
          title: 'Difficulty',
          easy: 'Easy',
          normal: 'Normal',
          hard: 'Hard',
          extreme: 'Extreme'
        },
        visual: {
          title: 'Visual Effects',
          particles: 'Particles',
          particlesDesc: 'Particle effects in animations',
          chromatic: 'Chromatic Aberration',
          chromaticDesc: 'Color distortion effect',
          screenShake: 'Screen Shake',
          screenShakeDesc: 'Vibration on important events',
          glitch: 'Glitch Effect',
          glitchDesc: 'Digital interference effect'
        },
        accessibility: {
          title: 'Accessibility',
          highContrast: 'High Contrast',
          highContrastDesc: 'Increase visual contrast',
          reducedMotion: 'Reduced Motion',
          reducedMotionDesc: 'Minimize animations',
          showTutorial: 'Show Tutorial at Start',
          showTutorialDesc: 'Display tutorial each time you start'
        },
        language: {
          title: 'Language',
          label: 'Game Language',
          english: 'English',
          spanish: 'Spanish'
        }
      },
      challenges: {
        pressKey: 'PRESS {{key}}',
        pressAnyKey: 'PRESS ANY KEY',
        dontPress: 'DON\'T PRESS {{key}}',
        pressInOrder: 'PRESS {{keys}} IN ORDER',
        pressSimultaneous: 'PRESS {{keys}} SIMULTANEOUSLY',
        holdKey: 'HOLD {{key}}',
        releaseKey: 'RELEASE {{key}}',
        pressCount: 'PRESS {{key}} {{count}} TIMES',
        pressSequence: 'MEMORIZE SEQUENCE',
        mathQuestion: 'WHAT IS {{question}}?',
        colorMatch: 'PRESS {{color}} KEY',
        direction: 'PRESS {{direction}}',
        reaction: 'PRESS WHEN GREEN'
      }
    };
  }

  private getSpanishTranslations(): any {
    return {
      common: {
        close: 'Cerrar',
        start: 'Comenzar',
        restart: 'Reiniciar',
        next: 'Siguiente',
        previous: 'Anterior',
        skip: 'Saltar',
        reset: 'Restablecer Valores por Defecto',
        save: 'Guardar',
        cancel: 'Cancelar'
      },
      menu: {
        title: 'PRESSING UNDER PRESSURE',
        subtitle: 'Juego de Reacción de Alto Estrés',
        playButton: 'INICIAR JUEGO',
        tutorialButton: 'Tutorial',
        leaderboardButton: 'Clasificación',
        statsButton: 'Estadísticas',
        achievementsButton: 'Logros',
        settingsButton: 'Configuración'
      },
      game: {
        ready: 'PREPÁRATE',
        pressKey: 'PRESIONA {{key}}',
        correct: '¡CORRECTO!',
        incorrect: '¡INCORRECTO!',
        timeUp: '¡TIEMPO AGOTADO!',
        gameOver: 'JUEGO TERMINADO',
        score: 'Puntuación',
        streak: 'Racha',
        round: 'Ronda',
        time: 'Tiempo',
        finalScore: 'Puntuación Final: {{score}}',
        newRecord: '¡NUEVO RÉCORD!',
        playAgain: 'Jugar de Nuevo',
        backToMenu: 'Volver al Menú'
      },
      tutorial: {
        title: 'Tutorial Interactivo',
        skip: 'Saltar Tutorial',
        previous: '← Anterior',
        next: 'Siguiente →',
        start: '¡Comenzar!',
        stepCounter: 'Paso {{current}} de {{total}}',
        steps: {
          welcome: {
            title: '¡Bienvenido!',
            description: 'Aprende a jugar Pressing Under Pressure en solo unos pasos.',
            example: 'Este es un juego de reacción de alto estrés que pondrá a prueba tu velocidad y precisión.'
          },
          objective: {
            title: 'Objetivo',
            description: 'Sigue las instrucciones en pantalla lo más rápido y preciso posible.',
            example: '¡Cada respuesta correcta aumenta tu puntuación y racha!'
          },
          controls: {
            title: 'Controles',
            description: 'Usa tu teclado para responder a los desafíos. Verás instrucciones como "PRESIONA A" o "PRESIONA CUALQUIER TECLA".',
            example: 'Ejemplo: Cuando veas "PRESIONA ESPACIO", presiona la barra espaciadora rápidamente.'
          },
          time: {
            title: 'Presión de Tiempo',
            description: 'Cada desafío tiene un límite de tiempo. Cuanto más rápido respondas, más puntos ganarás.',
            example: 'La barra de tiempo en la parte superior muestra el tiempo restante.'
          },
          streak: {
            title: 'Combos',
            description: 'Encadena respuestas correctas para construir combos y multiplicar tu puntuación.',
            example: '3 correctas = 2x puntos, 5 correctas = 3x puntos, 10 correctas = 5x puntos!'
          },
          difficulty: {
            title: 'Dificultad Progresiva',
            description: 'Los desafíos se vuelven más difíciles a medida que avanzas. ¡Mantén la concentración!',
            example: 'Los tiempos se acortan y los desafíos se vuelven más complejos.'
          },
          lives: {
            title: 'Errores',
            description: 'Tienes intentos limitados. Cada error reduce tu racha.',
            example: 'Mantén la calma bajo presión para mantener tu combo.'
          },
          ready: {
            title: '¿Listo para Jugar?',
            description: '¡Ya sabes todo lo necesario para convertirte en un campeón!',
            example: '¡Buena suerte y diviértete!'
          }
        }
      },
      leaderboard: {
        title: 'TABLA DE CLASIFICACIONES',
        subtitle: 'Top 10 Mejores Puntuaciones',
        empty: 'Aún no hay puntuaciones registradas',
        emptyHint: '¡Juega tu primera partida para aparecer aquí!',
        player: 'Jugador',
        rounds: 'rondas',
        date: 'Fecha'
      },
      stats: {
        title: 'ESTADÍSTICAS DETALLADAS',
        subtitle: 'Seguimiento de tu Rendimiento',
        empty: 'Aún no hay estadísticas',
        emptyHint: '¡Juega tu primera partida para ver tus stats!',
        general: {
          title: 'General',
          gamesPlayed: 'Partidas Jugadas',
          highScore: 'Puntuación Máxima',
          totalScore: 'Puntos Totales',
          playTime: 'Tiempo de Juego'
        },
        accuracy: {
          title: 'Precisión',
          correct: 'Aciertos',
          incorrect: 'Fallos',
          averageAccuracy: 'Precisión Media',
          totalRounds: 'Rondas Totales'
        },
        performance: {
          title: 'Rendimiento',
          longestStreak: 'Racha Más Larga',
          reactionTime: 'Tiempo de Reacción',
          lastPlayed: 'Última Partida',
          avgPerGame: 'Puntos por Partida'
        }
      },
      achievements: {
        title: 'LOGROS',
        unlocked: 'Desbloqueados',
        locked: 'Bloqueados',
        showAll: 'Mostrar Todos',
        progress: '{{current}} / {{total}} Desbloqueados',
        empty: '¡Empieza a jugar para desbloquear logros!',
        list: {
          firstSteps: {
            name: 'Primeros Pasos',
            description: 'Completa tu primer juego'
          },
          dedicated: {
            name: 'Dedicado',
            description: 'Juega 10 partidas'
          },
          veteran: {
            name: 'Veterano',
            description: 'Juega 50 partidas'
          },
          centurion: {
            name: 'Centurión',
            description: 'Alcanza 100 puntos en una partida'
          },
          champion: {
            name: 'Campeón',
            description: 'Alcanza 500 puntos en una partida'
          },
          legend: {
            name: 'Leyenda',
            description: 'Alcanza 1000 puntos en una partida'
          },
          perfectionist: {
            name: 'Perfeccionista',
            description: 'Completa una partida con 100% de precisión'
          },
          sharpshooter: {
            name: 'Tirador Experto',
            description: 'Mantén 95% de precisión en 10 partidas'
          },
          comboMaster: {
            name: 'Maestro del Combo',
            description: 'Consigue una racha de 10'
          },
          unstoppable: {
            name: 'Imparable',
            description: 'Consigue una racha de 25'
          },
          speedDemon: {
            name: 'Demonio de Velocidad',
            description: 'Tiempo de reacción promedio menor a 300ms'
          },
          lightning: {
            name: 'Relámpago',
            description: 'Tiempo de reacción promedio menor a 200ms'
          },
          marathon: {
            name: 'Maratón',
            description: 'Completa 30 rondas en una partida'
          },
          ironWill: {
            name: 'Voluntad de Hierro',
            description: 'Completa 50 rondas en una partida'
          },
          nightOwl: {
            name: 'Búho Nocturno',
            description: 'Juega 5 partidas entre las 12 AM y 6 AM'
          },
          collector: {
            name: 'Coleccionista',
            description: 'Desbloquea todos los logros'
          }
        }
      },
      settings: {
        title: 'CONFIGURACIÓN',
        subtitle: 'Personaliza tu Experiencia',
        audio: {
          title: 'Audio',
          masterVolume: 'Volumen General',
          musicVolume: 'Volumen Música',
          sfxVolume: 'Volumen Efectos',
          musicEnabled: 'Música Habilitada',
          musicDesc: 'Activa o desactiva la música de fondo',
          sfxEnabled: 'Efectos Habilitados',
          sfxDesc: 'Activa o desactiva los efectos de sonido'
        },
        difficulty: {
          title: 'Dificultad',
          easy: 'Fácil',
          normal: 'Normal',
          hard: 'Difícil',
          extreme: 'Extremo'
        },
        visual: {
          title: 'Efectos Visuales',
          particles: 'Partículas',
          particlesDesc: 'Efectos de partículas en animaciones',
          chromatic: 'Aberración Cromática',
          chromaticDesc: 'Efecto de distorsión de color',
          screenShake: 'Sacudida de Pantalla',
          screenShakeDesc: 'Vibración en eventos importantes',
          glitch: 'Efecto Glitch',
          glitchDesc: 'Efecto de interferencia digital'
        },
        accessibility: {
          title: 'Accesibilidad',
          highContrast: 'Alto Contraste',
          highContrastDesc: 'Aumenta el contraste visual',
          reducedMotion: 'Movimiento Reducido',
          reducedMotionDesc: 'Minimiza animaciones',
          showTutorial: 'Mostrar Tutorial al Inicio',
          showTutorialDesc: 'Muestra el tutorial cada vez que inicias'
        },
        language: {
          title: 'Idioma',
          label: 'Idioma del Juego',
          english: 'Inglés',
          spanish: 'Español'
        }
      },
      challenges: {
        pressKey: 'PRESIONA {{key}}',
        pressAnyKey: 'PRESIONA CUALQUIER TECLA',
        dontPress: 'NO PRESIONES {{key}}',
        pressInOrder: 'PRESIONA {{keys}} EN ORDEN',
        pressSimultaneous: 'PRESIONA {{keys}} SIMULTÁNEAMENTE',
        holdKey: 'MANTÉN {{key}}',
        releaseKey: 'SUELTA {{key}}',
        pressCount: 'PRESIONA {{key}} {{count}} VECES',
        pressSequence: 'MEMORIZA LA SECUENCIA',
        mathQuestion: '¿CUÁNTO ES {{question}}?',
        colorMatch: 'PRESIONA TECLA {{color}}',
        direction: 'PRESIONA {{direction}}',
        reaction: 'PRESIONA CUANDO SEA VERDE'
      }
    };
  }
}
