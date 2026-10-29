# Activer le mode en ligne (Firebase)

Le mode en ligne est **facultatif**. Il ajoute :

- le suivi des élèves **en direct** dans l'espace enseignant (`prof.html`), classe par classe ;
- un bouton **« Bloquer la classe »** (ou toutes les classes) qui met tous les jeux en pause avec un message.

Sans lui, le jeu marche comme avant : hors ligne, depuis une clé USB, avec l'import des fichiers de rapport.

Compte environ 10 minutes. Firebase est gratuit à cette échelle (offre « Spark »), sans carte bancaire.

## 1. Créer le projet

1. Va sur https://console.firebase.google.com et connecte-toi avec un compte Google.
2. **Ajouter un projet**, nom par exemple `stagiaire-snt`. Tu peux désactiver Google Analytics.

## 2. Activer la connexion

1. Menu **Créer > Authentication > Commencer**.
2. Onglet **Mode de connexion** : active **Anonyme** (pour les élèves, aucun compte à créer) et **Adresse e-mail/Mot de passe** (pour toi).
3. Onglet **Utilisateurs > Ajouter un utilisateur** : ton adresse e-mail et un mot de passe. C'est ton accès à l'espace enseignant.
4. Onglet **Paramètres > Domaines autorisés** : `jeustagiaire-snt.web.app` y figure déjà. Ajoute `larbindupeuple.github.io` seulement si tu utilises aussi l'ancien lien.

## 3. Créer la base de données

1. Menu **Créer > Firestore Database > Créer une base de données**.
2. Emplacement : **europe-west9 (Paris)**, pour que les données restent en Europe. Mode **production**.
3. Onglet **Règles** : remplace tout par le contenu du fichier [`firestore.rules`](firestore.rules), en remplaçant `EMAIL_DU_PROF` par ton adresse de l'étape 2.3. Clique sur **Publier**.

## 4. Relier le jeu au projet

1. Roue dentée **> Paramètres du projet > Général > Vos applications**, clique sur l'icône **`</>`** (Web), donne un nom, puis **Enregistrer l'application**.
2. Firebase affiche un objet `firebaseConfig = { apiKey: …, authDomain: …, projectId: …, … }`.
3. Colle ces valeurs dans [`js/firebase-config.js`](js/firebase-config.js), à la place de `null`. Ces valeurs ne sont pas secrètes : c'est l'étape 3.3 qui protège les données.

## Mettre à jour les règles

Quand le jeu évolue, il peut falloir recoller les règles : console Firebase > **Firestore Database > Règles**, remplace tout par le contenu de [`firestore.rules`](firestore.rules) (avec ton adresse à la place de `EMAIL_DU_PROF`), puis **Publier**.

## Utilisation en classe

- Les élèves ouvrent le jeu sur https://jeustagiaire-snt.web.app (publié automatiquement à chaque mise à jour du dépôt, voir `.github/workflows/firebase-hosting.yml`). Ils tapent leur prénom avec l'initiale du nom et leur classe : leur partie est sauvegardée en ligne et se retrouve sur n'importe quel poste. Leur progression est envoyée automatiquement (au plus toutes les 20 secondes).
- Tu ouvres https://jeustagiaire-snt.web.app/prof.html et tu te connectes. La pastille verte indique les élèves en jeu.
- **🛑 Bloquer la 2nde X** : tous les jeux de la classe affichent « Pause ! » avec ton message. Le temps de jeu et les tickets sont figés. **▶ Débloquer** relance tout. Il faut une à deux secondes pour que l'écran change.
- **🕹️ Allumer la borne d'arcade** : ouvre le mini-jeu « Routeur express » pour les élèves en avance (voir la fiche enseignant). Il faut les règles à jour (avec la partie `scores`).
- Le jeu ne marche en ligne que par le lien https. Ouvert depuis une clé USB ou un fichier, il reste hors ligne.

## Données personnelles (RGPD)

- Seuls sont stockés : le **prénom et l'initiale** tapés par l'élève, sa **classe**, sa partie et ses résultats dans le jeu. Pas de nom de famille, pas d'adresse e-mail, pas de compte élève.
- Seul ton compte peut lire ces données ; chaque élève ne peut écrire que sa propre fiche.
- Exception : le **classement de la borne d'arcade** (prénom et initiale, classe, meilleur score, nombre de parties) est lisible par tous les joueurs connectés au jeu, puisqu'il s'affiche dans la borne. Si tu ne l'allumes pas, rien n'est enregistré. Le bouton « Remettre à zéro le classement » l'efface pour la classe.
- Bouton **« Effacer les données de la classe »** dans l'espace enseignant, à utiliser en fin d'année.
- Comme il s'agit de données d'élèves mineurs hébergées chez un prestataire (Google), signale ce traitement au DPO de l'établissement avant de l'utiliser.
