/* Original practice. References are PDF page numbers in the ME2004 lecture decks. */
(() => {
  'use strict';

  window.MATERIALS_PHASE_CHAPTERS = {
    10: {
      title: 'Solid solutions and phase equilibrium',
      description: 'From identifying phases to predicting where segregation develops during freezing.',
      topics: {
        phases: 'Phases, components and the phase rule',
        solutions: 'Solubility and solid-solution strengthening',
        isomorphous: 'Isomorphous diagrams and the lever rule',
        freezing: 'Equilibrium solidification and cooling curves',
        segregation: 'Dendrites, segregation and homogenization'
      }
    },
    11: {
      title: 'Dispersion strengthening and eutectic diagrams',
      description: 'Read eutectic diagrams, follow solidification and account for phases and microconstituents.',
      topics: {
        dispersion: 'Matrix, particles and strengthening',
        reactions: 'Intermetallic compounds and invariant reactions',
        eutectic: 'Eutectic diagrams and solidification sequences',
        fractions: 'Phase and microconstituent fractions',
        processing: 'Lamellar spacing, processing and nonequilibrium freezing'
      }
    },
    12: {
      title: 'Phase transformations and heat treatments',
      description: 'Practice reaction kinetics, precipitation hardening, weld zones and steel transformations.',
      topics: {
        kinetics: 'Solid-state nucleation, growth and kinetics',
        aging: 'Coherency and precipitation hardening',
        weld: 'Welding an age-hardened alloy',
        eutectoid: 'Fe–Fe₃C, pearlite and proeutectoid phases',
        ttt: 'TTT diagrams, pearlite and bainite',
        martensite: 'Martensite and tempering'
      }
    }
  };

  const figures = {
    unary: { alt: 'Pressure–temperature plot of three phase regions and a horizontal one-atmosphere line', caption: 'Unary phase diagram, schematic.' },
    cuni: { alt: 'Cu–Ni temperature versus wt% nickel with liquidus and solidus boundaries', caption: 'Cu–Ni schematic anchored to Chapter 10 Part 2 readings. Values are approximate.', axes: { width: 680, height: 390, left: 72, right: 642, top: 30, bottom: 328, coords: (x,y) => (1050+450*y).toFixed(0)+' °C · '+(100*x).toFixed(1)+' wt% Ni' } },
    cooling: { alt: 'Three unlabeled cooling curves A, B and C with temperature on the vertical axis and time on the horizontal axis', caption: 'Equal heat extraction rate is idealized. Curve shapes are schematic.' },
    coring: { alt: 'Dendrite cross section with three successive solid layers surrounded by residual liquid', caption: 'A schematic section through a growing dendrite.' },
    pbsn: { alt: 'Pb–Sn temperature-composition diagram with terminal solid solutions and a eutectic isotherm', caption: 'Pb–Sn diagram with ME2004 limiting compositions.', axes: { width: 680, height: 390, left: 72, right: 642, top: 30, bottom: 328, coords: (x,y) => (400*y).toFixed(0)+' °C · '+(100*x).toFixed(1)+' wt% Sn' } },
    'micro-eutectic': { alt: 'Two fields of view comparing eutectic colonies with and without large primary alpha regions', caption: 'Schematic sketches. Dark and light lamellae represent different phases.' },
    kinetics: { alt: 'Two isothermal transformed-fraction curves and a fraction scale from zero to one', caption: 'Illustrative Avrami curves for two isothermal conditions.' },
    aging: { alt: 'Yield strength against logarithmic aging time for two unnamed temperature conditions', caption: 'Schematic aging curves based on the trends in Chapter 12 Part 1.' },
    'weld-zones': { alt: 'Five regions from weld centerline outward, showing liquid at peak temperature and precipitate distributions after slow cooling', caption: 'Idealized Al–Cu weld section. The dashed lines mark the peak-temperature thresholds for this cycle.' },
    fec: { alt: 'Fe–Fe₃C steel-side temperature–composition diagram with austenite, ferrite, and cementite fields', caption: 'Steel side of the metastable Fe–Fe₃C equilibrium diagram.', axes: { width: 680, height: 390, left: 72, right: 642, top: 30, bottom: 328, coords: (x,y) => (600+600*y).toFixed(0)+' °C · '+(2.25*x).toFixed(3)+' wt% C' } },
    ttt: {
      alt: 'Eutectoid steel TTT plot with logarithmic time, transformation start and finish, and martensite temperatures',
      caption: 'Schematic isothermal transformation diagram. Use the given paths in each question.',
      axes: { width: 680, height: 390, left: 72, right: 642, top: 30, bottom: 328,
        coords: (x, y) => (100 + 650 * y).toFixed(0) + ' °C · ' + Number((10 ** (-1 + 6 * x)).toPrecision(2)) + ' s' }
    },
    'micro-steel': { alt: 'Pearlite lamellae, upper bainite ferrite laths with carbides between them, and martensite plates', caption: 'Structural sketches at different magnifications. Feature sizes are qualitative.' }
  };
  window.MATERIALS_PHASE_FIGURES = figures;

  const bank = [
  {
    "id": "phase-10-components",
    "ch": 10,
    "topic": "phases",
    "title": "Phases versus components",
    "prompt": "A Cu–Zn specimen contains a Cu-rich substitutional solid solution and CuZn. The solid solution has several grain orientations. Select all true statements.",
    "solution": "Cu and Zn are the two independent components. The Cu-rich phase and CuZn are the two bulk phases. Different orientations of the same crystal structure do not create new phases. A phase is physically homogeneous, with the same structure, approximately the same composition and properties, and an interface separating it from surrounding phases. FCC and BCC iron are distinct solid phases despite being the same component.",
    "source": "practice",
    "reference": "Chapter 10 · Part 1 pp. 2–4",
    "type": "multi",
    "choices": [
      "There are two independent components.",
      "Every grain orientation is a separate phase.",
      "CuZn adds a third independent component.",
      "There are two bulk phases.",
      "The Cu-rich phase must be pure Cu."
    ],
    "key": [
      0,
      3
    ]
  },
  {
    "id": "phase-10-gibbs",
    "ch": 10,
    "topic": "phases",
    "title": "Degrees of freedom in equilibrium",
    "prompt": "For a pure metal with variable pressure, give F in a single region, on a two-phase boundary, and at the triple point. Then give F for a binary alloy at fixed pressure with one, two or three phases.",
    "solution": "Unary: F = 2 + 1 − P gives 2, 1, 0. Binary at fixed pressure: F = 1 + 2 − P gives 2, 1, 0. F counts independent intensive variables that can be varied without changing the number of equilibrium phases. The phase rule assumes equilibrium.",
    "source": "practice",
    "reference": "Chapter 10 · Part 1 pp. 3–5",
    "type": "written"
  },
  {
    "id": "phase-10-unary",
    "ch": 10,
    "topic": "phases",
    "title": "Reading a pressure–temperature map",
    "prompt": "Which sequence is observed when heating along the 1 atm line, and what does the intersection of all three boundaries represent?",
    "solution": "The 1 atm line crosses melting and then boiling. The three boundaries meet at the one pressure and temperature where solid, liquid and vapor coexist.",
    "source": "practice",
    "reference": "Chapter 10 · Part 1 p. 5",
    "type": "single",
    "choices": [
      "Solid → vapor → liquid; the critical point.",
      "Solid → liquid → vapor; the triple point.",
      "Liquid → solid → vapor; the melting point at all pressures.",
      "Solid → liquid → vapor; a two-phase field."
    ],
    "key": [
      1
    ],
    "figure": "unary"
  },
  {
    "id": "phase-10-solvus",
    "ch": 10,
    "topic": "solutions",
    "title": "Crossing a solubility limit",
    "prompt": "A Cu–Zn alloy lies in the α field at 400 °C and the α + compound field at 100 °C. What happens on slow cooling?",
    "solution": "A solvus bounds solid solubility. After crossing it, a second solid forms and absorbs solute. Both phase compositions can differ from the unchanged bulk composition.",
    "source": "practice",
    "reference": "Chapter 10 · Part 1 pp. 6–8",
    "type": "single",
    "choices": [
      "Overall Zn decreases to the lower solubility limit.",
      "The low-temperature solid solution contains all the original Zn.",
      "Part of the Zn partitions into a new phase while overall composition is unchanged.",
      "The solvus is crossed by forming liquid."
    ],
    "key": [
      2
    ]
  },
  {
    "id": "phase-10-hume",
    "ch": 10,
    "topic": "solutions",
    "title": "Predicting extensive substitutional solubility",
    "prompt": "Two candidate solutes have similar radius to the parent metal. One matches its structure, valence and electronegativity. The other has a different structure and much larger electronegativity. Which is more promising, what radius criterion is used, and how can MgO and NiO form a solid solution?",
    "solution": "The first candidate best meets the Hume–Rothery screening conditions: roughly <15% radius mismatch, same structure and valence, and similar electronegativity. The rules favor extensive solubility but are not sufficient to guarantee unlimited solid solubility. In MgO–NiO the oxides have similar structures and divalent Mg²⁺ and Ni²⁺ can substitute on the same cation sublattice.",
    "source": "practice",
    "reference": "Chapter 10 · Part 1 pp. 9–10",
    "type": "written"
  },
  {
    "id": "phase-10-strength",
    "ch": 10,
    "topic": "solutions",
    "title": "Alloying and property trade-offs",
    "prompt": "Assuming both alloys remain single phase, which trends or interpretations agree with the lecture graphs? Select all that apply.",
    "solution": "Solute distortion impedes slip, raising yield strength and often hardness and creep resistance. Electron scattering generally lowers conductivity. Cu–Zn elongation in the slide graph is a specific exception to the common ductility trend. In Cu–Ni, alloy strength varies with composition and need not peak at a pure endpoint. The usual lecture trend is higher yield and tensile strength, hardness, creep resistance and elevated-temperature strength, and lower ductility and conductivity. The Cu–Zn elongation curve is an exception; in Cu–Ni both strength curves peak at intermediate composition.",
    "source": "practice",
    "reference": "Chapter 10 · Part 1 pp. 11–14; Part 2 p. 11",
    "type": "multi",
    "choices": [
      "More solute or a greater size mismatch can increase resistance to dislocation motion.",
      "Solid-solution alloys generally conduct electricity better than the pure host.",
      "Tensile strength and elongation must peak together.",
      "Solid-solution strengthening can improve creep resistance.",
      "The measured Cu–Zn elongation can rise even though reduced ductility is a common trend."
    ],
    "key": [
      0,
      3,
      4
    ]
  },
  {
    "id": "phase-10-read-cu",
    "ch": 10,
    "topic": "isomorphous",
    "title": "Read both phase fields and tie-line endpoints",
    "prompt": "At 1250 °C, use the chart to identify the phases and approximate phase compositions for Cu–20 wt% Ni, Cu–40 wt% Ni and Cu–65 wt% Ni. For the 40 wt% alloy, calculate the liquid and solid mass fractions.",
    "solution": "Read about 32 wt% Ni at the liquidus and 45 wt% Ni at the solidus. At 20 wt% Ni the alloy is all liquid of 20 wt% Ni. At 65 wt% Ni it is all α of 65 wt% Ni. At 40 wt% Ni both phases occur: wL ≈ (45 − 40)/(45 − 32) = 38.5%, wα ≈ 61.5%.",
    "source": "practice",
    "reference": "Chapter 10 · Part 2 pp. 2–10",
    "type": "written",
    "figure": "cuni"
  },
  {
    "id": "phase-10-tie-compare",
    "ch": 10,
    "topic": "isomorphous",
    "title": "Same tie line, different alloys",
    "prompt": "At the same temperature, both bulk compositions lie inside an α + L field, with the α endpoint at higher wt% Ni. Compared with the lower-Ni alloy, what is true of the higher-Ni alloy?",
    "solution": "Temperature fixes the equilibrium endpoints at fixed pressure. Moving the bulk composition toward the α endpoint increases the α amount.",
    "source": "practice",
    "reference": "Chapter 10 · Part 2 pp. 4–10",
    "type": "single",
    "choices": [
      "It has richer α and richer liquid, with the same fractions.",
      "It has the same phase compositions, with a larger α mass fraction.",
      "It has the same composition and a larger liquid mass fraction.",
      "Its tie line must slope upward."
    ],
    "key": [
      1
    ]
  },
  {
    "id": "phase-10-first-last",
    "ch": 10,
    "topic": "freezing",
    "title": "Read the first solid and last liquid",
    "prompt": "Using the Cu–Ni chart, estimate the freezing interval of Cu–40 wt% Ni, the composition of the first solid and the composition of the last liquid. Explain why the fully equilibrated solid must end at 40 wt% Ni.",
    "solution": "Follow 40 wt% Ni vertically: liquidus ≈1280 °C, solidus ≈1240 °C, freezing range ≈40 °C. The first solid has about 52 wt% Ni, read horizontally to the solidus at the liquidus temperature. The last liquid has about 28 wt% Ni, read at the liquidus at the solidus temperature. After the last liquid disappears, mass conservation gives uniform 40 wt% Ni at equilibrium.",
    "source": "practice",
    "reference": "Chapter 10 · Part 2 pp. 12–14",
    "type": "written",
    "figure": "cuni"
  },
  {
    "id": "phase-10-curve",
    "ch": 10,
    "topic": "freezing",
    "title": "Cooling-curve arrests",
    "prompt": "Which of curves A, B and C is consistent with an isomorphous alloy freezing over a temperature interval? How does its latent-heat signature differ from the freezing of a pure metal?",
    "solution": "B has a slope change spread over the freezing interval. Latent heat slows cooling while α and L coexist. A shows a constant-temperature plateau, as a pure metal freezes at fixed pressure. C has neither signature.",
    "source": "practice",
    "reference": "Chapter 10 · Part 2 pp. 12–14",
    "type": "written",
    "figure": "cooling"
  },
  {
    "id": "phase-10-local-average",
    "ch": 10,
    "topic": "segregation",
    "title": "What composition goes into the balance?",
    "prompt": "A cored alloy has 40 wt% B overall. Residual liquid contains 28 wt% B. Newly forming α has 40 wt% B at the interface, and all α formed so far averages 48 wt% B. Find the remaining liquid fraction and explain the role of the interface composition.",
    "solution": "40 = 28wL + 48(1 − wL), so wL = 8/20 = 0.40. Use the average over all solid in the global balance. The 40 wt% B at the interface describes the newest layer. Old solid retains more B because solid-state diffusion is limited.",
    "source": "practice",
    "reference": "Chapter 10 · Part 2 pp. 15–21",
    "type": "written",
    "figure": "coring"
  },
  {
    "id": "phase-10-hot-shortness",
    "ch": 10,
    "topic": "segregation",
    "title": "Designing a homogenization hold",
    "prompt": "A cored casting develops liquid films during reheating even though the nominal equilibrium solidus has not been reached. Which diagnosis and treatment are consistent?",
    "solution": "Interdendritic segregation can lower the local incipient-melting temperature. A solid-state hold reduces short-range coring, whereas the much larger diffusion distances of macrosegregation make ordinary homogenization impractical. The lecture recommends a solid-state homogenization hold below the nonequilibrium solidus, for a suitable duration (often hours), to improve uniformity and casting properties.",
    "source": "practice",
    "reference": "Chapter 10 · Part 2 pp. 15–19",
    "type": "single",
    "choices": [
      "Macrosegregation across the casting is quickly removed by heating just above the liquidus.",
      "The casting has no segregation; the films represent isolated α particles.",
      "Low-melting interdendritic regions cause hot shortness. Hold below their incipient-melting temperature to reduce microsegregation.",
      "Heat above the local solidus so the lowest-melting regions can homogenize by diffusion in solid."
    ],
    "key": [
      2
    ]
  },
  {
    "id": "phase-11-particles",
    "ch": 11,
    "topic": "dispersion",
    "title": "Strength and toughness together",
    "prompt": "For a given particle phase and comparable fraction, which microstructure is the best starting design for strength plus toughness?",
    "solution": "Fine, numerous particles obstruct slip. Rounded particles are less likely to initiate cracks than sharp particles, and a continuous ductile matrix can yield and blunt cracks. Raising the fraction of effective particles can raise strength, provided continuity and toughness remain acceptable.",
    "source": "practice",
    "reference": "Chapter 11 · Part 1 pp. 2–4",
    "type": "single",
    "choices": [
      "A continuous hard particle network through a ductile matrix.",
      "Large angular particles sparsely distributed.",
      "Fine, rounded, discontinuous hard particles in a continuous ductile matrix.",
      "A continuous brittle matrix with discontinuous soft particles."
    ],
    "key": [
      2
    ]
  },
  {
    "id": "phase-11-line-compound",
    "ch": 11,
    "topic": "reactions",
    "title": "Intermetallic phase fields",
    "prompt": "On one diagram AlSb appears as a nearly vertical line; on another the Mo–Rh intermetallic γ occupies a finite composition interval. Explain the difference. What does the Ti₃Al versus nickel-superalloy graph suggest about strength and ductility trade-offs?",
    "solution": "The AlSb line denotes a fixed stoichiometric composition, while the Mo–Rh γ phase tolerates a range of compositions. Some intermetallics retain strength at elevated temperature: Ti₃Al keeps its strength to higher temperatures on the slide graph, but the accompanying elongation curve shows that strength retention is not equivalent to ductility. Intermetallic compounds contain at least two metallic elements in a single phase. They are often hard and brittle, useful as dispersed particles; fixed-composition cementite is an example in steels.",
    "source": "practice",
    "reference": "Chapter 11 · Part 1 pp. 5–7",
    "type": "written"
  },
  {
    "id": "phase-11-invariant",
    "ch": 11,
    "topic": "reactions",
    "title": "Identify all five invariant reaction types",
    "prompt": "Name each reaction on cooling: (a) L → α + β, (b) α + L → β, (c) L₁ → L₂ + α, (d) γ → α + β, (e) α + β → γ. At fixed pressure in a binary system, why is the reaction temperature fixed?",
    "solution": "Respectively: eutectic, peritectic, monotectic, eutectoid, and peritectoid. Two components and three coexisting phases give F = 2 − 3 + 1 = 0 at fixed pressure, fixing temperature and phase compositions while all three coexist.",
    "source": "practice",
    "reference": "Chapter 11 · Part 1 p. 8",
    "type": "written"
  },
  {
    "id": "phase-11-composition-ranges",
    "ch": 11,
    "topic": "eutectic",
    "title": "Four solidification routes on one diagram",
    "prompt": "Follow 1, 10, 30, 61.9 and 80 wt% Sn on the approximate Pb–Sn diagram. For each, state the first solid, whether any liquid survives to the eutectic temperature, and whether crossing a solvus later can form a second phase. For the exact eutectic composition, predict the shape of the cooling curve at 183 °C.",
    "solution": "1%: primary α, freezing finishes in α and the alloy remains α down to roughly room temperature in this diagram. 10%: also freezes fully to α above the eutectic; β forms from solid α below the solvus. 30%: primary α forms first; the remaining liquid freezes into the eutectic microconstituent at 183 °C. 61.9%: α and β form together at the eutectic; no primary solid. 80%: primary β grows first, then remaining liquid becomes α + β eutectic. Further cooling can change equilibrium solubilities and phase amounts. The lecture treats <2 wt% Sn as single-phase at room temperature and approximately 2–19 wt% Sn as alloys that subsequently precipitate β on cooling. At exactly the eutectic composition the liquid transforms into two solids at the invariant temperature; latent heat produces a plateau, just as isothermal freezing of a pure metal did in Chapter 10.",
    "source": "practice",
    "reference": "Chapter 11 · Part 2 pp. 2–10",
    "type": "written",
    "figure": "pbsn"
  },
  {
    "id": "phase-11-colony",
    "ch": 11,
    "topic": "eutectic",
    "title": "Recognize a eutectic colony",
    "prompt": "Consider two eutectic microstructures: one contains only colonies of differently oriented lamellae and the other also contains large unlamellated regions. What identifies a colony? How can α and β grow together at a common liquid front, and how could you identify the primary phase in the second alloy?",
    "solution": "Within a colony, lamellae share an orientation; adjacent independently nucleated colonies may have different orientations. The unlamellated regions can be primary solid. Identify the bulk composition relative to the eutectic or use phase contrast/composition measurements to distinguish α from β. Each growing phase rejects solute needed by the neighboring phase; Pb and Sn redistribute through the liquid over short distances of the order of the lamellar spacing.",
    "source": "practice",
    "reference": "Chapter 11 · Part 2 pp. 5–6, 8–12",
    "type": "written"
  },
  {
    "id": "phase-11-phase-constituent",
    "ch": 11,
    "topic": "fractions",
    "title": "What do the two tie lines count?",
    "prompt": "For a hypoeutectic alloy that contains primary α and eutectic, which pairing gives the specified quantities immediately around the reaction?",
    "solution": "Use the α–L endpoints just before the eutectic to count primary α and the liquid that becomes eutectic. The α–β endpoints below count phases across both microconstituents.",
    "source": "practice",
    "reference": "Chapter 11 · Part 2 pp. 7–9",
    "type": "single",
    "choices": [
      "Above: α–L gives total α; below: α–β gives primary α.",
      "Above: α–L gives primary α and residual liquid; below: α–β gives total α and total β.",
      "Above: L–β gives primary α; below: α–L gives total β.",
      "The α–β tie line gives the same fractions of primary α and eutectic."
    ],
    "key": [
      1
    ]
  },
  {
    "id": "phase-11-solute-in-phases",
    "ch": 11,
    "topic": "fractions",
    "title": "Track the two elements separately",
    "prompt": "In 200 g of Pb–61.9 wt% Sn, use α = 19.0 and β = 97.5 wt% Sn at 183 °C. Find the mass of Sn in each phase and check the total against the charge composition.",
    "solution": "mα = 200(97.5 − 61.9)/(97.5 − 19.0) = 90.70 g and mβ = 109.30 g. Sn in α = 0.190mα ≈ 17.23 g and Sn in β = 0.975mβ ≈ 106.57 g. Together they give 123.80 g Sn; Pb makes up the remaining 76.20 g.",
    "source": "practice",
    "reference": "Chapter 11 · Part 2 p. 7",
    "type": "written"
  },
  {
    "id": "phase-11-lambda",
    "ch": 11,
    "topic": "processing",
    "title": "Read spacing, growth rate and strength",
    "prompt": "In a regular lamellar eutectic, the growth rate increases from R to 9R at fixed composition. What happens to λ? What is the difference between changing λ and increasing the proportion of eutectic by moving toward the eutectic composition?",
    "solution": "λ = cR⁻¹ᐟ², so λ becomes one-third of its former value, which tends to increase strength. A composition change alters the relative amounts of primary solid and eutectic. The Pb–Sn strength graph peaks near the eutectic and illustrates dispersion strengthening on both sides, while spacing describes the fineness within a colony.",
    "source": "practice",
    "reference": "Chapter 11 · Part 2 pp. 11–13",
    "type": "written"
  },
  {
    "id": "phase-11-processing",
    "ch": 11,
    "topic": "processing",
    "title": "Two consequences of a low eutectic temperature",
    "prompt": "Explain why an alloy near a eutectic can be useful as a solder or casting alloy. Then explain why an off-eutectic casting with nonequilibrium eutectic at dendrite boundaries can be damaged by a heat-treatment temperature above the eutectic.",
    "solution": "A low melting temperature can let solder flow while the joined parts remain solid and can reduce casting temperatures in suitable alloys. The same low-melting constituent can form as trapped solute-rich liquid freezes at dendrite boundaries far from the nominal eutectic composition. On reheating it can partially remelt near the eutectic temperature, so the maximum safe temperature must stay below local incipient melting. Lecture examples include Pb–Sn solder, cast iron and aluminum casting alloys, and ceramic eutectics such as silica–alumina.",
    "source": "practice",
    "reference": "Chapter 11 · Part 2 pp. 14–17",
    "type": "written"
  },
  {
    "id": "phase-12-nucleation",
    "ch": 12,
    "topic": "kinetics",
    "title": "Where a solid-state precipitate starts",
    "prompt": "For a spherical solid precipitate, distinguish the chemical driving term, the matrix–precipitate interfacial cost, and the elastic strain penalty. Why do grain boundaries promote nucleation, and what often limits later growth?",
    "solution": "Chemical free-energy change scales with volume and is favorable under suitable conditions. Interfacial energy scales with surface area and usually costs energy. Elastic misfit adds a positive volume term. A grain boundary offers an energetically favorable heterogeneous site by replacing some existing boundary area. Redistribution by solid-state diffusion often limits growth. Other existing defects can also act as heterogeneous nucleation sites.",
    "source": "practice",
    "reference": "Chapter 12 · Part 1 pp. 2–3",
    "type": "written"
  },
  {
    "id": "phase-12-avrami",
    "ch": 12,
    "topic": "kinetics",
    "title": "Invert the Avrami equation",
    "prompt": "An isothermal transformation obeys f = 1 − e^(−ctⁿ). With n = 2 and f = 0.50 at 100 s, determine c, with units, and the time for f = 0.90. Explain why parameters fitted at one temperature need not apply at another.",
    "solution": "c = −ln(1 − 0.50)/100² = 6.9315 × 10⁻⁵ s⁻². t₉₀ = √[−ln(0.10)/c] = 182.26 s. Different temperatures can change the nucleation rate, diffusivity and mechanisms, so the fitted constants can change. Initial solute concentration can also influence transformation time.",
    "source": "practice",
    "reference": "Chapter 12 · Part 1 pp. 3–5",
    "type": "written"
  },
  {
    "id": "phase-12-rates",
    "ch": 12,
    "topic": "kinetics",
    "title": "From fraction curves to a transformation nose",
    "prompt": "At the same transformed fraction, which of the two isothermal curves reaches it sooner? Explain how competing nucleation and growth trends can create a minimum in transformation time as you vary temperature.",
    "solution": "Curve A reaches any comparable intermediate fraction first. Close to equilibrium there is little driving force for nucleation. Deep undercooling improves driving force but slows diffusion-limited growth. The overall reaction can be fastest at an intermediate temperature. The lecture’s isothermal example also shows faster completion at its higher tested temperatures within that interval.",
    "source": "practice",
    "reference": "Chapter 12 · Part 1 pp. 3–5",
    "type": "written",
    "figure": "kinetics"
  },
  {
    "id": "phase-12-dihedral",
    "ch": 12,
    "topic": "aging",
    "title": "Read the dihedral-angle relation",
    "prompt": "At a symmetrical grain boundary, γgb = 2γmp cos(θ/2). Calculate θ if γgb = γmp. What happens to θ as the boundary energy approaches 2γmp, and what does that imply about grain-boundary wetting?",
    "solution": "cos(θ/2) = 1/2, so θ = 120°. As γgb approaches 2γmp, θ approaches 0°, corresponding to complete wetting in the ideal limit. Lower relative boundary energy gives a larger angle and less spreading along the boundary.",
    "source": "practice",
    "reference": "Chapter 12 · Part 1 pp. 6–8",
    "type": "written"
  },
  {
    "id": "phase-12-aging-path",
    "ch": 12,
    "topic": "aging",
    "title": "Follow the Al–Cu heat-treatment path",
    "prompt": "Describe the matrix and second phase after solution treatment, immediately after quench, at peak age, and after prolonged aging. Why is lattice coherency helpful, and why can slow cooling directly from solution treatment reduce the age-hardening response?",
    "solution": "Solution treat above the solvus and below the solidus to dissolve the second phase. Quenching retains supersaturated α. Aging below the solvus produces fine strengthening precipitates; coherent intermediates strain the matrix and impede slip. Extended aging coarsens particles and commonly develops less coherent or equilibrium phases. Slow cooling allows coarser precipitation, often at boundaries, during cooling and uses up supersaturation. Coherency means precipitate crystal planes are continuous with or related to matrix planes.",
    "source": "practice",
    "reference": "Chapter 12 · Part 1 pp. 6–12",
    "type": "written"
  },
  {
    "id": "phase-12-aging-curves",
    "ch": 12,
    "topic": "aging",
    "title": "Choose an aging schedule from two curves",
    "prompt": "Read which aging response peaks sooner and which reaches the higher strength. Why can a lower aging temperature give a higher peak and a longer useful aging interval? What is natural aging?",
    "solution": "Curve A peaks sooner. Curve B peaks later and higher. A higher temperature accelerates diffusion, precipitation and overaging. A lower temperature can produce a finer, more effective dispersion over a longer time window. Natural aging is precipitation hardening at room temperature in suitable alloys. It generally takes longer; the lecture illustrates a case with high peak strength and no practical overaging during natural aging, not a universal guarantee. The lecture also notes that slow aging can give more uniform properties.",
    "source": "practice",
    "reference": "Chapter 12 · Part 1 pp. 12–14",
    "type": "written",
    "figure": "aging"
  },
  {
    "id": "phase-12-age-requirements",
    "ch": 12,
    "topic": "aging",
    "title": "Screen an alloy for age hardening",
    "prompt": "Which features support the conventional age-hardening treatment described in lecture? Select all that apply.",
    "solution": "The section of the solvus, quenchability, matrix/particle properties and coherent precipitation together support the required fine dispersion. High service temperatures can undo the effect by coarsening or redissolving particles. The lecture emphasizes a soft ductile matrix with hard precipitates, a nanoscale dispersion and increased yield strength; examples include alloys of Al, Ni, Ti, Cu, Mg, Fe and Cr.",
    "source": "practice",
    "reference": "Chapter 12 · Part 1 pp. 15–16",
    "type": "multi",
    "choices": [
      "Solubility decreases with decreasing temperature.",
      "A practical quench can retain supersaturation.",
      "The matrix is ductile and the precipitate can obstruct slip.",
      "Coherent strengthening precipitates can form.",
      "Equilibrium solubility is independent of temperature and the alloy cannot be quenched."
    ],
    "key": [
      0,
      1,
      2,
      3
    ]
  },
  {
    "id": "phase-12-thermal-thresholds",
    "ch": 12,
    "topic": "weld",
    "title": "Separate the melting and precipitation thresholds",
    "prompt": "An age-hardened Al–Cu alloy is welded. From the centerline outward, the peak temperature decreases through the liquidus, solidus, solvus and onset of overaging. Identify the five thermal zones and distinguish the partially melted zone from the solution-treated zone after slow cooling.",
    "solution": "From the centerline outward: fully melted fusion zone (L); partial-fusion zone (α + L); solution-treated solid zone (α); overaged solid zone (α + precipitates); unaffected peak-aged base metal. The first two resolidify, while the solution-treated zone loses its original fine precipitates through dissolution and can form coarse precipitates on slow cooling. The overaged zone has coarsened precipitates; unaffected metal retains the original dispersion.",
    "source": "practice",
    "reference": "Chapter 12 · Part 1 pp. 16–17",
    "type": "written"
  },
  {
    "id": "phase-12-iron-fields",
    "ch": 12,
    "topic": "eutectoid",
    "title": "Use the steel-side equilibrium diagram",
    "prompt": "Give the crystal structures of δ ferrite, γ austenite and α ferrite. Identify A₁, A₃ and Acm on a steel-side diagram and explain how Fe₃C differs from ferrite and austenite.",
    "solution": "δ and α are BCC and γ is FCC. A₁ is the eutectoid isotherm; A₃ separates γ from α + γ and Acm separates γ from γ + Fe₃C. Ferrites and austenite are interstitial solid solutions of C in Fe. Cementite is a hard, brittle compound Fe₃C at 6.67 wt% C in this diagram. On cooling pure iron, the two solid-state allotropic transformations follow δ (BCC) → γ (FCC) → α (BCC).",
    "source": "practice",
    "reference": "Chapter 12 · Part 2 pp. 2–5",
    "type": "written",
    "figure": "fec"
  },
  {
    "id": "phase-12-hypo-steel",
    "ch": 12,
    "topic": "eutectoid",
    "title": "The hypoeutectoid counterpart",
    "prompt": "For Fe–0.40 wt% C cooled slowly to just below 727 °C, determine the pearlite fraction, the proeutectoid constituent and the total cementite fraction. Use 0.0218, 0.77 and 6.67 wt% C for α, γ and Fe₃C.",
    "solution": "Above A₁ use α–γ: wγ = (0.40 − 0.0218)/(0.77 − 0.0218) = 50.55%, becoming pearlite. Primary α = 49.45%. Below A₁ use α–Fe₃C: wFe₃C = (0.40 − 0.0218)/(6.67 − 0.0218) = 5.69%. All of this cementite belongs to pearlite just below the reaction.",
    "source": "practice",
    "reference": "Chapter 12 · Part 2 pp. 5–8",
    "type": "written"
  },
  {
    "id": "phase-12-pearlite-control",
    "ch": 12,
    "topic": "ttt",
    "title": "Predict properties from colony size and spacing",
    "prompt": "At the same carbon content, compare steels transformed at a higher and a lower temperature in the pearlite range. What is a second way to obtain more, smaller colonies? Explain the difference between the two controls.",
    "solution": "Lower transformation temperature within the pearlite range yields smaller lamellar spacing and increases strength, typically reducing ductility relative to coarse pearlite. Refining prior austenite grains creates more grain-boundary nucleation sites and tends to create more, smaller pearlite colonies. Colony size and lamellar spacing are distinct scales. Faster cooling during pearlite formation limits diffusion and refines lamellae, provided the path still produces pearlite.",
    "source": "practice",
    "reference": "Chapter 12 · Part 2 pp. 7–11, 15",
    "type": "written"
  },
  {
    "id": "phase-12-ttt-path",
    "ch": 12,
    "topic": "ttt",
    "title": "Read a two-step hold on a log-time diagram",
    "prompt": "Fully austenitized eutectoid steel is brought rapidly to 650 °C and held until some but not all austenite has transformed. It is then transferred rapidly to 400 °C and held until transformation finishes. Name the final microconstituents. How would the result differ if the first hold ended before the 650 °C start curve?",
    "solution": "The first hold forms pearlite. Remaining austenite can transform into bainite during the 400 °C hold, giving pearlite plus bainite. If the first step produces no measurable pearlite, the final product is bainitic under the stated idealized hold. Use isothermal start/finish data for holds; continuous cooling follows a different diagram.",
    "source": "practice",
    "reference": "Chapter 12 · Part 2 pp. 11–15",
    "type": "written",
    "figure": "ttt"
  },
  {
    "id": "phase-12-bainite",
    "ch": 12,
    "topic": "ttt",
    "title": "Locate carbides in bainite",
    "prompt": "Contrast pearlite, conventional upper bainite and lower bainite by ferrite shape and carbide location. Where on a typical eutectoid TTT diagram do you expect the two bainite morphologies?",
    "solution": "Pearlite has alternating ferrite and cementite lamellae. In conventional upper bainite, ferrite laths occur in sheaves and cementite may form between the laths. Lower bainite commonly has finer plate-like ferrite with carbides within the plates as well as between them. Upper bainite forms at higher bainitic transformation temperatures than lower bainite. The lecture schematic separates pearlite and bainite at approximately 550 °C; this is alloy-dependent. The lecture describes bainite as discrete cementite particles in a ferrite matrix.",
    "source": "practice",
    "reference": "Chapter 12 · Part 2 pp. 11–15",
    "type": "written"
  },
  {
    "id": "phase-12-athermal",
    "ch": 12,
    "topic": "martensite",
    "title": "Interpret Mₛ, Mᶠ and a hold between them",
    "prompt": "A sample reaches a temperature between Mₛ and Mᶠ without diffusional transformation. It is held briefly, then cooled below Mᶠ. Describe the product at each step and contrast the path with holding at 400 °C above Mₛ.",
    "solution": "Below Mₛ, some austenite becomes diffusionless martensite; retained austenite remains above Mᶠ. Martensitic growth is extremely fast, so nucleation is the controlling step in the lecture model. A brief isothermal hold produces little additional athermal martensite, but further cooling transforms more. A sufficiently long hold above Mₛ within the bainite range can instead transform austenite by an isothermal bainitic reaction.",
    "source": "practice",
    "reference": "Chapter 12 · Part 2 pp. 12, 16–17",
    "type": "written"
  },
  {
    "id": "phase-12-martensite-graphs",
    "ch": 12,
    "topic": "martensite",
    "title": "Carbon, tetragonality and tempering",
    "prompt": "Explain how carbon changes martensite lattice parameters and as-quenched hardness. On the lecture tempering plot, what happens to Rockwell C hardness, yield strength and tensile strength as tempering temperature increases?",
    "solution": "Trapped interstitial carbon stretches the c axis relative to a, making high-carbon martensite distinctly BCT; low-carbon martensite is closer to BCC. As-quenched hardness rises with carbon and levels off in the illustrated range. The tempering plot shows hardness, yield strength and tensile strength decreasing as tempering temperature rises, especially at higher temperatures, as the supersaturated structure relaxes and carbides precipitate or coarsen. Below roughly 0.2 wt% C the lecture describes martensite as supersaturated BCC, and higher-carbon martensite as BCT. Martensite is hard and brittle with fine internal structure; it is a nonequilibrium phase absent from the equilibrium Fe–Fe₃C diagram.",
    "source": "practice",
    "reference": "Chapter 12 · Part 2 pp. 16–22",
    "type": "written"
  },
  {
    "id": "phase-10-unlimited",
    "ch": 10,
    "topic": "solutions",
    "title": "Unlimited solid solubility",
    "prompt": "What does unlimited solid solubility mean for two alloying components?",
    "solution": "Unlimited solid solubility means the two components can form a single solid solution over the full composition range. It does not mean the material is solid at every temperature. A limited-solubility system can form a second phase when the solubility limit is exceeded.",
    "source": "practice",
    "reference": "Chapter 10 · Part 1 pp. 6–9; Part 2 pp. 2–4",
    "type": "single",
    "choices": [
      "The two components have equal melting temperatures.",
      "One homogeneous solid solution can exist across the entire composition range; this does not rule out liquid or liquid + solid at higher temperatures.",
      "Every composition freezes at a single temperature.",
      "Both components remain chemically pure in separate grains."
    ],
    "key": [
      1
    ]
  },
  {
    "id": "phase-10-boundary",
    "ch": 10,
    "topic": "isomorphous",
    "title": "Composition is not amount",
    "prompt": "On the Cu–Ni diagram, a horizontal line at a fixed temperature in L + α intersects the solidus at 45 wt% Ni. What does this endpoint establish?",
    "solution": "An endpoint is a phase composition; the lever rule is a separate mass balance for phase amounts. The liquidus marks the onset of freezing on cooling; the solidus marks its completion. Their temperature difference at a given bulk composition is the freezing range. On a mole-percent axis the lever rule yields mole fractions, while on a weight-percent axis it yields mass fractions. The lever rule is the opposite tie-line arm divided by the total tie-line length. For α on the right, its mass fraction is (C₀−C_L)/(C_α−C_L).",
    "source": "practice",
    "reference": "Chapter 10 · Part 2 pp. 4–6",
    "type": "single",
    "choices": [
      "45% of the charge is solid.",
      "45% of the nickel has solidified.",
      "The equilibrium α phase contains 45 wt% Ni; its mass fraction requires the bulk composition and the other endpoint.",
      "The bulk alloy necessarily contains 45 wt% Ni."
    ],
    "key": [
      2
    ],
    "figure": "cuni"
  },
  {
    "id": "phase-10-macro",
    "ch": 10,
    "topic": "segregation",
    "title": "Length scale and treatment",
    "prompt": "Which statements correctly distinguish the two segregation scales? Select all that apply.",
    "solution": "Solid-state diffusion can smooth short interdendritic distances, but the casting-scale diffusion distances make macrosegregation much harder to remove.",
    "source": "practice",
    "reference": "Chapter 10 · Part 2 pp. 15–17",
    "type": "multi",
    "choices": [
      "Microsegregation may occur between dendrite arms.",
      "Macrosegregation can be a composition gradient between a casting’s surface and center.",
      "A short solid-state homogenization hold reliably removes both kinds equally.",
      "Hot working can reduce macrosegregation effects, as described in lecture.",
      "Homogenization requires melting the casting."
    ],
    "key": [
      0,
      1,
      3
    ]
  },
  {
    "id": "phase-10-solidify-steps",
    "ch": 10,
    "topic": "freezing",
    "title": "Nucleation versus growth",
    "prompt": "What distinguishes nucleation from growth during alloy solidification?",
    "solution": "Nucleation establishes stable crystals and growth increases their size by atomic attachment and redistribution. Under equilibrium cooling, the liquid and previously formed solid must both redistribute solute as tie-line endpoints move.",
    "source": "practice",
    "reference": "Chapter 10 · Part 2 p. 12",
    "type": "single",
    "choices": [
      "Nucleation forms stable solid clusters; growth adds atoms to existing crystals.",
      "Nucleation redistributes atoms within existing grains; growth creates the first stable clusters.",
      "Nucleation requires the entire alloy to be solid; growth requires it to be entirely liquid.",
      "Both describe only the final disappearance of the liquid."
    ],
    "key": [
      0
    ]
  },
  {
    "id": "phase-11-eutectic-strengthening",
    "ch": 11,
    "topic": "processing",
    "title": "Strengthening a eutectic alloy",
    "prompt": "Besides reducing interlamellar spacing, which approaches can strengthen a suitable eutectic alloy? Select all that apply.",
    "solution": "The lecture distinguishes solid-solution strengthening, cold work where feasible, grain-size control and finer eutectic spacing. Coarser spacing and continuous brittle paths are not appropriate strengthening/toughness strategies.",
    "source": "practice",
    "reference": "Chapter 11 · Part 2 pp. 11–13",
    "type": "multi",
    "choices": [
      "Solid-solution strengthening within the constituent phases.",
      "Increasing lamellar spacing to allow easier slip.",
      "Refining grain or colony structure.",
      "Cold working, where the alloy has sufficient workability.",
      "Making the brittle phase a continuous crack path."
    ],
    "key": [
      0,
      2,
      3
    ]
  },
  {
    "id": "phase-11-eutectic-vs-precipitate",
    "ch": 11,
    "topic": "eutectic",
    "title": "Origin of a second phase",
    "prompt": "Which observation distinguishes eutectic formation from precipitation across a solvus?",
    "solution": "The key distinction is the parent phase: liquid for eutectic freezing, solid solution for precipitation.",
    "source": "practice",
    "reference": "Chapter 11 · Part 2 pp. 3–6, 16–17",
    "type": "single",
    "choices": [
      "Both always occur from homogeneous liquid.",
      "A eutectic forms two solids from liquid, while solvus precipitation forms a second solid from an existing solid solution.",
      "A eutectic creates a new component, while precipitation does not.",
      "Precipitation is an invariant three-phase liquid reaction."
    ],
    "key": [
      1
    ]
  },
  {
    "id": "phase-12-service-temperature",
    "ch": 12,
    "topic": "aging",
    "title": "High-temperature service",
    "prompt": "An alloy is peak-aged before use. Which change can explain strength loss after a long exposure to elevated temperature?",
    "solution": "Age-hardening depends on a fine effective dispersion; diffusion at elevated temperature permits coarsening and, above the relevant solvus, dissolution.",
    "source": "practice",
    "reference": "Chapter 12 · Part 1 pp. 9, 12–16",
    "type": "single",
    "choices": [
      "Precipitates necessarily become finer indefinitely.",
      "Quenching takes place spontaneously at constant service temperature.",
      "Precipitates may coarsen or redissolve, reducing the original effective dispersion.",
      "Coherency strains increase without limit as particles grow."
    ],
    "key": [
      2
    ]
  },
  {
    "id": "phase-12-pearlite-is-not-phase",
    "ch": 12,
    "topic": "eutectoid",
    "title": "Phase versus microconstituent",
    "prompt": "A slowly cooled eutectoid steel consists of pearlite colonies. Which statements are correct? Select all that apply.",
    "solution": "Pearlite is lamellar α + Fe₃C. The eutectoid composition is the composition of the whole microconstituent, not the composition of cementite (6.67 wt% C). Colonies can differ in orientation.",
    "source": "practice",
    "reference": "Chapter 12 · Part 2 pp. 5–7",
    "type": "multi",
    "choices": [
      "Pearlite is a microconstituent, not an individual phase.",
      "Pearlite contains ferrite and cementite.",
      "The cementite phase has the overall eutectoid composition of 0.77 wt% C.",
      "Ferrite and cementite together account for the entire alloy immediately below the eutectoid temperature.",
      "All pearlite colonies must have the same lamellar orientation."
    ],
    "key": [
      0,
      1,
      3
    ]
  },
  {
    "id": "phase-12-carbon-strength",
    "ch": 12,
    "topic": "eutectoid",
    "title": "Carbon content and strengthening",
    "prompt": "For slowly cooled hypoeutectoid steels, how does increasing carbon toward the eutectoid composition affect the microstructure?",
    "solution": "More carbon toward the eutectoid produces more pearlite and cementite and generally raises strength; the lecture notes a peak rather than indefinite improvement.",
    "source": "practice",
    "reference": "Chapter 12 · Part 2 pp. 6–8",
    "type": "single",
    "choices": [
      "The proportion of pearlite decreases while proeutectoid ferrite increases.",
      "The composition of cementite changes continuously toward the bulk composition.",
      "More pearlite and cementite generally increase strength, until the strength trend reaches its peak.",
      "The eutectoid temperature rises in direct proportion to carbon content."
    ],
    "key": [
      2
    ]
  },
  {
    "id": "phase-12-ttt-read",
    "ch": 12,
    "topic": "ttt",
    "title": "Read an isothermal diagram",
    "prompt": "The schematic TTT diagram shows the time for an isothermal transformation to start and finish. Austenite is transferred rapidly to 400 °C and held for 0.1 s. What does the graph indicate at the end of that hold?",
    "solution": "The point lies to the left of the transformation-start curve. No appreciable bainite has formed; a longer hold is required. Between start and finish the transformation is partial; beyond finish it is complete.",
    "source": "practice",
    "reference": "Chapter 12 · Part 2 pp. 11–15",
    "type": "single",
    "choices": [
      "The hold is to the left of the transformation-start curve, so no appreciable bainite has formed.",
      "The hold is to the right of the finish curve, so the sample is fully bainitic.",
      "The hold is between the start and finish curves, so the sample is partially bainitic.",
      "The temperature is above A₁, so pearlite forms at once."
    ],
    "key": [
      0
    ],
    "figure": "ttt"
  },
  {
    "id": "phase-10-isomorphous-extrema",
    "ch": 10,
    "topic": "isomorphous",
    "title": "Melting minima and maxima",
    "prompt": "The lecture compares Cu–Ni, NiO–MgO, CaO·SiO₂–SrO·SiO₂ and Tl–Pb isomorphous diagrams. Which statements are correct?",
    "solution": "Cu–Ni and NiO–MgO show ordinary lens-shaped regions; the silicates show an interior minimum and Tl–Pb shows a maximum. An interior meeting of liquidus and solidus does not imply a second solid phase. Liquid and solid can have equal composition at that point. Other compositions can freeze over a range. The axis may be wt% or mol%.",
    "reference": "Chapter 10 · Part 2 p. 3",
    "source": "practice",
    "type": "multi",
    "choices": [
      "An isomorphous diagram may have an interior melting minimum or maximum.",
      "An interior minimum necessarily means that two distinct solid phases form on cooling.",
      "At an interior congruent melting point the liquid and solid have equal composition.",
      "An isomorphous diagram may use mole percent rather than weight percent.",
      "Every isomorphous alloy freezes at one temperature."
    ],
    "key": [
      0,
      2,
      3
    ]
  },
  {
    "id": "phase-10-cooling-comparison",
    "ch": 10,
    "topic": "segregation",
    "title": "Compare complete freezing histories",
    "prompt": "Cu–40 wt% Ni cools from 1300 °C. At 1260 °C the liquid, equilibrium α and nonequilibrium average α contain 34, 46 and 51 wt% Ni respectively. At 1240 °C these are 28, 40 and 48 wt% Ni; at 1200 °C residual liquid contains 22 wt% Ni and nonequilibrium average α contains 43 wt% Ni. Compare phase fractions at all three temperatures for both cooling histories, then describe their states at 1300 and 1150 °C. Explain why the nonequilibrium solidus differs.",
    "solution": "1260 °C: equilibrium L = (46−40)/(46−34) = 50%, α = 50%; nonequilibrium L = (51−40)/(51−34) = 64.7%, α = 35.3%. 1240 °C: equilibrium ≈100% α; nonequilibrium L = (48−40)/(48−28) = 40%, α = 60%. 1200 °C: equilibrium 100% α; nonequilibrium L = (43−40)/(43−22) = 14.3%, α = 85.7%. At 1300 °C both are 100% liquid, and at 1150 °C both are 100% solid with average 40 wt% Ni. Under nonequilibrium cooling the early layers retain higher Ni concentrations. The dashed average-solid curve is displaced toward higher Ni at a given temperature and predicts final freezing at a lower temperature for the same bulk composition.",
    "reference": "Chapter 10 · Part 2 pp. 16, 19–21",
    "source": "practice",
    "type": "written"
  },
  {
    "id": "phase-12-martensite-equilibrium",
    "ch": 12,
    "topic": "martensite",
    "title": "Equilibrium and quenched structures",
    "prompt": "Which statements correctly describe martensite and tempering? Martensite is the solid product formed when austenite is quenched without diffusion. Mₛ and Mᶠ mark the start and finish temperatures of this reaction.",
    "solution": "Martensite is a diffusionless, supersaturated, nonequilibrium product. The lecture describes low-carbon martensite as approximately BCC and higher-carbon martensite as BCT, with lath and plate morphologies respectively. Tempering below A₁ permits diffusion and carbide precipitation, normally reducing strength and hardness while improving ductility.",
    "reference": "Chapter 12 · Part 2 pp. 16–22",
    "source": "practice",
    "type": "multi",
    "choices": [
      "Martensite is an equilibrium phase on the Fe–Fe₃C diagram.",
      "The lecture describes martensite below about 0.2 wt% C as approximately BCC and higher-carbon martensite as BCT.",
      "Martensite is typically hard and brittle, with a fine internal substructure.",
      "Tempering below the eutectoid temperature allows carbon redistribution and carbide precipitation.",
      "Martensite formation requires long-range carbon diffusion during quenching."
    ],
    "key": [
      1,
      2,
      3
    ]
  }
];
  window.MATERIALS_PHASE_SEQUENCE = [
  "phase-10-components",
  "phase-10-gibbs",
  "phase-10-unary",
  "phase-10-unlimited",
  "phase-10-solvus",
  "phase-10-hume",
  "phase-10-strength",
  "ex-10-26",
  "ex-10-22",
  "ex-10-23",
  "ex-10-28",
  "ex-10-30",
  "ex-10-52",
  "ex-10-64",
  "phase-10-boundary",
  "phase-10-isomorphous-extrema",
  "phase-10-tie-compare",
  "phase-10-read-cu",
  "hw2-iv-1-a",
  "hw2-iv-1-b",
  "ex-10-46",
  "phase-10-solidify-steps",
  "phase-10-first-last",
  "phase-10-curve",
  "hw2-i-1",
  "ex-10-45",
  "ex-10-68",
  "ex-10-76",
  "phase-10-macro",
  "phase-10-hot-shortness",
  "phase-10-local-average",
  "phase-10-cooling-comparison",
  "hw2-i-2",
  "hw2-ii-1",
  "hw2-iv-1-c",
  "ex-10-80",
  "phase-11-particles",
  "hw2-i-3",
  "phase-11-line-compound",
  "phase-11-invariant",
  "ex-11-11",
  "ex-11-12",
  "ex-11-14",
  "ex-11-15",
  "ex-11-16",
  "phase-11-composition-ranges",
  "phase-11-eutectic-vs-precipitate",
  "phase-11-colony",
  "hw2-iii-1-a",
  "hw2-iii-1-b",
  "ex-11-17",
  "ex-11-18",
  "phase-11-phase-constituent",
  "phase-11-solute-in-phases",
  "hw2-iv-2-a",
  "ex-11-20",
  "ex-11-21",
  "ex-11-27",
  "ex-11-30",
  "ex-11-31",
  "phase-11-lambda",
  "phase-11-eutectic-strengthening",
  "phase-11-processing",
  "hw2-ii-3",
  "hw2-iii-1-c",
  "phase-12-nucleation",
  "phase-12-rates",
  "phase-12-avrami",
  "phase-12-dihedral",
  "phase-12-aging-path",
  "phase-12-aging-curves",
  "phase-12-age-requirements",
  "phase-12-service-temperature",
  "hw2-ii-4",
  "ex-12-29",
  "ex-12-41",
  "ex-12-46",
  "phase-12-thermal-thresholds",
  "hw2-i-4",
  "hw2-iii-2-a-i",
  "hw2-iii-2-a-ii",
  "phase-12-iron-fields",
  "phase-12-pearlite-is-not-phase",
  "phase-12-carbon-strength",
  "phase-12-hypo-steel",
  "hw2-ii-2",
  "hw2-iv-2-b",
  "ex-12-54",
  "ex-12-62",
  "ex-12-63",
  "ex-12-74",
  "phase-12-pearlite-control",
  "phase-12-bainite",
  "phase-12-ttt-read",
  "phase-12-ttt-path",
  "phase-12-martensite-equilibrium",
  "phase-12-athermal",
  "phase-12-martensite-graphs",
  "hw2-i-5",
  "hw2-ii-5",
  "hw2-iii-2-b-i",
  "hw2-iii-2-b-ii"
];
  window.MATERIALS_PHASE_QUESTIONS = bank;
})();
