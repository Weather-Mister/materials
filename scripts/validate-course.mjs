import fs from "node:fs";
import vm from "node:vm";

const root = process.cwd();
const read = (p) => fs.readFileSync(root + "/" + p, "utf8");
const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(read("public/course.js"), sandbox, { filename: "course.js" });
vm.runInContext(read("public/course-weeks-3-4.js"), sandbox, { filename: "course-weeks-3-4.js" });
vm.runInContext(read("public/source-overhaul.js"), sandbox, { filename: "source-overhaul.js" });

const course = sandbox.window.MATERIALS_COURSE;
assert(course && Array.isArray(course.modules), "Course did not load");
assert(Array.isArray(course.reference), "Reference library missing");

const loaded = course.modules.filter((m) => m.available);

const explanatoryText = (html) =>
  Array.from(String(html || "").matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi))
    .map((m) => m[2].replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim())
    .join(" ")
    .trim();

assert(loaded.length === 4, "Expected 4 loaded modules, found " + loaded.length);
assert(loaded.map((m) => m.number).join(",") === "1,2,3,4", "Loaded module sequence must be Weeks 1–4");

const ids = new Set();
const claimId = (id, context) => {
  assert(id && typeof id === "string", "Missing id: " + context);
  assert(!ids.has(id), "Duplicate id " + id + " at " + context);
  ids.add(id);
};

for (const module of course.modules) claimId(module.id, "module");
for (const ref of course.reference) claimId(ref.id, "reference");

