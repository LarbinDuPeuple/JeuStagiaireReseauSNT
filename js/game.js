'use strict';
/* =====================================================================
   Le Stagiaire du Bout du Monde — moteur du jeu
   Adapté du moteur du « Stagiaire Réseau » (STI2D) : rendu isométrique,
   déplacements, interface, réseau simulé d'un fournisseur d'accès,
   déroulement des missions et des tickets de la hotline.
   ===================================================================== */

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rand = a => a[Math.floor(Math.random() * a.length)];
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

/* ---------------------------------------------------------------------
   Carte et entités
   --------------------------------------------------------------------- */
const TW = 64, TH = 32;
const MAP = [
  '######################',
  '#ssssss#ccccccccccccc#',
  '#ssssss#ccccccccccccc#',
  '#ssssss#ccccccccccccc#',
  '#ssssss#ccccccccccccc#',
  '#ssssss#ccccccccccccc#',
  '####d######d##########',
  '#hhhhhhhhhhhhhhhhhhhh#',
  '#hhhhhhhhhh#mmmmmmmmm#',
  '#hhhhhhhhhh#mmmmmmmmm#',
  '#hhhhhhhhhh#mmmmmmmmm#',
  '#hhhhhhhhhh#mmmmmmmmm#',
  '#hhhhhhhhhh#mmmmmmmmm#',
  '#hhhhhhhhhh#mmmmmmmmm#',
  '#hhhhhhhhhh#mmmmmmmmm#',
  '######################'
];
const MH = MAP.length, MW = MAP[0].length;
const FLOOR = { s: ['#c9d4e0', '#c0ccd9'], c: ['#efe2ca', '#e8d8bc'], h: ['#e7e4dd', '#dfdbd3'], d: ['#e7e4dd', '#dfdbd3'], m: ['#d3e3ef', '#c9dbe9'] };
const ROOMS = [{ n: 'SALLE DES MACHINES', x: 3.5, y: 3.6 }, { n: 'HOTLINE', x: 14.5, y: 4.4 }, { n: 'ATELIER', x: 5.5, y: 13.6 }, { n: 'SUPERVISION', x: 16.5, y: 14.2 }];

const ENTS = [
  { id: 'baie_brest', kind: 'rack', x: 2, y: 1, name: 'Routeur de Brest (cœur du réseau)', h: 86 },
  { id: 'baie_dns', kind: 'server', x: 4, y: 1, name: "Serveur DNS d'IroiseNet", h: 72 },
  { id: 'baie_ntp', kind: 'server', x: 5, y: 1, name: 'Serveur de temps (NTP)', h: 72 },
  { id: 'plante1', kind: 'plant', x: 1, y: 5, deco: true },
  { id: 'mon_pc', kind: 'pc', x: 10, y: 2, name: 'Ton poste (hotline)', h: 50 },
  { id: 'telephone', kind: 'phone', x: 11, y: 2, name: 'Téléphone de la hotline', h: 34 },
  { id: 'pc_erwan', kind: 'pc', x: 14, y: 2, name: "Poste d'Erwan", h: 50 },
  { id: 'pc_maelys', kind: 'pc', x: 17, y: 2, name: 'Poste de Maëlys', h: 50 },
  { id: 'cafe', kind: 'coffee', x: 20, y: 1, name: 'Machine à café', h: 50 },
  { id: 'plante2', kind: 'plant', x: 20, y: 5, deco: true },
  { id: 'plante3', kind: 'plant', x: 1, y: 7, deco: true },
  { id: 'plante4', kind: 'plant', x: 20, y: 7, deco: true },
  { id: 'etabli', kind: 'bench', x: 3, y: 10, name: "Établi de l'atelier", h: 40 },
  { id: 'frise', kind: 'board', x: 1, y: 12, name: "Panneau : l'histoire d'Internet", h: 66 },
  { id: 'plante5', kind: 'plant', x: 10, y: 14, deco: true },
  { id: 'ecran', kind: 'screen', x: 16, y: 8, name: 'Grand écran de supervision', h: 92 },
  { id: 'pc_soizic', kind: 'pc', x: 14, y: 10, name: 'Poste de Soizic', h: 50 },
  { id: 'plante6', kind: 'plant', x: 20, y: 13, deco: true },
  { id: 'gwen', kind: 'person', x: 6, y: 9 },
  { id: 'loic', kind: 'person', x: 4, y: 11 },
  { id: 'erwan', kind: 'person', x: 14, y: 3, seated: true },
  { id: 'maelys', kind: 'person', x: 17, y: 3, seated: true },
  { id: 'soizic', kind: 'person', x: 14, y: 11, seated: true }
];
const EBY = {};
ENTS.forEach(e => { EBY[e.id] = e; if (e.kind === 'person') { e.name = PEOPLE[e.id].name; e.h = 56; } });
const entName = id => (EBY[id] && EBY[id].name) || id;

const occupied = Array.from({ length: MH }, () => Array(MW).fill(false));
ENTS.forEach(e => { occupied[e.y][e.x] = true; });
const walkable = (x, y) => x >= 0 && y >= 0 && x < MW && y < MH && MAP[y][x] !== '#' && !occupied[y][x];

/* ---------------------------------------------------------------------
   État de la partie (sauvegardé dans le navigateur)
   --------------------------------------------------------------------- */
const SAVE_KEY = 'stagiaire-bout-du-monde-v1';
let S = null;

function newState(name = '', classe = '') {
  return {
    v: 1, name, classe, m: 0, s: 0, sp: {},
    net: { dnsUp: true, boxOff: {}, cut: null, routerDown: null, ddos: false },
    px: 8.5, py: 12.5, score: 0, sat: 70, t: 0, errors: {}, quizOk: 0, quizKo: 0, ring: false,
    notions: [], tickets: [], seen: {}, incOk: 0, incTotal: 0, incLate: 0, nextInc: null, uid: 1,
    finished: false, pause: false, settings: { inc: 'normal', sound: true }
  };
}
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* stockage indisponible */ } }
function loadSave() { try { const r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }

/* ---------------------------------------------------------------------
   Réseau simulé
   --------------------------------------------------------------------- */
const isIP = s => /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(s) && s.split('.').every(n => +n <= 255 && String(+n) === n);
const linkKey = (a, b) => [a, b].sort().join('-');
const CUT_KEY = { 'morlaix-rennes': linkKey('morlaix', 'rennes') };

function activeLinks(cut) {
  const c = cut === undefined ? S.net.cut : cut;
  return LINKS.filter(([a, b]) => linkKey(a, b) !== (CUT_KEY[c] || c) && S.net.routerDown !== a && S.net.routerDown !== b);
}
const neighbors = (r, links) => links.filter(l => l[0] === r || l[1] === r).map(l => (l[0] === r ? l[1] : l[0]));

/* plus court chemin (en km) : c'est ce que les routeurs calculent en échangeant avec leurs voisins */
function shortest(from, to, links) {
  if (from === to) return [from];
  const dist = { [from]: 0 }, prev = {}, todo = new Set(Object.keys(ROUTERS));
  while (todo.size) {
    let u = null;
    todo.forEach(r => { if (dist[r] !== undefined && (u === null || dist[r] < dist[u])) u = r; });
    if (u === null) break;
    todo.delete(u);
    if (u === to) break;
    links.filter(l => l[0] === u || l[1] === u).forEach(l => {
      const v = l[0] === u ? l[1] : l[0], d = dist[u] + l[2];
      if (dist[v] === undefined || d < dist[v]) { dist[v] = d; prev[v] = u; }
    });
  }
  if (dist[to] === undefined) return null;
  const p = [to];
  while (p[0] !== from) p.unshift(prev[p[0]]);
  return p;
}
function routingTable(r, links, bug) {
  const t = {};
  Object.keys(ROUTERS).forEach(d => {
    if (d === r) return;
    const p = shortest(r, d, links);
    t[d] = p ? p[1] : null;
  });
  if (bug && bug[r]) Object.assign(t, bug[r]);
  return t;
}

Object.entries(ROUTERS).forEach(([id, r]) => { HOST_AT[r.ip] = id; });
const REVERSE = {};
Object.entries(DNS_RECORDS).forEach(([n, ip]) => { if (!REVERSE[ip]) REVERSE[ip] = n; });

function resolve(cl, name) {
  name = name.toLowerCase().replace(/\.$/, '');
  if (isIP(name)) return { ip: name };
  if (!S.net.dnsUp || S.net.boxOff[cl]) return { err: 'timeout' };
  if (!reachRouter(cl, 'brest')) return { err: 'timeout' };
  const ip = DNS_RECORDS[name];
  return ip ? { ip } : { err: 'nx' };
}
function reachRouter(cl, r) {
  const c = CLIENTS[cl];
  if (S.net.boxOff[cl] || S.net.routerDown === c.at) return null;
  return shortest(c.at, r, activeLinks());
}
/* chemin complet d'un client vers une adresse IP : liste d'étapes [nom, ip] */
function pathTo(cl, ip) {
  const c = CLIENTS[cl];
  if (S.net.boxOff[cl]) return { err: 'nobox' };
  const hops = [];
  if (cl !== 'mon_pc') hops.push(['box', c.gw]);
  if (ip === c.gw) return { hops };
  if (S.net.routerDown === c.at) return { hops, err: 'cut' };
  const dst = HOST_AT[ip];
  if (!dst) return { hops, err: 'unknown' };
  const p = shortest(c.at, dst, activeLinks());
  if (!p) return { hops, err: 'cut' };
  p.forEach(r => hops.push([`routeur-${r}.iroisenet.bzh`, ROUTERS[r].ip]));
  if (ip !== ROUTERS[dst].ip) hops.push([REVERSE[ip] || ip, ip]);
  return { hops, routers: p };
}
function latency(cl, routers) {
  let ms = 2;
  (routers || []).forEach((r, i) => {
    if (i === 0) return;
    const l = LINKS.find(k => linkKey(k[0], k[1]) === linkKey(routers[i - 1], r));
    ms += l ? (l[3] === 'radio' ? rnd(380, 900) : Math.round(l[2] / 60) + 1) : 2;
  });
  if (CLIENTS[cl].wifi) ms += rnd(1, 4);
  return ms;
}

/* commandes du terminal : renvoie { lines, type, ok, query, hops } */
function execCmd(cl, raw) {
  const cmd = raw.trim().replace(/\s+/g, ' ');
  const [c0, ...args] = cmd.split(' ');
  const c = (c0 || '').toLowerCase();
  const C = CLIENTS[cl];
  const pad = (l, v) => `   ${(l + ' ' + '. '.repeat(20)).slice(0, 34)}: ${v}`;
  if (!c) return { lines: [] };
  if (c === 'aide' || c === 'help' || c === '?') return { lines: ['Commandes disponibles :', '  ipconfig              affiche la configuration réseau de l\'ordinateur', '  ping <adresse|nom>    teste si une machine répond', '  nslookup <nom|IP>     interroge le serveur DNS (dans les deux sens)', '  tracert <adresse|nom> affiche les routeurs traversés', '  cls                   efface l\'écran'] };
  if (c === 'cls' || c === 'clear') return { lines: [], clear: true };
  if (c === 'ipconfig') {
    const L = ['Configuration IP de Windows', '', C.wifi ? 'Carte réseau sans fil Wi-Fi :' : 'Carte Ethernet :', ''];
    if (S.net.boxOff[cl]) { L.push(pad('Statut du média', 'Média déconnecté')); return { lines: L, type: 'ipconfig', ok: false }; }
    L.push(pad('Adresse IPv4', C.ip), pad('Masque de sous-réseau', '255.255.255.0'), pad('Passerelle par défaut', C.gw), pad('Serveurs DNS', C.dns));
    return { lines: L, type: 'ipconfig', ok: true };
  }
  if (c === 'ping') {
    const target = (args[0] || '').toLowerCase();
    if (!target) return { lines: ['Syntaxe : ping <adresse IP ou nom>', 'Exemple : ping wikipedia.fr'] };
    let ip = target;
    const named = !isIP(target);
    if (named && /^[\d.]+$/.test(target)) return { lines: [`La requête Ping n'a pas pu trouver l'hôte ${target}.`] };
    if (named) {
      const r = resolve(cl, target);
      if (r.err) return { lines: [`La requête Ping n'a pas pu trouver l'hôte ${target}. Vérifiez le nom et essayez à nouveau.`], type: 'ping', ok: false, query: target };
      ip = r.ip;
    }
    const L = [named ? `Envoi d'une requête 'ping' sur ${target} [${ip}] avec 32 octets de données :` : `Envoi d'une requête 'Ping'  ${ip} avec 32 octets de données :`];
    const p = ip === C.ip ? { hops: [] } : pathTo(cl, ip);
    let ok = 0;
    const down = (S.net.ddos && ip === DNS_RECORDS['mairie-brest.bzh']);
    for (let i = 0; i < 4; i++) {
      if (p.err === 'nobox') L.push("Échec de la transmission. Défaillance générale.");
      else if (p.err === 'cut') L.push(`Réponse de ${C.gw} : Impossible de joindre l'hôte de destination.`);
      else if (p.err || down) L.push("Délai d'attente de la demande dépassé.");
      else { ok++; L.push(`Réponse de ${ip} : octets=32 temps=${ip === C.ip ? '<1' : latency(cl, p.routers)} ms TTL=${64 - (p.routers ? p.routers.length : 0)}`); }
    }
    L.push('', `Statistiques Ping pour ${ip}:`, `    Paquets : envoyés = 4, reçus = ${ok}, perdus = ${4 - ok} (perte ${(4 - ok) * 25}%)`);
    return { lines: L, type: 'ping', ok: ok > 0, query: target, slow: true };
  }
  if (c === 'nslookup') {
    const q = (args[0] || '').toLowerCase();
    if (!q) return { lines: ['Syntaxe : nslookup <nom ou adresse IP>', 'Exemples : nslookup wikipedia.fr   ou   nslookup 185.15.58.224'] };
    if (S.net.boxOff[cl]) return { lines: ["*** Impossible de joindre le serveur DNS : l'ordinateur n'est pas connecté."], type: 'nslookup', ok: false, query: q };
    if (!S.net.dnsUp || !reachRouter(cl, 'brest')) return { lines: ['DNS request timed out.', `*** Le délai d'attente de la demande vers ${C.dns} est dépassé.`], type: 'nslookup', ok: false, query: q };
    const head = ['Serveur :   dns.iroisenet.bzh', `Address:  ${C.dns}`, ''];
    if (isIP(q)) {
      const n = REVERSE[q];
      if (!n) return { lines: head.concat([`*** dns.iroisenet.bzh ne parvient pas à trouver ${q} : Non-existent domain`]), type: 'nslookup', ok: false, query: q };
      return { lines: head.concat([`Nom :    ${n}`, `Address:  ${q}`]), type: 'nslookup', ok: true, query: q };
    }
    const ip = DNS_RECORDS[q];
    if (!ip) return { lines: head.concat([`*** dns.iroisenet.bzh ne parvient pas à trouver ${q} : Non-existent domain`]), type: 'nslookup', ok: false, query: q };
    return { lines: head.concat(['Réponse ne faisant pas autorité :', `Nom :    ${q}`, `Address:  ${ip}`]), type: 'nslookup', ok: true, query: q };
  }
  if (c === 'tracert' || c === 'traceroute') {
    const target = (args[0] || '').toLowerCase();
    if (!target) return { lines: ['Syntaxe : tracert <adresse IP ou nom>', 'Exemple : tracert wikipedia.fr'] };
    const r = resolve(cl, target);
    if (r.err) return { lines: [`Impossible de résoudre le nom système de la cible ${target}.`], type: 'tracert', ok: false, query: target };
    const p = pathTo(cl, r.ip);
    const L = [`Détermination de l'itinéraire vers ${REVERSE[r.ip] || r.ip} [${r.ip}]`, 'avec un maximum de 30 sauts :', ''];
    const off = cl === 'mon_pc' ? 0 : 1;
    (p.hops || []).forEach(([n, ip], i) => {
      const rs = p.routers ? p.routers.slice(0, Math.min(p.routers.length, i - off + 1)) : [];
      const ms = i < off ? rnd(1, 3) : latency(cl, rs);
      L.push(`  ${String(i + 1).padStart(2)}    ${String(ms).padStart(3)} ms   ${n} [${ip}]`);
    });
    if (p.err) { L.push(`  ${String((p.hops || []).length + 1).padStart(2)}      *        Délai d'attente de la demande dépassé.`, '', 'Itinéraire interrompu.'); return { lines: L, type: 'tracert', ok: false, query: target, slow: true }; }
    L.push('', 'Itinéraire déterminé.');
    return { lines: L, type: 'tracert', ok: true, query: target, hops: p.hops.length, slow: true };
  }
  return { lines: [`'${c0}' n'est pas reconnu en tant que commande. Tape « aide » pour la liste des commandes.`] };
}

/* ---------------------------------------------------------------------
   Sons (Web Audio)
   --------------------------------------------------------------------- */
let AC = null;
function tone(f, d, type = 'sine', v = 0.08, delay = 0) {
  if (!S || !S.settings.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + delay;
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + 0.02);
  } catch (e) { /* audio indisponible */ }
}
const sfx = {
  ok() { tone(660, 0.12); tone(880, 0.18, 'sine', 0.08, 0.1); },
  ko() { tone(180, 0.25, 'square', 0.04); },
  step() { tone(523, 0.1); tone(659, 0.1, 'sine', 0.08, 0.1); tone(784, 0.25, 'sine', 0.08, 0.2); },
  plug() { tone(1200, 0.04, 'square', 0.03); tone(900, 0.05, 'square', 0.03, 0.05); },
  ring() { for (let i = 0; i < 3; i++) { tone(950, 0.12, 'triangle', 0.06, i * 0.5); tone(760, 0.12, 'triangle', 0.06, i * 0.5 + 0.14); } }
};

