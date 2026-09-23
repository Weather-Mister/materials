window.MATERIALS_COURSE = {
  version: 2,
  title: "Engineering Materials",
  subtitle: "NTU · Prof. I-Chung Cheng · source-grounded study lab",
  courseMeta: {
    instructor: "Prof. I-Chung Cheng",
    grading: [
      { label: "Midterm", value: "45%" },
      { label: "Final Exam", value: "45%" },
      { label: "Homework", value: "10%" },
      { label: "Course interaction", value: "3%" }
    ],
    midtermDate: "2026-10-27",
    finalDate: "2026-12-22"
  },
  modules: [
    {
      id: "m01",
      number: 1,
      title: "Introduction to Materials Science & Engineering",
      subtitle: "Week 1 · What MSE studies, material classes, and structure",
      description: "Build the course framework: composition, structure, synthesis, processing, material classes, and the distinction between crystalline and amorphous arrangements.",
      available: true,
      status: "loaded",
      sourceLabel: "Lecture 01 · slides 1–11 · Askeland Ch. 1",
      sections: [
        {
          eyebrow: "COURSE FRAME",
          title: "What this course is trying to connect",
          html: "<p>Materials science and engineering is an <strong>interdisciplinary field</strong> concerned with inventing new materials and devices and improving existing materials by understanding how <strong>microstructure, composition, synthesis, and processing</strong> relate to one another.</p><div class='sourceGrid'><div><b>Composition</b><span>Chemical make-up of a material.</span></div><div><b>Structure</b><span>The arrangement of atoms, viewed at different levels of detail.</span></div><div><b>Synthesis</b><span>How materials are made.</span></div><div><b>Processing</b><span>How materials are shaped into useful components.</span></div></div><p class='sourceNote'>Lecture slide 6 follows the same four-part framework used in the course textbook.</p>",
          callout: "Do not memorize these four terms separately: the course repeatedly asks how changing one part of the chain changes material behavior."
        },
        {
          eyebrow: "OBJECTIVE",
          title: "Atomic arrangement: crystalline or amorphous",
          html: "<p>The professor's stated objective is to understand how <strong>atomic structure and bonding</strong> lead to different atomic or ionic arrangements in materials.</p><ul class='lessonList'><li><strong>Amorphous:</strong> lacks long-range atomic arrangement.</li><li><strong>Crystalline:</strong> atoms or ions form periodic geometrical arrangements.</li></ul><figure class='sourceFigure'><img src='./assets/slide-08.webp' alt='Lecture slide 8 showing ordered regions with a disordered boundary and a totally disordered atomic arrangement'><figcaption>Lecture slide 8. Left: ordered regions separated by a disordered boundary. Right: total disorder.</figcaption></figure>",
          callout: "The distinction is about long-range arrangement, not whether atoms exist or whether short-range neighbors are present."
        },
        {
          eyebrow: "CLASSIFICATION",
          title: "Five material classes used in the lecture",
          html: "<p>One course-level way to classify engineering materials is into five groups:</p><ol class='lessonList numbered'><li><strong>Metals & alloys</strong></li><li><strong>Ceramics, glasses & glass-ceramics</strong></li><li><strong>Polymers (plastics)</strong></li><li><strong>Semiconductors</strong></li><li><strong>Composite materials</strong></li></ol><p>The textbook uses the same broad classification and emphasizes that each group spans a range of properties rather than having one fixed behavior.</p>",
          callout: "Classification is useful because it gives a first expectation of properties, but later chapters explain why structure and processing can shift those properties."
        },
        {
          eyebrow: "PROPERTY MAP",
          title: "Strength differs across material classes",
          html: "<p>Lecture slide 10 compares representative strengths. The important reading is the <strong>range</strong>: polymers occupy the lower end, ceramics and composites can reach much higher strengths, and metals and alloys cover a broad range that includes very high-strength alloys.</p><div class='sourceStrip'><span>Professor source figure retained as the reference for this comparison.</span><b>Lecture slide 10 · representative strength ranges</b></div>",
          callout: "Treat the chart as a comparison tool, not a rule that every member of a class has the same strength."
        },
        {
          eyebrow: "ENVIRONMENT",
          title: "Temperature can change which material is suitable",
          html: "<p>The lecture's temperature-strength figure shows a major design lesson: <strong>increasing temperature normally reduces material strength</strong>. Polymers lose useful strength at comparatively low temperature, while some carbon-carbon composites, special alloys, and ceramics retain useful properties much farther into the high-temperature range.</p><p>This is why material selection always depends on the service environment, not only the room-temperature property table.</p>",
          callout: "A material can be strong at room temperature and still be a poor choice at the actual operating temperature."
        },
        {
          eyebrow: "COURSE PREVIEW",
          title: "Why the opening slides jump across electrical, magnetic, and optical behavior",
          html: "<p>The first lecture briefly previews later-course property areas before the formal introduction: charge carriers and conductivity, magnetic dipoles and data storage, the electromagnetic spectrum, and refraction/reflection/absorption/transmission.</p><p>These slides are best read as a preview of the course's later electronic, magnetic, and photonic topics rather than as a complete treatment in Week 1.</p>",
          callout: "For now, recognize the scope. Detailed mechanisms belong to the later syllabus weeks."
        },
        {
          eyebrow: "CHECKPOINT",
          title: "The course-level idea to carry forward",
          html: "<p>The opening lecture establishes a recurring chain: <strong>atomic arrangement and structure influence properties; properties determine behavior and suitability; synthesis and processing alter structure.</strong></p><p>Week 2 begins by moving down to the atomic scale so that those later property differences have a physical explanation.</p>",
          callout: "When you meet a new material later, ask: what is it made of, how are its atoms arranged, how was it processed, and what properties result?"
        }
      ],
      drills: [
        {
          id: "m01-d01",
          type: "mcq",
          prompt: "Which lecture term means the chemical make-up of a material?",
          choices: ["Structure", "Composition", "Processing", "Synthesis"],
          answer: 1,
          hint: "Separate what the material is made of from how it is arranged.",
          explanation: "Composition is the chemical make-up of a material."
        },
        {
          id: "m01-d02",
          type: "mcq",
          prompt: "Which term describes how a material is shaped into useful components?",
          choices: ["Processing", "Structure", "Composition", "Valence"],
          answer: 0,
          hint: "Think about turning material into a component.",
          explanation: "The lecture defines processing as how materials are shaped into useful components."
        },
        {
          id: "m01-d03",
          type: "mcq",
          prompt: "What distinguishes the lecture's crystalline description from its amorphous description?",
          choices: ["Crystalline materials contain only one element", "Crystalline materials have periodic geometrical atomic or ionic arrangements", "Amorphous materials contain no atomic order of any kind", "Amorphous materials must be polymers"],
          answer: 1,
          hint: "Focus on long-range arrangement.",
          explanation: "The lecture defines crystalline materials by periodic geometrical arrangements and amorphous materials by lack of long-range atomic arrangement."
        },
        {
          id: "m01-d04",
          type: "mcq",
          prompt: "Which option is NOT one of the five material classes listed in the lecture?",
          choices: ["Metals & alloys", "Semiconductors", "Composites", "Lubricants"],
          answer: 3,
          hint: "The five groups are structural material classes, not every engineering substance.",
          explanation: "The lecture lists metals/alloys, ceramics/glasses/glass-ceramics, polymers, semiconductors, and composites."
        },
        {
          id: "m01-d05",
          type: "mcq",
          prompt: "What general temperature trend is emphasized by the lecture's strength-temperature figure?",
          choices: ["Strength normally increases with temperature", "Strength normally decreases with temperature", "Temperature affects only polymers", "Temperature has no relation to material selection"],
          answer: 1,
          hint: "Read the direction of the curves as temperature rises.",
          explanation: "The lecture states that increasing temperature normally reduces material strength, although some material systems retain useful properties to much higher temperatures."
        },
        {
          id: "m01-d06",
          type: "mcq",
          prompt: "Why is a broad materials classification useful at the start of the course?",
          choices: ["Every material in a class has identical properties", "It gives a first framework for comparing property ranges and applications", "It eliminates the need to study structure", "It identifies only chemical composition"],
          answer: 1,
          hint: "Think of classification as a first map, not a final answer.",
          explanation: "The class categories help organize expected property ranges and applications, while later structure-processing details explain variations within each group."
        }
      ],
      testQuestions: [
        {
          id: "m01-t01",
          type: "mcq",
          prompt: "In the lecture framework, synthesis means:",
          choices: ["how materials are made", "how atoms are arranged", "the chemical make-up", "how strength is measured"],
          answer: 0,
          explanation: "Synthesis is defined as how materials are made."
        },
        {
          id: "m01-t02",
          type: "mcq",
          prompt: "Which statement matches the lecture definition of an amorphous material?",
          choices: ["It lacks long-range atomic arrangement", "It contains no atoms", "It always has a periodic lattice", "It is always a metal"],
          answer: 0,
          explanation: "The lecture uses lack of long-range atomic arrangement as the defining contrast with crystalline materials."
        },
        {
          id: "m01-t03",
          type: "mcq",
          prompt: "Which class is explicitly listed alongside metals, ceramics, polymers, and semiconductors?",
          choices: ["Composites", "Lubricants", "Fuels", "Coolants"],
          answer: 0,
          explanation: "Composite materials are the fifth class in the lecture's five-class scheme."
        },
        {
          id: "m01-t04",
          type: "mcq",
          prompt: "The Week 1 strength-temperature figure mainly warns that:",
          choices: ["room-temperature properties alone may be insufficient for material selection", "all ceramics become weak before polymers", "temperature affects only density", "metals cannot be used above room temperature"],
          answer: 0,
          explanation: "The figure shows that strength changes with temperature, so service temperature matters in selection."
        },
        {
          id: "m01-t05",
          type: "mcq",
          prompt: "Which sequence best reflects the course's opening materials-science logic?",
          choices: ["structure/process relationships → properties/behavior → suitability", "color → cost → atomic number", "density → brand → geometry", "application → no need for structure"],
          answer: 0,
          explanation: "The opening lecture frames MSE through composition, structure, synthesis, and processing relationships that explain properties and applications."
        }
      ]
    },
    {
      id: "m02",
      number: 2,
      title: "Atomic Structure",
      subtitle: "Week 2 · Energy levels, valence, bonding, binding energy, and carbon allotropes",
      description: "Move from the course-level structure-property idea down to atoms, electrons, bonding mechanisms, and the way bonding explains major property differences.",
      available: true,
      status: "loaded",
      sourceLabel: "Lecture 01 · slides 12–31 · Askeland Ch. 2",
      sections: [
        {
          eyebrow: "WHY ATOMS MATTER",
          title: "Structure at five length scales",
          html: "<p>The lecture identifies five main levels of structure:</p><ol class='lessonList numbered'><li><strong>Atomic structure</strong></li><li><strong>Short- and long-range atomic arrangements</strong></li><li><strong>Nanostructure</strong></li><li><strong>Microstructure</strong></li><li><strong>Macrostructure</strong></li></ol><p>The Week 2 objective is to examine atomic structure as the foundation for understanding material <strong>properties, behavior, and resulting applications</strong>.</p>",
          callout: "The same chemical element can behave very differently when its structure changes; the carbon allotropes later in this module are the key example."
        },
        {
          eyebrow: "ATOM BASICS",
          title: "Nucleus, electrons, atomic number, and atomic mass",
          html: "<p>An atom consists of a <strong>nucleus</strong> containing protons and neutrons, with electrons around the nucleus. Electrons carry negative charge and protons positive charge, so electrostatic attraction acts between them.</p><div class='sourceGrid'><div><b>Atomic number</b><span>Number of protons in the nucleus.</span></div><div><b>Atomic mass</b><span>Mass associated with the protons and neutrons in the atom.</span></div><div><b>Electrons</b><span>Occupy discrete energy levels.</span></div><div><b>Why this matters</b><span>Electronic structure controls bonding behavior.</span></div></div>",
          callout: "For this course, the bridge from chemistry to materials is: electron arrangement → bond type → material properties."
        },
        {
          eyebrow: "ENERGY LEVELS",
          title: "From discrete atomic levels to bands in solids",
          html: "<p>The lecture states that electrons occupy <strong>discrete energy levels</strong> in an atom. As the number of bonded atoms increases, the energy levels of valence electrons split into many closely spaced levels; in a solid these form energy bands.</p><figure class='sourceFigure'><img src='./assets/slide-18.webp' alt='Lecture slide 18 showing electron energy levels splitting and broadening into bands as the number of bonded atoms increases'><figcaption>Source visual · Lecture slide 18. Discrete electron energy levels split and broaden into bands as atoms are grouped into a solid.</figcaption></figure>",
          callout: "Do not jump ahead to semiconductor calculations here. The slide's point is the transition from individual atomic levels to bands in a solid."
        },
        {
          eyebrow: "ELECTRONIC STRUCTURE",
          title: "Pauli, Aufbau, and valence",
          html: "<p><strong>Pauli's Exclusion Principle:</strong> no two electrons in an atom can have the same set of four quantum numbers.</p><p>The lecture also emphasizes that quantum-shell energy levels do not fill in strict numerical order. The <strong>Aufbau Principle</strong> is used to predict the filling order, while the professor notes that not all elements follow the simple expected pattern exactly; copper is given as an example.</p><p><strong>Valence</strong> is the number of electrons in an atom that participate in bonding or chemical reactions. Usually this corresponds to electrons in the outer <em>s</em> and <em>p</em> orbitals, but the lecture warns that valence also depends on the atom's surrounding environment.</p>",
          callout: "Valence is the electronic information this course immediately uses to explain bonding."
        },
        {
          eyebrow: "BONDING MAP",
          title: "Four bonding mechanisms",
          html: "<p>The lecture identifies four important bonding mechanisms in engineering materials:</p><ol class='lessonList numbered'><li><strong>Metallic bonds</strong></li><li><strong>Covalent bonds</strong></li><li><strong>Ionic bonds</strong></li><li><strong>Van der Waals bonds</strong></li></ol><p>The first three are described as <strong>primary bonds</strong> and comparatively strong. Van der Waals bonding is a <strong>secondary bond</strong> and weaker.</p>",
          callout: "The exam-useful question is not only 'name the bond,' but 'what does this bond imply about conductivity, ductility, strength, and melting behavior?'"
        },
        {
          eyebrow: "METALLIC BONDING",
          title: "Why metallic bonding gives characteristic metal behavior",
          html: "<p>According to the lecture, metallic bonding leads to:</p><ul class='lessonList'><li><strong>Good conductivity:</strong> electrons are not fixed in place.</li><li><strong>Good ductility:</strong> metallic bonds are non-directional.</li><li><strong>High melting points</strong> and electropositive behavior, with susceptibility to corrosion or oxidation noted in the lecture.</li></ul>",
          callout: "Non-directional bonding is the key phrase connecting metallic bonding to ductility."
        },
        {
          eyebrow: "COVALENT + IONIC",
          title: "Shared electrons versus transferred electrons",
          html: "<p><strong>Covalent bonding:</strong> the lecture characterizes covalently bonded materials by low electrical conductivity because valence electrons are locked into bonds, low ductility because the bonds are directional, and very high strength and melting points.</p><p><strong>Ionic bonding:</strong> forms between atoms with different electronegativities. Electron transfer creates positive <strong>cations</strong> and negative <strong>anions</strong>, which are attracted to one another.</p>",
          callout: "Covalent: sharing and directionality. Ionic: electron transfer and attraction between opposite ions."
        },
        {
          eyebrow: "BINDING ENERGY",
          title: "Interatomic spacing links bonding to measurable properties",
          html: "<p><strong>Binding energy</strong> is the energy associated with creating or destroying bonds. The lecture states that materials with high binding energy tend to have <strong>high strength and high melting point</strong>.</p><p>The interatomic energy/force diagram shows an equilibrium spacing where attraction and repulsion balance. The lecture also connects bonding to <strong>modulus of elasticity</strong> and <strong>coefficient of thermal expansion (CTE)</strong>.</p><figure class='sourceFigure'><img src='./assets/slide-26.webp' alt='Lecture slide 26 interatomic energy and force versus distance diagram showing equilibrium spacing and binding energy'><figcaption>Lecture slide 26 · Interatomic energy and force versus distance.</figcaption></figure>",
          callout: "A deeper energy well corresponds to stronger bonding; the lecture uses this relationship to motivate strength and melting behavior."
        },
        {
          eyebrow: "CARBON ALLOTROPES",
          title: "Same element, dramatically different properties",
          html: "<p>The professor uses carbon to show why <strong>structure matters even when composition is unchanged</strong>. Diamond and graphite are both carbon, yet their bonding arrangements produce very different properties.</p><div class='compareTable'><div class='compareHead'><span>Diamond</span><span>Graphite</span></div><div><span>Four covalent bonds per carbon atom.</span><span>Three covalent bonds per carbon atom within layers; the remaining interlayer bonding is much weaker.</span></div><div><span>Very high strength, hardness, stiffness; slide gives about 1100 GPa stiffness.</span><span>Layers are separated by a much larger spacing than in-plane carbon spacing.</span></div><div><span>High melting point; slide gives about 3550 °C.</span><span>High melting point but lower density than diamond.</span></div><div><span>Electrical insulator.</span><span>Electrical conductor because the fourth electron is available for conduction.</span></div></div>",
          callout: "This is the module's strongest structure–property example: composition alone cannot explain the behavior."
        },
        {
          eyebrow: "DIAMOND",
          title: "Four covalent bonds and a rigid 3D structure",
          html: "<p>The lecture states that diamond has four covalent bonds per carbon atom. It combines very high strength, hardness, stiffness, and melting point with poor electrical conductivity. The slide also highlights high thermal conductivity, giving approximately <strong>2000 W/(m·K)</strong> compared with about <strong>238 W/(m·K)</strong> for aluminum.</p><figure class='sourceFigure'><img src='./assets/slide-29.webp' alt='Lecture slide 29 showing the repeating diamond crystal structure'><figcaption>Source visual · Lecture slide 29. Repeating diamond crystal structure from the professor's deck.</figcaption></figure>",
          callout: "High thermal conductivity and electrical insulation can coexist; do not assume the two conductivities must track together."
        },
        {
          eyebrow: "GRAPHITE",
          title: "Strong in-plane covalent bonding, weak interlayer bonding",
          html: "<p>In graphite, each carbon atom has three covalent bonds within a layer. The fourth interaction between layers is much weaker, and the lecture states that layer spacing is about <strong>2.5 times</strong> the spacing between carbon atoms in the plane.</p><p>The available fourth electron also explains the electrical conductivity identified in the lecture. The final slide pairs a structural drawing with an atomic-scale image to emphasize the layered arrangement.</p><div class='sourceStrip'><span>Source visual in professor deck.</span><b>Slide 31 · graphite structure and atomic-scale image</b></div>",
          callout: "Diamond versus graphite is a direct demonstration that atomic arrangement controls engineering properties."
        }
      ],
      drills: [
        {
          id: "m02-d01",
          type: "mcq",
          prompt: "Which statement best matches the lecture's purpose for studying atomic structure?",
          choices: ["To memorize the periodic table only", "To understand how atomic structure affects properties, behavior, and applications", "To avoid studying bonding", "To classify materials only by color"],
          answer: 1,
          hint: "Look at the stated objective on slide 15.",
          explanation: "The lecture explicitly presents atomic structure as the foundation for understanding properties, behavior, and applications."
        },
        {
          id: "m02-d02",
          type: "mcq",
          prompt: "What does atomic number represent in the lecture?",
          choices: ["Number of neutrons", "Number of protons in the nucleus", "Mass of electrons", "Number of bonds"],
          answer: 1,
          hint: "Atomic number identifies the element.",
          explanation: "Atomic number equals the number of protons in the nucleus."
        },
        {
          id: "m02-d03",
          type: "mcq",
          prompt: "What happens to valence-electron energy levels as many atoms become bonded in a solid?",
          choices: ["They disappear", "They split into many closely spaced levels that form bands", "They all become identical to the nucleus energy", "They stop affecting properties"],
          answer: 1,
          hint: "Use the progression shown on slide 18.",
          explanation: "The lecture's band-structure diagram shows individual energy levels splitting and broadening into bands as the number of bonded atoms increases."
        },
        {
          id: "m02-d04",
          type: "mcq",
          prompt: "Pauli's Exclusion Principle says that:",
          choices: ["every atom must have four valence electrons", "no two electrons in an atom can have the same four quantum numbers", "electrons always fill shells in strict numerical order", "all bonds are directional"],
          answer: 1,
          hint: "It restricts electron quantum-number combinations.",
          explanation: "That is the statement of Pauli's Exclusion Principle given in the lecture."
        },
        {
          id: "m02-d05",
          type: "mcq",
          prompt: "Which bond type is classified as secondary and weaker in the lecture?",
          choices: ["Metallic", "Covalent", "Ionic", "Van der Waals"],
          answer: 3,
          hint: "The first three listed on slide 22 are primary bonds.",
          explanation: "Van der Waals bonding is described as the weaker secondary bond."
        },
        {
          id: "m02-d06",
          type: "mcq",
          prompt: "Why does the lecture connect metallic bonding with good ductility?",
          choices: ["Metallic bonds are non-directional", "Metal atoms have no electrons", "Metallic bonds are always weak", "Metals are amorphous"],
          answer: 0,
          hint: "Look for the bond-direction statement on slide 23.",
          explanation: "The lecture attributes good ductility to the non-directional nature of metallic bonding."
        },
        {
          id: "m02-d07",
          type: "mcq",
          prompt: "Which pairing is correct?",
          choices: ["Covalent: electron transfer; Ionic: shared electrons", "Covalent: directional bonding; Ionic: cations and anions after electron transfer", "Metallic: locked valence electrons; Covalent: free electron sea", "Van der Waals: strongest primary bond"],
          answer: 1,
          hint: "Separate shared/directional covalent bonding from transferred-electron ionic bonding.",
          explanation: "Covalent bonding is directional; ionic bonding involves electron transfer and attraction between cations and anions."
        },
        {
          id: "m02-d08",
          type: "mcq",
          prompt: "According to the lecture, high binding energy is associated with:",
          choices: ["low strength and low melting point", "high strength and high melting point", "high ductility only", "low atomic number"],
          answer: 1,
          hint: "Binding energy measures how much energy is associated with breaking/creating bonds.",
          explanation: "The lecture explicitly connects high binding energy with high strengths and melting points."
        },
        {
          id: "m02-d09",
          type: "mcq",
          prompt: "Why can graphite conduct electricity according to the lecture?",
          choices: ["All four electrons are locked in covalent bonds", "The fourth electron is not covalently bonded in-plane and is available for conduction", "Graphite is ionic", "Its layers contain metal atoms"],
          answer: 1,
          hint: "Compare the three in-plane covalent bonds with the remaining electron.",
          explanation: "The lecture states that the fourth electron is available to conduct electricity."
        },
        {
          id: "m02-d10",
          type: "mcq",
          prompt: "Diamond and graphite are used in the lecture to demonstrate that:",
          choices: ["materials with the same element must have the same properties", "structure can produce dramatically different properties even at the same composition", "all carbon is electrically insulating", "bonding has no effect on properties"],
          answer: 1,
          hint: "The opening carbon-allotrope slide highlights 'same element' and 'structure.'",
          explanation: "They have the same elemental composition but different structures and therefore very different properties."
        }
      ],
      testQuestions: [
        {
          id: "m02-t01",
          type: "mcq",
          prompt: "Which is one of the five structure levels listed in the lecture?",
          choices: ["Microstructure", "Brand structure", "Cost structure", "Supply structure"],
          answer: 0,
          explanation: "The lecture lists atomic structure, short/long-range arrangements, nanostructure, microstructure, and macrostructure."
        },
        {
          id: "m02-t02",
          type: "mcq",
          prompt: "Electrons and protons are held together primarily by:",
          choices: ["electrostatic attraction", "gravity", "Van der Waals bonding between nuclei", "thermal expansion"],
          answer: 0,
          explanation: "The lecture attributes their attraction to opposite electrical charges."
        },
        {
          id: "m02-t03",
          type: "mcq",
          prompt: "Valence is best described here as:",
          choices: ["the number of electrons participating in bonding or chemical reactions", "the total number of neutrons", "the atomic mass only", "the number of crystal grains"],
          answer: 0,
          explanation: "That is the lecture definition of valence."
        },
        {
          id: "m02-t04",
          type: "mcq",
          prompt: "Which three bond types are identified as primary bonds?",
          choices: ["Metallic, covalent, ionic", "Covalent, ionic, Van der Waals", "Metallic, Van der Waals, magnetic", "Ionic, hydrogen, optical"],
          answer: 0,
          explanation: "Metallic, covalent, and ionic are the three primary bonds listed on slide 22."
        },
        {
          id: "m02-t05",
          type: "mcq",
          prompt: "A key property consequence of covalent bonding in the lecture is:",
          choices: ["high ductility from non-directional bonds", "low electrical conductivity because valence electrons are locked", "metallic conduction from free electrons", "formation only between cations and anions"],
          answer: 1,
          explanation: "The lecture links locked valence electrons to low conductivity in covalently bonded materials."
        },
        {
          id: "m02-t06",
          type: "mcq",
          prompt: "An ionic bond forms after:",
          choices: ["electron transfer creates cations and anions", "all electrons become free", "atoms lose their nuclei", "two metals become amorphous"],
          answer: 0,
          explanation: "The lecture describes electron transfer followed by attraction between positive cations and negative anions."
        },
        {
          id: "m02-t07",
          type: "mcq",
          prompt: "At equilibrium interatomic spacing:",
          choices: ["attractive and repulsive effects balance", "there is no bonding energy", "atoms must be infinitely far apart", "all electrons are transferred"],
          answer: 0,
          explanation: "The source energy/force diagram marks equilibrium where the competing attractive and repulsive effects balance."
        },
        {
          id: "m02-t08",
          type: "mcq",
          prompt: "Which carbon allotrope is described as having four covalent bonds per carbon atom?",
          choices: ["Diamond", "Graphite", "Both with identical bonding", "Neither"],
          answer: 0,
          explanation: "The lecture states that diamond has four covalent bonds per carbon atom."
        },
        {
          id: "m02-t09",
          type: "mcq",
          prompt: "The lecture gives graphite layer spacing as approximately:",
          choices: ["2.5 times the in-plane carbon spacing", "half the in-plane spacing", "equal to the in-plane spacing", "25 times the in-plane spacing"],
          answer: 0,
          explanation: "Slide 30 states that the spacing between graphite layers is 2.5 times larger than the spacing between carbon atoms in the plane."
        },
        {
          id: "m02-t10",
          type: "mcq",
          prompt: "Which statement about diamond is consistent with the lecture?",
          choices: ["It is an electrical insulator with very high stiffness", "It is soft and highly ductile", "It contains three covalent bonds per carbon and weak layers", "It is a metal"],
          answer: 0,
          explanation: "The lecture describes diamond as an electrical insulator with very high strength, hardness, stiffness, and melting point."
        }
      ]
    },
    {
      id: "m03", number: 3, title: "Atomic and Ionic Arrangements", subtitle: "Week 3", description: "Reserved for the professor's next source material.", available: false, status: "empty", sourceLabel: "AWAITING LECTURE SOURCE", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m04", number: 4, title: "Imperfections in Atomic and Ionic Arrangements", subtitle: "Week 4", description: "Reserved for the professor's source material.", available: false, status: "empty", sourceLabel: "AWAITING LECTURE SOURCE", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m05", number: 5, title: "Mechanical Properties: Part One", subtitle: "Week 5 · HW #1", description: "Reserved for the professor's source material.", available: false, status: "empty", sourceLabel: "AWAITING LECTURE SOURCE", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m06", number: 6, title: "Strain Hardening and Annealing", subtitle: "Week 6", description: "Reserved for the professor's source material.", available: false, status: "empty", sourceLabel: "AWAITING LECTURE SOURCE", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m07", number: 7, title: "Recap", subtitle: "Week 7", description: "Reserved for recap material after Weeks 1–6 are loaded.", available: false, status: "empty", sourceLabel: "RECAP SLOT", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m08", number: 8, title: "Midterm I", subtitle: "Week 8 · 27 Oct 2026", description: "Assessment week from the course introduction.", available: false, status: "empty", sourceLabel: "MIDTERM · 2026-10-27", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m09", number: 9, title: "Solid Solutions and Phase Equilibrium", subtitle: "Week 9", description: "Reserved for the professor's source material.", available: false, status: "empty", sourceLabel: "AWAITING LECTURE SOURCE", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m10", number: 10, title: "Dispersion Strengthening and Eutectic Phase Diagrams", subtitle: "Week 10", description: "Reserved for the professor's source material.", available: false, status: "empty", sourceLabel: "AWAITING LECTURE SOURCE", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m11", number: 11, title: "Electronic Materials", subtitle: "Week 11", description: "Reserved for the professor's source material.", available: false, status: "empty", sourceLabel: "AWAITING LECTURE SOURCE", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m12", number: 12, title: "Magnetic Materials", subtitle: "Week 12", description: "Reserved for the professor's source material.", available: false, status: "empty", sourceLabel: "AWAITING LECTURE SOURCE", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m13", number: 13, title: "Photonic Materials", subtitle: "Week 13 · HW #2", description: "Reserved for the professor's source material.", available: false, status: "empty", sourceLabel: "AWAITING LECTURE SOURCE", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m14", number: 14, title: "Thermal Properties of Materials", subtitle: "Week 14", description: "Reserved for the professor's source material.", available: false, status: "empty", sourceLabel: "AWAITING LECTURE SOURCE", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m15", number: 15, title: "Recap", subtitle: "Week 15", description: "Reserved for final-exam recap once the course sources are loaded.", available: false, status: "empty", sourceLabel: "RECAP SLOT", sections: [], drills: [], testQuestions: []
    },
    {
      id: "m16", number: 16, title: "Final Exam", subtitle: "Week 16 · 22 Dec 2026", description: "Assessment week from the course introduction.", available: false, status: "empty", sourceLabel: "FINAL · 2026-12-22", sections: [], drills: [], testQuestions: []
    }
  ],
  reference: [
    { id: "ref-001", term: "Materials science and engineering (MSE)", definition: "An interdisciplinary field concerned with inventing new materials/devices and improving existing materials through microstructure–composition–synthesis–processing relationships.", detail: "Lecture 01, slide 6.", tags: ["week 1", "definition", "MSE"] },
    { id: "ref-002", term: "Composition", definition: "Chemical make-up of a material.", detail: "Lecture wording.", tags: ["week 1", "definition"] },
    { id: "ref-003", term: "Structure", definition: "Arrangement of atoms viewed at different levels of detail.", detail: "The lecture later separates atomic structure, atomic arrangements, nanostructure, microstructure, and macrostructure.", tags: ["week 1", "week 2", "definition"] },
    { id: "ref-004", term: "Synthesis", definition: "How materials are made.", detail: "Lecture wording.", tags: ["week 1", "definition"] },
    { id: "ref-005", term: "Processing", definition: "How materials are shaped into useful components.", detail: "Lecture wording.", tags: ["week 1", "definition"] },
    { id: "ref-006", term: "Amorphous", definition: "Lacking long-range atomic arrangement.", detail: "Contrasted with crystalline periodic geometrical arrangement.", tags: ["week 1", "structure"] },
    { id: "ref-007", term: "Crystalline", definition: "Having periodic geometrical arrangements of atoms or ions.", detail: "Lecture objective, slide 7.", tags: ["week 1", "structure"] },
    { id: "ref-008", term: "Atomic number", definition: "Number of protons in the nucleus.", detail: "Lecture 01, slide 17.", tags: ["week 2", "atom"] },
    { id: "ref-009", term: "Atomic mass", definition: "Mass associated with the protons and neutrons in the atom.", detail: "Lecture 01, slide 17.", tags: ["week 2", "atom"] },
    { id: "ref-010", term: "Valence", definition: "Number of electrons in an atom that participate in bonding or chemical reactions.", detail: "Usually associated with outer s and p electrons; the lecture notes that environment can affect valence.", tags: ["week 2", "electron", "bonding"] },
    { id: "ref-011", term: "Primary bonds", definition: "Metallic, covalent, and ionic bonds.", detail: "The lecture classifies these as comparatively strong bonds.", tags: ["week 2", "bonding"] },
    { id: "ref-012", term: "Van der Waals bond", definition: "A weaker secondary bonding mechanism.", detail: "It is the fourth bond category listed in the lecture.", tags: ["week 2", "bonding"] },
    { id: "ref-013", term: "Binding energy", definition: "Energy associated with creating or destroying bonds.", detail: "The lecture links high binding energy with high strength and melting point.", tags: ["week 2", "bonding", "energy"] },
    { id: "ref-014", term: "Coefficient of thermal expansion (CTE)", definition: "A property that the lecture connects to the nature of bonding in the material.", detail: "Introduced on slide 27; detailed treatment comes later in the course.", tags: ["week 2", "thermal", "bonding"] },
    { id: "ref-015", term: "Allotrope", definition: "A different structural form of the same element.", detail: "The lecture uses diamond and graphite to show that the same element can display dramatically different properties because of structure.", tags: ["week 2", "carbon", "structure"] },
    { id: "ref-016", term: "Diamond", definition: "Carbon allotrope with four covalent bonds per carbon atom.", detail: "Lecture: high thermal conductivity, electrical insulation, very high strength/hardness/stiffness, and high melting point.", tags: ["week 2", "carbon", "covalent"] },
    { id: "ref-017", term: "Graphite", definition: "Layered carbon allotrope with three covalent bonds per carbon atom within the plane and much weaker bonding between layers.", detail: "Lecture: electrically conducting; layer spacing is about 2.5× the in-plane carbon spacing.", tags: ["week 2", "carbon", "layered"] }
  ]
};