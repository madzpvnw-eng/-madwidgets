const cityInput = document.getElementById("cityInput");
const searchForm = document.getElementById("search-form");
const cityNameEl = document.getElementById("cityName");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const weatherIconEl = document.getElementById("weatherIcon");
const windSpeedEl = document.getElementById("wind-speed");
const humidityEl = document.getElementById("humidity");
const tempRangeEl = document.getElementById("temp-range");
const forecastListEl = document.getElementById("forecast-list");
const cityChips = document.querySelectorAll(".city-chip");

const weatherCodes = {
    0: { text: "Clear Sky", icon: "sun" },
    1: { text: "Mainly Clear", icon: "cloud-sun" },
    2: { text: "Partly Cloudy", icon: "cloud-sun" },
    3: { text: "Overcast", icon: "cloud" },
    45: { text: "Fog", icon: "cloud-fog" },
    48: { text: "Depositing Rime Fog", icon: "cloud-fog" },
    51: { text: "Light Drizzle", icon: "cloud-drizzle" },
    53: { text: "Drizzle", icon: "cloud-drizzle" },
    55: { text: "Heavy Drizzle", icon: "cloud-drizzle" },
    61: { text: "Light Rain", icon: "cloud-rain" },
    63: { text: "Moderate Rain", icon: "cloud-rain" },
    65: { text: "Heavy Rain", icon: "cloud-rain" },
    71: { text: "Light Snow", icon: "snowflake" },
    73: { text: "Moderate Snow", icon: "snowflake" },
    75: { text: "Heavy Snow", icon: "snowflake" },
    80: { text: "Rain Showers", icon: "cloud-rain" },
    95: { text: "Thunderstorm", icon: "cloud-lightning" }
};

async function getWeather(city) {
    try {
        descriptionEl.textContent = "Loading...";
        weatherIconEl.innerHTML = `<i data-lucide="loader-2"></i>`;
        if (window.lucide) window.lucide.createIcons();

        // 1. Geocoding
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const place = geoData.results[0];
        const lat = place.latitude;
        const lon = place.longitude;
        const resolvedName = place.name + (place.country_code ? `, ${place.country_code}` : "");

        // 2. Weather & Forecast
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`;
        const weatherRes = await fetch(weatherUrl);
        const data = await weatherRes.json();

        const cur = data.current;
        const daily = data.daily;

        cityNameEl.textContent = resolvedName;
        temperatureEl.textContent = `${Math.round(cur.temperature_2m)}°C`;
        
        const codeInfo = weatherCodes[cur.weather_code] || { text: "Clear", icon: "sun" };
        descriptionEl.textContent = codeInfo.text;
        weatherIconEl.innerHTML = `<i data-lucide="${codeInfo.icon}"></i>`;

        windSpeedEl.textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
        humidityEl.textContent = `${cur.relative_humidity_2m}%`;

        if (daily && daily.temperature_2m_max) {
            tempRangeEl.textContent = `${Math.round(daily.temperature_2m_min[0])}° / ${Math.round(daily.temperature_2m_max[0])}°`;

            // Render 3 upcoming days
            forecastListEl.innerHTML = "";
            for (let i = 1; i <= 3 && i < daily.time.length; i++) {
                const dateObj = new Date(daily.time[i]);
                const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                const dayCode = weatherCodes[daily.weather_code[i]] || { text: "Clear", icon: "sun" };
                const maxT = Math.round(daily.temperature_2m_max[i]);
                const minT = Math.round(daily.temperature_2m_min[i]);

                const row = document.createElement("div");
                row.className = "forecast-row";
                row.innerHTML = `
                    <span class="forecast-day">${dayName}</span>
                    <span class="forecast-condition"><i data-lucide="${dayCode.icon}"></i>${dayCode.text}</span>
                    <span class="forecast-temps"><b>${maxT}°</b><span class="min">${minT}°</span></span>
                `;
                forecastListEl.appendChild(row);
            }
        }

        if (window.lucide) window.lucide.createIcons();
    } catch (err) {
        descriptionEl.textContent = "City not found";
        temperatureEl.textContent = "--°C";
        weatherIconEl.innerHTML = `<i data-lucide="alert-circle"></i>`;
        if (window.lucide) window.lucide.createIcons();
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = cityInput.value.trim();
    if (q) getWeather(q);
});

cityChips.forEach(chip => {
    chip.addEventListener("click", () => {
        cityInput.value = chip.dataset.city;
        getWeather(chip.dataset.city);
    });
});

getWeather(cityInput.value || "Jakarta");