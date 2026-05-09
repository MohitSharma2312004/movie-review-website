let currentSearchQuery = '';
let currentPage = 1;
let activeMovie = null; 
let selectedRating = 0;

// --- Search Core ---
function handleEnter(e) { if(e.key === 'Enter') initSearch(); }

function initSearch() {
    currentSearchQuery = document.getElementById('searchInput').value.trim();
    currentPage = 1;
    fetchMovies();
}

function changePage(delta) {
    currentPage += delta;
    if (currentPage < 1) currentPage = 1;
    fetchMovies();
}

async function fetchMovies() {
    if (!currentSearchQuery) return;
    const container = document.getElementById('resultsContainer');
    const pagination = document.getElementById('paginationControls');
    
    container.innerHTML = `<div class="col-span-full flex justify-center py-20"><div class="loader-ring"></div></div>`;
    
    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(currentSearchQuery)}&page=${currentPage}&apikey=${OMDB_API_KEY}`);
        const data = await res.json();

        if (data.Response === 'True') {
            renderGrid(data.Search);
            if (pagination) {
                pagination.classList.remove('hidden');
                document.getElementById('pageIndicator').innerText = currentPage.toString().padStart(2, '0');
                document.getElementById('prevBtn').disabled = currentPage === 1;
            }
        } else {
            container.innerHTML = `<div class="col-span-full text-center text-gray-400 mt-10 p-6">${data.Error.toUpperCase()}</div>`;
            if (pagination) pagination.classList.add('hidden');
        }
    } catch (e) {
        console.error("Search error:", e);
        container.innerHTML = `<div class="col-span-full text-center text-red-500">CONNECTION LOST</div>`;
    }
}

function renderGrid(movies) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    
    movies.forEach((movie, index) => {
        const poster = (movie.Poster && movie.Poster !== 'N/A') ? movie.Poster : 'https://via.placeholder.com/300x450/111/444?text=NOT+FOUND';
        const el = document.createElement('div');
        el.style.animationDelay = `${index * 50}ms`;
        el.className = 'glass-panel rounded-2xl overflow-hidden group cursor-pointer relative fade-in-up hover:scale-[1.03] hover:shadow-2xl hover:border-white/20 transition-all duration-300';
        el.onclick = () => openMovieDetail(movie);
        el.innerHTML = `
            <div class="h-[360px] overflow-hidden relative">
                <img src="${poster}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out">
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    <button class="w-14 h-14 rounded-full bg-white/10 border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-xl backdrop-blur-md"><i class="fa-solid fa-play ml-1"></i></button>
                </div>
                <div class="absolute bottom-4 left-4 right-4 z-10">
                    <h4 class="font-outfit font-bold text-white text-lg leading-tight mb-1 truncate text-shadow" title="${movie.Title}">${movie.Title}</h4>
                    <div class="flex justify-between items-center text-xs font-inter text-gray-300">
                        <span>${movie.Year}</span>
                        <span class="uppercase font-semibold tracking-wider text-white/70 bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">${movie.Type}</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(el);
    });
}

// --- Detail View Logic ---
function openMovieDetail(movie) {
    activeMovie = movie;
    const view = document.getElementById('detailView');
    const poster = (movie.Poster && movie.Poster !== 'N/A') ? movie.Poster : 'https://via.placeholder.com/300x450';
    
    document.getElementById('detailPoster').src = poster;
    document.getElementById('detailTitle').innerText = movie.Title;
    document.getElementById('detailYear').innerText = movie.Year;
    document.getElementById('detailType').innerText = movie.Type;
    
    view.classList.remove('hidden', 'pointer-events-none');
    setTimeout(() => view.classList.remove('opacity-0', 'scale-95'), 10);
    document.getElementById('mainNavbar').classList.add('opacity-0', '-translate-y-20');
    
    document.getElementById('reviewText').value = '';
    setRating(0);
    renderReviews();
}

