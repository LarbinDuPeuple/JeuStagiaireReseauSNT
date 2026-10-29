'use strict';
/* =====================================================================
   Mini-jeu « Routeur express » (borne d'arcade, ouverte entre deux parties)
   Un réseau tiré au hasard à chaque partie : on achemine les paquets de
   proche en proche avec les tables de routage locales, malgré les pannes,
   le compteur de sauts et les visios pressées. Le score dépend de la
   vitesse et de la longueur du chemin : pas de score parfait possible.
   ===================================================================== */
const AR = {
  DUREE: 120, // secondes
  TOWNS: ['Brest', 'Morlaix', 'Quimper', 'Lorient', 'Vannes', 'Rennes', 'St-Brieuc', 'Nantes', 'Paris', 'Lannion', 'Carhaix', 'Concarneau'],
  MAJ_TABLES: 6, // secondes avant que les tables tiennent compte d'une panne
  PANNES: [30, 62, 92], // instants des coupures de fibre
  BEST_KEY: 'stagiaire-arcade-best'
};
let arcadeOn = false;
/* sons 8 bits (ondes carrées) */
const arSnd = {
  pick() { tone(660, 0.04, 'square', 0.03); },
  send() { tone(440, 0.04, 'square', 0.03); tone(660, 0.04, 'square', 0.03, 0.04); },
  ok() { tone(784, 0.06, 'square', 0.04); tone(1047, 0.08, 'square', 0.04, 0.06); },
  ko() { tone(196, 0.12, 'square', 0.05); tone(131, 0.18, 'square', 0.05, 0.1); },
  alarm() { for (let i = 0; i < 3; i++) tone(880 - i * 220, 0.08, 'square', 0.04, i * 0.09); },
  bonus() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.07, 'square', 0.04, i * 0.07)); },
  start() { [262, 330, 392, 523].forEach((f, i) => tone(f, 0.09, 'square', 0.04, i * 0.1)); },
  end() { [523, 392, 330, 262, 523].forEach((f, i) => tone(f, 0.12, 'square', 0.04, i * 0.13)); }
};

/* ---------- réseau aléatoire ---------- */
function arNet() {
  const slots = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) slots.push({ c, r });
  const pick = shuffle(slots).slice(0, 10).sort((a, b) => a.r - b.r || a.c - b.c);
  const names = shuffle(AR.TOWNS), nets = shuffle(Array.from({ length: 89 }, (_, i) => i + 11));
  const R = pick.map((s, i) => ({ i, c: s.c, r: s.r, x: 80 + s.c * 160 + rnd(-22, 22), y: 70 + s.r * 130 + rnd(-18, 18), name: names[i], net: nets[i] }));
  const cand = [];
  R.forEach(a => R.forEach(b => { if (a.i < b.i && Math.abs(a.c - b.c) <= 1 && Math.abs(a.r - b.r) <= 1) cand.push([a.i, b.i]); }));
  // arbre couvrant (le réseau est toujours connexe), puis quelques liens en plus, sans croisement de diagonales
  const root = R.map((_, i) => i), find = i => (root[i] === i ? i : (root[i] = find(root[i])));
  const links = [], diag = new Set();
  const diagKey = ([a, b]) => { const A = R[a], B = R[b]; return A.c !== B.c && A.r !== B.r ? `${Math.min(A.c, B.c)},${Math.min(A.r, B.r)}` : null; };
  const add = e => { const k = diagKey(e); if (k) { if (diag.has(k)) return false; diag.add(k); } links.push(e); return true; };
  shuffle(cand).forEach(e => { const [a, b] = e.map(find); if (a !== b && add(e)) root[a] = b; });
  // l'arbre a pu échouer à cause d'une diagonale refusée : on complète avec les liens droits
  cand.filter(e => !diagKey(e)).forEach(e => { const [a, b] = e.map(find); if (a !== b) { links.push(e); root[a] = b; } });
  shuffle(cand).forEach(e => { if (!links.includes(e) && Math.random() < 0.4) add(e); });
  return { R, links: links.map(([a, b]) => ({ a, b, up: true, known: true })) };
}
const arNeighbors = (net, r, field) => net.links.filter(l => l[field] && (l.a === r || l.b === r)).map(l => (l.a === r ? l.b : l.a));
/* distances (en sauts) depuis la destination d, sur les liens connus (tables) ou réels */
function arDist(net, d, field) {
  const dist = net.R.map(() => Infinity); dist[d] = 0;
  const q = [d];
  while (q.length) { const u = q.shift(); arNeighbors(net, u, field).forEach(v => { if (dist[v] === Infinity) { dist[v] = dist[u] + 1; q.push(v); } }); }
  return dist;
}
/* table de routage locale du routeur r : pour chaque réseau, le voisin à qui envoyer */
function arTable(net, r) {
  return net.R.filter(d => d.i !== r).map(d => {
    const dist = arDist(net, d.i, 'known');
    const via = arNeighbors(net, r, 'known').filter(v => dist[v] === dist[r] - 1).sort((a, b) => a - b)[0];
    return { d, via, n: dist[r] };
  });
}
const arConnected = net => arDist(net, 0, 'up').every(x => x < Infinity);

