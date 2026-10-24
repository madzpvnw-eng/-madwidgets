const timeEl = document.getElementById("time");
const ampmEl = document.getElementById("ampm");
const dateEl = document.getElementById("date");
const greetingTextEl = document.getElementById("greeting-text");
const secProgressEl = document.getElementById("sec-progress");
const formatBtn = document.getElementById("format-toggle");
const secondsBtn = document.getElementById("seconds-toggle");

let is24Hour = localStorage.getItem("clock-24h") !== "false";
let showSeconds = localStorage.getItem("clock-seconds") !== "false";

formatBtn.textContent = is24Hour ? "24H" : "12H";
formatBtn.classList.toggle("active", is24Hour);
secondsBtn.classList.toggle("active", showSeconds);

formatBtn.addEventListener("click", () => {
    is24Hour = !is24Hour;
    localStorage.setItem("clock-24h", is24Hour);
    formatBtn.textContent = is24Hour ? "24H" : "12H";
    formatBtn.classList.toggle("active", is24Hour);
    updateClock();
});

secondsBtn.addEventListener("click", () => {
    showSeconds = !showSeconds;
    localStorage.setItem("clock-seconds", showSeconds);
    secondsBtn.classList.toggle("active", showSeconds);
    updateClock();
});

function getGreeting(hours) {
    if (hours >= 5 && hours < 12) return "Good morning ☀️";
    if (hours >= 12 && hours < 17) return "Good afternoon 🌤️";
    if (hours >= 17 && hours < 21) return "Good evening 🌙";
    return "Late night focus ✨";
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    let displayHours = hours;
    let ampm = "";

    if (!is24Hour) {
        ampm = displayHours >= 12 ? "PM" : "AM";
        displayHours = displayHours % 12 || 12;
        ampmEl.hidden = false;
        ampmEl.textContent = ampm;
    } else {
        ampmEl.hidden = true;
    }

    const padH = String(displayHours).padStart(2, "0");
    const padM = String(minutes).padStart(2, "0");
    const padS = String(seconds).padStart(2, "0");

    timeEl.textContent = showSeconds ? `${padH}:${padM}:${padS}` : `${padH}:${padM}`;

    // Date
    dateEl.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    // Greeting
    greetingTextEl.textContent = getGreeting(hours);

    // Second progress
    const pct = ((seconds + now.getMilliseconds() / 1000) / 60) * 100;
    secProgressEl.style.width = `${pct}%`;
}

updateClock();
setInterval(updateClock, 1000);