/* ---------------------------------------------------------------------
   Rendu isométrique
   --------------------------------------------------------------------- */
const cv = $('#view'), ctx = cv.getContext('2d');
const cam = { s: 1, tx: 0, ty: 0, dpr: 1 };
let picks = [], hoverId = null, animT = 0;

const w2s = (x, y, z = 0) => [(x - y) * TW / 2, (x + y) * TH / 2 - z];
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  if (f < 1) { r *= f; g *= f; b *= f; } else { r += (255 - r) * (f - 1); g += (255 - g) * (f - 1); b += (255 - b) * (f - 1); }
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}
function poly(pts, fill, stroke) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}
const EDGE = 'rgba(0,0,0,0.10)';
function box(x, y, z, w, d, h, col) {
  const p = w2s;
  poly([p(x, y + d, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x, y + d, z + h)], shade(col, 0.84), EDGE);
  poly([p(x + w, y, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x + w, y, z + h)], shade(col, 0.7), EDGE);
  poly([p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)], shade(col, 1.1), EDGE);
}
const faceY = (x, y, z, w, d) => (u, v) => w2s(x + u * w, y + d, z + v); // face avant gauche
const faceX = (x, y, z, w, d) => (u, v) => w2s(x + w, y + u * d, z + v); // face avant droite
function quad(f, u0, u1, v0, v1, col) { poly([f(u0, v0), f(u1, v0), f(u1, v1), f(u0, v1)], col); }
function dot(pt, r, col) { ctx.beginPath(); ctx.arc(pt[0], pt[1], r, 0, 7); ctx.fillStyle = col; ctx.fill(); }
const blink = (hz = 2) => Math.floor(animT * hz) % 2 === 0;
const alarm = () => !!(S.net.routerDown || S.net.ddos || !S.net.dnsUp);

function drawDesk(x, y) { box(x + 0.06, y + 0.12, 0, 0.88, 0.76, 24, '#c08a57'); }
function drawPC(e) {
  const { x, y } = e;
  drawDesk(x, y);
  box(x + 0.62, y + 0.18, 0, 0.22, 0.5, 22, '#3b3f47');
  box(x + 0.44, y + 0.42, 24, 0.12, 0.08, 6, '#2a2e35');
  box(x + 0.22, y + 0.36, 30, 0.56, 0.07, 22, '#2a2e35');
  const f = faceY(x + 0.22, y + 0.36, 30, 0.56, 0.07);
  quad(f, 0.07, 0.93, 3, 19, e.id === 'mon_pc' ? '#1f2a3a' : '#5aa9ff');
  if (e.id === 'mon_pc') { quad(f, 0.12, 0.5, 14, 16, '#7ee0a1'); quad(f, 0.12, 0.7, 9, 11, '#7ee0a1'); quad(f, 0.12, 0.35, 5, 7, '#7ee0a1'); }
  else { quad(f, 0.15, 0.6, 14, 16, '#d6e9ff'); quad(f, 0.15, 0.45, 9, 11, '#d6e9ff'); }
  box(x + 0.26, y + 0.56, 24, 0.44, 0.14, 2, '#e4e6ea');
}
function drawRack(e) {
  const { x, y } = e;
  box(x + 0.08, y + 0.1, 0, 0.84, 0.8, 86, '#283040');
  const f = faceY(x + 0.08, y + 0.1, 0, 0.84, 0.8);
  for (let k = 0; k < 6; k++) {
    quad(f, 0.06, 0.94, 8 + k * 12.5, 17 + k * 12.5, k === 3 ? '#1f6feb' : '#353d50');
    for (let i = 0; i < 6; i++) dot(f(0.14 + i * 0.12, 12.5 + k * 12.5), 1.4, Math.random() < 0.8 ? '#2fbf71' : '#1d5a3a');
  }
  quad(f, 0.06, 0.94, 80, 84, alarm() && blink(3) ? '#e5484d' : '#2fbf71');
}
function drawServer(e) {
  const { x, y } = e;
  const ko = e.id === 'baie_dns' && !S.net.dnsUp;
  box(x + 0.15, y + 0.12, 0, 0.7, 0.76, 72, '#262b36');
  const f = faceY(x + 0.15, y + 0.12, 0, 0.7, 0.76);
  for (let k = 0; k < 5; k++) { quad(f, 0.08, 0.92, 8 + k * 12, 16 + k * 12, '#343a48'); dot(f(0.85, 12 + k * 12), 1.6, ko ? (blink(3) ? '#e5484d' : '#5a1f20') : (Math.random() < 0.7 ? '#2fbf71' : '#1d5a3a')); }
  dot(f(0.2, 66), 2, ko ? '#e5484d' : '#4aa8ff');
}
function drawBench(e) {
  const { x, y } = e;
  box(x + 0.02, y + 0.1, 0, 0.96, 0.8, 26, '#8b6b4a');
  box(x + 0.12, y + 0.2, 26, 0.3, 0.24, 8, '#f3f3f3'); // une box
  dot(w2s(x + 0.16, y + 0.44, 31), 1.5, '#2fbf71');
  const c = w2s(x + 0.7, y + 0.35, 28);
  ctx.strokeStyle = '#ff9f1c'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(c[0], c[1], 10, 5, 0, 0, 7); ctx.stroke(); // touret de fibre
  ctx.strokeStyle = '#3b82f6'; ctx.beginPath(); ctx.ellipse(c[0], c[1] - 3, 7, 3.5, 0, 0, 7); ctx.stroke();
  box(x + 0.55, y + 0.6, 26, 0.2, 0.14, 5, '#5b6270'); // vieux modem
  const a = w2s(x + 0.3, y + 0.7, 26);
  ctx.strokeStyle = '#444'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + 2, a[1] - 18); ctx.stroke(); // antenne 4G
}
function drawScreen(e) {
  const { x, y } = e;
  box(x + 0.15, y + 0.4, 0, 0.08, 0.08, 36, '#5b6270');
  box(x + 0.77, y + 0.4, 0, 0.08, 0.08, 36, '#5b6270');
  box(x - 0.2, y + 0.38, 36, 1.4, 0.1, 54, '#1b2333');
  const f = faceY(x - 0.2, y + 0.38, 36, 1.4, 0.1);
  quad(f, 0.03, 0.97, 4, 50, '#0b3a5b');
  // mini-carte du réseau
  const P = { o: [0.1, 34], b: [0.22, 26], m: [0.38, 38], q: [0.36, 14], r: [0.62, 34], n: [0.64, 12], p: [0.88, 26] };
  const L = [['o', 'b'], ['b', 'm'], ['b', 'q'], ['m', 'r'], ['q', 'n'], ['r', 'n'], ['r', 'p'], ['n', 'p']];
  L.forEach(([a, b]) => {
    const cut = S.net.cut && ((a === 'm' && b === 'r'));
    const A = f(P[a][0], P[a][1]), B = f(P[b][0], P[b][1]);
    ctx.strokeStyle = cut ? '#e5484d' : '#5ec8ff'; ctx.lineWidth = 1.5; ctx.setLineDash(cut ? [3, 3] : []);
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); ctx.setLineDash([]);
  });
  Object.entries(P).forEach(([k, [u, v]]) => {
    const down = (k === 'm' && S.net.routerDown === 'morlaix') || (k === 'b' && S.net.ddos);
    dot(f(u, v), 2.6, down ? (blink(3) ? '#e5484d' : '#5a1f20') : '#ffd166');
  });
  // paquet qui circule
  const t = (animT * 0.5) % 1, A = f(0.22, 26), B = f(0.88, 26);
  dot([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], 1.8, '#fff');
}
function drawCoffee(e) {
  const { x, y } = e;
  box(x + 0.2, y + 0.2, 0, 0.6, 0.6, 46, '#2f2f33');
  quad(faceY(x + 0.2, y + 0.2, 0, 0.6, 0.6), 0.1, 0.9, 30, 42, '#c0392b');
  box(x + 0.42, y + 0.68, 10, 0.16, 0.12, 8, '#f5f5f5');
}
function drawPhone(e) {
  const { x, y } = e, r = S.ring;
  box(x + 0.15, y + 0.15, 0, 0.7, 0.7, 24, '#c08a57');
  const sh = r ? Math.sin(animT * 40) * 1.5 : 0;
  ctx.save(); ctx.translate(sh, 0);
  box(x + 0.32, y + 0.34, 24, 0.36, 0.3, 6, '#2d2d2d');
  ctx.restore();
  if (r) {
    const c = w2s(x + 0.5, y + 0.5, 40);
    ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 2;
    for (let i = 1; i <= 2; i++) { ctx.beginPath(); ctx.arc(c[0], c[1], 6 * i + (blink(4) ? 2 : 0), Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); }
  }
}
function drawBoard(e) {
  const { x, y } = e;
  box(x + 0.1, y + 0.05, 0, 0.12, 0.9, 64, '#8d96a1');
  const f = faceX(x + 0.1, y + 0.05, 0, 0.12, 0.9);
  quad(f, 0.05, 0.95, 16, 60, '#fbfbfb');
  ctx.strokeStyle = '#2f6fde'; ctx.lineWidth = 2;
  const a = f(0.1, 38), b = f(0.9, 38);
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  [0.2, 0.4, 0.6, 0.8].forEach((u, i) => { dot(f(u, 38), 2.6, ['#e5484d', '#f5a524', '#22a06b', '#7a5bd6'][i]); });
}
function drawPlant(e) {
  const { x, y } = e;
  box(x + 0.32, y + 0.32, 0, 0.36, 0.36, 14, '#b5653a');
  const c = w2s(x + 0.5, y + 0.5, 26);
  dot([c[0] - 6, c[1] + 2], 9, '#3f8f4c'); dot([c[0] + 6, c[1]], 9, '#4aa35a'); dot([c[0], c[1] - 8], 10, '#57b567');
}
function drawPerson(px, py, look, seated, moving, isPlayer) {
  const [gx, gy] = w2s(px, py, 0);
  ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(gx, gy, 12, 6, 0, 0, 7); ctx.fill();
  const bob = moving ? Math.abs(Math.sin(animT * 12)) * 2 : 0;
  if (seated) box(px - 0.28, py - 0.2, 0, 0.56, 0.5, 14, '#4a5160');
  const base = gy - (seated ? 12 : 0) - bob;
  if (!seated) {
    ctx.fillStyle = '#2e3440';
    const sw = moving ? Math.sin(animT * 12) * 2 : 0;
    ctx.fillRect(gx - 6, base - 14, 5, 14 + sw); ctx.fillRect(gx + 1, base - 14, 5, 14 - sw);
  }
  ctx.fillStyle = look.shirt;
  ctx.beginPath(); ctx.roundRect(gx - 9, base - 36, 18, 24, 6); ctx.fill();
  if (isPlayer) { ctx.fillStyle = '#fff'; ctx.fillRect(gx + 2, base - 30, 5, 6); ctx.fillStyle = '#2f6fde'; ctx.fillRect(gx + 3, base - 29, 3, 1.5); }
  dot([gx, base - 44], 8, look.skin);
  ctx.fillStyle = look.hair; ctx.beginPath(); ctx.arc(gx, base - 46, 8.5, Math.PI, 0); ctx.fill();
}
function drawWall(x, y) {
  const back = x === 0 || y === 0, front = x === MW - 1 || y === MH - 1;
  box(x, y, 0, 1, 1, back ? 64 : front ? 10 : 34, back ? '#d9d3c9' : '#cfc8bd');
}
const DRAW = { pc: drawPC, rack: drawRack, server: drawServer, bench: drawBench, screen: drawScreen, coffee: drawCoffee, phone: drawPhone, board: drawBoard, plant: drawPlant };

