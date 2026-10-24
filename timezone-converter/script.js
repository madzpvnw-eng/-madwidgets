const zones = [
    ["Jakarta", "Asia/Jakarta"],
    ["Tokyo", "Asia/Tokyo"],
    ["Dubai", "Asia/Dubai"],
    ["London", "Europe/London"],
    ["New York", "America/New_York"],
    ["San Francisco", "America/Los_Angeles"],
    ["Sydney", "Australia/Sydney"]
];

const input = document.getElementById("time");
const list = document.getElementById("list");
const nowBtn = document.getElementById("now");
const plus1hBtn = document.getElementById("plus-1h");
const minus1hBtn = document.getElementById("minus-1h");

function setInputToNow() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    input.value = d.toISOString().slice(0, 16);
    render();
}

function adjustHours(delta) {
    if (!input.value) setInputToNow();
    const d = new Date(input.value);
    d.setHours(d.getHours() + delta);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    input.value = d.toISOString().slice(0, 16);
    window.playChime?.("tick");
    render();
}

function render() {
    if (!input.value) return;
    const d = new Date(input.value);

    list.innerHTML = zones.map(([city, tz]) => {
        try {
            const timeStr = new Intl.DateTimeFormat("en-GB", {
                timeZone: tz,
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }).format(d);

            const dateStr = new Intl.DateTimeFormat("en-US", {
                timeZone: tz,
                weekday: "short",
                day: "numeric",
                month: "short"
            }).format(d);

            const hourInTz = parseInt(new Intl.DateTimeFormat("en-US", {
                timeZone: tz,
                hour: "numeric",
                hour12: false
            }).format(d), 10);

            const isDay = hourInTz >= 6 && hourInTz < 18;
            const icon = isDay ? "☀️" : "🌙";

            const tzName = new Intl.DateTimeFormat("en-US", {
                timeZone: tz,
                timeZoneName: "short"
            }).format(d).split(", ").pop();

            return `
                <div class="tz-row">
                    <div class="tz-left">
                        <span class="tz-icon">${icon}</span>
                        <div>
                            <strong class="tz-city-name">${city}</strong>
                            <small class="tz-offset-text">${tzName}</small>
                        </div>
                    </div>
                    <div class="tz-right">
                        <span class="tz-time-val">${timeStr}</span>
                        <span class="tz-date-val">${dateStr}</span>
                    </div>
                </div>
            `;
        } catch (_) {
            return "";
        }
    }).join("");
}

nowBtn.addEventListener("click", () => {
    window.playChime?.("pop");
    setInputToNow();
});

plus1hBtn.addEventListener("click", () => adjustHours(1));
minus1hBtn.addEventListener("click", () => adjustHours(-1));
input.addEventListener("input", render);

setInputToNow();
