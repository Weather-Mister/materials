(() => {
  "use strict";

  const SUPABASE_URL = "https://evckshjtzikuusnkdnjn.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Wbt6j8h6LXjm_hQ7hyQEzg_5t7eWHfL";
  const USERNAME_KEY = "engineeringMaterialsCloudUsername";
  const PROFILE_PREFIX = "engineeringMaterialsProfileState:";
  const META_PREFIX = "engineeringMaterialsCloudMeta:";
  const ANON_KEY = "engineeringMaterialsAnonymousState";
  const NOTES_OPEN_KEY = "engineeringMaterialsNotesOpen";
  const course = window.MATERIALS_COURSE || { modules: [], reference: [] };

  const $ = (id) => document.getElementById(id);
  const qa = (sel, root = document) => [...root.querySelectorAll(sel)];
  const now = () => Date.now();
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : "id-" + now() + "-" + Math.random().toString(16).slice(2));
  const normalizeUsername = (v) => String(v || "").trim().toLowerCase();
  const validUsername = (v) => /^[a-z0-9_]{2,32}$/.test(v);
  const escapeHtml = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));

  function defaultState() {
    return {
      version: 1,
      currentModule: course.modules?.[0]?.id || null,
      tab: "learn",
      completed: {},
      drillAnswers: {},
      testHistory: [],
      notes: [],
      activeNoteId: null,
      _savedAt: now()
    };
  }

  function normalizeState(input) {
    const base = defaultState();
    const s = input && typeof input === "object" ? { ...base, ...input } : base;
    if (!course.modules.some((m) => m.id === s.currentModule)) s.currentModule = course.modules?.[0]?.id || null;
    if (!["learn","flashcards","matching","drill","test","reference"].includes(s.tab)) s.tab = "learn";
    if (!s.completed || typeof s.completed !== "object") s.completed = {};
    if (!s.drillAnswers || typeof s.drillAnswers !== "object") s.drillAnswers = {};
    if (!Array.isArray(s.testHistory)) s.testHistory = [];
    if (!Array.isArray(s.notes)) s.notes = [];
    s.notes = s.notes.map((n) => ({
      id: String(n.id || uid()),
      title: String(n.title || "Untitled note"),
      body: String(n.body || ""),
      updatedAt: Number(n.updatedAt) || 0
    }));
    if (s.activeNoteId && !s.notes.some((n) => n.id === s.activeNoteId)) s.activeNoteId = s.notes[0]?.id || null;
    s.version = 1;
    s._savedAt = Number(s._savedAt) || 0;
    return s;
  }

  function loadJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (_) { return null; }
  }
  function saveJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }
  const profileKey = (username) => PROFILE_PREFIX + username;
  const metaKey = (username) => META_PREFIX + username;

  let cloudUsername = normalizeUsername(localStorage.getItem(USERNAME_KEY) || "");
  let state = normalizeState(cloudUsername ? loadJson(profileKey(cloudUsername)) : loadJson(ANON_KEY));
  let cloudReady = false;
  let cloudLoading = false;
  let cloudRevision = 0;
  let cloudBaseState = null;
  let cloudDirty = false;
  let cloudTimer = null;
  let cloudSavePromise = null;
  let toastTimer = null;
  let currentTest = null;

  function currentModule() {
    return course.modules.find((m) => m.id === state.currentModule) || course.modules[0] || null;
  }

  function persistentSnapshot(value = state) {
    return normalizeState(clone(value));
  }

  function touch() { state._savedAt = now(); }

  function persist({ sync = true, rerender = false } = {}) {
    touch();
    const snap = persistentSnapshot();
    saveJson(cloudUsername ? profileKey(cloudUsername) : ANON_KEY, snap);
    if (sync && cloudUsername) scheduleCloudSave();
    if (rerender) render();
  }

  function loadedModules() { return course.modules.filter((m) => m.available); }
  function completedLoadedModules() { return loadedModules().filter((m) => state.completed[m.id]); }
  function progressPercent() {
    const loaded = loadedModules().length;
    return loaded ? Math.round((completedLoadedModules().length / loaded) * 100) : 0;
  }

  function showToast(message) {
    const el = $("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function setCloudIndicator(kind, text) {
    const dot = $("cloudDot");
    dot.className = "cloudDot" + (kind ? " " + kind : "");
    $("cloudProfileText").textContent = text;
    $("syncStatus").textContent = kind === "synced" ? "SYNCED" : kind === "saving" ? "SAVING" : kind === "offline" ? "OFFLINE" : "LOCAL";
  }

  function render() {
    renderProgress();
    renderModules();
    renderActiveModule();
    renderTabs();
    renderLearn();
    renderDrill();
    renderTest();
    renderReference();
    renderNotes();
    renderCloudUi();
  }

  function renderProgress() {
    const pct = progressPercent();
    $("progressPct").textContent = pct + "%";
    $("progressFill").style.width = pct + "%";
    $("moduleCount").textContent = loadedModules().length + " loaded";
  }

  function renderModules() {
    $("moduleList").innerHTML = course.modules.map((m) => {
      const classes = ["moduleItem", m.available ? "loaded" : "empty", m.id === state.currentModule ? "active" : "", state.completed[m.id] ? "done" : ""].filter(Boolean).join(" ");
      return `<button class="${classes}" data-module="${escapeHtml(m.id)}" type="button">
        <span class="moduleNo">${String(m.number).padStart(2,"0")}</span>
        <span class="moduleText"><b>${escapeHtml(m.title)}</b><small>${m.available ? escapeHtml(m.subtitle || "Loaded") : "Reserved curriculum slot"}</small></span>
        <i class="moduleState"></i>
      </button>`;
    }).join("");
    qa("[data-module]", $("moduleList")).forEach((btn) => btn.addEventListener("click", () => {
      state.currentModule = btn.dataset.module;
      currentTest = null;
      persist({ rerender: true });
      closeRail();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }));
  }

  function renderActiveModule() {
    const m = currentModule();
    if (!m) return;
    const code = "M" + String(m.number).padStart(2,"0");
    $("activeModuleCode").textContent = code;
    $("activeModuleTitle").textContent = m.title;
    $("activeModuleSubtitle").textContent = m.subtitle || m.description || "";
    $("activeModuleStatus").textContent = state.completed[m.id] ? "COMPLETE" : m.available ? "LOADED" : "EMPTY";
    $("heroModule").textContent = "MODULE " + String(m.number).padStart(2,"0");
    $("heroState").textContent = m.sourceLabel || (m.available ? "SOURCE LOADED" : "SOURCE SLOT EMPTY");
    $("heroTitle").textContent = m.available ? m.title : "Engineering Materials";
    $("heroDescription").textContent = m.available ? (m.description || m.subtitle || "") : "A source-driven learning and testing workspace. The interface is built; curriculum content will be loaded separately.";
    $("learnSourceLabel").textContent = m.sourceLabel || "SOURCE-LOCKED CONTENT";
  }

  function renderTabs() {
    qa(".modeTab").forEach((b) => b.classList.toggle("active", b.dataset.tab === state.tab));
    qa(".view").forEach((v) => v.classList.remove("active"));
    const view = $(state.tab + "View");
    if (view) view.classList.add("active");
  }

  function emptyMarkup(label, text) {
    return `<div class="emptyState"><div class="emptyStateInner">
      <div class="emptyGlyph"><span></span></div>
      <h2>${escapeHtml(label)}</h2>
      <p>${escapeHtml(text)}</p>
      <span class="emptyTag">CONTENT INTENTIONALLY EMPTY</span>
    </div></div>`;
  }

  function renderLearn() {
    const m = currentModule();
    if (!m?.available || !m.sections?.length) {
      $("learnHost").innerHTML = emptyMarkup("No teaching content loaded yet", "This module is a clean source slot. Once lecture slides, textbook sections, or notes are supplied, the teaching sequence will render here.");
    } else {
      $("learnHost").innerHTML = m.sections.map((s) => `<section class="lessonSection">
        <div class="lessonSectionHead"><span>${escapeHtml(s.eyebrow || "CONCEPT")}</span><h2>${escapeHtml(s.title || "")}</h2></div>
        <div class="lessonSectionBody">${s.html || ""}${s.callout ? `<div class="conceptCallout">${escapeHtml(s.callout)}</div>` : ""}</div>
      </section>`).join("");
    }
    $("completeBtn").disabled = !m?.available;
    $("completeBtn").textContent = m && state.completed[m.id] ? "Module completed ✓" : "Mark module complete";
    const next = nextLoadedModule(m?.id);
    $("nextLoadedBtn").disabled = !next;
  }

  function nextLoadedModule(id) {
    const index = course.modules.findIndex((m) => m.id === id);
    for (let i = index + 1; i < course.modules.length; i++) if (course.modules[i].available) return course.modules[i];
    return null;
  }

  function renderDrill() {
    const m = currentModule();
    if (!m?.available || !m.drills?.length) {
      $("drillHost").innerHTML = emptyMarkup("Drill bench is ready", "Guided problems will appear here only after matching source material is loaded. The answer, hint, retry, and explanation machinery is already wired.");
      return;
    }
    $("drillHost").innerHTML = m.drills.map((q, index) => renderDrillQuestion(q, index)).join("");
    qa("[data-drill-choice]", $("drillHost")).forEach((btn) => btn.addEventListener("click", () => answerDrill(btn.dataset.question, Number(btn.dataset.choice))));
    qa("[data-hint]", $("drillHost")).forEach((btn) => btn.addEventListener("click", () => {
      const box = $("hint-" + btn.dataset.hint);
      if (box) box.hidden = !box.hidden;
    }));
  }

  function renderDrillQuestion(q, index) {
    const saved = state.drillAnswers[q.id];
    if (q.type === "mcq") {
      const choices = (q.choices || []).map((choice, i) => {
        let cls = "choiceBtn";
        if (saved) {
          if (i === q.answer) cls += " correct";
          else if (i === saved.answer) cls += " wrong";
        }
        return `<button class="${cls}" data-drill-choice data-question="${escapeHtml(q.id)}" data-choice="${i}" type="button">${String.fromCharCode(65+i)} · ${escapeHtml(choice)}</button>`;
      }).join("");
      return `<div class="drillCard"><span class="drillCode">DRILL ${String(index+1).padStart(2,"0")}</span><div class="drillPrompt">${escapeHtml(q.prompt)}</div><div class="choiceGrid">${choices}</div>
        ${q.hint ? `<button class="hintBtn" data-hint="${escapeHtml(q.id)}" type="button">Show hint</button><div id="hint-${escapeHtml(q.id)}" class="feedback" hidden>${escapeHtml(q.hint)}</div>` : ""}
        ${saved ? `<div class="feedback">${escapeHtml(q.explanation || (saved.correct ? "Correct." : "Review this item and retry."))}</div>` : ""}
      </div>`;
    }
    return `<div class="drillCard"><span class="drillCode">DRILL ${String(index+1).padStart(2,"0")}</span><div class="drillPrompt">${escapeHtml(q.prompt || "")}</div><div class="feedback">This question type is scaffolded for the content pass.</div></div>`;
  }

  function answerDrill(questionId, answer) {
    const m = currentModule();
    const q = m?.drills?.find((x) => x.id === questionId);
    if (!q) return;
    state.drillAnswers[questionId] = { answer, correct: answer === q.answer, at: now() };
    persist({ rerender: true });
  }

  function allTestQuestions() {
    return course.modules.filter((m) => m.available).flatMap((m) => (m.testQuestions || []).map((q) => ({ ...q, moduleId: m.id })));
  }

  function renderTest() {
    const bank = allTestQuestions();
    $("testQuestionCount").textContent = bank.length;
    if (!bank.length) {
      $("testHost").innerHTML = `<div class="testEmpty"><div><strong>Assessment engine ready; question bank empty.</strong><p>Future tests can pull from one module or mix the loaded course. Feedback stays hidden until submission, then a scored review is stored in test history.</p></div></div>`;
      return;
    }
    if (!currentTest) {
      const latest = state.testHistory[0];
      $("testHost").innerHTML = `<div class="testSetup"><div><strong>${bank.length} questions available</strong><p>Start a mixed test from all loaded source-backed questions.${latest ? " Latest score: " + latest.score + "%." : ""}</p></div><button id="startTestBtn" class="primaryAction" type="button">Start test</button></div>`;
      $("startTestBtn").addEventListener("click", startTest);
      return;
    }
    if (currentTest.submitted) {
      $("testHost").innerHTML = `<div class="scoreCard"><b>${currentTest.score}%</b><span>${currentTest.correct} / ${currentTest.questions.length} correct</span><div class="modalActions" style="justify-content:center;margin-top:16px"><button id="newTestBtn" class="lineAction" type="button">New test</button></div></div>` + currentTest.questions.map((q, index) => {
        const picked = currentTest.answers[q.id];
        return `<div class="testQuestion"><span class="drillCode">QUESTION ${index+1}</span><h3>${escapeHtml(q.prompt)}</h3><div class="feedback">${picked === q.answer ? "Correct." : "Incorrect."} ${escapeHtml(q.explanation || "")}</div></div>`;
      }).join("");
      $("newTestBtn").addEventListener("click", () => { currentTest = null; renderTest(); });
      return;
    }
    $("testHost").innerHTML = currentTest.questions.map((q, index) => `<div class="testQuestion"><span class="drillCode">QUESTION ${String(index+1).padStart(2,"0")}</span><h3>${escapeHtml(q.prompt)}</h3><div class="choiceGrid">${(q.choices || []).map((c,i) => `<button class="choiceBtn ${currentTest.answers[q.id] === i ? "selected" : ""}" data-test-choice data-question="${escapeHtml(q.id)}" data-choice="${i}" type="button">${String.fromCharCode(65+i)} · ${escapeHtml(c)}</button>`).join("")}</div></div>`).join("") + `<div class="testFooter"><span>${Object.keys(currentTest.answers).length} / ${currentTest.questions.length} answered</span><button id="submitTestBtn" class="primaryAction" type="button">Submit test</button></div>`;
    qa("[data-test-choice]", $("testHost")).forEach((btn) => btn.addEventListener("click", () => {
      currentTest.answers[btn.dataset.question] = Number(btn.dataset.choice);
      renderTest();
    }));
    $("submitTestBtn").addEventListener("click", submitTest);
  }

  function startTest() {
    const bank = allTestQuestions();
    currentTest = { id: uid(), startedAt: now(), questions: bank.slice().sort(() => Math.random() - .5), answers: {}, submitted: false };
    renderTest();
  }

  function submitTest() {
    if (!currentTest) return;
    const correct = currentTest.questions.reduce((n,q) => n + (currentTest.answers[q.id] === q.answer ? 1 : 0), 0);
    currentTest.correct = correct;
    currentTest.score = Math.round((correct / currentTest.questions.length) * 100);
    currentTest.submitted = true;
    state.testHistory.unshift({ id: currentTest.id, at: now(), score: currentTest.score, correct, total: currentTest.questions.length });
    state.testHistory = state.testHistory.slice(0,50);
    persist();
    renderTest();
  }

  function renderReference() {
    const query = String($("referenceSearch").value || "").trim().toLowerCase();
    const items = (course.reference || []).filter((r) => !query || [r.term,r.definition,r.detail,...(r.tags || [])].join(" ").toLowerCase().includes(query));
    if (!course.reference?.length) {
      $("referenceHost").innerHTML = emptyMarkup("Reference library is empty", "This area is ready for definitions, formulas, symbols, units, property data, and process notes sourced from the course.");
      return;
    }
    if (!items.length) {
      $("referenceHost").innerHTML = `<div class="testEmpty" style="color:#6c6d68;border-color:#c3baab"><div><strong style="color:#252a2d">No matching reference items.</strong><p>Try a different term.</p></div></div>`;
      return;
    }
    $("referenceHost").innerHTML = `<div class="referenceGrid">${items.map((r) => `<article class="referenceItem"><h3>${escapeHtml(r.term)}</h3><p>${escapeHtml(r.definition || "")}</p>${r.detail ? `<p style="margin-top:8px">${escapeHtml(r.detail)}</p>` : ""}<div class="refTags">${(r.tags || []).map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div></article>`).join("")}</div>`;
  }

  function renderNotes() {
    const open = localStorage.getItem(NOTES_OPEN_KEY) === "1";
    document.querySelector(".logbook").classList.toggle("open", open);
    $("noteChevron").textContent = open ? "⌃" : "⌄";
    $("noteCount").textContent = state.notes.length + (state.notes.length === 1 ? " note" : " notes");
    $("noteTabs").innerHTML = state.notes.map((n) => `<button class="noteTab ${n.id === state.activeNoteId ? "active" : ""}" data-note="${escapeHtml(n.id)}" type="button">${escapeHtml(n.title || "Untitled")}</button>`).join("");
    qa("[data-note]", $("noteTabs")).forEach((b) => b.addEventListener("click", () => { state.activeNoteId = b.dataset.note; persist(); renderNotes(); }));
    const active = state.notes.find((n) => n.id === state.activeNoteId);
    $("noteTitle").disabled = !active;
    $("noteBody").disabled = !active;
    $("deleteNoteBtn").disabled = !active;
    $("noteTitle").value = active?.title || "";
    $("noteBody").value = active?.body || "";
  }

  function addNote() {
    const n = { id: uid(), title: "New note", body: "", updatedAt: now() };
    state.notes.unshift(n);
    state.activeNoteId = n.id;
    localStorage.setItem(NOTES_OPEN_KEY, "1");
    persist();
    renderNotes();
    $("noteTitle").focus();
    $("noteTitle").select();
  }

  function updateActiveNote() {
    const n = state.notes.find((x) => x.id === state.activeNoteId);
    if (!n) return;
    n.title = $("noteTitle").value.trim() || "Untitled note";
    n.body = $("noteBody").value;
    n.updatedAt = now();
    persist();
    $("noteCount").textContent = state.notes.length + (state.notes.length === 1 ? " note" : " notes");
  }

  function deleteActiveNote() {
    if (!state.activeNoteId) return;
    state.notes = state.notes.filter((n) => n.id !== state.activeNoteId);
    state.activeNoteId = state.notes[0]?.id || null;
    persist();
    renderNotes();
  }

  function mergeStates(localState, remoteState) {
    const a = normalizeState(localState);
    const b = normalizeState(remoteState);
    const newer = a._savedAt >= b._savedAt ? a : b;
    const out = normalizeState(clone(newer));
    out.completed = { ...b.completed, ...a.completed };
    const answers = { ...b.drillAnswers };
    Object.entries(a.drillAnswers || {}).forEach(([id, answer]) => {
      const previous = answers[id];
      if (!previous || Number(answer?.at || 0) >= Number(previous?.at || 0)) answers[id] = answer;
    });
    out.drillAnswers = answers;
    const notes = new Map();
    [...(b.notes || []), ...(a.notes || [])].forEach((note) => {
      const previous = notes.get(note.id);
      if (!previous || Number(note.updatedAt || 0) >= Number(previous.updatedAt || 0)) notes.set(note.id, clone(note));
    });
    out.notes = [...notes.values()].sort((x,y) => Number(y.updatedAt || 0) - Number(x.updatedAt || 0));
    const tests = new Map();
    [...(b.testHistory || []), ...(a.testHistory || [])].forEach((run) => { if (run?.id) tests.set(run.id, run); });
    out.testHistory = [...tests.values()].sort((x,y) => Number(y.at || 0) - Number(x.at || 0)).slice(0,50);
    if (!out.notes.some((n) => n.id === out.activeNoteId)) out.activeNoteId = out.notes[0]?.id || null;
    out._savedAt = Math.max(a._savedAt, b._savedAt);
    return normalizeState(out);
  }

  async function callRpc(name, body, { keepalive = false } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
        method: "POST",
        headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type":"application/json", "Cache-Control":"no-store" },
        body: JSON.stringify(body),
        cache: "no-store",
        keepalive,
        signal: controller.signal
      });
      const raw = await response.text();
      let data = null;
      try { data = raw ? JSON.parse(raw) : null; } catch (_) { data = raw; }
      if (!response.ok) throw new Error(data?.message || data?.error || `Cloud request failed (${response.status})`);
      return data;
    } catch (error) {
      if (error?.name === "AbortError") throw new Error("Cloud request timed out");
      throw error;
    } finally { clearTimeout(timer); }
  }

  async function loadCloudProfile(username) {
    const data = await callRpc("engineering_materials_profile_load", { p_username: username });
    return Array.isArray(data) ? data[0] : data;
  }

  async function saveCloudProfile(username, snapshot, revision, options = {}) {
    const data = await callRpc("engineering_materials_profile_save", {
      p_username: username,
      p_state_text: JSON.stringify(snapshot),
      p_expected_revision: revision
    }, options);
    return Array.isArray(data) ? data[0] : data;
  }

  function storeMeta(username, revision, base) {
    saveJson(metaKey(username), { revision, baseState: persistentSnapshot(base), savedAt: now() });
  }

  function scheduleCloudSave() {
    if (!cloudUsername) return;
    cloudDirty = true;
    clearTimeout(cloudTimer);
    if (cloudLoading) return setCloudIndicator("saving", "Connecting…");
    if (!cloudReady) return setCloudIndicator("offline", "Local copy");
    setCloudIndicator("saving", "Saving…");
    cloudTimer = setTimeout(() => void performCloudSave(), 650);
  }

  async function performCloudSave(force = false, options = {}) {
    if (!cloudUsername || (!cloudReady && !force)) return false;
    if (cloudSavePromise) return cloudSavePromise;
    const username = cloudUsername;
    cloudSavePromise = (async () => {
      for (let attempt = 0; attempt < 4 && cloudUsername === username; attempt++) {
        const snapshot = persistentSnapshot(state);
        const result = await saveCloudProfile(username, snapshot, cloudRevision, options);
        if (result?.ok) {
          cloudRevision = Number(result.revision) || cloudRevision;
          cloudBaseState = snapshot;
          cloudDirty = false;
          storeMeta(username, cloudRevision, snapshot);
          setCloudIndicator("synced", "@" + username);
          $("saveFooter").textContent = "Cloud and local copies are in sync.";
          renderCloudUi();
          return true;
        }
        const remote = normalizeState(JSON.parse(result?.state_text || "{}"));
        cloudRevision = Number(result?.revision) || 0;
        state = mergeStates(state, remote);
        saveJson(profileKey(username), persistentSnapshot(state));
        cloudBaseState = remote;
      }
      throw new Error("Could not resolve cloud revision conflict");
    })().catch((error) => {
      cloudReady = false;
      cloudDirty = true;
      setCloudIndicator("offline", "Local copy");
      $("saveFooter").textContent = "Cloud unavailable; changes are still saved locally.";
      renderCloudUi();
      if (!options.silent) showToast(error.message || "Cloud save failed");
      return false;
    }).finally(() => { cloudSavePromise = null; });
    return cloudSavePromise;
  }

  async function connectCloud(usernameInput) {
    const username = normalizeUsername(usernameInput);
    if (!validUsername(username)) {
      $("cloudMessage").className = "cloudMessage error";
      $("cloudMessage").textContent = "Use 2–32 lowercase letters, numbers, or underscores.";
      return;
    }
    cloudLoading = true;
    $("cloudMessage").className = "cloudMessage";
    $("cloudMessage").textContent = "Connecting…";
    setCloudIndicator("saving", "Connecting…");
    try {
      const previousLocal = cloudUsername ? persistentSnapshot(state) : normalizeState(loadJson(ANON_KEY) || state);
      const row = await loadCloudProfile(username);
      const remote = normalizeState(JSON.parse(row?.state_text || "{}"));
      cloudUsername = username;
      localStorage.setItem(USERNAME_KEY, username);
      cloudRevision = Number(row?.revision) || 0;
      cloudBaseState = remote;
      state = mergeStates(previousLocal, remote);
      saveJson(profileKey(username), persistentSnapshot(state));
      cloudReady = true;
      cloudDirty = true;
      await performCloudSave(true);
      $("cloudMessage").textContent = "Connected.";
      render();
    } catch (error) {
      cloudReady = false;
      $("cloudMessage").className = "cloudMessage error";
      $("cloudMessage").textContent = error.message || "Could not connect.";
      setCloudIndicator("offline", "Local copy");
    } finally { cloudLoading = false; }
  }

  async function initializeCloud() {
    if (!cloudUsername) {
      setCloudIndicator("", "Local only");
      return;
    }
    cloudLoading = true;
    setCloudIndicator("saving", "Connecting…");
    const meta = loadJson(metaKey(cloudUsername));
    if (meta) {
      cloudRevision = Number(meta.revision) || 0;
      cloudBaseState = normalizeState(meta.baseState);
    }
    try {
      const row = await loadCloudProfile(cloudUsername);
      const remote = normalizeState(JSON.parse(row?.state_text || "{}"));
      cloudRevision = Number(row?.revision) || 0;
      state = mergeStates(state, remote);
      saveJson(profileKey(cloudUsername), persistentSnapshot(state));
      cloudBaseState = remote;
      cloudReady = true;
      storeMeta(cloudUsername, cloudRevision, remote);
      setCloudIndicator("synced", "@" + cloudUsername);
      render();
      if (state._savedAt > remote._savedAt) scheduleCloudSave();
    } catch (_) {
      cloudReady = false;
      setCloudIndicator("offline", "Local copy");
      $("saveFooter").textContent = "Cloud unavailable; local saving continues.";
    } finally { cloudLoading = false; }
  }

  function signOutCloud() {
    if (cloudUsername) saveJson(profileKey(cloudUsername), persistentSnapshot(state));
    cloudUsername = "";
    localStorage.removeItem(USERNAME_KEY);
    cloudReady = false;
    cloudRevision = 0;
    cloudBaseState = null;
    cloudDirty = false;
    state = normalizeState(loadJson(ANON_KEY));
    setCloudIndicator("", "Local only");
    closeCloudModal();
    render();
  }

  function renderCloudUi() {
    const signedIn = !!cloudUsername;
    $("cloudLoginSection").hidden = signedIn;
    $("cloudSignedInSection").hidden = !signedIn;
    if (signedIn) {
      $("connectedUsername").textContent = "@" + cloudUsername;
      $("connectedMeta").textContent = "Revision " + cloudRevision + (cloudReady ? " · synced" : " · local fallback");
    }
  }

  function openCloudModal() {
    $("cloudModal").classList.add("open");
    $("cloudModal").setAttribute("aria-hidden","false");
    $("cloudMessage").textContent = "";
    renderCloudUi();
    if (!cloudUsername) setTimeout(() => $("cloudUsernameInput").focus(), 20);
  }

  function closeCloudModal() {
    $("cloudModal").classList.remove("open");
    $("cloudModal").setAttribute("aria-hidden","true");
  }

  function openRail() { $("rail").classList.add("open"); }
  function closeRail() { $("rail").classList.remove("open"); }

  qa(".modeTab").forEach((btn) => btn.addEventListener("click", () => {
    state.tab = btn.dataset.tab;
    persist();
    renderTabs();
    if (state.tab === "reference") renderReference();
    if (state.tab === "test") renderTest();
  }));
  $("completeBtn").addEventListener("click", () => {
    const m = currentModule();
    if (!m?.available) return;
    state.completed[m.id] = !state.completed[m.id];
    persist({ rerender: true });
  });
  $("nextLoadedBtn").addEventListener("click", () => {
    const next = nextLoadedModule(currentModule()?.id);
    if (!next) return;
    state.currentModule = next.id;
    persist({ rerender: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  $("referenceSearch").addEventListener("input", renderReference);
  $("logbookToggle").addEventListener("click", () => {
    const open = localStorage.getItem(NOTES_OPEN_KEY) !== "1";
    localStorage.setItem(NOTES_OPEN_KEY, open ? "1" : "0");
    renderNotes();
  });
  $("addNoteBtn").addEventListener("click", addNote);
  $("deleteNoteBtn").addEventListener("click", deleteActiveNote);
  $("noteTitle").addEventListener("input", updateActiveNote);
  $("noteBody").addEventListener("input", updateActiveNote);
  $("profileButton").addEventListener("click", openCloudModal);
  $("modalClose").addEventListener("click", closeCloudModal);
  $("cloudModal").addEventListener("click", (e) => { if (e.target === $("cloudModal")) closeCloudModal(); });
  $("cloudConnectBtn").addEventListener("click", () => connectCloud($("cloudUsernameInput").value));
  $("cloudUsernameInput").addEventListener("keydown", (e) => { if (e.key === "Enter") connectCloud(e.currentTarget.value); });
  $("cloudSyncNowBtn").addEventListener("click", async () => { cloudReady = true; await performCloudSave(true); renderCloudUi(); });
  $("syncBtn").addEventListener("click", () => cloudUsername ? performCloudSave(true) : openCloudModal());
  $("cloudSwitchBtn").addEventListener("click", () => {
    $("cloudSignedInSection").hidden = true;
    $("cloudLoginSection").hidden = false;
    $("cloudUsernameInput").value = "";
    $("cloudUsernameInput").focus();
  });
  $("cloudSignOutBtn").addEventListener("click", signOutCloud);
  $("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset Engineering Materials progress, answers, tests, and notes on this profile?")) return;
    state = defaultState();
    persist({ rerender: true });
    showToast("Materials progress reset.");
  });
  $("mobileMenu").addEventListener("click", openRail);
  $("railClose").addEventListener("click", closeRail);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeCloudModal(); closeRail(); }
  });
  window.addEventListener("online", () => {
    if (cloudUsername) { cloudReady = true; scheduleCloudSave(); }
  });
  window.addEventListener("offline", () => {
    if (cloudUsername) { cloudReady = false; setCloudIndicator("offline", "Local copy"); }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && cloudUsername && cloudDirty && cloudReady) void performCloudSave(true, { keepalive: true, silent: true });
  });

  render();
  initializeCloud();
})();
