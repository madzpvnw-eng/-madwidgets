const STORAGE_KEY = "madwidgets-habits-v2";
const habitsListEl = document.getElementById("habits-list");
const statusEl = document.getElementById("overall-status");
const streakNumEl = document.getElementById("streak-num");
const progressFillEl = document.getElementById("habit-progress-fill");
const addHabitBtn = document.getElementById("add-habit-btn");
const resetWeekBtn = document.getElementById("reset-week-btn");

let habits = [];
try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) habits = JSON.parse(raw);
} catch (_) {}

if (!habits || habits.length === 0) {
    habits = [
        { name: "Read 20 pages", checks: [true, true, true, true, false, false, false] },
        { name: "Daily Workout", checks: [true, true, false, true, false, false, false] },
        { name: "Drink 2L Water", checks: [true, true, true, true, true, false, false] }
    ];
}

function saveHabits() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (_) {}
}

function getTodayDayIndex() {
    // 0 = Monday, 6 = Sunday
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
}

function renderHabits() {
    habitsListEl.innerHTML = "";
    let totalChecks = habits.length * 7;
    let completedChecks = 0;

    habits.forEach((habit, hIdx) => {
        const row = document.createElement("div");
        row.className = "habit-row";

        const nameEl = document.createElement("div");
        nameEl.className = "habit-name";
        nameEl.textContent = habit.name;
        nameEl.title = "Click to rename";
        nameEl.addEventListener("click", () => {
            const newName = prompt("Rename habit:", habit.name);
            if (newName && newName.trim()) {
                habit.name = newName.trim();
                saveHabits();
                renderHabits();
            }
        });

        const checksContainer = document.createElement("div");
        checksContainer.className = "habit-checks";

        habit.checks.forEach((isChecked, dIdx) => {
            if (isChecked) completedChecks++;
            const btn = document.createElement("button");
            btn.className = "check-btn" + (isChecked ? " checked" : "");
            btn.innerHTML = isChecked ? `<i data-lucide="check"></i>` : "";
            btn.setAttribute("aria-label", `Toggle check for ${habit.name}`);
            
            btn.addEventListener("click", () => {
                habit.checks[dIdx] = !habit.checks[dIdx];
                saveHabits();
                window.playChime?.(habit.checks[dIdx] ? "pop" : "tick");
                renderHabits();
            });

            checksContainer.appendChild(btn);
        });

        row.appendChild(nameEl);
        row.appendChild(checksContainer);
        habitsListEl.appendChild(row);
    });

    const pct = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;
    statusEl.textContent = `${completedChecks} / ${totalChecks} completed this week (${pct}%)`;
    progressFillEl.style.width = `${pct}%`;

    // Calculate streak
    let streak = 0;
    habits.forEach(h => {
        streak += h.checks.filter(Boolean).length;
    });
    streakNumEl.textContent = Math.round(streak / (habits.length || 1));

    if (window.lucide) window.lucide.createIcons();
}

addHabitBtn.addEventListener("click", () => {
    const name = prompt("Enter new habit name:");
    if (name && name.trim()) {
        habits.push({ name: name.trim(), checks: [false, false, false, false, false, false, false] });
        saveHabits();
        renderHabits();
        window.showToast?.("Habit added!", "check");
    }
});

resetWeekBtn.addEventListener("click", () => {
    if (confirm("Reset all checks for this week?")) {
        habits.forEach(h => h.checks.fill(false));
        saveHabits();
        renderHabits();
        window.showToast?.("Week reset", "check");
    }
});

// Highlight today's label
const todayIdx = getTodayDayIndex();
const daySpans = document.querySelectorAll("#days-labels span");
if (daySpans[todayIdx]) daySpans[todayIdx].classList.add("today");

renderHabits();
