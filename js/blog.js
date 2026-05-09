// FETCH BLOGS
async function renderBlogFeed() {
  const container = document.getElementById("blogFeed");
  container.innerHTML = '<div class="loader-ring mx-auto my-10"></div>';

  try {
    const res = await fetch("http://localhost:3000/api/blogs");
    const blogs = await res.json();

    container.innerHTML = "";
    if (!blogs || blogs.length === 0) {
      container.innerHTML = `<div class="text-center text-gray-500 font-tech">NO SIGNAL DETECTED</div>`;
      return;
    }

    blogs.forEach((post) => {
      let mediaHtml = "";
      if (post.media_url) {
        if (post.media_url.startsWith("data:video")) {
          mediaHtml = `<video src="${post.media_url}" controls class="w-full rounded-lg mt-3 border border-white/10"></video>`;
        } else {
          mediaHtml = `<img src="${post.media_url}" class="w-full rounded-lg mt-3 border border-white/10 object-cover max-h-96">`;
        }
      }
      const date = new Date(post.created_at).toLocaleDateString();

      const el = document.createElement("div");
      el.className = "glass-panel p-6 rounded-xl border border-white/5 fade-in-up";
      el.innerHTML = `
                <div class="flex items-center gap-3 mb-4">
                     <div class="w-10 h-10 rounded-full bg-cyber-purple flex items-center justify-center font-bold text-white border border-white/10">${post.user_name.charAt(0)}</div>
                    <div><div class="font-outfit text-sm text-cyber-cyan">${post.user_name}</div><div class="font-mono text-[10px] text-gray-500">${date}</div></div>
                </div>
                <h3 class="font-outfit text-lg text-white mb-2">${post.title}</h3>
                <p class="font-inter text-gray-300 whitespace-pre-wrap">${post.content}</p>
                ${mediaHtml}
            `;
      container.appendChild(el);
    });
  } catch (e) {
    console.error("Blog fetch error:", e);
    container.innerHTML = `<div class="text-red-500 text-center">OFFLINE</div>`;
  }
}

// UPLOAD BLOG
async function submitBlogPost() {
  if (!isVerified) {
    showToast("Verification Required: Verify OTP in Profile", "error");
    switchMainTab('profile');
    return;
  }

  const title = document.getElementById("blogTitleInput").value.trim();
  const content = document.getElementById("blogContentInput").value.trim();
  const mediaInput = document.getElementById("blogMediaInput");

  if (!title || !content) return showToast("Title & Content Required");

  let mediaData = null;
  if (mediaInput.files && mediaInput.files[0]) {
    try {
      mediaData = await readFile(mediaInput.files[0]);
    } catch (e) {
      return showToast("Error reading file");
    }
  }

  const payload = {
    user_name: currentUser.name,
    title: title,
    content: content,
    media: mediaData,
  };

  try {
    const res = await fetch("http://localhost:3000/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      document.getElementById("blogTitleInput").value = "";
      document.getElementById("blogContentInput").value = "";
      mediaInput.value = "";
      renderBlogFeed();
      showToast("Transmission Uploaded");
    }
  } catch (e) {
    showToast("Upload Failed");
  }
}

document.addEventListener("DOMContentLoaded", renderBlogFeed);
