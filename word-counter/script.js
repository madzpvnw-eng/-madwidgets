const textEl = document.getElementById("text");
const wordsEl = document.getElementById("words");
const charsEl = document.getElementById("chars");
const sentencesEl = document.getElementById("sentences");
const readTimeEl = document.getElementById("read-time");
const copyBtn = document.getElementById("copy-btn");
const clearBtn = document.getElementById("clear-btn");

function updateCounts() {
    const text = textEl.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    // Count sentences ending in . ! ?
    const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || [1]).length : 0;

    // Estimated reading time at ~200 WPM
    const readMinutes = (words / 200);
    const readTimeStr = readMinutes < 1 ? (words > 0 ? "< 1 min" : "0 min") : `${Math.ceil(readMinutes)} min`;

    wordsEl.textContent = words.toLocaleString();
    charsEl.textContent = chars.toLocaleString();
    sentencesEl.textContent = sentences.toLocaleString();
    readTimeEl.textContent = readTimeStr;
}

textEl.addEventListener("input", updateCounts);

copyBtn.addEventListener("click", () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textEl.value).then(() => {
            window.showToast?.("Text copied to clipboard!", "check");
            window.playChime?.("pop");
        });
    } else {
        prompt("Copy text:", textEl.value);
    }
});

clearBtn.addEventListener("click", () => {
    if (textEl.value) {
        textEl.value = "";
        updateCounts();
        window.playChime?.("tick");
    }
});

updateCounts();
