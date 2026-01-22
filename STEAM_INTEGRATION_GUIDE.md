# Guía de Integración con Steam - Pressing Under Pressure

Esta guía te llevará paso a paso para integrar tu juego con Steam, incluyendo logros y leaderboards.

## 📋 Pre-requisitos

1. **Cuenta de Steam Partner** (Steamworks)
   - Registrarse en: https://partner.steamgames.com/
   - Coste: $100 USD por aplicación (pago único)
   - Tiempo de aprobación: 30 días aproximadamente

2. **App ID de Steam**
   - Una vez aprobado, recibirás un App ID único
   - Este ID se usará en toda la integración

3. **Steamworks SDK**
   - Descargar desde: https://partner.steamgames.com/
   - Incluye bibliotecas para Windows, Mac y Linux

---

## 🎯 PASO 1: Compilar con Electron (VERIFICACIÓN)

Tu proyecto ya está configurado correctamente. Para generar el ejecutable:

### Generar ejecutable de Windows (.exe)

```bash
# Instalar dependencias si no están instaladas
npm install

# Compilar para Windows
npm run dist:win
```

El ejecutable se generará en: `release/Button Pressure Setup X.X.X.exe`

### Opciones de distribución

- **NSIS Installer**: Instalador completo con desinstalador
- **Portable**: Ejecutable sin instalación (release/win-unpacked/)

### Verificación

```bash
# Probar localmente antes de compilar
npm run electron-build
```

---

## 🎮 PASO 2: Integrar Steamworks SDK

### 2.1 Instalar Greenworks (Wrapper de Steamworks para Node.js)

```bash
npm install greenworks --save
```

**IMPORTANTE**: Greenworks requiere compilación nativa. Alternativa recomendada:

```bash
npm install steamworks.js --save
```

### 2.2 Crear servicio de Steam

Crear archivo: `src/app/services/steam.service.ts`

```typescript
import { Injectable } from "@angular/core";

declare const window: any;

export interface SteamUser {
  steamId: string;
  personaName: string;
  avatarUrl: string;
}

export interface SteamAchievement {
  id: string;
  name: string;
  description: string;
  achieved: boolean;
  unlockTime?: number;
}

@Injectable({
  providedIn: "root",
})
export class SteamService {
  private steamworks: any = null;
  private isInitialized = false;
  private appId: string = "YOUR_STEAM_APP_ID"; // Reemplazar con tu App ID real

  constructor() {
    this.initializeSteam();
  }

  private initializeSteam(): void {
    try {
      // Verificar si estamos en Electron con Steam
      if (window.electron && window.electron.steam) {
        this.steamworks = window.electron.steam;
        this.isInitialized = true;
        console.log("Steam SDK inicializado correctamente");
      } else {
        console.warn("Steam SDK no disponible (modo desarrollo)");
      }
    } catch (error) {
      console.error("Error inicializando Steam:", error);
    }
  }

  /**
   * Verifica si Steam está disponible
   */
  isSteamAvailable(): boolean {
    return this.isInitialized && this.steamworks !== null;
  }

  /**
   * Obtiene información del usuario de Steam
   */
  getCurrentUser(): SteamUser | null {
    if (!this.isSteamAvailable()) return null;

    try {
      const steamId = this.steamworks.getSteamId();
      const personaName = this.steamworks.getPersonaName();
      const avatarUrl = this.steamworks.getMediumAvatarUrl();

      return {
        steamId,
        personaName,
        avatarUrl,
      };
    } catch (error) {
      console.error("Error obteniendo usuario de Steam:", error);
      return null;
    }
  }

  /**
   * Desbloquea un logro
   */
  unlockAchievement(achievementId: string): boolean {
    if (!this.isSteamAvailable()) {
      console.log(`[DEV] Logro desbloqueado: ${achievementId}`);
      return false;
    }

    try {
      this.steamworks.activateAchievement(achievementId);
      console.log(`Logro desbloqueado en Steam: ${achievementId}`);
      return true;
    } catch (error) {
      console.error(`Error desbloqueando logro ${achievementId}:`, error);
      return false;
    }
  }

  /**
   * Obtiene todos los logros del usuario
   */
  getAchievements(): SteamAchievement[] {
    if (!this.isSteamAvailable()) return [];

    try {
      return this.steamworks.getAchievements();
    } catch (error) {
      console.error("Error obteniendo logros:", error);
      return [];
    }
  }

  /**
   * Sube una puntuación al leaderboard
   */
  uploadScore(
    leaderboardName: string,
    score: number,
    method: "KeepBest" | "ForceUpdate" = "KeepBest",
  ): void {
    if (!this.isSteamAvailable()) {
      console.log(`[DEV] Puntuación subida: ${leaderboardName} = ${score}`);
      return;
    }

    try {
      this.steamworks.uploadScore(leaderboardName, score, method);
      console.log(`Puntuación subida a Steam: ${leaderboardName} = ${score}`);
    } catch (error) {
      console.error("Error subiendo puntuación:", error);
    }
  }

  /**
   * Descarga puntuaciones del leaderboard
   */
  async downloadScores(
    leaderboardName: string,
    requestType: "Global" | "GlobalAroundUser" | "Friends" = "Global",
    rangeStart: number = 0,
    rangeEnd: number = 10,
  ): Promise<any[]> {
    if (!this.isSteamAvailable()) {
      console.log("[DEV] Descargando puntuaciones...");
      return this.getMockScores();
    }

    try {
      return await this.steamworks.downloadScores(
        leaderboardName,
        requestType,
        rangeStart,
        rangeEnd,
      );
    } catch (error) {
      console.error("Error descargando puntuaciones:", error);
      return [];
    }
  }

  /**
   * Obtiene el ranking del usuario
   */
  async getUserRank(leaderboardName: string): Promise<number> {
    if (!this.isSteamAvailable()) return -1;

    try {
      const scores = await this.downloadScores(
        leaderboardName,
        "GlobalAroundUser",
        -1,
        1,
      );
      return scores[0]?.rank || -1;
    } catch (error) {
      console.error("Error obteniendo ranking:", error);
      return -1;
    }
  }

  /**
   * Datos de prueba para desarrollo
   */
  private getMockScores(): any[] {
    return [
      {
        rank: 1,
        steamId: "76561198000000001",
        personaName: "ProGamer",
        score: 50000,
      },
      {
        rank: 2,
        steamId: "76561198000000002",
        personaName: "SpeedRunner",
        score: 45000,
      },
      {
        rank: 3,
        steamId: "76561198000000003",
        personaName: "AcePlayer",
        score: 40000,
      },
      {
        rank: 4,
        steamId: "76561198000000004",
        personaName: "EliteGamer",
        score: 35000,
      },
      {
        rank: 5,
        steamId: "76561198000000005",
        personaName: "MasterChi",
        score: 30000,
      },
    ];
  }
}
```

