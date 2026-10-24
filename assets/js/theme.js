const STORAGE_KEY = "madwidgets-theme";
const DEFAULT_THEME = "light";

function getTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : DEFAULT_THEME;
}

function updateThemeButtons(theme) {
    document.querySelectorAll(".theme-toggle").forEach((button) => {
        const isDark = theme === "dark";
        const icon = isDark ? "sun" : "moon";
        button.innerHTML = window.lucide
            ? `<i data-lucide="${icon}" aria-hidden="true"></i>`
            : (isDark ? "☼" : "☾");
        button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
        button.setAttribute("title", isDark ? "Light theme" : "Dark theme");
    });
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
}

function setTheme(theme) {
    const safeTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", safeTheme);
    document.documentElement.style.colorScheme = safeTheme;
    try {
        localStorage.setItem(STORAGE_KEY, safeTheme);
    } catch (_) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", safeTheme === "dark" ? "#0F0F10" : "#FAFAF9");
    updateThemeButtons(safeTheme);
    return safeTheme;
}

function toggleTheme() {
    return setTheme(getTheme() === "dark" ? "light" : "dark");
}

// ==========================================
// TOAST HELPER
// ==========================================
function showToast(message, icon = "check") {
    let toast = document.getElementById("notion-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "notion-toast";
        toast.className = "notion-toast";
        document.body.appendChild(toast);
    }
    const iconHtml = window.lucide
        ? `<i data-lucide="${icon}"></i>`
        : "✓";
    toast.innerHTML = `${iconHtml}<span>${message}</span>`;
    if (window.lucide) window.lucide.createIcons();
    toast.classList.add("show");
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

// ==========================================
// WEB AUDIO SOUND SYNTHESIZER
// ==========================================
let audioCtx = null;
function playChime(type = "bell") {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === "suspended") audioCtx.resume();

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === "bell") {
            // Calm chime (E5 -> G#5)
            osc.type = "sine";
            osc.frequency.setValueAtTime(659.25, now);
            osc.frequency.exponentialRampToValueAtTime(830.61, now + 0.15);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            osc.start(now);
            osc.stop(now + 1.2);
        } else if (type === "tick") {
            // Subtle click
            osc.type = "triangle";
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === "pop") {
            // Joyful pop
            osc.type = "sine";
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === "complete") {
            // Success chord (C5 - E5 - G5)
            [523.25, 659.25, 783.99].forEach((freq, idx) => {
                const subOsc = audioCtx.createOscillator();
                const subGain = audioCtx.createGain();
                subOsc.connect(subGain);
                subGain.connect(audioCtx.destination);
                subOsc.type = "sine";
                subOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
                subGain.gain.setValueAtTime(0.15, now + idx * 0.09);
                subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
                subOsc.start(now + idx * 0.09);
                subOsc.stop(now + 1.2);
            });
        }
    } catch (_) {}
}

// ==========================================
// COPY NOTION EMBED URL HELPER
// ==========================================
function copyNotionEmbedUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("embed", "true");
    const embedUrl = url.toString();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(embedUrl).then(() => {
            showToast("Copied Notion embed link! Paste in Notion → Create embed", "check");
            playChime("pop");
        }).catch(() => {
            prompt("Copy this Notion embed URL:", embedUrl);
        });
    } else {
        prompt("Copy this Notion embed URL:", embedUrl);
    }
}

// ==========================================
// TOOLBAR ENHANCER
// ==========================================
function enhanceToolbar() {
    const isInsideIframe = window.self !== window.top;
    const urlParams = new URLSearchParams(window.location.search);
    if (isInsideIframe || urlParams.get("embed") === "true") {
        document.body.classList.add("is-embedded");
    }

    const toolbar = document.querySelector(".widget-toolbar");
    if (!toolbar) return;

    // Check if we need to add the Copy Embed button
    if (!toolbar.querySelector(".copy-embed-btn")) {
        const copyBtn = document.createElement("button");
        copyBtn.className = "toolbar-btn copy-embed-btn";
        copyBtn.title = "Copy Notion embed URL";
        copyBtn.innerHTML = window.lucide 
            ? `<i data-lucide="share-2"></i><span class="label-text">Copy Embed</span>`
            : `🔗 <span class="label-text">Copy Embed</span>`;
        copyBtn.addEventListener("click", copyNotionEmbedUrl);

        // Insert before theme toggle or append
        const themeBtn = toolbar.querySelector(".theme-toggle");
        if (themeBtn && themeBtn.parentNode) {
            themeBtn.parentNode.insertBefore(copyBtn, themeBtn);
        } else {
            toolbar.appendChild(copyBtn);
        }
    }

    // Wrap theme-toggle with toolbar-btn class if not already
    const themeBtn = toolbar.querySelector(".theme-toggle");
    if (themeBtn && !themeBtn.classList.contains("toolbar-btn")) {
        themeBtn.classList.add("toolbar-btn");
    }

    const backLink = toolbar.querySelector("a");
    if (backLink && !backLink.classList.contains("toolbar-btn")) {
        backLink.classList.add("toolbar-btn");
    }

    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
}

// Initial theme apply
setTheme(getTheme());

document.addEventListener("DOMContentLoaded", () => {
    updateThemeButtons(getTheme());
    document.querySelectorAll(".theme-toggle").forEach((button) => {
        button.addEventListener("click", toggleTheme);
    });
    enhanceToolbar();
});

// Expose globals for widgets
window.playChime = playChime;
window.showToast = showToast;
window.copyNotionEmbedUrl = copyNotionEmbedUrl;
window.toggleTheme = toggleTheme;
