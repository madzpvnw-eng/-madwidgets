const timerDisplay = document.getElementById("timer");
const ringProgress = document.getElementById("ring-progress");
const sessionLabel = document.getElementById("session-label");
const startPauseBtn = document.getElementById("start-pause-btn");
const playIcon = document.getElementById("play-icon");
const startLabel = document.getElementById("start-label");
const resetBtn = document.getElementById("reset-btn");
const adjustMinus = document.getElementById("adjust-minus");
const modeBtns = document.querySelectorAll(".mode-btn");
const sessionDotsContainer = document.getElementById("session-dots");

const CIRCUMFERENCE = 2 * Math.PI * 102; // ~640.88

let currentMode = "focus";
let defaultDurations = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
};
let totalSeconds = defaultDurations.focus;
let remainingSeconds = totalSeconds;
let timerInterval = null;
let isRunning = false;
let completedSessions = 0;

function updateDisplay() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    // Update ring progress
    const progress = remainingSeconds / totalSeconds;
    const offset = CIRCUMFERENCE * (1 - progress);
    ringProgress.style.strokeDashoffset = offset;
}

function updateSessionDots() {
    sessionDotsContainer.innerHTML = "";
    for (let i = 0; i < 4; i++) {
        const dot = document.createElement("span");
        dot.className = "dot" + (i < (completedSessions % 4) ? " active" : "");
        sessionDotsContainer.appendChild(dot);
    }
}

function startTimer() {
    isRunning = true;
    startLabel.textContent = "Pause";
    if (playIcon) playIcon.setAttribute("data-lucide", "pause");
    if (window.lucide) window.lucide.createIcons();

    timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
        } else {
            handleComplete();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    startLabel.textContent = "Resume";
    if (playIcon) playIcon.setAttribute("data-lucide", "play");
    if (window.lucide) window.lucide.createIcons();
}

function resetTimer() {
    pauseTimer();
    remainingSeconds = totalSeconds;
    startLabel.textContent = currentMode === "focus" ? "Start Focus" : "Start Break";
    updateDisplay();
}

function handleComplete() {
    pauseTimer();
    window.playChime?.("complete");
    if (currentMode === "focus") {
        completedSessions++;
        updateSessionDots();
        window.showToast?.("Focus session complete! Take a break ☕", "check");
        switchMode("short");
    } else {
        window.showToast?.("Break over! Ready to focus? 🎯", "check");
        switchMode("focus");
    }
}

function switchMode(mode) {
    currentMode = mode;
    modeBtns.forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
    
    totalSeconds = defaultDurations[mode];
    remainingSeconds = totalSeconds;
    sessionLabel.textContent = mode === "focus" ? "Focus Session" : (mode === "short" ? "Short Break" : "Long Break");
    
    ringProgress.style.stroke = mode === "focus" ? "var(--text)" : (mode === "short" ? "var(--success)" : "var(--accent)");
    resetTimer();
}

modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        switchMode(btn.dataset.mode);
        window.playChime?.("tick");
    });
});

startPauseBtn.addEventListener("click", () => {
    window.playChime?.("tick");
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener("click", () => {
    window.playChime?.("tick");
    resetTimer();
});

adjustMinus.addEventListener("click", () => {
    if (remainingSeconds > 60) {
        remainingSeconds -= 60;
        totalSeconds = Math.max(totalSeconds - 60, remainingSeconds);
        updateDisplay();
        window.playChime?.("tick");
    }
});

// Initialize
ringProgress.style.strokeDasharray = CIRCUMFERENCE;
updateDisplay();
updateSessionDots();