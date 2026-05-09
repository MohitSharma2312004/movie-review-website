let adminToken = null;

// 1. LOGIN
async function adminLogin() {
  const password = document.getElementById("adminPasswordInput").value;
  try {
    const res = await fetch("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();

    if (data.success) {
      adminToken = data.token;
      document.getElementById("adminLoginOverlay").classList.add("hidden");
      document.getElementById("adminPanelContent").classList.remove("hidden");
      refreshAdminData();
    } else {
      showToast("Access Denied: Wrong Password", "error");
    }
  } catch (e) {
    showToast("Server Error", "error");
  }
}

// 2. FETCH DATA & FILTERS
async function refreshAdminData() {
  if (!adminToken) return;

  const filter = document.getElementById("statsFilter").value;
  let query = `?filter=${filter}`;

  if (filter === "date") {
    const dateVal = document.getElementById("statsDateInput").value;
    if (!dateVal) return;
    query += `&date=${dateVal}`;
  }

  try {
    // Stats
    const statsRes = await fetch(
      `http://localhost:3000/api/admin/stats${query}`,
    );
    const stats = await statsRes.json();
    document.getElementById("adminReviewCount").innerText = stats.reviews;
    document.getElementById("adminBlogCount").innerText = stats.blogs;

    // Table Data
    const contentRes = await fetch("http://localhost:3000/api/admin/content");
    const content = await contentRes.json();
    renderAdminTable(content);
  } catch (e) {
    console.error(e);
  }
}

function renderAdminTable(data) {
  const tbody = document.getElementById("adminTableBody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center p-4 text-gray-500">No records found.</td></tr>';
    return;
  }

  data.forEach((item) => {
    const typeClass =
      item.type === "Review" ? "text-cyber-cyan" : "text-purple-400";
    const tr = document.createElement("tr");
    tr.className = "border-b border-white/5 hover:bg-white/5 transition-colors";
    tr.innerHTML = `
            <td class="p-3 text-gray-500">#${item.id}</td>
            <td class="p-3 font-bold ${typeClass}">${item.type}</td>
            <td class="p-3">${item.user_name}</td>
            <td class="p-3 truncate max-w-[200px] text-xs text-gray-400">${item.content}</td>
            <td class="p-3">
                <button onclick="deleteContent('${item.type}', '${item.id}')" class="text-red-500 hover:text-red-400 text-xs border border-red-500/50 px-2 py-1 rounded hover:bg-red-500/10 mb-1 inline-block">DELETE</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// 3. DELETE
async function deleteContent(type, id) {
  // Use a softer confirmation to avoid browser popup blockers
  if (!window.confirm(`Permanently delete this ${type}?`)) return;
  
  try {
    const res = await fetch(`http://localhost:3000/api/admin/delete/${type}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      }
    });
    
    if (!res.ok) throw new Error("Delete request failed");
    showToast(`${type} Deleted`);
    
    if (type === "Review") {
        let reviews = JSON.parse(localStorage.getItem(DB_REVIEWS_KEY)) || [];
        reviews = reviews.filter(r => String(r.id) !== String(id));
        localStorage.setItem(DB_REVIEWS_KEY, JSON.stringify(reviews));
        if (typeof renderReviews === "function") renderReviews();
    }
    
    refreshAdminData();
    if (type === "Blog" && typeof renderBlogFeed === "function") {
        renderBlogFeed(); // Keep the public feed in sync with backend deletions
    }
  } catch (e) {
    console.error("Delete Error:", e);
    showToast("Delete Failed", "error");
  }
}

function handleFilterChange() {
  const filter = document.getElementById("statsFilter").value;
  const dateInput = document.getElementById("statsDateInput");
  if (filter === "date") {
    dateInput.classList.remove("hidden");
  } else {
    dateInput.classList.add("hidden");
    refreshAdminData();
  }
}
