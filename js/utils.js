// --- Helper: Read File as Base64 ---
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// --- Toast Notification ---
function showToast(msg, type = "success") {
    const toast = document.getElementById('toast');
    const toastPanel = document.getElementById('toastPanel');
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    
    document.getElementById('toastMsg').innerText = msg;
    
    if (type === "error") {
        toastTitle.innerText = "ERROR";
        toastIcon.className = "fa-solid fa-circle-exclamation text-red-500";
        toastPanel.className = "glass-panel px-6 py-4 rounded-xl border-l-4 border-red-500 flex items-center gap-4 bg-black/90";
    } else {
        toastTitle.innerText = "SUCCESS";
        toastIcon.className = "fa-solid fa-check text-cyber-cyan";
        toastPanel.className = "glass-panel px-6 py-4 rounded-xl border-l-4 border-cyber-cyan flex items-center gap-4 bg-black/90";
    }

    toast.classList.remove('translate-x-full');
    setTimeout(() => toast.classList.add('translate-x-full'), 3000);
}