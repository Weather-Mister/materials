# Final learner-facing QA — 2026-09-30

## Purpose

This is the final pre-freeze QA pass for the currently supplied Engineering Materials content (Weeks 1–4 + Assignment 1).

This pass did **not** rely only on the earlier source-coverage audits. It reviewed the learner-facing implementation separately: teaching → guided practice → tests → homework-style practice → Problem Lab → reference/flashcard/matching data → responsive rendering guards.

## Scope checked

- 4 loaded modules
- 63 teaching sections
- 65 guided-drill MCQs
- 58 closed-feedback test MCQs
- 36 homework/exam-practice questions
- 82 reference entries
- Assignment 1 Problem Lab:
  - BCC/FCC a₀ ↔ r
  - theoretical density ρ ↔ a₀
  - FCC (100) planar density
  - FCC (111) planar packing fraction
  - Miller plane indexing
  - cubic interplanar spacing
- choice randomization and answer-index preservation
- hidden-until-submit test feedback
- reveal-on-demand exam-practice answers
- mobile Problem Lab layout
- wide source-table overflow behavior
- source-figure asset existence
- duplicate IDs and malformed MCQ payloads
- loaded-module ordering and source labels

## Independent answer/key checks

The full drill and test banks were reviewed against the teaching/source payloads. Particular attention was given to the calculation questions and the items most vulnerable to silent key drift.

Independent numeric checks included:

- Week 3: d₂₀₀ for a₀=0.400 nm → 0.200 nm
- Week 3: d₁₁₁ for a₀=0.360 nm → ≈0.208 nm
- Week 4 Schmid: 100 MPa, φ=60°, λ=45° → ≈35.4 MPa
- Week 4 Hall–Petch: σ₀=50 MPa, K=10 MPa·mm¹ᐟ², d=0.040 mm → 100 MPa
- Week 4 Schmid: 200 MPa, φ=45°, λ=60° → ≈70.7 MPa
- Week 4 Hall–Petch: σ₀=40 MPa, K=12 MPa·mm¹ᐟ², d=0.010 mm → 160 MPa
- Assignment inverse density for BCC K → a₀≈0.533494 nm, r≈0.231010 nm
- FCC Ni (100) planar density → ≈16.17184 atoms/nm² for a₀=0.35167 nm
- Al d₁₁₁/d₂₂₀ for a₀=0.4049 nm → ≈0.233769/0.143154 nm

No incorrect answer keys were found in this pass.

## Prerequisite / explanation-before-assessment check

Every non-calculation drill/test target was checked for a corresponding teaching or reference explanation in the same module. The only apparent string-level misses were:
- negative-choice items (e.g. “Lubricants” as the NOT-answer), and
- new numerical results produced from formulas that are explicitly taught before assessment.

No substantive hidden prerequisite or future-week dependency was found.

## Functional defect found and repaired

### FINAL-QA-01 — stale browser cache risk

The course files had been revised repeatedly while the script URLs in index.html still used old query-version strings. A returning browser could therefore reuse older cached curriculum JS even after the repository had been repaired.

Repair:
- course.js → v=9
- course-weeks-3-4.js → v=9
- source-overhaul.js → v=3

The validator now requires these final cache-bust versions.

## Regression guards added

The deterministic validator now also checks:

- shuffled answer buttons preserve original answer indices;
- test scoring compares the original answer index, not the displayed shuffled position;
- exam-practice answers remain hidden in <details> until opened;
- the six vulnerable numerical MCQ keys above;
- independent Schmid and Hall–Petch recalculations;
- mobile Problem Lab one-column collapse;
- horizontal overflow handling for wide 4/5-column source tables;
- final cache-bust script versions.

## Result

**PASS**

The final learner-facing QA found one functional delivery issue (stale cache-busting), repaired it, and found no remaining content-key, calculator, prerequisite, or assessment-engine defect in the checked scope.

The final deterministic validation and GitHub Pages deployment on commit `a9d6492` completed successfully.

### Freeze recommendation

Weeks 1–4 + Assignment 1 can now be frozen. Future edits to this scope should require either:
1. a newly discovered concrete defect, or
2. new/changed professor source material.

Do not reopen the content merely for another generic “check”; use the slide-by-slide traceability matrix and this learner-facing QA report to identify a specific failing claim.
