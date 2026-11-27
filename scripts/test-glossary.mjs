import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {loadGlossary, validate} from './validate-glossary.mjs';
const win = loadGlossary(), {entries} = win.MATERIALS_GLOSSARY, core = win.MATERIALS_GLOSSARY_CORE;
const bank = [...win.MATERIALS_PHASE_QUESTIONS,...win.MATERIALS_PHASE_HOMEWORK,...win.MATERIALS_PHASE_EXERCISES];
const has = (q,id) => core.filter(entries,{q}).some(e=>e.id===id);
for (const [q,id] of [['single component','unary'],['isomorphous','isomorphous'],['Fe3C','cementite'],['Fe₃C','cementite'],['precipitation hardening','age-hardening'],['lambda','interlamellar-spacing'],['λ','interlamellar-spacing'],['Ms','ms'],['Mₛ','ms'],['TTT','ttt'],['CuAl2','theta'],['Hume Rothery','hume-rothery']]) assert.ok(has(q,id),`Search ${q}`);
assert.equal(core.filter(entries,{q:'zzzyyyxxx'}).length,0);
assert.ok(core.filter(entries,{chapter:'10'}).every(e=>e.chapters.includes(10)));
assert.ok(core.filter(entries,{letter:'M'}).every(e=>e.term.startsWith('M')));
assert.ok(core.filter(entries,{q:'martensite',chapter:'12',letter:'M'}).some(e=>e.id==='martensite'));
assert.equal(core.filter(entries,{q:'martensite',chapter:'10',letter:'M'}).length,0);
const state = {q:'α + β & <x>',chapter:'11',letter:'P'};
assert.equal(JSON.stringify(core.readState(core.query(state))),JSON.stringify(state));
assert.equal(core.readState('?chapter=99&letter=%3Cscript%3E').chapter,'all');
assert.equal(core.escape('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');
// Negative validation tests prove broken data cannot silently ship.
for (const mutate of [d=>d.entries.push(d.entries[0]),d=>d.entries[0].related.push('missing-term'),d=>d.entries[0].questions.push('missing-question'),d=>d.entries[0].references[0].pages='999']) {
  const bad = structuredClone(win.MATERIALS_GLOSSARY); mutate(bad); assert.throws(()=>validate(bad,bank));
}
// Execute the production controller with event-capable DOM doubles. Storage access
// throws, proving the glossary neither reads nor changes learner progress.
class Element {
  constructor(id) {this.id=id;this.value='';this.events={};this.dataset={};this.attrs={};this.innerHTML='';this.textContent='';}
  addEventListener(type,fn) {(this.events[type]??=[]).push(fn);}
  setAttribute(key,value) {this.attrs[key]=value;}
  querySelectorAll() {return this.buttons || [];}
  focus() {this.focused=true;}
  scrollIntoView() {this.scrolled=true;}
  fire(type,target=this) {for (const fn of this.events[type]||[]) fn({target,preventDefault(){}});}
}
const elements = new Map(), get = id => {if (!elements.has(id)) elements.set(id,new Element(id)); return elements.get(id);};
const doc = {getElementById:get,addEventListener(){}};
const alphabet = get('glossaryAlphabet'); alphabet.buttons = ['all',...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(letter=>{const b=new Element(letter);b.dataset.letter=letter;return b;});
const location = {pathname:'/glossary.html',search:'?chapter=10',hash:''}, history = {replaceState(_a,_b,url){this.url=url;}};
const listeners = {}; win.addEventListener=(type,fn)=>{listeners[type]=fn;};
vm.runInNewContext(readFileSync(new URL('../public/glossary.js',import.meta.url),'utf8'),{window:win,document:doc,location,history,localStorage:new Proxy({}, {get(){throw Error('Progress accessed');}})});
const count = () => (get('glossaryResults').innerHTML.match(/class="termCard"/g)||[]).length;
assert.equal(count(),core.filter(entries,{chapter:'10'}).length);
get('glossarySearch').value='unary';get('glossarySearch').fire('input');assert.equal(count(),core.filter(entries,{q:'unary',chapter:'10'}).length);assert.ok(history.url.includes('q=unary'));
get('glossarySearch').value='<img>';get('glossarySearch').fire('input');assert.ok(get('glossaryResults').innerHTML.includes('No matching terms'));
get('glossaryClear').fire('click');assert.equal(count(),entries.length);assert.ok(get('glossarySearch').focused);
const m=alphabet.buttons.find(b=>b.dataset.letter==='M');m.closest=()=>m;alphabet.fire('click',m);assert.equal(count(),core.filter(entries,{letter:'M'}).length);assert.equal(m.attrs['aria-pressed'],'true');
get('glossaryChapter').value='12';get('glossaryChapter').fire('change');assert.equal(count(),core.filter(entries,{chapter:'12',letter:'M'}).length);
location.hash='#unary';listeners.hashchange();assert.equal(count(),entries.length);assert.ok(get('unary').focused && get('unary').scrolled);
get('glossarySearch').value='pearlite';get('glossarySearch').fire('input');assert.ok(!history.url.includes('#'),'New filters must remove a stale term hash');
location.search='?q=pearlite&chapter=12';location.hash='';listeners.popstate();assert.equal(count(),core.filter(entries,{q:'pearlite',chapter:'12'}).length);
for (const page of ['index','phase-practice']) assert.ok(readFileSync(new URL(`../public/${page}.html`,import.meta.url),'utf8').includes('href="./glossary.html"'));
console.log('PASS: aliases/symbols, chapter + A–Z + search, URL state, escaping, invalid-data rejection, UI events, empty/reset, comparison deep links, navigation and no storage access');
