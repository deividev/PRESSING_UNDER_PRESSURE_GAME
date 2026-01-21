// Estado del juego
let score = 0;
let round = 1;
let currentChallenge = null;
let timerInterval = null;
let redPresses = 0;
let bluePresses = 0;
let gameActive = false;
let totalSegments = 40; // Número de segmentos en el círculo
let segments = [];

// Elementos DOM
const scoreElement = document.getElementById('score');
const roundElement = document.getElementById('round');
const instructionElement = document.getElementById('instruction');
const circularTimer = document.getElementById('circularTimer');
const redButton = document.getElementById('redButton');
const blueButton = document.getElementById('blueButton');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverReason = document.getElementById('gameOverReason');
const finalScoreElement = document.getElementById('finalScore');
const finalRoundElement = document.getElementById('finalRound');

// Crear segmentos del timer rectangular
function createTimerSegments() {
    circularTimer.innerHTML = '';
    segments = [];
    
    const segmentWidth = 20;  // Ancho más grande
    const segmentHeight = 32; // Alto más grande
    const gap = 4;
    
    // Calcular cuántos segmentos caben en cada lado
    const segmentsPerSide = Math.floor(totalSegments / 4);
    
    for (let i = 0; i < totalSegments; i++) {
        const segment = document.createElement('div');
        segment.className = 'timer-segment-circle active';
        
        const side = Math.floor(i / segmentsPerSide);
        const indexInSide = i % segmentsPerSide;
        
        // Posicionar según el lado (arriba, derecha, abajo, izquierda)
        if (side === 0) {
            // Lado superior
            segment.style.width = segmentWidth + 'px';
            segment.style.height = segmentHeight + 'px';
            segment.style.left = `calc(${(indexInSide / segmentsPerSide) * 100}%)`;
            segment.style.top = '0';
        } else if (side === 1) {
            // Lado derecho
            segment.style.width = segmentHeight + 'px';
            segment.style.height = segmentWidth + 'px';
            segment.style.right = '0';
            segment.style.top = `calc(${(indexInSide / segmentsPerSide) * 100}%)`;
        } else if (side === 2) {
            // Lado inferior (invertido)
            segment.style.width = segmentWidth + 'px';
            segment.style.height = segmentHeight + 'px';
            segment.style.right = `calc(${(indexInSide / segmentsPerSide) * 100}%)`;
            segment.style.bottom = '0';
        } else {
            // Lado izquierdo
            segment.style.width = segmentHeight + 'px';
            segment.style.height = segmentWidth + 'px';
            segment.style.left = '0';
            segment.style.bottom = `calc(${(indexInSide / segmentsPerSide) * 100}%)`;
        }
        
        circularTimer.appendChild(segment);
        segments.push(segment);
    }
}

