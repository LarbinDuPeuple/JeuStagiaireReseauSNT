# 🌊 Le Stagiaire du Bout du Monde

Jeu sérieux pour navigateur, en vue isométrique, pour la SNT en 2nde, thèmes **Internet** (parties 1 et 2) et **le Web** (partie 3), en trois parties d'environ 1 h, que l'enseignant débloque au rythme de la classe.

> Lundi, 8h30, port de commerce de Brest. Premier jour de stage chez IroiseNet, le fournisseur d'accès à Internet du Finistère. Le technicien est bloqué à Ouessant par la tempête… et le téléphone de la hotline sonne déjà.

**▶ Jouer :** https://jeustagiaire-snt.web.app/
**📄 Fiche enseignant :** [FICHE_ENSEIGNANT.md](FICHE_ENSEIGNANT.md) (déroulé des trois parties, capacités du programme, corrigé)

## Contenu

| Partie | Mission | Notions |
|---|---|---|
| 1 | 1. Bienvenue au bout du monde | histoire d'Internet, réseaux physiques, ordre de grandeur du trafic |
| 1 | 2. Allô, la hotline ? | adresse IP, box et passerelle, analyse du réseau local, DNS dans les deux sens (`ipconfig`, `nslookup`) |
| 2 | 3. Le voyage des paquets | routage de proche en proche, tables locales, panne, compteur de sauts (`tracert`) |
| 2 | 4. TCP à la rescousse | rôles d'IP et de TCP, fiabilité et absence de garantie temporelle |
| 3 | 5. Le site de la crêperie | Web et Internet, hypertexte, histoire du Web, URL et HTTPS, requête HTTP et paramètres (navigateur avec outils de développement), client et serveur, HTML et CSS (éditeur avec aperçu) |
| 3 | 6. Chercher, protéger, publier | indexation à la main, popularité et liens promotionnels, hameçonnage, cookies et réglages du navigateur, droit d'auteur, licences, droit à l'oubli |

Pendant le jeu, **23 tickets** de la hotline se débloquent au fil des missions : 12 pannes à diagnostiquer (box éteinte, DNS en panne, routeur de Morlaix coupé, déni de service, pair-à-pair, neutralité du Net, NTP, clé Wi-Fi, page 404, paiement sur une page en http…) et 11 quiz de révision posés par les collègues (réseaux physiques, adresses IP, DNS, routage, IP et TCP, usages, histoire du Web et URL, requêtes HTTP, HTML et CSS, moteurs de recherche, sécurité). Quand un élève a fini une partie, les appels s'enchaînent toutes les 5 secondes pour l'occuper en attendant les autres. Le jeu propose aussi un carnet de 25 fiches, une carte du réseau, une invite de commandes simulée, un rapport de stage imprimable et, hors ligne, un **code de reprise** entre deux parties.

## Commandes

- Clic sur le sol pour se déplacer, clic sur un collègue ou un équipement pour aller l'utiliser.
- Flèches / ZQSD / WASD pour se déplacer, <kbd>E</kbd> ou <kbd>Espace</kbd> pour interagir.
- <kbd>T</kbd> : carte du réseau · <kbd>C</kbd> : carnet · <kbd>Échap</kbd> : menu.

## Technique

HTML, CSS et JavaScript, sans dépendance ni étape de build : il suffit d'ouvrir `index.html`. La progression est sauvegardée dans le navigateur (`localStorage`).

- `js/content.js` : contenu pédagogique (missions, questions, tickets, fiches, réseau simulé). C'est le fichier à modifier pour adapter le jeu.
- `js/web.js` : activités de la partie 3 (navigateur et outils de développement, éditeur HTML/CSS, indexation, mail d'hameçonnage, réglages du navigateur).
- `js/game.js` : moteur (rendu isométrique, simulation réseau, mini-jeux de routage et de TCP, interface). Il est adapté du moteur du [Stagiaire Réseau](https://github.com/LarbinDuPeuple/JeuStagiaireReseau).

Mode enseignant (reprendre à une mission) : menu ⚙️, code `IROISE`.

Espace enseignant (rapports des élèves triés par classe) : [`prof.html`](https://jeustagiaire-snt.web.app/prof.html). Voir la fiche enseignant. Mode en ligne facultatif (suivi en direct, blocage des jeux) : [FIREBASE.md](FIREBASE.md).
