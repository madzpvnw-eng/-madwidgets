const STORAGE_KEY = "madwidgets-notes-content";
const noteInput = document.getElementById("note-input");
const saveStatus = document.getElementById("save-status");
const wordCountEl = document.getElementById("word-count");
const charCountEl = document.getElementById("char-count");
const copyNoteBtn = document.getElementById("copy-note-btn");
const clearNoteBtn = document.getElementById("clear-note-btn");

// Load existing note
try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) noteInput.value = saved;
} catch (_) {}

function updateStats() {
    const text = noteInput.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    wordCountEl.textContent = `${words} word${words === 1 ? "" : "s"}`;
    charCountEl.textContent = `${chars} char${chars === 1 ? "" : "s"}`;
}

let saveTimeout = null;
function handleInput() {
    updateStats();
    saveStatus.innerHTML = `<span class="save-dot" style="background: var(--warning)"></span><span>Saving...</span>`;
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        try {
            localStorage.setItem(STORAGE_KEY, noteInput.value);
            saveStatus.innerHTML = `<span class="save-dot" style="background: var(--success)"></span><span>All changes saved</span>`;
        } catch (_) {}
    }, 400);
}

noteInput.addEventListener("input", handleInput);

copyNoteBtn.addEventListener("click", () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(noteInput.value).then(() => {
            window.showToast?.("Note copied to clipboard!", "check");
            window.playChime?.("pop");
        });
    } else {
        prompt("Copy note:", noteInput.value);
    }
});

clearNoteBtn.addEventListener("click", () => {
    if (noteInput.value && confirm("Clear entire note?")) {
        noteInput.value = "";
        handleInput();
        window.playChime?.("tick");
    }
});

updateStats();
