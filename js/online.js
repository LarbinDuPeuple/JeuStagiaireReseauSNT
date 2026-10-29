/* ---------------------------------------------------------------------
   Mode en ligne (facultatif, via Firebase)
   - envoie le rapport de l'élève à l'espace enseignant (prof.html) ;
   - bloque l'écran quand l'enseignant le demande ;
   - ouvre la partie 2 quand l'enseignant la débloque ;
   - efface la partie si l'enseignant supprime la progression de l'élève.
   Sans configuration (js/firebase-config.js), hors ligne ou depuis une clé USB,
   le jeu fonctionne comme avant et la partie 2 est libre.
   --------------------------------------------------------------------- */
const FB_VERSION = '10.12.2';
const FB_BASE = window.FIREBASE_SDK_BASE || `https://www.gstatic.com/firebasejs/${FB_VERSION}/`;
const ONLINE = { on: false, ok: false, locked: false, msg: '', part2: false };
const classeId = c => String(c || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'sans-classe';
const RESET_SEEN = 'stagiaire-snt-reset-vu';
/* la partie 2 est libre hors ligne ; en ligne, elle attend le feu vert de l'enseignant */
const part2Open = () => !ONLINE.on || ONLINE.part2;

(function () {
  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.projectId || !/^https?:$/.test(location.protocol)) return;
  ONLINE.on = true; // mode en ligne prévu : la partie 2 attend l'enseignant
  let F, db, uid, classe = null, lastSent = '', lastTime = 0, sending = false, again = false, oldRules = false;
  const ctl = {};
  let unsubClasse = null;

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
      uid = (await auth.signInAnonymously(au)).user.uid;
      ONLINE.ok = true;
      listen('toutes', 'toutes');
      listenReset();
      onlineTick(true);
      if (typeof refreshHUD === 'function' && S) refreshHUD();
    })
    .catch(e => {
      // Firebase injoignable : le jeu repasse en mode hors ligne (partie 2 libre)
      console.warn('Mode en ligne indisponible :', e);
      ONLINE.on = false;
      if (typeof refreshHUD === 'function' && S) refreshHUD();
    });

  function listen(docId, key) {
    return F.onSnapshot(F.doc(db, 'controle', docId), snap => {
      ctl[key] = snap.exists() ? snap.data() : {};
      apply();
    }, () => { ctl[key] = {}; apply(); });
  }
  function apply() {
    const all = Object.values(ctl);
    const on = all.filter(d => d.bloque);
    ONLINE.locked = on.length > 0;
    ONLINE.msg = (on.find(d => d.message) || {}).message || '';
    const was = ONLINE.part2;
    ONLINE.part2 = all.some(d => d.partie2);
    if (ONLINE.part2 !== was && typeof part2Changed === 'function') part2Changed(ONLINE.part2);
    const el = document.getElementById('lock-screen');
    if (!el) return;
    el.hidden = !ONLINE.locked;
    el.querySelector('.lock-msg').textContent = ONLINE.msg;
    if (ONLINE.locked && document.activeElement) document.activeElement.blur();
    if (ONLINE.locked && typeof keys !== 'undefined') keys.clear();
  }
  /* l'enseignant a supprimé la progression de cet élève : on repart de zéro */
  function listenReset() {
    F.onSnapshot(F.doc(db, 'controle', 'reset-' + uid), snap => {
      const at = snap.exists() && snap.data().reset ? snap.data().reset.toMillis() : 0;
      let seen = 0;
      try { seen = +localStorage.getItem(RESET_SEEN) || 0; } catch (e) { /* rien */ }
      if (!at || at <= seen) return;
      try { localStorage.setItem(RESET_SEEN, String(at)); localStorage.removeItem(SAVE_KEY); } catch (e) { /* rien */ }
      lastSent = ''; S = null;
      alert('Ton professeur a remis ta partie à zéro. Le jeu va redémarrer.');
      location.reload();
    }, () => {});
  }

  /* appelé par la boucle du jeu (chaque seconde) et à chaque fin de mission */
  window.onlineTick = function (force) {
    if (!ONLINE.ok || !S || !S.name) return;
    if (S.classe !== classe) {
      classe = S.classe;
      if (unsubClasse) unsubClasse();
      delete ctl.classe;
      unsubClasse = listen(classeId(classe), 'classe');
    }
    const now = Date.now();
    const r = rapportData();
    const data = {
      nom: r.nom.slice(0, 30), classe: r.classe.slice(0, 20), missions: r.missions, fini: r.fini,
      score: r.score, satisfaction: r.satisfaction, ticketsOk: r.ticketsOk, tickets: r.tickets,
      reponsesOk: r.reponsesOk, reponsesKo: r.reponsesKo, minutes: r.minutes,
      capacites: r.capacites, erreurs: r.erreurs.map(([n, k]) => ({ n, k }))
    };
    if (!oldRules) data.fiches = r.fiches;
    const sig = JSON.stringify(Object.assign({}, data, { minutes: 0 }));
    const changed = sig !== lastSent;
    if (sending) { if (force) again = true; return; }
    // au plus une écriture par minute (et un signe de vie toutes les 3 min) : 30 élèves restent
    // très loin des limites de l'offre gratuite de Firebase
    if (!(force || (changed && now - lastTime > 60000) || now - lastTime > 180000)) return;
    sending = true;
    data.maj = F.serverTimestamp();
    F.setDoc(F.doc(db, 'eleves', uid), data)
      .then(() => { lastSent = sig; lastTime = Date.now(); })
      .catch(e => {
        // règles Firestore pas encore mises à jour (champ « fiches » refusé) : on envoie sans
        if (e.code === 'permission-denied' && !oldRules && 'fiches' in data) { oldRules = true; again = true; return; }
        console.warn('Envoi du rapport impossible :', e); lastTime = Date.now();
      })
      .finally(() => { sending = false; if (again) { again = false; window.onlineTick(true); } });
  };
})();
