/**
 * DESAFÍOS DEL JUEGO - PRESSING UNDER PRESSURE
 *
 * Este archivo contiene todas las acciones/desafíos posibles del juego.
 * Puedes agregar, modificar o eliminar desafíos fácilmente desde aquí.
 *
 * Estructura de un desafío:
 * - text: El texto que se muestra en pantalla
 * - check: Función que verifica si el desafío se completó correctamente
 * - difficulty: Dificultad base del desafío (1=fácil, 2=medio, 3=difícil)
 * - category: Categoría para organización
 *
 * NOTA: El tiempo se calcula automáticamente según la ronda y la dificultad
 */

export type ChallengeDifficulty = 1 | 2 | 3 | 4 | 5;

export interface Challenge {
  text: string;
  check: (redPresses: number, bluePresses: number) => boolean;
  difficulty: ChallengeDifficulty; // 1=muy fácil, 2=fácil, 3=medio, 4=difícil, 5=muy difícil
  category?: string;
}

/**
 * Calcula el tiempo disponible para un desafío según la ronda actual
 * El tiempo disminuye progresivamente mientras avanzas en el juego
 *
 * @param difficulty - Dificultad del desafío (1-5)
 * @param round - Número de ronda actual
 * @returns Tiempo en milisegundos
 */
export function calculateChallengeTime(
  difficulty: ChallengeDifficulty,
  round: number,
): number {
  // Tiempo base según dificultad (muy aumentados para dar tiempo físico a clicks múltiples)
  const baseTime = {
    1: 6500, // Muy fácil: 6.5 segundos
    2: 6000, // Fácil: 6 segundos
    3: 5500, // Medio: 5.5 segundos
    4: 5000, // Difícil: 5 segundos (para dar tiempo a múltiples clicks)
    5: 4500, // Muy difícil: 4.5 segundos
  }[difficulty];

  // Reducción de tiempo por ronda muy suave para mantener jugabilidad
  const reductionPerRound = round <= 20 ? 30 : 60;
  const maxReduction = baseTime - 2000; // Mínimo siempre 2 segundos
  const timeReduction = Math.min((round - 1) * reductionPerRound, maxReduction);

  return Math.max(baseTime - timeReduction, 2000);
}

/**
 * Lista completa de desafíos del juego
 * Total actual: 50 desafíos
 * Los desafíos se seleccionan ALEATORIAMENTE en cada ronda
 */