/* ---------- partie ---------- */
function arcade() {
  if (arcadeOff()) { toast("🕹️ La borne est éteinte : ton professeur l'a fermée pour le moment.", '', 5000); return; }
  if (!arcadeOpen()) { toast("🕹️ La borne s'allume quand tu as terminé une partie. Au travail, stagiaire !", '', 5000); return; }
  const b = openModal({ title: '🕹️ ROUTEUR EXPRESS', wide: true });
  $('#modal').classList.add('arcade');
  arIntro(b);
}
/* ouverte entre deux parties et à la fin du stage, sauf si le professeur l'a éteinte */
const arcadeOff = () => ONLINE.on && !!ONLINE.arcadeOff;
const arcadeOpen = () => !!S && (S.pause || S.finished) && !arcadeOff();
function arcadeHint() { if (arcadeOpen()) toast("🕹️ La borne d'arcade <b>Routeur express</b> est allumée (au fond de la hotline, à côté du café) !", 'ok', 8000); }
/* le professeur éteint ou rallume la borne */
function arcadeSwitched() {
  if (!S || !$('#title-screen').hidden) return;
  if (arcadeOff()) {
    if (window.ARCADE_ON) { arcadeOn = false; window.ARCADE_ON = false; closeModal(true); }
    if (S.pause || S.finished) toast("🕹️ Ton professeur a éteint la borne d'arcade.", '', 6000);
  } else arcadeHint();
  if (typeof refreshHUD === 'function') refreshHUD();
}
function arBest() { try { return +localStorage.getItem(AR.BEST_KEY) || 0; } catch (e) { return 0; } }

function arIntro(b) {
  b.innerHTML = `<div class="ar-intro"><div class="ar-logo">ROUTEUR<br>EXPRESS</div><div class="ar-blink">INSERT COIN</div>
    <p><b>Tu es le réseau.</b> Des paquets apparaissent sur les routeurs, chacun avec l'<b>adresse IP</b> de sa destination. Le début de l'adresse (<code>10.42</code>…) désigne le réseau d'arrivée, écrit sous chaque routeur.</p>
    <ol><li>Clique un paquet, puis le <b>routeur voisin</b> où l'envoyer. Recommence jusqu'à son réseau.</li>
    <li>La <b>table de routage</b> du routeur où se trouve le paquet s'affiche à droite : elle indique le voisin à choisir.</li>
    <li>⚡ Des fibres cassent pendant la partie, et les tables mettent quelques secondes à se mettre à jour : à toi de trouver un autre chemin.</li>
    <li>Le chiffre sur un paquet est son <b>compteur de sauts</b> : à 0, il est détruit. <span class="ar-k video">▶</span> Une visio arrivée trop tard ne sert plus à rien (son chrono est affiché). <span class="ar-k file">■</span> Un fichier est en 3 morceaux : livre-les tous. <span class="ar-k data">●</span> Un paquet simple.</li></ol>
    <p>Plus tu livres vite et par le chemin le plus court, plus tu gagnes de points. Le réseau change à chaque partie : réfléchis vite !</p></div>
    <div class="actions"><span class="ar-hi" style="margin-right:auto">HI-SCORE ${String(arBest()).padStart(5, '0')}</span><button class="btn" id="ar-lb">🏆 Classement</button><button class="btn primary" id="ar-go">▶ Jouer (2 min)</button></div>`;
  b.querySelector('#ar-go').onclick = () => arPlay(b);
  b.querySelector('#ar-lb').onclick = () => arBoard(b, null);
}

