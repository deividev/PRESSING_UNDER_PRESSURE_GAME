# Guía para Obtener Sonidos del Juego

## 📁 Ubicación

Todos los archivos de audio deben colocarse en: `src/assets/sounds/`

## 🎵 Lista Completa de Sonidos Necesarios

### 1. Música de Fondo del Menú

**Archivo:** `menu-music.mp3`

- **Descripción:** Música ambiental tranquila para el menú principal e instrucciones
- **Duración sugerida:** 30-60 segundos
- **Estilo:** Electrónica suave, ambiente relajado, sin mucha tensión
- **Volumen configurado:** 25% (0.25)
- **Loop:** ✅ SÍ (reproducción continua)
- **Cuándo suena:** Al cargar el menú, se detiene al iniciar el juego

---

### 2. Música de Fondo del Juego

**Archivo:** `background-music.mp3`

- **Descripción:** Música electrónica/techno intensa que aumenta la tensión
- **Duración sugerida:** 30-60 segundos
- **Estilo:** Tensión constante, ritmo rápido, beats agresivos
- **Volumen configurado:** 30% (0.3)
- **Loop:** ✅ SÍ (reproducción continua)
- **Cuándo suena:** Durante toda la partida, se detiene en Game Over

---

### 3. Efectos del Menú

**Archivo:** `button-hover.mp3`

- **Descripción:** Sonido sutil al pasar el ratón sobre cualquier botón del menú
- **Duración:** 0.1-0.2 segundos
- **Estilo:** "Beep" muy suave, sutil, UI minimalista
- **Volumen configurado:** 30% (0.3)
- **Loop:** ❌ NO
- **Cuándo suena:** Al pasar el cursor sobre botones del menú

**Archivo:** `button-click.mp3`

- **Descripción:** Sonido de clic al presionar botones del menú (excepto Iniciar)
- **Duración:** 0.2-0.3 segundos
- **Estilo:** "Click" mecánico o electrónico, UI estándar
- **Volumen configurado:** 50% (0.5)
- **Loop:** ❌ NO
- **Cuándo suena:** Al hacer clic en "Instrucciones" o "Volver"

**Archivo:** `start-game.mp3`

- **Descripción:** Sonido especial al iniciar el protocolo del juego
- **Duración:** 0.5-0.8 segundos
- **Estilo:** Tono ascendente, potente, energético, inicio épico
- **Volumen configurado:** 50% (0.5)
- **Loop:** ❌ NO
- **Cuándo suena:** Al presionar "INICIAR PROTOCOLO"

---

### 4. Botones del Juego

**Archivo:** `button-red-press.mp3`

- **Descripción:** Sonido al presionar el botón rojo durante el juego
- **Duración:** 0.1-0.3 segundos
- **Estilo:** "Clack" o "Thunk" mecánico, pitch grave/bajo
- **Volumen configurado:** 50% (0.5)
- **Loop:** ❌ NO
- **Cuándo suena:** Cada vez que se presiona el botón rojo

**Archivo:** `button-blue-press.mp3`

- **Descripción:** Sonido al presionar el botón azul durante el juego
- **Duración:** 0.1-0.3 segundos
- **Estilo:** "Click" o "Beep" electrónico, pitch agudo/alto
- **Volumen configurado:** 50% (0.5)
- **Loop:** ❌ NO
- **Cuándo suena:** Cada vez que se presiona el botón azul

---

### 5. Efectos de Ronda

**Archivo:** `round-start.mp3`

- **Descripción:** Pitido de inicio de una nueva ronda/desafío
- **Duración:** 0.3-0.5 segundos
- **Estilo:** "Beep" corto y claro, ascendente, atención
- **Volumen configurado:** 60% (0.6)
- **Loop:** ❌ NO
- **Cuándo suena:** Al comenzar cada nueva ronda con un nuevo desafío

**Archivo:** `round-success.mp3`

