(function examPracticeModule() {
  'use strict';
  const course = window.MATERIALS_COURSE;
  const bank = window.MATERIALS_EXERCISES || [];
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let activeModule = '', scope = 'current', set = 'all', search = '';
  const sourceFiles = {1:'exercise-1-with-key.pdf',2:'exercise-2-with-key.pdf',3:'exercise-3-with-key.pdf',4:'exercise-4-with-key.pdf',5:'exercise-5-with-key.pdf'};
  const text = html => html.replace(/<[^>]*>/g,' ').replace(/&[^;]+;/g,' ').toLowerCase();

  function questionCard(q) {
    const module = course.modules.find(m=>m.id===q.moduleIds[0]);
    const pages = q.sourcePages || [];
    const original = q.originalQuestionImage ? `<details class="originalQuestion"><summary>View original question scan</summary><img loading="lazy" src="${esc(q.originalQuestionImage)}" alt="Original printed question ${esc(q.number)} from Exercise ${q.set}; no answer key included"></details>` : '';
    return `<article class="sourceExercise" id="${esc(q.id)}">
      <header class="sourceExerciseHead"><span>EXERCISE ${q.set} <i>·</i> ${esc(q.number)}</span><small>${esc(module?.title || '')}</small></header>
      <h3>${esc(q.title)}</h3>
      <div class="sourceQuestion">${q.questionHtml}${original}</div>
      <p class="questionSource">Original wording · Exercise ${q.set}, ${pages.length===1?'page':'pages'} ${pages.join(', ')}</p>
      <details class="exerciseAttempt"><summary>Write your attempt</summary><label for="attempt-${esc(q.id)}">Your working (saved on this device)</label><textarea id="attempt-${esc(q.id)}" data-attempt="${esc(q.id)}" rows="4" placeholder="Write the known values, equation, steps, and conclusion before revealing the solution."></textarea><span class="attemptSave" role="status"></span></details>
      <details class="exerciseSolution"><summary><span>Reveal explained solution</span><b aria-hidden="true">+</b></summary><div class="exerciseSolutionBody">${q.solutionHtml}${q.notes ? `<p class="keyClarification"><strong>Source / key note:</strong> ${esc(q.notes)}</p>` : ''}<p class="solutionSource"><a href="./sources/${sourceFiles[q.set]}#page=${pages[0] || 1}" target="_blank" rel="noopener">Open original Exercise ${q.set} PDF with key</a> · Check the original scan alongside the explanation.</p></div></details>
    </article>`;
  }

  function renderList() {
    const host = document.getElementById('examQuestions');
    if (!host) return;
    const moduleId = scope === 'current' ? activeModule : scope;
    const query = search.trim().toLowerCase();
    const matches = bank.filter(q=>(scope==='all' || q.moduleIds.includes(moduleId)) && (set==='all' || String(q.set)===set) && (!query || text(q.number+' '+q.title+' '+q.questionHtml+' '+q.topics.join(' ')).includes(query)));
    const setCount = new Set(matches.map(q=>q.set)).size;
    document.getElementById('examResultCount').textContent = `${matches.length} of ${bank.length} original questions · ${setCount} exercise ${setCount === 1 ? 'set' : 'sets'} shown`;
    host.innerHTML = matches.length ? matches.map(questionCard).join('') : '<div class="examNoResults"><h3>No questions match these filters.</h3><p>Choose “All units” and “All exercise sets”, or clear the search.</p></div>';
    host.querySelectorAll('[data-attempt]').forEach(el=>{
      try { el.value = localStorage.getItem('materialsExerciseAttempt:'+el.dataset.attempt) || ''; } catch (_) {}
      el.addEventListener('input',()=>{
        const status = el.nextElementSibling;
        try { localStorage.setItem('materialsExerciseAttempt:'+el.dataset.attempt,el.value); status.textContent='Saved on this device'; }
        catch (_) { status.textContent='Device storage unavailable; keep this page open to retain your working.'; }
      });
    });
  }

  function render(moduleId) {
    activeModule=moduleId;
    const host=document.getElementById('examPracticeHost');
    if(!host) return;
    const current=course.modules.find(m=>m.id===moduleId);
    const units=course.modules.filter(m=>bank.some(q=>q.moduleIds.includes(m.id)));
    host.innerHTML=`<div class="examIntro"><div><span class="examKicker">YOUR ORIGINAL EXERCISES</span><h2>Exam practice</h2><p>All five supplied exercise sets, placed in their units. Try every part first, then reveal a worked solution. Original wording and diagrams are retained; corrections to the supplied keys are explained inside the answers.</p></div><div class="examBankCount"><strong>${bank.length}</strong><span>original questions</span></div></div>
      <div class="examFilters"><label>Unit<select id="examUnit"><option value="current">Current unit: ${esc(current?.title || '')}</option><option value="all">All units</option>${units.map(m=>`<option value="${m.id}">${String(m.number).padStart(2,'0')} · ${esc(m.title)}</option>`).join('')}</select></label><label>Exercise set<select id="examSet"><option value="all">All exercise sets</option>${[1,2,3,4,5].map(n=>`<option value="${n}">Exercise ${n} · ${bank.filter(q=>q.set===n).length} questions</option>`).join('')}</select></label><label>Find a question<input id="examSearch" type="search" placeholder="Question number, topic, or wording" value="${esc(search)}"></label></div>
      <div class="examResultsBar"><p id="examResultCount" aria-live="polite"></p><button id="hideExamSolutions" type="button">Hide all solutions</button></div><div id="examQuestions"></div>`;
    document.getElementById('examUnit').value=scope;
    document.getElementById('examSet').value=set;
    document.getElementById('examUnit').addEventListener('change',e=>{scope=e.target.value;renderList();});
    document.getElementById('examSet').addEventListener('change',e=>{set=e.target.value;renderList();});
    document.getElementById('examSearch').addEventListener('input',e=>{search=e.target.value;renderList();});
    document.getElementById('hideExamSolutions').addEventListener('click',()=>{host.querySelectorAll('.exerciseSolution[open]').forEach(el=>el.open=false);});
    renderList();
  }
  window.MATERIALS_EXAM={render,forCurrentUnit(moduleId){scope='current';set='all';search='';render(moduleId);},count(moduleId){return bank.filter(q=>q.moduleIds.includes(moduleId)).length;}};
})();
