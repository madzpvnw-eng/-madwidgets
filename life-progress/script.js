const yearPercentEl = document.getElementById("year-percent");
const yearBarEl = document.getElementById("year-bar");
const yearDaysLeftEl = document.getElementById("year-days-left");

const progressPercentEl = document.getElementById("progressPercent");
const progressBarEl = document.getElementById("progressBar");
const ageEl = document.getElementById("age");
const daysLivedEl = document.getElementById("days-lived");

const birthdayInput = document.getElementById("birthday");
const lifespanInput = document.getElementById("lifespan");
const saveBtn = document.getElementById("saveBtn");
const detailsEl = document.querySelector(".birthday-details");

const STORAGE_KEY = "madwidgets-lifeprogress";

let settings = {
    birthday: "2002-01-01",
    lifespan: 85
};

try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) settings = { ...settings, ...JSON.parse(saved) };
} catch (_) {}

birthdayInput.value = settings.birthday;
lifespanInput.value = settings.lifespan;

function updateCalculations() {
    const now = new Date();

    // 1. Year Progress
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const yearTotal = endOfYear - startOfYear;
    const yearElapsed = now - startOfYear;
    const yearPct = Math.min(100, Math.max(0, (yearElapsed / yearTotal) * 100));

    yearPercentEl.textContent = `${yearPct.toFixed(1)}%`;
    yearBarEl.style.width = `${yearPct.toFixed(2)}%`;

    const msInDay = 24 * 60 * 60 * 1000;
    const daysLeft = Math.ceil((endOfYear - now) / msInDay);
    yearDaysLeftEl.textContent = `${daysLeft} days remaining in ${now.getFullYear()}`;

    // 2. Life Progress
    const birthDate = new Date(settings.birthday);
    if (!isNaN(birthDate.getTime())) {
        const msLived = now - birthDate;
        const daysLived = Math.floor(msLived / msInDay);
        const yearsLived = (msLived / (365.25 * msInDay)).toFixed(1);

        const expectedLifespanMs = settings.lifespan * 365.25 * msInDay;
        const lifePct = Math.min(100, Math.max(0, (msLived / expectedLifespanMs) * 100));

        ageEl.textContent = `${yearsLived} Years Old`;
        daysLivedEl.textContent = `${daysLived.toLocaleString()} days lived`;
        progressPercentEl.textContent = `${lifePct.toFixed(1)}%`;
        progressBarEl.style.width = `${lifePct.toFixed(2)}%`;
    }
}

saveBtn.addEventListener("click", () => {
    settings.birthday = birthdayInput.value;
    settings.lifespan = parseInt(lifespanInput.value, 10) || 85;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (_) {}
    detailsEl.open = false;
    updateCalculations();
    window.showToast?.("Life progress updated!", "check");
    window.playChime?.("pop");
});

updateCalculations();
setInterval(updateCalculations, 60000);