function calculateAge() {
    const dobValue = document.getElementById("dob").value;

    if (!dobValue) {
        alert("Please enter your date of birth.");
        return;
    }

    const birthDate = new Date(dobValue + "T00:00:00");
    const today = new Date();

    if (birthDate > today) {
        alert("Date of birth cannot be in the future.");
        return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;

        const previousMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        );

        days += previousMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    const livedDays = Math.floor(
        (today - birthDate) / (1000 * 60 * 60 * 24)
    );

    let nextBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
    );

    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const daysRemaining = Math.ceil(
        (nextBirthday - today) / (1000 * 60 * 60 * 24)
    );

    const birthdayText = nextBirthday.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );

    document.getElementById("age").textContent =
        years + " years";

    document.getElementById("months").textContent =
        months;

    document.getElementById("days").textContent =
        days;

    document.getElementById("livedDays").textContent =
        livedDays.toLocaleString();

    document.getElementById("nextBirthday").innerHTML =
        birthdayText +
        "<br>" +
        daysRemaining +
        " days remaining 🎉";
}


// Dark mode
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    themeBtn.textContent = dark ? "☀️" : "🌙";

    localStorage.setItem("ageoraTheme", dark ? "dark" : "light");
});


// Remember theme
if (localStorage.getItem("ageoraTheme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
}
