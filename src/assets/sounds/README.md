# Sonidos del Juego

## Lista de archivos de audio necesarios:

### Música de Fondo

- `menu-music.mp3` - Música de fondo del menú (loop, ambiente tranquilo)
- `background-music.mp3` - Música de fondo del juego (loop, tensión)

### Efectos del Menú

- `button-hover.mp3` - Sonido sutil al pasar el ratón sobre un botón
- `button-click.mp3` - Sonido al hacer clic en un botón del menú
- `start-game.mp3` - Sonido especial al iniciar el juego

### Efectos de Botones (Juego)

- `button-red-press.mp3` - Sonido al presionar el botón rojo
- `button-blue-press.mp3` - Sonido al presionar el botón azul

### Efectos de Ronda

- `round-start.mp3` - Sonido al comenzar una nueva ronda
- `round-success.mp3` - Sonido al completar una ronda correctamente
- `round-fail.mp3` - Sonido al fallar una ronda

### Efectos de Alerta

- `timer-warning.mp3` - Sonido cuando queda poco tiempo (50% restante)
- `timer-danger.mp3` - Sonido cuando queda muy poco tiempo (25% restante)
- `timer-critical.mp3` - Sonido cuando el tiempo es crítico (12% restante)

### Efectos de Game Over

- `game-over-explosion.mp3` - Sonido de explosión al perder
- `game-over-glitch.mp3` - Sonido de glitch durante la animación de game over

### Efectos Visuales

- `particle-burst.mp3` - Sonido al generar partículas
- `screen-shake.mp3` - Sonido de vibración con el efecto shake

## Notas:

- Todos los sonidos deben estar en formato MP3
- La música de fondo debe configurarse para hacer loop
- Los efectos deben ser cortos (< 2 segundos) para no saturar
- Volúmenes recomendados:
  - Música del menú: 0.25
  - Música de fondo del juego: 0.3
  - Hover de botones: 0.3
  - Botones del menú: 0.5
  - Botones del juego: 0.5
  - Efectos: 0.6
  - Game Over: 0.8
