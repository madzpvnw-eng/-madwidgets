const display = document.getElementById("display");
const startPauseBtn = document.getElementById("startPauseBtn");
const playIcon = document.getElementById("playIcon");
const startText = document.getElementById("startText");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const statusIndicator = document.querySelector(".status-indicator");
const lapCounter = document.getElementById("lap-counter");
const lapsContainer = document.getElementById("laps-container");
const lapsList = document.getElementById("laps-list");

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let laps = []; // { lapNumber, splitTime, overallTime }
let lastLapOverallTime = 0;

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");
    const cs = String(centiseconds).padStart(2, "0");

    return { full: `${h}:${m}:${s}.${cs}`, main: `${h}:${m}:${s}`, cs: `.${cs}` };
}

function updateDisplay() {
    const formatted = formatTime(elapsedTime);
    display.innerHTML = `${formatted.main}<span class="ms-part">${formatted.cs}</span>`;
}

function startTimer() {
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10);

    startText.textContent = "Pause";
    if (playIcon) playIcon.setAttribute("data-lucide", "pause");
    if (window.lucide) window.lucide.createIcons();

    lapBtn.disabled = false;
    resetBtn.disabled = false;

    statusIndicator.className = "status-indicator running";
    statusText.textContent = "Running";
    window.playChime?.("tick");
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);

    startText.textContent = "Resume";
    if (playIcon) playIcon.setAttribute("data-lucide", "play");
    if (window.lucide) window.lucide.createIcons();

    statusIndicator.className = "status-indicator paused";
    statusText.textContent = "Paused";
    window.playChime?.("tick");
}

function recordLap() {
    if (!isRunning && elapsedTime === 0) return;
    const overall = elapsedTime;
    const split = overall - lastLapOverallTime;
    lastLapOverallTime = overall;

    const lapNum = laps.length + 1;
    laps.unshift({ lapNum, split, overall });
    lapCounter.textContent = `${laps.length} Lap${laps.length === 1 ? "" : "s"}`;
    lapsContainer.hidden = false;

    renderLaps();
    window.playChime?.("pop");
}

function renderLaps() {
    lapsList.innerHTML = "";

    // Find min and max splits for highlighting if >= 2 laps
    let minSplit = Infinity;
    let maxSplit = -Infinity;
    if (laps.length >= 2) {
        laps.forEach(l => {
            if (l.split < minSplit) minSplit = l.split;
            if (l.split > maxSplit) maxSplit = l.split;
        });
    }

    laps.forEach(l => {
        const item = document.createElement("div");
        item.className = "lap-item";
        if (laps.length >= 2) {
            if (l.split === minSplit) item.classList.add("fastest");
            else if (l.split === maxSplit) item.classList.add("slowest");
        }

        const splitFmt = formatTime(l.split).full;
        const overallFmt = formatTime(l.overall).full;

        item.innerHTML = `
            <span>Lap ${String(l.lapNum).padStart(2, "0")}</span>
            <span>+${splitFmt}</span>
            <span>${overallFmt}</span>
        `;
        lapsList.appendChild(item);
    });
}

function resetTimer() {
    pauseTimer();
    elapsedTime = 0;
    lastLapOverallTime = 0;
    laps = [];
    updateDisplay();

    startText.textContent = "Start";
    if (playIcon) playIcon.setAttribute("data-lucide", "play");
    if (window.lucide) window.lucide.createIcons();

    lapBtn.disabled = true;
    resetBtn.disabled = true;
    lapsContainer.hidden = true;
    lapCounter.textContent = "0 Laps";

    statusIndicator.className = "status-indicator";
    statusText.textContent = "Ready";
    window.playChime?.("tick");
}

startPauseBtn.addEventListener("click", () => {
    if (isRunning) pauseTimer();
    else startTimer();
});

lapBtn.addEventListener("click", recordLap);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();