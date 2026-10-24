const eventTitleEl = document.getElementById("event-title");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const eventInput = document.getElementById("event-input");
const dateInput = document.getElementById("date-input");
const timeInput = document.getElementById("time-input");
const saveBtn = document.getElementById("save-event-btn");
const presetBtns = document.querySelectorAll(".preset-btn");
const detailsEl = document.querySelector(".config-details");

// Load stored target or default to New Year
const STORAGE_KEY = "madwidgets-countdown-target";
let savedData = null;
try {
    savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
} catch (_) {}

let currentEvent = savedData || {
    title: "New Year 2027",
    target: "2027-01-01T00:00:00"
};

function initInputs() {
    eventTitleEl.textContent = currentEvent.title;
    eventInput.value = currentEvent.title;
    
    const d = new Date(currentEvent.target);
    if (!isNaN(d.getTime())) {
        dateInput.value = d.toISOString().split("T")[0];
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        timeInput.value = `${hh}:${mm}`;
    }
}

function updateCountdown() {
    const now = new Date().getTime();
    const target = new Date(currentEvent.target).getTime();
    const difference = target - now;

    if (difference <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, "0");
    hoursEl.textContent = String(h).padStart(2, "0");
    minutesEl.textContent = String(m).padStart(2, "0");
    secondsEl.textContent = String(s).padStart(2, "0");
}

saveBtn.addEventListener("click", () => {
    const title = eventInput.value.trim() || "My Event";
    const dateVal = dateInput.value;
    const timeVal = timeInput.value || "00:00";

    if (!dateVal) {
        alert("Please pick a target date!");
        return;
    }

    const targetIso = `${dateVal}T${timeVal}:00`;
    currentEvent = { title, target: targetIso };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentEvent));
    } catch (_) {}

    eventTitleEl.textContent = title;
    detailsEl.open = false;
    updateCountdown();
    window.showToast?.("Countdown updated!", "check");
    window.playChime?.("complete");
});

presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const days = btn.dataset.days;
        const preset = btn.dataset.preset;
        const now = new Date();

        if (preset === "newyear") {
            const nextYear = now.getFullYear() + 1;
            dateInput.value = `${nextYear}-01-01`;
            timeInput.value = "00:00";
            eventInput.value = `New Year ${nextYear} 🎆`;
        } else if (days) {
            now.setDate(now.getDate() + parseInt(days, 10));
            dateInput.value = now.toISOString().split("T")[0];
            timeInput.value = "09:00";
            eventInput.value = `${days} Days Milestone 🚀`;
        }
    });
});

initInputs();
updateCountdown();
setInterval(updateCountdown, 1000);
