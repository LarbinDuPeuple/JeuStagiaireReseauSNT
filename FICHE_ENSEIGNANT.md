# Fiche enseignant : « Le Stagiaire du Bout du Monde »

**Niveau :** 2nde, SNT, thème **Internet**
**Durée :** deux séances de 1 h 30, chacune avec **1 h de jeu** et 20 à 30 min d'intro, de débrief et de trace écrite
**Modalité :** individuel ou binôme, un poste avec un navigateur récent (Chrome, Firefox, Edge). Aucune installation, aucun compte. **Lien du jeu :** https://jeustagiaire-snt.web.app/
Fonctionne aussi hors ligne : on peut ouvrir `index.html` directement depuis une clé USB ou le réseau du lycée.

## Le scénario

L'élève fait son **stage chez IroiseNet**, un fournisseur d'accès à Internet (fictif) installé sur le port de commerce de **Brest**. Yann, le technicien, est bloqué à Ouessant par la tempête : c'est le stagiaire qui tient la hotline. Erwan, un collègue, est un **ancien élève du lycée La Croix Rouge**, et le **CDI du lycée** appelle deux fois : pour un message envoyé aux correspondants de Plymouth, et pour une panne de DNS.

Le jeu reprend le moteur du « Stagiaire Réseau » (STI2D) : vue isométrique, collègues, tickets de la hotline qui tombent au hasard, invite de commandes simulée, carnet de fiches, rapport de stage imprimable.

| Partie | Mission | Ce que fait l'élève | Durée indicative |
|---|---|---|---|
| 1 | 1. Bienvenue au bout du monde | Frise historique, tri des réseaux physiques sur l'établi, ordre de grandeur du trafic | 15 min |
| 1 | 2. Allô, la hotline ? | `ipconfig` à distance chez une cliente, analyse des appareils connectés à sa box (un voisin squatte son Wi-Fi), `nslookup` dans les deux sens | 25 min |
| 1 | Tickets | Box éteinte, horloge déréglée (NTP), panne de DNS au CDI, machine à café | le reste de l'heure |
| 2 | 3. Le voyage des paquets | Router un paquet de Brest à Paris en lisant les tables locales, `tracert`, panne de fibre Morlaix–Rennes, paquet qui tourne en rond jusqu'à destruction | 30 min |
| 2 | 4. TCP à la rescousse | Reconstituer un message comme TCP (paquets désordonnés et perdus), visio qui saccade, contrôle final | 20 min |
| 2 | Tickets | Routeur de Morlaix en panne, déni de service sur le site de la mairie, pair-à-pair, neutralité du Net, visio lente à Ouessant | le reste de l'heure |

## Capacités du programme couvertes (BO, thème Internet)

| Capacité attendue | Où dans le jeu |
|---|---|
| Distinguer le rôle des protocoles IP et TCP | Mission 4 (puzzle TCP, quiz IP ou TCP) |
| Caractériser les principes du routage et ses limites | Mission 3 (routage de proche en proche, panne, compteur de sauts), ticket « Morlaix » |
| Distinguer la fiabilité de transmission et l'absence de garantie temporelle | Mission 4 (visio Brest–Plymouth), ticket « Ouessant » |
| Retrouver une adresse IP à partir d'une adresse symbolique et inversement | Mission 2 (`nslookup` dans les deux sens), ticket « CDI » |
| Décrire l'intérêt des réseaux pair-à-pair et les usages illicites | Ticket « Une lettre inquiétante », contrôle final |
| Caractériser quelques types de réseaux physiques | Mission 1 (établi), ticket « Ouessant » |
| Caractériser l'ordre de grandeur du trafic et son évolution | Mission 1 (question de Gwenaëlle) |

Exemples d'activités du BO repris : déterminer l'adresse IP d'un équipement et l'adresse du DNS (mission 2), analyser son réseau local pour observer ce qui y est connecté (box de Mme Le Gall), suivre un chemin avec une commande du protocole IP (`tracert`, mission 3). Le texte du BO sur la **neutralité du Net**, le **déni de service** et **NTP** est aussi abordé par des tickets.

## Déroulé proposé

### Séance 1 (partie 1)

