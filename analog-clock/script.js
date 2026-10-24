const dialMarks = document.getElementById("dial-marks");
const hourHand = document.getElementById("hour-hand");
const minuteHand = document.getElementById("minute-hand");
const secondHand = document.getElementById("second-hand");
const digitalTime = document.getElementById("digital-time");
const analogDate = document.getElementById("analog-date");

// Create 12 dial notches
if (dialMarks) {
    dialMarks.innerHTML = "";
    for (let i = 0; i < 12; i++) {
        const notch = document.createElement("div");
        notch.className = "notch" + (i % 3 === 0 ? " major" : "");
        notch.style.transform = `rotate(${i * 30}deg)`;
        dialMarks.appendChild(notch);
    }
}

function updateAnalogClock() {
    const now = new Date();
    const ms = now.getMilliseconds();
    const seconds = now.getSeconds() + ms / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    const secondDeg = seconds * 6;
    const minuteDeg = minutes * 6;
    const hourDeg = hours * 30;

    secondHand.style.transform = `rotate(${secondDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    hourHand.style.transform = `rotate(${hourDeg}deg)`;

    // Digital readout
    const padH = String(now.getHours()).padStart(2, "0");
    const padM = String(now.getMinutes()).padStart(2, "0");
    const padS = String(now.getSeconds()).padStart(2, "0");
    digitalTime.textContent = `${padH}:${padM}:${padS}`;

    analogDate.textContent = now.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });
}

setInterval(updateAnalogClock, 100);
updateAnalogClock();
