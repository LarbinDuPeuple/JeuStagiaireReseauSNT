/* ---------------------------------------------------------------------
   Mode en ligne (facultatif, via Firebase)
   - sauvegarde la partie en ligne : l'élève la retrouve sur n'importe quel
     poste en retapant son prénom (avec l'initiale du nom) et sa classe ;
   - envoie ses résultats à l'espace enseignant (prof.html) ;
   - bloque l'écran quand l'enseignant le demande ;
   - ouvre la partie 2 (puis la partie 3) quand l'enseignant la débloque ;
   - efface la partie si l'enseignant supprime la progression de l'élève ;
   - laisse l'enseignant éteindre la borne d'arcade (mini-jeu) et enregistre les meilleurs scores.
   Sans configuration (js/firebase-config.js), hors ligne ou depuis une clé USB,
   le jeu fonctionne comme avant et toutes les parties sont libres.
   --------------------------------------------------------------------- */
const FB_VERSION = '10.12.2';
const FB_BASE = window.FIREBASE_SDK_BASE || `https://www.gstatic.com/firebasejs/${FB_VERSION}/`;
const ONLINE = { on: false, ok: false, locked: false, msg: '', parts: {}, arcadeOff: false };
const classeId = c => String(c || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'sans-classe';
/* identifiant d'une partie : « 2nde-4__lucas-m » (accents, points et majuscules ignorés) */
const partieKey = (nom, classe) => `${classeId(classe)}__${classeId(nom)}`;
const RESET_SEEN = 'stagiaire-snt-reset-vu';
/* hors ligne, toutes les parties sont libres ; en ligne, les parties 2 et 3 attendent le feu vert
   de l'enseignant (champs « partie2 » et « partie3 » des documents de contrôle) */
const PARTS = [2, 3];
const partOpen = n => n <= 1 || !ONLINE.on || !!ONLINE.parts[n];

(function () {
  const cfg = window.FIREBASE_CONFIG;
  let readyDone;
  ONLINE.ready = new Promise(r => { readyDone = r; });
  if (!cfg || !cfg.projectId || !/^https?:$/.test(location.protocol)) { readyDone(); return; }
  ONLINE.on = true; // mode en ligne prévu : les parties 2 et 3 attendent l'enseignant
  let F, db, key = null, lastSent = '', lastTime = 0, sending = false, again = false;
  const ctl = {};
  let unsubClasse = null, unsubReset = null;

  Promise.all(['app', 'auth', 'firestore'].map(m => import(`${FB_BASE}firebase-${m}.js`)))
    .then(async ([app, auth, fs]) => {
      F = fs;
      const a = app.initializeApp(cfg);
      db = fs.getFirestore(a);
      const au = auth.getAuth(a);
      if (window.FIREBASE_EMULATOR) {
        auth.connectAuthEmulator(au, `http://${window.FIREBASE_EMULATOR.host}:${window.FIREBASE_EMULATOR.auth}`, { disableWarnings: true });
        fs.connectFirestoreEmulator(db, window.FIREBASE_EMULATOR.host, window.FIREBASE_EMULATOR.fs);
      }
      await auth.signInAnonymously(au);
      ONLINE.ok = true;
      listen('toutes', 'toutes');
      readyDone();
      onlineTick(true);
      if (typeof refreshHUD === 'function' && S) refreshHUD();
    })
    .catch(e => {
      // Firebase injoignable : le jeu repasse en mode hors ligne (parties libres)
      console.warn('Mode en ligne indisponible :', e);
      ONLINE.on = false;
      readyDone();
      if (typeof refreshHUD === 'function' && S) refreshHUD();
    });

  /* partie sauvegardée en ligne pour ce prénom et cette classe (null si aucune) */
  ONLINE.fetch = async (nom, classe) => {
    await Promise.race([ONLINE.ready, new Promise(r => setTimeout(r, 6000))]);
    if (!ONLINE.ok) return null;
    try {
      const snap = await F.getDoc(F.doc(db, 'parties', partieKey(nom, classe)));
      return snap.exists() && snap.data().etat ? JSON.parse(snap.data().etat) : null;
    } catch (e) { console.warn('Lecture de la partie impossible :', e); return null; }
  };

  /* mini-jeu : meilleur score de l'élève (le serveur refuse un score plus bas que le record) */
  ONLINE.saveScore = async score => {
    if (!ONLINE.ok || !S || !S.name || !S.classe) return;
    const ref = F.doc(db, 'scores', partieKey(S.name, S.classe));
    try {
      const old = await F.getDoc(ref), o = old.exists() ? old.data() : { best: 0, parties: 0 };
      await F.setDoc(ref, { nom: S.name.slice(0, 30), classe: S.classe.slice(0, 20), best: Math.max(o.best || 0, Math.min(30000, Math.round(score))), parties: Math.min(10000, (o.parties || 0) + 1), maj: F.serverTimestamp() });
    } catch (e) { console.warn('Score non enregistré :', e); }
  };
  ONLINE.loadScores = async () => {
    if (!ONLINE.ok) return null;
    try { const snap = await F.getDocs(F.collection(db, 'scores')); return snap.docs.map(d => Object.assign({ id: d.id }, d.data())); } catch (e) { console.warn('Classement indisponible :', e); return null; }
  };

  function listen(docId, k) {
    return F.onSnapshot(F.doc(db, 'controle', docId), snap => {
      ctl[k] = snap.exists() ? snap.data() : {};
      apply();
    }, () => { ctl[k] = {}; apply(); });
  }
  function apply() {
    const all = Object.values(ctl);
    const on = all.filter(d => d.bloque);
    ONLINE.locked = on.length > 0;
    ONLINE.msg = (on.find(d => d.message) || {}).message || '';
    PARTS.forEach(n => {
      const was = !!ONLINE.parts[n];
      ONLINE.parts[n] = all.some(d => d['partie' + n]);
      if (ONLINE.parts[n] !== was && typeof partChanged === 'function') partChanged(n, ONLINE.parts[n]);
    });
    const off = ONLINE.arcadeOff;
    ONLINE.arcadeOff = all.some(d => d.arcadeOff);
    if (off !== ONLINE.arcadeOff && typeof arcadeSwitched === 'function') arcadeSwitched();
    const el = document.getElementById('lock-screen');
    if (!el) return;
    el.hidden = !ONLINE.locked;
    el.querySelector('.lock-msg').textContent = ONLINE.msg;
    if (ONLINE.locked && document.activeElement) document.activeElement.blur();
    if (ONLINE.locked && typeof keys !== 'undefined') keys.clear();
  }
  /* l'enseignant a supprimé la progression de cet élève : on repart de zéro */
  function listenReset(k) {
    return F.onSnapshot(F.doc(db, 'controle', 'reset-' + k), snap => {
      const at = snap.exists() && snap.data().reset ? snap.data().reset.toMillis() : 0;
      let seen = 0;
      try { seen = +localStorage.getItem(RESET_SEEN) || 0; } catch (e) { /* rien */ }
      if (!at || at <= seen) return;
      // la consigne est plus ancienne que cette partie : déjà recommencée ailleurs
      if (S && S.debut && S.debut > at) { try { localStorage.setItem(RESET_SEEN, String(at)); } catch (e) { /* rien */ } return; }
      try { localStorage.setItem(RESET_SEEN, String(at)); localStorage.removeItem(SAVE_KEY); } catch (e) { /* rien */ }
      lastSent = ''; key = null; S = null;
      alert('Ton professeur a remis ta partie à zéro. Le jeu va redémarrer.');
      location.reload();
    }, () => {});
  }

  /* appelé par la boucle du jeu (chaque seconde) et à chaque fin de mission */
  window.onlineTick = function (force) {
    if (!ONLINE.ok || !S || !S.name || !S.classe) return;
    const k = partieKey(S.name, S.classe);
    if (k !== key) {
      key = k; lastSent = '';
      if (unsubClasse) unsubClasse();
      if (unsubReset) unsubReset();
      delete ctl.classe;
      unsubClasse = listen(classeId(S.classe), 'classe');
      unsubReset = listenReset(k);
    }
    const now = Date.now();
    const r = rapportData();
    const data = {
      nom: r.nom.slice(0, 30), classe: r.classe.slice(0, 20), missions: r.missions, fini: r.fini,
      score: r.score, satisfaction: r.satisfaction, ticketsOk: r.ticketsOk, tickets: r.tickets,
      reponsesOk: r.reponsesOk, reponsesKo: r.reponsesKo, minutes: r.minutes,
      capacites: r.capacites, erreurs: r.erreurs.map(([n, k2]) => ({ n, k: k2 }))
    };
    const sig = JSON.stringify(Object.assign({}, data, { minutes: 0 }));
    const changed = sig !== lastSent;
    if (sending) { if (force) again = true; return; }
    // au plus une écriture par minute (et une sauvegarde toutes les 3 min) : 30 élèves restent
    // très loin des limites de l'offre gratuite de Firebase
    if (!(force || (changed && now - lastTime > 60000) || now - lastTime > 180000)) return;
    sending = true;
    data.etat = JSON.stringify(S);
    data.maj = F.serverTimestamp();
    F.setDoc(F.doc(db, 'parties', k), data)
      .then(() => { lastSent = sig; lastTime = Date.now(); })
      .catch(e => { console.warn('Sauvegarde en ligne impossible :', e); lastTime = Date.now(); })
      .finally(() => { sending = false; if (again) { again = false; window.onlineTick(true); } });
  };
  // l'élève ferme l'onglet ou change de fenêtre : on sauvegarde tout de suite
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') window.onlineTick(true); });
})();
