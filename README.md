# FrameFind

FrameFind is a visual discovery app where people can search a topic and explore a responsive wall of related images. Its warm paper background, deep teal and citrus accents, and quick-explore chips create a calm, editorial experience.

## Features

- Search Wikimedia Commons with a key-free public API.
- Responsive image cards with links to full-size images.
- Quick-explore topic chips and live result counts.
- Loading spinner and shimmer skeleton cards while a search runs.
- Friendly empty-result and network/API error messages.
- Reduced-motion support and accessible live status updates.

## Built with

Plain HTML, CSS, and JavaScript.

## Deployment

This repository includes a GitHub Pages Actions workflow in `.github/workflows/pages.yml`. After enabling **Settings → Pages → Build and deployment → Source: GitHub Actions** and merging the deployment workflow to `main`, GitHub Pages publishes the site at:

https://sreshta-ravuri.github.io/Files/

The deployment workflow runs on pushes to `main` and can also be started manually from the Actions tab.