| Temps | Phase | Élèves | Enseignant |
|---|---|---|---|
| 0:00 – 0:10 | Lancement | Ouvrir le jeu, saisir son prénom et choisir sa classe (2nde 3 à 6) | Accroche : « Que se passe-t-il entre le moment où tu tapes wikipedia.fr et l'affichage ? ». Montrer les commandes (clic, ZQSD, E, T, C). |
| 0:10 – 1:10 | Jeu, partie 1 | Missions 1 et 2, puis tickets | Circuler, faire verbaliser : « c'est quoi la passerelle ? », « que fait le DNS ? ». |
| 1:10 – 1:30 | Débrief et trace écrite | **Noter le code de reprise** (fin de la mission 2) ; compléter la 1re moitié de la fiche résumé Internet | Synthèse au tableau : adresse IP, box = passerelle, DNS dans les deux sens. |

### Séance 2 (partie 2)

| Temps | Phase | Élèves | Enseignant |
|---|---|---|---|
| 0:00 – 0:15 | Rappel ou activité débranchée | Version courte de « La course aux paquets », ou rappel oral de la partie 1 | Faire le lien : un routeur ne connaît que ses voisins. |
| 0:15 – 1:15 | Jeu, partie 2 | Même poste : « Continuer ». Autre poste : « J'ai un code de reprise ». Missions 3 et 4, puis tickets | Insister sur le compteur de sauts et sur « fiable mais pas à l'heure ». |
| 1:15 – 1:30 | Bilan | Rapport de stage (imprimer ou PDF) ; fin de la fiche résumé | Synthèse : IP achemine, TCP fiabilise, les routeurs décident de proche en proche. |

**Changement de poste :** la sauvegarde est stockée dans le navigateur. À la fin de la partie 1, le jeu affiche un **code de reprise** (ex. `P2-9G-29-M-4-3-4-2Q`) qui conserve le score. Il est lié au prénom : l'élève doit retaper exactement le même prénom.

**Élève qui finit la partie 1 en avance :** il peut continuer à répondre aux tickets (bouton « Continuer la hotline »). La partie 2 se lance en parlant à Gwenaëlle ; demandez-leur d'attendre la séance suivante.

## Différenciation

- **Élèves rapides :** menu ⚙️, appels « Intense » (deux tickets en même temps). Défi : taper soi-même les commandes au lieu de cliquer sur les raccourcis.
- **Élèves en difficulté :** appels « Calme » ou « Désactivés » ; le carnet (touche C) contient une fiche par notion. Les commandes ont des boutons raccourcis.
- **DYS :** les dialogues avancent au clic, sans limite de temps. Le chronomètre des tickets ne pénalise que la satisfaction, pas la réussite.

## Mode enseignant

Menu ⚙️, puis **Mode enseignant**, code **`IROISE`**. Il permet de reprendre directement à n'importe quelle mission : démonstration au vidéoprojecteur, élève absent, poste changé sans code.

## Espace enseignant : rapports par classe

Page **https://jeustagiaire-snt.web.app/prof.html** (ou `prof.html` dans le dossier du jeu).

1. En fin de séance, chaque élève clique sur **« 📤 Enregistrer mon rapport »** : à la fin de la partie 1, à la fin du jeu, ou à tout moment par le menu ⚙️ puis « Rapport de stage ». Le fichier s'appelle `rapport_<classe>_<prénom>.json`.
2. Les élèves déposent ce fichier dans l'ENT (casier, devoir ou espace de dépôt).
3. Tu télécharges tous les fichiers, puis tu les glisses d'un coup sur la page enseignant.

La page trie les élèves par classe (un onglet par classe), avec pour chacun : missions faites, score, satisfaction, tickets, taux de bonnes réponses, capacités du BO validées et points à retravailler. Pour chaque classe, elle affiche aussi les moyennes, le taux de validation de chaque capacité et les notions les plus ratées. Export CSV (tableur) et impression possibles. Si un élève réimporte un rapport plus avancé, il remplace l'ancien.

Sans le mode en ligne, rien n'est envoyé sur Internet : les rapports importés restent dans le navigateur de l'ordinateur de l'enseignant. Un fichier modifié à la main par un élève est signalé « ⚠️ modifié ».

**Mode en ligne (facultatif) :** une fois Firebase configuré (voir [FIREBASE.md](FIREBASE.md)), l'espace enseignant affiche les élèves **en direct**, sans import de fichiers, et propose **« 🛑 Bloquer la classe »** ou **« Bloquer toutes les classes »**, avec un message. Les jeux de la classe affichent alors « Pause ! » et le temps est figé jusqu'au déblocage.

**Sans le mode en ligne**, le jeu ne peut pas être bloqué à distance : utilise le logiciel de gestion de salle du lycée s'il existe (Veyon, NetSupport…), ou la consigne « écran éteint ». La partie est sauvegardée en continu.

## Évaluation

