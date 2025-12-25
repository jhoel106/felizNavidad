/**
 * PROYECTO: NAVIDAD FAMILIAR
 * FUNCIONALIDADES: Nieve, Regalo Sorpresa, Slider de Mensajes, 
 * Cuenta Regresiva y Alarma de Medianoche.
 */

// --- 1. CONFIGURACIÓN DE NIEVE ---
function startSnow() {
    const container = document.getElementById('snow');
    if (!container) return; // Seguridad si el div no existe
    
    const flakesCount = 60;

    for (let i = 0; i < flakesCount; i++) {
        const flake = document.createElement('div');
        flake.innerHTML = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];
        
        flake.style.cssText = `
            position: fixed;
            top: -20px;
            left: ${Math.random() * 100}vw;
            opacity: ${Math.random()};
            font-size: ${Math.random() * 15 + 15}px;
            color: white;
            pointer-events: none;
            z-index: 1;
            user-select: none;
            animation: fall ${Math.random() * 3 + 5}s linear infinite;
        `;
        container.appendChild(flake);
    }
}

// Inyectar la animación de caída al documento solo una vez
if (!document.getElementById('snow-animation-style')) {
    const snowStyle = document.createElement('style');
    snowStyle.id = 'snow-animation-style';
    snowStyle.innerHTML = `
        @keyframes fall {
            to { transform: translateY(110vh) rotate(360deg); }
        }
    `;
    document.head.appendChild(snowStyle);
}

// --- 2. LÓGICA DE LA CUENTA REGRESIVA Y ALARMA ---
let alarmPlayed = false;

function updateTimer() {
    const now = new Date();
    // Fecha objetivo: 25 de diciembre
    const target = new Date(now.getFullYear(), 11, 25, 0, 0, 0); 
    
    // Si ya pasó Navidad este año, apuntar al siguiente
    if (now > target) target.setFullYear(target.getFullYear() + 1);

    const diff = target - now;
    const countdownElement = document.getElementById('countdown');

    if (!countdownElement) return;

    // ¿Llegó la medianoche?
    if (diff <= 0) {
        countdownElement.innerText = "¡FELIZ NAVIDAD!";
        if (!alarmPlayed) {
            triggerChristmasAlarm();
        }
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    countdownElement.innerText = `${d}d ${h}h ${m}m ${s}s`;
}

function triggerChristmasAlarm() {
    alarmPlayed = true;
    const alarmUI = document.getElementById('christmas-announcement');
    const bells = document.getElementById('bells-sound');
    const bgMusic = document.getElementById('bg-music');

    if (bgMusic) bgMusic.pause(); // Pausamos el violín
    
    if (alarmUI) alarmUI.style.display = 'flex';
    
    if (bells) {
        bells.loop = true;  // <--- ESTA LÍNEA asegura que las campanas se repitan
        bells.volume = 0.9;
        bells.play().catch(e => console.log("Audio bloqueado por el navegador"));
    }
}

function closeAlarm() {
    const alarmUI = document.getElementById('christmas-announcement');
    const bells = document.getElementById('bells-sound');
    const bgMusic = document.getElementById('bg-music');

    if (alarmUI) alarmUI.style.display = 'none';
    
    if (bells) {
        bells.pause();       // Detiene las campanas
        bells.currentTime = 0; // Reinicia el audio al principio para la próxima vez
    }

    if (bgMusic) bgMusic.play(); // Vuelve a sonar el violín suave
}

// --- 3. INTERACCIÓN DEL REGALO ---
function openGift() {
    const intro = document.getElementById('gift-intro');
    const experience = document.getElementById('experience-container');
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');

    if (intro && experience) {
        intro.classList.add('hidden');
        experience.classList.remove('hidden');
        
        if (music) {
            music.loop = true; // <--- ESTA LÍNEA asegura el bucle por código
            music.volume = 0.5;
            music.play().then(() => {
                if (musicBtn) musicBtn.innerText = '🔊';
            }).catch(e => console.log("Esperando clic para audio"));
        }
    }
}

// --- 4. LÓGICA DEL SLIDER (TARJETAS) ---
let currentSlideIndex = 0;

function changeSlide(n) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex + n + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');
}

// --- 5. CONTROL DE MÚSICA ---
function toggleMusic() {
    const music = document.getElementById('bg-music');
    const btn = document.getElementById('music-btn');
    if (!music || !btn) return;
    
    if (music.paused) {
        music.play();
        btn.innerText = '🔊';
    } else {
        music.pause();
        btn.innerText = '🔇';
    }
}

// --- 6. INICIALIZACIÓN ---
// Se usa una sola vez el window.onload
window.onload = () => {
    startSnow();
    updateTimer(); 
    setInterval(updateTimer, 1000);
};