let isVerified = false;

// 1. Send OTP
async function sendOTP() {
  const phone = document.getElementById("phoneNumber").value;
  if (phone.length < 10) return showToast("Invalid Phone Number");

  try {
    const res = await fetch("http://localhost:3000/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();

    if (data.success) {
      document.getElementById("phoneStep").classList.add("hidden");
      document.getElementById("otpVerifyStep").classList.remove("hidden");
      showToast("OTP Sent (Check VS Code Terminal)");
    }
  } catch (e) {
    showToast("Server Error: Ensure Backend is Running");
  }
}

// 2. Verify OTP
async function verifyOTP() {
  const phone = document.getElementById("phoneNumber").value;
  const code = document.getElementById("otpCode").value;

  try {
    const res = await fetch("http://localhost:3000/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();

    if (data.success) {
      isVerified = true;
      document.getElementById("otpSection").classList.add("hidden");
      document.getElementById("profileFormSection").classList.remove("hidden");
      showToast("Identity Verified");
      loadUserProfile(); // Load data
    } else {
      showToast("Invalid Code");
    }
  } catch (e) {
    showToast("Verification Failed");
  }
}

function resetOTP() {
  document.getElementById("phoneStep").classList.remove("hidden");
  document.getElementById("otpVerifyStep").classList.add("hidden");
}

// 3. Save Profile
async function saveUserProfile() {
  if (!isVerified) return showToast("Verification Required");

  const name = document.getElementById("newUsername").value.trim();
  const avatarInput = document.getElementById("newAvatar");

  if (!name) return showToast("Error: Designation Required");
  currentUser.name = name;

  if (avatarInput.files && avatarInput.files[0]) {
    const file = avatarInput.files[0];
    if (file.size > 2097152) return showToast("Error: Image too large (>2MB)");
    try {
      currentUser.avatar = await readFile(file);
    } catch (e) {
      return showToast("Error reading file");
    }
  } else if (!currentUser.avatar) {
    currentUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=0a0a12&color=4CC9F0`;
  }

  localStorage.setItem(DB_USER_KEY, JSON.stringify(currentUser));
  updateUserDisplay();

  const msg = document.getElementById("profileSavedMsg");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 3000);

  showToast("Identity Configured");
  avatarInput.value = "";
}