export const GAME_CHALLENGES: Challenge[] = [
  // ============================================
  // CATEGORÍA: NO PRESIONAR (6 desafíos)
  // ============================================
  {
    text: "¡NO PRESIONES NADA!",
    check: (red, blue) => red === 0 && blue === 0,
    difficulty: 2,
    category: "no-press",
  },
  {
    text: "¡MANOS QUIETAS!",
    check: (red, blue) => red === 0 && blue === 0,
    difficulty: 2,
    category: "no-press",
  },
  {
    text: "NO TOQUES LOS BOTONES",
    check: (red, blue) => red === 0 && blue === 0,
    difficulty: 2,
    category: "no-press",
  },
  {
    text: "¡QUIETO!",
    check: (red, blue) => red === 0 && blue === 0,
    difficulty: 1,
    category: "no-press",
  },
  {
    text: "¡ESPERA!",
    check: (red, blue) => red === 0 && blue === 0,
    difficulty: 1,
    category: "no-press",
  },
  {
    text: "¡NO HAGAS NADA!",
    check: (red, blue) => red === 0 && blue === 0,
    difficulty: 2,
    category: "no-press",
  },

  // ============================================
  // CATEGORÍA: PRESIONAR UN BOTÓN ESPECÍFICO (8 desafíos)
  // ============================================
  {
    text: "PRESIONA ROJO",
    check: (red, blue) => red >= 1 && blue === 0,
    difficulty: 1,
    category: "single-button",
  },
  {
    text: "PRESIONA AZUL",
    check: (red, blue) => blue >= 1 && red === 0,
    difficulty: 1,
    category: "single-button",
  },
  {
    text: "SOLO ROJO",
    check: (red, blue) => red >= 1 && blue === 0,
    difficulty: 1,
    category: "single-button",
  },
  {
    text: "SOLO AZUL",
    check: (red, blue) => blue >= 1 && red === 0,
    difficulty: 1,
    category: "single-button",
  },
  {
    text: "ACTIVA SISTEMA ROJO",
    check: (red, blue) => red >= 1 && blue === 0,
    difficulty: 1,
    category: "single-button",
  },
  {
    text: "ACTIVA SISTEMA AZUL",
    check: (red, blue) => blue >= 1 && red === 0,
    difficulty: 1,
    category: "single-button",
  },
  {
    text: "ELIGE ROJO",
    check: (red, blue) => red >= 1 && blue === 0,
    difficulty: 1,
    category: "single-button",
  },
  {
    text: "ELIGE AZUL",
    check: (red, blue) => blue >= 1 && red === 0,
    difficulty: 1,
    category: "single-button",
  },

  // ============================================
  // CATEGORÍA: PRESIONAR VARIAS VECES (10 desafíos)
  // ============================================
  {
    text: "PRESIONA ROJO 2 VECES",
    check: (red, blue) => red === 2 && blue === 0,
    difficulty: 2,
    category: "multiple-presses",
  },
  {
    text: "PRESIONA AZUL 2 VECES",
    check: (red, blue) => blue === 2 && red === 0,
    difficulty: 2,
    category: "multiple-presses",
  },
  {
    text: "PRESIONA ROJO 3 VECES",
    check: (red, blue) => red === 3 && blue === 0,
    difficulty: 3,
    category: "multiple-presses",
  },
  {
    text: "PRESIONA AZUL 3 VECES",
    check: (red, blue) => blue === 3 && red === 0,
    difficulty: 3,
    category: "multiple-presses",
  },
  {
    text: "ROJO 4 VECES",
    check: (red, blue) => red === 4 && blue === 0,
    difficulty: 3,
    category: "multiple-presses",
  },
  {
    text: "AZUL 4 VECES",
    check: (red, blue) => blue === 4 && red === 0,
    difficulty: 3,
    category: "multiple-presses",
  },
  {
    text: "ROJO 5 VECES",
    check: (red, blue) => red === 5 && blue === 0,
    difficulty: 4,
    category: "multiple-presses",
  },
  {
    text: "AZUL 5 VECES",
    check: (red, blue) => blue === 5 && red === 0,
    difficulty: 4,
    category: "multiple-presses",
  },
  {
    text: "PULSA ROJO AL MENOS 3 VECES",
    check: (red, blue) => red >= 3 && blue === 0,
    difficulty: 3,
    category: "multiple-presses",
  },
  {
    text: "PULSA AZUL AL MENOS 3 VECES",
    check: (red, blue) => blue >= 3 && red === 0,
    difficulty: 3,
    category: "multiple-presses",
  },

  // ============================================
  // CATEGORÍA: PRESIONAR AMBOS BOTONES (8 desafíos)
  // ============================================
  {
    text: "PRESIONA AMBOS BOTONES",
    check: (red, blue) => red >= 1 && blue >= 1,
    difficulty: 2,
    category: "both-buttons",
  },
  {
    text: "ROJO 1 VEZ, AZUL 1 VEZ",
    check: (red, blue) => red === 1 && blue === 1,
    difficulty: 3,
    category: "both-buttons",
  },
  {
    text: "ROJO 2 VECES, AZUL 1 VEZ",
    check: (red, blue) => red === 2 && blue === 1,
    difficulty: 3,
    category: "both-buttons",
  },
  {
    text: "AZUL 2 VECES, ROJO 1 VEZ",
    check: (red, blue) => blue === 2 && red === 1,
    difficulty: 3,
    category: "both-buttons",
  },
  {
    text: "AMBOS AL MENOS 2 VECES",
    check: (red, blue) => red >= 2 && blue >= 2,
    difficulty: 4,
    category: "both-buttons",
  },
  {
    text: "ACTIVA AMBOS SISTEMAS",
    check: (red, blue) => red >= 1 && blue >= 1,
    difficulty: 2,
    category: "both-buttons",
  },
  {
    text: "ROJO 3 VECES, AZUL 2 VECES",
    check: (red, blue) => red === 3 && blue === 2,
    difficulty: 4,
    category: "both-buttons",
  },
  {
    text: "AZUL 3 VECES, ROJO 2 VECES",
    check: (red, blue) => blue === 3 && red === 2,
    difficulty: 4,
    category: "both-buttons",
  },

  // ============================================
  // CATEGORÍA: INSTRUCCIONES CONFUSAS/NEGATIVAS (12 desafíos)
  // ============================================
  {
    text: "NO PRESIONES ROJO",
    check: (red, blue) => red === 0,
    difficulty: 2,
    category: "confusing",
  },
  {
    text: "NO PRESIONES AZUL",
    check: (red, blue) => blue === 0,
    difficulty: 2,
    category: "confusing",
  },
  {
    text: "PRESIONA EL QUE NO ES ROJO",
    check: (red, blue) => blue >= 1 && red === 0,
    difficulty: 3,
    category: "confusing",
  },
  {
    text: "PRESIONA EL QUE NO ES AZUL",
    check: (red, blue) => red >= 1 && blue === 0,
    difficulty: 3,
    category: "confusing",
  },
  {
    text: "ROJO MÁS QUE AZUL",
    check: (red, blue) => red > blue && red > 0,
    difficulty: 4,
    category: "confusing",
  },
  {
    text: "AZUL MÁS QUE ROJO",
    check: (red, blue) => blue > red && blue > 0,
    difficulty: 4,
    category: "confusing",
  },
  {
    text: "ROJO, PERO NO AZUL",
    check: (red, blue) => red >= 1 && blue === 0,
    difficulty: 2,
    category: "confusing",
  },
  {
    text: "PRESIONA ROJO O NO HAGAS NADA",
    check: (red, blue) => blue === 0,
    difficulty: 3,
    category: "confusing",
  },
  {
    text: "EVITA ROJO",
    check: (red, blue) => red === 0,
    difficulty: 2,
    category: "confusing",
  },
  {
    text: "EVITA AZUL",
    check: (red, blue) => blue === 0,
    difficulty: 2,
    category: "confusing",
  },
  {
    text: "CUALQUIERA MENOS ROJO",
    check: (red, blue) => red === 0,
    difficulty: 2,
    category: "confusing",
  },
  {
    text: "CUALQUIERA MENOS AZUL",
    check: (red, blue) => blue === 0,
    difficulty: 2,
    category: "confusing",
  },

  // ============================================
  // CATEGORÍA: CONTEOS ESPECÍFICOS (6 desafíos)
  // ============================================
  {
    text: "EXACTAMENTE 1 CLIC EN TOTAL",
    check: (red, blue) => red + blue === 1,
    difficulty: 2,
    category: "total-count",
  },
  {
    text: "EXACTAMENTE 2 CLICS EN TOTAL",
    check: (red, blue) => red + blue === 2,
    difficulty: 3,
    category: "total-count",
  },
  {
    text: "EXACTAMENTE 3 CLICS EN TOTAL",
    check: (red, blue) => red + blue === 3,
    difficulty: 3,
    category: "total-count",
  },
  {
    text: "TOTAL: 4 CLICS",
    check: (red, blue) => red + blue === 4,
    difficulty: 4,
    category: "total-count",
  },
  {
    text: "TOTAL: 5 CLICS",
    check: (red, blue) => red + blue === 5,
    difficulty: 4,
    category: "total-count",
  },
  {
    text: "MÁS DE 3 CLICS EN TOTAL",
    check: (red, blue) => red + blue > 3,
    difficulty: 3,
    category: "total-count",
  },

  // ============================================
  // CATEGORÍA: ALTA DIFICULTAD - COMBINACIONES COMPLEJAS (15 desafíos)
  // ============================================
  {
    text: "ROJO 6 VECES",
    check: (red, blue) => red === 6 && blue === 0,
    difficulty: 5,
    category: "extreme-presses",
  },
  {
    text: "AZUL 6 VECES",
    check: (red, blue) => blue === 6 && red === 0,
    difficulty: 5,
    category: "extreme-presses",
  },
  {
    text: "ROJO 4 VECES, AZUL 3 VECES",
    check: (red, blue) => red === 4 && blue === 3,
    difficulty: 5,
    category: "extreme-combination",
  },
  {
    text: "AZUL 4 VECES, ROJO 3 VECES",
    check: (red, blue) => blue === 4 && red === 3,
    difficulty: 5,
    category: "extreme-combination",
  },
  {
    text: "TOTAL: 7 CLICS",
    check: (red, blue) => red + blue === 7,
    difficulty: 5,
    category: "extreme-total",
  },
  {
    text: "TOTAL: 8 CLICS",
    check: (red, blue) => red + blue === 8,
    difficulty: 5,
    category: "extreme-total",
  },
  {
    text: "ROJO PAR, AZUL IMPAR",
    check: (red, blue) =>
      red > 0 && blue > 0 && red % 2 === 0 && blue % 2 === 1,
    difficulty: 5,
    category: "math-logic",
  },
  {
    text: "AZUL PAR, ROJO IMPAR",
    check: (red, blue) =>
      blue > 0 && red > 0 && blue % 2 === 0 && red % 2 === 1,
    difficulty: 5,
    category: "math-logic",
  },
  {
    text: "MISMO NÚMERO EN AMBOS",
    check: (red, blue) => red === blue && red > 0,
    difficulty: 4,
    category: "math-logic",
  },
  {
    text: "ROJO DOBLE QUE AZUL",
    check: (red, blue) => red === blue * 2 && blue > 0,
    difficulty: 5,
    category: "math-logic",
  },
  {
    text: "AZUL DOBLE QUE ROJO",
    check: (red, blue) => blue === red * 2 && red > 0,
    difficulty: 5,
    category: "math-logic",
  },
  {
    text: "AMBOS AL MENOS 3 VECES",
    check: (red, blue) => red >= 3 && blue >= 3,
    difficulty: 5,
    category: "extreme-combination",
  },
  {
    text: "TOTAL PAR Y MÁS DE 4",
    check: (red, blue) => (red + blue) % 2 === 0 && red + blue > 4,
    difficulty: 4,
    category: "math-logic",
  },
  {
    text: "TOTAL IMPAR Y MÁS DE 4",
    check: (red, blue) => (red + blue) % 2 === 1 && red + blue > 4,
    difficulty: 4,
    category: "math-logic",
  },
  {
    text: "ROJO + AZUL = 6",
    check: (red, blue) => red + blue === 6,
    difficulty: 4,
    category: "math-logic",
  },
];

/**
 * Utilidades para filtrar desafíos
 */
export class ChallengeUtils {
  /**
   * Obtiene desafíos de una categoría específica
   */
  static getByCategory(category: string): Challenge[] {
    return GAME_CHALLENGES.filter((c) => c.category === category);
  }

  /**
   * Obtiene un desafío aleatorio
   */
  static getRandom(): Challenge {
    return GAME_CHALLENGES[Math.floor(Math.random() * GAME_CHALLENGES.length)];
  }

  /**
   * Obtiene múltiples desafíos aleatorios sin repetir
   */
  static getRandomMultiple(count: number): Challenge[] {
    const shuffled = [...GAME_CHALLENGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Obtiene estadísticas de los desafíos
   */
  static getStats() {
    const categories = new Set(GAME_CHALLENGES.map((c) => c.category));
    return {
      total: GAME_CHALLENGES.length,
      categories: Array.from(categories),
      byCategory: Array.from(categories).reduce(
        (acc, cat) => {
          acc[cat!] = GAME_CHALLENGES.filter((c) => c.category === cat).length;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