function computeCamera() {
  const dpr = window.devicePixelRatio || 1;
  const wv = innerWidth, hv = innerHeight;
  if (cv.width !== Math.round(wv * dpr) || cv.height !== Math.round(hv * dpr)) { cv.width = Math.round(wv * dpr); cv.height = Math.round(hv * dpr); }
  const side = document.body.classList.contains('side-open') && wv > 900 ? 330 : 0;
  const top = 58, aw = wv - side, ah = hv - top - 8;
  const bw = (MW + MH) * TW / 2, bh = (MW + MH) * TH / 2 + 80;
  const fit = Math.min(aw / (bw + 30), ah / (bh + 10));
  let s = fit, cx, cy;
  if (fit < 0.62) { s = 0.62; const p = w2s(S.px, S.py, 20); cx = p[0]; cy = p[1]; }
  else { cx = (MW - MH) * TW / 4; cy = (MW + MH) * TH / 4 - 36; }
  cam.s = s; cam.dpr = dpr; cam.tx = aw / 2 - cx * s; cam.ty = top + ah / 2 - cy * s;
}
function render() {
  computeCamera();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#d6e2ec'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.setTransform(cam.dpr * cam.s, 0, 0, cam.dpr * cam.s, cam.dpr * cam.tx, cam.dpr * cam.ty);
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    const t = MAP[y][x]; if (t === '#') continue;
    poly([w2s(x, y), w2s(x + 1, y), w2s(x + 1, y + 1), w2s(x, y + 1)], FLOOR[t][(x + y) % 2]);
  }
  ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(40,50,70,.28)';
  ROOMS.forEach(r => { const p = w2s(r.x, r.y); ctx.fillText(r.n, p[0], p[1]); });
  const list = [];
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (MAP[y][x] === '#') list.push({ k: x + y + 0.98, f: () => drawWall(x, y) });
  ENTS.forEach(e => list.push({ k: e.x + e.y + 1, f: () => e.kind === 'person' ? drawPerson(e.x + 0.5, e.y + 0.5, PEOPLE[e.id], e.seated, false) : DRAW[e.kind](e) }));
  list.push({ k: S.px + S.py + 0.01, f: () => drawPerson(S.px, S.py, PEOPLE.moi, false, player.moving, true) });
  list.sort((a, b) => a.k - b.k).forEach(o => o.f());
  picks = [];
  const targets = new Set(currentTargets());
  const ticketSpots = new Set(S.tickets.map(t => (t.stage === 'fix' ? t.fixAt : t.reportAt)));
  ENTS.forEach(e => {
    if (e.deco) return;
    const [gx, gy] = w2s(e.x + 0.5, e.y + 0.5, 0);
    picks.push({ id: e.id, x0: gx - 28, x1: gx + 28, y0: gy - e.h - 12, y1: gy + 14, k: e.x + e.y });
    const top = gy - e.h - 10;
    if (ticketSpots.has(e.id)) bubble(gx, top - 4, '!', '#e5484d');
    else if (targets.has(e.id)) marker(gx, top);
  });
  if (hoverId && EBY[hoverId]) {
    const e = EBY[hoverId], [gx, gy] = w2s(e.x + 0.5, e.y + 0.5, 0);
    label(gx, gy + 26, e.name);
  }
}
function marker(x, y) {
  const b = Math.sin(animT * 5) * 4;
  poly([[x - 9, y - 18 + b], [x + 9, y - 18 + b], [x, y - 4 + b]], '#ffcf33', '#a87b00');
}
function bubble(x, y, txt, col) {
  const b = Math.sin(animT * 6) * 2;
  dot([x, y - 10 + b], 11, '#fff'); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - 10 + b, 11, 0, 7); ctx.stroke();
  ctx.fillStyle = col; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, x, y - 9 + b); ctx.textBaseline = 'alphabetic';
}
function label(x, y, txt) {
  ctx.font = '600 12px system-ui'; const w = ctx.measureText(txt).width + 14;
  ctx.fillStyle = 'rgba(20,28,45,.86)'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 12, w, 20, 6); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(txt, x, y + 2);
}

/* ---------------------------------------------------------------------
   Déplacements du joueur
   --------------------------------------------------------------------- */
const player = { path: [], pending: null, moving: false };
const keys = new Set();
function tileBlocked(x, y) { return !walkable(Math.floor(x), Math.floor(y)); }
function bfs(sx, sy, goals) {
  const key = (x, y) => y * MW + x, prev = new Map([[key(sx, sy), null]]), q = [[sx, sy]];
  const goalSet = new Set(goals.map(([x, y]) => key(x, y)));
  while (q.length) {
    const [x, y] = q.shift();
    if (goalSet.has(key(x, y))) { const p = []; let k = key(x, y); while (k !== null) { p.unshift([k % MW, Math.floor(k / MW)]); k = prev.get(k); } return p; }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (!walkable(nx, ny) || prev.has(key(nx, ny))) continue;
      if (dx && dy && (!walkable(x + dx, y) || !walkable(x, y + dy))) continue;
      prev.set(key(nx, ny), key(x, y)); q.push([nx, ny]);
    }
  }
  return null;
}
function walkTo(tx, ty, then) {
  const p = bfs(Math.floor(S.px), Math.floor(S.py), [[tx, ty]]);
  if (p) { player.path = p.slice(1).map(([x, y]) => [x + 0.5, y + 0.5]); player.pending = then || null; }
}
const near = id => { const e = EBY[id]; return Math.hypot(S.px - (e.x + 0.5), S.py - (e.y + 0.5)) <= 1.62; };
function goToEnt(id) {
  if (near(id)) { player.path = []; interact(id); return; }
  const e = EBY[id], goals = [];
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) if ((dx || dy) && walkable(e.x + dx, e.y + dy)) goals.push([e.x + dx, e.y + dy]);
  const p = bfs(Math.floor(S.px), Math.floor(S.py), goals);
  if (p) { player.path = p.slice(1).map(([x, y]) => [x + 0.5, y + 0.5]); player.pending = id; if (!player.path.length) interact(id); }
}
function nearestEnt() {
  let best = null, bd = 1.62;
  ENTS.forEach(e => { if (e.deco) return; const d = Math.hypot(S.px - (e.x + 0.5), S.py - (e.y + 0.5)); if (d <= bd) { bd = d; best = e.id; } });
  return best;
}
function updatePlayer(dt) {
  const sp = 4.6 * dt;
  let vx = 0, vy = 0;
  if (!uiBusy()) {
    if (keys.has('up')) { vx -= 1; vy -= 1; }
    if (keys.has('down')) { vx += 1; vy += 1; }
    if (keys.has('left')) { vx -= 1; vy += 1; }
    if (keys.has('right')) { vx += 1; vy -= 1; }
  }
  if (vx || vy) {
    player.path = []; player.pending = null;
    const l = Math.hypot(vx, vy); vx = vx / l * sp; vy = vy / l * sp;
    const r = 0.26, ok = (x, y) => !tileBlocked(x - r, y - r) && !tileBlocked(x + r, y - r) && !tileBlocked(x - r, y + r) && !tileBlocked(x + r, y + r);
    if (ok(S.px + vx, S.py)) S.px += vx;
    if (ok(S.px, S.py + vy)) S.py += vy;
    player.moving = true;
  } else if (player.path.length) {
    const [tx, ty] = player.path[0], dx = tx - S.px, dy = ty - S.py, d = Math.hypot(dx, dy);
    if (d <= sp) { S.px = tx; S.py = ty; player.path.shift(); } else { S.px += dx / d * sp; S.py += dy / d * sp; }
    player.moving = true;
    if (!player.path.length && player.pending) { const id = player.pending; player.pending = null; if (EBY[id]) interact(id); }
  } else player.moving = false;
}

/* ---------------------------------------------------------------------
   Interface : fenêtres, dialogues, notifications
   --------------------------------------------------------------------- */
