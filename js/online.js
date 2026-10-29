/* ---------------------------------------------------------------------
   Mode en ligne (facultatif, via Firebase)
   - envoie le rapport de l'élève à l'espace enseignant (prof.html) ;
   - bloque l'écran quand l'enseignant le demande.
   Sans configuration (js/firebase-config.js), hors ligne ou depuis une clé USB,
   le jeu fonctionne exactement comme avant.
   --------------------------------------------------------------------- */
const FB_VERSION = '10.12.2';
const FB_BASE = window.FIREBASE_SDK_BASE || `https://www.gstatic.com/firebasejs/${FB_VERSION}/`;
const ONLINE = { ok: false, locked: false, msg: '' };
const classeId = c => String(c || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'sans-classe';

(function () {
  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.projectId || !/^https?:$/.test(location.protocol)) return;
  let F, db, uid, classe = null, lastSent = '', lastTime = 0, sending = false, again = false;
  const locks = {};
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
      onlineTick(true);
    })
    .catch(e => console.warn('Mode en ligne indisponible :', e));

  function listen(docId, key) {
    return F.onSnapshot(F.doc(db, 'controle', docId), snap => {
      const d = snap.exists() ? snap.data() : {};
      locks[key] = d.bloque ? (d.message || '') : null;
      applyLock();
    }, () => { locks[key] = null; applyLock(); });
  }
  function applyLock() {
    const on = Object.values(locks).filter(v => v !== null);
    ONLINE.locked = on.length > 0;
    ONLINE.msg = on.find(Boolean) || '';
    const el = document.getElementById('lock-screen');
    if (!el) return;
    el.hidden = !ONLINE.locked;
    el.querySelector('.lock-msg').textContent = ONLINE.msg;
    if (ONLINE.locked && document.activeElement) document.activeElement.blur();
    if (ONLINE.locked && typeof keys !== 'undefined') keys.clear();
  }

  /* appelé par la boucle du jeu (chaque seconde) et à chaque fin de mission */
  window.onlineTick = function (force) {
    if (!ONLINE.ok || !S || !S.name) return;
    if (S.classe !== classe) {
      classe = S.classe;
      if (unsubClasse) unsubClasse();
      delete locks.classe;
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
    const sig = JSON.stringify(data);
    const changed = sig !== lastSent;
    // au plus une écriture toutes les 20 s, et un signe de vie toutes les 90 s
    if (sending) { if (force) again = true; return; }
    if (!(force || (changed && now - lastTime > 20000) || now - lastTime > 90000)) return;
    sending = true;
    data.maj = F.serverTimestamp();
    F.setDoc(F.doc(db, 'eleves', uid), data)
      .then(() => { lastSent = sig; lastTime = Date.now(); })
      .catch(e => { console.warn('Envoi du rapport impossible :', e); lastTime = Date.now(); })
      .finally(() => { sending = false; if (again) { again = false; window.onlineTick(true); } });
  };
})();
