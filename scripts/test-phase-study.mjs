import {readFileSync} from "node:fs";
function runTests(sources){
 const assert=(c,m)=>{if(!c)throw Error(m)},state=new Map(),storage={getItem:k=>state.get(k)||null,setItem:(k,v)=>state.set(k,v)};
 function setup(unit){
  const win={addEventListener(){},print(){}};for(const s of sources.slice(0,3))new Function("window",s)(win);
  class El{constructor(id){this.id=id;this.value="all";this.innerHTML="";this.textContent="";this.hidden=true;this.children=new Map();this.events={};this.dataset={};this.classList={remove(){}};}addEventListener(t,f){(this.events[t]??=[]).push(f)}querySelector(s){if(!this.children.has(s))this.children.set(s,new El(s));return this.children.get(s)}querySelectorAll(){return []}append(){}add(){}setAttribute(k,v){this[k]=String(v)}focus(){}contains(){return false}replaceChildren(){}remove(){}}
  const els=new Map(),get=id=>{if(!els.has(id))els.set(id,new El(id));return els.get(id)};
  get("phaseSearch").value="";const links=["10","11","12","homework"].map(unit=>{const e=new El(unit);e.dataset.unit=unit;return e});
  const doc={getElementById:get,querySelectorAll:s=>s==="[data-unit]"?links:[],createElement:()=>new El("created"),createElementNS:()=>new El("svg"),activeElement:null};
  const ui=sources[3].replace(/  render\(\);\n  if \(linkedQuestion\)/,"  render();\n  window.__test={bank,homework,unitQuestions,grade,status,record,save,card,render,matches,renderReview};\n  if (linkedQuestion)");
  function Params(s){this.get=k=>new Map(s.replace(/^\?/,"").split("&").map(p=>p.split("="))).get(k)||null}
  new Function("window","document","localStorage","location","Option","URLSearchParams",ui)(win,doc,storage,{search:"?unit="+unit,hash:""},function(t,v){this.text=t;this.value=v},Params);
  assert(win.__test,"Test instrumentation missing");return {t:win.__test,get,El};
 }
 const a=setup("10"), b=setup("11"), c=setup("12"), d=setup("homework");
 const count=s=>(s.get("examQuestions").innerHTML.match(/<article /g)||[]).length;
 for(const [s,n] of [[a,36],[b,29],[c,37],[d,22]]){assert(s.t.unitQuestions.length===n,"Unit count "+n);assert(count(s)===n,"Default render incomplete");assert(!s.get("examQuestions").innerHTML.includes("details open"),"Solution visible")}
 const {t,get,El}=d,first=t.homework[0],multi=t.homework.find(q=>q.type==="multi"),written=t.homework.find(q=>q.type==="written");
 assert(t.grade(first,first.key)&&!t.grade(first,[1]),"Single grading");assert(t.grade(multi,[...multi.key].reverse())&&!t.grade(multi,[multi.key[0]])&&!t.grade(multi,[...multi.key,0]),"Exact-set grading");
 const host=get("examQuestions"),fire=(type,target)=>{for(const f of host.events[type]||[])f({target})};
 const m=new El(multi.id);m.querySelectorAll=s=>s.includes(":checked")?multi.key.map(v=>({value:String(v)})):[];fire("input",{closest:()=>m,matches:s=>s===".phaseChoices input"});assert(t.status(multi)==="draft","Multi draft");
 function click(q,attr,value){const ar=new El(q.id),button={dataset:{choice:value},closest:()=>ar,matches:s=>s.split(",").includes("["+attr+"]"),hasAttribute:x=>x===attr};fire("click",{closest:()=>button})}
 click(multi,"data-check");assert(t.status(multi)==="complete","Multi submit");click(first,"data-choice","1");assert(t.status(first)==="incorrect","Wrong choice");click(first,"data-choice","0");assert(t.status(first)==="complete","Correct choice");click(written,"data-complete");assert(t.status(written)==="unanswered","Blank marked complete");
 const ar=new El(written.id),target={closest:()=>ar,matches:s=>s==="[data-working]",value:"My independent calculation"};fire("input",target);assert(t.status(written)==="draft","Written draft");click(written,"data-complete");assert(t.status(written)==="complete","Written completion");target.value="Updated working";fire("input",target);assert(t.status(written)==="draft","Edit reopens");click(written,"data-needs-review");assert(t.status(written)==="incorrect","Review");
 const d2=setup("homework");assert(d2.t.status(first)==="complete"&&d2.t.record(written).working==="Updated working","Persistence");d2.get("phaseStatus").value="complete";d2.t.render();assert(count(d2)===2,"Status filter");d2.get("phaseStatus").value="all";d2.get("phaseType").value="written";d2.t.render();assert(count(d2)===12,"Type filter");d2.get("phaseType").value="all";d2.get("phaseSearch").value="IV.1(a)";d2.t.render();assert(count(d2)===1,"Search");a.get("phaseSource").value="professor";a.t.render();assert(count(a)===12,"Source filter");a.get("phaseTopic").value="freezing";a.t.render();assert(count(a)===3,"Topic filter");d2.t.renderReview();assert(d2.get("phaseReview").innerHTML.includes("Updated working"),"Saved review");assert(t.homework.reduce((s,q)=>s+q.points,0)===100,"HW points");assert(t.bank.length===102&&new Set(t.bank.map(q=>q.id)).size===102,"Inventory");
 const before=(x,y)=>t.bank.findIndex(q=>q.id===x)<t.bank.findIndex(q=>q.id===y);for(const [x,y] of [["phase-10-boundary","phase-10-read-cu"],["phase-10-hot-shortness","hw2-ii-1"],["phase-11-lambda","hw2-ii-3"],["phase-11-processing","hw2-iii-1-c"],["phase-12-iron-fields","hw2-ii-2"],["phase-12-pearlite-is-not-phase","phase-12-hypo-steel"],["phase-12-ttt-read","phase-12-ttt-path"],["phase-12-martensite-graphs","hw2-iii-2-b-i"],["phase-12-martensite-graphs","hw2-ii-5"]])assert(before(x,y),"Prerequisite "+x+" before "+y);
 assert(!t.bank.filter(q=>q.ch===10&&q.source==="practice").some(q=>/eutecti[co]/i.test([q.prompt,q.solution,...(q.choices||[])].join(" "))),"Future eutectic topic in Chapter 10");
 const near=(a,b)=>Math.abs(a-b)<.015;assert(near(1200*8/13,738.46)&&near(1200*5/18,333.33),"IV.1");const primary=800*(61.9-30)/(61.9-19),e=800-primary;assert(near(primary+e*(97.5-61.9)/(97.5-19),800*(97.5-30)/(97.5-19)),"IV.2a");const pro=800*(1.10-.77)/(6.67-.77);assert(near(pro+(800-pro)*(.77-.0218)/(6.67-.0218),800*(1.10-.0218)/(6.67-.0218)),"IV.2b");
 return "PASS: rendering, grading, drafts, completion, filters, persistence, review, homework mass balances";
}
console.log(runTests(["phase-questions","phase-homework","phase-exercises","phase-practice"].map(name=>readFileSync(new URL("../public/"+name+".js",import.meta.url),"utf8"))));
