let currentSkip = 0;
const limit = 10;

async function getData(url, params = {}) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function getBookmarks() {
  const saved = localStorage.getItem("blogify_bookmarks");
  return saved ? JSON.parse(saved) : [];
}

function saveBookmarks(bookmarks) {
  localStorage.setItem("blogify_bookmarks", JSON.stringify(bookmarks));
}

function isBookmarked(postId) {
  const bookmarks = getBookmarks();
  return bookmarks.some(item => item.id === postId);
}

function toggleBookmark(post, buttonElement) {
  let bookmarks = getBookmarks();
  
  if (isBookmarked(post.id)) {
    bookmarks = bookmarks.filter(item => item.id !== post.id);
    buttonElement.textContent = "Bookmark";
  } else {
    bookmarks.push(post);
    buttonElement.textContent = "Saved";
  }
  
  saveBookmarks(bookmarks);
}

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const postsContainer = document.getElementById("posts-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

async function fetchAndRenderPosts() {
  loadingEl.style.display = "block";
  errorEl.style.display = "none";
  postsContainer.textContent = "";

  const data = await getData("https://dummyjson.com/posts", { limit: limit, skip: currentSkip });

  if (!data || !data.posts) {
    loadingEl.style.display = "none";
    errorEl.style.display = "block";
    return;
  }

  loadingEl.style.display = "none";

  data.posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";

    const title = document.createElement("h2");
    title.textContent = post.title;

    const body = document.createElement("p");
    const truncatedText = post.body.length > 100 ? post.body.substring(0, 100) + "..." : post.body;
    body.textContent = truncatedText;

    const tagsContainer = document.createElement("div");
    tagsContainer.className = "tags";
    if (Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        const tagSpan = document.createElement("span");
        tagSpan.className = "tag";
        tagSpan.textContent = `#${tag}`;
        tagsContainer.appendChild(tagSpan);
      });
    }

    const likes = document.createElement("p");
    likes.className = "likes";
    const likesCount = typeof post.reactions === "object" ? post.reactions.likes : post.reactions;
    likes.textContent = `❤️ ${likesCount || 0} Likes`;

    const detailsLink = document.createElement("a");
    detailsLink.href = `post.html?id=${post.id}`;
    detailsLink.textContent = "Read More";
    detailsLink.className = "btn-details";

    const bookmarkButton = document.createElement("button");
    bookmarkButton.className = "bookmark-btn";
    bookmarkButton.textContent = isBookmarked(post.id) ? "Saved" : "Bookmark";
    bookmarkButton.addEventListener("click", () => toggleBookmark(post, bookmarkButton));

    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(tagsContainer);
    card.appendChild(likes);
    card.appendChild(detailsLink);
    card.appendChild(bookmarkButton);

    postsContainer.appendChild(card);
  });

  updatePagination(data.total);
}

function updatePagination(totalPosts) {
  const currentPage = Math.floor(currentSkip / limit) + 1;
  pageInfo.textContent = `Page ${currentPage}`;

  prevBtn.disabled = currentSkip === 0;
  nextBtn.disabled = currentSkip + limit >= totalPosts;
}

prevBtn.addEventListener("click", () => {
  if (currentSkip >= limit) {
    currentSkip -= limit;
    fetchAndRenderPosts();
  }
});

nextBtn.addEventListener("click", () => {
  currentSkip += limit;
  fetchAndRenderPosts();
});

fetchAndRenderPosts();