function arPlay(b) {
  const net = arNet();
  const G = { t: 0, score: 0, pk: [], sel: null, uid: 1, next: 1.5, ok: 0, destroyed: 0, late: 0, dead: 0, detours: 0, files: 0, filesLost: 0, events: [], groups: {}, effSum: 0, pops: [] };
  arcadeOn = true; window.ARCADE_ON = true; arSnd.start();
  b.innerHTML = `<div class="ar-top"><span>TIME <b class="ar-time"></b></span><span>SCORE <b class="ar-score">0</b></span><span>LIVRÉS <b class="ar-ok">0</b></span></div><div class="ar-msg"></div>
    <div class="ar-wrap"><svg class="ar-map" viewBox="0 0 640 390"></svg><div class="ar-side"><div class="ar-info"></div><div class="ar-table"></div></div></div>`;
  const svg = b.querySelector('.ar-map'), side = b.querySelector('.ar-table'), info = b.querySelector('.ar-info'), msg = b.querySelector('.ar-msg');
  const pos = (p) => {
    if (p.move) { const A = net.R[p.move.from], B = net.R[p.move.to], k = Math.min(1, (G.t - p.move.t0) / 0.45); return [A.x + (B.x - A.x) * k, A.y + (B.y - A.y) * k]; }
    const here = G.pk.filter(q => !q.move && q.at === p.at), k = here.indexOf(p), a = -Math.PI / 2 + k * 0.75;
    return [net.R[p.at].x + Math.cos(a) * 36, net.R[p.at].y + Math.sin(a) * 36];
  };
  const flash = (t, cls) => { msg.innerHTML = t; msg.className = 'ar-msg ' + (cls || ''); clearTimeout(flash.h); flash.h = setTimeout(() => { msg.innerHTML = ''; }, 3500); };
  const optHops = (from, to) => arDist(net, to, 'up')[from];
  function spawn() {
    const live = G.pk.length;
    if (live >= 11) return;
    const src = rnd(0, 9); let dst = rnd(0, 9); while (dst === src) dst = rnd(0, 9);
    const opt = optHops(src, dst);
    const ip = `10.${net.R[dst].net}.${rnd(0, 255)}.${rnd(1, 254)}`;
    const mk = (kind, extra) => ({ id: G.uid++, kind, at: src, dst, ip, ttl: opt + 2, hops: 0, born: G.t, opt, ...extra });
    if (G.t > 15 && Math.random() < 0.3 && live <= 8) { const g = G.uid; G.groups[g] = { n: 3, ok: 0 }; [1, 2, 3].forEach(n => G.pk.push(mk('file', { g, part: n }))); }
    else G.pk.push(mk(G.t > 8 && Math.random() < 0.4 ? 'video' : 'data'));
  }
  function cut() {
    const ups = shuffle(net.links.filter(l => l.up));
    for (const l of ups) {
      l.up = false;
      if (arConnected(net)) {
        flash(`⚡ Fibre <b>${net.R[l.a].name} – ${net.R[l.b].name}</b> coupée ! Les tables ne le savent pas encore…`, 'warn');
        arSnd.alarm();
        G.events.push({ at: G.t + AR.MAJ_TABLES, f: () => { l.known = false; flash('🔄 Les tables de routage ont été mises à jour.'); } });
        G.events.push({ at: G.t + 20, f: () => { l.up = true; flash(`🔧 Fibre ${net.R[l.a].name} – ${net.R[l.b].name} réparée.`); } });
        G.events.push({ at: G.t + 20 + AR.MAJ_TABLES, f: () => { l.known = true; } });
        return;
      }
      l.up = true;
    }
  }
  AR.PANNES.forEach(t => G.events.push({ at: t, f: cut }));
  function deliver(p) {
    G.pk = G.pk.filter(q => q !== p);
    const eff = p.opt / p.hops, dt = G.t - p.born;
    const tf = clamp(1 - (dt - p.opt * 1.2) / (p.kind === 'video' ? 8 : 20), 0.25, 1);
    const pts = Math.round(100 * eff * tf * (p.kind === 'video' ? 1.5 : 1));
    G.score += pts; G.ok++; G.effSum += eff;
    if (p.hops > p.opt) G.detours++;
    if (p.kind === 'file') { const gr = G.groups[p.g]; if (gr) { gr.ok++; if (gr.ok === 3) { G.score += 60; G.files++; arSnd.bonus(); flash('■ Fichier complet : les 3 morceaux sont arrivés (+60) !', 'ok'); } } }
    arSnd.ok();
    G.pops.push({ x: net.R[p.at].x, y: net.R[p.at].y - 26, t: G.t, txt: '+' + pts });
    if (G.sel === p.id) G.sel = null;
  }
  function lose(p, why) {
    G.pk = G.pk.filter(q => q !== p);
    if (why === 'ttl') { G.destroyed++; G.score -= 40; flash('💥 Paquet détruit : son compteur de sauts est tombé à 0 (−40).', 'warn'); }
    else { G.late++; G.score -= 30; flash('▶ Visio arrivée trop tard : image perdue (−30).', 'warn'); }
    if (p.kind === 'file' && G.groups[p.g]) { delete G.groups[p.g]; G.filesLost++; }
    arSnd.ko();
    G.pops.push({ x: net.R[p.at].x, y: net.R[p.at].y - 26, t: G.t, txt: why === 'ttl' ? '-40' : '-30', bad: true });
    if (G.sel === p.id) G.sel = null;
  }
  function send(p, to) {
    if (p.move) return;
    const n = arNeighbors(net, p.at, 'known').concat(arNeighbors(net, p.at, 'up'));
    const linked = net.links.find(l => (l.a === p.at && l.b === to) || (l.b === p.at && l.a === to));
    if (!linked) { flash(`${net.R[to].name} n'est pas un voisin de ${net.R[p.at].name}.`); return; }
    if (!linked.up) { G.dead++; G.score -= 10; arSnd.ko(); flash(`🔌 La fibre ${net.R[p.at].name} – ${net.R[to].name} est coupée ! Trouve un autre chemin (−10).`, 'warn'); return; }
    if (!n.length) return;
    p.move = { from: p.at, to, t0: G.t }; arSnd.send();
  }
  function step(dt) {
    G.t += dt;
    G.events.filter(e => e.at <= G.t).forEach(e => { e.f(); e.done = true; });
    G.events = G.events.filter(e => !e.done);
    G.next -= dt;
    if (G.next <= 0) { spawn(); G.next = Math.max(1.0, 3.0 - G.t * 0.018); }
    G.pk.slice().forEach(p => {
      if (p.move && G.t - p.move.t0 >= 0.45) {
        p.at = p.move.to; p.move = null; p.hops++; p.ttl--;
        if (p.at === p.dst) deliver(p);
        else if (p.ttl <= 0) lose(p, 'ttl');
      }
      if (G.pk.includes(p) && p.kind === 'video' && G.t - p.born > 10 + p.opt) lose(p, 'late');
    });
  }
  function draw() {
    const sel = G.pk.find(p => p.id === G.sel);
    const nb = sel && !sel.move ? arNeighbors(net, sel.at, 'up').concat(net.links.filter(l => !l.up && (l.a === sel.at || l.b === sel.at)).map(l => (l.a === sel.at ? l.b : l.a))) : [];
    let h = net.links.map(l => { const A = net.R[l.a], B = net.R[l.b]; return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="ar-link ${l.up ? '' : 'down'}"/>`; }).join('');
    h += net.R.map(r => `<g class="ar-r ${nb.includes(r.i) ? 'nb' : ''} ${sel && sel.at === r.i && !sel.move ? 'here' : ''} ${sel && sel.dst === r.i ? 'dst' : ''}" data-r="${r.i}"><rect x="${r.x - 18}" y="${r.y - 18}" width="36" height="36"/><rect class="ar-led" x="${r.x - 10}" y="${r.y - 4}" width="6" height="6"/><rect class="ar-led" x="${r.x - 1}" y="${r.y - 4}" width="6" height="6"/><rect class="ar-led" x="${r.x + 8}" y="${r.y - 4}" width="4" height="6"/><text x="${r.x}" y="${r.y + 32}" class="ar-name">${r.name.toUpperCase()}</text><text x="${r.x}" y="${r.y + 44}" class="ar-net">10.${r.net}</text></g>`).join('');
    h += G.pk.map(p => {
      const [x, y] = pos(p), urg = p.kind === 'video' ? Math.max(0, 10 + p.opt - (G.t - p.born)) : null;
      return `<g class="ar-p ${p.kind} ${p.id === G.sel ? 'sel' : ''} ${p.ttl <= 1 ? 'crit' : ''}" data-p="${p.id}"><rect x="${x - 26}" y="${y - 10}" width="52" height="20"/><text x="${x}" y="${y + 4}">${p.kind === 'video' ? '▶' : p.kind === 'file' ? '■' : '●'}${p.ttl}${urg !== null ? ` ${Math.ceil(urg)}s` : ''}</text></g>`;
    }).join('');
    G.pops = G.pops.filter(o => G.t - o.t < 1);
    h += G.pops.map(o => `<text class="ar-pop ${o.bad ? 'bad' : ''}" x="${o.x}" y="${o.y - (G.t - o.t) * 30}" opacity="${1 - (G.t - o.t)}">${o.txt}</text>`).join('');
    svg.innerHTML = h;
    b.querySelector('.ar-time').textContent = Math.max(0, Math.ceil(AR.DUREE - G.t)) + ' s';
    b.querySelector('.ar-score').textContent = G.score;
    b.querySelector('.ar-ok').textContent = G.ok;
    if (sel) {
      const here = net.R[sel.move ? sel.move.to : sel.at];
      info.innerHTML = `<div class="ar-pk">${sel.kind === 'video' ? '<span class="ar-k video">▶</span> VISIO' : sel.kind === 'file' ? `<span class="ar-k file">■</span> FICHIER ${sel.part}/3` : '<span class="ar-k data">●</span> PAQUET'} → <b>${sel.ip}</b><br><span class="small">Sur : ${esc(here.name)} · sauts restants : <b>${sel.ttl}</b></span></div>`;
      if (side.dataset.r !== String(here.i) || side.dataset.k !== net.links.map(l => +l.known).join('')) {
        side.dataset.r = here.i; side.dataset.k = net.links.map(l => +l.known).join('');
        side.innerHTML = `<div class="ar-th">Table de routage de <b>${esc(here.name)}</b></div><table><tr><th>Réseau</th><th>Envoyer vers</th></tr>${arTable(net, here.i).sort((x, y) => x.d.net - y.d.net).map(e => `<tr><td>10.${e.d.net}</td><td>${e.via === undefined ? '—' : esc(net.R[e.via].name)}</td></tr>`).join('')}</table>`;
      }
    } else { info.innerHTML = '<div class="ar-pk muted small">Clique un paquet pour le prendre en main.</div>'; side.innerHTML = ''; side.dataset.r = ''; }
  }
  svg.addEventListener('pointerdown', ev => {
    const pe = ev.target.closest('[data-p]'), re = ev.target.closest('[data-r]');
    if (pe) { const p = G.pk.find(q => q.id === +pe.dataset.p); if (p) { G.sel = p.id; arSnd.pick(); } return; }
    if (!re) return;
    const r = +re.dataset.r, sel = G.pk.find(p => p.id === G.sel);
    if (sel && !sel.move && sel.at !== r) { send(sel, r); return; }
    // clic sur un routeur sans paquet choisi : on prend le paquet le plus pressé qui s'y trouve
    const here = G.pk.filter(p => !p.move && p.at === r).sort((x, y) => (x.kind === 'video' ? 0 : 1) - (y.kind === 'video' ? 0 : 1) || x.ttl - y.ttl);
    if (here.length) { G.sel = here[0].id; arSnd.pick(); }
  });
  let last = performance.now();
  function frame(now) {
    if (!arcadeOn) return;
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (!ONLINE.locked && !document.hidden) step(dt);
    draw();
    if (G.t >= AR.DUREE) { arEnd(b, G); return; }
    requestAnimationFrame(frame);
  }
  modalOnClose = () => { arcadeOn = false; window.ARCADE_ON = false; };
  spawn(); draw(); requestAnimationFrame(frame);
}

function arEnd(b, G) {
  arcadeOn = false; window.ARCADE_ON = false; arSnd.end();
  G.score = Math.max(0, G.score);
  const prev = arBest(), rec = G.score > prev;
  if (rec) try { localStorage.setItem(AR.BEST_KEY, String(G.score)); } catch (e) { /* rien */ }
  const tips = [];
  if (G.destroyed) tips.push(`💥 <b>${G.destroyed} paquet(s) détruit(s)</b> : leur compteur de sauts est arrivé à 0. Un paquet qui tourne en rond encombrerait le réseau : c'est pour ça qu'il est détruit.`);
  if (G.late) tips.push(`🎥 <b>${G.late} visio(s) arrivée(s) trop tard</b> : Internet ne garantit pas le délai d'arrivée. Pour une visio, une image en retard ne sert plus à rien : il fallait la traiter en premier.`);
  if (G.dead) tips.push(`🔌 <b>${G.dead} envoi(s) sur une fibre coupée</b> : après une panne, les tables mettent quelques secondes à se mettre à jour. En attendant, il fallait choisir un autre voisin.`);
  if (G.detours) tips.push(`🧭 <b>${G.detours} paquet(s) livré(s) par un détour</b> : moins de points. La table de routage donne le voisin du chemin le plus court.`);
  if (G.filesLost) tips.push(`📄 <b>${G.filesLost} fichier(s) incomplet(s)</b> : il manque un morceau. C'est le travail de TCP de redemander les paquets perdus.`);
  if (!tips.length) tips.push('👏 Aucune erreur : chemins courts, visios à l\'heure, aucune perte. Reste à aller encore plus vite !');
  b.innerHTML = `<div class="ar-end"><div class="ar-logo small">${rec ? 'NEW HI-SCORE !' : 'GAME OVER'}</div>
    <div class="stats"><div><b>${G.score}</b><span>points</span></div><div><b>${G.ok}</b><span>paquets livrés</span></div><div><b>${G.ok ? Math.round(100 * G.effSum / G.ok) : 0} %</b><span>efficacité des chemins</span></div><div><b>${G.files}</b><span>fichiers complets</span></div><div><b>${Math.max(prev, G.score)}</b><span>ton record</span></div></div>
    <h4>Ce qu'il faut retenir de ta partie</h4><ul class="ar-tips">${tips.map(t => `<li>${t}</li>`).join('')}</ul></div>
    <div class="actions"><button class="btn" id="ar-lb">🏆 Classement</button><button class="btn" id="ar-quit">Retour au stage</button><button class="btn primary" id="ar-again">↺ Rejouer</button></div>`;
  b.querySelector('#ar-again').onclick = () => arPlay(b);
  b.querySelector('#ar-quit').onclick = () => closeModal();
  b.querySelector('#ar-lb').onclick = () => arBoard(b, G.score);
  if (ONLINE.saveScore) ONLINE.saveScore(G.score);
}

/* classement : meilleur score de chaque élève de la classe, et podium des classes */
async function arBoard(b, last) {
  b.innerHTML = '<p class="muted">⏳ Chargement du classement…</p>';
  const all = ONLINE.loadScores ? await ONLINE.loadScores() : null;
  const back = '<div class="actions"><button class="btn" id="ar-back">← Retour</button><button class="btn primary" id="ar-again">▶ Jouer</button></div>';
  if (!all) {
    b.innerHTML = `<p>Le classement n'est disponible qu'en ligne. Ton record sur cet ordinateur : <b>${arBest()}</b> points.</p>${back}`;
  } else {
    const me = partieKey(S.name, S.classe);
    const mine = all.filter(s => classeId(s.classe) === classeId(S.classe)).sort((x, y) => y.best - x.best);
    const by = {};
    all.forEach(s => { (by[s.classe] = by[s.classe] || []).push(s.best); });
    const classes = Object.entries(by).map(([c, v]) => { const top = v.sort((x, y) => y - x).slice(0, 5); return { c, moy: Math.round(top.reduce((t, x) => t + x, 0) / top.length), n: v.length }; }).sort((x, y) => y.moy - x.moy);
    const medal = i => ['1ST', '2ND', '3RD'][i] || `${i + 1}TH`;
    b.innerHTML = `<div class="ar-board"><div><h4>HI-SCORES ${esc(S.classe).toUpperCase()}</h4><table><tr><th></th><th>Élève</th><th>Record</th></tr>${mine.slice(0, 15).map((s, i) => `<tr class="${s.id === me ? 'me' : ''}"><td>${medal(i)}</td><td>${esc(s.nom)}</td><td>${String(s.best).padStart(5, '0')}</td></tr>`).join('') || '<tr><td colspan="3" class="muted">Personne encore : à toi de jouer !</td></tr>'}</table></div>
      <div><h4>BATAILLE DES CLASSES</h4><p class="muted small">Moyenne des 5 meilleurs records de chaque classe.</p><table><tr><th></th><th>Classe</th><th>Moyenne</th></tr>${classes.map((c, i) => `<tr class="${classeId(c.c) === classeId(S.classe) ? 'me' : ''}"><td>${medal(i)}</td><td>${esc(c.c)}</td><td>${c.moy}</td></tr>`).join('')}</table></div></div>
      ${last != null ? `<p class="muted small">Ta dernière partie : ${last} points.</p>` : ''}${back}`;
  }
  b.querySelector('#ar-back').onclick = () => arIntro(b);
  b.querySelector('#ar-again').onclick = () => arPlay(b);
}