### 2.3 Actualizar main.js de Electron

```javascript
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");

// Intentar cargar Steamworks
let steamworks = null;
try {
  steamworks = require("steamworks.js");
  console.log("Steamworks cargado correctamente");
} catch (error) {
  console.log("Steamworks no disponible (modo desarrollo)");
}

let mainWindow;

function createWindow() {
  // Inicializar Steam si está disponible
  if (steamworks) {
    try {
      const client = steamworks.init(YOUR_APP_ID); // Reemplazar con tu App ID
      console.log("Steam inicializado. Usuario:", client.localplayer.getName());
    } catch (error) {
      console.error("Error inicializando Steam:", error);
    }
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "build/icon.png"),
  });

  // Cargar la aplicación Angular
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(
        __dirname,
        "dist/pressing-under-pressure/browser/index.html",
      ),
      protocol: "file:",
      slashes: true,
    });

  mainWindow.loadURL(startUrl);

  // Abrir DevTools en modo desarrollo
  if (process.env.ELECTRON_START_URL) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

// IPC Handlers para comunicación con el renderer
if (steamworks) {
  ipcMain.handle("steam:get-user", () => {
    try {
      const client = steamworks.init(YOUR_APP_ID);
      return {
        steamId: client.localplayer.getSteamId().steamId64,
        personaName: client.localplayer.getName(),
        avatarUrl: client.localplayer.getMediumAvatarUrl(),
      };
    } catch (error) {
      return null;
    }
  });

  ipcMain.handle("steam:unlock-achievement", (event, achievementId) => {
    try {
      const client = steamworks.init(YOUR_APP_ID);
      client.achievement.activate(achievementId);
      return true;
    } catch (error) {
      console.error("Error desbloqueando logro:", error);
      return false;
    }
  });

  ipcMain.handle("steam:upload-score", (event, leaderboardName, score) => {
    try {
      const client = steamworks.init(YOUR_APP_ID);
      client.leaderboard.uploadScore(leaderboardName, score);
      return true;
    } catch (error) {
      console.error("Error subiendo puntuación:", error);
      return false;
    }
  });

  ipcMain.handle(
    "steam:download-scores",
    async (event, leaderboardName, rangeStart, rangeEnd) => {
      try {
        const client = steamworks.init(YOUR_APP_ID);
        const scores = await client.leaderboard.downloadScores(
          leaderboardName,
          rangeStart,
          rangeEnd,
        );
        return scores;
      } catch (error) {
        console.error("Error descargando puntuaciones:", error);
        return [];
      }
    },
  );
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
```

