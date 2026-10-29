'use strict';
/* =====================================================================
   Partie 3 (le Web) : activités interactives
   navigateur avec outils de développement, éditeur HTML/CSS, indexation
   à la main, mail d'hameçonnage, paramètres du navigateur.
   Utilise les fonctions de game.js (openModal, toast, addScore…).
   ===================================================================== */

/* réussite ou erreur dans une activité, comptées comme les réponses aux quiz */
function webOk(first) { if (first) { S.quizOk++; addScore(10); } sfx.ok(); }
function webKo(notion) { S.quizKo++; addScore(-3); recordError(notion); sfx.ko(); }

/* liste de tâches cochées au fur et à mesure */
function taskList(el, tasks, state) {
  el.innerHTML = tasks.map((t, i) => `<li class="${state[i] ? 'ok' : ''}">${state[i] ? '✅' : '⬜'} ${t.label}${!state[i] && t.hint ? ` <button class="chip hint-btn" data-i="${i}">Indice</button><div class="task-hint" hidden>💡 ${t.hint}</div>` : ''}</li>`).join('');
  el.querySelectorAll('.hint-btn').forEach(b => { b.onclick = () => { b.nextElementSibling.hidden = false; b.remove(); }; });
}

/* ---------------------------------------------------------------------
   Navigateur simulé + outils de développement (Réseau, Code source)
   --------------------------------------------------------------------- */