for (const module of loaded) {
  assert(module.status === "loaded", module.id + ": status must be loaded");
  assert(module.sections && module.sections.length >= 5, module.id + ": too few teaching sections");
  assert(module.drills && module.drills.length >= 5, module.id + ": too few drills");
  assert(module.testQuestions && module.testQuestions.length >= 5, module.id + ": too few test questions");
  assert(module.sourceLabel, module.id + ": source label missing");

  for (const section of module.sections) {
    assert(section.title && section.html, module.id + ": malformed section");

    // Weeks 3+ use tables/formulas heavily. A source item is not considered "taught"
    // merely because its values appear in a table or formula card: require explanatory
    // prose around data-heavy displays. This also becomes the default guard for future
    // loaded modules (Weeks 5+).
    const dataHeavy = /(compareTable|formulaCard|workedBlock|sourceGrid)/.test(section.html);
    if (module.number >= 3) {
      const prose = explanatoryText(section.html);
      assert(
        prose.length >= 180,
        module.id + " " + (section.eyebrow || section.title) + ": teaching section is too compressed (" + prose.length + " explanatory chars); add mechanism/distinction prose" + (dataHeavy ? " around the table/formula" : "")
      );
      assert(
        typeof section.callout === "string" && section.callout.trim().length >= 24,
        module.id + " " + (section.eyebrow || section.title) + ": missing learner-facing distinction/callout"
      );
    }

    const assetMatches = Array.from(section.html.matchAll(/src=['"]\.\/assets\/([^?'"]+)/g));
    for (const match of assetMatches) {
      const asset = match[1];
      assert(fs.existsSync(root + "/public/assets/" + asset), module.id + ": missing asset " + asset);
    }
  }

  for (const pair of [["drill", module.drills], ["test", module.testQuestions]]) {
    const kind = pair[0];
    const bank = pair[1];
    for (const q of bank) {
      claimId(q.id, module.id + " " + kind);
      assert(q.type === "mcq", q.id + ": unsupported question type " + q.type);
      assert(typeof q.prompt === "string" && q.prompt.length >= 8, q.id + ": prompt too short");
      assert(Array.isArray(q.choices) && q.choices.length === 4, q.id + ": expected four choices");
      assert(new Set(q.choices).size === q.choices.length, q.id + ": duplicate choices");
      assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length, q.id + ": invalid answer index");
      assert(typeof q.explanation === "string" && q.explanation.length >= 8, q.id + ": explanation missing");
      if (kind === "drill") assert(typeof q.hint === "string" && q.hint.length >= 4, q.id + ": drill hint missing");
    }
  }

  const tag = "week " + module.number;
  const refs = course.reference.filter((r) => (r.tags || []).some((t) => String(t).toLowerCase() === tag));
  assert(refs.length >= 4, module.id + ": insufficient tagged reference coverage");
}

const requiredCoverage = {
  m01: ["microstructure","amorphous","crystalline","material classes","temperature","electron spin","orbital motion","electromagnetic head","refraction","reflection","absorption","transmission","index of refraction"],
  m02: ["pauli","aufbau","metallic","covalent","ionic","binding energy","diamond","graphite"],
  m03: ["lattice","basis","seven crystal systems","14 bravais","no regular order","short-range order","long-range order","0.866a²c","cos²α+cos²β+cos²γ=1","cscl","nacl","zinc blende","zns","packing factor","theoretical density","miller","right-handed coordinate","family of directions","⟨uvw⟩","miller–bravais","3-axis","4-axis","interplanar","interstitial","x-ray diffraction","tem"],
  m04: ["vacancy","frenkel","schottky","dislocation","burgers vector","peierls","slip system","schmid","crss","hall","incomplete bonding","reactive","surface-imperfection","strain hardening","annealing","solid-solution","grain-size"]
};

for (const entry of Object.entries(requiredCoverage)) {
  const id = entry[0];
  const terms = entry[1];
  const module = loaded.find((m) => m.id === id);
  const text = JSON.stringify(module).toLowerCase();
  for (const term of terms) assert(text.includes(term), id + ": source-coverage term missing: " + term);
}

const sectionByEyebrow = (moduleId, eyebrow) => {
  const module = loaded.find((m) => m.id === moduleId);
  const section = module?.sections?.find((x) => x.eyebrow === eyebrow);
  assert(section, moduleId + ": missing teaching section " + eyebrow);
  return String(section.html)
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Regression guards for "mentioned but not actually explained" failures.
const depthEvidence = [
  ["m03", "SEVEN CRYSTAL SYSTEMS", ["six lattice parameters", "centering"]],
  ["m03", "UNIT-CELL VOLUME", ["not", "occupied by atoms", "sin120"]],
  ["m03", "COORDINATION NUMBER", ["nearest-neighbor", "not the same thing as atoms per unit cell"]],
  ["m03", "PACKING FACTOR", ["occupied", "not mass density"]],
  ["m03", "INTERSTITIAL SIZE RULE", ["radius ratio", "nearest-neighbor count"]],
  ["m03", "IONIC CRYSTAL EXAMPLES", ["not equivalent bcc", "coordination number"]],
  ["m03", "PLANES + DISTANCE", ["do not reduce", "parallel but not identical"]],
  ["m03", "DENSITY + STACKING", ["linear packing fraction", "{0001}", "abab", "abcabc"]],
  ["m04", "VACANCY + SOLUTE DEFECTS", ["vacancy-formation energy", "equilibrium vacancy population rises"]],
  ["m04", "GRAIN BOUNDARIES", ["average grain diameter", "dislocation motion"]],
  ["m04", "IONIC DEFECT RULES", ["three balances", "electrically neutral"]],
  ["m04", "SOURCE SLIP TABLE", ["slip system = slip plane + slip direction", "bonding also matters"]],
  ["m04", "SCHMID'S LAW", ["geometric projection", "slip-plane normal"]],
  ["m04", "HALL–PETCH EXAMPLE", ["two known strength", "solve backward"]],
  ["m04", "OTHER SURFACE DEFECTS", ["physically different", "astm grain-size number"]]
];
for (const [moduleId, eyebrow, evidence] of depthEvidence) {
  const html = sectionByEyebrow(moduleId, eyebrow);
  for (const phrase of evidence) {
    assert(html.includes(phrase), moduleId + " " + eyebrow + ": instructional-depth evidence missing: " + phrase);
  }
}

const meta = course.courseMeta || {};
assert(meta.instructor && meta.email, "Course instructor metadata missing");
assert(meta.midtermDate === "2026-10-27", "Midterm date drift");
assert(meta.finalDate === "2026-12-22", "Final date drift");
const gradingTotal = (meta.grading || []).reduce((n, g) => n + (Number.parseFloat(String(g.value || "0")) || 0), 0);
assert(gradingTotal === 103, "Source grading total should remain 103 as printed; found " + gradingTotal);
assert(String(meta.sourceNote || "").includes("103"), "103% source note missing");
assert(Array.isArray(meta.textbooks) && meta.textbooks.length >= 2, "Course textbook metadata missing");

const index = read("public/index.html");
const coursePos = index.indexOf("./course.js");
const patchPos = index.indexOf("./course-weeks-3-4.js");
const overhaulPos = index.indexOf("./source-overhaul.js");
const appPos = index.indexOf("./app.js");
assert(coursePos >= 0 && patchPos > coursePos && overhaulPos > patchPos && appPos > overhaulPos, "Course scripts are not loaded in the required order");

const htmlIds = Array.from(index.matchAll(/id="([^"]+)"/g)).map((m) => m[1]);
assert(new Set(htmlIds).size === htmlIds.length, "Duplicate static HTML ids detected");
assert(index.includes('role="dialog"') && index.includes('aria-modal="true"'), "Cloud dialog accessibility semantics missing");
assert(index.includes("Shared-key sync:"), "Cloud privacy warning missing");
assert(index.includes('data-tab="problem"'), "Problem Lab tab missing");
assert(index.includes('id="problemView"') && index.includes('id="problemLabHost"'), "Problem Lab view missing");
assert(index.includes("./problem-lab.js?v=1"), "Problem Lab script missing");
const problemLab = read("public/problem-lab.js");
assert(problemLab.includes("millerFromIntercepts") && problemLab.includes("ρ → a₀"), "Problem Lab calculation engine incomplete");

const app = read("public/app.js");
for (const marker of [
  "function orderedChoiceEntries",
  "function moduleTestQuestions",
  "function renderFlashcards",
  "function renderMatching",
  "function renderExamPractice",
  "function mergeStates"
]) assert(app.includes(marker), "App audit marker missing: " + marker);

assert(app.includes("matchRound"), "Matching-set rotation missing");
assert(app.includes("testHistoryAudit"), "Test-history rendering missing");
assert(app.includes('data-choice="${entry.index}"'), "Shuffled-choice buttons must preserve original answer indices");
assert(app.includes("currentTest.answers[q.id] === q.answer"), "Test scoring must compare original answer indices");
assert(app.includes('<details class="examReveal">'), "Exam-practice answers must stay hidden until reveal");

assert(index.includes("./course.js?v=9"), "Course cache-bust version is stale");
assert(index.includes("./course-weeks-3-4.js?v=10"), "Weeks 3–4 cache-bust version is stale");
assert(index.includes("./source-overhaul.js?v=3"), "Source-overhaul cache-bust version is stale");
assert(index.includes("./course-content.css?v=9"), "Course-content CSS cache-bust version is stale");

const questionById = (id) => loaded.flatMap((m) => [...(m.drills || []), ...(m.testQuestions || [])]).find((q) => q.id === id);
const answerText = (id) => {
  const q = questionById(id);
  assert(q, "Missing QA question " + id);
  return q.choices[q.answer];
};
assert(answerText("m03-d16") === "0.200 nm", "m03-d16 numeric answer drift");
assert(answerText("m03-t13") === "0.208 nm", "m03-t13 numeric answer drift");
assert(answerText("m04-d19") === "35.4 MPa", "m04-d19 Schmid answer drift");
assert(answerText("m04-d20") === "100 MPa", "m04-d20 Hall–Petch answer drift");
assert(answerText("m04-t17") === "70.7 MPa", "m04-t17 Schmid answer drift");
assert(answerText("m04-t18") === "160 MPa", "m04-t18 Hall–Petch answer drift");

const expectedSchmid1 = 100 * Math.cos(Math.PI / 3) * Math.cos(Math.PI / 4);
const expectedHall1 = 50 + 10 / Math.sqrt(0.040);
const expectedSchmid2 = 200 * Math.cos(Math.PI / 4) * Math.cos(Math.PI / 3);
const expectedHall2 = 40 + 12 / Math.sqrt(0.010);
assert(Math.abs(expectedSchmid1 - 35.3553390593) < 1e-9, "Schmid drill independent calculation failed");
assert(Math.abs(expectedHall1 - 100) < 1e-9, "Hall–Petch drill independent calculation failed");
assert(Math.abs(expectedSchmid2 - 70.7106781187) < 1e-9, "Schmid test independent calculation failed");
assert(Math.abs(expectedHall2 - 160) < 1e-9, "Hall–Petch test independent calculation failed");

const styles = read("public/styles.css");
const contentStyles = read("public/course-content.css");
assert(styles.includes("@media(max-width:560px)") && styles.includes(".problemFields,.problemFields.three,.problemFields.five{grid-template-columns:1fr}"), "Problem Lab mobile collapse guard missing");
assert(contentStyles.includes(".compareTable.cols4") && contentStyles.includes("overflow-x:auto"), "Wide source-table mobile overflow guard missing");

const m3Exam = loaded.find((m) => m.id === "m03")?.examPractice;
assert(m3Exam && Array.isArray(m3Exam.parts) && m3Exam.parts.length === 4, "Week 3 four-part exam practice missing");
assert(m3Exam.parts.some((p) => /calculation/i.test(p.title || "") && (p.questions || []).length >= 6), "Week 3 calculation practice is too shallow");
assert(m3Exam.parts.reduce((n,p) => n + (p.questions || []).length, 0) >= 21, "Week 3 exam bank is too small");
const sourceOverhaul = read("public/source-overhaul.js");
assert(sourceOverhaul.includes("do not reduce to lowest integers afterward"), "Professor Miller-plane rule drifted");
assert(!/replacementPairs\s*=\s*\[[\s\S]{0,4000}https?:\/\//.test(sourceOverhaul), "Course visuals must not hotlink third-party images");

const NA = 6.022e23;
const kAcm = Math.cbrt((2 * 39.09) / (0.855 * NA));
const kAnm = kAcm * 1e7;
const kRnm = Math.sqrt(3) * kAnm / 4;
assert(Math.abs(kAnm - 0.5334940745) < 1e-9, "Inverse-density lattice calculation drift");
assert(Math.abs(kRnm - 0.2310097106) < 1e-9, "BCC radius calculation drift");
const niPd = 2 / (0.35167 ** 2);
assert(Math.abs(niPd - 16.1718369063) < 1e-9, "FCC (100) planar-density calculation drift");
const al111 = 0.4049 / Math.sqrt(3);
const al220 = 0.4049 / Math.sqrt(8);
assert(Math.abs(al111 - 0.2337691240) < 1e-9 && Math.abs(al220 - 0.1431537679) < 1e-9, "Cubic interplanar-spacing calculation drift");

const requiredCourseGraphics = [
  "book-fig-1-3-strength-ranges.webp",
  "book-fig-1-6-temperature-strength.webp",
  "book-fig-2-22-graphite.webp",
  "book-fig-3-9-crystal-cells.webp",
  "book-fig-3-13-miller-directions.webp",
  "book-fig-4-1-point-defects.webp",
  "book-fig-4-4-5-dislocations.webp",
  "book-fig-4-10-schmid-law.webp",
  "book-fig-4-13-grain-strength.webp"
];
const retiredGeneratedGraphics = [
  "crystal-cells.svg","dislocation-slip.svg","grain-boundaries.svg","graphite-layers.svg",
  "ionic-defect-pairs.svg","miller-indices.svg","point-defects.svg","schmid-law.svg",
  "strength-ranges.svg","temperature-strength.svg"
];
const renderedCourse = JSON.stringify(loaded);
for (const name of requiredCourseGraphics) {
  assert(renderedCourse.includes(name), "Source course figure not referenced: " + name);
  assert(fs.existsSync(root + "/public/assets/" + name), "Source course figure missing: " + name);
}
for (const name of retiredGeneratedGraphics) {
  assert(!renderedCourse.includes(name), "Retired generated graphic still referenced: " + name);
  assert(!fs.existsSync(root + "/public/assets/" + name), "Retired generated graphic still present: " + name);
}

const publicB64 = fs.readdirSync(root + "/public/assets").filter((name) => name.endsWith(".b64"));
assert(publicB64.length === 0, "Redundant .b64 files leaked into public assets: " + publicB64.join(", "));

for (const module of loaded) {
  for (const section of module.sections) {
    const tables = Array.from(section.html.matchAll(/<div class='compareTable([^']*)'><div class='compareHead'>(.*?)<\/div>/g));
    for (const match of tables) {
      const classSuffix = match[1] || "";
      const headerCells = (match[2].match(/<span>/g) || []).length;
      if (headerCells > 2) {
        assert(classSuffix.includes("cols" + headerCells), module.id + ": " + headerCells + "-column table missing responsive cols" + headerCells + " class");
      }
    }
  }
}

console.log(JSON.stringify({
  status: "PASS",
  loadedModules: loaded.map((m) => ({
    id: m.id,
    sections: m.sections.length,
    drills: m.drills.length,
    tests: m.testQuestions.length
  })),
  referenceItems: course.reference.length,
  gradingTotal
}, null, 2));
