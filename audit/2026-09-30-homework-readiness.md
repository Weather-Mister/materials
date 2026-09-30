# Engineering Materials Lab — Homework Readiness & Consistency Pass

Date: 2026-09-30

## Scope

Checked the current Weeks 1–4 implementation against the supplied course sources and Engineering Materials Assignment 1.

## Repairs

- Corrected the Miller-plane rule. The professor slide requires reciprocals → clear fractions → **do not reduce to lowest integers** for planes. The site previously taught the opposite.
- Added inverse theoretical-density work required by Assignment 1: density → lattice parameter → BCC radius.
- Added a Problem Lab that shows formula, unit conversion, substitution, and result for all four calculation-question families.
- Added Assignment 1 presets for Fe, Cu, K, Ni, and Al while keeping all tools reusable for new values.
- Replaced third-party hotlinked course figures with local source-grounded SVG schematics using one frame, palette, typography, and caption treatment.
- Added a final CSS visual contract and explicit seven-tab responsive layouts.
- Updated stale README copy that still described the site as an empty shell.

## Assignment 1 coverage

Part I is covered by the teaching/drill banks for metallic-bond directionality, crystalline vs amorphous order, BCC close packing, covalent conductivity, and linear density.

Part II is covered for material classes, primary/secondary bonds, FCC/BCC/HCP, ionic coordination structures, and Miller notation/rules. The assignment-specific van der Waals <10 kcal/mol cue is now explicit.

Part III has model-answer practice for allotropy/polymorphism, anisotropy/isotropy, and crystalline/amorphous structure.

Part IV is covered in the Problem Lab and worked-practice bank: BCC/FCC radius-lattice relations, inverse theoretical density, FCC (100) planar density, FCC (111) PPF, plane indexing, and cubic interplanar spacing.

## Release gates

Validation now requires the local SVG set, Problem Lab surface/script, corrected Miller wording, a 21+ question Week-3 exam-practice bank, and numerical regression checks using the Assignment 1 potassium, nickel, and aluminum patterns.
