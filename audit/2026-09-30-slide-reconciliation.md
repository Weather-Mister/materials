# Lecture-Slide Reconciliation — 2026-09-30

## Scope

Final source-fidelity pass against the supplied Engineering Materials lecture decks for Weeks 1–4:

- Course introduction
- Introduction to MSE and Atomic Structure
- Atomic and Ionic Arrangements, Parts 1–2
- Imperfections in Atomic and Ionic Arrangements, Parts 1–2
- Engineering Materials Assignment 1

The professor slides remain the governing source for taught content. The two textbooks remain supporting sources for explanations, figures, and additional practice within already-taught topics.

## Revisions

Two lecture points that were present in the source decks but only partially represented in the site were completed:

1. **Hexagonal indexing**
   - Week 3 now explicitly states that HCP cells may use either a 3-axis or 4-axis system.
   - Miller–Bravais notation is named and explained as the special hexagonal indexing notation.
   - Added one guided drill, one test question, and a Reference entry.

2. **External crystal surfaces**
   - Week 4 now explicitly teaches that a crystal terminates abruptly at an external surface.
   - Surface atoms therefore have incomplete bonding; the lecture notes that the surface can be rough and comparatively reactive.
   - Added one guided drill, one test question, and a Reference entry.

## Regression guards

The deterministic validator now requires the following concepts to remain learner-visible:

- Miller–Bravais
- 3-axis / 4-axis HCP indexing
- incomplete bonding at external surfaces
- surface reactivity

## Result

The implemented Weeks 1–4 now cover the supplied lecture-slide text and Assignment 1 content without introducing future-week curriculum. Textbook material remains supplementary and does not override the professor's terminology or sequencing.


## Final re-check

A second independent pass found one remaining Week 3 notation detail that was implicit but not stated directly enough in the learner-facing lesson:

- Unit-cell points/directions use a **right-handed coordinate system**.
- A single crystallographic direction uses **[uvw]**, while a symmetry-equivalent family of directions uses **⟨uvw⟩**.

The Week 3 lesson, drill bank, test bank, reference entry, and deterministic coverage guard were updated accordingly.

After this repair, no additional source-text omissions were found in the supplied Weeks 1–4 lecture decks or Assignment 1.
