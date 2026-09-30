# Source Figure Replacement Audit — 2026-09-30

## Scope
Audited learner-facing figures in the Engineering Materials site. Existing lecture-source WebP images were retained. Ten custom schematic SVGs were removed and every learner-facing reference to them was replaced with a figure cropped from the supplied Askeland textbook PDF.

## Replacements
| Removed schematic | Source replacement | Teaching purpose |
| --- | --- | --- |
| strength-ranges.svg | Askeland Fig. 1-3, book p. 8 | Compare representative strength ranges without implying one value per material class. |
| temperature-strength.svg | Askeland Fig. 1-6, book p. 13 | Read the general loss of strength with temperature and compare high-temperature capability. |
| graphite-layers.svg | Askeland Fig. 2-22, book p. 42 | Connect graphite's layered atomic arrangement with its bonding/property discussion. |
| crystal-cells.svg | Askeland Fig. 3-9, book p. 62 | Derive SC/BCC/FCC lattice-parameter relations from actual touching-atom paths. |
| miller-indices.svg | Askeland Fig. 3-13, book p. 68 | Ground the head-minus-tail direction-index procedure in the textbook geometry. |
| point-defects.svg | Askeland Fig. 4-1, book p. 104 | Distinguish vacancy, interstitial, and substitutional point defects visually. |
| ionic-defect-pairs.svg | Askeland Fig. 4-1(e-f), book p. 104 | Compare Frenkel and Schottky ionic defect configurations. |
| dislocation-slip.svg | Askeland Figs. 4-4 and 4-5, book p. 112 | Compare screw/edge geometry and Burgers-vector orientation. |
| schmid-law.svg | Askeland Fig. 4-10, book p. 118 | Read the geometry behind resolved shear stress and Schmid's law. |
| grain-boundaries.svg | Askeland Fig. 4-13, book p. 124 | Tie the Hall-Petch equation to the source's measured grain-size/yield-strength trend. |

## Retained source visuals
The existing lecture-source WebP figures slide-08.webp, slide-18.webp, slide-26.webp, and slide-29.webp remain unchanged because they are source captures rather than generated reconstructions.

## QA rules
- No lesson content may reference the removed schematic SVGs.
- Figure captions identify the textbook figure and book page.
- Surrounding prose explains what to inspect in the figure rather than using the image decoratively.
- Text/formulas remain the primary teaching layer, so the source crop supplements rather than replaces the explanation.
