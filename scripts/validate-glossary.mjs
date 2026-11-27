import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
export function loadGlossary() {
  const context = vm.createContext({window:{}, URLSearchParams});
  for (const file of ['glossary-data','glossary-core','phase-questions','phase-homework','phase-exercises']) vm.runInContext(readFileSync(new URL(`../public/${file}.js`,import.meta.url),'utf8'),context);
  return context.window;
}
export function validate(data, bank) {
  assert.equal(data.version,1);
  const {entries,sources} = data;
  assert.ok(entries.length >= 140,'Unexpectedly small glossary');
  const ids = new Set(), names = new Set(), questionIds = new Set(bank.map(q=>q.id));
  for (const e of entries) {
    assert.match(e.id,/^[a-z][a-z0-9-]+$/); assert.ok(!ids.has(e.id),`Duplicate ID ${e.id}`); ids.add(e.id);
    assert.ok(!names.has(e.term.toLowerCase()),`Duplicate term ${e.term}`); names.add(e.term.toLowerCase());
    for (const key of ['term','definition','contrast']) assert.ok(typeof e[key] === 'string' && e[key].trim(),`${e.id}: missing ${key}`);
    assert.ok(typeof e.formula === 'string');
    for (const key of ['chapters','aliases','related','references','questions']) assert.ok(Array.isArray(e[key]),`${e.id}: ${key} must be array`);
    assert.ok(e.chapters.length && e.chapters.every(ch=>[10,11,12].includes(ch)));
    assert.equal(new Set(e.chapters).size,e.chapters.length);
    assert.ok(e.aliases.every(a=>typeof a === 'string' && a.trim()));
    assert.ok(e.references.length,`${e.id}: no source pointer`);
    for (const r of e.references) {
      assert.ok(sources[r.source],`${e.id}: unknown source ${r.source}`);
      assert.match(r.pages,/^\d+(?:–\d+)?(?:, \d+(?:–\d+)?)*$/);
      for (const segment of r.pages.split(', ')) {
        const nums = segment.split('–').map(Number);
        assert.ok(nums[0] >= 1 && nums.at(-1) <= sources[r.source].pages && nums[0] <= nums.at(-1),`${e.id}: invalid page range`);
      }
    }
    for (const q of e.questions) assert.ok(questionIds.has(q),`${e.id}: broken question ${q}`);
  }
  for (const e of entries) for (const id of e.related) assert.ok(ids.has(id) && id !== e.id,`${e.id}: broken/self related term ${id}`);
  assert.equal(Object.keys(sources).length,6);
  assert.deepEqual(Object.values(sources).map(s=>s.file).sort(),['10166729','10166727','10166763','10166772','10166783','10166739'].sort());
  for (const id of ['unary','binary','phase','component','isomorphous','eutectic','eutectoid','peritectic','peritectoid','monotectic','solidification','microsegregation','macrosegregation','age-hardening','ttt','martensite','ferrite','austenite','cementite','bainite','tempering']) assert.ok(ids.has(id),`Missing required term ${id}`);
  const byId = new Map(entries.map(e=>[e.id,e]));
  for (const [id,equation] of [['eutectic','L → α + β'],['peritectic','L + α → β'],['monotectic','L₁ → L₂ + α'],['eutectoid','γ → α + β'],['peritectoid','α + β → γ']]) assert.ok(byId.get(id).formula.includes(equation),`${id}: cooling direction`);
  for (const ch of [10,11,12]) assert.ok(entries.filter(e=>e.chapters.includes(ch)).length > 25);
  assert.equal(bank.length,102,'Question inventory');
  assert.equal(new Set(bank.map(q=>q.id)).size,102);
  return `${entries.length} terms, 6 decks, valid source ranges, cross-references and practice links; 102 questions`;
}
const win = loadGlossary();
console.log('PASS: ' + validate(win.MATERIALS_GLOSSARY,[...win.MATERIALS_PHASE_QUESTIONS,...win.MATERIALS_PHASE_HOMEWORK,...win.MATERIALS_PHASE_EXERCISES]));