function browserLab(cfg) {
  const site = cfg.site, o = { log: [], opened: [], source: '' };
  let cur = null, tab = 'net', sel = null;
  const b = openModal({ title: cfg.title, wide: true });
  curNotion = 'http';
  b.innerHTML = `<ul class="tasks"></ul>
    <div class="browser"><form class="br-bar"><span class="br-lock">🔒</span><input spellcheck="false" autocomplete="off" aria-label="Adresse"><button class="btn small">Aller</button></form>
    <div class="br-page"></div></div>
    <div class="devtools"><div class="dt-tabs"><button class="chip" data-t="net">📶 Réseau</button><button class="chip" data-t="src">&lt;/&gt; Code source</button></div><div class="dt-body"></div></div>
    <div class="actions"><button class="btn primary" id="br-done" hidden>J'ai tout vu : je réponds à Klervi</button></div>`;
  const bar = b.querySelector('.br-bar input'), page = b.querySelector('.br-page'), body = b.querySelector('.dt-body');
  const parse = url => {
    let u = String(url).trim();
    if (!/^[a-z]+:\/\//i.test(u)) u = (u.startsWith('/') ? `https://${site.host}` : `https://${site.host}/`) + u;
    try { return new URL(u); } catch (e) { return null; }
  };
  function go(url) {
    const u = parse(url);
    if (!u) { toast("Cette adresse n'est pas valide.", 'warn'); return; }
    if (u.hostname !== site.host) { toast(`Pour cet exercice, reste sur le site <b>${esc(site.host)}</b>.`, 'warn'); return; }
    const params = Object.fromEntries(u.searchParams.entries());
    const path = u.pathname === '/' ? site.start : u.pathname;
    const fn = site.pages[path];
    const r = fn ? fn(params) : { status: 404, kind: "le serveur ne trouve pas ce fichier", html: `<!DOCTYPE html>\n<html>\n<head><title>404 Not Found</title></head>\n<body>\n  <h1>Not Found</h1>\n  <p>The requested URL ${esc(path)} was not found on this server.</p>\n</body>\n</html>` };
    const req = { method: 'GET', path, query: u.search, params, status: r.status, kind: r.kind, html: r.html, type: 'document', url: `https://${site.host}${path}${u.search}` };
    o.log.push(req);
    if (r.status === 200 && /stylesheet/.test(r.html)) o.log.push({ method: 'GET', path: '/style.css', query: '', params: {}, status: 200, kind: 'fichier stocké sur le serveur', type: 'feuille de style', url: `https://${site.host}/style.css` });
    cur = req; sel = req;
    bar.value = req.url;
    const doc = new DOMParser().parseFromString(r.html, 'text/html');
    doc.querySelectorAll('script, link, meta, title').forEach(x => x.remove());
    page.innerHTML = doc.body.innerHTML;
    page.classList.toggle('err', r.status !== 200);
    page.querySelectorAll('a').forEach(a => { a.onclick = ev => { ev.preventDefault(); go(a.getAttribute('href')); }; });
    if (r.status === 404) sfx.ko(); else sfx.step();
    draw();
  }
  function draw() {
    b.querySelectorAll('.dt-tabs .chip').forEach(c => c.classList.toggle('on', c.dataset.t === tab));
    if (tab === 'net') {
      body.innerHTML = `<table class="net"><tr><th>Méthode</th><th>Fichier demandé</th><th>Statut</th><th>Type</th></tr>${o.log.map((r, i) => `<tr data-i="${i}" class="${r === sel ? 'sel' : ''} ${r.status >= 400 ? 'bad' : ''}"><td>${r.method}</td><td><code>${esc(r.path + r.query)}</code></td><td>${r.status} ${r.status === 200 ? 'OK' : 'Not Found'}</td><td>${r.type}</td></tr>`).join('')}</table>
        ${sel ? `<div class="net-detail"><h4>Requête envoyée par le navigateur (client)</h4><pre>${esc(`${sel.method} ${sel.path}${sel.query} HTTP/1.1\nHost: ${site.host}\nUser-Agent: Navigateur de la hotline`)}</pre>
        <h4>Paramètres</h4>${Object.keys(sel.params).length ? `<table class="net"><tr><th>Nom</th><th>Valeur</th></tr>${Object.entries(sel.params).map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('')}</table>` : '<p class="muted small">Aucun paramètre dans cette requête.</p>'}
        <h4>Réponse du serveur</h4><p><b>${sel.status} ${sel.status === 200 ? 'OK' : 'Not Found'}</b> · ${esc(sel.kind)}</p></div>` : '<p class="muted small">Clique sur une ligne pour voir le détail de la requête.</p>'}`;
      body.querySelectorAll('tr[data-i]').forEach(tr => { tr.onclick = () => { sel = o.log[+tr.dataset.i]; if (!o.opened.includes(sel)) o.opened.push(sel); draw(); }; });
    } else {
      o.source += cur ? cur.path + ' ' : '';
      body.innerHTML = cur ? `<p class="muted small">Code reçu par le navigateur pour <code>${esc(cur.path + cur.query)}</code> :</p><pre class="src">${esc(cur.html)}</pre>` : '';
    }
    check();
  }
  function check() {
    const st = cfg.tasks.map(t => t.test(o));
    taskList(b.querySelector('.tasks'), cfg.tasks, st);
    const btn = b.querySelector('#br-done');
    if (btn.hidden && st.every(Boolean)) { btn.hidden = false; sfx.ok(); }
  }
  b.querySelector('.br-bar').onsubmit = ev => { ev.preventDefault(); go(bar.value); };
  b.querySelectorAll('.dt-tabs .chip').forEach(c => { c.onclick = () => { tab = c.dataset.t; draw(); }; });
  b.querySelector('#br-done').onclick = () => { closeModal(true); cfg.onDone(); };
  go(site.start);
}

/* ---------------------------------------------------------------------
   Éditeur HTML / CSS avec aperçu en direct
   --------------------------------------------------------------------- */
function htmlEditor(cfg) {
  const b = openModal({ title: cfg.title, wide: true });
  curNotion = 'html_css';
  b.innerHTML = `${cfg.intro ? `<div class="intro">${cfg.intro}</div>` : ''}<ul class="tasks"></ul>
    <div class="editor"><div class="ed-code"><label>index.html <small>(contenu)</small><textarea class="ed-html" spellcheck="false"></textarea></label>
    <label>style.css <small>(style)</small><textarea class="ed-css" spellcheck="false"></textarea></label></div>
    <div class="ed-view"><div class="ed-bar">Aperçu</div><iframe sandbox="allow-same-origin" title="Aperçu de la page"></iframe></div></div>
    <div class="actions"><button class="btn" id="ed-reset">↺ Revenir au code de départ</button><button class="btn primary" id="ed-done" hidden>Publier la page ✔</button></div>`;
  const th = b.querySelector('.ed-html'), tc = b.querySelector('.ed-css'), fr = b.querySelector('iframe');
  th.value = cfg.html; tc.value = cfg.css;
  let timer = null, okSeen = false;
  function render() {
    fr.onload = () => {
      const d = fr.contentDocument;
      if (!d) return;
      // un clic sur un lien de l'aperçu indique simplement où il mène
      d.addEventListener('click', ev => { const a = ev.target.closest && ev.target.closest('a'); if (a) { ev.preventDefault(); toast(`🔗 Ce lien mène vers <b>${esc(a.getAttribute('href') || '(vide)')}</b>`, 'info'); } });
      const st = cfg.tasks.map(t => { try { return !!t.test(d, fr.contentWindow); } catch (e) { return false; } });
      taskList(b.querySelector('.tasks'), cfg.tasks, st);
      const all = st.every(Boolean);
      b.querySelector('#ed-done').hidden = !all;
      if (all && !okSeen) { okSeen = true; sfx.ok(); }
    };
    fr.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${tc.value.replace(/<\//g, '<\\/')}</style></head><body>${th.value}</body></html>`;
  }
  const later = () => { clearTimeout(timer); timer = setTimeout(render, 350); };
  th.oninput = later; tc.oninput = later;
  // Tab insère deux espaces au lieu de quitter la zone de texte
  [th, tc].forEach(t => { t.onkeydown = ev => { if (ev.key === 'Tab') { ev.preventDefault(); const p = t.selectionStart; t.setRangeText('  ', p, t.selectionEnd, 'end'); later(); } }; });
  b.querySelector('#ed-reset').onclick = () => { th.value = cfg.html; tc.value = cfg.css; render(); };
  b.querySelector('#ed-done').onclick = () => { webOk(true); closeModal(true); cfg.onDone(); };
  render();
}

/* ---------------------------------------------------------------------
   Indexation à la main (annuaire inversé), puis requête
   --------------------------------------------------------------------- */
function indexLab(cfg) {
  const b = openModal({ title: cfg.title, wide: true });
  curNotion = cfg.notion;
  const words = Object.keys(cfg.index), ids = cfg.pages.map(p => p.id);
  let first = true;
  b.innerHTML = `<div class="intro">Un moteur de recherche fabrique un <b>annuaire inversé</b> : pour chaque mot, la liste des pages qui le contiennent. Lis les quatre pages, puis coche, pour chaque mot, les pages où il apparaît.</div>
    <div class="idx-pages">${cfg.pages.map(p => `<div class="idx-page"><b>${p.id}</b> ${esc(p.text)}</div>`).join('')}</div>
    <div class="idx-zone"></div><div class="q-fb" hidden></div><div class="q-actions"></div>`;
  const zone = b.querySelector('.idx-zone'), fb = b.querySelector('.q-fb'), act = b.querySelector('.q-actions');
  const grid = (rows, title) => `<table class="idx"><tr><th>${title}</th>${ids.map(i => `<th>${i}</th>`).join('')}</tr>${rows.map(w => `<tr data-w="${esc(w)}"><td><b>${esc(w)}</b></td>${ids.map(i => `<td><input type="checkbox" data-p="${i}" aria-label="${esc(w)} dans ${i}"></td>`).join('')}</tr>`).join('')}</table>`;
  const picked = tr => [...tr.querySelectorAll('input:checked')].map(x => x.dataset.p);
  const same = (a, c) => a.length === c.length && a.every(x => c.includes(x));
  function step1() {
    zone.innerHTML = grid(words, 'Mot');
    act.innerHTML = '<button class="btn primary">Vérifier mon index</button>';
    act.firstChild.onclick = () => {
      const bad = [...zone.querySelectorAll('tr[data-w]')].filter(tr => { const ok = same(picked(tr), cfg.index[tr.dataset.w]); tr.classList.toggle('bad', !ok); return !ok; });
      fb.hidden = false;
      if (bad.length) { webKo(cfg.notion); first = false; fb.className = 'q-fb ko'; fb.innerHTML = `✘ ${bad.length} ligne(s) incorrecte(s), en rouge. Relis les pages : un mot compte même s'il est au milieu d'une phrase.`; return; }
      webOk(first); first = true;
      fb.className = 'q-fb ok'; fb.innerHTML = `✔ <b>Index terminé !</b> C'est exactement ce que fait un moteur, sur des milliards de pages et des millions de mots.`;
      step2();
    };
  }
  function step2() {
    const want = ids.filter(i => cfg.query.every(w => cfg.index[w].includes(i)));
    zone.insertAdjacentHTML('beforeend', `<h4>Requête : « ${esc(cfg.query.join(' '))} »</h4><p class="small">En te servant <b>uniquement de ton index</b>, coche les pages qui contiennent <b>tous</b> les mots de la requête.</p><div class="idx-q">${ids.map(i => `<label class="chip"><input type="checkbox" data-p="${i}"> ${i}</label>`).join('')}</div>`);
    zone.querySelectorAll('table input').forEach(x => { x.disabled = true; });
    act.innerHTML = '<button class="btn primary">Valider la requête</button>';
    act.firstChild.onclick = () => {
      const got = [...zone.querySelectorAll('.idx-q input:checked')].map(x => x.dataset.p);
      fb.hidden = false;
      if (!same(got, want)) { webKo(cfg.notion); first = false; fb.className = 'q-fb ko'; fb.innerHTML = `✘ Pas tout à fait. Prends la ligne « ${esc(cfg.query[0])} » et la ligne « ${esc(cfg.query[1])} » : quelles pages sont cochées dans les deux ?`; return; }
      webOk(first);
      fb.className = 'q-fb ok'; fb.innerHTML = `✔ <b>${want.join(' et ')}</b> contiennent les deux mots. Le moteur n'a pas relu les pages : il a juste croisé deux lignes de son index. Reste à les <b>classer</b>…`;
      act.innerHTML = '<button class="btn primary">Terminer ✔</button>';
      act.firstChild.onclick = () => { closeModal(true); cfg.onDone(); };
    };
  }
  step1();
}

/* ---------------------------------------------------------------------
   Mail d'hameçonnage : survoler le lien pour lire la vraie adresse
   --------------------------------------------------------------------- */
function mailLab(cfg) {
  const b = openModal({ title: cfg.title, wide: true });
  curNotion = 'hameconnage';
  let seen = false;
  const link = `<a href="#" class="mail-link" tabindex="0">${esc(cfg.linkText)}</a>`;
  b.innerHTML = `<div class="goal">🎯 Examine le lien <b>sans cliquer</b> : passe la souris dessus (ou appuie longuement), et regarde en bas de la fenêtre où il mène vraiment.</div>
    <div class="mail"><div class="mail-head"><div><b>De :</b> ${cfg.from}</div><div><b>Objet :</b> ${esc(cfg.subject)}</div></div>
    <div class="mail-body">${cfg.body.replace('{lien}', link)}</div><div class="mail-status" aria-live="polite">&nbsp;</div></div>
    <div class="q-fb" hidden></div><div class="actions"><button class="btn primary" id="ml-go" disabled>J'ai examiné le lien : je réponds à Tanguy</button></div>`;
  const a = b.querySelector('.mail-link'), st = b.querySelector('.mail-status'), fb = b.querySelector('.q-fb');
  const show = () => { st.textContent = '🔗 ' + cfg.linkReal; st.classList.add('on'); if (!seen) { seen = true; b.querySelector('#ml-go').disabled = false; sfx.step(); } };
  const hide = () => { st.innerHTML = '&nbsp;'; st.classList.remove('on'); };
  a.onmouseenter = show; a.onfocus = show; a.onmouseleave = hide; a.onblur = hide;
  a.ontouchstart = show;
  a.onclick = ev => {
    ev.preventDefault(); show();
    fb.hidden = false; fb.className = 'q-fb ko';
    fb.innerHTML = "✋ Tu viens de cliquer ! Dans la vraie vie, tu serais déjà sur la fausse page. Ici, rien ne s'est ouvert : regarde plutôt l'adresse affichée en bas.";
    addScore(-3); recordError('hameconnage'); sfx.ko();
  };
  b.querySelector('#ml-go').onclick = () => { closeModal(true); cfg.onDone(); };
}

/* ---------------------------------------------------------------------
   Paramètres du navigateur + visualisation des traqueurs (façon CookieViz)
   --------------------------------------------------------------------- */
const SETTINGS = [
  { k: 'cookies', label: 'Cookies', opts: [['all', 'Tout accepter'], ['tiers', 'Bloquer les cookies tiers'], ['none', 'Bloquer tous les cookies']], good: 'tiers',
    fb: { all: 'Avec tous les cookies acceptés, les régies publicitaires continuent de pister Nolwenn.', none: "Trop strict : Nolwenn ne pourrait plus rester connectée à sa messagerie ni garder un panier. Seuls les cookies <b>tiers</b> servent au pistage." } },
  { k: 'histo', label: 'Historique', opts: [['keep', "Conserver l'historique"], ['never', 'Ne jamais conserver l\'historique']], good: 'never',
    fb: { keep: "Son fils pourrait voir ses recherches de cadeaux dans l'historique." } },
  { k: 'js', label: 'Programmes (JavaScript) sur <code>promos-chaussures.biz</code>, qui ouvre des fenêtres sans arrêt', opts: [['allow', 'Autoriser'], ['block', 'Interdire']], good: 'block',
    fb: { allow: 'Ce site douteux pourrait continuer à exécuter ses programmes sur l\'ordinateur de Nolwenn.' } },
  { k: 'perm', label: 'Accès des sites à la caméra, au micro et à la position', opts: [['always', 'Toujours autoriser'], ['ask', 'Demander à chaque fois']], good: 'ask',
    fb: { always: "N'importe quel site pourrait allumer la caméra ou connaître sa position sans lui demander." } }
];
function settingsLab(cfg) {
  const b = openModal({ title: cfg.title, wide: true });
  curNotion = 'cookies';
  const v = { cookies: 'all', histo: 'keep', js: 'allow', perm: 'always' };
  let cleared = false, first = true;
  const trackers = () => v.cookies === 'all' ? (cleared ? 9 : 27) : v.cookies === 'tiers' ? 2 : 0;
  b.innerHTML = `<div class="goal">🎯 Nolwenn veut : ne plus être pistée de site en site, que son fils ne voie pas ses recherches, être protégée du site de « promos » douteux… et que ses sites habituels marchent toujours.</div>
    <div class="cookieviz"><div class="cv-title">👁️ Visualiseur de traqueurs : sites tiers contactés en lisant <b>meteo-iroise.bzh</b></div><div class="cv-dots"></div></div>
    <div class="settings">${SETTINGS.map(s => `<div class="set-row" data-k="${s.k}"><div class="set-label">${s.label}</div><div class="set-opts">${s.opts.map(([o, t]) => `<button class="chip" data-o="${o}">${t}</button>`).join('')}</div></div>`).join('')}
    <div class="set-row"><div class="set-label">Données déjà enregistrées</div><div class="set-opts"><button class="chip" id="st-clear">🧹 Effacer l'historique et les cookies existants</button></div></div></div>
    <div class="q-fb" hidden></div><div class="actions"><button class="btn primary" id="st-apply">Appliquer les réglages</button></div>`;
  const fb = b.querySelector('.q-fb');
  function draw() {
    b.querySelectorAll('.set-row[data-k]').forEach(r => r.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', v[r.dataset.k] === c.dataset.o)));
    b.querySelector('#st-clear').classList.toggle('on', cleared);
    if (cleared) b.querySelector('#st-clear').textContent = '✔ Historique et cookies effacés';
    const n = trackers();
    b.querySelector('.cv-dots').innerHTML = `<span class="cv-site">meteo-iroise.bzh</span>${Array.from({ length: n }, (_, i) => `<span class="cv-dot" style="--i:${i}"></span>`).join('')}<b class="cv-n">${n} traqueur${n > 1 ? 's' : ''}</b>`;
  }
  b.querySelectorAll('.set-row[data-k]').forEach(r => r.querySelectorAll('.chip').forEach(c => { c.onclick = () => { v[r.dataset.k] = c.dataset.o; r.classList.remove('bad'); draw(); }; }));
  b.querySelector('#st-clear').onclick = () => { cleared = true; sfx.step(); draw(); };
  b.querySelector('#st-apply').onclick = () => {
    const errs = SETTINGS.filter(s => v[s.k] !== s.good);
    b.querySelectorAll('.set-row[data-k]').forEach(r => r.classList.toggle('bad', errs.some(s => s.k === r.dataset.k)));
    fb.hidden = false;
    if (errs.length || !cleared) {
      webKo('cookies'); first = false; fb.className = 'q-fb ko';
      fb.innerHTML = '✘ Pas encore :<ul>' + errs.map(s => `<li>${s.fb[v[s.k]]}</li>`).join('') + (cleared ? '' : "<li>Les recherches déjà faites sont toujours dans l'historique, et les anciens cookies sont toujours là.</li>") + '</ul>';
      return;
    }
    webOk(first);
    fb.className = 'q-fb ok'; fb.innerHTML = "✔ <b>Réglages parfaits !</b> De 27 traqueurs, on passe à 2 (des services du site lui-même). Nolwenn reste connectée à ses sites, mais elle n'est plus suivie partout.";
    const a = b.querySelector('.actions'); a.innerHTML = '<button class="btn primary">Expliquer à Nolwenn ✔</button>';
    a.firstChild.onclick = () => { closeModal(true); cfg.onDone(); };
  };
  draw();
}
