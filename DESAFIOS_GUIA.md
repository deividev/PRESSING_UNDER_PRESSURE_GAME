# Gestión de Desafíos del Juego

## 📁 Archivo de Desafíos

Los desafíos del juego ahora están centralizados en:

```
src/app/components/game/game-challenges.ts
```

## 🎯 Estructura de un Desafío

Cada desafío tiene la siguiente estructura:

```typescript
{
  text: "TEXTO A MOSTRAR",           // Texto en pantalla
  check: (red, blue) => boolean,     // Función de validación
  time: 3000,                        // Tiempo en milisegundos
  category: "nombre-categoria"       // Categoría opcional
}
```

### Parámetros de la función `check`:

- **red**: Número de veces que se presionó el botón rojo
- **blue**: Número de veces que se presionó el botón azul
- **return**: `true` si el desafío fue completado, `false` si falló

## ➕ Añadir Nuevos Desafíos

### Ejemplo 1: Desafío Simple

```typescript
{
  text: "PRESIONA ROJO 10 VECES",
  check: (red, blue) => red === 10 && blue === 0,
  time: 5000,
  category: "multiple-presses"
}
```

### Ejemplo 2: Desafío Complejo

```typescript
{
  text: "PRESIONA AMBOS EL MISMO NÚMERO DE VECES",
  check: (red, blue) => red === blue && red > 0,
  time: 4000,
  category: "both-buttons"
}
```

### Ejemplo 3: Desafío con Lógica Avanzada

```typescript
{
  text: "PRESIONA UN NÚMERO PAR DE VECES",
  check: (red, blue) => {
    const total = red + blue;
    return total > 0 && total % 2 === 0;
  },
  time: 4000,
  category: "total-count"
}
```

## 📋 Categorías Actuales

El juego tiene **6 categorías** de desafíos:

| Categoría          | Descripción                      | Total |
| ------------------ | -------------------------------- | ----- |
| `no-press`         | No presionar ningún botón        | 6     |
| `single-button`    | Presionar solo un botón          | 8     |
| `multiple-presses` | Presionar múltiples veces        | 10    |
| `both-buttons`     | Presionar ambos botones          | 8     |
| `confusing`        | Instrucciones confusas/negativas | 12    |
| `total-count`      | Conteos totales específicos      | 6     |

**Total de desafíos:** 50

## 🛠️ Utilidades Disponibles

### Obtener Estadísticas

```typescript
import { ChallengeUtils } from "./game-challenges";

const stats = ChallengeUtils.getStats();
console.log(stats);
// { total: 50, categories: [...], byCategory: {...} }
```

### Filtrar por Categoría

```typescript
const noPressChallenges = ChallengeUtils.getByCategory("no-press");
```

### Obtener Desafío Aleatorio

```typescript
const randomChallenge = ChallengeUtils.getRandom();
```

### Obtener Múltiples Aleatorios

```typescript
const challenges = ChallengeUtils.getRandomMultiple(10);
```

## 📝 Guía Paso a Paso: Añadir un Desafío

1. **Abre el archivo:**

   ```
   src/app/components/game/game-challenges.ts
   ```

2. **Localiza el array `GAME_CHALLENGES`**

3. **Elige una categoría existente o crea una nueva sección:**

   ```typescript
   // ============================================
   // CATEGORÍA: NUEVA CATEGORÍA
   // ============================================
   ```

4. **Añade tu desafío:**

   ```typescript
   {
     text: "TU INSTRUCCIÓN",
     check: (red, blue) => {
       // Tu lógica de validación
       return true; // o false
     },
     time: 3000, // Tiempo en ms
     category: "tu-categoria"
   },
   ```

5. **No olvides la coma al final del objeto**

6. **Guarda el archivo**

7. **El juego automáticamente usará el nuevo desafío**

## ⚠️ Reglas Importantes

1. **No modifiques la firma de la función `check`**
   - Siempre debe ser: `(red: number, blue: number) => boolean`

2. **Los parámetros red y blue son números enteros**
   - `red >= 0` y `blue >= 0`

3. **El tiempo debe ser razonable**
   - Mínimo recomendado: 1500ms
   - Máximo recomendado: 5000ms

4. **El texto debe ser claro y conciso**
   - Usa mayúsculas para mantener el estilo
   - Máximo recomendado: 40 caracteres

5. **Prueba tu desafío antes de añadirlo**
   - Asegúrate de que la lógica sea correcta
   - Verifica que sea posible completarlo

## 💡 Ejemplos de Ideas para Nuevos Desafíos

```typescript
// Presionar alternadamente
{
  text: "ALTERNA ROJO Y AZUL 3 VECES",
  check: (red, blue) => red === 3 && blue === 3,
  time: 5000,
  category: "both-buttons"
}

// Números impares
{
  text: "PRESIONA UN NÚMERO IMPAR DE VECES",
  check: (red, blue) => (red + blue) % 2 === 1 && (red + blue) > 0,
  time: 3500,
  category: "total-count"
}

// Múltiplo de 3
{
  text: "PRESIONA MÚLTIPLO DE 3 VECES",
  check: (red, blue) => {
    const total = red + blue;
    return total > 0 && total % 3 === 0;
  },
  time: 4000,
  category: "total-count"
}

// Solo uno de los dos
{
  text: "PRESIONA SOLO UN COLOR",
  check: (red, blue) => (red > 0 && blue === 0) || (blue > 0 && red === 0),
  time: 2500,
  category: "single-button"
}

// Diferencia específica
{
  text: "ROJO DEBE SUPERAR A AZUL POR 2",
  check: (red, blue) => red - blue === 2,
  time: 4500,
  category: "confusing"
}
```

## 🔧 Modificar Desafíos Existentes

Para modificar un desafío existente:

1. Busca el desafío por su texto
2. Modifica los valores que necesites
3. Guarda el archivo

```typescript
// ANTES
{
  text: "PRESIONA ROJO 2 VECES",
  check: (red, blue) => red === 2 && blue === 0,
  time: 3000,
  category: "multiple-presses",
}

// DESPUÉS (cambiando el tiempo)
{
  text: "PRESIONA ROJO 2 VECES",
  check: (red, blue) => red === 2 && blue === 0,
  time: 2500, // ← Más difícil
  category: "multiple-presses",
}
```

## 🗑️ Eliminar Desafíos

Para eliminar un desafío:

1. Localiza el objeto del desafío en el array
2. Elimina el objeto completo (incluyendo las llaves y la coma)
3. Guarda el archivo

## 🚀 El Juego Se Actualiza Automáticamente

No necesitas hacer nada más. El componente del juego (`game.component.ts`) importa automáticamente los desafíos desde este archivo.
