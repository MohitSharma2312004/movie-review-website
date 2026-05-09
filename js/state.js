// Global State
let currentUser = {
    name: "Cmdr. Shepard",
    avatar: "https://ui-avatars.com/api/?name=Cmdr+Shepard&background=0a0a12&color=4CC9F0"
};

// Load User Logic
function loadUserProfile() {
    const saved = localStorage.getItem(DB_USER_KEY);
    if(saved) {
        currentUser = JSON.parse(saved);
        updateUserDisplay();
    }
}

// Update UI elements that show user info
function updateUserDisplay() {
    const avatarEls = ['navbarAvatar', 'reviewUserAvatar', 'profilePreview'];
    avatarEls.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.src = currentUser.avatar;
    });

    const nameDisplay = document.getElementById('reviewUsernameDisplay');
    if(nameDisplay) nameDisplay.innerText = currentUser.name;

    const nameInput = document.getElementById('newUsername');
    if(nameInput) nameInput.value = currentUser.name;
}