# Engineering Materials Lab

A source-backed GitHub Pages study environment for Engineering Materials.

## Current scope

Weeks 1–5 are implemented from the supplied lecture sources, with teaching sections, guided drills, flashcards, matching, tests, a searchable reference, and homework-style practice.

The dedicated **Exam Practice** mode contains all 79 original questions from Exercise sets 1–5, with every subpart, original question figures, source-page references, and individually revealable worked solutions. Filter by unit, exercise set, or wording. Each unit links directly to its questions. Attempts are saved locally on the current device; solutions and answer-key links remain hidden until opened.

Week 5 **Mechanical Properties** teaches all substantive topics in the 49-page supplied lecture through 20 detailed sections, original lecture figures, worked examples, 18 drills, 18 test questions, and 26 reference/flashcard entries. It covers elastic response, yield/UTS/ductility, energy, true quantities, bending, hardness, nanoindentation, impact/DBTT, fracture mechanics, fatigue, and creep. Source/key errors are explicitly distinguished from the corrected explanations.

The **Problem Lab** covers every Assignment 1 calculation family with visible derivations: cubic lattice geometry, theoretical density in both directions, FCC planar density and planar packing fraction, Miller plane indexing, and cubic interplanar spacing. Assignment values are available as presets.

Course figures are local assets. Source-grounded diagrams share one visual language, while verified professor-slide extracts remain local WebPs inside the same figure frame.

## Structure

- `public/` — static GitHub Pages app and teaching assets
- `public/sources/` — six supplied source PDFs, retained unchanged
- `public/exercise-bank.js` — original exercises and worked solutions
- `public/course-mechanical.js` — mechanical-property teaching and assessments
- `scripts/validate-course.mjs` — deterministic curriculum/UI/homework-readiness checks
- `audit/` — source-fidelity and release audits
- `supabase/migrations/` — isolated Materials profile backend
- `.github/workflows/pages.yml` — validation and GitHub Pages deployment

Cloud progress uses a separate Engineering Materials namespace and revision-aware saves so it cannot overwrite other course sites.
