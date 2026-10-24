const startInput = document.getElementById("date-start");
const endInput = document.getElementById("date-end");
const totalDaysEl = document.getElementById("total-days");
const detailTextEl = document.getElementById("detail-text");
const bizDaysEl = document.getElementById("biz-days");
const weekendDaysEl = document.getElementById("weekend-days");
const totalHoursEl = document.getElementById("total-hours");

// Initialize with today and +42 days
const now = new Date();
const target = new Date();
target.setDate(target.getDate() + 42);

startInput.value = now.toISOString().split("T")[0];
endInput.value = target.toISOString().split("T")[0];

function calculateDifference() {
    if (!startInput.value || !endInput.value) return;

    const d1 = new Date(startInput.value + "T00:00:00");
    const d2 = new Date(endInput.value + "T00:00:00");

    const earliest = d1 < d2 ? d1 : d2;
    const latest = d1 < d2 ? d2 : d1;

    const msDiff = latest - earliest;
    const totalDays = Math.round(msDiff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;

    totalDaysEl.textContent = `${totalDays} Day${totalDays === 1 ? "" : "s"}`;
    detailTextEl.textContent = `${weeks} weeks · ${remDays} days`;

    // Calculate Business Days vs Weekend Days
    let bizDays = 0;
    let cur = new Date(earliest);
    while (cur < latest) {
        const dayOfWeek = cur.getDay(); // 0 = Sunday, 6 = Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            bizDays++;
        }
        cur.setDate(cur.getDate() + 1);
    }
    const weekendDays = totalDays - bizDays;

    bizDaysEl.textContent = `${bizDays} days`;
    weekendDaysEl.textContent = `${weekendDays} days`;
    totalHoursEl.textContent = `${(totalDays * 24).toLocaleString()} hrs`;
}

startInput.addEventListener("change", () => {
    window.playChime?.("tick");
    calculateDifference();
});

endInput.addEventListener("change", () => {
    window.playChime?.("tick");
    calculateDifference();
});

calculateDifference();