function closeDetailViewForce() {
    const view = document.getElementById('detailView');
    view.classList.add('opacity-0', 'scale-95');
    document.getElementById('mainNavbar').classList.remove('opacity-0', '-translate-y-20');
    setTimeout(() => {
        view.classList.add('hidden', 'pointer-events-none');
        activeMovie = null;
    }, 300);
}

function closeDetailView(event) {
    if (event.target.id === 'detailView') closeDetailViewForce();
}

// --- Reviews Logic ---
function getReviews() {
    const stored = localStorage.getItem(DB_REVIEWS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function initStarRating() {
    const stars = document.querySelectorAll('#starInput i');
    stars.forEach(star => {
        star.addEventListener('click', () => setRating(parseInt(star.dataset.val)));
        star.addEventListener('mouseover', () => highlightStars(parseInt(star.dataset.val)));
        star.addEventListener('mouseleave', () => highlightStars(selectedRating));
    });
}

function setRating(val) {
    selectedRating = val;
    highlightStars(val);
}

function highlightStars(count) {
    const stars = document.querySelectorAll('#starInput i');
    stars.forEach(star => {
        const val = parseInt(star.dataset.val);
        if (val <= count) {
            star.classList.add('active');
            star.classList.replace('text-gray-600', 'text-cyber-cyan');
        } else {
            star.classList.remove('active');
            star.classList.replace('text-cyber-cyan', 'text-gray-600');
        }
    });
}

function submitReview() {
    if (!isVerified) {
        showToast("Verification Required: Verify OTP in Profile", "error");
        return; 
    }

    const text = document.getElementById('reviewText').value.trim();
    if (!selectedRating) return showToast("Error: Rating Required", "error");
    if (!text) return showToast("Error: Transmission Empty", "error");

    const reviews = getReviews();
    reviews.push({
        id: Date.now(),
        movie_id: activeMovie.imdbID,
        user: currentUser.name,
        avatar: currentUser.avatar,
        rating: selectedRating,
        content: text,
        likes: 0,
        dislikes: 0,
        date: new Date().toISOString()
    });
    localStorage.setItem(DB_REVIEWS_KEY, JSON.stringify(reviews));
    
    document.getElementById('reviewText').value = '';
    setRating(0);
    renderReviews();
    showToast("Review Transmitted");
}

function renderReviews() {
    if (!activeMovie) return;
    const sortMode = document.getElementById('sortSelect').value;
    let reviews = getReviews().filter(r => r.movie_id === activeMovie.imdbID);

    if (sortMode === 'newest') reviews.sort((a,b) => new Date(b.date) - new Date(a.date));
    if (sortMode === 'oldest') reviews.sort((a,b) => new Date(a.date) - new Date(b.date));
    if (sortMode === 'highest') reviews.sort((a,b) => b.rating - a.rating);
    if (sortMode === 'lowest') reviews.sort((a,b) => a.rating - b.rating);

    const container = document.getElementById('reviewsList');
    container.innerHTML = '';

    if (reviews.length === 0) {
        container.innerHTML = `<div class="text-center py-10 opacity-50"><p class="font-inter text-sm">NO DATA FOUND</p></div>`;
        return;
    }

    reviews.forEach(r => {
        const stars = Array(5).fill(0).map((_, i) => `<i class="fa-solid fa-star ${i < r.rating ? 'text-cyber-cyan' : 'text-gray-800'} text-[10px]"></i>`).join('');
        const date = new Date(r.date).toLocaleDateString();
        const el = document.createElement('div');
        el.className = 'bg-white/5 border border-white/5 rounded-xl p-4 fade-in-up';
        el.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-3">
                    <img src="${r.avatar || 'https://ui-avatars.com/api/?background=000&color=fff'}" class="w-8 h-8 rounded-full border border-white/10 object-cover">
                    <div><div class="font-bold text-sm text-gray-200 font-outfit">${r.user}</div><div class="flex gap-1 mt-0.5">${stars}</div></div>
                </div>
                <span class="text-[10px] font-mono text-gray-600">${date}</span>
            </div>
            <p class="text-gray-300 text-sm font-inter pl-11">${r.content}</p>
        `;
        container.appendChild(el);
    });
}