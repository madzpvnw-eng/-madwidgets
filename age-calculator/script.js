const dob = document.getElementById("dob");
const ageOut = document.getElementById("age");
const detailOut = document.getElementById("detail");
const totalDaysEl = document.getElementById("total-days");
const totalWeeksEl = document.getElementById("total-weeks");
const nextBdayEl = document.getElementById("next-bday");
const calcBtn = document.getElementById("calc");

function calculateAge() {
    if (!dob.value) return;

    const b = new Date(dob.value + "T00:00:00");
    const n = new Date();

    if (isNaN(b.getTime()) || b > n) {
        ageOut.textContent = "--";
        detailOut.textContent = "Please pick a past birthdate";
        return;
    }

    let y = n.getFullYear() - b.getFullYear();
    let m = n.getMonth() - b.getMonth();
    let d = n.getDate() - b.getDate();

    if (d < 0) {
        m--;
        d += new Date(n.getFullYear(), n.getMonth(), 0).getDate();
    }
    if (m < 0) {
        y--;
        m += 12;
    }

    ageOut.textContent = `${y} yrs`;
    detailOut.textContent = `${m} months · ${d} days`;

    // Total days & weeks
    const msDiff = n - b;
    const totalDays = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    totalDaysEl.textContent = totalDays.toLocaleString();
    totalWeeksEl.textContent = totalWeeks.toLocaleString();

    // Next birthday
    let nextBday = new Date(n.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday < n) {
        nextBday = new Date(n.getFullYear() + 1, b.getMonth(), b.getDate());
    }
    const daysToBday = Math.ceil((nextBday - n) / (1000 * 60 * 60 * 24));
    nextBdayEl.textContent = daysToBday === 0 ? "Today! 🎂" : `In ${daysToBday} days`;
}

calcBtn.addEventListener("click", () => {
    window.playChime?.("tick");
    calculateAge();
});

dob.addEventListener("change", calculateAge);
calculateAge();
