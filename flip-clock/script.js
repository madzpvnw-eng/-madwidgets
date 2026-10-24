const hoursTop = document.getElementById("hours-top");
const hoursBottom = document.getElementById("hours-bottom");
const hoursFlap = document.getElementById("hours-flap");

const minutesTop = document.getElementById("minutes-top");
const minutesBottom = document.getElementById("minutes-bottom");
const minutesFlap = document.getElementById("minutes-flap");

const secondsTop = document.getElementById("seconds-top");
const secondsBottom = document.getElementById("seconds-bottom");
const secondsFlap = document.getElementById("seconds-flap");

const secUnit = document.getElementById("sec-unit");
const secDots = document.getElementById("sec-dots");

const ampmIndicator = document.getElementById("flip-ampm");
const flipDate = document.getElementById("flip-date");

const ampmToggle = document.getElementById("ampm-toggle");
const secToggle = document.getElementById("sec-toggle");

let is24Hour = localStorage.getItem("flip-24h") !== "false";
let showSeconds = localStorage.getItem("flip-sec") !== "false";

let lastH = "";
let lastM = "";
let lastS = "";

ampmToggle.textContent = is24Hour ? "24H" : "12H";
ampmToggle.classList.toggle("active", is24Hour);
secToggle.classList.toggle("active", showSeconds);

if (!showSeconds) {
    secUnit.style.display = "none";
    secDots.style.display = "none";
}

ampmToggle.addEventListener("click", () => {
    is24Hour = !is24Hour;
    localStorage.setItem("flip-24h", is24Hour);
    ampmToggle.textContent = is24Hour ? "24H" : "12H";
    ampmToggle.classList.toggle("active", is24Hour);
    updateFlipClock();
});

secToggle.addEventListener("click", () => {
    showSeconds = !showSeconds;
    localStorage.setItem("flip-sec", showSeconds);
    secToggle.classList.toggle("active", showSeconds);
    secUnit.style.display = showSeconds ? "flex" : "none";
    secDots.style.display = showSeconds ? "block" : "none";
    updateFlipClock();
});

function animateFlap(flapEl) {
    flapEl.classList.remove("flipping");
    void flapEl.offsetWidth; // trigger reflow
    flapEl.classList.add("flipping");
}

function updateFlipClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (!is24Hour) {
        ampmIndicator.hidden = false;
        ampmIndicator.textContent = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
    } else {
        ampmIndicator.hidden = true;
    }

    const hStr = String(hours).padStart(2, "0");
    const mStr = String(minutes).padStart(2, "0");
    const sStr = String(seconds).padStart(2, "0");

    if (hStr !== lastH) {
        hoursTop.textContent = hStr;
        hoursBottom.textContent = hStr;
        if (lastH !== "") animateFlap(hoursFlap);
        lastH = hStr;
    }

    if (mStr !== lastM) {
        minutesTop.textContent = mStr;
        minutesBottom.textContent = mStr;
        if (lastM !== "") animateFlap(minutesFlap);
        lastM = mStr;
    }

    if (showSeconds && sStr !== lastS) {
        secondsTop.textContent = sStr;
        secondsBottom.textContent = sStr;
        lastS = sStr;
    }

    flipDate.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

updateFlipClock();
setInterval(updateFlipClock, 1000);