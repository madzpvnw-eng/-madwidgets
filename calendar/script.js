const monthTitle = document.getElementById("month");
const daysGrid = document.getElementById("days");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const todayBtn = document.getElementById("today-btn");
const selectedDateLabel = document.getElementById("selected-date-label");

let displayedDate = new Date();
let selectedDate = new Date();

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function renderCalendar() {
    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth();

    monthTitle.textContent = `${MONTH_NAMES[month]} ${year}`;
    daysGrid.innerHTML = "";

    // 0 = Sunday, 1 = Monday ... 6 = Saturday
    // We want Monday = 0, Sunday = 6
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = (firstDay === 0) ? 6 : firstDay - 1;
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Empty offset cells
    for (let i = 0; i < startOffset; i++) {
        const empty = document.createElement("div");
        empty.className = "day-cell empty";
        daysGrid.appendChild(empty);
    }

    const today = new Date();

    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement("div");
        cell.className = "day-cell";
        cell.textContent = day;

        const isToday = (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );

        const isSelected = (
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear()
        );

        if (isToday) cell.classList.add("today");
        else if (isSelected) cell.classList.add("selected");

        cell.addEventListener("click", () => {
            selectedDate = new Date(year, month, day);
            window.playChime?.("tick");
            renderCalendar();
            updateFooter();
        });

        daysGrid.appendChild(cell);
    }

    if (window.lucide) window.lucide.createIcons();
    updateFooter();
}

function updateFooter() {
    const today = new Date();
    const isToday = (
        selectedDate.getDate() === today.getDate() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getFullYear() === today.getFullYear()
    );

    const prefix = isToday ? "Today · " : "";
    selectedDateLabel.textContent = prefix + selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}

prevBtn.addEventListener("click", () => {
    displayedDate.setMonth(displayedDate.getMonth() - 1);
    window.playChime?.("tick");
    renderCalendar();
});

nextBtn.addEventListener("click", () => {
    displayedDate.setMonth(displayedDate.getMonth() + 1);
    window.playChime?.("tick");
    renderCalendar();
});

todayBtn.addEventListener("click", () => {
    displayedDate = new Date();
    selectedDate = new Date();
    window.playChime?.("pop");
    renderCalendar();
});

renderCalendar();