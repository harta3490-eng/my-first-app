const STORAGE_KEY = "ageora_profiles";
let profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[null,null,null]");
let activeProfile = Number(localStorage.getItem("ageora_active") || 0);
let deferredPrompt = null;

function saveProfiles() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

function loadProfiles() {
  const select = document.getElementById("profileSelect");
  select.innerHTML = "";

  profiles.forEach((profile, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = profile
      ? `${index + 1}. ${profile.name}`
      : `${index + 1}. Add Profile`;
    select.appendChild(option);
  });

  select.value = activeProfile;
  renderProfile();
}

function switchProfile() {
  activeProfile = Number(document.getElementById("profileSelect").value);
  localStorage.setItem("ageora_active", activeProfile);
  renderProfile();
}

function showProfileForm() {
  document.getElementById("profileNumber").value = activeProfile;

  const profile = profiles[activeProfile];

  document.getElementById("nameInput").value = profile?.name || "";
  document.getElementById("emailInput").value = profile?.email || "";
  document.getElementById("dobInput").value = profile?.dob || "";
  document.getElementById("locationInput").value = profile?.location || "";
  document.getElementById("pinInput").value = "";

  document.getElementById("profileModal").classList.remove("hidden");
}

function closeProfileForm() {
  document.getElementById("profileModal").classList.add("hidden");
}

function saveProfile() {
  const slot = Number(document.getElementById("profileNumber").value);

  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const dob = document.getElementById("dobInput").value;
  const location = document.getElementById("locationInput").value.trim();
  const pin = document.getElementById("pinInput").value.trim();
  const photoFile = document.getElementById("photoInput").files[0];

  if (!name || !email || !dob || !pin) {
    alert("Please complete your name, email, date of birth and PIN.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (!/^\d{4,6}$/.test(pin)) {
    alert("PIN must contain 4 to 6 numbers.");
    return;
  }

  const profile = {
    name,
    email,
    dob,
    location,
    pin
  };

  if (photoFile) {
    const reader = new FileReader();

    reader.onload = function () {
      profile.photo = reader.result;
      profiles[slot] = profile;
      activeProfile = slot;
      saveProfiles();
      localStorage.setItem("ageora_active", activeProfile);
      closeProfileForm();
      loadProfiles();
      alert("Profile saved successfully.");
    };

    reader.readAsDataURL(photoFile);
  } else {
    profile.photo = profiles[slot]?.photo || "";
    profiles[slot] = profile;
    activeProfile = slot;
    saveProfiles();
    localStorage.setItem("ageora_active", activeProfile);
    closeProfileForm();
    loadProfiles();
    alert("Profile saved successfully.");
  }
}

function renderProfile() {
  const profile = profiles[activeProfile];

  if (!profile) {
    document.getElementById("profileName").textContent = "No profile yet";
    document.getElementById("profileEmail").textContent =
      "Create your Ageora profile";

    document.getElementById("profilePhoto").innerHTML = "👤";

    document.getElementById("age").textContent = "--";
    document.getElementById("years").textContent = "--";
    document.getElementById("months").textContent = "--";
    document.getElementById("days").textContent = "--";

    document.getElementById("nextBirthday").textContent =
      "Next birthday";

    document.getElementById("birthdayCountdown").textContent =
      "Create a profile to begin.";

    return;
  }

  document.getElementById("profileName").textContent = profile.name;
  document.getElementById("profileEmail").textContent = profile.email;

  const photo = document.getElementById("profilePhoto");

  if (profile.photo) {
    photo.innerHTML = `<img src="${profile.photo}" alt="Profile photo">`;
  } else {
    photo.innerHTML = "👤";
  }

  calculateAge(profile.dob);
}

function calculateAge(dobString) {
  if (!dobString) return;

  const dob = new Date(`${dobString}T00:00:00`);
  const today = new Date();

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

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

  document.getElementById("age").textContent = `${years} years`;
  document.getElementById("years").textContent = years;
  document.getElementById("months").textContent = months;
  document.getElementById("days").textContent = days;

  const next = new Date(
    today.getFullYear(),
    dob.getMonth(),
    dob.getDate()
  );

  if (next < today) {
    next.setFullYear(today.getFullYear() + 1);
  }

  const milliseconds = next - today;
  const daysRemaining = Math.ceil(
    milliseconds / (1000 * 60 * 60 * 24)
  );

  document.getElementById("nextBirthday").textContent =
    `Next Birthday: ${next.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long"
    })}`;

  document.getElementById("birthdayCountdown").textContent =
    `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining 🎉`;
}

function openCalendar() {
  const profile = profiles[activeProfile];

  if (!profile) {
    alert("Create a profile first.");
    return;
  }

  const dob = new Date(`${profile.dob}T00:00:00`);

  const year = new Date().getFullYear();
  const birthday = new Date(
    year,
    dob.getMonth(),
    dob.getDate()
  );

  const date = birthday.toISOString().split("T")[0];

  const calendarUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(profile.name + "'s Birthday")}` +
    `&dates=${date.replaceAll("-", "")}/${date.replaceAll("-", "")}`;

  window.open(calendarUrl, "_blank");
}

async function setBirthdayReminder() {
  const profile = profiles[activeProfile];

  if (!profile) {
    alert("Create a profile first.");
    return;
  }

  if ("Notification" in window) {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      new Notification("Ageora Birthday Reminder", {
        body: `${profile.name}'s birthday reminder is enabled.`
      });

      alert(
        "Notification permission is enabled. For reliable background birthday alarms, the Android version will use native notifications."
      );
    } else {
      alert("Notification permission was not granted.");
    }
  } else {
    alert("This browser does not support notifications.");
  }
}

function openCamera() {
  document.getElementById("cameraInput").click();
}

document.getElementById("cameraInput").addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    const profile = profiles[activeProfile];

    if (!profile) {
      alert("Create a profile first.");
      return;
    }

    profile.photo = reader.result;
    profiles[activeProfile] = profile;
    saveProfiles();
    renderProfile();
  };

  reader.readAsDataURL(file);
});

function getLocation() {
  if (!navigator.geolocation) {
    alert("Location is not supported by this browser.");
    return;
  }

  document.getElementById("locationStatus").textContent =
    "Getting location...";

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      localStorage.setItem(
        "ageora_location",
        JSON.stringify({ lat, lon })
      );

      document.getElementById("locationStatus").textContent =
        `${lat.toFixed(3)}, ${lon.toFixed(3)}`;

      alert("Location access enabled.");
    },
    () => {
      document.getElementById("locationStatus").textContent =
        "Location denied";

      alert("Please allow location access for Ageora.");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000
    }
  );
}

function findNearby() {
  getLocation();
  alert("Choose a nearby category below to search for places.");
}

function searchNearby(category) {
  const savedLocation = JSON.parse(
    localStorage.getItem("ageora_location") || "null"
  );

  let url = `https://www.google.com/maps/search/${encodeURIComponent(category)}`;

  if (savedLocation) {
    url +=
      `/@${savedLocation.lat},${savedLocation.lon},14z`;
  }

  window.open(url, "_blank");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "ageora_dark",
    document.body.classList.contains("dark")
  );
}

function loadTheme() {
  if (localStorage.getItem("ageora_dark") === "true") {
    document.body.classList.add("dark");
  }
}

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;
});

async function installApp() {
  if (!deferredPrompt) {
    alert(
      "If the install prompt does not appear, open your browser menu and choose 'Add to Home screen' or 'Install app'."
    );
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
}

loadTheme();
loadProfiles();
