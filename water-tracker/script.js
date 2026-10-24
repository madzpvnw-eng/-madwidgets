const STORAGE_KEY = "madwidgets-water";
const glassesGrid = document.getElementById("glasses-grid");
const waterFill = document.getElementById("water-fill");
const intakeSubtitle = document.getElementById("intake-subtitle");
const glassesCount = document.getElementById("glasses-count");
const addGlassBtn = document.getElementById("add-glass-btn");
const minusGlassBtn = document.getElementById("minus-glass-btn");
const resetWaterBtn = document.getElementById("reset-water-btn");

const TOTAL_GLASSES = 8;
const ML_PER_GLASS = 250;
const GOAL_ML = TOTAL_GLASSES * ML_PER_GLASS;

let filledCount = 0;
try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) filledCount = parseInt(saved, 10) || 0;
} catch (_) {}

function save() {
    try {
        localStorage.setItem(STORAGE_KEY, filledCount);
    } catch (_) {}
}

function render() {
    glassesGrid.innerHTML = "";
    for (let i = 0; i < TOTAL_GLASSES; i++) {
        const isFilled = i < filledCount;
        const item = document.createElement("div");
        item.className = "glass-item" + (isFilled ? " filled" : "");
        item.innerHTML = `
            <i data-lucide="droplet"></i>
            <span>${(i + 1) * ML_PER_GLASS}ml</span>
        `;
        item.addEventListener("click", () => {
            filledCount = (i === filledCount - 1) ? i : i + 1;
            save();
            window.playChime?.(isFilled ? "tick" : "pop");
            if (filledCount === TOTAL_GLASSES) {
                window.playChime?.("complete");
                window.showToast?.("Goal achieved! Stay hydrated 💧", "check");
            }
            render();
        });
        glassesGrid.appendChild(item);
    }

    const currentMl = filledCount * ML_PER_GLASS;
    const pct = Math.round((currentMl / GOAL_ML) * 100);

    intakeSubtitle.textContent = `${currentMl.toLocaleString()} / ${GOAL_ML.toLocaleString()} ml (${pct}%)`;
    glassesCount.textContent = `${filledCount} / ${TOTAL_GLASSES}`;
    waterFill.style.width = `${pct}%`;

    if (window.lucide) window.lucide.createIcons();
}

addGlassBtn.addEventListener("click", () => {
    if (filledCount < TOTAL_GLASSES) {
        filledCount++;
        save();
        window.playChime?.("pop");
        if (filledCount === TOTAL_GLASSES) {
            window.playChime?.("complete");
            window.showToast?.("Daily water goal achieved! 💧", "check");
        }
        render();
    }
});

minusGlassBtn.addEventListener("click", () => {
    if (filledCount > 0) {
        filledCount--;
        save();
        window.playChime?.("tick");
        render();
    }
});

resetWaterBtn.addEventListener("click", () => {
    if (confirm("Reset today's water intake?")) {
        filledCount = 0;
        save();
        window.playChime?.("tick");
        render();
    }
});

render();
