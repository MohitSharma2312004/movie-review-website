// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initStarRating();
    resetApp(); // Load default trending movies on startup early
    initDemoBlogs(); 
    loadUserProfile();
    updateUserDisplay();
    try {
        renderBlogFeed();
    } catch(e) { console.error("Blog feed init error:", e); }
});

// --- Tab Navigation ---
function switchMainTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(el => {
        el.classList.remove('active-tab');
        el.classList.remove('text-cyber-cyan', 'border-cyber-cyan');
        el.classList.add('text-gray-400', 'border-transparent');
    });

    document.getElementById(`tab-${tabId}`).classList.add('active');
    
    const btn = document.getElementById(`nav-${tabId}`);
    if (btn) {
        btn.classList.add('active-tab', 'text-cyber-cyan', 'border-cyber-cyan');
        btn.classList.remove('text-gray-400', 'border-transparent');
    }
}

function resetApp() {
    document.getElementById('searchInput').value = '';
    loadDemoData();
}

function loadDemoData() {
    const demos = [
        { Title: "Oppenheimer", Year: "2023", imdbID: "tt15398776", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyMzQwMTY2Nzk@._V1_SX300.jpg" },
        { Title: "Spider-Man: Across the Spider-Verse", Year: "2023", imdbID: "tt9362722", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmRE1MDM5MTZmZTM4_V1_SX300.jpg" },
        { Title: "Dune: Part Two", Year: "2024", imdbID: "tt15239678", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BODdjMjM3NGQtZDA5OC00NGE4LWIyZDQtZjYwOGZlMTM5ZTQ1XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg" },
        { Title: "The Batman", Year: "2022", imdbID: "tt1877830", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_SX300.jpg" },
        { Title: "Everything Everywhere All at Once", Year: "2022", imdbID: "tt6710474", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmOTE3XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg" }
    ];
    renderGrid(demos);
    const pag = document.getElementById('paginationControls');
    if(pag) pag.classList.add('hidden');
}