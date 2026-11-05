const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const searchStatus = document.getElementById("search-status");

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

function renderResults(items, query) {
  results.innerHTML = "";

  const imageItems = items.filter((item) => item.imageinfo && item.imageinfo[0]);
  resultCount.textContent =
    "YOUR COLLECTION · " + imageItems.length + " FRAMES";
  searchStatus.textContent =
    "Showing " + imageItems.length + " results for “" + query + "”.";

  emptyState.hidden = imageItems.length > 0;

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
    emptyState.hidden = false;
    searchStatus.textContent = "No images found for “" + query + "”. Try another topic.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  searchStatus.textContent = "Searching Wikimedia Commons…";
  try {
    await searchImages(query);
  } catch (error) {
    console.error(error);
    searchStatus.textContent = "The search could not be completed. Please try again.";
  }
});

// Quick-explore chips run the same search as the form.
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.textContent.trim();
    form.requestSubmit();
  });
});