// Desafíos del juego
const challenges = [
    // NO presionar (6)
    {
        text: "¡NO PRESIONES NADA!",
        check: () => redPresses === 0 && bluePresses === 0,
        time: 3000
    },
    {
        text: "¡MANOS QUIETAS!",
        check: () => redPresses === 0 && bluePresses === 0,
        time: 2500
    },
    {
        text: "NO TOQUES LOS BOTONES",
        check: () => redPresses === 0 && bluePresses === 0,
        time: 2800
    },
    {
        text: "¡QUIETO!",
        check: () => redPresses === 0 && bluePresses === 0,
        time: 2200
    },
    {
        text: "¡ESPERA!",
        check: () => redPresses === 0 && bluePresses === 0,
        time: 2400
    },
    {
        text: "¡NO HAGAS NADA!",
        check: () => redPresses === 0 && bluePresses === 0,
        time: 2600
    },
    
    // Presionar un botón específico (8)
    {
        text: "PRESIONA ROJO",
        check: () => redPresses >= 1 && bluePresses === 0,
        time: 2500
    },
    {
        text: "PRESIONA AZUL",
        check: () => bluePresses >= 1 && redPresses === 0,
        time: 2500
    },
    {
        text: "SOLO ROJO",
        check: () => redPresses >= 1 && bluePresses === 0,
        time: 2000
    },
    {
        text: "SOLO AZUL",
        check: () => bluePresses >= 1 && redPresses === 0,
        time: 2000
    },
    {
        text: "ACTIVA SISTEMA ROJO",
        check: () => redPresses >= 1 && bluePresses === 0,
        time: 2300
    },
    {
        text: "ACTIVA SISTEMA AZUL",
        check: () => bluePresses >= 1 && redPresses === 0,
        time: 2300
    },
    {
        text: "ELIGE ROJO",
        check: () => redPresses >= 1 && bluePresses === 0,
        time: 2100
    },
    {
        text: "ELIGE AZUL",
        check: () => bluePresses >= 1 && redPresses === 0,
        time: 2100
    },
    
    // Presionar varias veces (10)
    {
        text: "PRESIONA ROJO 2 VECES",
        check: () => redPresses === 2 && bluePresses === 0,
        time: 3000
    },
    {
        text: "PRESIONA AZUL 2 VECES",
        check: () => bluePresses === 2 && redPresses === 0,
        time: 3000
    },
    {
        text: "PRESIONA ROJO 3 VECES",
        check: () => redPresses === 3 && bluePresses === 0,
        time: 3500
    },
    {
        text: "PRESIONA AZUL 3 VECES",
        check: () => bluePresses === 3 && redPresses === 0,
        time: 3500
    },
    {
        text: "ROJO 4 VECES",
        check: () => redPresses === 4 && bluePresses === 0,
        time: 4000
    },
    {
        text: "AZUL 4 VECES",
        check: () => bluePresses === 4 && redPresses === 0,
        time: 4000
    },
    {
        text: "ROJO 5 VECES",
        check: () => redPresses === 5 && bluePresses === 0,
        time: 4500
    },
    {
        text: "AZUL 5 VECES",
        check: () => bluePresses === 5 && redPresses === 0,
        time: 4500
    },
    {
        text: "PULSA ROJO AL MENOS 3 VECES",
        check: () => redPresses >= 3 && bluePresses === 0,
        time: 3500
    },
    {
        text: "PULSA AZUL AL MENOS 3 VECES",
        check: () => bluePresses >= 3 && redPresses === 0,
        time: 3500
    },
    
    // Presionar ambos (8)
    {
        text: "PRESIONA AMBOS BOTONES",
        check: () => redPresses >= 1 && bluePresses >= 1,
        time: 3000
    },
    {
        text: "ROJO 1 VEZ, AZUL 1 VEZ",
        check: () => redPresses === 1 && bluePresses === 1,
        time: 3500
    },
    {
        text: "ROJO 2 VECES, AZUL 1 VEZ",
        check: () => redPresses === 2 && bluePresses === 1,
        time: 4000
    },
    {
        text: "AZUL 2 VECES, ROJO 1 VEZ",
        check: () => bluePresses === 2 && redPresses === 1,
        time: 4000
    },
    {
        text: "AMBOS AL MENOS 2 VECES",
        check: () => redPresses >= 2 && bluePresses >= 2,
        time: 4500
    },
    {
        text: "ACTIVA AMBOS SISTEMAS",
        check: () => redPresses >= 1 && bluePresses >= 1,
        time: 3200
    },
    {
        text: "ROJO 3 VECES, AZUL 2 VECES",
        check: () => redPresses === 3 && bluePresses === 2,
        time: 4500
    },
    {
        text: "AZUL 3 VECES, ROJO 2 VECES",
        check: () => bluePresses === 3 && redPresses === 2,
        time: 4500
    },
    
    // Instrucciones confusas/negativas (12)
    {
        text: "NO PRESIONES ROJO",
        check: () => redPresses === 0,
        time: 2500
    },
    {
        text: "NO PRESIONES AZUL",
        check: () => bluePresses === 0,
        time: 2500
    },
    {
        text: "PRESIONA EL QUE NO ES ROJO",
        check: () => bluePresses >= 1 && redPresses === 0,
        time: 3000
    },
    {
        text: "PRESIONA EL QUE NO ES AZUL",
        check: () => redPresses >= 1 && bluePresses === 0,
        time: 3000
    },
    {
        text: "ROJO MÁS QUE AZUL",
        check: () => redPresses > bluePresses && redPresses > 0,
        time: 4000
    },
    {
        text: "AZUL MÁS QUE ROJO",
        check: () => bluePresses > redPresses && bluePresses > 0,
        time: 4000
    },
    {
        text: "ROJO, PERO NO AZUL",
        check: () => redPresses >= 1 && bluePresses === 0,
        time: 2800
    },
    {
        text: "PRESIONA ROJO O NO HAGAS NADA",
        check: () => bluePresses === 0,
        time: 3000
    },
    {
        text: "EVITA ROJO",
        check: () => redPresses === 0,
        time: 2200
    },
    {
        text: "EVITA AZUL",
        check: () => bluePresses === 0,
        time: 2200
    },
    {
        text: "CUALQUIERA MENOS ROJO",
        check: () => redPresses === 0,
        time: 2600
    },
    {
        text: "CUALQUIERA MENOS AZUL",
        check: () => bluePresses === 0,
        time: 2600
    },
    
    // Conteos específicos (6)
    {
        text: "EXACTAMENTE 1 CLIC EN TOTAL",
        check: () => (redPresses + bluePresses) === 1,
        time: 3000
    },
    {
        text: "EXACTAMENTE 2 CLICS EN TOTAL",
        check: () => (redPresses + bluePresses) === 2,
        time: 3500
    },
    {
        text: "EXACTAMENTE 3 CLICS EN TOTAL",
        check: () => (redPresses + bluePresses) === 3,
        time: 4000
    },
    {
        text: "TOTAL: 4 CLICS",
        check: () => (redPresses + bluePresses) === 4,
        time: 4200
    },
    {
        text: "TOTAL: 5 CLICS",
        check: () => (redPresses + bluePresses) === 5,
        time: 4500
    },
    {
        text: "MÁS DE 3 CLICS EN TOTAL",
        check: () => (redPresses + bluePresses) > 3,
        time: 4000
    }
];

