# FrameFind

FrameFind is a visual discovery app where people can search a topic and explore a responsive wall of related images. Its warm paper background, deep teal and citrus accents, and quick-explore chips create a calm, editorial experience.

## Part 2 — Fetch & Render

- Submitting the search form (with click or Enter) prevents the default page reload and reads the trimmed search query.
- Searches Wikimedia Commons using its public, key-free API. The query is encoded with `encodeURIComponent`, the response status is checked, and the JSON payload is parsed.
- Results are rendered as responsive image cards using `document.createElement` and `appendChild`; previous results are cleared before each render.
- Blank searches are ignored. The result count and live status are updated after a search.
- Quick-explore chips trigger searches, and each card links to its full-size Wikimedia image in a new tab.

Built with plain HTML, CSS, and JavaScript.
