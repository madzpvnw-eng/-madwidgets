const STORAGE_CITY_KEY = "madwidgets-prayer-city";
const locationText = document.getElementById("location-text");
const hijriDateEl = document.getElementById("hijri-date");
const nextPrayerName = document.getElementById("next-prayer-name");
const nextPrayerTime = document.getElementById("next-prayer-time");
const countdownText = document.getElementById("countdown-text");
const changeLocBtn = document.getElementById("change-loc-btn");

const prayerRows = {
    Fajr: document.getElementById("row-fajr"),
    Dhuhr: document.getElementById("row-dhuhr"),
    Asr: document.getElementById("row-asr"),
    Maghrib: document.getElementById("row-maghrib"),
    Isha: document.getElementById("row-isha")
};

const prayerTimeEls = {
    Fajr: document.getElementById("time-fajr"),
    Dhuhr: document.getElementById("time-dhuhr"),
    Asr: document.getElementById("time-asr"),
    Maghrib: document.getElementById("time-maghrib"),
    Isha: document.getElementById("time-isha")
};

let currentCity = localStorage.getItem(STORAGE_CITY_KEY) || "Jakarta";
let cachedTimings = null;

async function fetchPrayerTimes(city) {
    try {
        locationText.textContent = `${city}`;
        hijriDateEl.textContent = "Updating times...";

        const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Indonesia&method=11`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.code !== 200) throw new Error("Fetch failed");

        const timings = data.data.timings;
        cachedTimings = timings;
        const hijri = data.data.date.hijri;
        hijriDateEl.textContent = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;

        ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach(p => {
            if (prayerTimeEls[p]) {
                prayerTimeEls[p].textContent = timings[p];
            }
        });

        updateNextPrayer();
    } catch (err) {
        hijriDateEl.textContent = "Offline / Using scheduled times";
        // Safe fallbacks
        const defaultTimings = {
            Fajr: "04:32",
            Dhuhr: "11:54",
            Asr: "15:08",
            Maghrib: "18:02",
            Isha: "19:12"
        };
        cachedTimings = defaultTimings;
        ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach(p => {
            if (prayerTimeEls[p]) prayerTimeEls[p].textContent = defaultTimings[p];
        });
        updateNextPrayer();
    }
}

function updateNextPrayer() {
    if (!cachedTimings) return;
    const now = new Date();
    const curMinutes = now.getHours() * 60 + now.getMinutes();

    const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    let nextP = null;
    let nextTimeStr = "";
    let diffMins = 0;

    Object.values(prayerRows).forEach(row => row && row.classList.remove("active"));

    for (const p of order) {
        const [h, m] = cachedTimings[p].split(":").map(Number);
        const pMins = h * 60 + m;
        if (pMins > curMinutes) {
            nextP = p;
            nextTimeStr = cachedTimings[p];
            diffMins = pMins - curMinutes;
            break;
        }
    }

    if (!nextP) {
        // Next is tomorrow's Fajr
        nextP = "Fajr";
        nextTimeStr = cachedTimings.Fajr;
        const [h, m] = cachedTimings.Fajr.split(":").map(Number);
        diffMins = (24 * 60 - curMinutes) + (h * 60 + m);
    }

    nextPrayerName.textContent = nextP;
    nextPrayerTime.textContent = nextTimeStr;

    const hoursLeft = Math.floor(diffMins / 60);
    const minsLeft = diffMins % 60;
    const timeStr = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft} minutes`;
    countdownText.textContent = `in ${timeStr}`;

    if (prayerRows[nextP]) prayerRows[nextP].classList.add("active");
}

changeLocBtn.addEventListener("click", () => {
    const newCity = prompt("Enter your city name:", currentCity);
    if (newCity && newCity.trim()) {
        currentCity = newCity.trim();
        try { localStorage.setItem(STORAGE_CITY_KEY, currentCity); } catch (_) {}
        fetchPrayerTimes(currentCity);
    }
});

fetchPrayerTimes(currentCity);
setInterval(updateNextPrayer, 30000);