let modalOnClose = null, modalClosable = true;
function openModal({ title, wide = false, closable = true, onClose = null } = {}) {
  const m = $('#modal');
  m.className = wide ? 'wide' : '';
  m.innerHTML = `<div class="m-head"><h2>${title}</h2><div class="m-tools"><button class="btn small m-carnet" title="Ouvrir le carnet (C)">📒 Carnet</button>${closable ? '<button class="m-close" aria-label="Fermer">✕</button>' : ''}</div></div><div class="m-body"></div>`;
  m.querySelector('.m-carnet').onclick = () => carnet(curNotion);
  $('#modal-wrap').hidden = false;
  modalOnClose = onClose; modalClosable = closable;
  if (closable) m.querySelector('.m-close').onclick = () => closeModal();
  keys.clear();
  return m.querySelector('.m-body');
}
function closeModal(silent) {
  $('#modal-wrap').hidden = true; curNotion = null;
  const cb = modalOnClose; modalOnClose = null;
  if (cb && !silent) cb();
}
const modalOpen = () => !$('#modal-wrap').hidden;
const uiBusy = () => modalOpen() || !!dlg || !$('#title-screen').hidden;

let dlg = null;
function say(lines, doneCb) { dlg = { lines, i: 0, done: doneCb }; keys.clear(); showLine(); }
function personLook(who) { return who === 'moi' ? { ...PEOPLE.moi, name: S.name || 'Toi' } : PEOPLE[who]; }
const fill = t => String(t).replace(/\{nom\}/g, esc(S.name || 'stagiaire'));
function showLine() {
  const [who, text] = dlg.lines[dlg.i], p = personLook(who);
  const bx = $('#dialog');
  bx.hidden = false;
  bx.querySelector('.d-face').style.background = p.shirt;
  bx.querySelector('.d-face').textContent = p.name.replace(/^(M\.|Mme) /, '')[0];
  bx.querySelector('.d-name').innerHTML = `${esc(p.name)} <span>${esc(p.role)}</span>`;
  const t = bx.querySelector('.d-text');
  t.innerHTML = fill(text);
  t.classList.remove('fade'); void t.offsetWidth; t.classList.add('fade');
  bx.querySelector('.d-next').textContent = dlg.i < dlg.lines.length - 1 ? 'Suite ▶' : 'OK ✔';
}
function advanceDialog() {
  if (!dlg) return;
  dlg.i++;
  if (dlg.i >= dlg.lines.length) { const d = dlg.done; dlg = null; $('#dialog').hidden = true; if (d) d(); }
  else showLine();
}
function toast(html, type = '', ms = 3600) {
  const t = document.createElement('div');
  t.className = 'toast ' + type; t.innerHTML = html;
  const bx = $('#toasts');
  bx.append(t);
  while (bx.children.length > 3) bx.firstChild.remove();
  setTimeout(() => t.classList.add('out'), ms);
  setTimeout(() => t.remove(), ms + 400);
}
function choose(title, options) {
  const b = openModal({ title });
  b.innerHTML = '<div class="choices"></div>';
  options.forEach(o => {
    const btn = document.createElement('button');
    btn.className = 'btn choice'; btn.innerHTML = o.label;
    btn.onclick = () => { closeModal(true); o.fn(); };
    b.querySelector('.choices').append(btn);
  });
}

/* scores et erreurs */
function addScore(n) { S.score = Math.max(0, S.score + n); }
function addSat(n) { S.sat = clamp(S.sat + n, 0, 100); }
function recordError(notion) { if (notion) S.errors[notion] = (S.errors[notion] || 0) + 1; }
function unlock(id) {
  if (!id || !NOTIONS[id] || S.notions.includes(id)) return;
  S.notions.push(id);
  freshNotions.add(id);
  toast(`📒 Nouvelle fiche dans ton carnet : <b>${NOTIONS[id].title}</b> <small>(touche C)</small>`, 'info', 4500);
  if (carnetOpen()) renderCarnet(null, id);
}

/* quiz : qcm, ordre, saisie, tri */
function quiz(cfg, onDone) {
  const qs = typeof cfg.questions === 'function' ? cfg.questions() : cfg.questions;
  let i = 0;
  unlock(cfg.notion);
  const b = openModal({ title: cfg.title, wide: cfg.wide });
  curNotion = cfg.notion || null;
  const norm = s => String(s).toLowerCase().replace(/\s+/g, '').replace(/,/g, '.');
  function good(q, fbEl, act, first) {
    if (first) { S.quizOk++; addScore(10); }
    sfx.ok();
    fbEl.hidden = false; fbEl.className = 'q-fb ok'; fbEl.innerHTML = `✔ <b>Bien vu !</b> ${q.ex || ''}`;
    b.querySelectorAll('.q-zone button, .q-zone input').forEach(x => { x.disabled = true; });
    act.innerHTML = '';
    const nb = document.createElement('button');
    nb.className = 'btn primary'; nb.textContent = i < qs.length - 1 ? 'Question suivante →' : 'Terminer ✔';
    nb.onclick = () => { i++; if (i < qs.length) show(); else { closeModal(true); onDone && onDone(); } };
    act.append(nb); nb.focus();
  }
  function bad(q, fbEl, msg) {
    S.quizKo++; addScore(-3); recordError(cfg.notion); sfx.ko();
    fbEl.hidden = false; fbEl.className = 'q-fb ko'; fbEl.innerHTML = `✘ ${msg || q.hint || 'Ce n\'est pas ça.'} <i>📒 Ton carnet peut t'aider : bouton « Carnet » en haut, ou touche C.</i>`;
  }
  function show() {
    const q = qs[i]; let first = true;
    b.innerHTML = `${cfg.intro && i === 0 ? `<div class="intro">${cfg.intro}</div>` : ''}<div class="q-count">Question ${i + 1} / ${qs.length}</div><div class="q-text">${fill(q.q)}</div><div class="q-zone"></div><div class="q-fb" hidden></div><div class="q-actions"></div>`;
    const zone = b.querySelector('.q-zone'), fb = b.querySelector('.q-fb'), act = b.querySelector('.q-actions');
    const t = q.t || 'qcm';
    if (t === 'qcm') {
      shuffle(q.c.map((c, k) => k)).forEach(k => {
        const btn = document.createElement('button');
        btn.className = 'btn choice'; btn.innerHTML = q.c[k];
        btn.onclick = () => {
          if (k === q.a) { btn.classList.add('right'); good(q, fb, act, first); }
          else { btn.classList.add('wrong'); btn.disabled = true; bad(q, fb, q.fb && q.fb[k]); first = false; }
        };
        zone.append(btn);
      });
    } else if (t === 'order') {
      let seq = [];
      zone.innerHTML = '<div class="seq"></div><div class="pool"></div>';
      const seqEl = zone.querySelector('.seq'), poolEl = zone.querySelector('.pool');
      const items = shuffle(q.items.map((s, k) => k));
      const draw = () => {
        seqEl.innerHTML = seq.length ? seq.map((k, n) => `<div class="seq-item"><b>${n + 1}</b> ${q.items[k]}</div>`).join('') : '<div class="seq-empty">Clique les éléments ci-dessous dans le bon ordre…</div>';
        poolEl.innerHTML = '';
        items.filter(k => !seq.includes(k)).forEach(k => {
          const btn = document.createElement('button');
          btn.className = 'btn choice'; btn.innerHTML = q.items[k];
          btn.onclick = () => { seq.push(k); draw(); if (seq.length === q.items.length) check(); };
          poolEl.append(btn);
        });
        act.innerHTML = '';
        if (seq.length && seq.length < q.items.length) { const r = document.createElement('button'); r.className = 'btn'; r.textContent = '↺ Recommencer'; r.onclick = () => { seq = []; fb.hidden = true; draw(); }; act.append(r); }
      };
      const check = () => {
        if (seq.every((k, n) => k === n)) good(q, fb, act, first);
        else {
          const okN = seq.findIndex((k, n) => k !== n);
          bad(q, fb, `L'ordre n'est pas bon (${okN ? `les ${okN} premier(s) élément(s) sont bien placés` : 'le premier élément est déjà faux'}). ${q.hint || ''}`); first = false;
          const r = document.createElement('button'); r.className = 'btn primary'; r.textContent = '↺ Réessayer';
          r.onclick = () => { seq = []; fb.hidden = true; draw(); }; act.innerHTML = ''; act.append(r);
        }
      };
      draw();
    } else if (t === 'input') {
      zone.innerHTML = `<form class="q-input"><input type="text" autocomplete="off" spellcheck="false" placeholder="${esc(q.ph || '')}"><button class="btn primary">Valider</button></form>`;
      const f = zone.querySelector('form'), inp = f.querySelector('input');
      f.onsubmit = ev => { ev.preventDefault(); if (q.a.some(a => norm(a) === norm(inp.value))) good(q, fb, act, first); else { bad(q, fb); first = false; inp.select(); } };
      setTimeout(() => inp.focus(), 50);
    } else if (t === 'tri') {
      const pick = {};
      const items = shuffle(q.items.map((s, k) => k));
      zone.innerHTML = `<div class="tri">${items.map(k => `<div class="tri-row" data-k="${k}"><span>${q.items[k][0]}</span><div class="tri-btns">${q.cats.map((c, ci) => `<button class="chip" data-c="${ci}">${c}</button>`).join('')}</div></div>`).join('')}</div>`;
      zone.querySelectorAll('.tri-row').forEach(row => {
        row.querySelectorAll('button').forEach(btn => {
          btn.onclick = () => {
            pick[row.dataset.k] = +btn.dataset.c; row.classList.remove('bad');
            row.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === btn));
            act.innerHTML = '';
            if (Object.keys(pick).length === q.items.length) {
              const v = document.createElement('button'); v.className = 'btn primary'; v.textContent = 'Vérifier';
              v.onclick = () => {
                const wrong = q.items.map((it, k) => k).filter(k => pick[k] !== q.items[k][1]);
                if (!wrong.length) good(q, fb, act, first);
                else { wrong.forEach(k => zone.querySelector(`.tri-row[data-k="${k}"]`).classList.add('bad')); bad(q, fb, `${wrong.length} élément(s) mal rangé(s), en rouge. Corrige-les. ${q.hint || ''}`); first = false; }
              };
              act.append(v);
            }
          };
        });
      });
    }
  }
  show();
}

/* invite de commandes (prise en main à distance) */
function terminal(cl, opts = {}) {
  const C = CLIENTS[cl];
  const b = openModal({ title: `🖥️ Invite de commandes — ${C.name}`, wide: true });
  b.innerHTML = `${opts.goal ? `<div class="goal">🎯 ${opts.goal}</div>` : ''}<pre class="term"></pre><form class="term-in"><span>C:\\&gt;</span><input autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="tape une commande (ou « aide »)"></form><div class="term-quick"></div><div class="term-after"></div>`;
  const out = b.querySelector('.term'), f = b.querySelector('form'), inp = f.querySelector('input');
  const quick = opts.quick || ['ipconfig', 'ping wikipedia.fr', 'nslookup wikipedia.fr', 'tracert wikipedia.fr'];
  const hist = []; let hi = 0, busy = false;
  const api = { flag: false, after(msg, btnLabel, fn) { const a = b.querySelector('.term-after'); a.innerHTML = `<div class="q-fb ok">${msg}</div>`; const btn = document.createElement('button'); btn.className = 'btn primary'; btn.textContent = btnLabel; btn.onclick = () => { closeModal(true); fn(); }; a.append(btn); sfx.ok(); } };
  const print = (l, cls) => { const s = document.createElement('div'); if (cls) s.className = cls; s.textContent = l || '\u00a0'; out.append(s); out.scrollTop = out.scrollHeight; };
  print(cl === 'mon_pc' ? 'IroiseNet — poste de la hotline' : `Prise en main à distance : ${C.name}`); print('Tape « aide » pour voir les commandes disponibles.'); print('');
  function run(cmd) {
    if (busy) return;
    print('C:\\> ' + cmd, 'cmd'); hist.push(cmd); hi = hist.length;
    const r = execCmd(cl, cmd);
    if (r.clear) { out.innerHTML = ''; return; }
    busy = true; let k = 0;
    const next = () => {
      if (k < r.lines.length) { print(r.lines[k++]); setTimeout(next, r.slow && k > 1 && k <= 9 ? 240 : 25); }
      else { print(''); busy = false; if (opts.onResult) opts.onResult(r, api); }
    };
    next();
  }
  f.onsubmit = ev => { ev.preventDefault(); const c = inp.value.trim(); inp.value = ''; if (c) run(c); };
  inp.onkeydown = ev => {
    if (ev.key === 'ArrowUp' && hi > 0) { inp.value = hist[--hi]; ev.preventDefault(); }
    if (ev.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ''; ev.preventDefault(); }
  };
  quick.forEach(c => { const btn = document.createElement('button'); btn.className = 'chip'; btn.textContent = c; btn.onclick = () => { run(c); inp.focus(); }; b.querySelector('.term-quick').append(btn); });
  setTimeout(() => inp.focus(), 50);
}

