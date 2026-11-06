const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const emptyCopy = emptyState.querySelector(".empty-copy");
const searchStatus = document.getElementById("search-status");
const searchButton = document.getElementById("search-button");

async function searchImages(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json&origin=*";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Image search failed with status " + response.status);
  }

  const data = await response.json();
  const items = data.query ? Object.values(data.query.pages) : [];
  renderResults(items, query);
}

function showEmptyState(message) {
  emptyState.hidden = false;
  emptyCopy.textContent = message;
}

function showLoadingState(query) {
  results.innerHTML = "";
  resultCount.textContent = "SEARCHING…";
  emptyState.hidden = true;
  searchStatus.className = "search-status is-loading";
  searchStatus.textContent = "Searching for “" + query + "”…";
  results.innerHTML = Array.from({ length: 6 }, () => {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton-card";
    skeleton.setAttribute("aria-hidden", "true");
    return skeleton;
  }).map((node) => node.outerHTML).join("");
  searchButton.disabled = true;
}

function clearLoadingState() {
  searchStatus.className = "search-status";
  searchButton.disabled = false;
}

function renderResults(items, query) {
  results.innerHTML = "";

  const imageItems = items.filter((item) => item.imageinfo && item.imageinfo[0]);
  resultCount.textContent =
    "YOUR COLLECTION · " + imageItems.length + " FRAMES";

  if (imageItems.length === 0) {
    showEmptyState("No images found for “" + query + "”. Try another search.");
    searchStatus.textContent = "No results for “" + query + "”.";
    return;
  }

  emptyState.hidden = true;
  searchStatus.textContent =
    "Showing " + imageItems.length + " results for “" + query + "”.";

  imageItems.forEach((item) => {
    const imageInfo = item.imageinfo[0];
    const imageUrl = imageInfo.thumburl || imageInfo.url;
    if (!imageUrl) return;

    const card = document.createElement("article");
    card.className = "image-card";

    const link = document.createElement("a");
    link.className = "image-card-link";
    link.href = imageInfo.url || imageUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Open full image: " + item.title);

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = item.title.replace(/^File:/, "").replace(/_/g, " ");
    image.loading = "lazy";

    const caption = document.createElement("p");
    caption.className = "image-caption";
    caption.textContent = item.title.replace(/^File:/, "").replace(/_/g, " ");

    link.appendChild(image);
    link.appendChild(caption);
    card.appendChild(link);
    results.appendChild(card);
  });

  if (results.children.length === 0) {
    showEmptyState("No displayable images were returned. Try another search.");
    searchStatus.textContent = "No displayable images found.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  showLoadingState(query);
  try {
    await searchImages(query);
  } catch (error) {
    console.error(error);
    results.innerHTML = "";
    resultCount.textContent = "SEARCH UNAVAILABLE";
    showEmptyState("Something went wrong while loading images. Please check your connection and try again.");
    searchStatus.textContent = "Search failed. Please try again.";
  } finally {
    clearLoadingState();
  }
});

// Quick-explore chips run the same search as the form.
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.textContent.trim();
    form.requestSubmit();
  });
});
