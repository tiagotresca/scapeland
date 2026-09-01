# Scapeland — institutional site

> Luxury is outside.

One-page institutional site for **Scapeland**, a premium architecture and
real-estate brand selling serious houses far from the city, built on the
proprietary **Solid** construction system.

## Stack

Static site — no build step, no framework.

- `index.html` — full page (curated brand copy, EN)
- `assets/css/style.css` — design system
- `assets/js/main.js` — scroll reveals, sticky motion section, video handling
- `assets/img/`, `assets/media/` — brand imagery and motion video (committed
  by the *Fetch and optimize brand assets* GitHub Action)

## Design system

Per the Scapeland Visual Identity Brief (bootstrap kit):

| Role | Value |
| --- | --- |
| Ink | `#141412` |
| Paper | `#F5F2EC` |
| Accent (earth) | `#A8624D` terracotta |
| Display | Space Grotesk (Google Fonts) |
| Body | Inter |
| Editorial | Source Serif 4 italic |

Wordmark is type-only (all caps, wide tracking) — no symbol, per the brief.
Planned upgrade path: GT America Extended / Standard + GT Sectra.

## Assets

Media sources (Google Drive folder + generated editorial photography) are
listed in `scripts/asset-manifest.sh`. To (re)fetch and optimize them into the
repo, run the **Fetch and optimize brand assets** workflow (Actions →
workflow_dispatch). It downloads, resizes/compresses and commits the results.

## Local preview

```sh
python3 -m http.server
# open http://localhost:8000
```
