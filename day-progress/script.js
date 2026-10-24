const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const barEl = document.getElementById("bar");
const percentEl = document.getElementById("percent");
const remainingEl = document.getElementById("remaining");

function updateDayProgress() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    const elapsed = now - start;
    const total = end - start;
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));

    timeEl.textContent = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
    dateEl.textContent = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    barEl.style.width = `${pct.toFixed(2)}%`;
    percentEl.textContent = `${pct.toFixed(1)}%`;

    const remainingMs = end - now;
    const totalMins = Math.max(0, Math.floor(remainingMs / 60000));
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    remainingEl.textContent = `${h}h ${m}m remaining`;
}

updateDayProgress();
setInterval(updateDayProgress, 1000);