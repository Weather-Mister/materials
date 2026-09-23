window.MATERIALS_COURSE = {
  version: 1,
  title: "Engineering Materials",
  subtitle: "Teaching + testing workspace",
  modules: Array.from({ length: 10 }, (_, index) => ({
    id: `m${String(index + 1).padStart(2, "0")}`,
    number: index + 1,
    title: "Awaiting source material",
    subtitle: "Reserved curriculum slot",
    description: "No course content has been loaded into this module yet.",
    available: false,
    status: "empty",
    sourceLabel: "SOURCE SLOT EMPTY",
    sections: [],
    drills: [],
    testQuestions: []
  })),
  reference: []
};

/*
CONTENT CONTRACT — add course material here later without changing app.js.

Module:
{
  id: "m01",
  number: 1,
  title: "…",
  subtitle: "…",
  description: "…",
  available: true,
  status: "loaded",
  sourceLabel: "Lecture 01 · pages …",
  sections: [
    {
      eyebrow: "CONCEPT",
      title: "…",
      html: "<p>Teaching content…</p>",
      callout: "Optional concise takeaway"
    }
  ],
  drills: [
    {
      id: "m01-d01",
      type: "mcq", // mcq | numeric | short
      prompt: "…",
      choices: ["…","…","…","…"],
      answer: 1,
      explanation: "…",
      hint: "…"
    }
  ],
  testQuestions: [
    {
      id: "m01-t01",
      type: "mcq",
      prompt: "…",
      choices: ["…","…","…","…"],
      answer: 2,
      explanation: "…"
    }
  ]
}

Reference item:
{
  id: "ref-001",
  term: "…",
  definition: "…",
  detail: "…",
  tags: ["unit", "formula"]
}
*/
