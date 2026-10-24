const STORAGE_KEY = "madwidgets-streak";
const streakCountEl = document.getElementById("streakCount");
const habitNameEl = document.getElementById("habitName");
const lastCheckEl = document.getElementById("lastCheck");
const checkInBtn = document.getElementById("checkInBtn");
const btnText = document.getElementById("btn-text");
const checkIcon = document.getElementById("check-icon");
const progressFill = document.getElementById("progressFill");
const nextMilestoneEl = document.getElementById("next-milestone");
const milestonePctEl = document.getElementById("milestone-pct");
const resetBtn = document.getElementById("reset-btn");

let data = {
    habitName: "Daily Deep Work",
    streak: 14,
    lastCheckDate: ""
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

function getTodayStr() {
    return new Date().toISOString().split("T")[0];
}

function getNextMilestone(streak) {
    const milestones = [3, 7, 14, 21, 30, 60, 90, 100, 365];
    for (const m of milestones) {
        if (streak < m) return m;
    }
    return streak + 50;
}

function render() {
    habitNameEl.value = data.habitName;
    streakCountEl.textContent = data.streak;

    const todayStr = getTodayStr();
    const isCheckedToday = data.lastCheckDate === todayStr;

    if (isCheckedToday) {
        checkInBtn.classList.add("checked");
        btnText.textContent = "Completed for Today ✓";
        lastCheckEl.textContent = "Today";
    } else {
        checkInBtn.classList.remove("checked");
        btnText.textContent = "Check In for Today";
        lastCheckEl.textContent = data.lastCheckDate || "Never";
    }

    const nextM = getNextMilestone(data.streak);
    const prevM = nextM <= 7 ? 0 : (nextM === 14 ? 7 : (nextM === 21 ? 14 : nextM - 30));
    const progressRange = Math.max(1, nextM - prevM);
    const progressCurrent = Math.max(0, data.streak - prevM);
    const pct = Math.min(100, Math.round((progressCurrent / progressRange) * 100));

    nextMilestoneEl.textContent = `${nextM} days`;
    milestonePctEl.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;

    if (window.lucide) window.lucide.createIcons();
}

habitNameEl.addEventListener("change", () => {
    data.habitName = habitNameEl.value.trim() || "Habit";
    save();
});

checkInBtn.addEventListener("click", () => {
    const todayStr = getTodayStr();
    if (data.lastCheckDate === todayStr) {
        // Toggle uncheck
        data.streak = Math.max(0, data.streak - 1);
        data.lastCheckDate = "";
        save();
        window.playChime?.("tick");
        render();
    } else {
        // Check in
        data.streak += 1;
        data.lastCheckDate = todayStr;
        save();
        window.playChime?.("complete");
        window.showToast?.("Streak extended! Keep up the momentum 🔥", "check");
        render();
    }
});

resetBtn.addEventListener("click", () => {
    if (confirm("Reset current streak to 0?")) {
        data.streak = 0;
        data.lastCheckDate = "";
        save();
        window.playChime?.("tick");
        render();
    }
});

render();