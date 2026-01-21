# Estética Industrial Unificada ⚙️

## 📋 Resumen
Se ha unificado toda la interfaz del juego para que mantenga la estética industrial/militar consistente en todos los componentes.

## 🎨 Paleta de Colores

### Colores Principales
- **Background Base**: `linear-gradient(145deg, #2a3544, #1e2733)`
- **Bordes**: `#3a4a5a` (2-3px solid)
- **Borde Hover**: `#4a5a6a`
- **Acento Principal**: `#00ff88` (verde neón)
- **Acento Secundario**: `#00ffaa` (verde neón claro)
- **Acento Terciario**: `#00cc6a` (verde oscuro)

### Colores Secundarios
- **Texto Principal**: `rgba(255, 255, 255, 0.95)`
- **Texto Secundario**: `rgba(255, 255, 255, 0.6)`
- **Texto Terciario**: `rgba(255, 255, 255, 0.4)`
- **Peligro**: `#ff6b6b`
- **Oro**: `#ffd700`
- **Plata**: `#c0c0c0`
- **Bronce**: `#cd7f32`

## 🔧 Características de Diseño

### Texturas Metálicas
```scss
// Textura de metal horizontal
background: repeating-linear-gradient(
  90deg,
  transparent,
  transparent 2px,
  rgba(255, 255, 255, 0.02) 2px,
  rgba(255, 255, 255, 0.02) 4px
);

// Textura de metal diagonal
background: repeating-linear-gradient(
  45deg,
  transparent,
  transparent 10px,
  rgba(255, 255, 255, 0.01) 10px,
  rgba(255, 255, 255, 0.01) 20px
);
```

### Tornillos Decorativos
- Posición: 4 esquinas del panel
- Tamaño: 12px de diámetro
- Efecto: sombra interior para simular profundidad
- Color base: `#4a5a6a`

### Bordes y Radios
- **Border-radius**: 4-8px (no más de 20px)
- **Border-width**: 2-3px
- **Border-style**: solid
- **Box-shadow**: `inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 6px 16px rgba(0, 0, 0, 0.5)`

### Efectos de Iluminación
- **Text-shadow** en acentos: `0 0 20px rgba(0, 255, 136, 0.8), 0 0 40px rgba(0, 255, 136, 0.4)`
- **Box-shadow** en elementos activos: `0 0 20px rgba(0, 255, 136, 0.4)`
- **Drop-shadow** en iconos: `0 0 15px rgba(0, 255, 136, 0.6)`

### Animación Shimmer
```scss
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```
Se aplica en:
- Barras de progreso
- Botones activos
- Elementos seleccionados

## 📁 Archivos Modificados

### 1. **_shared-modal-styles.scss**
Archivo central con todos los mixins reutilizables:

#### Mixins Disponibles
- `@mixin modal-overlay` - Fondo oscuro semitransparente
- `@mixin modal-container` - Contenedor principal del modal con estilo industrial
- `@mixin panel-screws` - Decoración de tornillos en las esquinas
- `@mixin industrial-button($primary: false)` - Botones con estética industrial
- `@mixin status-bar` - Barras de estado con borde y textura
- `@mixin custom-scrollbar` - Scrollbar personalizado

### 2. **tutorial.component.scss** ✅
- Progreso con barra verde neón
- Contador de pasos con estilo industrial
- Botones de navegación unificados
- Ejemplo de código con borde verde izquierdo

### 3. **leaderboard.component.scss** ✅
- Ítems con gradiente metálico
- Top 3 con colores especiales (oro, plata, bronce)
- Hover con desplazamiento horizontal
- Puntuaciones con glow verde

### 4. **stats.component.scss** ✅
- Tarjetas de estadísticas con textura diagonal
- Barras de rendimiento animadas
- Lista de juegos recientes con borde izquierdo verde
- Grid responsivo

### 5. **achievements.component.scss** ✅
- Grid de logros adaptativo
- Pestañas de categorías con estilo industrial
- Tarjetas desbloqueadas con brillo verde
- Tarjetas bloqueadas con escala de grises
- Barras de progreso animadas

### 6. **settings.component.scss** ✅
- Switches personalizados con animación
- Sliders con thumb verde neón
- Botones de dificultad con estado activo
- Secciones con separadores metálicos
- Botón de reset con estilo de peligro

### 7. **menu.component.scss** ✅
- Botones secundarios (🏆📊🎯⚙️) con estética industrial
- Hover con efecto shimmer
- Tamaño uniforme (65x65px)
- Border-radius reducido a 4px

## 🎯 Consistencia Visual

### Todos los Componentes Comparten:
1. **Colores**: Paleta industrial con verde neón (#00ff88)
2. **Bordes**: Sólidos, metálicos, angulares (4-8px radius)
3. **Sombras**: Inset para profundidad, outer para elevación
4. **Texturas**: Líneas metálicas sutiles
5. **Tipografía**: Letter-spacing amplio, uppercase en títulos
6. **Animaciones**: Shimmer en elementos activos, transiciones suaves (0.3s)
7. **Hover**: Transform, border-color, box-shadow
8. **Scrollbars**: Personalizados con estilo industrial

## 📱 Responsividad

### Breakpoint Principal: 768px
```scss
@media (max-width: 768px) {
  // Padding reducido
  .container {
    padding: 30px 20px;
  }
  
  // Font-size reducido
  .title {
    font-size: 2rem;
  }
  
  // Grid a columna única
  .grid {
    grid-template-columns: 1fr;
  }
}
```

## 🔄 Antes y Después

### ❌ Antes
- Bordes redondeados (20px)
- Color cyan (#00ffff)
- Estética futurista/moderna
- Inconsistencia entre componentes

### ✅ Después
- Bordes angulares (4-8px)
- Color verde neón (#00ff88)
- Estética industrial/militar
- Diseño completamente unificado

## 🎮 Componentes del Juego

### Menú Principal
- Panel central con tornillos
- Botones principales con gradiente verde
- Botones secundarios en círculo alrededor
- Texturas metálicas sutiles

### Juego
- Panel de desafíos con bordes metálicos
- Temporizador con barra de progreso verde
- Luces de advertencia (rojo/naranja/amarillo/verde)
- Botones de opción con hover industrial

## 🚀 Resultado Final
Todos los elementos del juego ahora tienen una apariencia cohesiva y profesional con estética industrial/militar, desde el menú principal hasta cada modal de configuración, estadísticas y logros.
