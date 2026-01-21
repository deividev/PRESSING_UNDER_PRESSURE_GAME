# Button Pressure - Desktop Game

Un juego de reacción rápida y toma de decisiones desarrollado con Angular y Electron.

## 🎮 Descripción

Button Pressure es un juego donde debes seguir las instrucciones del sistema y presionar los botones correctos (ROJO o AZUL) antes de que se acabe el tiempo. ¡Algunas veces no debes presionar nada! Pon a prueba tus reflejos y tu capacidad de lectura rápida para alcanza la fase más alta posible.

## 🚀 Instalación

1. Instala las dependencias:
```bash
npm install
```

## 💻 Desarrollo

### Ejecutar en modo desarrollo web:
```bash
npm start
```
La aplicación se abrirá en `http://localhost:4200`

### Ejecutar con Electron:
```bash
npm run electron-build
```

## 📦 Compilar aplicación de escritorio

### Para Windows:
```bash
npm run dist:win
```

### Para macOS:
```bash
npm run dist:mac
```

### Para Linux:
```bash
npm run dist:linux
```

### Para todas las plataformas:
```bash
npm run dist
```

Los archivos compilados se generarán en la carpeta `release/`.

## 🎯 Características

- ✨ Interfaz industrial/tecnológica con estética retro-futurista
- 🎯 Más de 50 desafíos diferentes
- ⏱️ Timer circular con segmentos LED
- 📊 Sistema de fases progresivas
- 🔴🔵 Dos botones con diferentes desafíos
- 🧠 Instrucciones confusas para ponerte a prueba
- 💻 Aplicación de escritorio nativa
- 🎨 Efectos visuales y animaciones

## 🎮 Cómo jugar

1. Presiona "INICIAR PROTOCOLO" desde el menú
2. Lee la instrucción que aparece en el monitor
3. Presiona el botón ROJO, AZUL, ambos, o ninguno según la instrucción
4. Algunas instrucciones requieren múltiples clics
5. Otras veces debes NO presionar nada
6. ¡Lee bien! Las instrucciones pueden ser confusas
7. El tiempo se reduce conforme avanzas de fase
8. Una sola respuesta incorrecta = SYSTEM FAILURE

## 🛠️ Tecnologías utilizadas

- Angular 17
- Electron 28
- TypeScript
- SCSS
- Electron Builder

## 📝 Scripts disponibles

- `npm start` - Servidor de desarrollo Angular
- `npm run build` - Compilar aplicación Angular
- `npm run electron` - Ejecutar Electron
- `npm run electron-build` - Compilar y ejecutar con Electron
- `npm run pack` - Empaquetar sin crear instalador
- `npm run dist` - Crear instalador para tu plataforma
- `npm run dist:win` - Crear instalador para Windows
- `npm run dist:mac` - Crear instalador para macOS
- `npm run dist:linux` - Crear instalador para Linux

## 📄 Licencia

ISC
