/* Pure search and URL helpers, shared by the browser UI and regression tests. */
(() => {
  'use strict';
  const substitutions = {'α':' alpha ', 'β':' beta ', 'γ':' gamma ', 'δ':' delta ', 'θ':' theta ', 'λ':' lambda ', 'σ':' sigma ', 'ρ':' rho ', '′':"'", '−':'-', '–':'-', '—':'-'};
  function normalize(value) {
    return String(value).normalize('NFKD').toLowerCase().replace(/[αβγδθλσρ′−–—]/g, c => substitutions[c]).replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function filter(entries, {q = '', chapter = 'all', letter = 'all'} = {}) {
    const words = normalize(q).split(/\s+/).filter(Boolean);
    return entries.filter(e => (chapter === 'all' || e.chapters.includes(Number(chapter))) &&
      (letter === 'all' || e.term[0].toUpperCase() === letter) &&
      words.every(word => normalize([e.term, ...e.aliases, e.definition, e.formula, e.contrast].join(' ')).includes(word)))
      .sort((a,b) => a.term.localeCompare(b.term, 'en'));
  }
  function readState(search) {
    const params = new URLSearchParams(search);
    return {q: params.get('q') || '', chapter: ['10','11','12'].includes(params.get('chapter')) ? params.get('chapter') : 'all', letter: /^[A-Z]$/.test(params.get('letter') || '') ? params.get('letter') : 'all'};
  }
  function query(state) {
    const params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.chapter !== 'all') params.set('chapter', state.chapter);
    if (state.letter !== 'all') params.set('letter', state.letter);
    return params.size ? '?' + params.toString() : '';
  }
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.MATERIALS_GLOSSARY_CORE = {normalize, filter, readState, query, escape};
})();
