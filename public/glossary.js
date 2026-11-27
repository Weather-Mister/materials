(() => {
  'use strict';
  const {entries, sources} = window.MATERIALS_GLOSSARY;
  const {filter, readState, query, escape: esc} = window.MATERIALS_GLOSSARY_CORE;
  const byId = id => document.getElementById(id);
  const terms = new Map(entries.map(e => [e.id,e]));
  const search = byId('glossarySearch'), chapter = byId('glossaryChapter'), alphabet = byId('glossaryAlphabet'), results = byId('glossaryResults');
  let state = readState(location.search);
  alphabet.innerHTML = ['all', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(letter => `<button type="button" data-letter="${letter}" aria-pressed="false">${letter === 'all' ? 'All letters' : letter}</button>`).join('');
  const sourceUrl = source => `https://cool.ntu.edu.tw/courses/66957/files/${source.file}`;
  byId('glossarySources').innerHTML = Object.values(sources).map(s => `<li><a href="${sourceUrl(s)}">Chapter ${s.chapter} · Part ${s.part}: ${esc(s.title)}</a> (${s.pages} pages)</li>`).join('') + '<li><a href="https://cool.ntu.edu.tw/courses/66957/files/10740663">Homework 2</a> (archived repository copy reviewed)</li>';
  function card(e) {
    return `<article class="termCard" id="${e.id}" tabindex="-1" aria-labelledby="title-${e.id}">
      <div class="termHeading"><h2 id="title-${e.id}"><a href="#${e.id}" aria-label="Link to ${esc(e.term)}">${esc(e.term)}</a></h2><span class="chapterTag">Ch. ${e.chapters.join(' · ')}</span></div>
      ${e.aliases.length ? `<p class="aliases"><b>Also indexed:</b> ${e.aliases.map(esc).join(' · ')}</p>` : ''}
      <p class="definition">${esc(e.definition)}</p>
      ${e.formula ? `<p class="termFormula"><b>Formula / recall</b><span>${esc(e.formula)}</span></p>` : ''}
      <p class="contrast"><b>Keep distinct</b> ${esc(e.contrast)}</p>
      ${e.related.length ? `<p class="related"><b>Compare:</b> ${e.related.map(id => `<a href="#${id}">${esc(terms.get(id).term)}</a>`).join(' · ')}</p>` : ''}
      <div class="termFoot"><span>${e.references.map(r => `<a href="${sourceUrl(sources[r.source])}">Ch. ${sources[r.source].chapter} P${sources[r.source].part} · pp. ${esc(r.pages)}</a>`).join(' · ')}</span>${e.questions.map(id => `<a href="./phase-practice.html?unit=${id.startsWith('hw2-') ? 'homework' : id.split('-')[1]}#${id}">${id.startsWith('hw2-') ? 'HW2 ' + id.slice(4).toUpperCase().replaceAll('-', '.') : 'Practice question'}</a>`).join(' ')}</div>
    </article>`;
  }
  function render(updateUrl = true, preserveHash = false) {
    search.value = state.q; chapter.value = state.chapter;
    for (const button of alphabet.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.letter === state.letter));
    const shown = filter(entries, state);
    results.innerHTML = shown.length ? shown.map(card).join('') : '<div class="empty"><h2>No matching terms</h2><p>Try a shorter search, another chapter, or clear the letter filter.</p><button type="button" data-reset>Show all terms</button></div>';
    byId('glossaryCount').textContent = `${shown.length} of ${entries.length} terms${state.chapter === 'all' ? '' : ` · Chapter ${state.chapter}`}${state.letter === 'all' ? '' : ` · ${state.letter}`}${state.q ? ` · “${state.q}”` : ''}`;
    if (updateUrl) history.replaceState(null, '', location.pathname + query(state) + (preserveHash ? location.hash : ''));
  }
  function reset() {state = {q:'',chapter:'all',letter:'all'}; render(); search.focus();}
  function revealHash() {
    let id;
    try {id = decodeURIComponent(location.hash.slice(1));} catch {return;}
    const target = terms.get(id);
    if (!target) return;
    // A comparison link must reveal its target even if current filters hide it.
    if (!filter(entries,state).some(e => e.id === id)) {state = {q:'',chapter:'all',letter:'all'}; render(true, true);}
    const el = byId(id); el.scrollIntoView({block:'start'}); el.focus({preventScroll:true});
  }
  byId('glossaryFilters').addEventListener('submit', event => event.preventDefault());
  search.addEventListener('input', () => {state.q = search.value; render();});
  chapter.addEventListener('change', () => {state.chapter = chapter.value; render();});
  alphabet.addEventListener('click', event => {const button = event.target.closest('[data-letter]'); if (button) {state.letter = button.dataset.letter; render();}});
  byId('glossaryClear').addEventListener('click', reset);
  results.addEventListener('click', event => {if (event.target.closest('[data-reset]')) reset();});
  // Handle repeated links to the current hash as well as normal hash changes.
  document.addEventListener('click', event => {const link = event.target.closest('a[href^="#"]'); if (link && link.getAttribute('href') === location.hash) revealHash();});
  window.addEventListener('hashchange', revealHash);
  window.addEventListener('popstate', () => {state = readState(location.search); render(false); revealHash();});
  render(false); revealHash();
})();
