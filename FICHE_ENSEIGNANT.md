# Fiche enseignant : « Le Stagiaire du Bout du Monde »

**Niveau :** 2nde, SNT, thèmes **Internet** (parties 1 et 2) et **le Web** (partie 3)
**Durée :** trois **parties** d'environ 1 h de jeu, plus 20 à 30 min d'intro, de débrief et de trace écrite chacune. Selon la vitesse de la classe : une partie par séance, ou deux dans la même séance (c'est toi qui débloques les parties 2 et 3, voir « Espace enseignant »).
**Modalité :** individuel ou binôme, un poste avec un navigateur récent (Chrome, Firefox, Edge). Aucune installation, aucun compte. **Lien du jeu :** https://jeustagiaire-snt.web.app/
Fonctionne aussi hors ligne : on peut ouvrir `index.html` directement depuis une clé USB ou le réseau du lycée.

## Le scénario

L'élève fait son **stage chez IroiseNet**, un fournisseur d'accès à Internet (fictif) installé sur le port de commerce de **Brest**. Yann, le technicien, est bloqué à Ouessant par la tempête : c'est le stagiaire qui tient la hotline. Erwan, un collègue, est un **ancien élève du lycée La Croix Rouge**, et le **CDI du lycée** appelle plusieurs fois : pour un message envoyé aux correspondants de Plymouth, pour une panne de DNS, puis pour un exposé sur les phares d'Ouessant.

La partie 3 se passe le lendemain, au **pôle Web** d'IroiseNet, avec **Klervi**, la webmaster qui gère les sites des clients (la crêperie Ar Vag, sur le port).

Le jeu reprend le moteur du « Stagiaire Réseau » (STI2D) : vue isométrique, collègues, tickets de la hotline qui tombent au hasard, invite de commandes simulée, mémo de fiches, rapport de stage imprimable.

| Partie | Mission | Ce que fait l'élève | Durée indicative |
|---|---|---|---|
| 1 | 1. Bienvenue au bout du monde | Frise historique, tri des réseaux physiques sur l'établi, **calculs de débits** avec Loïc (temps de téléchargement, quelle connexion pour Ouessant ?), ordre de grandeur du trafic | 20 min |
| 1 | 2. Allô, la hotline ? | `ipconfig` à distance chez une cliente (questions à côté du terminal : quel appareil, même réseau ?, quelle ligne est fausse ?), analyse des appareils connectés à sa box (un voisin squatte son Wi-Fi), `nslookup` dans les deux sens (deux sites sur le même serveur), **diagnostic avec `ping`** d'une panne de DNS à la boulangerie | 35 min |
| 1 | Tickets | Box éteinte, horloge déréglée (NTP), panne de DNS au CDI, clé Wi-Fi, machine à café ; quiz de révision : réseaux physiques, adresses IP, DNS | le reste de l'heure |
| 2 | 3. Le voyage des paquets | Router un paquet de Brest à Paris **dans le brouillard** (on ne voit que les voisins : seule la table guide), `tracert` (quel chemin, où est la lenteur ?), panne de fibre Morlaix–Rennes puis nouveau trajet Ouessant → Paris dans le brouillard, paquet qui tourne en rond jusqu'à destruction | 35 min |
| 2 | 4. TCP à la rescousse | Reconstituer un message comme TCP (paquets désordonnés et perdus), visio qui saccade, **simulateur serveur / pair-à-pair** (distribuer une mise à jour à 8 PC) et usages légaux ou illicites, contrôle final | 30 min |
| 2 | Tickets | Routeur de Morlaix en panne, déni de service sur le site de la mairie, pair-à-pair, neutralité du Net, visio lente à Ouessant ; quiz de révision : routage, IP et TCP, usages | le reste de l'heure |
| 3 | 5. Le site de la crêperie | Web ≠ Internet et liens hypertextes, frise du Web, décomposer des URL et repérer la page sécurisée, **navigateur avec outils de développement** (onglet Réseau : requête GET, paramètre `jour=mardi`, code 404 ; onglet Code source : le JavaScript est visible, le PHP jamais), client ou serveur, **éditeur HTML/CSS** avec aperçu (corriger un lien, ajouter un lien, passer le titre en rouge par le CSS) | 35 min |
| 3 | 6. Chercher, protéger, publier | **Indexation à la main** de 4 pages puis requête, **popularité** sur un graphe de liens, lien promotionnel, **mail d'hameçonnage** (survoler le lien), **réglages du navigateur** avec visualiseur de traqueurs, droit d'auteur, licence CC BY, droit d'usage, droit à l'oubli, contrôle final | 35 min |
| 3 | Tickets | Page 404 (faute dans l'URL), paiement sur une page en http ; quiz de révision : histoire du Web et URL, requêtes HTTP, HTML et CSS, moteurs de recherche, sécurité | le reste du temps |

## Capacités du programme couvertes (BO)

### Thème Internet (parties 1 et 2)

| Capacité attendue | Où dans le jeu |
|---|---|
| Distinguer le rôle des protocoles IP et TCP | Mission 4 (puzzle TCP, quiz IP ou TCP) |
| Caractériser les principes du routage et ses limites | Mission 3 (routage de proche en proche, panne, compteur de sauts), ticket « Morlaix » |
| Distinguer la fiabilité de transmission et l'absence de garantie temporelle | Mission 4 (visio Brest–Plymouth), ticket « Ouessant » |
| Retrouver une adresse IP à partir d'une adresse symbolique et inversement | Mission 2 (`nslookup` dans les deux sens), ticket « CDI » |
| Décrire l'intérêt des réseaux pair-à-pair et les usages illicites | Mission 4 (simulateur de Maëlys, tri des usages), ticket « Une lettre inquiétante », contrôle final |
| Caractériser quelques types de réseaux physiques | Mission 1 (établi, calculs de débits avec Loïc), ticket « Ouessant » |
| Caractériser l'ordre de grandeur du trafic et son évolution | Mission 1 (questions de Gwenaëlle, combien de films ?) |

### Thème Le Web (partie 3)

| Capacité attendue | Où dans le jeu |
|---|---|
| Connaître les étapes du développement du Web | Mission 5 (frise du Web), quiz « histoire du Web » |
| Connaître certaines notions juridiques (licence, droit d'auteur, droit d'usage, valeur d'un bien) | Mission 6 (contenus à publier sur le site de la crêperie, musique achetée) |
| Maîtriser les renvois d'un texte à différents contenus | Mission 5 (Klervi, éditeur : ajouter un lien) |
| Distinguer le contenu d'une page et son style | Mission 5 (tri contenu / style, éditeur HTML/CSS) |
| Étudier et modifier une page HTML simple | Mission 5 (éditeur avec aperçu en direct) |
| Décomposer l'URL d'une page | Mission 5 (tri protocole / domaine / chemin) |
| Reconnaître les pages sécurisées | Mission 5, ticket « Payer sur une page non sécurisée », mail d'hameçonnage |
| Décomposer le contenu d'une requête HTTP et identifier les paramètres passés | Mission 5 (onglet Réseau, paramètre `jour`), quiz « requêtes HTTP », ticket « 404 » |
| Inspecter le code d'une page et distinguer ce qui est exécuté par le client et par le serveur | Mission 5 (onglet Code source, carte du jour en PHP, diaporama en JavaScript) |
| Mener une analyse critique des résultats d'un moteur de recherche | Mission 6 (indexation, popularité, lien promotionnel) |
| Comprendre les enjeux de la publication d'informations | Mission 6 (droit à l'oubli, photo en soirée, information à vérifier) |
| Maîtriser les réglages concernant les cookies, la sécurité et la confidentialité d'un navigateur | Mission 6 (navigateur de Nolwenn) |
| Sécuriser sa navigation en ligne et analyser les pages et fichiers | Mission 6 (mail de Tanguy), quiz « sécurité » (pièce jointe en .exe) |

Exemples d'activités du BO Web repris : modifier une page existante, changer sa mise en forme par le CSS, insérer un lien ; réaliser à la main l'indexation de quelques textes puis choisir ceux qui répondent à une requête ; calculer la popularité d'une page sur un graphe simple ; interdire l'exécution d'un programme sur le client ; effacer l'historique, paramétrer le navigateur pour qu'il ne garde pas de traces ; visualiser les traqueurs façon CookieViz.

### Activités du BO Internet

Exemples d'activités du BO repris : déterminer l'adresse IP d'un équipement et l'adresse du DNS (mission 2), analyser son réseau local pour observer ce qui y est connecté (box de Mme Le Gall), suivre un chemin avec une commande du protocole IP (`tracert`, mission 3), illustrer le routage (carte « dans le brouillard » : le paquet ne voit que les voisins), comparer la distribution d'un fichier depuis un serveur et en pair-à-pair (mission 4). Les questions des missions 2 et 3 s'affichent **à côté du terminal**, qui reste utilisable : les élèves doivent lancer eux-mêmes les bonnes commandes pour répondre, au lieu de recopier une valeur. Le texte du BO sur la **neutralité du Net**, le **déni de service** et **NTP** est aussi abordé par des tickets.

## Déroulé proposé

### Partie 1

| Temps | Phase | Élèves | Enseignant |
|---|---|---|---|
| 0:00 – 0:10 | Lancement | Ouvrir le jeu, saisir son prénom et choisir sa classe (2nde 3 à 6) | Accroche : « Que se passe-t-il entre le moment où tu tapes wikipedia.fr et l'affichage ? ». Montrer les commandes (clic, ZQSD, E, T, M). |
| 0:10 – 1:10 | Jeu, partie 1 | Missions 1 et 2, puis tickets | Circuler, faire verbaliser : « c'est quoi la passerelle ? », « que fait le DNS ? ». |
| 1:10 – 1:30 | Débrief et trace écrite | **Noter le code de reprise** (fin de la mission 2) ; compléter la 1re moitié de la fiche résumé Internet | Synthèse au tableau : adresse IP, box = passerelle, DNS dans les deux sens. |

### Partie 2 (même séance ou séance suivante)

| Temps | Phase | Élèves | Enseignant |
|---|---|---|---|
| 0:00 – 0:15 | Rappel ou activité débranchée (si nouvelle séance) | Version courte de « La course aux paquets », ou rappel oral de la partie 1 | Faire le lien : un routeur ne connaît que ses voisins. |
| 0:15 – 1:15 | Jeu, partie 2 | Même poste : « Continuer ». Autre poste : « J'ai un code de reprise ». Missions 3 et 4, puis tickets | Insister sur le compteur de sauts et sur « fiable mais pas à l'heure ». |
| 1:15 – 1:30 | Bilan | Fin de la fiche résumé Internet, correction orale | Synthèse : IP achemine, TCP fiabilise, les routeurs décident de proche en proche. |

### Partie 3 : le Web

| Temps | Phase | Élèves | Enseignant |
|---|---|---|---|
| 0:00 – 0:10 | Lancement | Distribuer la fiche résumé Web. Reprendre sa partie (prénom + initiale + classe) | Débloquer la partie 3. Accroche : « Internet et le Web, c'est pareil ? » |
| 0:10 – 1:20 | Jeu, partie 3 | Missions 5 et 6, puis tickets | Montrer un vrai F12 (onglet Réseau) sur un site connu après la mission 5 ; faire comparer deux moteurs de recherche après la mission 6. |
| 1:20 – 1:30 | Bilan | Rapport de stage (imprimer ou PDF) ; correction orale de la fiche Web | Synthèse : URL, requête HTTP, client / serveur, HTML / CSS, moteur, cookies, hameçonnage. |

**Changement de poste :** avec le lien en ligne, la partie est sauvegardée sur le serveur. L'élève la retrouve sur n'importe quel ordinateur en retapant son **prénom avec l'initiale de son nom** (ex. « Lucas M. ») et sa classe ; majuscules, accents et points ne comptent pas. L'initiale évite que deux homonymes partagent la même partie. Il n'y a pas de mot de passe : un élève qui tape le nom d'un camarade récupère sa partie (tu peux supprimer une progression depuis l'espace enseignant). Hors ligne (clé USB), la sauvegarde reste dans le navigateur et le jeu affiche à la fin des parties 1 et 2 un **code de reprise** lié au prénom.

**Élève qui finit une partie en avance :** il continue à répondre aux appels de la hotline (pannes et quiz de révision des missions déjà faites), au rythme habituel, et la **borne d'arcade** s'allume pour lui (voir « Différenciation »). Avec le mode en ligne, les **parties 2 et 3 restent fermées** tant que tu ne les as pas débloquées dans l'espace enseignant ; l'élève reçoit alors un message et lance la partie suivante d'un clic. Sans le mode en ligne, toutes les parties sont libres : il lance la suivante en parlant à Gwenaëlle.

## Différenciation

- **Élèves rapides :** menu ⚙️, appels « Intense » (deux tickets en même temps). Défi : taper soi-même les commandes au lieu de cliquer sur les raccourcis. Entre deux parties, la **borne d'arcade** les occupe (voir ci-dessous).

### La borne d'arcade « Routeur express »

Une borne rétro au fond de la hotline, à côté du café. Elle s'allume **toute seule** pour un élève qui a terminé une partie (ou tout le stage) et se referme dès qu'il commence la partie suivante : pendant les missions, elle reste éteinte. L'élève reçoit un message quand elle s'allume. En ligne, tu peux l'**éteindre** quand tu veux dans l'espace enseignant (bouton « 🕹️ Éteindre la borne d'arcade », pour la classe affichée ou pour toutes), puis la rallumer ; un élève en train de jouer est alors renvoyé à la hotline.

- **Le jeu (2 minutes) :** l'élève est le réseau. Des paquets apparaissent sur 10 routeurs, chacun avec l'adresse IP de sa destination (`10.42.x.x` : le réseau `10.42` est écrit sous un routeur). Il clique un paquet puis le routeur voisin où l'envoyer, saut après saut. La table de routage du routeur où se trouve le paquet est affichée.
- **Ce qui demande de réfléchir :** des fibres cassent (trois pannes par partie) et les tables mettent 6 secondes à se mettre à jour : il faut trouver un autre chemin à la main. Le compteur de sauts détruit les paquets qui tournent en rond. Les visios (▶) ont un délai : en retard, elles ne valent plus rien, il faut les traiter en priorité. Les fichiers (■) sont en 3 morceaux à livrer tous. Le réseau est tiré au hasard à chaque partie : rien à apprendre par cœur.
- **Les points :** chaque paquet rapporte jusqu'à 100 points (150 pour une visio), multipliés par l'efficacité du chemin (chemin le plus court / sauts faits) et par la vitesse de livraison (de 100 % à 25 %). Bonus de 60 pour un fichier complet ; pénalités pour un paquet détruit, une visio en retard ou un envoi sur une fibre coupée. Comme le temps compte, aucun score n'est « parfait ».
- **Notions revues :** routage de proche en proche, tables locales, panne et mise à jour des tables, compteur de sauts, absence de garantie temporelle, découpage en paquets et rôle de TCP. L'écran de fin explique les erreurs de la partie avec ces notions.
- **Classement (en ligne) :** le meilleur score de chaque élève de la classe, et la « bataille des classes » (moyenne des 5 meilleurs records de chaque classe). Tu le vois aussi en bas de l'onglet de la classe dans l'espace enseignant, avec le nombre de parties jouées et un bouton pour remettre le classement de la classe à zéro.
- La borne se met en pause quand tu bloques la classe. Le mini-jeu ne compte pas dans la note.
- **Élèves en difficulté :** appels « Calme » ou « Désactivés » ; le mémo (touche M) contient une fiche par notion. Les commandes ont des boutons raccourcis.
- **DYS :** les dialogues avancent au clic, sans limite de temps. Le chronomètre des tickets ne pénalise que la satisfaction, pas la réussite.

## Mode enseignant

Menu ⚙️, puis **Mode enseignant**, code **`IROISE`**. Il permet de reprendre directement à n'importe quelle mission : démonstration au vidéoprojecteur, élève absent, poste changé sans code.

## Espace enseignant : rapports par classe

Page **https://jeustagiaire-snt.web.app/prof.html** (ou `prof.html` dans le dossier du jeu).

1. En fin de partie, chaque élève clique sur **« 📤 Enregistrer mon rapport »** : à la fin de la partie 1, à la fin du jeu, ou à tout moment par le menu ⚙️ puis « Rapport de stage ». Le fichier s'appelle `rapport_<classe>_<prénom>.json`.
2. Les élèves déposent ce fichier dans l'ENT (casier, devoir ou espace de dépôt).
3. Tu télécharges tous les fichiers, puis tu les glisses d'un coup sur la page enseignant.

La page trie les élèves par classe (un onglet par classe), avec pour chacun : missions faites, score, satisfaction, tickets, taux de bonnes réponses, capacités du BO validées et points à retravailler. Pour chaque classe, elle affiche aussi les moyennes, le taux de validation de chaque capacité et les notions les plus ratées. Export CSV (tableur) et impression possibles. Si un élève réimporte un rapport plus avancé, il remplace l'ancien.

Sans le mode en ligne, rien n'est envoyé sur Internet : les rapports importés restent dans le navigateur de l'ordinateur de l'enseignant. Un fichier modifié à la main par un élève est signalé « ⚠️ modifié ».

**Supprimer un élève :** bouton 🗑️ au bout de sa ligne. En ligne, sa progression est effacée et son jeu repart au début dès qu'il est ouvert.

**Débloquer les parties 2 et 3 (mode en ligne) :** boutons « 🔓 Débloquer la partie 2 » et « 🔓 Débloquer la partie 3 », pour la classe affichée ou pour toutes les classes. Tant qu'une partie est fermée, les élèves qui ont fini la précédente répondent aux appels de la hotline et peuvent jouer à la borne d'arcade.

**Mode en ligne (facultatif) :** une fois Firebase configuré (voir [FIREBASE.md](FIREBASE.md)), l'espace enseignant affiche les élèves **en direct**, sans import de fichiers, et propose **« 🛑 Bloquer la classe »** ou **« Bloquer toutes les classes »**, avec un message. Les jeux de la classe affichent alors « Pause ! » et le temps est figé jusqu'au déblocage.

**Sans le mode en ligne**, le jeu ne peut pas être bloqué à distance : utilise le logiciel de gestion de salle du lycée s'il existe (Veyon, NetSupport…), ou la consigne « écran éteint ». La partie est sauvegardée en continu.

## Évaluation

**Fiche résumé (papier) :** distribuée imprimée, remplie pendant le jeu. Entre deux parties, pause pour la corriger à l'oral et reprendre les points mal compris (les tickets et les quiz de révision donnent de bons exemples à reprendre).

**Note de jeu sur 5** (espace enseignant, colonne « Note jeu », aussi dans l'export CSV). Choisis d'abord jusqu'où tu évalues (partie 1, parties 1 et 2, ou parties 1 à 3). La colonne des capacités du BO suit ce choix : 7 capacités Internet, ou 20 avec le Web. Barème, uniquement des taux pour ne pas avantager ceux qui reçoivent plus de tickets :

| Critère | Points | Calcul |
|---|---|---|
| Progression | 2 | missions faites / missions attendues |
| Bonnes réponses | 2 | taux de réussite aux questions des missions et des quiz |
| Tickets | 1 | tickets résolus / tickets reçus |

Total arrondi au demi-point. La satisfaction des clients n'est pas comptée : elle dépend surtout du temps passé. Survole une note pour voir son détail.


Le **rapport de stage** (menu ⚙️ puis « Rapport de stage », imprimable ou en PDF) indique : score, satisfaction des clients, tickets résolus, taux de bonnes réponses, **capacités du BO validées** et **points à retravailler**. Il peut servir d'évaluation formative ou de trace écrite.

Les questions à choix multiples ont été vérifiées pour que la bonne réponse **ne soit pas systématiquement la plus longue** : elle n'est la plus longue qu'environ une fois sur cinq, et la plus courte aussi environ une fois sur cinq (moins que le hasard avec 3 ou 4 choix). Les réponses sont mélangées à chaque affichage.

Questions de sortie suggérées (5 min) :
1. Quelle commande affiche l'adresse IP de mon ordinateur ? Et celle de mon serveur DNS ?
2. Un site répond quand je tape son adresse IP, mais pas son nom. Quel service est en panne ?
3. Pourquoi aucun routeur n'a-t-il la carte complète d'Internet ?
4. Pourquoi une visio saccade-t-elle alors que TCP garantit que les paquets arrivent ?
5. (Web) Dans `https://www.creperie-arvag.bzh/carte.php?jour=mardi`, donne le protocole, le nom de domaine, la page et le paramètre.
6. (Web) Pourquoi le code PHP d'une page n'apparaît-il jamais dans son code source ?
7. (Web) Comment savoir où mène vraiment un lien avant de cliquer ?

## Corrigé rapide

- **Débits (Loïc) :** 1 Go en ADSL à 8 Mbit/s → **1 000 s** ; en fibre à 1 000 Mbit/s → **8 s** ; 50 Go en 4G à 50 Mbit/s → environ **2 h 15** ; Ouessant, visio → **4G** (le satellite a trop de délai). Trafic 2021 ≈ **10¹² films** de 4 Go.
- **Mme Le Gall :** ordinateur `192.168.1.23` ; sortie vers Internet = la box `192.168.1.1` ; la console `192.168.1.26` est sur le même réseau local (même début d'adresse) ; le réglage qui vient d'IroiseNet est le serveur DNS `203.0.113.53` ; chez M. Kerbrat, c'est la **passerelle** qui est fausse. L'intrus est `PC-JEROME` (son adresse prouve qu'il est sur son réseau local) ; on change la clé Wi-Fi.
- **DNS :** `wikipedia.fr` → `185.15.58.224` ; `203.0.113.80` → `lycee-lacroixrouge.bzh` ; la crêperie et le club de voile sont sur le **même serveur** (`203.0.113.85`) ; « Non-existent domain » = le nom n'existe pas.
- **Boulangerie Guivarc'h :** la box répond au ping, l'adresse IP de Wikipédia aussi, mais pas le nom → panne de **DNS** ; le neveu a mis `192.168.1.53` comme serveur DNS ; il faut remettre `203.0.113.53`, puis vérifier avec `ping wikipedia.fr`.
- **Routage Brest → Paris (brouillard) :** Brest → Morlaix → Rennes → Paris, en suivant la ligne « Paris » de chaque table. Avec `tracert wikipedia.fr`, la ville avant Paris est **Rennes** (chemin le plus court : 600 km contre 685) ; `tracert mairie-ouessant.bzh` : le temps explose entre **Brest et Ouessant** (liaison radio).
- **Panne Morlaix–Rennes :** la table de Brest devient Paris → via **Quimper** ; chemin Brest → Quimper → Nantes → Paris. Puis, dans le brouillard : Ouessant → Brest → Quimper → Nantes → Paris.
- **Paquet fou :** Quimper → Nantes → Quimper → Nantes → Quimper → Nantes ; le compteur arrive à 0 à Nantes : il faut **détruire le paquet**.
- **Puzzle TCP :** 8 paquets, 2 perdus au hasard (jamais le n° 1) à redemander.
- **Pair-à-pair (Maëlys) :** depuis le serveur, environ 43 min et 96 morceaux envoyés ; en pair-à-pair, environ 6 à 7 min et une quinzaine de morceaux seulement. Si le serveur tombe en panne, les PC continuent à s'échanger leurs morceaux. Légal : logiciel libre, mise à jour d'un jeu, ses propres vidéos ; illicite : film au cinéma, album sans accord, série d'une plateforme payante.

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
| La tablette refuse le Wi-Fi (Nolwenn) | PC connecté, tablette « mot de passe incorrect » | clé Wi-Fi mal saisie | retaper la clé (étiquette de la box) |

| La page de la piscine est introuvable (M. Kerbrat) | ping et nslookup OK, « 404 Not Found » | faute dans l'URL (`pisicne`) | corriger l'adresse |
| Payer sur une page « non sécurisée » (Mme Le Gall) | `http://` sans cadenas | échanges non chiffrés | ne pas payer sur cette page |

Les **11 quiz de révision** (Loïc : réseaux physiques et histoire ; Erwan : adresses IP, IP et TCP, puis sécurité ; Maëlys : DNS, usages, puis moteurs de recherche ; Soizic : routage, puis requêtes HTTP ; Klervi : histoire du Web et URL, puis HTML et CSS) posent 3 questions tirées dans une banque de 6. Ils se débloquent avec les missions correspondantes.

**Partie 3 :**

- **Frise du Web :** hypertexte (Ted Nelson, 1965) → Web au CERN (Tim Berners-Lee, 1989) → Mosaic (1993) → JavaScript et PHP (1995) → DOM (2001) → mobiles (2010).
- **Onglet Réseau :** les questions s'affichent à côté du navigateur, qui reste utilisable. En modifiant l'adresse (`?jour=vendredi`), on trouve la **galette Saint-Jacques** ; aucun fichier `vendredi.html` : le programme `carte.php` fabrique la page selon le paramètre (un jour farfelu, comme `?jour=noel`, donne une crêpe mystère). La page d'accueil déclenche **deux** requêtes (HTML puis feuille de style). `GET /horaires.htm` → **404** (le fichier s'appelle `horaires.html`) ; `?jour=lundi` → **200** (le programme existe, il répond que c'est fermé).
- **Éditeur :** `<a href="horaires.html">`, ajout de `<a href="carte.php?jour=mardi">La carte du jour</a>`, et `h1 { color: red; }` dans le CSS (un attribut `style` dans le HTML est refusé).
- **Index :** phare → P1, P3 ; Ouessant → P1, P3, P4 ; crêpes → P2, P3 ; tempête → P1, P4 ; Brest → P2, P4. Requête « phare Ouessant » → **P1 et P3**.
- **Popularité :** D (mairie) reçoit 3 liens, E 2, A 1, B et C aucun. B (croisières) est en tête des résultats parce que c'est une **annonce** payée.
- **Mail de Tanguy :** le lien affiche `www.iroisenet.bzh` mais mène à `iroisenet-bzh.secure-paiement.ru` : hameçonnage.
- **Navigateur de Nolwenn :** bloquer les cookies **tiers** (bloquer tous les cookies est refusé : ses sites ne marcheraient plus), ne jamais conserver l'historique, effacer l'historique et les cookies existants, interdire le JavaScript sur le site douteux, demander avant l'accès à la caméra et à la position. 27 traqueurs → 2.

## Écarts au programme et points de vigilance

- **Hors programme non exploités :** `ipconfig` affiche le masque de sous-réseau (comme un vrai Windows), mais aucune question ne porte dessus. Pour savoir si deux appareils sont sur le même réseau local, le jeu dit simplement « même début d'adresse » (sans parler de masque). Le nom technique « TTL » n'est pas utilisé : le jeu parle de « compteur de sauts ».
- **Simplifications :** les tables de routage sont calculées par la distance la plus courte ; les vrais protocoles de routage ne sont pas au programme.
- **Borne d'arcade :** les adresses `10.x.x.x` sont des adresses privées, choisies pour être courtes ; dans la réalité, les routeurs d'Internet n'en voient pas passer. Le délai de mise à jour des tables est volontairement exagéré pour le jeu.
- **Adresses fictives :** IroiseNet, les clients et les domaines en `.bzh` sont inventés. Les adresses `203.0.113.x` et `198.51.100.x` sont des plages réservées à la documentation. Seule `wikipedia.fr` est un vrai nom ; son adresse réelle peut différer de celle du jeu : un vrai `nslookup` en classe fait une bonne comparaison.
- **Ouessant :** la liaison radio de l'île est une situation inventée pour le scénario.
- **Pair-à-pair :** traité pour tous par l'activité de Maëlys (mission 4). Le simulateur simplifie (un morceau par PC et par étape, débits identiques).
- **Neutralité du Net, déni de service** sont surtout traités par des tickets aléatoires et le quiz de révision « règles et usages ». La fiche du mémo et une question du contrôle final les garantissent pour tous, mais un débrief oral reste utile.
- **Partie 3, simplifications :** le navigateur, ses outils de développement et le visualiseur de traqueurs sont simulés (pas de vraie requête) ; il est utile de montrer un vrai F12 et de faire comparer deux vrais moteurs de recherche. La popularité est calculée en comptant les liens reçus ; l'algorithme n'est pas programmé (activité du BO non reprise). La « valeur d'un bien » n'est abordée que par la question de la musique achetée.
- **Activités du BO Web non reprises :** mettre en ligne une page, comparer les paramétrages de plusieurs navigateurs, comparer les politiques de conservation des moteurs de recherche (seulement évoquées dans un quiz).
- **Planning :** environ deux heures de jeu au total pour le thème Internet, une heure pour le Web. Sur deux séances, cela décale le Web d'une semaine ; si la classe avance vite, les deux parties tiennent dans une même séance.
