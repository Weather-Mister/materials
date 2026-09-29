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

const course = sandbox.window.MATERIALS_COURSE;
assert(course && Array.isArray(course.modules), "Course did not load");
assert(Array.isArray(course.reference), "Reference library missing");

const loaded = course.modules.filter((m) => m.available);
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
  m01: ["microstructure","amorphous","crystalline","material classes","temperature"],
  m02: ["pauli","aufbau","metallic","covalent","ionic","binding energy","diamond","graphite"],
  m03: ["lattice","basis","seven crystal systems","cscl","packing factor","theoretical density","miller","interplanar","interstitial","x-ray diffraction","tem"],
  m04: ["vacancy","frenkel","schottky","dislocation","peierls","slip system","schmid","crss","hall","strain hardening","annealing","solid-solution","grain-size"]
};

for (const entry of Object.entries(requiredCoverage)) {
  const id = entry[0];
  const terms = entry[1];
  const module = loaded.find((m) => m.id === id);
  const text = JSON.stringify(module).toLowerCase();
  for (const term of terms) assert(text.includes(term), id + ": source-coverage term missing: " + term);
}

const meta = course.courseMeta || {};
assert(meta.instructor && meta.email, "Course instructor metadata missing");
assert(meta.midtermDate === "2026-10-27", "Midterm date drift");
assert(meta.finalDate === "2026-12-22", "Final date drift");
const gradingTotal = (meta.grading || []).reduce((n, g) => n + Number(g.value || 0), 0);
assert(gradingTotal === 103, "Source grading total should remain 103 as printed; found " + gradingTotal);
assert(String(meta.sourceNote || "").includes("103"), "103% source note missing");

const index = read("public/index.html");
const coursePos = index.indexOf("./course.js");
const patchPos = index.indexOf("./course-weeks-3-4.js");
const appPos = index.indexOf("./app.js");
assert(coursePos >= 0 && patchPos > coursePos && appPos > patchPos, "Course scripts are not loaded in the required order");

const app = read("public/app.js");
for (const marker of [
  "function orderedChoiceEntries",
  "function moduleTestQuestions",
  "function renderFlashcards",
  "function renderMatching",
  "function mergeStates"
]) assert(app.includes(marker), "App audit marker missing: " + marker);

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
