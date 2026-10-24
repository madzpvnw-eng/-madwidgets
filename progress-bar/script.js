const STORAGE_KEY = "madwidgets-progressbar";
const goalTitleInput = document.getElementById("goal-title-input");
const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");
const currentValueEl = document.getElementById("currentValue");
const targetValueEl = document.getElementById("targetValue");
const remainingValueEl = document.getElementById("remainingValue");

const plus1Btn = document.getElementById("plus1-btn");
const plus5Btn = document.getElementById("plus5-btn");
const minus1Btn = document.getElementById("minus1-btn");
const editGoalBtn = document.getElementById("edit-goal-btn");

let data = {
    title: "Read 50 Books in 2026",
    current: 28,
    target: 50
};

try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) data = { ...data, ...JSON.parse(saved) };
} catch (_) {}

function save() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
}

function render() {
    goalTitleInput.value = data.title;
    currentValueEl.textContent = data.current;
    targetValueEl.textContent = data.target;

    const remaining = Math.max(0, data.target - data.current);
    remainingValueEl.textContent = remaining;

    const pct = data.target > 0 ? Math.min(100, Math.max(0, (data.current / data.target) * 100)) : 0;
    progressPercent.textContent = `${pct.toFixed(0)}%`;
    progressBar.style.width = `${pct}%`;
}

goalTitleInput.addEventListener("change", () => {
    data.title = goalTitleInput.value.trim() || "My Goal";
    save();
});

plus1Btn.addEventListener("click", () => {
    data.current += 1;
    save();
    window.playChime?.("pop");
    render();
});

plus5Btn.addEventListener("click", () => {
    data.current += 5;
    save();
    window.playChime?.("pop");
    render();
});

minus1Btn.addEventListener("click", () => {
    if (data.current > 0) {
        data.current -= 1;
        save();
        window.playChime?.("tick");
        render();
    }
});

editGoalBtn.addEventListener("click", () => {
    const newTarget = prompt("Enter target number:", data.target);
    if (newTarget !== null && !isNaN(parseInt(newTarget, 10))) {
        data.target = Math.max(1, parseInt(newTarget, 10));
        const newCurrent = prompt("Enter current number:", data.current);
        if (newCurrent !== null && !isNaN(parseInt(newCurrent, 10))) {
            data.current = Math.max(0, parseInt(newCurrent, 10));
        }
        save();
        window.playChime?.("complete");
        render();
    }
});

render();