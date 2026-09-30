(() => {
  const course = window.MATERIALS_COURSE;
  if (!course) return;

  // All teaching figures are local source-grounded assets; do not hotlink third-party images.
  const replacementPairs = [];

  for (const module of course.modules || []) {
    for (const section of module.sections || []) {
      let html = String(section.html || "");
      for (const [from, to] of replacementPairs) html = html.replaceAll(from, to);
      section.html = html;
    }
  }

  const m1 = course.modules.find((m) => m.id === "m01");
  const m2 = course.modules.find((m) => m.id === "m02");
  const m3 = course.modules.find((m) => m.id === "m03");

  if (m1 && !m1.sections.some((s) => s.title === "Exam-facing material-class cues")) {
    m1.sections.splice(3, 0, {
      eyebrow: "EXAM FOCUS",
      title: "Exam-facing material-class cues",
      html: "<p>The assignment format expects more than naming the five classes: it tests the <strong>property pattern</strong> associated with each one.</p><div class='compareTable cols5'><div class='compareHead'><span>Class</span><span>Typical bonding / structure cue</span><span>Common strengths</span><span>Common limitations</span><span>Exam cue</span></div><div><span>Metals & alloys</span><span>Metallic bonding; usually crystalline</span><span>Ductile, formable, thermally/electrically conductive</span><span>Can corrode; strength falls with temperature</span><span>Non-directional bonding helps slip and ductility</span></div><div><span>Ceramics / glasses</span><span>Ionic and/or covalent; glasses are amorphous</span><span>Hard, stiff, high-temperature capable, strong in compression</span><span>Brittle in tension</span><span>Do not call silicate glass crystalline</span></div><div><span>Polymers</span><span>Covalent chains plus weaker secondary interactions</span><span>Low density, corrosion resistant, electrically insulating</span><span>Lower temperature capability and stiffness</span><span>Lightweight is a recurring cue</span></div><div><span>Semiconductors</span><span>Electronic structure gives controlled conductivity</span><span>Unique electrical/optical behavior</span><span>Properties strongly depend on chemistry and defects</span><span>Neither a metal nor an insulator by default</span></div><div><span>Composites</span><span>Two or more distinct constituent materials</span><span>Tailored property combinations; high specific strength possible</span><span>Often anisotropic and processing-sensitive</span><span>Think matrix + reinforcement</span></div></div>",
      callout: "For select-all questions, test each statement independently. A broad material-class trend is not an absolute law for every member of the class."
    });
  }

  if (m2 && !m2.sections.some((s) => s.title === "Bond type → property consequence")) {
    m2.sections.splice(6, 0, {
      eyebrow: "EXAM FOCUS",
      title: "Bond type → property consequence",
      html: "<div class='compareTable cols4'><div class='compareHead'><span>Bond</span><span>Electron picture</span><span>Directionality</span><span>Property consequence emphasized here</span></div><div><span>Metallic</span><span>Valence electrons are delocalized</span><span>Non-directional</span><span>Good electrical/thermal conductivity and good ductility</span></div><div><span>Covalent</span><span>Electrons are shared and localized between atoms</span><span>Directional</span><span>High strength / melting point; generally low ductility and low electrical conductivity</span></div><div><span>Ionic</span><span>Electron transfer forms cations and anions</span><span>Electrostatic attraction</span><span>Strong bonding, high melting point; brittle rather than ductile</span></div><div><span>Van der Waals</span><span>Dipole-based secondary attraction</span><span>Weak secondary interaction</span><span>Much lower binding energy than primary bonds</span></div></div><p class='sourceNote'>The assignment explicitly tests that metallic bonding is <strong>not</strong> highly directional and that covalent valence electrons are localized. Assignment 1 also phrases van der Waals binding as typically <strong>&lt;10 kcal/mol</strong>; keep that number as an assignment-specific cue.</p>",
      callout: "Directionality is a frequent trap: metallic = non-directional; covalent = directional."
    });
  }

  if (m3 && !m3.sections.some((s) => s.title === "The three ionic structures the homework expects")) {
    const insertAt = Math.max(0, m3.sections.findIndex((s) => s.eyebrow === "DIFFRACTION"));
    m3.sections.splice(insertAt, 0,
      {
        eyebrow: "IONIC CRYSTALS",
        title: "The three ionic structures the homework expects",
        html: "<p>The radius ratio <strong>r<sub>cation</sub>/r<sub>anion</sub></strong> helps identify the coordination environment that can fit geometrically. The assignment then connects three coordination numbers to named structures:</p><div class='compareTable cols4'><div class='compareHead'><span>Radius-ratio range</span><span>Coordination number</span><span>Named structure</span><span>Geometry cue</span></div><div><span>0.225–0.414</span><span>4</span><span>Zinc blende (ZnS)</span><span>Tetrahedral coordination</span></div><div><span>0.414–0.732</span><span>6</span><span>Sodium chloride (NaCl)</span><span>Octahedral coordination</span></div><div><span>0.732–1.000</span><span>8</span><span>Cesium chloride (CsCl)</span><span>Cubic coordination</span></div></div><p>Ionic bonding comes from electrostatic attraction after electron transfer. Ionic solids are typically <strong>brittle</strong> and are not excellent room-temperature electrical conductors; ion mobility becomes important when molten or in solution.</p>",
        callout: "Do not confuse a drawing that looks body-centered with a BCC Bravais lattice. CsCl is treated as a simple-cubic lattice with a two-ion basis because Cs⁺ and Cl⁻ positions are not equivalent."
      },
      {
        eyebrow: "ALLOTROPY + POLYMORPHISM",
        title: "Same composition, different crystal structure",
        html: "<p><strong>Polymorphism</strong> is the general ability of a material to exist in more than one crystal structure. <strong>Allotropy</strong> is the term normally used for the same phenomenon in a <strong>pure element</strong>.</p><p>Examples used by the course sources include carbon (diamond versus graphite) and iron, which changes crystal structure with temperature. The engineering significance is large because a structure change can alter density, strength, ductility, diffusion behavior, and which heat treatments or processing routes are possible.</p><div class='conceptCallout'><strong>Short-answer structure:</strong> define the relationship first, state the terminology distinction, give one pure-element example, then connect the structure change to an engineering property or process.</div>",
        callout: "Allotropy is not a different chemical composition. The element is the same; its atomic arrangement changes."
      },
      {
        eyebrow: "PLANAR DENSITY + PPF",
        title: "Count centers on the plane, then count covered area",
        html: "<p><strong>Planar density (PD)</strong> is the number of atom centers lying in the plane divided by the planar repeat area. <strong>Planar packing fraction (PPF)</strong> is the fraction of that planar area actually covered by the circular atom cross-sections.</p><div class='formulaCard'><b>FCC (100) planar density</b><span>PD = 2/a₀²</span><b>FCC (111) planar packing fraction</b><span>PPF = π/(2√3) ≈ 0.907</span></div><p>FCC {111} is the close-packed plane family. That is why its PPF is especially high. BCC has densely packed directions but <strong>no truly close-packed plane</strong>.</p>",
        callout: "For PD, count atom centers whose centers lie on the plane. For PPF, use only the in-plane circular areas contributed by those atoms."
      },
      {
        eyebrow: "EXAM FORMULA MAP",
        title: "What to recognize before you start calculating",
        html: "<div class='formulaCard'><b>SC</b><span>a₀=2r · 1 atom/cell · APF 0.52</span><b>BCC</b><span>a₀=4r/√3 · 2 atoms/cell · APF 0.68</span><b>FCC</b><span>a₀=4r/√2=2√2r · 4 atoms/cell · APF 0.74</span><b>Theoretical density</b><span>ρ=nM/(Nₐa₀³) for a cubic unit cell</span><b>Linear density</b><span>LD = 1/(repeat distance)</span><b>Cubic interplanar spacing</b><span>d<sub>hkl</sub>=a₀/√(h²+k²+l²)</span></div><p>For Miller planes: find intercepts in lattice-parameter units → take reciprocals → clear fractions → <strong>do not reduce to lowest integers afterward in this course's plane-index convention</strong>. If the plane passes through the chosen origin, shift the origin to an equivalent lattice point first.</p>",
        callout: "Write units at every step. In density problems, convert nm to cm before cubing if the requested answer is g/cm³."
      }
    );
  }

  const q = (id, prompt, answerHtml, source = "Homework-style practice") => ({ id, prompt, answerHtml, source });
  const part = (label, title, questions) => ({ label, title, questions });

  if (m1) m1.examPractice = {
    title: "Homework-style practice · Foundations",
    intro: "Same question logic as Assignment 1: decide whether every phrase is defensible, not merely whether the statement sounds familiar.",
    parts: [
      part("PART I", "True / False", [
        q("m01-ex01", "Crystalline materials possess long-range order, while amorphous materials lack long-range periodicity.", "<strong>True.</strong> Crystalline materials have periodic long-range atomic or ionic order. Amorphous materials can still have short-range order."),
        q("m01-ex02", "Silicate glass is an inorganic crystalline ceramic with long-range order.", "<strong>False.</strong> Ordinary glass is amorphous; it does not possess the long-range periodic order of a crystal."),
        q("m01-ex03", "Polymers are generally lightweight, corrosion resistant, and electrically insulating.", "<strong>True as a broad course-level trend.</strong> The class contains exceptions, but those are the characteristics emphasized in the opening material-class comparison.")
      ]),
      part("PART II", "Select all that apply", [
        q("m01-ex04", "Which belong to the five broad engineering-material classes used in this course? A Metals/alloys · B Ceramics/glasses · C Polymers · D Semiconductors · E Composites", "<strong>A, B, C, D, and E.</strong> All five are part of the course classification."),
        q("m01-ex05", "Which statements are consistent with the course? A Ceramics are often brittle in tension · B Metals commonly conduct heat/electricity well · C Polymers are typically low density · D Every composite is isotropic · E Material selection depends on service environment", "<strong>A, B, C, and E.</strong> D is false: many composites are direction-dependent.")
      ]),
      part("PART III", "Short answer", [
        q("m01-ex06", "Explain the fundamental difference between crystalline and amorphous atomic arrangements and give one everyday example of each.", "<p><strong>Model answer:</strong> A crystalline material has a periodic long-range arrangement of atoms or ions; an amorphous material lacks this long-range periodicity although local short-range order can remain. A crystalline example is a metal such as aluminum; an amorphous example is window glass.</p>")
      ])
    ]
  };

  if (m2) m2.examPractice = {
    title: "Homework-style practice · Bonding",
    intro: "Focus on the electron mechanism, bond directionality, and the property consequence that follows.",
    parts: [
      part("PART I", "True / False", [
        q("m02-ex01", "Metallic materials are ductile mainly because metallic bonding is highly directional.", "<strong>False.</strong> The course emphasizes the opposite: metallic bonding is <strong>non-directional</strong>, which helps atomic planes slip without requiring one fixed bond angle."),
        q("m02-ex02", "Covalently bonded materials often have low electrical conductivity because valence electrons are localized in directional bonds.", "<strong>True.</strong> This is the bonding-property connection used by the course and Assignment 1."),
        q("m02-ex03", "Ionic, covalent, and metallic bonds are primary bonds; van der Waals bonding is secondary.", "<strong>True.</strong> The primary bonds are much stronger in the source comparison."),
        q("m02-ex04", "A higher binding energy generally corresponds to a lower melting temperature.", "<strong>False.</strong> Higher binding energy generally goes with stronger bonding and a higher melting temperature.")
      ]),
      part("PART II", "Select all that apply", [
        q("m02-ex05", "Which are correct? A Ionic bonds are favored by a large electronegativity difference · B Metallic bonding is non-directional · C Van der Waals bonds are the strongest primary bonds · D High binding energy generally raises melting temperature · E Ionic bonding involves electron transfer", "<strong>A, B, D, and E.</strong> C is false because van der Waals bonding is a weak secondary interaction."),
        q("m02-ex06", "Which statements describe covalent bonding? A Electron sharing · B Directional bonds · C Delocalized free-electron sea · D Often low ductility · E Often low electrical conductivity", "<strong>A, B, D, and E.</strong> C describes metallic bonding.")
      ]),
      part("PART III", "Short answer", [
        q("m02-ex07", "Why can diamond and graphite have very different engineering properties even though both are pure carbon?", "<p><strong>Model answer:</strong> Composition is the same, but atomic arrangement and bonding are different. Diamond forms a three-dimensional covalent network with four covalent bonds per carbon, giving very high stiffness and hardness. Graphite has strong covalent bonding within layers but much weaker bonding between layers, and an electron is available for electrical conduction. Structure therefore changes properties even at identical composition.</p>")
      ])
    ]
  };

  if (m3) m3.examPractice = {
    title: "Assignment 1 / Midterm-style practice",
    intro: "Four-part practice set modeled on the uploaded assignment: True/False, select-all-that-apply, short answers, and calculation problems. Open any item only after attempting it.",
    parts: [
      part("PART I", "True / False", [
        q("m03-ex01", "A BCC crystal has a truly close-packed plane, and that plane is {111}.", "<strong>False.</strong> BCC has a close-packed <em>direction</em> family ⟨111⟩ but no truly close-packed plane."),
        q("m03-ex02", "In a crystal, linear density along a direction is the reciprocal of the repeat distance along that direction.", "<strong>True.</strong> LD = 1/(repeat distance)."),
        q("m03-ex03", "FCC and HCP both have coordination number 12 and APF ≈ 0.74.", "<strong>True.</strong> They differ in stacking sequence, not maximum packing efficiency."),
        q("m03-ex04", "For Miller plane indices in this course, after taking reciprocals you clear fractions but do not reduce the resulting integers to lowest terms.", "<strong>True.</strong> The professor's plane-index procedure explicitly says not to reduce after clearing fractions; integer multiples can represent distinct parallel planes with different spacing/density."),
        q("m03-ex05", "If a plane passes through the chosen origin, shift the origin to an equivalent lattice point before determining its intercepts.", "<strong>True.</strong> Otherwise an intercept of zero cannot be inverted in the Miller-index procedure."),
        q("m03-ex06", "Randomly oriented grains can make a polycrystalline metal appear macroscopically isotropic even when a single crystal is anisotropic.", "<strong>True.</strong> Directional differences average out when many grain orientations are sampled."),
        q("m03-ex07", "The NaCl structure has coordination number 6, while zinc blende has coordination number 4.", "<strong>True.</strong> NaCl is octahedral coordination; zinc blende is tetrahedral coordination.")
      ]),
      part("PART II", "Select all that apply", [
        q("m03-ex08", "Which statements about FCC/BCC/HCP are correct? A FCC has 4 atoms/cell · B BCC has 2 atoms/cell · C FCC APF≈0.74 > BCC APF≈0.68 · D FCC stacking is ABCABC and HCP is ABAB · E FCC close-packed directions are ⟨110⟩", "<strong>A, B, C, D, and E.</strong> Every statement is consistent with the course sources."),
        q("m03-ex09", "Which ionic-structure statements are correct? A CsCl → CN 8 · B NaCl → CN 6 · C ZnS zinc blende → CN 4 · D Ionic bonding follows electron transfer and electrostatic attraction · E Ionic crystals are usually highly ductile and excellent room-temperature conductors", "<strong>A, B, C, and D.</strong> E is false: ionic solids are typically brittle and poor room-temperature conductors."),
        q("m03-ex10", "Which Miller-notation statements are correct? A [uvw] denotes a direction · B (hkl) denotes a plane · C ⟨uvw⟩ denotes a family of equivalent directions · D {hkl} denotes a family of equivalent planes · E A plane through the origin requires no special handling", "<strong>A, B, C, and D.</strong> E is false; move the origin to an equivalent lattice point."),
        q("m03-ex11", "Which statements about close packing are correct? A FCC {111} is close-packed · B FCC ⟨110⟩ directions are close-packed · C BCC has no truly close-packed plane · D HCP stacking is ABAB · E FCC and HCP have APF 0.74", "<strong>A, B, C, D, and E.</strong>")
      ]),
      part("PART III", "Short answer", [
        q("m03-ex12", "Explain the similarity and difference between allotropy and polymorphism. Use Fe or C to explain the engineering significance.", "<p><strong>Model answer:</strong> Both terms describe the ability to exist in more than one crystal structure. Polymorphism is the general term; allotropy is normally used when the material is a pure element. Iron is allotropic because its crystal structure changes with temperature, which is central to heat treatment and phase transformation. Carbon is another example: diamond and graphite have the same composition but very different structures and properties.</p>"),
        q("m03-ex13", "Define anisotropy and isotropy. Why can a single crystal be anisotropic while a polycrystalline metal is often macroscopically isotropic?", "<p><strong>Model answer:</strong> Anisotropy means a property depends on direction; isotropy means it is the same in all directions. A single crystal has fixed crystallographic directions with different atomic spacing and packing. In a polycrystal with many randomly oriented grains, those directional effects average, so the bulk response can be approximately isotropic.</p>"),
        q("m03-ex14", "Explain crystalline versus amorphous structure in terms of atomic order.", "<p><strong>Model answer:</strong> Crystalline materials possess periodic long-range order. Amorphous materials lack long-range periodicity but can retain short-range order among neighboring atoms. This difference changes diffraction behavior and often changes mechanical, optical, and thermal properties.</p>")
      ]),
      part("PART IV", "Calculation problems", [
        q("m03-ex15", "BCC radius: a metal has a BCC lattice parameter a₀ = 0.330 nm. Find r in nm and Å.", "<div class='workedBlock'><span>BCC contact: √3a₀ = 4r</span><span>r = √3(0.330)/4 = 0.1429 nm</span><strong>r = 0.1429 nm = 1.429 Å</strong></div>"),
        q("m03-ex16", "FCC lattice parameter: an FCC metal has r = 0.128 nm. Find a₀.", "<div class='workedBlock'><span>FCC contact: √2a₀ = 4r</span><span>a₀ = 2√2r = 2√2(0.128)</span><strong>a₀ = 0.3620 nm = 3.620 Å</strong></div>"),
        q("m03-ex17", "Theoretical density: a BCC metal has M = 52.00 g/mol and a₀ = 0.2884 nm. Find ρ in g/cm³. Use Nₐ = 6.022×10²³ mol⁻¹.", "<div class='workedBlock'><span>n = 2 atoms/cell</span><span>a₀ = 0.2884 nm = 2.884×10⁻⁸ cm</span><span>V = a₀³</span><span>ρ = nM/(Nₐa₀³)</span><strong>ρ ≈ 7.20 g/cm³</strong></div>"),
        q("m03-ex18", "Planar density: an FCC metal has a₀ = 0.3615 nm. Find PD on (100) in atoms/nm² and atoms/cm².", "<div class='workedBlock'><span>FCC (100) contains 2 atoms per planar square</span><span>PD = 2/a₀² = 2/(0.3615)²</span><strong>PD = 15.30 atoms/nm² = 1.530×10¹⁵ atoms/cm²</strong></div>"),
        q("m03-ex19", "Planar packing fraction: find the PPF of an FCC (111) close-packed plane.", "<div class='workedBlock'><span>The close-packed 2D arrangement is triangular.</span><span>PPF = π/(2√3)</span><strong>PPF ≈ 0.907 (90.7%)</strong></div><p>Yes: {111} is the close-packed plane family in FCC.</p>"),
        q("m03-ex20", "Miller indices: a cubic plane intercepts x at 2a, y at a, and is parallel to z. Find (hkl).", "<div class='workedBlock'><span>Intercepts in units of a: (2, 1, ∞)</span><span>Reciprocals: (1/2, 1, 0)</span><span>Clear fractions ×2</span><strong>(120)</strong></div>"),
        q("m03-ex21", "Interplanar spacing: a cubic metal has a₀ = 0.405 nm. Find d₁₁₁ and d₂₂₀.", "<div class='workedBlock'><span>d₁₁₁ = 0.405/√3 = 0.2338 nm</span><span>d₂₂₀ = 0.405/√8 = 0.1432 nm</span><strong>d₁₁₁ ≈ 0.234 nm; d₂₂₀ ≈ 0.143 nm</strong></div>"),
        q("m03-ex22", "Radius ratio: r<sub>cation</sub>/r<sub>anion</sub> = 0.50. What coordination number and common structure type does the source table suggest?", "<div class='workedBlock'><span>0.414 &lt; 0.50 &lt; 0.732</span><span>This range corresponds to octahedral coordination.</span><strong>CN = 6 → NaCl-type coordination</strong></div>"),
        q("m03-ex23", "Inverse theoretical density: potassium is BCC with ρ = 0.855 g/cm³ and M = 39.09 g/mol. Find a₀, then r. Use Nₐ = 6.022×10²³ mol⁻¹.", "<div class='workedBlock'><span>a₀ = [nM/(ρNₐ)]<sup>1/3</sup>, with n=2</span><span>a₀ = [2(39.09)/(0.855·6.022×10²³)]<sup>1/3</sup> = 5.33494×10⁻⁸ cm</span><span>a₀ = 0.533494 nm</span><span>BCC: r = √3a₀/4</span><strong>r = 0.231010 nm</strong></div>", "Assignment 1 Q2 worked pattern")
      ])
    ]
  };

  const extraRefs = [
    { id: "ref-070", term: "Polymorphism", definition: "Ability of a material to exist in more than one crystal structure.", detail: "Allotropy is the term normally used for this behavior in a pure element.", tags: ["week 3", "structure", "exam"] },
    { id: "ref-071", term: "Isotropic", definition: "A property has the same value in all directions.", detail: "Randomly oriented grains can make a polycrystalline material approximately isotropic macroscopically.", tags: ["week 3", "property", "exam"] },
    { id: "ref-072", term: "Zinc blende (ZnS)", definition: "Ionic/covalent crystal structure with tetrahedral coordination number 4 in the course radius-ratio treatment.", detail: "Associated with the 0.225–0.414 radius-ratio range in the source table.", tags: ["week 3", "ionic", "exam"] },
    { id: "ref-073", term: "Sodium chloride (NaCl) structure", definition: "Coordination number 6 with octahedral coordination.", detail: "Associated with the 0.414–0.732 radius-ratio range.", tags: ["week 3", "ionic", "exam"] },
    { id: "ref-074", term: "Planar packing fraction (PPF)", definition: "Fraction of a crystallographic plane covered by atom cross-sections centered on that plane.", detail: "FCC (111): π/(2√3) ≈ 0.907.", tags: ["week 3", "plane", "formula", "exam"] },
    { id: "ref-075", term: "Miller plane reduction rule", definition: "In the professor's plane-index procedure, take reciprocals, clear fractions, and do not reduce the resulting integers to lowest terms.", detail: "Plane multiples are not identical; their spacing/density can differ. If the plane passes through the origin, shift the origin first.", tags: ["week 3", "miller", "plane", "exam"] },
    { id: "ref-076", term: "Miller–Bravais notation", definition: "Special crystallographic indexing notation used for hexagonal unit cells.", detail: "The lecture notes that HCP cells may be represented with either a 3-axis or a 4-axis system; the four-axis Miller–Bravais form makes the basal-plane symmetry explicit.", tags: ["week 3", "miller", "hcp", "hexagonal"] },
    { id: "ref-077", term: "External surface defect", definition: "A surface where the crystal terminates and surface atoms no longer have the complete bonding environment of atoms in the bulk.", detail: "The lecture notes that incomplete surface bonding can make the exterior surface rough and comparatively reactive.", tags: ["week 4", "surface defect", "bonding"] },
    { id: "ref-078", term: "Bravais lattice", definition: "One of the fourteen distinct translational lattice types grouped into the seven crystal systems.", detail: "The lecture figure shows 3 cubic, 2 tetragonal, 4 orthorhombic, 1 hexagonal, 1 rhombohedral, 2 monoclinic, and 1 triclinic Bravais lattices.", tags: ["week 3", "crystal", "lattice"] },
    { id: "ref-079", term: "Atomic order levels", definition: "No regular order, short-range order (SRO), and long-range order (LRO) are distinct levels of atomic arrangement.", detail: "The source uses an inert monatomic gas for no regular order, molecular/glass examples for SRO, and crystalline solids for LRO.", tags: ["week 3", "order", "structure"] },
    { id: "ref-080", term: "Crystal-system unit-cell volume", definition: "The unit-cell volume follows from the axial lengths and interaxial angles of the crystal system.", detail: "Examples from the lecture table: cubic a³, tetragonal a²c, orthorhombic abc, hexagonal 0.866a²c, monoclinic abc sinβ.", tags: ["week 3", "crystal", "formula"] },
    { id: "ref-081", term: "Interplanar-spacing derivation", definition: "Using plane intercepts and direction cosines gives d²(h²/a²+k²/b²+l²/c²)=1.", detail: "For cubic a=b=c=a₀, this reduces to dₕₖₗ=a₀/√(h²+k²+l²).", tags: ["week 3", "plane", "formula"] }
  ];
  const seenRefs = new Set((course.reference || []).map((r) => r.id));
  for (const ref of extraRefs) if (!seenRefs.has(ref.id)) course.reference.push(ref);

  course.version = Math.max(Number(course.version) || 0, 7);
})();