// Inicializar juego
function initGame() {
    score = 0;
    round = 1;
    gameActive = true;
    createTimerSegments(); // Crear los segmentos del timer
    updateUI();
    
    // Esperar un poco antes de empezar
    setTimeout(() => {
        startNewRound();
    }, 1000);
}

// Actualizar UI
function updateUI() {
    scoreElement.textContent = score;
    roundElement.textContent = round;
}

// Nueva ronda
function startNewRound() {
    if (!gameActive) return;
    
    redPresses = 0;
    bluePresses = 0;
    
    // Seleccionar desafío aleatorio
    currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    // Mostrar instrucción
    instructionElement.textContent = currentChallenge.text;
    
    // Calcular tiempo (se reduce con las rondas)
    const timeReduction = Math.min((round - 1) * 100, 1500);
    const finalTime = Math.max(currentChallenge.time - timeReduction, 1200);
    
    // Iniciar timer
    startTimer(finalTime);
}

// Timer - Segmentos alrededor del monitor
function startTimer(duration) {
    let timeLeft = duration;
    const startTime = Date.now();
    
    // Activar todos los segmentos al inicio
    segments.forEach(segment => {
        segment.classList.add('active');
        segment.classList.remove('inactive', 'warning', 'danger');
    });
    
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timeLeft = duration - elapsed;
        
        const percentage = (timeLeft / duration);
        
        // Calcular cuántos segmentos deben estar activos
        const activeSegments = Math.ceil(percentage * totalSegments);
        
        // Actualizar segmentos (se apagan en sentido horario)
        segments.forEach((segment, index) => {
            if (index < activeSegments) {
                segment.classList.add('active');
                segment.classList.remove('inactive');
                
                // Cambiar color según el tiempo restante
                if (percentage > 0.5) {
                    segment.classList.remove('warning', 'danger');
                } else if (percentage > 0.25) {
                    segment.classList.add('warning');
                    segment.classList.remove('danger');
                } else {
                    segment.classList.add('danger');
                    segment.classList.remove('warning');
                }
            } else {
                segment.classList.remove('active', 'warning', 'danger');
                segment.classList.add('inactive');
            }
        });
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswer();
        }
    }, 50);
}

// Verificar respuesta
function checkAnswer() {
    if (!gameActive) return;
    
    clearInterval(timerInterval);
    gameActive = false;
    
    if (currentChallenge.check()) {
        // ¡CORRECTO!
        score += 10 * round;
        round++;
        updateUI();
        
        // Flash blanco
        document.body.classList.add('flash-success');
        setTimeout(() => {
            document.body.classList.remove('flash-success');
            gameActive = true;
            startNewRound();
        }, 300);
    } else {
        // ¡ERROR!
        endGame('¡Respuesta incorrecta!');
    }
}

// Terminar juego
function endGame(reason) {
    gameActive = false;
    clearInterval(timerInterval);
    
    // Flash rojo
    document.body.classList.add('flash-error');
    
    setTimeout(() => {
        document.body.classList.remove('flash-error');
        
        // Mostrar pantalla de game over
        gameOverReason.textContent = reason;
        finalScoreElement.textContent = score;
        finalRoundElement.textContent = round;
        
        document.querySelector('.game-screen').style.display = 'none';
        gameOverScreen.classList.remove('hidden');
    }, 400);
}

// Event listeners para botones
redButton.addEventListener('click', () => {
    if (!gameActive) return;
    redPresses++;
    redButton.classList.add('press-effect');
    setTimeout(() => redButton.classList.remove('press-effect'), 150);
});

blueButton.addEventListener('click', () => {
    if (!gameActive) return;
    bluePresses++;
    blueButton.classList.add('press-effect');
    setTimeout(() => blueButton.classList.remove('press-effect'), 150);
});

// Funciones de navegación
function restartGame() {
    gameOverScreen.classList.add('hidden');
    document.querySelector('.game-screen').style.display = 'flex';
    createTimerSegments(); // Recrear segmentos
    initGame();
}

function goToMenu() {
    window.location.href = 'index.html';
}

// Iniciar cuando carga la página
initGame();