/* carte des routeurs d'IroiseNet (SVG) */
function mapSVG(o = {}) {
  const links = o.links || activeLinks();
  const isOn = l => links.some(k => linkKey(k[0], k[1]) === linkKey(l[0], l[1]));
  let g = '<text x="20" y="372" font-size="12" fill="var(--muted)">🌊 mer d\'Iroise</text><text x="690" y="250" font-size="12" text-anchor="end" fill="var(--muted)">vers le reste d\'Internet ↗</text>';
  LINKS.forEach(l => {
    const A = ROUTERS[l[0]], B = ROUTERS[l[1]], on = isOn(l);
    const used = o.path && o.path.some((r, i) => i && linkKey(o.path[i - 1], r) === linkKey(l[0], l[1]));
    g += `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="${!on ? '#e5484d' : used ? '#ff7a2f' : l[3] === 'radio' ? '#7aa7d9' : '#9fb3c8'}" stroke-width="${used ? 6 : 4}" ${!on ? 'stroke-dasharray="8 6"' : l[3] === 'radio' ? 'stroke-dasharray="2 7" stroke-linecap="round"' : ''}/>`;
    if (!on) g += `<text x="${(A.x + B.x) / 2}" y="${(A.y + B.y) / 2 - 8}" text-anchor="middle" font-size="18">🚧</text>`;
  });
  Object.entries(ROUTERS).forEach(([id, r]) => {
    const down = S.net.routerDown === id, cur = o.at === id, nb = o.clickable && o.clickable.includes(id);
    g += `<g class="rt${nb ? ' nb' : ''}" data-r="${id}"><circle cx="${r.x}" cy="${r.y}" r="${cur ? 24 : 19}" fill="${down ? '#fdecec' : cur ? '#fff1e8' : 'var(--panel)'}" stroke="${down ? '#e5484d' : cur ? '#ff7a2f' : nb ? '#2f6fde' : '#9fb3c8'}" stroke-width="${cur || nb ? 4 : 2.5}"/><text x="${r.x}" y="${r.y + 5}" text-anchor="middle" font-size="15">${down ? '⛔' : '🛜'}</text><text x="${r.x}" y="${r.y + 42}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">${r.name}</text></g>`;
    if (cur) g += `<text x="${r.x + 22}" y="${r.y - 18}" font-size="22">📦</text>`;
  });
  return `<svg class="schema map" viewBox="0 0 700 380" role="img" aria-label="Carte des routeurs d'IroiseNet">${g}</svg>`;
}
function carte() {
  const b = openModal({ title: "🗺️ Le réseau d'IroiseNet", wide: true });
  b.innerHTML = `${mapSVG()}<div class="legend"><span><i style="background:#9fb3c8"></i>fibre optique</span><span><i style="background:#7aa7d9"></i>liaison radio (île)</span><span><i style="background:#e5484d"></i>liaison coupée</span></div><p class="muted small">Chaque cercle est un routeur. Les clients d'une ville sont reliés au routeur de leur ville.</p>`;
}

/* mini-jeu : router un paquet de proche en proche */
function routing(cfg) {
  const links = activeLinks();
  let at = cfg.from, ttl = cfg.ttl, path = [cfg.from], edited = !cfg.editAt, first = true;
  const b = openModal({ title: cfg.title, wide: true, closable: false });
  curNotion = cfg.bug ? 'limites' : 'routage';
  const table = r => {
    const t = routingTable(r, links, cfg.bug);
    if (cfg.editAt === r && !edited) t[cfg.to] = null;
    if (cfg.editAt === r && edited && S.sp.edit) t[cfg.to] = S.sp.edit;
    return t;
  };
  const err = msg => { sfx.ko(); S.quizKo++; addScore(-3); recordError('routage'); first = false; const e = b.querySelector('.rt-fb'); e.hidden = false; e.className = 'q-fb ko rt-fb'; e.innerHTML = `✘ ${msg}`; };
  function draw() {
    const t = table(at), nbs = neighbors(at, links);
    const rows = Object.keys(ROUTERS).filter(d => d !== at).map(d => `<tr class="${d === cfg.to ? 'hl' : ''}"><td>${ROUTERS[d].name}</td><td>${t[d] ? ROUTERS[t[d]].name : (cfg.editAt === at && d === cfg.to ? '<b>❓ à compléter</b>' : '—')}</td></tr>`).join('');
    b.innerHTML = `${path.length === 1 ? `<div class="intro">${cfg.intro}</div>` : ''}
      <div class="rt-status"><span>📦 Paquet de <b>${ROUTERS[cfg.from].name}</b> vers <b>${ROUTERS[cfg.to].name}</b></span><span class="ttl ${ttl <= 1 ? 'low' : ''}">Compteur de sauts restants : <b>${ttl}</b></span></div>
      <div class="rt-grid"><div>${mapSVG({ links, at, path, clickable: edited ? nbs : [] })}</div>
      <div><h4>Table de routage de ${ROUTERS[at].name}</h4><table class="rt-table"><tr><th>Pour aller à…</th><th>passer par</th></tr>${rows}</table>
      ${edited ? `<p class="small muted">Clique sur le routeur voisin (cerclé de bleu) à qui passer le paquet.</p><button class="btn danger" id="rt-kill">🗑️ Détruire le paquet</button>` : `<div class="goal">Choisis le voisin de ${ROUTERS[at].name} pour aller à ${ROUTERS[cfg.to].name} :</div><div class="choices" id="rt-edit">${nbs.map(n => `<button class="btn choice" data-n="${n}">${ROUTERS[n].name}</button>`).join('')}</div>`}</div></div>
      <div class="q-fb rt-fb" hidden></div><div class="actions" id="rt-act"></div>`;
    if (!edited) {
      b.querySelectorAll('#rt-edit button').forEach(btn => {
        btn.onclick = () => {
          const n = btn.dataset.n, ok = routingTable(at, links)[cfg.to];
          if (n === ok) { S.sp.edit = n; edited = true; sfx.ok(); addScore(10); S.quizOk++; toast(`✔ Table de ${ROUTERS[at].name} mise à jour : ${ROUTERS[cfg.to].name} → via ${ROUTERS[n].name}`, 'ok'); draw(); }
          else if ((btn.disabled = true) && n === 'ouessant') err("Ouessant est une île au bout du réseau : aucun chemin vers Paris ne passe par là !");
          else err(`${ROUTERS[n].name} a prévenu ses voisins : il ne peut plus joindre ${ROUTERS[cfg.to].name}.`);
        };
      });
      return;
    }
    b.querySelectorAll('g.rt.nb').forEach(el => { el.onclick = () => hop(el.dataset.r); });
    b.querySelector('#rt-kill').onclick = () => {
      if (ttl > 0) { err(`Le compteur vaut encore ${ttl} : le routeur doit transmettre le paquet en suivant sa table.`); return; }
      sfx.step(); addScore(first ? 20 : 5); S.quizOk++;
      finish(`🗑️ <b>Paquet détruit.</b> Son compteur était à 0 : il a tourné en rond entre Quimper et Nantes sans jamais arriver. Sans ce compteur, il tournerait à l'infini et encombrerait le réseau.`);
    };
  }
  function hop(n) {
    if (ttl <= 0) { err('Le compteur de sauts est à 0 : ce paquet ne doit plus être transmis.'); return; }
    const want = table(at)[cfg.to];
    if (n !== want) { err(`Le routeur suit sa table : pour aller à ${ROUTERS[cfg.to].name}, ${ROUTERS[at].name} passe par <b>${want ? ROUTERS[want].name : '?'}</b>.`); return; }
    sfx.plug(); at = n; ttl--; path.push(n);
    if (at === cfg.to) { sfx.step(); addScore(first ? 20 : 5); S.quizOk++; draw(); finish(`✔ <b>Paquet arrivé à ${ROUTERS[at].name} !</b> Chemin : ${path.map(r => ROUTERS[r].name).join(' → ')}. Aucun routeur ne connaissait tout le chemin : chacun a juste passé le paquet au bon voisin.`); return; }
    draw();
  }
  function finish(msg) {
    const e = b.querySelector('.rt-fb'); e.hidden = false; e.className = 'q-fb ok rt-fb'; e.innerHTML = msg;
    b.querySelectorAll('g.rt').forEach(el => { el.onclick = null; el.classList.remove('nb'); });
    const k = b.querySelector('#rt-kill'); if (k) k.disabled = true;
    const btn = document.createElement('button'); btn.className = 'btn primary'; btn.textContent = 'Continuer →';
    btn.onclick = () => { closeModal(true); S.sp.edit = null; cfg.onDone(); };
    b.querySelector('#rt-act').append(btn);
  }
  draw();
}

/* mini-jeu : faire le travail de TCP */
function tcpPuzzle(cfg) {
  const chunks = [];
  for (let k = 0; k < cfg.text.length; k += cfg.size) chunks.push(cfg.text.slice(k, k + cfg.size));
  const N = chunks.length;
  const lost = new Set(shuffle([...Array(N).keys()].slice(1)).slice(0, cfg.lost).map(k => k + 1));
  let pool = shuffle([...Array(N).keys()].map(k => k + 1).filter(n => !lost.has(n)));
  let next = 1, first = true, fresh = null;
  const b = openModal({ title: cfg.title, wide: true, closable: false });
  curNotion = 'tcp';
  const err = msg => { sfx.ko(); S.quizKo++; addScore(-3); recordError('tcp'); first = false; const e = b.querySelector('.q-fb'); e.hidden = false; e.className = 'q-fb ko'; e.innerHTML = `✘ ${msg}`; };
  function draw() {
    b.innerHTML = `<div class="intro">Les paquets sont arrivés <b>dans le désordre</b>, et il en manque. Chaque paquet porte l'adresse IP de l'émetteur (lycée, <code>203.0.113.80</code>), celle du destinataire (Plymouth, <code>198.51.100.44</code>) et son <b>numéro</b>. Comme TCP, remets-les dans l'ordre en cliquant d'abord le n° 1, puis le 2… Si le suivant manque, <b>redemande-le</b>.</div>
      <h4>Message reconstitué (${next - 1} / ${N})</h4><div class="tcp-msg">${chunks.map((c, k) => k < next - 1 ? `<span class="ok">${esc(c)}</span>` : `<span class="gap">${k + 1}</span>`).join('')}</div>
      <h4>Paquets reçus</h4><div class="tcp-pool">${pool.map(n => `<button class="pkt${fresh === n ? ' fresh' : ''}" data-n="${n}"><b>n° ${n}</b><small>de 203.0.113.80<br>à 198.51.100.44</small><code>${esc(chunks[n - 1])}</code></button>`).join('')}</div>
      <div class="actions"><button class="btn" id="tcp-ask">🔁 Il manque un paquet : le redemander</button></div><div class="q-fb" hidden></div><div class="actions" id="tcp-end"></div>`;
    b.querySelectorAll('.pkt').forEach(p => {
      p.onclick = () => {
        const n = +p.dataset.n;
        if (n !== next) { err(`TCP remet les paquets dans l'ordre : il attend le n° <b>${next}</b>, pas le n° ${n}.`); return; }
        sfx.plug(); pool = pool.filter(x => x !== n); next++; fresh = null;
        if (next > N) { done(); return; }
        draw();
      };
    });
    b.querySelector('#tcp-ask').onclick = () => {
      if (!lost.has(next)) { err(`Le paquet n° ${next} n'est pas perdu : il est dans la pile des paquets reçus. Cherche bien !`); return; }
      lost.delete(next); pool.push(next); fresh = next; sfx.ok(); addScore(5);
      toast(`🔁 Paquet n° ${next} redemandé à l'émetteur… le voilà !`, 'ok');
      draw();
    };
  }
  function done() {
    draw();
    b.querySelector('#tcp-ask').disabled = true;
    const e = b.querySelector('.q-fb'); e.hidden = false; e.className = 'q-fb ok';
    e.innerHTML = `✔ <b>Message complet :</b> « ${esc(cfg.text)} »<br>Tu as fait le travail de TCP : remettre les paquets dans l'ordre et redemander ceux qui manquaient.`;
    if (first) { S.quizOk++; addScore(20); }
    sfx.step();
    const btn = document.createElement('button'); btn.className = 'btn primary'; btn.textContent = 'Continuer →';
    btn.onclick = () => { closeModal(true); cfg.onDone(); };
    b.querySelector('#tcp-end').append(btn);
  }
  draw();
}

