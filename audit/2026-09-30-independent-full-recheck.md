# Independent Full Re-check — 2026-09-30

## Why this pass exists

The earlier "done" conclusion was too strong. Passing the deterministic validator and checking extracted slide text did not by itself prove that every meaningful item on image-heavy lecture slides had been represented in the learner-facing course.

This pass therefore re-opened the supplied lecture decks, inspected the image-heavy slides directly, compared their teaching payloads against the current site, and then ran a broad source-concept sweep across the course code.

## Sources checked

- Course introduction — 7 slides
- Introduction to MSE and Atomic Structure — 31 slides
- Atomic and Ionic Arrangements Part 1 — 32 slides
- Atomic and Ionic Arrangements Part 2 — 25 slides
- Imperfections in Atomic and Ionic Arrangements Part 1 — 28 slides
- Imperfections in Atomic and Ionic Arrangements Part 2 — 22 slides
- Engineering Materials Assignment 1 — 3 pages

## Additional omissions found in this stricter pass

### Week 3
1. The source figure distinguishes **no regular order, SRO, and LRO**; the course previously emphasized SRO/LRO without explicitly preserving the no-order level and the source examples.
2. The source visually shows the **14 Bravais lattices grouped into seven crystal systems**; the course previously taught only the seven systems.
3. Table 3-1 includes **unit-cell volume formulas for all seven crystal systems**; these had been omitted.
4. The interplanar-spacing slide includes the **direction-cosine derivation** leading to the cubic d_hkl relation; the course previously gave the final formula but not the derivation.
5. The direction slides explicitly use a **right-handed coordinate system** and distinguish an individual direction from an **equivalent family ⟨uvw⟩**; these were repaired in the preceding re-check.
6. The diffraction slides explicitly note that XRD analysis is straightforward for a trained technician and that TEM is widely used in micro-/nanotechnology research; these source details are now retained.

### Week 4
7. The exterior-surface slide explicitly says the crystal ends abruptly, leaving **incompletely bonded surface atoms** and a potentially rough/reactive surface; this was repaired in the preceding re-check.

## Repairs made

- Added an Order Levels teaching section and assessment.
- Added a 14-Bravais-lattice teaching section and assessment.
- Added the seven-system unit-cell volume table and assessment.
- Added the interplanar-spacing derivation and assessment.
- Added right-handed coordinate-system and direction-family notation coverage.
- Added the external-surface bonding/reactivity explanation.
- Expanded the XRD/TEM wording to retain the remaining source statements.
- Added permanent Reference entries.
- Added deterministic source-coverage guards for the recovered concepts.

## Broad concept sweep

A direct sweep of the combined learner-facing course data and Problem Lab checked the principal source concepts and numerical anchors from the supplied decks and Assignment 1, including course logistics, atomic/bonding content, crystal systems and geometry, Miller rules, diffraction, point/line/surface defects, slip and strengthening, Schmid/CRSS/Hall-Petch content, and all Assignment 1 numerical presets.

The sweep returned no missing checked concept after the repairs above.

## Release criterion

The current Weeks 1–4 content should be called complete only if the deterministic validation and final GitHub Pages deployment on this repaired state pass. This document deliberately records the earlier overconfidence rather than treating prior PASS reports as proof.
