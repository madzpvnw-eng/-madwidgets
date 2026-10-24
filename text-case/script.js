const textEl = document.getElementById("text");
const copyResultBtn = document.getElementById("copy-result-btn");
const clearBtn = document.getElementById("clear-btn");
const caseButtons = document.querySelectorAll(".case-btn[data-mode]");

function convertCase(mode, str) {
    if (!str) return "";
    switch (mode) {
        case "upper":
            return str.toUpperCase();
        case "lower":
            return str.toLowerCase();
        case "sentence":
            return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        case "title":
            return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        case "camel":
            return str.toLowerCase()
                .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
                .replace(/[^a-zA-Z0-9]/g, "");
        case "snake":
            return str.trim()
                .toLowerCase()
                .replace(/[\s\W-]+/g, "_");
        case "kebab":
            return str.trim()
                .toLowerCase()
                .replace(/[\s\W_]+/g, "-");
        default:
            return str;
    }
}

caseButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        textEl.value = convertCase(mode, textEl.value);
        window.playChime?.("tick");
    });
});

copyResultBtn.addEventListener("click", () => {
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
    textEl.value = "";
    window.playChime?.("tick");
});