- **Descripción:** Tono de éxito al completar correctamente una ronda
- **Duración:** 0.5-0.8 segundos
- **Estilo:** "Ding" o acordes ascendentes, celebratorio, victoria
- **Volumen configurado:** 60% (0.6)
- **Loop:** ❌ NO
- **Cuándo suena:** Al completar exitosamente el desafío de la ronda

**Archivo:** `round-fail.mp3`

- **Descripción:** Sonido de error al fallar una ronda
- **Duración:** 0.5-0.8 segundos
- **Estilo:** "Buzz" o tonos descendentes, negativo, decepción
- **Volumen configurado:** 60% (0.6)
- **Loop:** ❌ NO
- **Cuándo suena:** Al fallar el desafío (antes del Game Over)

---

### 6. Alertas de Tiempo

**Archivo:** `timer-warning.mp3`

- **Descripción:** Primera alerta cuando queda el 50% del tiempo
- **Duración:** 0.2-0.4 segundos
- **Estilo:** "Beep" único, suave pero perceptible
- **Volumen configurado:** 60% (0.6)
- **Loop:** ❌ NO (solo suena una vez por ronda)
- **Cuándo suena:** Cuando quedan 50% o menos del tiempo de ronda

**Archivo:** `timer-danger.mp3`

- **Descripción:** Segunda alerta cuando queda el 25% del tiempo
- **Duración:** 0.3-0.5 segundos
- **Estilo:** "Beep-beep" doble, más urgente, más rápido
- **Volumen configurado:** 60% (0.6)
- **Loop:** ❌ NO (solo suena una vez por ronda)
- **Cuándo suena:** Cuando quedan 25% o menos del tiempo de ronda

**Archivo:** `timer-critical.mp3`

- **Descripción:** Alerta crítica cuando queda el 12% del tiempo
- **Duración:** 0.5-0.8 segundos
- **Estilo:** Sirena o "beeps" rápidos, máxima urgencia, alarma
- **Volumen configurado:** 60% (0.6)
- **Loop:** ❌ NO (solo suena una vez por ronda)
- **Cuándo suena:** Cuando quedan 12% o menos del tiempo (con chromatic aberration)

---

### 7. Game Over

**Archivo:** `game-over-explosion.mp3`

- **Descripción:** Explosión dramática al perder el juego
- **Duración:** 1-2 segundos
- **Estilo:** "Boom" o explosión electrónica, impacto fuerte
- **Volumen configurado:** 80% (0.8)
- **Loop:** ❌ NO
- **Cuándo suena:** Inmediatamente al perder, inicio de la secuencia de Game Over

**Archivo:** `game-over-glitch.mp3`

- **Descripción:** Sonido de glitch/error del sistema durante animación
- **Duración:** 0.5-1 segundo
- **Estilo:** Ruido estático, pitch shifter, distorsión, fallo técnico
- **Volumen configurado:** 80% (0.8)
- **Loop:** ❌ NO
- **Cuándo suena:** Durante la animación de glitch del Game Over (100ms después)

---

### 8. Efectos Visuales

**Archivo:** `particle-burst.mp3`

- **Descripción:** Sonido de explosión de partículas al hacer clic en botones
- **Duración:** 0.2-0.4 segundos
- **Estilo:** "Whoosh" o "Pop" suave, explosión ligera
- **Volumen configurado:** 60% (0.6)
- **Loop:** ❌ NO
- **Cuándo suena:** Cada vez que se generan partículas (clicks en botones)

**Archivo:** `screen-shake.mp3`

- **Descripción:** Vibración/temblor con el efecto de cámara
- **Duración:** 0.5 segundos
- **Estilo:** Ruido grave de vibración, rumble
- **Volumen configurado:** 60% (0.6)
- **Loop:** ❌ NO
- **Cuándo suena:** Con el efecto de screen shake (al fallar una ronda)

---