/* carnet de notions */
let curNotion = null;
const carnetOpen = () => !$('#carnet-panel').hidden;
function closeCarnet() { $('#carnet-panel').hidden = true; document.body.classList.remove('carnet-on'); }
const freshNotions = new Set();
function carnet(focus) {
  if (carnetOpen() && !focus) { closeCarnet(); return; }
  renderCarnet(focus || curNotion);
}
/* nouvelle : fiche qui vient de se débloquer pendant que le carnet est ouvert */
function renderCarnet(focus, nouvelle) {
  const p = $('#carnet-panel');
  const wasOpen = carnetOpen();
  const prev = wasOpen ? p.querySelector('.m-body') : null;
  const keepOpen = prev ? [...prev.querySelectorAll('details[open]')].map(d => d.dataset.id) : [];
  const keepScroll = prev ? prev.scrollTop : 0;
  p.hidden = false; document.body.classList.add('carnet-on');
  p.innerHTML = '<div class="m-head"><h2>📒 Mon carnet</h2><button class="m-close" aria-label="Fermer le carnet">✕</button></div><div class="m-body"></div>';
  p.querySelector('.m-close').onclick = closeCarnet;
  const b = p.querySelector('.m-body');
  const ids = Object.keys(NOTIONS);
  const banner = nouvelle ? `<button class="carnet-new">🆕 Nouvelle fiche : <b>${NOTIONS[nouvelle].icon} ${NOTIONS[nouvelle].title}</b> <small>(clique pour la lire)</small></button>` : '';
  b.innerHTML = `${banner}<p class="muted">${S.notions.length} / ${ids.length} fiches débloquées. Les fiches se débloquent au fil des missions et des tickets.</p><div class="notions">${ids.map(id => {
    const n = NOTIONS[id], ok = S.notions.includes(id);
    const open = focus === id || keepOpen.includes(id);
    const tag = freshNotions.has(id) ? ' <span class="badge-new">Nouveau</span>' : '';
    return ok ? `<details data-id="${id}" class="${freshNotions.has(id) ? 'fresh' : ''}" ${open ? 'open' : ''}><summary>${n.icon} ${n.title}${tag}</summary><div class="notion-body">${n.html}</div></details>` : '<div class="locked">🔒 Fiche verrouillée</div>';
  }).join('')}</div>`;
  b.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
    if (!d.open) return;
    freshNotions.delete(d.dataset.id); d.classList.remove('fresh');
    const t = d.querySelector('.badge-new'); if (t) t.remove();
  }));
  const go = id => { const d = b.querySelector(`details[data-id="${id}"]`); if (d) { d.open = true; d.scrollIntoView({ block: 'start' }); } };
  if (nouvelle) {
    b.scrollTop = keepScroll;
    b.querySelector('.carnet-new').onclick = e => { e.currentTarget.remove(); go(nouvelle); };
    p.classList.remove('flash'); void p.offsetWidth; p.classList.add('flash');
  } else if (focus) go(focus);
  else if (wasOpen) b.scrollTop = keepScroll;
}

/* ---------------------------------------------------------------------
   Missions : étapes, cibles, interactions
   --------------------------------------------------------------------- */
const ALL_STEPS = [];
MISSIONS.forEach((m, mi) => m.steps.forEach((s, si) => ALL_STEPS.push({ id: s.id, mi, si })));
const stepIndex = id => ALL_STEPS.findIndex(s => s.id === id);
const curIndex = () => S.finished ? ALL_STEPS.length : ALL_STEPS.findIndex(s => s.mi === S.m && s.si === S.s);
const reached = id => curIndex() >= stepIndex(id);
const curStep = () => (!S.pause && MISSIONS[S.m] && MISSIONS[S.m].steps[S.s]) || null;
const PART2 = MISSIONS.findIndex(m => m.partie === 2);
function currentTargets() {
  const st = curStep();
  if (!st || S.finished) return [];
  return st.targets ? st.targets() : [st.target];
}
function done() {
  const st = curStep();
  if (!st) return;
  (st.notions || []).forEach(unlock);
  addScore(20); sfx.step();
  S.s++; S.sp = {};
  const nx = curStep();
  if (nx && nx.onEnter) { nx.onEnter(); if (S.ring) sfx.ring(); }
  save(); refreshHUD();
  if (S.s >= MISSIONS[S.m].steps.length) setTimeout(missionComplete, 400);
  else toast(`➡️ Étape suivante : <b>${nx.label}</b>`, '', 3000);
}
function missionIntro() {
  const m = MISSIONS[S.m];
  const b = openModal({ title: `Partie ${m.partie} · Mission ${S.m + 1} / ${MISSIONS.length}`, closable: false });
  b.innerHTML = `<div class="mission-card"><div class="when">${m.when}</div><h3>${m.title}</h3><p>${m.story}</p>
    <h4>🎯 Objectifs (programme de SNT)</h4><ul>${m.goals.map(g => `<li>${g}</li>`).join('')}</ul></div>
    <div class="actions"><button class="btn primary" id="go">C'est parti !</button></div>`;
  b.querySelector('#go').onclick = () => { closeModal(true); S.pause = false; if (m.onStart) m.onStart(); if (S.ring) sfx.ring(); save(); refreshHUD(); };
}
function missionComplete() {
  const m = MISSIONS[S.m];
  const last = S.m === MISSIONS.length - 1, endPart1 = S.m + 1 === PART2;
  const notions = [...new Set(m.steps.flatMap(s => s.notions || []))];
  const b = openModal({ title: `✅ Mission ${S.m + 1} accomplie !`, closable: false });
  b.innerHTML = `<div class="mission-card"><h3>${m.title}</h3><p>Score : <b>${S.score}</b> · Satisfaction des clients : <b>${Math.round(S.sat)} %</b></p>
    <h4>📒 Notions acquises</h4><ul>${notions.map(n => `<li>${NOTIONS[n].icon} ${NOTIONS[n].title}</li>`).join('')}</ul>
    ${last ? '<p>🎉 Tu as terminé ton stage ! Voici ton rapport.</p>' : endPart1 ? `<div class="goal">🏁 <b>Fin de la partie 1.</b> Note ton <b>code de reprise</b> : il te permettra de reprendre la partie 2 sur n'importe quel ordinateur.<div class="code">${resumeCode()}</div></div><p>En attendant la prochaine séance, tu peux continuer à répondre aux tickets de la hotline.</p>` : '<p>Prends une minute pour relire les fiches de ton carnet avant de continuer.</p>'}</div>
    <div class="actions">${last ? '<button class="btn primary" id="next">Voir mon rapport de stage</button>' : endPart1 ? '<button class="btn" id="stay">Continuer la hotline</button><button class="btn primary" id="next">Commencer la partie 2</button>' : '<button class="btn primary" id="next">Mission suivante →</button>'}</div>`;
  b.querySelector('#next').onclick = () => {
    closeModal(true);
    if (last) { S.finished = true; save(); refreshHUD(); report(); }
    else { S.m++; S.s = 0; S.sp = {}; S.pause = false; save(); refreshHUD(); missionIntro(); }
  };
  if (endPart1) b.querySelector('#stay').onclick = () => { closeModal(true); S.m++; S.s = 0; S.sp = {}; S.pause = true; save(); refreshHUD(); };
}

function idleAction(id) {
  const e = EBY[id];
  if (e.kind === 'person') { say([[id, rand(IDLE[id] || ['…'])]]); return; }
  if (id === 'frise') { unlock('histoire'); carnet('histoire'); return; }
  if (id === 'telephone') { toast("📞 Pas d'appel en cours.", ''); return; }
  if (id === 'cafe') { toast("☕ Un café bien chaud… Il pleut dehors, comme souvent à Brest.", ''); return; }
  if (id === 'ecran') { carte(); return; }
  if (id === 'mon_pc') { terminal('mon_pc'); return; }
  if (id === 'etabli') { toast("🔧 Fibre, cuivre, antenne 4G, vieux modem 56k… tout ce qui transporte Internet.", ''); return; }
  if (id === 'baie_brest') { toast("🛜 Le routeur de Brest : il relie les clients du pays de Brest à Morlaix, Quimper et Ouessant.", ''); return; }
  if (id === 'baie_dns') { toast(S.net.dnsUp ? '📖 Serveur DNS : il traduit les noms en adresses IP pour tous les clients.' : '⛔ Serveur DNS : service arrêté !', S.net.dnsUp ? '' : 'warn'); return; }
  if (id === 'baie_ntp') { toast("🕰️ Serveur de temps (NTP) : il donne l'heure exacte aux ordinateurs des clients.", ''); return; }
  toast(`ℹ️ ${esc(e.name)}`, '');
}

function interact(id) {
  if (uiBusy() || !EBY[id] || EBY[id].deco) return;
  const opts = [];
  S.tickets.forEach(t => {
    const at = t.stage === 'fix' ? t.fixAt : t.reportAt;
    if (at === id) opts.push({ label: `🎫 <b>Ticket</b> : ${INCIDENTS_BY[t.id].title}`, fn: () => openTicket(t) });
  });
  const st = curStep();
  if (st && !S.finished) {
    const tg = currentTargets();
    if (tg.includes(id)) opts.push({ label: `⭐ <b>Mission</b> : ${st.label}`, fn: () => { (st.notions || []).forEach(unlock); st.run(id); } });
  }
  if (S.pause && id === 'gwen') opts.push({ label: '▶ <b>Commencer la partie 2</b>', fn: () => { S.pause = false; save(); refreshHUD(); missionIntro(); } });
  if (!opts.length) { idleAction(id); return; }
  if (opts.length === 1) { opts[0].fn(); return; }
  const e = EBY[id];
  opts.push({ label: e.kind === 'person' ? `💬 Discuter avec ${e.name}` : "ℹ️ Infos sur l'équipement", fn: () => idleAction(id) });
  choose(`Que faire ? — ${e.name}`, opts);
}

/* ---------------------------------------------------------------------
   Incidents et tickets
   --------------------------------------------------------------------- */
const INCIDENTS_BY = {};
INCIDENTS.forEach(i => { INCIDENTS_BY[i.id] = i; });
const busy = id => S.tickets.some(t => t.ctx.client === id || t.reportAt === id || t.fixAt === id || t.caller === id);
const INC_CFG = { off: null, calme: [200, 300, 1], normal: [110, 170, 1], intense: [60, 100, 2] };
const PATIENCE = 240;

function scheduleIncidents() {
  const cfg = INC_CFG[S.settings.inc];
  if (!cfg || S.finished || !reached(INCIDENTS[0].unlock) || !$('#title-screen').hidden) return;
  if (S.nextInc === null) { S.nextInc = S.t + 40; return; }
  if (S.t < S.nextInc || uiBusy()) return;
  if (S.tickets.length >= cfg[2] || S.tickets.some(t => INCIDENTS_BY[t.id].exclusive)) return;
  const cands = INCIDENTS.filter(i => reached(i.unlock) && (S.seen[i.id] || 0) < 2 && !S.tickets.some(t => t.id === i.id) && !(i.exclusive && S.tickets.length));
  if (!cands.length) { S.nextInc = S.t + 30; return; }
  const minSeen = Math.min(...cands.map(i => S.seen[i.id] || 0));
  const pool = shuffle(cands.filter(i => (S.seen[i.id] || 0) === minSeen)).concat(shuffle(cands));
  for (const inc of pool) {
    const c = inc.pick();
    if (!c) continue;
    spawnIncident(inc, c);
    S.nextInc = S.t + rnd(cfg[0], cfg[1]);
    return;
  }
  S.nextInc = S.t + 30;
}
function spawnIncident(inc, c) {
  inc.apply(c);
  const at = inc.at(c);
  const t = { uid: S.uid++, id: inc.id, ctx: c, caller: inc.caller(c), reportAt: at, fixAt: inc.fixAt ? inc.fixAt(c) : at, stage: 'diag', t0: S.t, late: false };
  S.tickets.push(t); S.seen[inc.id] = (S.seen[inc.id] || 0) + 1; S.incTotal++;
  sfx.ring();
  const p = PEOPLE[t.caller];
  const card = document.createElement('div');
  card.className = 'call'; card.dataset.uid = t.uid;
  card.innerHTML = `<div class="call-face" style="background:${p.shirt}">${p.name.replace(/^(M\.|Mme) /, '')[0]}</div><div><div class="call-who">📞 ${esc(p.name)} <small>${esc(p.role)}</small></div><div class="call-msg">« ${fill(inc.call)} »</div><div class="call-where">📍 Va voir : <b>${esc(entName(t.reportAt))}</b></div></div><button class="btn primary small">J'arrive !</button>`;
  card.querySelector('button').onclick = () => card.remove();
  $('#calls').append(card);
  while ($('#calls').children.length > 2) $('#calls').firstChild.remove();
  setTimeout(() => card.remove(), 14000);
  unlock(inc.notion);
  if (S.incTotal === 1) toast('💡 Premier ticket ! Va sur place, observe, teste, puis choisis la cause. Ton carnet a une fiche « Méthode de la hotline ».', 'info', 7000);
  unlock('diagnostic');
  save(); refreshHUD();
}
function openTicket(t) {
  const inc = INCIDENTS_BY[t.id], p = PEOPLE[t.caller];
  const b = openModal({ title: `🎫 ${inc.title}`, wide: true });
  curNotion = 'diagnostic';
  if (t.stage === 'diag') {
    const tools = [['👀 Observer', null]].concat(t.ctx.client ? inc.tools : []);
    b.innerHTML = `<div class="call inline"><div class="call-face" style="background:${p.shirt}">${p.name.replace(/^(M\.|Mme) /, '')[0]}</div><div><div class="call-who">${esc(p.name)} <small>${esc(p.role)}</small></div><div class="call-msg">« ${fill(inc.call)} »</div></div></div>
      <h4>1. Diagnostiquer ${t.ctx.client ? `<small class="muted">— prise en main à distance : ${esc(CLIENTS[t.ctx.client].name)}</small>` : ''}</h4><div class="term-quick tools"></div><pre class="term small-term">Choisis un outil de diagnostic…</pre>
      <h4>2. Quelle est la cause ?</h4><div class="choices causes"></div><div class="q-fb" hidden></div><div class="after"></div>`;
    const out = b.querySelector('.term'), fb = b.querySelector('.q-fb');
    tools.forEach(([lab, cmd]) => {
      const btn = document.createElement('button'); btn.className = 'chip'; btn.textContent = lab;
      btn.onclick = () => {
        if (!cmd) out.innerHTML = `<span class="obs">${inc.observe(t.ctx)}</span>`;
        else { const r = execCmd(t.ctx.client, cmd); out.textContent = 'C:\\> ' + cmd + '\n' + r.lines.join('\n'); }
      };
      b.querySelector('.tools').append(btn);
    });
    shuffle(inc.causes).forEach(c => {
      const btn = document.createElement('button'); btn.className = 'btn choice'; btn.innerHTML = c.t;
      btn.onclick = () => {
        if (c.ok) {
          btn.classList.add('right'); b.querySelectorAll('.causes button').forEach(x => { x.disabled = true; }); sfx.ok();
          fb.hidden = false; fb.className = 'q-fb ok'; fb.innerHTML = '✔ <b>Bon diagnostic !</b>';
          addScore(15);
          if (!inc.fixes) { resolveTicket(t, b.querySelector('.after')); return; }
          if (t.fixAt === t.reportAt) { fixStage(t, b.querySelector('.after')); return; }
          t.stage = 'fix'; save(); refreshHUD();
          b.querySelector('.after').innerHTML = `<div class="goal">➡️ Il faut intervenir sur : <b>${esc(entName(t.fixAt))}</b>. Vas-y, un repère « ! » t'indique où.</div><div class="actions"><button class="btn primary" id="tk-ok">J'y vais</button></div>`;
          b.querySelector('#tk-ok').onclick = () => closeModal();
        } else {
          btn.classList.add('wrong'); btn.disabled = true; sfx.ko(); addScore(-10); addSat(-3); recordError(inc.notion);
          fb.hidden = false; fb.className = 'q-fb ko'; fb.innerHTML = `✘ ${c.fb || "Ce n'est pas ça."} <i>Utilise les outils de diagnostic !</i>`;
        }
      };
      b.querySelector('.causes').append(btn);
    });
  } else {
    b.innerHTML = `<div class="goal">🛠️ Intervention sur : <b>${esc(entName(t.fixAt))}</b></div><p class="obs">${(inc.observeFix || inc.observe)(t.ctx)}</p><div class="after"></div>`;
    fixStage(t, b.querySelector('.after'));
  }
}
function fixStage(t, el) {
  const inc = INCIDENTS_BY[t.id];
  el.innerHTML = '<h4>3. Que fais-tu ?</h4><div class="choices fixes"></div><div class="q-fb fx" hidden></div>';
  const fb = el.querySelector('.fx');
  shuffle(inc.fixes).forEach(f => {
    const btn = document.createElement('button'); btn.className = 'btn choice'; btn.innerHTML = f.t;
    btn.onclick = () => {
      if (f.ok) { el.querySelectorAll('.fixes button').forEach(x => { x.disabled = true; }); btn.classList.add('right'); resolveTicket(t, el); }
      else { btn.classList.add('wrong'); btn.disabled = true; sfx.ko(); addScore(-10); addSat(-3); recordError(inc.notion); fb.hidden = false; fb.className = 'q-fb ko fx'; fb.innerHTML = `✘ ${f.fb || "Ce n'est pas la bonne action."}`; }
    };
    el.querySelector('.fixes').append(btn);
  });
}
function resolveTicket(t, el) {
  const inc = INCIDENTS_BY[t.id];
  inc.revert(t.ctx);
  S.tickets = S.tickets.filter(x => x.uid !== t.uid);
  const fast = S.t - t.t0 < 90;
  addScore(50 + (fast ? 25 : 0)); addSat(t.late ? 4 : 8); S.incOk++;
  if (inc.notion) unlock(inc.notion);
  sfx.step();
  const p = PEOPLE[t.caller];
  el.insertAdjacentHTML('beforeend', `<div class="q-fb ok">🎉 <b>Problème résolu${fast ? ' en un temps record (+25)' : ''} !</b> ${esc(p.name)} : « Merci, vous me sauvez ! »<br><br>💡 ${inc.explain}</div><div class="actions"><button class="btn primary" id="tk-done">Retour au travail</button></div>`);
  el.querySelector('#tk-done').onclick = () => closeModal();
  save(); refreshHUD();
}
function updateTickets() {
  S.tickets.forEach(t => {
    if (!t.late && S.t - t.t0 > PATIENCE) {
      t.late = true; S.incLate++; addSat(-12);
      toast(`😤 ${esc(PEOPLE[t.caller].name)} s'impatiente : « Ça fait une éternité que j'attends ! »`, 'warn', 4500);
    }
  });
}

