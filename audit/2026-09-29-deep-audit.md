# Engineering Materials Lab — Deep Audit

Date: 2026-09-29

## Scope

Audit covered the six supplied course PDFs and the deployed site implementation:

- Course introduction — 7 slides
- Introduction to MSE and Atomic Structure — 31 slides
- Atomic and Ionic Arrangements Part 1 — 32 slides
- Atomic and Ionic Arrangements Part 2 — 25 slides
- Imperfections in Atomic and Ionic Arrangements Part 1 — 28 slides
- Imperfections in Atomic and Ionic Arrangements Part 2 — 22 slides

Total source deck inspected: 145 slides.

The audit also covered the course data model, study interactions, assessments, responsive layout, cloud-state merge behavior, GitHub Pages deployment pipeline, and the live Supabase schema used by the Materials profile sync.

## Current audited course state

| Module | Teaching sections | Guided drills | Test questions | Reference items |
| --- | ---: | ---: | ---: | ---: |
| M01 Introduction to MSE | 7 | 6 | 5 | 7 |
| M02 Atomic Structure | 11 | 10 | 10 | 11 |
| M03 Atomic and Ionic Arrangements | 16 | 17 | 14 | 23 |
| M04 Imperfections | 18 | 23 | 21 | 29 |
| **Total** | **52** | **56** | **50** | **69** |

## Source-fidelity findings and repairs

### Course introduction

- Restored instructor email, room, office-hours location, TA names/emails, midterm and final dates.
- Preserved the grading slide exactly as printed: 45% Midterm + 45% Final + 10% Homework + 3% Course interaction = 103%. The site now explicitly identifies this as a source-side total instead of silently normalizing it.
- Added both source-listed textbooks to the course reference card.
- Reserved module titles/subtitles now retain the syllabus information, including HW #1, HW #2, Midterm I, and Final Exam timing.

### M01 — Introduction to MSE

- Replaced text-only placeholders for the source strength-range and temperature-strength figures with source-grounded teaching schematics.
- Kept the chart interpretation at the correct level: material classes occupy broad ranges and service temperature changes suitability.
- Confirmed coverage of composition, structure, synthesis, processing, amorphous/crystalline distinction, five material classes, and the course-property preview.

### M02 — Atomic Structure

- Rechecked Pauli, Aufbau, valence, four bond types, primary vs secondary bonding, binding energy, modulus/CTE connection, and carbon allotropes.
- Tightened the Aufbau explanation to avoid implying strict shell-number filling.
- Added a source-grounded graphite-layer visual so the layered bonding/electrical-conduction discussion is no longer text-only.
- Confirmed diamond numerical properties and graphite layer-spacing/property statements against the lecture source.

### M03 — Atomic and Ionic Arrangements

Restored or strengthened material that had been compressed too aggressively in the first pass:

- Seven crystal systems and their axial-length/interaxial-angle rules.
- Unit-cell sharing/counting logic.
- Source Examples 3-1/3-2: lattice-point counting and the CsCl “simple-cubic lattice + basis, not BCC lattice” distinction.
- Source Examples 3-3/3-4: radius–lattice derivations and FCC APF derivation.
- Theoretical-density worked example for BCC Fe.
- Miller-direction and Miller-plane procedures.
- Source Examples 3-8 to 3-10: plane indexing, planar density/packing, and drawing indexed geometry.
- Explicit (010) versus (020) planar-density distinction.
- Repeat distance, linear density, close-packed directions/planes, and stacking.
- Anisotropy/isotropy.
- Cubic interplanar-distance relation.
- Cubic/tetrahedral/octahedral interstitial sites plus the source radius-ratio table.
- XRD, Bragg relation, TEM advantages/disadvantages.
- HCP convention discrepancy is intentionally preserved and explained: the source table uses a 2-atom primitive-cell convention while the later conventional hexagonal-cell slide counts 6 atoms.

### M04 — Imperfections

Restored or strengthened source content that was missing or underrepresented:

