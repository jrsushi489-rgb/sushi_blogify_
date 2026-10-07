const id = new URLSearchParams(location.search).get("id");

if (!id) {
  location.assign("index.html");
}

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const postDetailsContainer = document.getElementById("post-details");
const commentsListContainer = document.getElementById("comments-list");
const backBtn = document.getElementById("back-btn");

backBtn.addEventListener("click", () => {
  history.back();
});

async function getData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function loadPostPage() {
  loadingEl.style.display = "block";
  errorEl.style.display = "none";

  const post = await getData(`https://dummyjson.com/posts/${id}`);

  if (!post) {
    loadingEl.style.display = "none";
    errorEl.style.display = "block";
    return;
  }

  const user = await getData(`https://dummyjson.com/users/${post.userId}`);
  const commentsData = await getData(`https://dummyjson.com/posts/${id}/comments`);

  loadingEl.style.display = "none";

  const title = document.createElement("h1");
  title.textContent = post.title;

  const author = document.createElement("p");
  author.className = "author-name";
  if (user) {
    author.textContent = `Author: ${user.firstName} ${user.lastName}`;
  }

  const body = document.createElement("p");
  body.textContent = post.body;

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

  const likesCount = typeof post.reactions === "object" ? post.reactions.likes : post.reactions;
  const stats = document.createElement("p");
  stats.textContent = `Likes: ${likesCount || 0} | Views: ${post.views || 0}`;

  postDetailsContainer.appendChild(title);
  postDetailsContainer.appendChild(author);
  postDetailsContainer.appendChild(body);
  postDetailsContainer.appendChild(tagsContainer);
  postDetailsContainer.appendChild(stats);

  commentsListContainer.textContent = "";
  const comments = commentsData ? commentsData.comments : [];

  if (comments.length === 0) {
    const noComments = document.createElement("p");
    noComments.textContent = "No comments yet.";
    commentsListContainer.appendChild(noComments);
  } else {
    comments.forEach(comment => {
      const commentDiv = document.createElement("div");
      commentDiv.className = "comment";

      const commentUser = document.createElement("strong");
      commentUser.textContent = comment.user.username;

      const commentBody = document.createElement("p");
      commentBody.textContent = comment.body;

      commentDiv.appendChild(commentUser);
      commentDiv.appendChild(commentBody);
      commentsListContainer.appendChild(commentDiv);
    });
  }
}

loadPostPage();