/* ---------------------------------------------------------------------
   HUD
   --------------------------------------------------------------------- */
function refreshHUD() {
  if (!S) return;
  const m = MISSIONS[Math.min(S.m, MISSIONS.length - 1)];
  $('#hud-mission').innerHTML = S.finished ? '🏁 Stage terminé' : S.pause ? '☕ Fin de la partie 1 · hotline libre' : `<b>Partie ${m.partie} · Mission ${S.m + 1}</b> · ${m.title} <span class="muted">· ${m.when}</span>`;
  $('#hud-score').textContent = S.score;
  const sat = Math.round(S.sat);
  $('#hud-sat').style.width = sat + '%';
  $('#hud-sat').style.background = sat > 60 ? '#2fbf71' : sat > 35 ? '#f5a524' : '#e5484d';
  $('#hud-sat-txt').textContent = sat + ' %';
  $('#hud-notions').textContent = S.notions.length;
  let html;
  if (S.finished) html = '<h3>🏁 Stage terminé</h3><p class="muted">Bravo ! Tu peux revoir ton rapport ou continuer la hotline.</p><button class="btn small" onclick="report()">📄 Mon rapport de stage</button>';
  else if (S.pause) html = `<h3>☕ Fin de la partie 1</h3><p class="small">Ton code de reprise :</p><div class="code">${resumeCode()}</div><p class="muted small">Continue à répondre aux tickets. Pour lancer la partie 2, parle à Gwenaëlle.</p>`;
  else {
    html = `<h3>🎯 ${m.title}</h3><ol class="steps">`;
    m.steps.forEach((st, i) => {
      const cls = i < S.s ? 'done' : i === S.s ? 'cur' : 'todo';
      html += `<li class="${cls}">${i < S.s ? '✔' : i === S.s ? '▶' : '○'} ${st.label}${i === S.s && st.progress ? `<div class="prog">${st.progress()}</div>` : ''}</li>`;
    });
    html += '</ol>';
  }
  html += `<h3>🎫 Tickets <span class="badge">${S.tickets.length}</span></h3>`;
  if (!S.tickets.length) html += `<p class="muted small">${reached(INCIDENTS[0].unlock) && S.settings.inc !== 'off' ? "Aucun appel en attente… pour l'instant." : 'Les clients appelleront dès que tu seras installé(e) à la hotline.'}</p>`;
  S.tickets.forEach(t => {
    const left = Math.max(0, PATIENCE - (S.t - t.t0)), mm = Math.floor(left / 60), ss = String(Math.floor(left % 60)).padStart(2, '0');
    html += `<div class="ticket ${t.late ? 'late' : ''}"><b>${INCIDENTS_BY[t.id].title}</b><div>${esc(PEOPLE[t.caller].name)} · 📍 ${esc(entName(t.stage === 'fix' ? t.fixAt : t.reportAt))}</div><div class="small">${t.stage === 'fix' ? '🛠️ à réparer' : '🩺 à diagnostiquer'} · ${t.late ? '😤 en retard' : `⏱ ${mm}:${ss}`}</div></div>`;
  });
  $('#side-body').innerHTML = html;
  document.querySelectorAll('#calls .call').forEach(c => { if (!S.tickets.some(t => String(t.uid) === c.dataset.uid)) c.remove(); });
}
function updateHint() {
  const h = $('#hint');
  if (uiBusy()) { h.hidden = true; return; }
  const id = nearestEnt();
  const txt = id ? `<kbd>E</kbd> ${EBY[id].kind === 'person' ? 'Parler à' : 'Utiliser :'} <b>${esc(EBY[id].name)}</b>` : '';
  h.hidden = !txt; h.innerHTML = txt;
}

/* ---------------------------------------------------------------------
   Code de reprise (pour changer de poste entre les deux séances)
   --------------------------------------------------------------------- */
const ALPHA = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
function checksum(str) { let h = 7; for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) % 1021; return ALPHA[h % 32] + ALPHA[Math.floor(h / 32) % 32]; }
function resumeCode() {
  const nums = [S.score, Math.round(S.sat), S.quizOk, S.quizKo, S.incOk, S.incTotal].map(n => Math.max(0, Math.round(n)).toString(36).toUpperCase());
  return `P2-${nums.join('-')}-${checksum((S.name || '').trim().toLowerCase() + nums.join(''))}`;
}
function readCode(code, name) {
  const p = code.trim().toUpperCase().replace(/\s+/g, '').split('-');
  if (p.length !== 8 || p[0] !== 'P2') return null;
  const nums = p.slice(1, 7);
  if (nums.some(n => !/^[0-9A-Z]+$/.test(n))) return null;
  if (checksum(name.trim().toLowerCase() + nums.join('')) !== p[7]) return null;
  const [score, sat, quizOk, quizKo, incOk, incTotal] = nums.map(n => parseInt(n, 36));
  return { score, sat, quizOk, quizKo, incOk, incTotal };
}

/* ---------------------------------------------------------------------
   Rapport de stage, menu, enseignant
   --------------------------------------------------------------------- */