- Vacancy, interstitial, substitutional, impurity/dopant concepts.
- Ionic charge/mass/site-balance rules.
- Frenkel and Schottky defects from the source point-defect figure, with a dedicated teaching schematic.
- Explicit source statement that dislocations occur in all materials, while their mechanical treatment is especially useful for metals.
- Screw, edge, and mixed dislocations plus Burgers-vector orientation.
- Normal versus shear stress, slip plane, slip direction, plastic deformation, and the source caveat that slip is not the only permanent-deformation mechanism.
- Dense-plane slip, restricted-slip fallback to less-dense planes, and dislocation pile-up/work-hardening mechanism.
- Peierls–Nabarro stress.
- Source Table 4-1 characteristic slip systems.
- BCC (110) vs (112) worked slip-plane comparison.
- Schmid's law, CRSS, and the aluminum orientation example.
- Source Table 4-2 quantitative CRSS/slip-system/cross-slip comparison, with the source's “nearly perfect crystals” limitation retained.
- Hall–Petch mechanism and worked grain-size example.
- ASTM grain-size example, low-angle boundaries, stacking faults, twins, and domains.
- Source Table 4-3 surface-imperfection energies.
- Strain hardening, annealing, solid-solution strengthening, and grain-size strengthening.
- Restored the source statement that slip helps explain why measured metallic strength can be roughly 10^3–10^4 below ideal bond-based strength.
- Restored the note that dislocations can also influence electronic and optical properties.

## Pedagogy and assessment audit

Repairs made:

- Removed the learner-visible correct-answer-position bias. Choices are now randomized once per study session while answer semantics remain stable.
- Added active-module tests in addition to mixed-course tests.
- Added an unanswered-question confirmation before submission.
- Test review now shows the learner's answer, the correct answer, and the explanation.
- Stored test history is now visible instead of only being silently retained.
- Matching no longer uses only the first six reference items forever; new sets rotate through the full module reference bank.
- Added quantitative Miller/interplanar-spacing, Schmid-law, and Hall–Petch problems so Weeks 3–4 are not purely recognition-based.
- Flashcards continue to traverse the entire active-module reference bank.

Remaining pedagogical limitation:

- The current assessment engine is still MCQ-only. Typed numerical answers, worked free-response problems, and diagram-indexing input would be a future expansion rather than a correctness defect.

## UI / responsive / accessibility audit

Repairs made:

- Fixed multi-column source tables that were previously being forced through a two-column CSS grid.
- Added responsive horizontal behavior for four- and five-column source tables.
- Harmonized Flashcards and Matching with the active light-blue Materials theme.
- Updated mobile/browser theme metadata from the obsolete dark theme.
- Added dialog semantics and accessible labels to the cloud modal and navigation close controls.
- Added aria state to study-mode buttons and Lab Log expansion.
- Preserved source syllabus subtitles on reserved course weeks.
- Added a source-backed course information card to Reference.

## State and backend audit

### Fixed

- Corrected the cloud merge ordering for module completion state: the newer snapshot now wins instead of local state always overriding remote state.
- Drill attempts already merge by per-answer timestamp; notes merge by per-note timestamp; test history is unioned by run id.

### Open privacy limitation

The current Materials cloud profile uses a **username as a shared profile key**, not authentication. Anyone who knows a Materials username can call the public profile RPCs for that username and access/modify that profile. This is intentional compatibility with the simple course-sync model, but it is not private-account security.

Mitigation applied now:

- The UI explicitly labels this as shared-key sync and warns users not to store sensitive notes in it.

Full hardening would require an authentication/PIN/token migration and is deliberately not being slipped into this audit because it would change cross-device profile behavior and could strand existing progress.

## Build and release QA

Deployment is now gated by deterministic checks before GitHub Pages can publish:

- Node syntax checks for course.js, course-weeks-3-4.js, and app.js.
- Course object loads successfully.
- Exactly Weeks 1–4 are loaded.
- Duplicate module/reference/question IDs are rejected.
- Every loaded module must have teaching sections, drills, tests, and source labels.
- MCQs must have exactly four unique choices, valid keys, explanations, and drill hints.
- Required source-coverage concepts are asserted per module.
- Referenced teaching assets must exist.
- Multi-column source tables must declare their responsive column count.
- Course logistics, exam dates, textbooks, and the printed 103% grading note are guarded against drift.
- Static HTML duplicate IDs, dialog semantics, and cloud-privacy warning are checked.
- Redundant public .b64 fragments are rejected.
- All teaching SVGs are parsed as XML.
- The four professor-slide WebP assets are rebuilt from verified source fragments and checked by exact size, WebP header, and SHA-256 before deployment.

## Result

No source-blocking or deterministic code defects remain in the audited Weeks 1–4 implementation. The principal open item is the explicitly documented shared-key cloud privacy model; the main pedagogical expansion still available is non-MCQ assessment.
