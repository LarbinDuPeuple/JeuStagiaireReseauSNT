# 🌊 Le Stagiaire du Bout du Monde

Jeu sérieux pour navigateur, en vue isométrique, pour **deux séances de SNT en 2nde** sur le thème **Internet**.

> Lundi, 8h30, port de commerce de Brest. Premier jour de stage chez IroiseNet, le fournisseur d'accès à Internet du Finistère. Le technicien est bloqué à Ouessant par la tempête… et le téléphone de la hotline sonne déjà.

**▶ Jouer :** https://larbindupeuple.github.io/JeuStagiaireReseauSNT/
**📄 Fiche enseignant :** [FICHE_ENSEIGNANT.md](FICHE_ENSEIGNANT.md) (déroulé des deux séances, capacités du programme, corrigé)

## Contenu

| Partie | Mission | Notions |
|---|---|---|
| 1 | 1. Bienvenue au bout du monde | histoire d'Internet, réseaux physiques, ordre de grandeur du trafic |
| 1 | 2. Allô, la hotline ? | adresse IP, box et passerelle, analyse du réseau local, DNS dans les deux sens (`ipconfig`, `nslookup`) |
| 2 | 3. Le voyage des paquets | routage de proche en proche, tables locales, panne, compteur de sauts (`tracert`) |
| 2 | 4. TCP à la rescousse | rôles d'IP et de TCP, fiabilité et absence de garantie temporelle |

Pendant le jeu, **9 tickets** de la hotline tombent au hasard (box éteinte, DNS en panne, routeur de Morlaix coupé, déni de service, pair-à-pair, neutralité du Net, NTP…). Le jeu propose aussi un carnet de 13 fiches, une carte du réseau, une invite de commandes simulée, un **code de reprise** entre les deux séances et un rapport de stage imprimable.

## Commandes

- Clic sur le sol pour se déplacer, clic sur un collègue ou un équipement pour aller l'utiliser.
- Flèches / ZQSD / WASD pour se déplacer, <kbd>E</kbd> ou <kbd>Espace</kbd> pour interagir.
- <kbd>T</kbd> : carte du réseau · <kbd>C</kbd> : carnet · <kbd>Échap</kbd> : menu.

## Technique

HTML, CSS et JavaScript, sans dépendance ni étape de build : il suffit d'ouvrir `index.html`. La progression est sauvegardée dans le navigateur (`localStorage`).

- `js/content.js` : contenu pédagogique (missions, questions, tickets, fiches, réseau simulé). C'est le fichier à modifier pour adapter le jeu.
- `js/game.js` : moteur (rendu isométrique, simulation réseau, mini-jeux de routage et de TCP, interface). Il est adapté du moteur du [Stagiaire Réseau](https://github.com/LarbinDuPeuple/JeuStagiaireReseau).

Mode enseignant (reprendre à une mission) : menu ⚙️, code `IROISE`.

Espace enseignant (rapports des élèves triés par classe) : [`prof.html`](https://larbindupeuple.github.io/JeuStagiaireReseauSNT/prof.html). Voir la fiche enseignant. Mode en ligne facultatif (suivi en direct, blocage des jeux) : [FIREBASE.md](FIREBASE.md).