const BO_CAPS = [
  ['Distinguer le rôle des protocoles IP et TCP.', ['tcp']],
  ['Caractériser les principes du routage et ses limites.', ['routage', 'limites']],
  ["Distinguer la fiabilité de transmission et l'absence de garantie temporelle.", ['temps']],
  ['Sur des exemples réels, retrouver une adresse IP à partir d\'une adresse symbolique et inversement.', ['dns']],
  ["Décrire l'intérêt des réseaux pair-à-pair ainsi que les usages illicites qu'on peut en faire.", ['p2p']],
  ['Caractériser quelques types de réseaux physiques : obsolètes ou actuels, rapides ou lents, filaires ou non.', ['physique']],
  ["Caractériser l'ordre de grandeur du trafic de données sur Internet et son évolution.", ['trafic']]
];
function report() {
  const dur = Math.round(S.t / 60);
  const acc = S.quizOk + S.quizKo ? Math.round(100 * S.quizOk / (S.quizOk + S.quizKo)) : 0;
  const errs = Object.entries(S.errors).sort((a, b) => b[1] - a[1]);
  const avis = S.sat >= 75 ? 'Excellent stage : les clients demandent déjà quand tu reviens !' : S.sat >= 50 ? 'Bon stage : quelques frayeurs, mais la hotline a tenu le coup.' : 'Stage mouvementé : tout marche, mais les clients ont beaucoup attendu…';
  const b = openModal({ title: '📄 Rapport de stage', wide: true });
  b.innerHTML = `<div class="report" id="report">
    <h3>Le Stagiaire du Bout du Monde — rapport de stage chez IroiseNet</h3>
    <p><b>Nom :</b> ${esc(S.name || '—')} · <b>Classe :</b> ${esc(S.classe || '—')} · <b>Date :</b> ${new Date().toLocaleDateString('fr-FR')}</p>
    <div class="stats"><div><b>${S.score}</b><span>points</span></div><div><b>${Math.round(S.sat)} %</b><span>satisfaction</span></div><div><b>${S.incOk} / ${S.incTotal}</b><span>tickets résolus</span></div><div><b>${acc} %</b><span>réponses justes</span></div><div><b>${dur} min</b><span>de jeu (ce poste)</span></div></div>
    <p><b>Avis de Gwenaëlle :</b> ${avis}</p>
    <h4>Missions</h4><ul>${MISSIONS.map((m, i) => `<li>${(S.finished || i < S.m) ? '✅' : i === S.m ? '⏳' : '⬜'} Partie ${m.partie} · Mission ${i + 1} — ${m.title}</li>`).join('')}</ul>
    <h4>Capacités du programme (thème Internet)</h4><ul class="caps">${BO_CAPS.map(([t, ns]) => `<li>${ns.every(n => S.notions.includes(n)) ? '✅' : '⬜'} ${t}</li>`).join('')}</ul>
    <h4>Points à retravailler</h4><p>${errs.length ? errs.slice(0, 5).map(([n, k]) => `${NOTIONS[n] ? NOTIONS[n].title : n} (${k} erreur${k > 1 ? 's' : ''})`).join(' · ') : 'Aucune erreur : bravo !'}</p>
  </div><div class="actions"><button class="btn" id="rp-print">🖨️ Imprimer / PDF</button><button class="btn primary" id="rp-close">Fermer</button></div>`;
  b.querySelector('#rp-print').onclick = () => window.print();
  b.querySelector('#rp-close').onclick = () => closeModal();
}
function help() {
  const b = openModal({ title: '❓ Comment jouer' });
  b.innerHTML = `<ul class="help">
    <li>🖱️ <b>Clique</b> sur le sol pour te déplacer, ou sur un collègue / un équipement pour aller l'utiliser.</li>
    <li>⌨️ Ou déplace-toi avec les <b>flèches</b> / <b>ZQSD</b> / <b>WASD</b>, et interagis avec <kbd>E</kbd> ou <kbd>Espace</kbd>.</li>
    <li>🟡 La <b>flèche jaune</b> indique ton objectif. Le panneau de droite liste les étapes.</li>
    <li>☎️ Les <b>clients appellent</b> la hotline : un ticket s'ouvre et un <b>!</b> rouge montre où aller. Observe, teste (ipconfig, ping, nslookup, tracert), trouve la cause, répare.</li>
    <li><kbd>T</kbd> carte du réseau IroiseNet · <kbd>C</kbd> carnet de notions · <kbd>Échap</kbd> menu.</li>
    <li>💾 La partie est sauvegardée dans ce navigateur. À la fin de la partie 1, note ton <b>code de reprise</b>.</li></ul>`;
}
function menu() {
  const b = openModal({ title: '⚙️ Menu' });
  b.innerHTML = `<div class="menu">
    <label>Fréquence des appels <select id="mn-inc"><option value="off">Désactivés</option><option value="calme">Calme</option><option value="normal">Normale</option><option value="intense">Intense</option></select></label>
    <label><input type="checkbox" id="mn-snd"> Sons</label>
    <div class="actions col"><button class="btn" id="mn-help">❓ Aide</button><button class="btn" id="mn-rep">📄 Rapport de stage (en cours)</button><button class="btn" id="mn-prof">🎓 Mode enseignant</button><button class="btn danger" id="mn-reset">🗑️ Recommencer depuis le début</button></div></div>`;
  b.querySelector('#mn-inc').value = S.settings.inc;
  b.querySelector('#mn-snd').checked = S.settings.sound;
  b.querySelector('#mn-inc').onchange = e => { S.settings.inc = e.target.value; S.nextInc = null; save(); refreshHUD(); };
  b.querySelector('#mn-snd').onchange = e => { S.settings.sound = e.target.checked; save(); };
  b.querySelector('#mn-help').onclick = () => { closeModal(true); help(); };
  b.querySelector('#mn-rep').onclick = () => { closeModal(true); report(); };
  b.querySelector('#mn-prof').onclick = () => { closeModal(true); teacher(); };
  b.querySelector('#mn-reset').onclick = () => { if (confirm('Effacer la progression et recommencer ?')) { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* rien */ } location.reload(); } };
}
const TEACHER_CODE = 'IROISE';
function teacher() {
  const b = openModal({ title: '🎓 Mode enseignant' });
  b.innerHTML = `<p class="muted">Permet de reprendre directement à une mission (démonstration, élève absent, changement de poste). Code indiqué dans la fiche enseignant.</p>
    <form class="cfg" id="tc"><label><span>Code</span><input name="code" autocomplete="off"></label>
    <label><span>Reprendre à</span><select name="m">${MISSIONS.map((m, i) => `<option value="${i}">Partie ${m.partie} · Mission ${i + 1} — ${m.title}</option>`).join('')}</select></label>
    <div class="cfg-err" hidden></div><div class="actions"><button class="btn primary">Appliquer</button></div></form>`;
  b.querySelector('#tc').onsubmit = ev => {
    ev.preventDefault();
    const f = ev.target;
    if (f.elements.code.value.trim().toUpperCase() !== TEACHER_CODE) { const e = b.querySelector('.cfg-err'); e.hidden = false; e.textContent = 'Code incorrect.'; return; }
    jumpTo(+f.elements.m.value);
  };
}
function jumpTo(mi, stats) {
  const keep = { name: S.name, classe: S.classe, settings: S.settings };
  S = newState(keep.name, keep.classe); S.settings = keep.settings;
  MISSIONS.slice(0, mi).forEach(m => m.steps.forEach(st => { if (st.skip) st.skip(); (st.notions || []).forEach(n => { if (!S.notions.includes(n)) S.notions.push(n); }); }));
  S.m = mi; S.s = 0;
  if (stats) Object.assign(S, stats);
  closeModal(true); save(); refreshHUD(); missionIntro();
}

/* ---------------------------------------------------------------------
   Écran titre et boucle principale
   --------------------------------------------------------------------- */
function startScreen() {
  const ts = $('#title-screen'), saved = loadSave();
  ts.hidden = false;
  $('#ts-continue').hidden = !saved;
  if (saved) { $('#ts-name').value = saved.name || ''; $('#ts-class').value = saved.classe || ''; $('#ts-continue').textContent = `▶ Continuer (${saved.name || 'partie'} · mission ${Math.min(saved.m + 1, MISSIONS.length)})`; }
  const getNames = () => [$('#ts-name').value.trim(), $('#ts-class').value.trim()];
  const needField = sel => { $(sel).focus(); $(sel).classList.add('shake'); setTimeout(() => $(sel).classList.remove('shake'), 500); };
  const needName = () => needField('#ts-name');
  $('#ts-form').onsubmit = ev => {
    ev.preventDefault();
    const [name, classe] = getNames();
    if (!name) { needName(); return; }
    if (!classe) { needField('#ts-class'); return; }
    if (saved && !confirm('Une partie existe déjà dans ce navigateur. La remplacer par une nouvelle partie ?')) return;
    S = newState(name, classe); ts.hidden = true; save(); refreshHUD(); missionIntro();
  };
  $('#ts-continue').onclick = () => {
    S = Object.assign(newState(), saved);
    S.net = Object.assign(newState().net, saved.net || {});
    const [nm, cl] = getNames();
    if (nm) S.name = nm; if (cl) S.classe = cl;
    ts.hidden = true; refreshHUD();
    if (S.finished) report(); else if (S.s === 0 && !S.pause) missionIntro();
  };
  $('#ts-code').onclick = () => {
    const [name, classe] = getNames();
    if (!name) { needName(); return; }
    if (!classe) { needField('#ts-class'); return; }
    const code = prompt('Code de reprise noté à la fin de la partie 1 (ex : P2-…) :');
    if (!code) return;
    const st = readCode(code, name);
    if (!st) { alert("Code invalide. Vérifie le code et écris ton prénom exactement comme lors de la partie 1."); return; }
    S = newState(name, classe); ts.hidden = true;
    jumpTo(PART2, st);
  };
}

let last = performance.now(), hudTimer = 0, saveTimer = 0;
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now; animT += dt;
  if (S && $('#title-screen').hidden) {
    S.t += dt;
    updatePlayer(dt); scheduleIncidents(); updateTickets();
    hudTimer += dt; saveTimer += dt;
    if (hudTimer > 1) { hudTimer = 0; refreshHUD(); }
    if (saveTimer > 5) { saveTimer = 0; save(); }
    updateHint();
  }
  if (S) render();
  requestAnimationFrame(loop);
}

/* entrées clavier / souris */
const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', z: 'up', w: 'up', s: 'down', q: 'left', a: 'left', d: 'right' };
addEventListener('keydown', ev => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if (ev.key === 'Escape') { if (carnetOpen()) closeCarnet(); else if (modalOpen() && modalClosable) closeModal(); else if (!uiBusy() && S) menu(); return; }
  if (typing) return;
  if ((ev.key === 'c' || ev.key === 'C') && S && $('#title-screen').hidden) { carnet(); return; }
  if (dlg && ['e', 'E', ' ', 'Enter'].includes(ev.key)) { ev.preventDefault(); advanceDialog(); return; }
  if (!S || uiBusy()) return;
  const k = KEYMAP[ev.key] || KEYMAP[ev.key.toLowerCase()];
  if (k) { keys.add(k); ev.preventDefault(); return; }
  if (['e', 'E', ' ', 'Enter'].includes(ev.key)) { ev.preventDefault(); const id = nearestEnt(); if (id) interact(id); }
  if (ev.key === 't' || ev.key === 'T') carte();
});
addEventListener('keyup', ev => { const k = KEYMAP[ev.key] || KEYMAP[ev.key.toLowerCase()]; if (k) keys.delete(k); });
addEventListener('blur', () => keys.clear());
function toWorld(ev) { const r = cv.getBoundingClientRect(); return [(ev.clientX - r.left - cam.tx) / cam.s, (ev.clientY - r.top - cam.ty) / cam.s]; }
function pickAt(wx, wy) {
  let best = null;
  picks.forEach(p => { if (wx >= p.x0 && wx <= p.x1 && wy >= p.y0 && wy <= p.y1 && (!best || p.k > best.k)) best = p; });
  return best ? best.id : null;
}
cv.addEventListener('pointermove', ev => { if (!S) return; const [x, y] = toWorld(ev); hoverId = pickAt(x, y); cv.style.cursor = hoverId ? 'pointer' : 'default'; });
cv.addEventListener('pointerdown', ev => {
  if (!S || uiBusy()) { if (dlg) advanceDialog(); return; }
  const [wx, wy] = toWorld(ev), id = pickAt(wx, wy);
  if (id) { goToEnt(id); return; }
  const gx = Math.floor((wx / (TW / 2) + wy / (TH / 2)) / 2), gy = Math.floor((wy / (TH / 2) - wx / (TW / 2)) / 2);
  if (walkable(gx, gy)) walkTo(gx, gy);
});
$('#dialog').addEventListener('click', advanceDialog);
$('#modal-wrap').addEventListener('pointerdown', ev => { if (ev.target.id === 'modal-wrap' && modalClosable) closeModal(); });
$('#btn-schema').onclick = () => !uiBusy() && carte();
$('#btn-carnet').onclick = () => S && $('#title-screen').hidden && carnet();
$('#btn-menu').onclick = () => !uiBusy() && menu();
$('#btn-help').onclick = () => !uiBusy() && help();
$('#btn-side').onclick = () => { document.body.classList.toggle('side-open'); };
if (innerWidth > 900) document.body.classList.add('side-open');

S = newState();
startScreen();
requestAnimationFrame(loop);
