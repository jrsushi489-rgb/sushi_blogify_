const bookmarksContainer = document.getElementById("bookmarks-container");
const clearAllBtn = document.getElementById("clear-all-btn");

function getBookmarks() {
  const saved = localStorage.getItem("blogify_bookmarks");
  return saved ? JSON.parse(saved) : [];
}

function saveBookmarks(bookmarks) {
  localStorage.setItem("blogify_bookmarks", JSON.stringify(bookmarks));
}

function renderBookmarks() {
  bookmarksContainer.textContent = "";
  const bookmarks = getBookmarks();

  if (bookmarks.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No saved posts yet.";
    bookmarksContainer.appendChild(emptyMsg);
    clearAllBtn.style.display = "none";
    return;
  }

  clearAllBtn.style.display = "inline-block";

  bookmarks.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";

    const title = document.createElement("h2");
    title.textContent = post.title;

    const body = document.createElement("p");
    const truncatedText = post.body.length > 100 ? post.body.substring(0, 100) + "..." : post.body;
    body.textContent = truncatedText;

    const detailsLink = document.createElement("a");
    detailsLink.href = `post.html?id=${post.id}`;
    detailsLink.textContent = "Read More";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      const confirmRemove = confirm("Are you sure you want to remove this post?");
      if (confirmRemove) {
        const updatedBookmarks = getBookmarks().filter(item => item.id !== post.id);
        saveBookmarks(updatedBookmarks);
        renderBookmarks();
      }
    });

    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(detailsLink);
    card.appendChild(removeBtn);

    bookmarksContainer.appendChild(card);
  });
}

clearAllBtn.addEventListener("click", () => {
  const confirmClear = confirm("Are you sure you want to delete all bookmarks?");
  if (confirmClear) {
    saveBookmarks([]);
    renderBookmarks();
  }
});

renderBookmarks();