### 2.4 Actualizar preload.js

```javascript
const { contextBridge, ipcRenderer } = require("electron");

// Exponer API de Steam al renderer de forma segura
contextBridge.exposeInMainWorld("electron", {
  steam: {
    getUser: () => ipcRenderer.invoke("steam:get-user"),
    unlockAchievement: (achievementId) =>
      ipcRenderer.invoke("steam:unlock-achievement", achievementId),
    uploadScore: (leaderboardName, score) =>
      ipcRenderer.invoke("steam:upload-score", leaderboardName, score),
    downloadScores: (leaderboardName, rangeStart, rangeEnd) =>
      ipcRenderer.invoke(
        "steam:download-scores",
        leaderboardName,
        rangeStart,
        rangeEnd,
      ),
  },
});
```

---

## 🏆 PASO 3: Configurar Logros en Steamworks

### 3.1 En Steamworks Admin Panel

1. Ir a **Steamworks Partner** → Tu aplicación → **Stats & Achievements**
2. Configurar logros:

```
ID: FIRST_WIN
Name: First Victory
Description: Win your first round
Icon: 64x64 PNG (normal + gray version)

ID: STREAK_10
Name: Hot Streak
Description: Complete 10 rounds in a row
Icon: 64x64 PNG

ID: SPEED_DEMON
Name: Speed Demon
Description: Complete a round in under 1 second
Icon: 64x64 PNG

ID: PERFECTIONIST
Name: Perfectionist
Description: Reach round 50
Icon: 64x64 PNG

... (configurar todos los logros necesarios)
```

### 3.2 Integrar en achievements.service.ts

```typescript
import { SteamService } from './steam.service';

// Mapeo de logros locales a IDs de Steam
private readonly STEAM_ACHIEVEMENT_MAP = {
  'first_win': 'FIRST_WIN',
  'streak_10': 'STREAK_10',
  'speed_demon': 'SPEED_DEMON',
  'perfectionist': 'PERFECTIONIST',
  'round_10': 'SURVIVOR_10',
  'round_25': 'SURVIVOR_25',
  'high_score_1000': 'HIGH_SCORER',
  // ... resto de mapeos
};

constructor(
  private storage: StorageService,
  private steamService: SteamService // Inyectar SteamService
) {
  this.achievements = this.loadAchievements();
}

private unlockAchievement(id: string): void {
  const achievement = this.achievements.find((a) => a.id === id);
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
    this.saveAchievements();

    // Desbloquear en Steam
    const steamAchievementId = this.STEAM_ACHIEVEMENT_MAP[id];
    if (steamAchievementId) {
      this.steamService.unlockAchievement(steamAchievementId);
    }

    return [achievement];
  }
  return [];
}
```

---

## 📊 PASO 4: Configurar Leaderboards

### 4.1 En Steamworks Admin Panel

1. Ir a **Stats & Achievements** → **Leaderboards**
2. Crear leaderboards:

```
Name: HighScores
Sort Method: Descending (mayor es mejor)
Display Type: Numeric
Write Permission: Trusted
Read Permission: Anyone

Name: BestRound
Sort Method: Descending
Display Type: Numeric

Name: FastestWin
Sort Method: Ascending (menor es mejor)
Display Type: Time (Seconds)
```

### 4.2 Modificar player-stats.service.ts

```typescript
import { SteamService } from './steam.service';

constructor(
  private storage: StorageService,
  private steamService: SteamService
) {
  this.loadStats();
}

saveGameSession(session: GameSession): void {
  this.sessions.push(session);
  this.updateBestScores(session);
  this.storage.set(this.SESSIONS_KEY, this.sessions);

  // Subir puntuación a Steam
  if (this.steamService.isSteamAvailable()) {
    this.steamService.uploadScore('HighScores', session.score);
    this.steamService.uploadScore('BestRound', session.rounds);
  }
}
```

### 4.3 Actualizar scoreboard.component.ts para mostrar ranking de Steam

