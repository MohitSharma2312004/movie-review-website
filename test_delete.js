async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/admin/content");
    const data = await res.json();
    const blogs = data.filter(d => d.type === "Blog");
    if(blogs.length === 0) { console.log("No blogs found"); return; }
    
    // Test the first one
    const blogId = blogs[0].id;
    console.log("Attempting to delete blog ID:", blogId);
    
    const delRes = await fetch("http://localhost:3000/api/admin/delete/Blog/" + blogId, { method: "DELETE" });
    console.log("Status:", delRes.status);
    const text = await delRes.text();
    console.log("Response:", text);
  } catch(e) {
    console.error(e);
  }
}
test();
