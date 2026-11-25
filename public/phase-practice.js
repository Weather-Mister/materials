(function(){
'use strict';
const bank=window.MATERIALS_PHASE_PRACTICE||[];
const byId=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=html=>html.replace(/<[^>]*>/g,' ').replace(/&[^;]+;/g,' ').toLowerCase();
const set=byId('phaseSet'),topic=byId('phaseTopic'),search=byId('phaseSearch'),host=byId('examQuestions');
byId('bankCount').textContent=bank.length;
for(const t of [...new Set(bank.map(q=>q.topic))]){
 const o=document.createElement('option');o.value=t;o.textContent=t;topic.append(o);
}
function card(q){
 return '<article class="sourceExercise" id="'+esc(q.id)+'"><header class="sourceExerciseHead"><span>'+esc(q.kind==='Professor exercises'?'EXERCISE 8':'PRACTICE')+' <i>·</i> '+esc(q.number)+'</span><small>'+esc(q.topic)+'</small></header><h3>'+esc(q.title)+'</h3><div class="sourceQuestion">'+q.questionHtml+'</div><p class="questionSource">'+esc(q.kind==='Professor exercises'?'Adapted professor exercise · ':'Original practice based on ') +esc(q.source)+'</p><details class="exerciseAttempt"><summary>Write your attempt</summary><label for="attempt-'+esc(q.id)+'">Your working (saved on this device)</label><textarea id="attempt-'+esc(q.id)+'" data-attempt="'+esc(q.id)+'" rows="4" placeholder="Write the known values, equation, steps, and conclusion before revealing the solution."></textarea><span class="attemptSave" role="status"></span></details><details class="exerciseSolution"><summary><span>Reveal explained solution</span><b aria-hidden="true">+</b></summary><div class="exerciseSolutionBody">'+q.solutionHtml+(q.notes?'<p class="keyClarification"><strong>Source / key note:</strong> '+esc(q.notes)+'</p>':'')+'<p class="solutionSource">'+esc(q.source)+'</p></div></details></article>';
}
function render(){
 const query=search.value.trim().toLowerCase();
 const found=bank.filter(q=>(set.value==='all'||set.value===q.kind)&&(topic.value==='all'||topic.value===q.topic)&&(!query||text(q.number+' '+q.title+' '+q.topic+' '+q.questionHtml).includes(query)));
 byId('examResultCount').textContent=found.length+' of '+bank.length+' questions shown';
 host.innerHTML=found.length?found.map(card).join(''):'<div class="examNoResults"><h3>No matching questions.</h3><p>Clear the search or choose all topics.</p></div>';
 for(const el of host.querySelectorAll('[data-attempt]')){
  const key='materialsExerciseAttempt:'+el.dataset.attempt;
  try{el.value=localStorage.getItem(key)||'';}catch(_){}
  el.addEventListener('input',()=>{try{localStorage.setItem(key,el.value);el.nextElementSibling.textContent='Saved on this device';}catch(_){el.nextElementSibling.textContent='Device storage unavailable.';}});
 }
}
set.addEventListener('change',render);topic.addEventListener('change',render);search.addEventListener('input',render);
byId('hideExamSolutions').addEventListener('click',()=>host.querySelectorAll('.exerciseSolution[open]').forEach(el=>el.open=false));
byId('clearFilters').addEventListener('click',()=>{set.value=topic.value='all';search.value='';render();});
render();
})();