


function calculateAge() {
    const dob = document.getElementById("dob").value;

    if (!dob) {
        alert("Please enter your date of birth");
        return;
    }

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const birthdayThisYear = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
    );

    if (today < birthdayThisYear) {
        age--;
    }

    // Next birthday
    let nextBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
    );

    if (today >= nextBirthday) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    const birthdayText = nextBirthday.toLocaleDateString(
        "en-US",
        options
    );

    const difference = nextBirthday - today;
    const daysRemaining = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );

    document.getElementById("age").innerHTML =
        "Your Age: " + age + " years";

    document.getElementById("nextBirthday").innerHTML =
        "Next Birthday: " + birthdayText +
        "<br>Days Remaining: " + daysRemaining;
}


