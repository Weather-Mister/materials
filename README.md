# Engineering Materials Lab

A source-backed GitHub Pages study environment for Engineering Materials.

## Current scope

Weeks 1–4 are implemented from the supplied lecture sources, with teaching sections, guided drills, flashcards, matching, tests, a searchable reference, and homework-style practice.

The **Problem Lab** covers every Assignment 1 calculation family with visible derivations: cubic lattice geometry, theoretical density in both directions, FCC planar density and planar packing fraction, Miller plane indexing, and cubic interplanar spacing. Assignment values are available as presets.

Course figures are local assets. Source-grounded diagrams share one visual language, while verified professor-slide extracts remain local WebPs inside the same figure frame.

## Structure

- `public/` — static GitHub Pages app and teaching assets
- `scripts/validate-course.mjs` — deterministic curriculum/UI/homework-readiness checks
- `audit/` — source-fidelity and release audits
- `supabase/migrations/` — isolated Materials profile backend
- `.github/workflows/pages.yml` — validation and GitHub Pages deployment

Cloud progress uses a separate Engineering Materials namespace and revision-aware saves so it cannot overwrite other course sites.
