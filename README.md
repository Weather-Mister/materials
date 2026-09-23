# Engineering Materials Lab

A GitHub Pages study shell for Engineering Materials.

## Current scope

The site shell is intentionally content-free. It provides the teaching, drill, testing, reference, notes, progress, and cloud-sync infrastructure; course content will be added from authoritative source material later.

## Structure

- `public/` — static GitHub Pages app
- `supabase/migrations/` — isolated Materials profile backend
- `.github/workflows/pages.yml` — GitHub Pages deployment

Cloud progress uses a separate Engineering Materials namespace and revision-aware saves so it cannot overwrite other course sites.
