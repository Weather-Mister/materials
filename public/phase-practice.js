(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const chapters = window.MATERIALS_PHASE_CHAPTERS;
  const homework = window.MATERIALS_PHASE_HOMEWORK;
  const unordered = [...window.MATERIALS_PHASE_QUESTIONS, ...homework, ...window.MATERIALS_PHASE_EXERCISES];
  const sequence = new Map(window.MATERIALS_PHASE_SEQUENCE.map((id,i)=>[id,i]));
  const bank = unordered.slice().sort((a,b)=>sequence.get(a.id)-sequence.get(b.id));
  const questions = new Map(bank.map(question => [question.id, question]));
  const storeKey = 'materialsPhaseStudy:v1';
  const sourceNames = { practice: 'Practice', homework: 'Homework 2', professor: 'Professor exercise' };
  const courseLink = 'https://cool.ntu.edu.tw/courses/66957';
  const host = byId('examQuestions');
  const review = byId('phaseReview');
  const topicFilter = byId('phaseTopic');
  const sourceFilter = byId('phaseSource');
  const statusFilter = byId('phaseStatus');
  const storageNotice = byId('phaseStorage');
  const searchFilter = byId('phaseSearch');
  const typeFilter = byId('phaseType');
  let records = {};
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey));
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) records = saved;
    for (const q of window.MATERIALS_PHASE_EXERCISES) {
      const legacy = localStorage.getItem('materialsExerciseAttempt:ch10-' + q.label);
      if (q.ch === 10 && legacy?.trim() && !records[q.id]) records[q.id] = { working: legacy };
    }
  } catch {
    warnStorage();
  }

  const query = new URLSearchParams(location.search);
  const unit = ['11', '12', 'homework'].includes(query.get('unit')) ? query.get('unit') : '10';
  const homeworkMode = unit === 'homework';
  const chapter = chapters[unit];
  const unitQuestions = homeworkMode ? homework : bank.filter(q => q.ch === Number(unit));
  const requestedId = location.hash.slice(1);
  const linkedQuestion = unitQuestions.find(q => q.id === requestedId);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);

  function warnStorage() {
    storageNotice.hidden = false;
    storageNotice.textContent = 'This browser could not save progress. Your current entries are available until you leave the page.';
  }

  function record(q) {
    return records[q.id] || {};
  }

  function save(q, values) {
    const previous = record(q);
    records[q.id] = { ...previous, ...values };
    try {
      const latest = JSON.parse(localStorage.getItem(storeKey) || '{}');
      if (latest && typeof latest === 'object' && !Array.isArray(latest)) {
        records = { ...records, ...latest, [q.id]: { ...previous, ...latest[q.id], ...values } };
      }
      localStorage.setItem(storeKey, JSON.stringify(records));
      return true;
    } catch {
      warnStorage();
      return false;
    }
  }

  function hasWorking(r) {
    return Boolean(r.working?.trim() || r.sketch?.length);
  }

  function grade(q, selected) {
    return Array.isArray(selected) && selected.length === q.key.length
      && q.key.every(index => selected.includes(index));
  }

  function status(q) {
    const r = record(q);
    if (q.type !== 'written') {
      if (r.selected?.length) return grade(q, r.selected) ? 'complete' : 'incorrect';
      return r.draft?.length || hasWorking(r) ? 'draft' : 'unanswered';
    }
    if (r.complete && hasWorking(r)) return 'complete';
    if (r.needsReview && hasWorking(r)) return 'incorrect';
    return hasWorking(r) ? 'draft' : 'unanswered';
  }

  const statusNames = {
    complete: 'Complete', incorrect: 'Needs review', draft: 'Draft saved', unanswered: 'Unanswered'
  };

  function figure(name) {
    if (!name) return '';
    const meta = window.MATERIALS_PHASE_FIGURES[name];
    const file = './assets/phase-figures/' + name + '.svg';
    return '<figure class="phaseFigure"><img src="' + file + '" alt="' + escape(meta.alt) + '">' +
      '<figcaption>' + escape(meta.caption) + (meta.axes ? ' <label><input type="checkbox" data-probe="' +
        escape(name) + '"> Coordinate cursor</label><output aria-live="off"></output>' : '') + '</figcaption></figure>';
  }

  function scan(name, alt) {
    return '<figure class="phaseScan"><a href="./assets/phase-exercises/' + escape(name) +
      '.webp" target="_blank" rel="noopener" aria-label="Open full-size scan"><img loading="lazy" src="./assets/phase-exercises/' +
      escape(name) + '.webp" alt="' + escape(alt) + '"></a></figure>';
  }

  function choiceMarkup(q) {
    const r = record(q);
    const graded = Boolean(r.selected?.length);
    return '<fieldset class="phaseChoices"><legend>' + (q.type === 'multi' ? 'Select all that apply' : 'Select one answer') +
      '</legend>' + q.choices.map((choice, i) => {
        const chosen = r.selected?.includes(i);
        const mark = graded && (q.key.includes(i) ? ' correct' : chosen ? ' wrong' : '');
        return q.type === 'multi'
          ? '<label class="phaseChoice' + (mark || '') + '"><input type="checkbox" value="' + i + '"' +
            ((r.draft || r.selected)?.includes(i) ? ' checked' : '') + '> <span>' + String.fromCharCode(65 + i) + ' · ' +
            escape(choice) + '</span></label>'
          : '<button class="phaseChoice' + (mark || '') + '" type="button" data-choice="' + i + '" aria-pressed="' +
            Boolean(chosen) + '">' + (q.choices.length > 2 ? String.fromCharCode(65 + i) + ' · ' : '') + escape(choice) + '</button>';
      }).join('') + (q.type === 'multi' ? '<button type="button" class="phaseButton" data-check' +
        (!(r.draft || r.selected)?.length ? ' disabled' : '') + '>Check selection</button>' : '') +
      '</fieldset>' + (graded ? '<div class="phaseFeedback" role="status"><strong>' + (grade(q, r.selected) ? 'Correct' : 'Try again') +
        '</strong><p>' + escape(q.solution) + '</p></div>' : '');
  }

  function solution(q) {
    return '<details class="exerciseSolution"><summary><span>' + (q.source === 'professor' ? 'Reveal professor key' : 'Reveal worked solution') +
      '</span><b aria-hidden="true">+</b></summary><div class="exerciseSolutionBody">' +
      (q.solution ? '<p>' + escape(q.solution) + '</p>' : '') +
      (q.keyNote ? '<p class="keyClarification"><strong>Key discrepancy.</strong> ' + escape(q.keyNote) + '</p>' : '') +
      (q.scans ? q.scans.key.map((name, i) => scan(name, 'Professor key for ' + q.label + ', extract ' + (i + 1))).join('') : '') +
      figure(q.solutionFigure) + '</div></details>';
  }

  function workingMarkup(q) {
    const r = record(q);
    const required = q.type === 'written';
    return '<div class="phaseWorking"><label for="working-' + q.id + '">' + (required ? 'Your working' : 'Your working (optional)') +
      '</label><textarea id="working-' + q.id + '" data-working rows="4">' + escape(r.working) + '</textarea>' +
      (q.sketch ? '<details class="phaseSketch"><summary>Draw a sketch</summary><svg viewBox="0 0 400 220" aria-label="Sketch pad" data-sketch>' +
        '<g></g></svg><button type="button" class="phaseButton" data-undo>Undo stroke</button></details>' : '') +
      (required ? '<div class="phaseActions"><button type="button" class="phaseButton" data-complete aria-pressed="' + Boolean(r.complete) +
        '"' + (hasWorking(r) ? '' : ' aria-disabled="true"') + '>' + (r.complete ? 'Reopen question' : 'Mark complete') +
        '</button><button type="button" class="phaseButton" data-needs-review aria-pressed="' + Boolean(r.needsReview) + '"' +
        (hasWorking(r) ? '' : ' aria-disabled="true"') + '>Needs review</button></div>' : '') +
      '<small data-saved aria-live="polite"></small></div>';
  }

  function card(q) {
    const source = sourceNames[q.source] + (q.source === 'professor' ? ' ' + q.set : '');
    const reference = q.source === 'professor' ? '<a href="' + courseLink + '/files/' + q.file +
      '">Original exercise PDF · ' + escape(q.pages) + '</a>' : escape(q.reference || '');
    const subpartTitle = q.heading && q.heading !== q.title ? '<p class="phaseContext">' + escape(q.heading) + '</p>' : '';
    return '<article class="sourceExercise phaseCard" id="' + q.id + '"><header class="sourceExerciseHead"><span>' +
      escape(source + (q.label ? ' · ' + q.label : '')) + (q.points ? ' · ' + q.points + ' pt' : '') +
      '</span><small data-status>' + statusNames[status(q)] + '</small></header><h3>' + escape(q.title) + '</h3>' +
      '<div class="sourceQuestion">' + subpartTitle + (q.context ? '<p class="phaseContext">' + escape(q.context) + '</p>' : '') +
      (q.prompt ? '<p>' + escape(q.prompt) + '</p>' : '') +
      (q.scans ? q.scans.question.map((name, i) => scan(name, 'Original problem ' + q.label + ', extract ' + (i + 1))).join('') : '') +
      (q.scans ? q.scans.figures.map(name => scan(name, 'Original diagram ' + name.replace('fig-', ''))).join('') : '') +
      figure(q.figure) + (q.type === 'written' ? '' : '<div data-choices>' + choiceMarkup(q) + '</div>') + '</div>' +
      (q.type === 'written' || q.source === 'homework' ? workingMarkup(q) : '') +
      (reference ? '<p class="questionSource">' + reference + '</p>' : '') +
      (q.type === 'written' ? solution(q) : '') + '</article>';
  }

  function matches(q) {
    const state = status(q);
    const choice = statusFilter.value;
    const keyword = searchFilter.value.trim().toLowerCase();
    const searchable = [q.label,q.title,q.prompt,q.context,q.topic,q.reference,...(q.choices||[])].filter(Boolean).join(' ').toLowerCase();
    return (!keyword || searchable.includes(keyword)) && (typeFilter.value === 'all' || (typeFilter.value === 'objective' ? q.type !== 'written' : q.type === 'written')) &&
      (homeworkMode || topicFilter.value === 'all' || q.topic === topicFilter.value) &&
      (homeworkMode || sourceFilter.value === 'all' || q.source === sourceFilter.value) &&
      (choice === 'all' || (choice === 'unfinished' ? state !== 'complete' : state === choice));
  }

  function updateProgress() {
    const complete = unitQuestions.filter(q => status(q) === 'complete').length;
    byId('phaseCount').textContent = complete + ' / ' + unitQuestions.length;
    for (const link of document.querySelectorAll('[data-unit]')) {
      const items = link.dataset.unit === 'homework' ? homework : bank.filter(q => q.ch === Number(link.dataset.unit));
      link.querySelector('small').textContent = items.filter(q => status(q) === 'complete').length + '/' + items.length;
    }
  }

  function render() {
    const groups = homeworkMode ? [['I', 'True or false'], ['II', 'Multiple selection'], ['III', 'Microstructure and short answers'],
      ['IV', 'Quantitative problems']] : Object.entries(chapter.topics);
    const shown = unitQuestions.filter(matches);
    host.innerHTML = shown.length ? groups.map(([id, title]) => {
      const contents = shown.filter(q => homeworkMode ? q.label.split('.')[0] === id : q.topic === id);
      return contents.length ? '<section class="phaseGroup"><h2>' + escape(title) + '</h2>' + contents.map(card).join('') + '</section>' : '';
    }).join('') : '<div class="examNoResults">No questions match these filters.</div>';
    byId('phaseResultCount').textContent = shown.length + ' of ' + unitQuestions.length + ' questions shown';
    updateProgress();
    byId('phaseTopicJump').innerHTML = homeworkMode ? '' : groups.map(([id,title])=>{
      const items=unitQuestions.filter(q=>q.topic===id);
      return '<button type="button" class="phaseTopicChip'+(topicFilter.value===id?' active':'')+'" data-topic-jump="'+escape(id)+'">'+escape(title)+' <small>'+items.filter(q=>status(q)==='complete').length+'/'+items.length+'</small></button>';
    }).join('');
    for (const svg of host.querySelectorAll('[data-sketch]')) {
      const q = questions.get(svg.closest('article').id);
      drawSketch(svg, record(q).sketch);
    }
  }

  function refresh(q, article) {
    const r = record(q);
    article.querySelector('[data-status]').textContent = statusNames[status(q)];
    const complete = article.querySelector('[data-complete]');
    if (complete) {
      complete.textContent = r.complete ? 'Reopen question' : 'Mark complete';
      complete.setAttribute('aria-pressed', Boolean(r.complete));
      const reviewButton = article.querySelector('[data-needs-review]');
      reviewButton.setAttribute('aria-pressed', Boolean(r.needsReview));
      for (const button of [complete, reviewButton]) button.setAttribute('aria-disabled', !hasWorking(r));
    }
    updateProgress();
    for(const chip of byId('phaseTopicJump').querySelectorAll('[data-topic-jump]')) { const items=unitQuestions.filter(q=>q.topic===chip.dataset.topicJump); chip.querySelector('small').textContent=items.filter(q=>status(q)==='complete').length+'/'+items.length; }
    if (!review.hidden) renderReview();
  }

  function drawSketch(svg, strokes = []) {
    svg.querySelector('g').replaceChildren(...strokes.map(points => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      line.setAttribute('points', (points.length === 1 ? [...points, points[0]] : points).map(point => point.join(',')).join(' '));
      return line;
    }));
  }

  function renderReview() {
    review.innerHTML = '<div class="phaseReviewHead"><h2>Saved homework working</h2><button type="button" class="phaseButton phaseNoPrint" data-print>Print working</button></div>' +
      homework.map(q => {
        const r = record(q);
        const answers = r.draft || r.selected;
        return '<section class="phaseReviewItem"><h3><a href="#' + q.id + '" data-review-id="' + q.id + '">HW2 ' + q.label +
          ' · ' + escape(q.title) + '</a></h3><p>' + statusNames[status(q)] +
          '</p>' + (answers?.length ? '<ul>' + answers.map(i => '<li>' +
            (q.type === 'multi' ? String.fromCharCode(65 + i) + ' · ' : '') + escape(q.choices[i]) + '</li>').join('') +
            '</ul>' : '') + (r.working?.trim() ? '<p class="phaseReviewWriting">' + escape(r.working) + '</p>' : '') +
          (r.sketch?.length ? '<svg class="phaseReviewSketch" viewBox="0 0 400 220" data-review-sketch="' + q.id +
            '" role="img" aria-label="Saved sketch"><g></g></svg>' : '') + '</section>';
      }).join('');
    for (const svg of review.querySelectorAll('[data-review-sketch]')) {
      drawSketch(svg, records[svg.dataset.reviewSketch].sketch);
    }
  }

  byId('chapterTitle').textContent = homeworkMode ? 'Homework 2' : chapter.title;
  byId('chapterIntro').innerHTML = homeworkMode
    ? 'Work through the original assignment in order. ' +
      '<a href="' + courseLink + '/files/10740663">Original PDF</a> · ' +
      '<a href="' + courseLink + '/assignments/433198">Assignment on NTU COOL</a>'
    : escape(chapter.description) + ' · Choose a topic or study the full chapter.';
  byId('reviewHomework').hidden = !homeworkMode;
  byId('phaseTopicLabel').hidden = homeworkMode;
  byId('phaseSourceLabel').hidden = homeworkMode;
  for (const link of document.querySelectorAll('[data-unit]')) {
    link.append(document.createElement('small'));
    if (link.dataset.unit === unit) link.setAttribute('aria-current', 'page');
  }
  if (!homeworkMode) {
    topicFilter.add(new Option('All topics', 'all'));
    for (const [id, title] of Object.entries(chapter.topics)) topicFilter.add(new Option(title, id));
    const requestedTopic = linkedQuestion?.topic || query.get('topic');
    topicFilter.value = Object.hasOwn(chapter.topics, requestedTopic) ? requestedTopic : 'all';
  }

  for (const control of [topicFilter, sourceFilter, statusFilter,typeFilter]) control.addEventListener('change', render);
  searchFilter.addEventListener('input',render);
  byId('clearPhaseFilters').addEventListener('click',()=>{ topicFilter.value=sourceFilter.value=statusFilter.value=typeFilter.value='all'; searchFilter.value=''; render(); });
  byId('phaseTopicJump').addEventListener('click',event=>{ const chip=event.target.closest('[data-topic-jump]'); if(!chip)return; topicFilter.value=topicFilter.value===chip.dataset.topicJump?'all':chip.dataset.topicJump; render(); });
  window.addEventListener('storage',event=>{ if(event.key!==storeKey)return; try { const latest=JSON.parse(event.newValue||'{}'); if(latest&&typeof latest==='object'&&!Array.isArray(latest)){ records=latest; if(!host.contains(document.activeElement))render(); else updateProgress(); } } catch{} });
  byId('hideExamSolutions').addEventListener('click', () => host.querySelectorAll('.exerciseSolution[open]').forEach(el => { el.open = false; }));
  byId('reviewHomework').addEventListener('click', event => {
    review.hidden = !review.hidden;
    event.currentTarget.textContent = review.hidden ? 'Review saved working' : 'Hide saved working';
    if (!review.hidden) renderReview();
  });
  review.addEventListener('click', event => {
    if (event.target.closest('[data-print]')) window.print();
    const link = event.target.closest('[data-review-id]');
    if (!link) return;
    statusFilter.value = typeFilter.value = 'all';
    searchFilter.value='';
    render();
  });

  host.addEventListener('input', event => {
    const article = event.target.closest('article');
    if (!article) return;
    const q = questions.get(article.id);
    if (event.target.matches('[data-working]')) {
      const working = event.target.value;
      const change = { working };
      if (working !== (record(q).working||'') && q.type==='written') Object.assign(change, { complete: false, needsReview: false });
      const stored = save(q, change);
      article.querySelector('[data-saved]').textContent = stored ? 'Saved on this device' : 'Available until you leave this page';
      refresh(q, article);
    }
    if (event.target.matches('.phaseChoices input')) {
      const draft = [...article.querySelectorAll('.phaseChoices input:checked')].map(input => Number(input.value));
      save(q, { draft, selected: null });
      const group = article.querySelector('.phaseChoices');
      group.querySelector('[data-check]').disabled = !draft.length;
      group.querySelectorAll('.correct,.wrong').forEach(el => el.classList.remove('correct', 'wrong'));
      article.querySelector('.phaseFeedback')?.remove();
      refresh(q, article);
    }
  });

  host.addEventListener('click', event => {
    const button = event.target.closest('button');
    const article = button?.closest('article');
    if (!article) return;
    const q = questions.get(article.id);
    const r = record(q);
    if (button.matches('[data-choice],[data-check]')) {
      const selected = button.hasAttribute('data-choice') ? [Number(button.dataset.choice)] : r.draft;
      if (!selected?.length) return;
      save(q, { selected });
      article.querySelector('[data-choices]').innerHTML = choiceMarkup(q);
      article.querySelector(button.hasAttribute('data-choice') ? '[data-choice="' + selected[0] + '"]' : '[data-check]').focus();
    }
    if (button.matches('[data-complete],[data-needs-review]')) {
      if (!hasWorking(r)) return;
      if (button.hasAttribute('data-complete')) save(q, { complete: !r.complete, needsReview: false });
      else save(q, { needsReview: !r.needsReview, complete: false });
    }
    if (button.hasAttribute('data-undo')) {
      const sketch = (r.sketch || []).slice(0, -1);
      const flags = { complete: false, needsReview: false };
      save(q, { sketch, ...flags });
      drawSketch(article.querySelector('[data-sketch]'), sketch);
    }
    refresh(q, article);
    // Keep the just-answered card visible for feedback until filters are refreshed.
  });

  let drawing;
  function sketchPoint(svg, event) {
    const matrix = svg.getScreenCTM().inverse();
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix);
    return [Math.round(Math.max(0, Math.min(400, point.x))), Math.round(Math.max(0, Math.min(220, point.y)))];
  }
  host.addEventListener('pointerdown', event => {
    const svg = event.target.closest('[data-sketch]');
    if (!svg || drawing || event.button !== 0) return;
    const q = questions.get(svg.closest('article').id);
    const sketch = [...(record(q).sketch || []), [sketchPoint(svg, event)]];
    drawing = { svg, q, sketch, pointer: event.pointerId };
    svg.setPointerCapture(event.pointerId);
    drawSketch(svg, sketch);
  });
  function probe(event){
    const fig = event.target.closest('.phaseFigure');
    const input = fig?.querySelector('[data-probe]:checked');
    if (!input || event.target.tagName !== 'IMG') return;
    const axes = window.MATERIALS_PHASE_FIGURES[input.dataset.probe].axes;
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width * axes.width - axes.left) / (axes.right - axes.left);
    const y = (axes.bottom - (event.clientY - rect.top) / rect.height * axes.height) / (axes.bottom - axes.top);
    fig.querySelector('output').textContent = x < 0 || x > 1 || y < 0 || y > 1 ? '' : axes.coords(x, y);
  }
  host.addEventListener('pointerdown',probe);
  host.addEventListener('pointermove', event => {
    if (drawing?.pointer === event.pointerId) {
      const points = drawing.sketch.at(-1);
      const next = sketchPoint(drawing.svg, event);
      if (Math.hypot(next[0] - points.at(-1)[0], next[1] - points.at(-1)[1]) < 2) return;
      points.push(next);
      drawing.svg.querySelector('polyline:last-child').setAttribute('points', points.map(point => point.join(',')).join(' '));
      return;
    }
    probe(event);
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    host.addEventListener(type, event => {
      if (drawing?.pointer !== event.pointerId) return;
      const { q, svg, sketch } = drawing;
      drawing = undefined;
      save(q, { sketch, complete:false, needsReview:false });
      refresh(q, svg.closest('article'));
    });
  }

  render();
  if (linkedQuestion) document.getElementById(linkedQuestion.id)?.scrollIntoView();
})();