## 📊 Resumen Total

**Total de archivos necesarios:** 17 archivos MP3

- 2 músicas de fondo (loop)
- 3 efectos del menú
- 2 efectos de botones del juego
- 3 efectos de ronda
- 3 alertas de tiempo
- 2 efectos de Game Over
- 2 efectos visuales

## 🌐 Sitios Recomendados para Descargar Sonidos Gratuitos

1. **Freesound.org** (https://freesound.org/)
   - Biblioteca masiva de efectos de sonido
   - Licencia Creative Commons
   - Búsqueda por categorías

2. **Zapsplat** (https://www.zapsplat.com/)
   - Sonidos de alta calidad
   - Categorías específicas de juegos
   - Gratis con atribución

3. **Mixkit** (https://mixkit.co/free-sound-effects/)
   - Efectos modernos y de calidad
   - Sin atribución requerida
   - Ideal para música de fondo

4. **BBC Sound Effects** (https://sound-effects.bbcrewind.co.uk/)
   - Archivo histórico de la BBC
   - Sonidos únicos
   - Uso personal y educativo

5. **Pixabay** (https://pixabay.com/sound-effects/)
   - Sonidos libres de derechos
   - Sin registro necesario
   - Buena selección de efectos

## 🔍 Términos de Búsqueda Sugeridos

- **Música del menú:** "ambient menu music", "soft electronic music", "menu background loop"
- **Música del juego:** "techno loop", "electronic tension", "cyberpunk music"
- **Botones del menú:** "ui hover sound", "menu click", "interface beep"
- **Botones del juego:** "button click", "mechanical switch", "press button"
- **Éxito/Fallo:** "success beep", "error buzz", "win sound", "fail sound"
- **Alertas:** "alarm beep", "warning sound", "urgent alarm"
- **Game Over:** "explosion", "glitch sound", "system error"
- **Efectos:** "particle burst", "whoosh", "screen shake", "rumble"

## ⚙️ Configuración Actual de Volúmenes

```typescript
- Música del menú: 0.25 (25%)
- Música de fondo del juego: 0.3 (30%)
- Hover de botones: 0.3 (30%)
- Botones del menú: 0.5 (50%)
- Botones del juego: 0.5 (50%)
- Efectos de ronda: 0.6 (60%)
- Alertas de tiempo: 0.6 (60%)
- Game Over: 0.8 (80%)
- Efectos visuales: 0.6 (60%)
```

## 📝 Notas Importantes

1. **Formato:** Todos los archivos deben ser `.mp3`
2. **Calidad:** Bitrate recomendado: 128-192 kbps
3. **Normalización:** Normalizar todos los sonidos para evitar variaciones bruscas de volumen
4. **Nombres exactos:** Los nombres de archivo DEBEN coincidir exactamente con los listados
5. **Licencia:** Asegúrate de usar sonidos con licencia apropiada (Creative Commons o dominio público)

### Menú:

- La música del menú inicia al cargar (si el navegador lo permite) o con el primer hover
- Sonido de hover cada vez que pasas el ratón sobre un botón
- Sonido de click al presionar botones del menú
- Sonido especial al iniciar el juego
- La música del menú se detiene al iniciar el juego

### Juego:

## 🎮 Comportamiento del Audio en el Juego

- La música de fondo inicia cuando comienza el juego y se detiene en Game Over
- Los sonidos de botones se reproducen cada vez que se presiona (pueden solaparse)
- Las alertas de tiempo solo suenan una vez por nivel de advertencia
- Los efectos de Game Over se reproducen en secuencia con las animaciones
- El sonido de partículas se activa con cada click en los botones

## 🚀 Para Testear

Después de colocar los archivos de audio:

1. Abre la consola del navegador (F12)
2. Si hay errores de carga, verificará los nombres de archivo
3. Ajusta los volúmenes en el código si es necesario editando la función `getVolumeForSound()`