```typescript
import { SteamService } from "../../services/steam.service";

export class ScoreboardComponent implements OnInit {
  steamScores: any[] = [];
  userRank: number = -1;
  showingGlobal = true;

  constructor(
    private statsService: PlayerStatsService,
    private steamService: SteamService,
    public translationService: TranslationService,
  ) {}

  async ngOnInit() {
    this.loadSessions();
    await this.loadSteamScores();
  }

  async loadSteamScores() {
    if (this.steamService.isSteamAvailable()) {
      this.steamScores = await this.steamService.downloadScores(
        "HighScores",
        "Global",
        0,
        100,
      );
      this.userRank = await this.steamService.getUserRank("HighScores");
    }
  }

  async toggleLeaderboardView() {
    this.showingGlobal = !this.showingGlobal;
    if (this.showingGlobal) {
      this.steamScores = await this.steamService.downloadScores(
        "HighScores",
        "Global",
        0,
        100,
      );
    } else {
      this.steamScores = await this.steamService.downloadScores(
        "HighScores",
        "Friends",
        0,
        100,
      );
    }
  }
}
```

---

## 📦 PASO 5: Preparar para Distribución en Steam

### 5.1 Crear archivo steam_appid.txt

Crear en la raíz del proyecto: `steam_appid.txt`

```
YOUR_APP_ID
```

Este archivo debe estar junto al ejecutable para desarrollo.

### 5.2 Actualizar package.json build config

```json
"build": {
  "appId": "com.pressingunderpressure.app",
  "productName": "Pressing Under Pressure",
  "directories": {
    "output": "release",
    "buildResources": "build"
  },
  "files": [
    "dist/**/*",
    "main.js",
    "preload.js",
    "steam_appid.txt",
    "node_modules/steamworks.js/**/*"
  ],
  "extraFiles": [
    {
      "from": "node_modules/steamworks.js/lib",
      "to": ".",
      "filter": ["*.dll", "*.so", "*.dylib"]
    }
  ],
  "win": {
    "target": ["nsis", "portable"],
    "icon": "build/icon.png"
  }
}
```

### 5.3 Compilar para Steam

```bash
# Compilar versión de producción
npm run dist:win

# El ejecutable estará en: release/
```

### 5.4 Subir a Steamworks

1. Ir a **Steamworks Partner** → Tu app → **Builds**
2. Usar **SteamPipe** para subir tu build:

   ```bash
   steamcmd +login <username> +run_app_build <script_path> +quit
   ```

3. Configurar depots (contenido del juego):
   - Windows: Tu ejecutable + DLLs
   - Mac: Bundle .app
   - Linux: AppImage

---

## ✅ Checklist Final

Antes de lanzar en Steam:

- [ ] App ID configurado correctamente
- [ ] Todos los logros configurados en Steamworks
- [ ] Leaderboards creados y probados
- [ ] Iconos de logros subidos (64x64 PNG)
- [ ] Store page completa (descripción, capturas, videos)
- [ ] Precio configurado
- [ ] Release date establecida
- [ ] Build subida y probada en Steam
- [ ] Beta testers probaron la integración
- [ ] Cumple con políticas de Steam

---

## 🐛 Troubleshooting

### Error: "Steam API failed to initialize"

- Verificar que steam_appid.txt existe
- Verificar que Steam client está corriendo
- Verificar que el App ID es correcto

### Logros no se desbloquean

- Verificar configuración en Steamworks Admin
- Verificar que los IDs coinciden exactamente
- Revisar logs de Electron

### Leaderboards no cargan

- Verificar permisos de lectura/escritura
- Verificar que el leaderboard existe en Steamworks
- Esperar unos minutos (puede haber delay)

---

## 📚 Recursos Adicionales

- [Steamworks Documentation](https://partner.steamgames.com/doc/home)
- [Steamworks.js GitHub](https://github.com/ceifa/steamworks.js)
- [Electron Builder Docs](https://www.electron.build/)
- [Steam Leaderboards Guide](https://partner.steamgames.com/doc/features/leaderboards)

---

## 💰 Costos Aproximados

- **Steam Partner**: $100 USD (pago único)
- **Total para lanzar**: $100 USD + tiempo de desarrollo

## ⏱️ Timeline Estimado

1. Registro en Steam Partner: 1-2 días
2. Aprobación: 30 días
3. Integración técnica: 3-5 días
4. Testing: 1-2 semanas
5. Store page y materiales: 1-2 días
6. Review de Steam: 1-3 días

**Total**: ~6 semanas desde el registro hasta el lanzamiento
