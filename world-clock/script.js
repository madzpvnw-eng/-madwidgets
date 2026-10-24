const STORAGE_KEY = "madwidgets-worldclock-zones";
const el = document.getElementById("clocks");
const addCityBtn = document.getElementById("add-city-btn");

let zones = [
    ["Jakarta", "Asia/Jakarta"],
    ["Tokyo", "Asia/Tokyo"],
    ["London", "Europe/London"],
    ["New York", "America/New_York"]
];

try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) zones = JSON.parse(saved);
} catch (_) {}

function save() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
    } catch (_) {}
}

function getLocalHour() {
    return new Date().getHours();
}

function render() {
    const now = new Date();
    el.innerHTML = zones.map(([city, tz], idx) => {
        try {
            const timeStr = new Intl.DateTimeFormat("en-GB", {
                timeZone: tz,
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }).format(now);

            const dayName = new Intl.DateTimeFormat("en-US", {
                timeZone: tz,
                weekday: "short"
            }).format(now);

            const hourInTz = parseInt(new Intl.DateTimeFormat("en-US", {
                timeZone: tz,
                hour: "numeric",
                hour12: false
            }).format(now), 10);

            const isDay = hourInTz >= 6 && hourInTz < 18;
            const icon = isDay ? "☀️" : "🌙";

            // Relative diff
            const localHours = getLocalHour();
            const diff = hourInTz - localHours;
            const diffStr = diff === 0 ? "Same time" : (diff > 0 ? `+${diff} hrs` : `${diff} hrs`);

            return `
                <div class="clock-row">
                    <div class="clock-left">
                        <span class="daynight-icon">${icon}</span>
                        <div class="city-info">
                            <strong>${city}</strong>
                            <small>${dayName} · ${diffStr}</small>
                        </div>
                    </div>
                    <div class="clock-right">
                        <span class="time-str">${timeStr}</span>
                    </div>
                </div>
            `;
        } catch (_) {
            return "";
        }
    }).join("");
}

addCityBtn.addEventListener("click", () => {
    const cityName = prompt("Enter city name (e.g. Paris, Sydney, Dubai, Singapore):");
    if (!cityName) return;

    const commonZones = {
        "paris": "Europe/Paris",
        "berlin": "Europe/Berlin",
        "dubai": "Asia/Dubai",
        "singapore": "Asia/Singapore",
        "sydney": "Australia/Sydney",
        "los angeles": "America/Los_Angeles",
        "san francisco": "America/Los_Angeles",
        "toronto": "America/Toronto",
        "seoul": "Asia/Seoul",
        "hong kong": "Asia/Hong_Kong",
        "bangkok": "Asia/Bangkok"
    };

    const tz = commonZones[cityName.toLowerCase().trim()] || "UTC";
    zones.push([cityName.trim(), tz]);
    save();
    window.playChime?.("pop");
    render();
});

render();
setInterval(render, 1000);