Le **rapport de stage** (menu ⚙️ puis « Rapport de stage », imprimable ou en PDF) indique : score, satisfaction des clients, tickets résolus, taux de bonnes réponses, **capacités du BO validées** et **points à retravailler**. Il peut servir d'évaluation formative ou de trace écrite.

Les questions à choix multiples ont été vérifiées pour que la bonne réponse **ne soit pas systématiquement la plus longue** : elle n'est la plus longue qu'environ une fois sur cinq, et la plus courte aussi environ une fois sur cinq (moins que le hasard avec 3 ou 4 choix). Les réponses sont mélangées à chaque affichage.

Questions de sortie suggérées (5 min) :
1. Quelle commande affiche l'adresse IP de mon ordinateur ? Et celle de mon serveur DNS ?
2. Un site répond quand je tape son adresse IP, mais pas son nom. Quel service est en panne ?
3. Pourquoi aucun routeur n'a-t-il la carte complète d'Internet ?
4. Pourquoi une visio saccade-t-elle alors que TCP garantit que les paquets arrivent ?

## Corrigé rapide

- **Mme Le Gall :** IP `192.168.1.23`, box (passerelle) `192.168.1.1`, DNS `203.0.113.53`. L'intrus est `PC-JEROME` ; on change la clé Wi-Fi.
- **DNS :** `wikipedia.fr` → `185.15.58.224` ; `203.0.113.80` → `lycee-lacroixrouge.bzh`.
- **Routage Brest → Paris :** Brest → Morlaix → Rennes → Paris. `tracert wikipedia.fr` affiche 5 lignes : **4 routeurs** puis le serveur.
- **Panne Morlaix–Rennes :** la table de Brest devient Paris → via **Quimper** ; chemin Brest → Quimper → Nantes → Paris.
- **Paquet fou :** Quimper → Nantes → Quimper → Nantes → Quimper → Nantes ; le compteur arrive à 0 à Nantes : il faut **détruire le paquet**.
- **Puzzle TCP :** 8 paquets, 2 perdus au hasard (jamais le n° 1) à redemander.

| Ticket | Indice clé | Cause | Réparation |
|---|---|---|---|
| Plus rien à la maison (Tanguy) | box injoignable, voyants éteints | box non alimentée | la rebrancher |
| Le CDI ne trouve plus les sites | ping par IP OK, par nom KO | serveur DNS arrêté | redémarrer le DNS (salle des machines) |
| L'horloge est en avance (Nolwenn) | réglage automatique désactivé | heure non synchronisée | réactiver NTP |
| Machine à café | ni câble ni Wi-Fi | pas un problème réseau | la détartrer |
| Morlaix coupée (M. Kerbrat) | box OK, tracert s'arrête après la box | routeur de Morlaix en panne | envoyer un technicien (pas d'autre chemin pour Morlaix) |
| Site de la mairie | 2 millions de requêtes/s | déni de service | filtrer et porter plainte |
| Une lettre inquiétante (Tanguy) | logiciel installé par le cousin | partage pair-à-pair d'un film | expliquer : P2P légal, partage d'œuvres sans droits illégal |
| Idée du commercial (Gwenaëlle) | ralentir une plateforme | contraire à la neutralité du Net | — |
| La visio rame à Ouessant (Annaïg) | ping de plus d'1 s, liaison radio | réseau physique lent | expliquer, couper la caméra |

## Écarts au programme et points de vigilance

- **Hors programme non exploités :** `ipconfig` affiche le masque de sous-réseau (comme un vrai Windows), mais aucune question ne porte dessus. Le nom technique « TTL » n'est pas utilisé : le jeu parle de « compteur de sauts ».
- **Simplifications :** les tables de routage sont calculées par la distance la plus courte ; les vrais protocoles de routage ne sont pas au programme.
- **Adresses fictives :** IroiseNet, les clients et les domaines en `.bzh` sont inventés. Les adresses `203.0.113.x` et `198.51.100.x` sont des plages réservées à la documentation. Seule `wikipedia.fr` est un vrai nom ; son adresse réelle peut différer de celle du jeu : un vrai `nslookup` en classe fait une bonne comparaison.
- **Ouessant :** la liaison radio de l'île est une situation inventée pour le scénario.
- **Pair-à-pair, neutralité du Net, déni de service** sont surtout traités par des tickets aléatoires (au plus deux fois chacun). La fiche du carnet et une question du contrôle final les garantissent pour tous, mais un débrief oral reste utile.
- **Planning :** deux séances de jeu au lieu d'une pour le thème Internet. Cela décale le Web d'une semaine, ou demande de condenser le Web.
