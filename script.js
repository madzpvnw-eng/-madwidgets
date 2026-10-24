const grid = document.getElementById("widget-grid");
const searchInput = document.getElementById("widget-search");
const count = document.getElementById("widget-count");
const emptyState = document.getElementById("empty-state");
let activeCategory = "all";

function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        lucide.createIcons();
    }
}

function getLiveTimeStr() {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function previewMarkup(widget) {
    const timeStr = getLiveTimeStr();
    switch (widget.preview) {
        case "clock":
            return `<div class="preview-clock"><strong>${timeStr}</strong><span>Live Digital · Greeting</span></div>`;
        case "analog":
            return `<div class="preview-analog"><span class="hand hour"></span><span class="hand minute"></span><span class="hand second"></span><span class="pin"></span></div>`;
        case "countdown":
            return `<div class="preview-countdown"><b>12</b><b>08</b><b>41</b></div>`;
        case "stopwatch":
            return `<div class="preview-stopwatch"><strong>00:24.18</strong><span>LAP 03 · FASTEST</span></div>`;
        case "flip":
            return `<div class="preview-flip"><b>10</b><b>32</b></div>`;
        case "pomodoro":
            return `<div class="preview-ring"><strong>25:00</strong><span class="mode-tag">FOCUS</span></div>`;
        case "progress":
            return `<div class="preview-progress"><strong>Year 2026 progress</strong><div><i></i></div><span>68% completed</span></div>`;
        case "streak":
            return `<div class="preview-streak"><strong>🔥 14</strong><span>days current streak</span></div>`;
        case "calendar":
            return `<div class="preview-calendar"><strong>October 2026</strong><div class="mini-days">M T W T F S S</div><div class="mini-grid">1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 <b>24</b></div></div>`;
        case "weather":
            return `<div class="preview-weather"><strong>28°C</strong><span>Partly sunny · Jakarta</span></div>`;
        case "quote":
            return `<div class="preview-quote">“Make it simple, but significant.”<small>— Don Draper</small></div>`;
        case "world":
            return `<div class="preview-world"><div><strong>Jakarta</strong><span>${timeStr}</span></div><div><strong>Tokyo</strong><span>+2h</span></div><div><strong>London</strong><span>-7h</span></div></div>`;
        case "day":
            return `<div class="preview-day"><strong>${timeStr}</strong><div><i></i></div><span>62% of today</span></div>`;
        case "habit":
            return `<div class="preview-habit"><strong>5 / 7</strong><span>days checked in</span></div>`;
        case "water":
            return `<div class="preview-water"><strong>6 / 8</strong><span>glasses · 1,500 ml</span></div>`;
        case "notes":
            return `<div class="preview-notes"><i data-lucide="sticky-note"></i><span>Quick ideas auto-saved...</span></div>`;
        case "words":
            return `<div class="preview-words"><strong>342</strong><span>words · 1.4 min read</span></div>`;
        case "case":
            return `<div class="preview-case"><b>Title Case</b><span>camelCase · snake_case</span></div>`;
        case "age":
            return `<div class="preview-age"><strong>22 yrs</strong><span>8,036 days on Earth</span></div>`;
        case "date":
            return `<div class="preview-date"><strong>42 days</strong><span>until project release</span></div>`;
        case "timezone":
            return `<div class="preview-world"><div><strong>UTC+7</strong><span>Jakarta</span></div><div><strong>UTC+9</strong><span>Tokyo</span></div><div><strong>UTC+0</strong><span>London</span></div></div>`;
        case "prayer":
            return `<div class="preview-prayer"><strong>Maghrib 17:58</strong><span>Next prayer in 35m</span></div>`;
        default:
            return `<div class="preview-generic"><i data-lucide="${widget.icon}"></i></div>`;
    }
}

function createCard(widget) {
    const fullEmbedUrl = new URL(widget.link, window.location.href).href + "?embed=true";
    return `
        <div class="widget-card" data-name="${widget.title.toLowerCase()} ${widget.description.toLowerCase()}" data-category="${widget.category}">
            <a href="${widget.link}" class="preview-link" aria-label="Open ${widget.title}">
                <div class="preview">${previewMarkup(widget)}</div>
            </a>
            <div class="card-info">
                <div class="card-title-row">
                    <a href="${widget.link}" class="card-title-link"><h3>${widget.title}</h3></a>
                    <span class="tag">${widget.label}</span>
                </div>
                <p>${widget.description}</p>
                <div class="card-actions">
                    <a href="${widget.link}" class="open">Open widget <span>→</span></a>
                    <button type="button" class="quick-copy-btn" data-url="${fullEmbedUrl}" title="Copy Notion embed URL">
                        <i data-lucide="share-2"></i>
                        <span>Copy Embed</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderWidgets() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = widgets.filter(widget => {
        const categoryMatch = activeCategory === "all" || widget.category === activeCategory;
        const queryMatch = !query || `${widget.title} ${widget.description} ${widget.label}`.toLowerCase().includes(query);
        return categoryMatch && queryMatch;
    });

    grid.innerHTML = filtered.map(createCard).join("");
    count.textContent = `${filtered.length} widget${filtered.length === 1 ? "" : "s"}`;
    emptyState.hidden = filtered.length !== 0;
    
    // Bind quick copy buttons
    grid.querySelectorAll(".quick-copy-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = btn.dataset.url;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(() => {
                    window.showToast?.("Notion embed URL copied!", "check");
                    window.playChime?.("pop");
                }).catch(() => prompt("Copy embed URL:", url));
            } else {
                prompt("Copy embed URL:", url);
            }
        });
    });

    refreshIcons();
}

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        activeCategory = button.dataset.category;
        renderWidgets();
    });
});

searchInput.addEventListener("input", renderWidgets);

document.addEventListener("keydown", event => {
    if (event.key === "/" && document.activeElement !== searchInput) {
        event.preventDefault();
        searchInput.focus();
    }
});

// Update live time preview in cards every 30 seconds
setInterval(() => {
    const timeElements = document.querySelectorAll(".preview-clock strong, .preview-day strong");
    const newTime = getLiveTimeStr();
    timeElements.forEach(el => el.textContent = newTime);
}, 30000);

renderWidgets();
