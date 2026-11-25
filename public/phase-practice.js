(function(){
'use strict';
const written=window.MATERIALS_PHASE_PRACTICE||[];
const mcq=window.MATERIALS_PHASE_MCQ||[];
const mode=byMode();
function byMode(){return document.getElementById('phaseMode');}
let bank=mcq;
let answers={};try{answers=JSON.parse(localStorage.getItem('materialsPhaseMCQAnswers:v1')||'{}')||{};}catch(_){}
const byId=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=html=>html.replace(/<[^>]*>/g,' ').replace(/&[^;]+;/g,' ').toLowerCase();
const set=byId('phaseSet'),topic=byId('phaseTopic'),search=byId('phaseSearch'),host=byId('examQuestions');
byId('bankCount').textContent=bank.length;
for(const t of [...new Set([...mcq,...written].map(q=>q.topic))]){
 const o=document.createElement('option');o.value=t;o.textContent=t;topic.append(o);
}
function mcCard(q){
 const answered=Number.isInteger(answers[q.id])&&answers[q.id]>=0&&answers[q.id]<4;
 return '<article class="sourceExercise" id="'+esc(q.id)+'"><header class="sourceExerciseHead"><span>QUESTION <i>·</i> '+esc(q.id.slice(-3))+'</span><small>'+esc(q.topic)+'</small></header><div class="sourceQuestion mcBody"><p class="mcPrompt">'+esc(q.prompt)+'</p>'+q.figureHtml+'<div class="choiceGrid">'+q.choices.map((choice,i)=>'<button type="button" class="choiceBtn'+(answered?(i===q.answer?' correct':i===answers[q.id]?' wrong':''):'')+'" data-mcq="'+esc(q.id)+'" data-choice="'+i+'" aria-pressed="'+(answered&&i===answers[q.id])+'">'+String.fromCharCode(65+i)+' · '+esc(choice)+'</button>').join('')+'</div>'+(answered?'<div class="feedback mcFeedback" role="status"><strong>'+(answers[q.id]===q.answer?'Correct':'Incorrect')+'</strong><p>'+esc(q.explanation)+'</p></div>':'')+'</div><p class="questionSource">'+esc(q.source)+'</p></article>';
}
function updateScore(){
 const done=mcq.filter(q=>Number.isInteger(answers[q.id])&&answers[q.id]>=0&&answers[q.id]<4);
 byId('phaseScore').textContent=done.length+' / '+mcq.length+' answered · '+done.filter(q=>answers[q.id]===q.answer).length+' correct';
}
function card(q){
 return '<article class="sourceExercise" id="'+esc(q.id)+'"><header class="sourceExerciseHead"><span>'+esc(q.kind==='Professor exercises'?'EXERCISE 8':'PRACTICE')+' <i>·</i> '+esc(q.number)+'</span><small>'+esc(q.topic)+'</small></header><h3>'+esc(q.title)+'</h3><div class="sourceQuestion">'+q.questionHtml+'</div><p class="questionSource">'+esc(q.kind==='Professor exercises'?'Adapted professor exercise · ':'Original practice based on ') +esc(q.source)+'</p><details class="exerciseAttempt"><summary>Write your attempt</summary><label for="attempt-'+esc(q.id)+'">Your working (saved on this device)</label><textarea id="attempt-'+esc(q.id)+'" data-attempt="'+esc(q.id)+'" rows="4" placeholder="Write the known values, equation, steps, and conclusion before revealing the solution."></textarea><span class="attemptSave" role="status"></span></details><details class="exerciseSolution"><summary><span>Reveal explained solution</span><b aria-hidden="true">+</b></summary><div class="exerciseSolutionBody">'+q.solutionHtml+(q.notes?'<p class="keyClarification"><strong>Source / key note:</strong> '+esc(q.notes)+'</p>':'')+'<p class="solutionSource">'+esc(q.source)+'</p></div></details></article>';
}
function render(){
 bank=mode.value==='mcq'?mcq:written;
 byId('bankCount').textContent=bank.length;
 byId('phaseScore').hidden=mode.value!=='mcq';
 byId('resetMCQ').hidden=mode.value!=='mcq';
 byId('hideExamSolutions').hidden=mode.value==='mcq';
 set.disabled=mode.value==='mcq';
 const query=search.value.trim().toLowerCase();
 const found=bank.filter(q=>(mode.value==='mcq'||set.value==='all'||set.value===q.kind)&&(topic.value==='all'||topic.value===q.topic)&&(!query||text((q.number||q.ref||'')+' '+(q.title||q.prompt||'')+' '+q.topic+' '+(q.questionHtml||'')).includes(query)));
 byId('examResultCount').textContent=found.length+' of '+bank.length+' questions shown';
 host.innerHTML=found.length?found.map(mode.value==='mcq'?mcCard:card).join(''):'<div class="examNoResults"><h3>No matching questions.</h3><p>Clear the search or choose all topics.</p></div>';
 updateScore();
 wireMCQ(host);
 for(const el of host.querySelectorAll('[data-attempt]')){
  const key='materialsExerciseAttempt:'+el.dataset.attempt;
  try{el.value=localStorage.getItem(key)||'';}catch(_){}
  el.addEventListener('input',()=>{try{localStorage.setItem(key,el.value);el.nextElementSibling.textContent='Saved on this device';}catch(_){el.nextElementSibling.textContent='Device storage unavailable.';}});
 }
}
function wireMCQ(root){
 for(const el of root.querySelectorAll('[data-mcq]')){
  el.addEventListener('click',()=>{
   const item=mcq.find(q=>q.id===el.dataset.mcq);if(!item)return;
   answers[item.id]=Number(el.dataset.choice);
   try{localStorage.setItem('materialsPhaseMCQAnswers:v1',JSON.stringify(answers));}catch(_){}
   el.closest('article').outerHTML=mcCard(item);
   wireMCQ(byId(item.id));updateScore();
  });
 }
}
mode.addEventListener('change',()=>{set.value='all';render();});
byId('resetMCQ').addEventListener('click',()=>{if(!confirm('Clear all Chapter 10 multiple-choice answers?'))return;answers={};try{localStorage.removeItem('materialsPhaseMCQAnswers:v1');}catch(_){}render();});
set.addEventListener('change',render);topic.addEventListener('change',render);search.addEventListener('input',render);
byId('hideExamSolutions').addEventListener('click',()=>host.querySelectorAll('.exerciseSolution[open]').forEach(el=>el.open=false));
byId('clearFilters').addEventListener('click',()=>{set.value=topic.value='all';search.value='';render();});
render();
})();