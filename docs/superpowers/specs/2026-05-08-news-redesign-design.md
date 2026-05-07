# News Page Redesign — Design Spec

**Date:** 2026-05-08  
**Status:** Approved

---

## Overview

Redesign the `/news` listing page from a plain card grid into a magazine-style editorial layout. The detail page (`/news/[slug]`) is out of scope — only the listing is changing.

---

## Layout

### Page Header
- Title: "Latest **News**" — "News" in purple `#6F3DFF`
- Subtitle: "Drum & Bass · Neurofunk · Electronic Music" in muted gray

### Filter Pills
A horizontal row of pill buttons above the content:
- **All** (default active, purple background)
- **Releases**
- **Interviews**
- **Mixes**
- **Events**

Active pill: `bg-[#6F3DFF] text-white`. Inactive: `bg-[#111] text-gray-600 border border-[#222]`. Filtering is client-side — no new API calls needed (categories field already exists on NewsItem).

### Featured Row (top section)
Two-column grid (`1.7fr 1fr`), gap `16px`:

**Left — Hero card** (first/latest article):
- Full cover image with `object-cover`, aspect ratio fills the card (~340px tall)
- Gradient overlay `from-black to-transparent` from bottom
- Overlaid on image: `FEATURED` badge (purple solid), title (white, bold, large), date + "Read more →" link

**Right — Side cards** (2nd and 3rd articles stacked, equal height):
- Cover image thumbnail (100px tall)
- Category badge, title, date
- Subtle hover: `border-[#6F3DFF44]`, `translateY(-2px)`

### Section Divider
`"More News"` label + horizontal line separator between featured row and grid.

### News Grid
3-column grid, all remaining articles:
- Cover image (160px tall)
- Category badge
- Title (bold, 14px)
- Date

Cards have `bg-[#0d0d1a]`, `border border-white/[0.04]`, hover glow `shadow-[0_0_20px_rgba(111,61,255,0.08)]`.

### Load More
Centered button below grid — same as existing "Load More" logic (fetch `/api/news?page=N`).

---

## Category Badges

Each category maps to a distinct color so users can scan at a glance:

| Category   | Background        | Text       |
|------------|-------------------|------------|
| Featured   | `#6F3DFF` solid   | white      |
| Releases   | `#74F2CE` at 13%  | `#74F2CE`  |
| Interviews | `#c084fc` at 13%  | `#c084fc`  |
| Mixes      | `#f59e0b` at 13%  | `#f59e0b`  |
| Events     | `#ef4444` at 13%  | `#ef4444`  |
| Default    | `#6F3DFF` at 13%  | `#a78bfa`  |

Badge maps first matching `categories[]` value.

---

## Data

The existing `NewsItem` type already includes `categories: string[]` and `coverImageUrl`. No schema or API changes needed.

**Hero selection:** The first article returned (latest `publishedAt`) is automatically the featured/hero card. No manual pinning.

**Filter logic:** Client-side. When a pill is active (not "All"), filter `items` array by `post.categories.includes(selectedCategory)`. No API refetch.

---

## Components

Changes are isolated to `app/news/NewsListAnimated.tsx`. The server component (`page.tsx`) and client wrapper (`NewsListClient.tsx`) are unchanged.

`NewsListAnimated.tsx` is rewritten to implement:
1. `FilterPills` — inline sub-component for the pill row
2. `HeroCard` — featured article
3. `SideCard` — stacked secondary articles
4. `NewsCard` — standard grid card
5. Load more (existing logic preserved)

---

## Cover Images

Cards always show `coverImageUrl` if present. If `coverImageUrl` is null/empty, show a placeholder gradient (`bg-gradient-to-br from-[#1a0a2e] to-[#050410]`) — no broken image states.

---

## Animations

Preserve existing Framer Motion entrance animations (`opacity 0→1`, `y 20→0`) with `useReducedMotion` guard. Hero card gets a slightly larger entrance (`y: -10` instead of `y: 20`).

---

## Out of Scope

- `/news/[slug]` detail page — no changes
- Admin news management — no changes
- New API endpoints — none needed
- Pagination style change (Load More stays, no numeric pagination)
