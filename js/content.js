'use strict';
/* =====================================================================
   Le Stagiaire du Bout du Monde — contenu pédagogique (SNT 2nde)
   Personnages, fiches du carnet, réseau simulé, missions et incidents.
   Les fonctions utilisées ici (say, quiz, terminal, routing…) sont
   définies dans game.js et appelées uniquement pendant la partie.
   Toutes les adresses et tous les noms de domaine sont fictifs, sauf
   wikipedia.fr (son adresse IP réelle peut varier).
   ===================================================================== */

const PEOPLE = {
  gwen: { name: 'Gwenaëlle', role: 'Directrice technique', shirt: '#1f4e8c', hair: '#6b3a1f', skin: '#f1c7a1' },
  erwan: { name: 'Erwan', role: 'Hotline (ancien de La Croix Rouge)', shirt: '#d0573f', hair: '#2a1a10', skin: '#e8b894' },
  maelys: { name: 'Maëlys', role: 'Hotline', shirt: '#7a5bd6', hair: '#d9a441', skin: '#f3d0b0' },
  soizic: { name: 'Soizic', role: 'Supervision du réseau', shirt: '#2f8f6b', hair: '#1d1d1d', skin: '#c98e62' },
  loic: { name: 'Loïc', role: 'Atelier', shirt: '#e09b2d', hair: '#9a9a9a', skin: '#f2c9a5' },
  klervi: { name: 'Klervi', role: 'Webmaster (sites des clients)', shirt: '#db2777', hair: '#7c2d12', skin: '#f3d0b0' },
  yann: { name: 'Yann', role: 'Technicien (bloqué à Ouessant ⛴️)', shirt: '#14a3a3', hair: '#333', skin: '#b97a52' },
  moi: { name: 'Toi', role: 'Stagiaire', shirt: '#ff7a2f', hair: '#3a2618', skin: '#f0c8a0' },
  // clients (au téléphone)
  legall: { name: 'Mme Le Gall', role: 'Cliente, Recouvrance', shirt: '#c2417a', hair: '#cfcfcf', skin: '#f0c39e' },
  cdi: { name: 'Mme Quéré', role: 'Documentaliste, lycée La Croix Rouge', shirt: '#2f6fde', hair: '#5a3220', skin: '#f3d0b0' },
  kerbrat: { name: 'M. Kerbrat', role: 'Client, Morlaix', shirt: '#6b7280', hair: '#1a1a1a', skin: '#a8714d' },
  mairie: { name: 'Service informatique', role: 'Mairie de Brest', shirt: '#3d4a6b', hair: '#2b1b12', skin: '#c98e62' },
  tanguy: { name: 'Tanguy', role: 'Client, Saint-Marc', shirt: '#22a06b', hair: '#6b4423', skin: '#f2c9a5' },
  annaig: { name: 'Annaïg', role: 'Cliente, Ouessant', shirt: '#0e7490', hair: '#2a1a10', skin: '#e8b894' },
  nolwenn: { name: 'Nolwenn', role: 'Cliente, Lambézellec', shirt: '#b45309', hair: '#1d1d1d', skin: '#8d5a3b' }
};

const IDLE = {
  gwen: ["Yann est coincé à Ouessant : plus de bateau avec cette tempête. Heureusement que tu es là !", "Ici, on est au bout du monde, mais on est reliés au monde entier."],
  erwan: ["Moi aussi j'ai fait ma 2nde à La Croix Rouge. Le réseau, je l'ai découvert en SNT !", "Mon conseil : un problème ? On teste du plus proche au plus loin.", "Il pleut ? Normal, on est à Brest."],
  maelys: ["Quand un client appelle, reste calme et pose des questions simples.", "Le carnet (touche C) contient toutes les fiches que tu débloques."],
  soizic: ["Sur mon grand écran, chaque trait est une fibre optique entre deux routeurs.", "Aucun routeur ne connaît tout Internet. Chacun ne connaît que ses voisins."],
  klervi: ["Moi, je m'occupe des sites web que les clients hébergent chez IroiseNet : la crêperie du port, le club de voile…", "Internet, ce sont les tuyaux. Le Web, c'est un service qui passe dedans, comme le mail.", "Ma touche préférée ? F12. On voit tout ce que le navigateur échange avec le serveur."],
  loic: ["Sur l'établi, il y a de tout : de la fibre, du cuivre, et même un vieux modem qui chante.", "Un kouign-amann ? Non ? Tant pis, plus pour moi."]
};

/* ---------------------------------------------------------------------
   Carnet de notions
   --------------------------------------------------------------------- */
const NOTIONS = {
  histoire: { icon: '📜', title: "Petite histoire d'Internet", html: `
    <ul>
      <li><b>Années 1950</b> : premiers ordinateurs reliés en réseau, mais chaque constructeur a son propre système.</li>
      <li><b>1970 : ArpaNet</b> aux États-Unis, un réseau indépendant des constructeurs.</li>
      <li><b>1971 : Cyclades</b> en France, qui invente l'idée de faire voyager l'information en paquets indépendants.</li>
      <li><b>1983 : naissance d'Internet</b>, quand tous ces réseaux adoptent le même protocole : TCP/IP.</li>
    </ul>` },
  physique: { icon: '🔌', title: 'Les réseaux physiques', html: `
    <p>Internet est <b>logiciel</b> : ses protocoles (IP, TCP) fonctionnent sur n'importe quel réseau physique.</p>
    <table><tr><th>Réseau</th><th>Support</th><th>Débit</th><th>Statut</th></tr>
    <tr><td>Modem 56k</td><td>filaire (ligne téléphonique)</td><td>très lent</td><td>obsolète</td></tr>
    <tr><td>ADSL</td><td>filaire (cuivre)</td><td>moyen</td><td>en voie de disparition</td></tr>
    <tr><td>Fibre optique</td><td>filaire (lumière dans du verre)</td><td>très rapide</td><td>actuel</td></tr>
    <tr><td>Ethernet (câble RJ45)</td><td>filaire</td><td>rapide</td><td>actuel</td></tr>
    <tr><td>Wi-Fi</td><td>sans fil (ondes radio)</td><td>rapide</td><td>actuel</td></tr>
    <tr><td>4G / 5G</td><td>sans fil (antennes)</td><td>rapide</td><td>actuel</td></tr>
    <tr><td>Bluetooth</td><td>sans fil, très courte portée</td><td>lent</td><td>actuel</td></tr>
    <tr><td>Satellite</td><td>sans fil</td><td>moyen, avec beaucoup de délai</td><td>actuel (zones isolées)</td></tr></table>` },
  trafic: { icon: '📈', title: "Le trafic d'Internet", html: `
    <p>Le programme indique un trafic prévu en 2021 de <b>3 300 milliards de milliards d'octets</b>, soit 3,3 × 10<sup>21</sup> octets.</p>
    <p>Ce trafic augmente chaque année, surtout à cause de la <b>vidéo</b>.</p>
    <p>Rappel : 1 ko = 10<sup>3</sup> octets, 1 Mo = 10<sup>6</sup>, 1 Go = 10<sup>9</sup>, 1 To = 10<sup>12</sup>.</p>` },
  ip: { icon: '🔢', title: 'Adresse IP', html: `
    <p>Chaque appareil connecté à Internet est identifié par une <b>adresse IP</b> (Internet Protocol).</p>
    <p>En IPv4, c'est <b>4 nombres de 0 à 255</b> séparés par des points : <code>172.16.8.42</code>.</p>
    <p>Les adresses sont <b>numériques et hiérarchiques</b>, un peu comme une adresse postale : le début désigne le réseau, la fin désigne l'appareil.</p>
    <p>La commande <code>ipconfig</code> (Windows) affiche l'adresse IP d'un ordinateur, l'adresse de sa <b>passerelle</b> et celle de son <b>serveur DNS</b>.</p>` },
  box: { icon: '📦', title: 'Le réseau de la maison et la box', html: `
    <ul>
      <li>À la maison, les appareils (PC, téléphones, console…) forment un <b>réseau local</b>, en Wi-Fi ou par câble.</li>
      <li>La <b>box</b> est un <b>routeur</b> : elle fait passer les paquets entre le réseau local et Internet. C'est la <b>passerelle</b> des appareils.</li>
      <li>L'interface de la box liste les appareils connectés : c'est utile pour repérer un <b>intrus</b> sur son Wi-Fi.</li>
      <li>Pour protéger son Wi-Fi : une <b>clé longue et secrète</b> (WPA2 ou WPA3).</li>
    </ul>` },
  dns: { icon: '📖', title: "DNS : l'annuaire d'Internet", html: `
    <p>Nous retenons des <b>adresses symboliques</b> (<code>wikipedia.fr</code>), les machines utilisent des <b>adresses IP</b>.</p>
    <p>Le <b>DNS</b> (Domain Name System) traduit un nom en adresse IP, et inversement :</p>
    <pre>nslookup iroisenet.bzh   → 203.0.113.10
nslookup 203.0.113.10    → iroisenet.bzh</pre>
    <p>Le DNS est réalisé par un <b>grand nombre d'ordinateurs</b> répartis sur le réseau et mis à jour en permanence. Un serveur DNS est un ordinateur connecté comme les autres.</p>
    <p>Si le DNS est en panne : le nom ne marche plus, mais l'adresse IP, si !</p>` },
  routage: { icon: '🧭', title: 'Le routage des paquets', html: `
    <ul>
      <li>L'information voyage en <b>paquets</b>. Chaque paquet contient l'<b>adresse de l'émetteur</b>, l'<b>adresse du destinataire</b> et un morceau des données.</li>
      <li>Les <b>routeurs</b> envoient chaque paquet vers un routeur voisin, de proche en proche, jusqu'au destinataire.</li>
      <li>Chaque routeur a une <b>table de routage</b> : une carte <b>locale</b>, construite en échangeant en permanence avec ses voisins. <b>Aucun routeur n'a la carte complète d'Internet</b>, ce qui permet le routage à très grande échelle.</li>
      <li>Si une ligne ou un routeur tombe en panne, les voisins s'en aperçoivent et les tables s'ajustent : les paquets prennent un autre chemin.</li>
      <li>La commande <code>tracert</code> affiche la liste des routeurs traversés.</li>
    </ul>` },
  limites: { icon: '⛔', title: 'Les limites du routage', html: `
    <p>Un paquet peut ne <b>jamais arriver</b>, pour deux raisons :</p>
    <ol><li>une <b>panne matérielle</b> (ligne coupée, routeur en panne) sans autre chemin possible ;</li>
    <li>sa <b>destruction</b> : chaque paquet contient un <b>nombre maximal de routeurs à traverser</b>. À chaque routeur, ce compteur baisse de 1. À 0, le paquet est détruit, pour ne pas encombrer le réseau (par exemple s'il tourne en rond).</li></ol>` },
  tcp: { icon: '🧩', title: 'IP et TCP : deux rôles différents', html: `
    <table><tr><th>IP</th><th>TCP</th></tr>
    <tr><td>Donne une <b>adresse</b> à chaque machine et <b>achemine</b> chaque paquet vers son destinataire.</td>
    <td><b>Fiabilise</b> la communication : numérote les paquets, les <b>remet dans l'ordre</b>, <b>redemande</b> ceux qui manquent et limite les embouteillages.</td></tr></table>
    <p>Avec TCP, tout paquet finit par arriver, sauf panne matérielle impossible à contourner.</p>
    <p>TCP/IP n'est pas installé dans les câbles : il est dans <b>chaque ordinateur connecté</b>.</p>` },
  temps: { icon: '⏱️', title: "Fiable, mais pas à l'heure", html: `
    <p>Ni Internet ni TCP ne garantissent <b>quand</b> un paquet arrivera : c'est l'<b>absence de garantie temporelle</b>.</p>
    <p>Pour un fichier ou une page web, ce n'est pas grave : on attend un peu. Pour un <b>appel vidéo</b> ou le <b>streaming</b>, attendre un paquet en retard bloquerait tout : mieux vaut perdre une image que perdre le fil du temps. C'est pour cela qu'une visio peut saccader.</p>` },
  p2p: { icon: '🔁', title: 'Les réseaux pair-à-pair', html: `
    <p>Dans un réseau <b>pair-à-pair</b> (peer-to-peer, P2P), chaque ordinateur est à la fois <b>émetteur et récepteur</b> : il n'y a pas un serveur central unique.</p>
    <ul><li><b>Intérêt</b> : partager de gros fichiers sans saturer un serveur (mises à jour de jeux, logiciels libres, vidéos).</li>
    <li><b>Usages illicites</b> : partager des films, séries ou musiques sans l'accord des auteurs, ce qui est interdit par le droit d'auteur.</li></ul>` },
  neutralite: { icon: '⚖️', title: 'Neutralité du Net et déni de service', html: `
    <p><b>Neutralité du Net</b> : les routeurs doivent transmettre les paquets <b>sans tenir compte de leur contenu</b> (texte, vidéo, jeu…). Elle existe depuis l'origine d'Internet, mais elle est régulièrement remise en cause par certains industriels.</p>
    <p><b>Déni de service</b> : une attaque qui envoie un très grand nombre de messages à un site pour le saturer et le rendre inaccessible. C'est un délit.</p>` },
  ntp: { icon: '🕰️', title: 'NTP : tout le monde à la même heure', html: `
    <p>D'autres protocoles s'appuient sur Internet. Le protocole <b>NTP</b> (Network Time Protocol) permet de <b>synchroniser finement l'heure</b> des ordinateurs et des objets connectés en interrogeant des serveurs de temps.</p>
    <p>C'est aussi le cas du Web avec <b>HTTP</b> et <b>HTTPS</b> (thème suivant !).</p>` },
  /* ---- thème Web (partie 3) ---- */
  web_histoire: { icon: '🕸️', title: 'Petite histoire du Web', html: `
    <ul>
      <li><b>1965</b> : Ted Nelson invente et programme le concept d'<b>hypertexte</b>.</li>
      <li><b>1989</b> : naissance du <b>Web</b> au CERN (près de Genève), grâce à Tim Berners-Lee.</li>
      <li><b>1993</b> : le Web passe dans le <b>domaine public</b> ; premier navigateur grand public, <b>Mosaic</b>.</li>
      <li><b>1995</b> : des sites <b>interactifs</b> (langage JavaScript) et <b>dynamiques</b> (langage PHP).</li>
      <li><b>2001</b> : les pages sont standardisées grâce au <b>DOM</b> (Document Object Model).</li>
      <li><b>2010</b> : des technologies pour développer des applications sur <b>mobiles</b>.</li>
    </ul>
    <p>Attention : Internet (1983) est plus ancien que le Web (1989). Le Web est <b>un service</b> qui utilise Internet, comme le mail ou NTP.</p>` },
  hypertexte: { icon: '🔗', title: 'Le Web et les liens hypertextes', html: `
    <p>Le <b>Web</b> (la « toile ») donne accès à des pages, images, sons et vidéos <b>reliés par des liens hypertextes</b> et accessibles par Internet.</p>
    <p>Un <b>hypertexte</b> est un texte augmenté de <b>renvois automatiques</b> vers d'autres textes, images ou sons. Sur le Web, le renvoi peut mener vers <b>n'importe quelle machine</b> d'Internet, grâce à l'adresse (URL) de la page visée :</p>
    <pre>&lt;a href="https://www.iroisenet.bzh/aide.html"&gt;Aide&lt;/a&gt;</pre>
    <p>Les pages et leurs liens forment un <b>graphe</b> : chaque page est un sommet, chaque lien une flèche. C'est la « toile d'araignée » du Web.</p>
    <p>Les formats du Web (HTML, CSS…) sont normalisés par un consortium mondial, le <b>W3C</b>. L'affichage est fait chez l'utilisateur par un programme : le <b>navigateur</b>.</p>` },
  url: { icon: '🧭', title: 'URL et pages sécurisées', html: `
    <p>Chaque page a une adresse unique, son <b>URL</b> (Uniform Resource Locator) :</p>
    <pre>https://www.creperie-arvag.bzh/carte/galettes.html</pre>
    <table><tr><th>Protocole</th><th>Nom de domaine</th><th>Chemin de la page</th></tr>
    <tr><td><code>https</code></td><td><code>www.creperie-arvag.bzh</code></td><td><code>/carte/galettes.html</code></td></tr></table>
    <ul><li><b>http</b> : les échanges circulent en clair.</li>
    <li><b>https</b> (avec le cadenas 🔒) : les échanges entre le navigateur et le serveur sont <b>chiffrés</b>. Indispensable pour un mot de passe ou un paiement.</li></ul>
    <p>⚠️ HTTPS prouve que l'échange est chiffré, <b>pas</b> que le site est honnête : un faux site peut aussi avoir un cadenas.</p>` },
  http: { icon: '📨', title: 'La requête HTTP', html: `
    <p>Pour afficher une page, le navigateur envoie une <b>requête HTTP</b> au serveur :</p>
    <pre>GET /carte.php?jour=mardi HTTP/1.1
Host: www.creperie-arvag.bzh</pre>
    <ul><li><b>GET</b> : la méthode (« donne-moi »). <b>POST</b> sert à envoyer un formulaire.</li>
    <li><b>/carte.php</b> : la page demandée ; <b>Host</b> : le nom du serveur.</li>
    <li>Après le <b>?</b> : les <b>paramètres</b>, sous la forme <code>nom=valeur</code>, séparés par des <code>&amp;</code>. Ici, le paramètre <b>jour</b> vaut <b>mardi</b>.</li></ul>
    <p>Le serveur répond avec un <b>code</b> : <b>200</b> (OK, voici la page), <b>404</b> (cette page n'existe pas), <b>500</b> (erreur du serveur).</p>
    <p>Dans un navigateur, la touche <b>F12</b> ouvre les outils de développement : l'onglet <b>Réseau</b> montre toutes les requêtes.</p>` },
  clientserveur: { icon: '🤝', title: 'Client et serveur', html: `
    <p>Le Web repose sur le dialogue entre <b>clients</b> (les navigateurs) et <b>serveurs</b>. C'est toujours le <b>client</b> qui prend l'initiative en envoyant une requête.</p>
    <table><tr><th>Le serveur…</th><th>Le client (navigateur)…</th></tr>
    <tr><td>stocke les pages, ou les <b>crée à la demande</b> selon la requête (langage <b>PHP</b>, par exemple), puis renvoie le résultat.</td>
    <td>envoie les requêtes, <b>affiche</b> la page (HTML + CSS) et <b>exécute</b> les programmes qu'elle contient (souvent en <b>JavaScript</b>).</td></tr></table>
    <p>Quand on affiche le code source d'une page (Ctrl + U), on voit le HTML et le JavaScript reçus, mais <b>jamais le PHP</b> : il a été exécuté sur le serveur, qui n'envoie que le résultat.</p>` },
  html_css: { icon: '🎨', title: 'HTML et CSS : contenu et style', html: `
    <p>Une page web est écrite en <b>HTML</b>, un langage de <b>balises</b>, qui décrit son <b>contenu</b> : titres, paragraphes, liens, images.</p>
    <pre>&lt;h1&gt;Crêperie Ar Vag&lt;/h1&gt;          titre principal
&lt;p&gt;Galettes et crêpes…&lt;/p&gt;         paragraphe
&lt;a href="carte.html"&gt;La carte&lt;/a&gt;   lien hypertexte
&lt;img src="galette.jpg" alt="…"&gt;     image</pre>
    <p>Son <b>style</b> (couleurs, polices, tailles, marges) est défini à part, en <b>CSS</b> :</p>
    <pre>h1 { color: red; }
body { font-family: sans-serif; background: #fdf6e3; }</pre>
    <p>Séparer contenu et style permet de changer toute l'apparence d'un site sans toucher à son contenu.</p>` },
  moteur: { icon: '🔎', title: 'Les moteurs de recherche', html: `
    <p>Un moteur de recherche trouve des pages dont on ne connaît pas l'adresse. Il travaille en trois temps :</p>
    <ol><li><b>Parcourir</b> le Web avec des robots qui collectent les pages en suivant les liens.</li>
    <li><b>Indexer</b> : construire un <b>annuaire inversé</b> qui associe à chaque mot la liste des pages où il apparaît.</li>
    <li><b>Classer</b>, à chaque requête, les pages qui contiennent les mots cherchés, selon leur <b>popularité</b> (nombre de liens qui mènent à elles), leur <b>pertinence</b> et l'ordre des mots de la requête.</li></ol>
    <p>⚠️ Les premiers résultats peuvent être des <b>liens promotionnels</b> : des sites qui ont <b>payé</b> pour apparaître. Le premier résultat n'est pas forcément le meilleur : on compare plusieurs sources et on vérifie qui a écrit la page.</p>` },
  hameconnage: { icon: '🎣', title: 'Hameçonnage : vérifier avant de cliquer', html: `
    <p>L'<b>hameçonnage</b> (phishing) utilise un faux mail et une <b>fausse page</b> qui imite un vrai site pour voler un mot de passe ou une carte bancaire.</p>
    <ul><li>Le <b>texte d'un lien peut cacher une autre adresse</b> : on <b>survole</b> le lien (sans cliquer) pour voir la vraie adresse, en bas de la fenêtre.</li>
    <li>On regarde bien le <b>nom de domaine</b> : <code>iroisenet-bzh.secure-paiement.ru</code> n'est pas <code>iroisenet.bzh</code>.</li>
    <li>Signes d'alerte : urgence, menace, fautes, demande de mot de passe ou de carte bancaire.</li>
    <li>Le bon réflexe : ne pas cliquer, et <b>taper soi-même l'adresse</b> du vrai site. Ne pas ouvrir une pièce jointe inattendue.</li></ul>` },
  cookies: { icon: '🍪', title: 'Cookies, historique et confidentialité', html: `
    <p>Un <b>cookie</b> est un petit fichier qu'un site dépose dans ton navigateur. Utile pour rester connecté ou garder un panier, il peut aussi servir à te <b>pister</b> : les <b>cookies tiers</b> (déposés par des régies publicitaires présentes sur de nombreux sites) suivent ta navigation de site en site.</p>
    <p>Le navigateur garde aussi un <b>historique</b> de tes visites. Les réglages importants :</p>
    <ul><li><b>bloquer les cookies tiers</b> ;</li>
    <li><b>effacer</b> l'historique et les cookies, ou ne pas conserver d'historique (navigation privée) ;</li>
    <li><b>interdire les programmes</b> (JavaScript) sur les sites douteux ;</li>
    <li>demander l'autorisation avant de laisser un site accéder à la <b>caméra</b>, au <b>micro</b> ou à la <b>position</b>.</li></ul>
    <p>Certains moteurs de recherche s'engagent à ne pas garder de traces de tes recherches. La navigation privée n'efface les traces que <b>sur ton ordinateur</b> : les sites et ton fournisseur d'accès voient toujours tes requêtes.</p>` },
  juridique: { icon: '©️', title: "Droit d'auteur et licences", html: `
    <ul><li>Une œuvre (photo, texte, musique, logiciel) appartient à son auteur : c'est le <b>droit d'auteur</b>. Ce qui est en ligne n'est <b>pas</b> libre de droits pour autant.</li>
    <li>La <b>licence</b> dit ce qu'on a le droit de faire avec l'œuvre. Exemple : <b>Creative Commons CC BY</b> = réutilisation permise, en citant l'auteur.</li>
    <li>Acheter une musique ou un film en ligne, c'est acheter un <b>droit d'usage</b> (en profiter soi-même), pas le droit de le diffuser.</li>
    <li>Une œuvre a une <b>valeur</b> : la diffuser sans accord prive son auteur de revenus.</li>
    <li>Publier la photo d'une personne demande son <b>accord</b> (droit à l'image).</li></ul>` },
  publication: { icon: '📢', title: "Publier sur le Web, et le droit à l'oubli", html: `
    <p>Le Web a ouvert à tous la possibilité de <b>publier</b>. Mais ni la qualité ni la véracité des informations ne sont garanties : il faut <b>vérifier les sources</b>.</p>
    <p>Ce qui est publié peut être <b>copié</b> et rester accessible <b>très longtemps</b>, partout. Le <b>droit à l'oubli</b> permet de demander à un moteur de recherche de <b>déréférencer</b> une information personnelle ancienne, mais elle n'est pas toujours effacée partout.</p>
    <p>Avant de publier : est-ce vrai ? Ai-je le droit ? Est-ce que je l'accepterais dans dix ans ?</p>` },
  diagnostic: { icon: '🩺', title: 'Méthode de la hotline', html: `
    <ol>
      <li><b>Écouter</b> : qui est touché ? Depuis quand ? Un seul appareil ou toute la maison ?</li>
      <li><b>Observer</b> : voyants de la box, Wi-Fi, câbles.</li>
      <li><b>Tester du plus proche au plus loin</b> : <code>ipconfig</code>, puis <code>ping</code> de la box, puis d'un site par son adresse IP, puis par son nom.</li>
      <li><b>Réparer, vérifier, expliquer</b> au client.</li>
    </ol>
    <table><tr><th>Symptôme</th><th>Piste</th></tr>
    <tr><td>Box injoignable</td><td>box éteinte, Wi-Fi coupé</td></tr>
    <tr><td>Par adresse IP oui, par nom non</td><td>DNS</td></tr>
    <tr><td>Tout un quartier ou une ville coupé</td><td>routeur ou ligne de l'opérateur</td></tr></table>` }
};

/* ---------------------------------------------------------------------
   Réseau simulé : clients, DNS, routeurs d'IroiseNet
   --------------------------------------------------------------------- */
const DNS_IP = '203.0.113.53';
const CLIENTS = {
  mon_pc: { name: 'ton poste (IroiseNet, Brest)', ip: '203.0.113.27', gw: '203.0.113.1', dns: DNS_IP, at: 'brest', wifi: false },
  legall: { name: 'PC de Mme Le Gall (Recouvrance)', ip: '192.168.1.23', gw: '192.168.1.1', dns: DNS_IP, at: 'brest', wifi: true },
  cdi: { name: 'PC du CDI, lycée La Croix Rouge', ip: '10.29.4.57', gw: '10.29.4.1', dns: DNS_IP, at: 'brest', wifi: false },
  kerbrat: { name: 'PC de M. Kerbrat (Morlaix)', ip: '192.168.1.12', gw: '192.168.1.1', dns: DNS_IP, at: 'morlaix', wifi: false },
  tanguy: { name: 'PC de Tanguy (Saint-Marc)', ip: '192.168.1.40', gw: '192.168.1.1', dns: DNS_IP, at: 'brest', wifi: true },
  annaig: { name: "PC d'Annaïg (Ouessant)", ip: '192.168.1.15', gw: '192.168.1.1', dns: DNS_IP, at: 'ouessant', wifi: true },
  nolwenn: { name: 'PC de Nolwenn (Lambézellec)', ip: '192.168.1.31', gw: '192.168.1.1', dns: DNS_IP, at: 'brest', wifi: true }
};
const DNS_RECORDS = {
  'wikipedia.fr': '185.15.58.224',
  'iroisenet.bzh': '203.0.113.10',
  'lycee-lacroixrouge.bzh': '203.0.113.80',
  'mairie-brest.bzh': '198.51.100.20',
  'meteo-iroise.bzh': '198.51.100.71',
  'ntp.iroisenet.bzh': '203.0.113.123',
  'creperie-arvag.bzh': '203.0.113.85'
};
// où se trouve chaque serveur (routeur auquel il est relié)
const HOST_AT = { '185.15.58.224': 'paris', '203.0.113.10': 'brest', '203.0.113.80': 'brest', '198.51.100.20': 'brest', '198.51.100.71': 'quimper', '203.0.113.123': 'brest', '203.0.113.85': 'brest', [DNS_IP]: 'brest' };

const ROUTERS = {
  ouessant: { name: 'Ouessant', x: 46, y: 96, ip: '203.0.113.240' },
  brest: { name: 'Brest', x: 140, y: 176, ip: '203.0.113.1' },
  morlaix: { name: 'Morlaix', x: 262, y: 104, ip: '203.0.113.241' },
  quimper: { name: 'Quimper', x: 232, y: 276, ip: '203.0.113.242' },
  rennes: { name: 'Rennes', x: 446, y: 142, ip: '203.0.113.243' },
  nantes: { name: 'Nantes', x: 460, y: 306, ip: '203.0.113.244' },
  paris: { name: 'Paris', x: 640, y: 196, ip: '203.0.113.245' }
};
// liaisons : [a, b, longueur en km, type]
const LINKS = [
  ['ouessant', 'brest', 30, 'radio'],
  ['brest', 'morlaix', 60, 'fibre'], ['brest', 'quimper', 70, 'fibre'],
  ['morlaix', 'rennes', 190, 'fibre'], ['quimper', 'nantes', 230, 'fibre'],
  ['rennes', 'nantes', 110, 'fibre'], ['rennes', 'paris', 350, 'fibre'], ['nantes', 'paris', 385, 'fibre']
];

/* ---------------------------------------------------------------------
   Questions de la mission 1
   --------------------------------------------------------------------- */
const Q_SUPPORTS = { title: "🔧 L'établi de Loïc", notion: 'physique', questions: [
  { t: 'tri', q: 'Range chaque réseau physique : <b>filaire</b> ou <b>sans fil</b> ?', cats: ['Filaire', 'Sans fil'],
    items: [['Fibre optique', 0], ['ADSL (cuivre)', 0], ['Wi-Fi', 1], ['4G / 5G', 1], ['Bluetooth', 1], ['Câble Ethernet RJ45', 0], ['Modem 56k', 0], ['Satellite', 1]],
    ex: "Filaire : le signal voyage dans un câble (cuivre ou verre). Sans fil : il voyage par ondes radio." },
  { t: 'tri', q: 'Ces réseaux sont-ils <b>actuels</b> ou <b>obsolètes</b> ?', cats: ['Actuel', 'Obsolète'],
    items: [['Modem 56k (« le modem qui chante »)', 1], ['Fibre optique', 0], ['5G', 0], ['Wi-Fi', 0]],
    ex: "Le modem 56k a disparu. L'ADSL, lui, est en train d'être remplacé par la fibre." },
  { t: 'order', q: 'Classe ces accès à Internet du <b>plus lent</b> au <b>plus rapide</b> :', items: ['Modem 56k', 'ADSL', '4G', 'Fibre optique'],
    hint: "Le modem date des années 1990, la fibre est la plus récente.", ex: "56 kbit/s pour le modem, quelques Mbit/s pour l'ADSL, des dizaines pour la 4G, des centaines voire des milliers pour la fibre." },
  { q: "Chez Mme Le Gall, la fibre arrive à la box ; sa tablette est en Wi-Fi, son téléphone en 4G. Pourtant, tous accèdent à Internet. Pourquoi ?",
    c: ['IP et TCP sont des logiciels : ils fonctionnent sur tous ces réseaux physiques', 'La box transforme les ondes Wi-Fi en lumière dans la fibre', 'Seule la fibre est reliée à Internet, les autres passent par elle', 'Chaque réseau physique possède son propre Internet séparé'], a: 0,
    fb: [null, "La box fait bien le lien entre Wi-Fi et fibre, mais ce n'est pas l'explication : IP fonctionne pareil sur les deux.", "La 4G et le Wi-Fi donnent eux aussi accès à Internet.", "Il n'y a qu'un seul Internet, qui s'appuie sur tous ces réseaux."],
    ex: "Internet est <b>indépendant du réseau physique</b> : IP et TCP sont des logiciels installés dans chaque appareil." }
] };

const Q_HISTOIRE = { title: '📜 La frise de Gwenaëlle', notion: 'histoire', intro: "📒 Tu peux ouvrir ton <b>carnet</b> à tout moment, même pendant une question (bouton « Carnet » en haut, ou touche C). La fiche « Petite histoire d'Internet » vient de s'y ajouter.", questions: [
  { t: 'order', q: 'Remets ces étapes dans l\'ordre chronologique :', items: ['Premiers ordinateurs reliés en réseau', 'ArpaNet, le réseau américain', 'Cyclades, le réseau français', "Naissance d'Internet avec TCP/IP"],
    hint: 'La fiche « Petite histoire d\'Internet » de ton carnet donne les dates.', ex: "Cyclades, projet français, a inspiré la façon dont Internet découpe l'information en paquets." },
  { q: "En 1983, qu'est-ce qui permet à des réseaux très différents de former un seul Internet ?",
    c: ['Un seul constructeur pour tous', 'Un protocole commun : TCP/IP', 'Un câble unique autour du monde', 'Un ordinateur central aux États-Unis'], a: 1,
    fb: ["Justement non : Internet est indépendant des constructeurs.", null, "Internet relie des réseaux de toutes sortes, pas un câble unique.", "Il n'y a pas d'ordinateur central : c'est ce qui rend Internet robuste."],
    ex: "Tous les réseaux « parlent » le même protocole, TCP/IP : c'est la naissance d'Internet." }
] };

const Q_TRAFIC = { title: '📈 La question de Gwenaëlle', notion: 'trafic', questions: [
  { q: "Selon le programme, quel était l'ordre de grandeur du trafic d'Internet prévu pour 2021 ?",
    c: ['3,3 × 10⁹ octets (3,3 milliards)', '3,3 × 10¹² octets (3 300 milliards)', '3,3 × 10²¹ octets (3 300 milliards de milliards)', '3,3 × 10⁶ octets (3,3 millions)'], a: 2,
    ex: "3,3 × 10²¹ octets, soit 3 300 milliards de milliards d'octets. Ton téléphone (128 Go ≈ 10¹¹ octets) en contiendrait une toute petite poussière !" },
  { q: "Quel usage fait le plus grimper le trafic d'Internet ces dernières années ?",
    c: ['Les mails', 'Les SMS', 'La vidéo', 'Les pages de texte'], a: 2,
    ex: "La vidéo (streaming, réseaux sociaux, visio) représente la plus grande part du trafic." }
] };

/* ---------------------------------------------------------------------
   Partie 3 : le site de la crêperie (navigateur simulé), graphe, résultats
   --------------------------------------------------------------------- */
const CARTE_DU_JOUR = {
  mardi: 'Galette complète – 9 €', mercredi: 'Galette andouille de Guémené – 11 €', jeudi: 'Galette saumon-poireaux – 12 €',
  vendredi: 'Galette Saint-Jacques – 14 €', samedi: 'Galette Ar Vag (pommes, chèvre, miel) – 12 €', dimanche: 'Galette forestière – 11 €'
};
const CREPERIE = {
  host: 'www.creperie-arvag.bzh', start: '/index.html',
  pages: {
    '/index.html': () => ({ status: 200, kind: 'fichier stocké sur le serveur', html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Crêperie Ar Vag – Brest</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Crêperie Ar Vag</h1>
  <p>Galettes et crêpes sur le port de Brest depuis 1987.</p>
  <div class="diapo" id="diapo">🖼️ galette-complete.jpg</div>
  <ul>
    <li><a href="/carte.php?jour=mardi">La carte du jour</a></li>
    <li><a href="/horaires.htm">Nos horaires</a></li>
  </ul>
  <script>
    // diaporama : le navigateur change de photo toutes les 3 secondes
    const photos = ['galette-complete.jpg', 'crepe-caramel.jpg', 'salle.jpg'];
    let n = 0;
    setInterval(() => {
      n = (n + 1) % photos.length;
      document.getElementById('diapo').textContent = '🖼️ ' + photos[n];
    }, 3000);
  </script>
</body>
</html>` }),
    '/carte.php': p => {
      const j = String(p.jour || '').toLowerCase();
      const body = j === 'lundi' ? '<p>La crêperie est fermée le lundi. Kenavo !</p>'
        : CARTE_DU_JOUR[j] ? `<ul>\n    <li>Galette du jour : ${CARTE_DU_JOUR[j]}</li>\n    <li>Galette complète – 9 €</li>\n    <li>Crêpe beurre-sucre – 4 €</li>\n    <li>Crêpe caramel au beurre salé – 5 €</li>\n  </ul>`
        : '<p>Aucune carte pour ce jour.</p>';
      return { status: 200, kind: 'page fabriquée par le serveur (programme PHP)', html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Carte du ${j || '?'} – Crêperie Ar Vag</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Carte du ${j || '?'}</h1>
  ${body}
  <p><a href="/index.html">Retour à l'accueil</a></p>
</body>
</html>` };
    },
    '/horaires.html': () => ({ status: 200, kind: 'fichier stocké sur le serveur', html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Horaires – Crêperie Ar Vag</title>
</head>
<body>
  <h1>Nos horaires</h1>
  <p>Du mardi au dimanche, de 12 h à 14 h et de 19 h à 22 h.</p>
  <p><a href="/index.html">Retour à l'accueil</a></p>
</body>
</html>` })
  }
};

/* graphe de liens pour la popularité : D reçoit 3 liens, E 2, A 1, B et C aucun */
const POP_NODES = { A: [70, 58, 'Encyclopédie'], B: [330, 196, 'Croisières (pub)'], C: [70, 196, 'Blog de touriste'], D: [200, 124, "Mairie d'Ouessant"], E: [330, 58, 'Office de tourisme'] };
const POP_EDGES = [['A', 'D'], ['C', 'D'], ['E', 'D'], ['D', 'E'], ['A', 'E'], ['C', 'A']];
const POP_GRAPH = () => {
  const r = 22, arr = POP_EDGES.map(([a, b]) => {
    const [x1, y1] = POP_NODES[a], [x2, y2] = POP_NODES[b], d = Math.hypot(x2 - x1, y2 - y1);
    // deux liens opposés (D⇄E) : on décale légèrement chaque flèche
    const both = POP_EDGES.some(([u, v]) => u === b && v === a), ox = both ? -(y2 - y1) / d * 6 : 0, oy = both ? (x2 - x1) / d * 6 : 0;
    return `<line x1="${x1 + (x2 - x1) * r / d + ox}" y1="${y1 + (y2 - y1) * r / d + oy}" x2="${x2 - (x2 - x1) * (r + 4) / d + ox}" y2="${y2 - (y2 - y1) * (r + 4) / d + oy}" marker-end="url(#pg-ar)"/>`;
  }).join('');
  const nodes = Object.entries(POP_NODES).map(([k, [x, y, t]]) => `<circle cx="${x}" cy="${y}" r="${r}"/><text x="${x}" y="${y + 6}" class="pg-k">${k}</text><text x="${x}" y="${y < 100 ? y - r - 7 : y + r + 15}" class="pg-t">${t}</text>`).join('');
  return `<svg class="pop-graph" viewBox="0 0 400 250" role="img" aria-label="Graphe des liens entre cinq pages"><defs><marker id="pg-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z"/></marker></defs><g class="pg-e">${arr}</g><g class="pg-n">${nodes}</g></svg>`;
};
const SERP_HTML = `<div class="serp"><div class="serp-q">🔎 phare Ouessant</div>
  <div class="serp-r ad"><small><b>Annonce</b> · croisieres-iroise.bzh</small><span>Croisière « Phares d'Ouessant » : -20 % cette semaine !</span></div>
  <div class="serp-r"><small>mairie-ouessant.bzh › patrimoine</small><span>Les phares de l'île d'Ouessant</span></div>
  <div class="serp-r"><small>tourisme-ouessant.bzh</small><span>Visiter le phare du Créac'h</span></div></div>`;

/* ---------------------------------------------------------------------
   Missions
   --------------------------------------------------------------------- */
const MISSIONS = [
  /* ====================== MISSION 1 ====================== */
  {
    id: 'm1', partie: 1, title: 'Bienvenue au bout du monde', when: 'Lundi · 8h30 · Brest',
    story: "Premier jour de stage chez <b>IroiseNet</b>, le fournisseur d'accès à Internet du Finistère, sur le port de commerce de Brest. Mauvaise surprise : Yann, le technicien, est bloqué à Ouessant par la tempête. Plus de bateau avant demain… et les clients vont appeler.",
    goals: ["Connaître les grandes étapes de l'histoire d'Internet", 'Caractériser quelques réseaux physiques : filaires ou non, rapides ou lents, actuels ou obsolètes', "Comprendre qu'Internet est indépendant du réseau physique"],
    steps: [
      { id: 'm1s1', label: 'Parler à Gwenaëlle, la directrice technique', target: 'gwen',
        run() {
          say([
            ['gwen', "Bienvenue chez IroiseNet, {nom} ! Petit souci : Yann, notre technicien, est coincé à Ouessant. La tempête a annulé tous les bateaux."],
            ['gwen', "C'est donc toi qui vas tenir la hotline avec Erwan et Maëlys. Erwan a fait sa 2nde au lycée La Croix Rouge, comme toi : il te donnera un coup de main."],
            ['moi', "La hotline ? Mais je ne connais rien au réseau d'un fournisseur d'accès !"],
            ['gwen', "Justement, on va commencer par les bases. Viens voir la frise sur le panneau, là, à gauche."],
            ['gwen', "Et garde ton <b>carnet</b> sous la main (touche C) : il se remplit de fiches au fil de la journée, et tu peux le consulter même pendant mes questions."]
          ], done);
        } },
      { id: 'm1s2', label: "Remettre en ordre la frise de l'histoire d'Internet", target: 'frise',
        run() { quiz(Q_HISTOIRE, done); },
        notions: ['histoire'] },
      { id: 'm1s3', label: "Trier les supports sur l'établi de Loïc", target: 'etabli',
        run() {
          say([
            ['loic', "Salut ! Ici, c'est l'atelier. Sur l'établi, j'ai tout ce qui transporte Internet jusqu'aux clients."],
            ['loic', "Des câbles en cuivre, de la fibre optique, des antennes… et même un vieux modem. Aide-moi à ranger tout ça."]
          ], () => quiz(Q_SUPPORTS, done));
        },
        notions: ['physique'] },
      { id: 'm1s4', label: 'Faire le point avec Gwenaëlle', target: 'gwen',
        run() {
          say([
            ['gwen', "Bien joué. Tu as compris l'essentiel : Internet passe partout, par la fibre, le Wi-Fi, la 4G…"],
            ['gwen', "Et ça représente un volume énorme. Une dernière question avant de passer à la hotline."]
          ], () => quiz(Q_TRAFIC, done));
        },
        notions: ['trafic'] }
    ]
  },

  /* ====================== MISSION 2 ====================== */
  {
    id: 'm2', partie: 1, title: 'Allô, la hotline ?', when: 'Lundi · 10h00 · Brest',
    story: "Le téléphone de ton bureau sonne déjà. Avec la prise en main à distance, tu peux ouvrir l'invite de commandes sur l'ordinateur d'un client, comme si tu étais chez lui.",
    goals: ["Trouver l'adresse IP d'un appareil, de sa box (passerelle) et de son serveur DNS", 'Analyser un réseau local pour voir ce qui y est connecté', 'Retrouver une adresse IP à partir d\'un nom, et inversement (DNS)'],
    onStart() { S.ring = true; },
    steps: [
      { id: 'm2s1', label: 'Décrocher le téléphone (Mme Le Gall appelle)', target: 'telephone',
        run() {
          S.ring = false;
          say([
            ['legall', "Allô ? Bonjour, c'est Mme Le Gall, à Recouvrance. Mon petit-fils doit régler sa console et il me demande « l'adresse IP de l'ordinateur ». C'est quoi, ce machin ?"],
            ['moi', "Pas de souci, madame, je prends la main à distance sur votre ordinateur."],
            ['erwan', "(à voix basse) Tape <code>ipconfig</code> dans son invite de commandes : tout y est !"]
          ], done);
        },
        skip() { S.ring = false; } },
      { id: 'm2s2', label: "Trouver l'adresse IP de Mme Le Gall (sur ton poste)", target: 'mon_pc',
        run() {
          const c = CLIENTS.legall;
          terminal('legall', {
            goal: "Affiche la configuration réseau de l'ordinateur de Mme Le Gall avec <code>ipconfig</code>.",
            quick: ['ipconfig', 'aide'],
            onResult(r, api) {
              if (r.type === 'ipconfig' && !api.flag) {
                api.flag = true;
                api.after("Bravo, tu as la configuration complète. Relève les trois adresses !", 'Répondre à Mme Le Gall', () => quiz({ title: '📞 Mme Le Gall attend', notion: 'ip', questions: [
                  { t: 'input', q: "Quelle est l'<b>adresse IP</b> (IPv4) de l'ordinateur de Mme Le Gall ?", a: [c.ip], ph: 'ex : 10.0.0.1', hint: 'Relis la ligne « Adresse IPv4 » de ipconfig.', ex: `Son adresse IP est <code>${c.ip}</code>.` },
                  { t: 'input', q: "Quelle est l'adresse de sa <b>box</b> (la passerelle par défaut) ?", a: [c.gw], ph: 'ex : 10.0.0.254', hint: 'Relis la ligne « Passerelle par défaut ».', ex: "La box est la porte de sortie vers Internet : c'est la <b>passerelle</b>." },
                  { t: 'input', q: "Quelle est l'adresse de son <b>serveur DNS</b> ?", a: [c.dns], ph: 'ex : 10.0.0.53', hint: 'Relis la ligne « Serveurs DNS ».', ex: "C'est le serveur DNS d'IroiseNet, dans notre salle des machines !" },
                  { q: "Laquelle de ces adresses IPv4 est <b>impossible</b> ?",
                    c: ['192.168.1.256', '172.16.254.100', '10.29.4.57', '8.8.8.8'], a: 0,
                    ex: "Chaque nombre d'une adresse IPv4 va de 0 à 255 : <b>256</b> est donc impossible." }
                ] }, done));
              }
            }
          });
        },
        notions: ['ip'] },
      { id: 'm2s3', label: 'Inspecter la box de Mme Le Gall (sur ton poste)', target: 'mon_pc',
        run() {
          say([
            ['legall', "Tant que je vous tiens… Mon Internet rame tous les soirs, alors que je regarde juste la météo !"],
            ['maelys', "Regarde la liste des appareils connectés dans l'interface de sa box. Parfois, on y trouve un invité surprise…"]
          ], () => quiz({ title: '📦 Interface de la box — Mme Le Gall', notion: 'box', wide: true, questions: [
            { q: `<table class="box-list"><tr><th>Appareil</th><th>Adresse IP</th><th>Connexion</th><th>Dernière activité</th></tr>
              <tr><td>PC-SALON</td><td>192.168.1.23</td><td>Wi-Fi</td><td>maintenant</td></tr>
              <tr><td>Tablette-Mamie</td><td>192.168.1.24</td><td>Wi-Fi</td><td>il y a 2 h</td></tr>
              <tr><td>Imprimante</td><td>192.168.1.30</td><td>Wi-Fi</td><td>hier</td></tr>
              <tr><td>Console-Jean</td><td>192.168.1.26</td><td>Wi-Fi</td><td>hier soir, 21 h</td></tr>
              <tr><td>Decodeur-TV</td><td>192.168.1.2</td><td>câble</td><td>maintenant</td></tr>
              <tr><td>PC-JEROME</td><td>192.168.1.47</td><td>Wi-Fi</td><td>toutes les nuits, 3 h du matin</td></tr></table>
              Mme Le Gall vit seule avec son fils Jean. Quel appareil n'a rien à faire sur son réseau ?`,
              c: ['PC-SALON', 'Console-Jean', 'PC-JEROME', 'Tablette-Mamie'], a: 2,
              ex: "Un voisin utilise son Wi-Fi sans autorisation : il télécharge la nuit et ralentit sa connexion." },
            { q: 'Que conseilles-tu à Mme Le Gall ?',
              c: ['Débrancher la box tous les soirs avant de dormir', 'Acheter un ordinateur plus récent et plus rapide', 'Changer la clé du Wi-Fi pour une clé longue et secrète', 'Baisser le volume de la télévision'], a: 2,
              fb: ["Elle ne pourrait plus regarder la télé le soir… et l'intrus reviendrait le lendemain.", "L'ordinateur n'y est pour rien : c'est l'accès au Wi-Fi qu'il faut protéger.", null, '😄 Non.'],
              ex: "Une nouvelle clé Wi-Fi, longue et secrète, et l'intrus est déconnecté. Analyser son réseau local permet de voir ce qui y est connecté." }
          ] }, done));
        },
        notions: ['box'] },
      { id: 'm2s4', label: "Comprendre le DNS avec Erwan", target: 'erwan',
        run() {
          say([
            ['erwan', "Une question classique à la hotline : « comment mon ordinateur trouve-t-il wikipedia.fr ? »"],
            ['erwan', "Les machines ne connaissent que des adresses IP. Le <b>DNS</b>, c'est l'annuaire qui traduit les noms en adresses. Le nôtre est dans la salle des machines."],
            ['erwan', "Va sur ton poste et utilise <code>nslookup</code>. Ça marche dans les deux sens : un nom donne une adresse, une adresse donne un nom."]
          ], done);
        } },
      { id: 'm2s5', label: 'Interroger le DNS avec nslookup (sur ton poste)', target: 'mon_pc',
        run() {
          S.sp.ns = S.sp.ns || {};
          terminal('mon_pc', {
            goal: "1) Trouve l'adresse IP de <code>wikipedia.fr</code>. 2) Trouve à quel nom correspond l'adresse <code>203.0.113.80</code>.",
            quick: ['nslookup wikipedia.fr', 'nslookup 203.0.113.80', 'aide'],
            onResult(r, api) {
              if (r.type !== 'nslookup' || !r.ok) return;
              if (r.query === 'wikipedia.fr') S.sp.ns.a = 1;
              if (r.query === '203.0.113.80') S.sp.ns.b = 1;
              if (S.sp.ns.a && S.sp.ns.b && !api.flag) {
                api.flag = true;
                api.after('Les deux recherches sont faites. Vérifions !', 'Répondre', () => quiz({ title: '📖 Le DNS', notion: 'dns', questions: [
                  { t: 'input', q: "Quelle est l'adresse IP de <code>wikipedia.fr</code> ?", a: [DNS_RECORDS['wikipedia.fr']], ph: 'adresse IP', hint: 'Relis la ligne « Address » de nslookup wikipedia.fr.', ex: 'Le DNS a traduit le nom en adresse IP.' },
                  { t: 'input', q: "À quel nom correspond l'adresse <code>203.0.113.80</code> ?", a: ['lycee-lacroixrouge.bzh'], ph: 'nom de domaine', hint: 'Relis la ligne « Nom » de nslookup 203.0.113.80.', ex: "C'est le site de ton lycée (version simulée) ! Le DNS fonctionne aussi dans l'autre sens." },
                  { q: 'Qui réalise le service DNS sur Internet ?',
                    c: ['Un seul ordinateur géant aux États-Unis', 'Ta box, qui connaît tous les sites', 'Un grand nombre d\'ordinateurs répartis', 'Les câbles de fibre optique'], a: 2,
                    ex: "Le DNS est réparti sur un très grand nombre de serveurs, mis à jour en permanence." },
                  { q: "Le DNS d'un client tombe en panne. Que se passe-t-il ?",
                    c: ['Plus rien ne marche, même en tapant une adresse IP', 'Les noms ne marchent plus, les adresses IP si', "L'ordinateur perd son adresse IP et sa passerelle", 'Le Wi-Fi se coupe dans toute la maison'], a: 1,
                    ex: "Sans annuaire, on ne trouve plus un site par son nom… mais on peut toujours le joindre par son adresse IP." }
                ] }, () => { S.sp.ns = null; done(); }));
              }
            }
          });
        },
        notions: ['dns'] },
      { id: 'm2s6', label: 'Bilan de la matinée avec Gwenaëlle', target: 'gwen',
        run() {
          say([
            ['gwen', "Quelle matinée ! Tu sais lire une configuration réseau, protéger un Wi-Fi et interroger le DNS."],
            ['gwen', "Cet après-midi, Soizic t'emmène à la supervision : tu vas voir comment les paquets traversent la Bretagne. Mais d'abord, la pause !"]
          ], done);
        } }
    ]
  },

  /* ====================== MISSION 3 ====================== */
  {
    id: 'm3', partie: 2, title: 'Le voyage des paquets', when: 'Lundi · 14h00 · Brest',
    story: "Direction la salle de supervision. Sur le grand écran de Soizic, une carte : les routeurs d'IroiseNet à Brest, Morlaix, Quimper, reliés par fibre optique à Rennes, Nantes et Paris. Chaque seconde, des millions de paquets y circulent.",
    goals: ['Comprendre comment un paquet est routé de proche en proche', 'Voir comment les routeurs s\'adaptent à une panne', 'Caractériser les limites du routage : panne, destruction des paquets'],
    steps: [
      { id: 'm3s1', label: 'Rejoindre Soizic à la supervision', target: 'soizic',
        run() {
          say([
            ['soizic', "Bienvenue à la supervision ! Ici, on surveille nos routeurs. Quand un client de Brest consulte Wikipédia, ses paquets partent vers Paris."],
            ['soizic', "Chaque paquet contient l'adresse de l'émetteur, celle du destinataire, et un morceau des données."],
            ['soizic', "Mais attention : <b>aucun routeur ne connaît tout le chemin</b>. Chacun a juste une table qui dit à quel voisin passer le paquet. Viens essayer sur l'écran."]
          ], done);
        },
        notions: ['routage'] },
      { id: 'm3s2', label: 'Router un paquet de Brest à Paris (grand écran)', target: 'ecran',
        run() {
          routing({ title: '🧭 Router un paquet', from: 'brest', to: 'paris', ttl: 8,
            intro: "Un paquet part de <b>Brest</b> vers le serveur de Wikipédia, relié à <b>Paris</b>. À chaque routeur, lis sa table et clique sur le voisin à qui il faut passer le paquet.",
            onDone: () => quiz({ title: '🧭 Le routage', notion: 'routage', questions: [
              { q: 'Pour choisir où envoyer un paquet, le routeur de Morlaix utilise :',
                c: ["La carte complète d'Internet, téléchargée chaque matin", 'Sa table, construite avec ses voisins', 'Les indications envoyées par le destinataire', 'Le serveur DNS'], a: 1,
                ex: "Chaque routeur a une carte <b>locale</b> : il connaît ses voisins et la direction à prendre, pas tout le chemin." },
              { q: "Pourquoi n'y a-t-il pas de carte globale d'Internet dans chaque routeur ?",
                c: ['Elle serait trop grande et changerait sans arrêt', "C'est interdit par la loi", "Les routeurs n'ont pas assez d'écran pour l'afficher", 'Elle existe, mais seuls les opérateurs y ont accès'], a: 0,
                ex: "Internet relie des milliards d'appareils et change en permanence : le routage de proche en proche permet de fonctionner à grande échelle." }
            ] }, done) });
        },
        notions: ['routage'] },
      { id: 'm3s3', label: 'Suivre le chemin avec tracert (sur ton poste)', target: 'mon_pc',
        run() {
          terminal('mon_pc', {
            goal: "Utilise <code>tracert wikipedia.fr</code> pour afficher la liste des routeurs traversés.",
            quick: ['tracert wikipedia.fr', 'aide'],
            onResult(r, api) {
              if (r.type === 'tracert' && r.ok && r.query === 'wikipedia.fr' && !api.flag) {
                api.flag = true;
                const n = r.hops - 1;
                api.after(`Le chemin s'affiche : ${r.hops} étapes, la dernière étant le serveur lui-même.`, 'Répondre', () => quiz({ title: '🛰️ tracert', notion: 'routage', questions: [
                  { t: 'input', q: "Combien de <b>routeurs</b> le paquet a-t-il traversés (sans compter le serveur de Wikipédia à la fin) ?", a: [String(n)], ph: 'un nombre', hint: 'Compte les lignes du tracert, puis retire la dernière (le serveur).', ex: `${n} routeurs, de la box de l'agence jusqu'à Paris.` },
                  { q: 'À quoi sert la commande tracert ?',
                    c: ['À traduire un nom de domaine en adresse IP', 'À afficher sa propre adresse IP', 'À afficher les routeurs traversés', 'À accélérer la connexion'], a: 2,
                    ex: "tracert (traceroute) affiche chaque routeur traversé, avec le temps de réponse." }
                ] }, done));
              }
            }
          });
        } },
      { id: 'm3s4', label: 'Panne ! Rétablir le chemin vers Paris (grand écran)', target: 'ecran',
        run() {
          S.net.cut = 'morlaix-rennes';
          say([
            ['soizic', "Alerte ! Une pelleteuse vient d'arracher la fibre entre Morlaix et Rennes, sur un chantier près de Guingamp."],
            ['soizic', "Le routeur de Morlaix s'en est aperçu et a prévenu ses voisins : « je ne peux plus joindre Paris ». Mets à jour la table de Brest, puis renvoie un paquet."]
          ], () => routing({ title: '🚧 Panne entre Morlaix et Rennes', from: 'brest', to: 'paris', ttl: 8, editAt: 'brest',
            intro: "La liaison <b>Morlaix – Rennes</b> est coupée (en rouge). Choisis d'abord le nouveau voisin de Brest pour aller à Paris, puis route le paquet.",
            onDone: () => quiz({ title: '🚧 Après la panne', notion: 'routage', questions: [
              { q: 'Comment les routeurs ont-ils réagi à la panne ?',
                c: ['Ils ont attendu que la fibre soit réparée', 'Un ordinateur central les a tous reprogrammés à distance', 'Ils ont tous été redémarrés', 'Ils ont changé de chemin de proche en proche'], a: 3,
                ex: "Les routeurs échangent en permanence avec leurs voisins : quand l'un disparaît, les autres trouvent un nouveau chemin." }
            ] }, done) }));
        },
        skip() { S.net.cut = 'morlaix-rennes'; },
        notions: ['routage'] },
      { id: 'm3s5', label: 'Le paquet fou (grand écran)', target: 'ecran',
        run() {
          say([
            ['soizic', "Bizarre… Le routeur de Nantes a été mal configuré ce matin : pour aller à Paris, il renvoie les paquets vers Quimper !"],
            ['soizic', "Et Quimper les renvoie vers Nantes… Suis ce paquet. Regarde bien son compteur de sauts."]
          ], () => routing({ title: '🌀 Le paquet fou', from: 'quimper', to: 'paris', ttl: 5, bug: { nantes: { paris: 'quimper' } },
            intro: "Chaque paquet contient un <b>nombre maximal de routeurs à traverser</b> (ici 5). Il baisse de 1 à chaque routeur. Que faire quand il arrive à 0 ?",
            onDone: () => quiz({ title: '⛔ Les limites du routage', notion: 'limites', questions: [
              { q: 'Pourquoi un paquet est-il détruit quand son compteur arrive à 0 ?',
                c: ['Pour ne pas encombrer le réseau', "Parce qu'il est devenu trop lourd après le voyage", "Parce qu'il contient sûrement un virus", "Pour économiser l'électricité"], a: 0,
                ex: "Sans ce compteur, un paquet perdu pourrait tourner en rond à l'infini et encombrer le réseau." },
              { q: 'Pour quelles raisons un paquet peut-il ne jamais arriver ?',
                c: ['Il est trop gros pour les câbles', "Le destinataire habite trop loin de l'émetteur", 'Une panne sans autre chemin, ou sa destruction', "Le DNS ne connaît pas l'adresse du destinataire"], a: 2,
                ex: "Les deux causes : une panne matérielle qu'on ne peut pas contourner, ou la destruction du paquet." }
            ] }, done) }));
        },
        notions: ['limites'] }
    ]
  },

  /* ====================== MISSION 4 ====================== */
  {
    id: 'm4', partie: 2, title: 'TCP à la rescousse', when: 'Lundi · 15h30 · Brest',
    story: "La classe de 2nde du lycée La Croix Rouge prépare une visio avec ses correspondants de Plymouth, de l'autre côté de la Manche. Mme Quéré, la documentaliste, appelle : leur message arrive en morceaux !",
    goals: ['Distinguer le rôle des protocoles IP et TCP', 'Distinguer la fiabilité de transmission et l\'absence de garantie temporelle', 'Faire le bilan : pair-à-pair, neutralité du Net'],
    onStart() { S.ring = true; },
    steps: [
      { id: 'm4s1', label: 'Écouter Mme Quéré (lycée La Croix Rouge)', target: 'telephone',
        run() {
          S.ring = false;
          say([
            ['cdi', "Bonjour, ici Mme Quéré, au CDI de La Croix Rouge. Les 2nde envoient un message à leurs correspondants de Plymouth…"],
            ['cdi', "Mais l'ordinateur de test l'a reçu en vrac : des morceaux dans le désordre, et il en manque !"],
            ['erwan', "Normal, chaque paquet voyage seul et peut prendre un chemin différent. C'est le travail de <b>TCP</b> de tout remettre en ordre. Fais-le à la main, sur ton poste, pour comprendre."]
          ], done);
        },
        skip() { S.ring = false; } },
      { id: 'm4s2', label: 'Reconstituer le message comme TCP (sur ton poste)', target: 'mon_pc',
        run() {
          tcpPuzzle({ title: '🧩 Faire le travail de TCP', text: "Hello Plymouth ! Ici la classe de 2nde du lycée La Croix Rouge à Brest. Visio jeudi à 10 h. Kenavo !", size: 14, lost: 2,
            onDone: () => quiz({ title: '🧩 IP ou TCP ?', notion: 'tcp', questions: [
              { q: 'Quel protocole a donné une adresse à chaque paquet et l\'a acheminé jusqu\'au lycée ?',
                c: ['TCP', 'IP', 'DNS', 'HTTP'], a: 1,
                ex: "<b>IP</b> s'occupe des adresses et de l'acheminement de chaque paquet." },
              { q: "Quel protocole a remis les paquets dans l'ordre et redemandé ceux qui manquaient ?",
                c: ['IP', 'DNS', 'TCP', 'NTP'], a: 2,
                ex: "<b>TCP</b> fiabilise la communication : il réordonne et redemande les paquets manquants." },
              { q: "Où est installé TCP/IP ?",
                c: ['Dans les câbles de fibre optique', 'Uniquement chez IroiseNet', 'Dans chaque appareil connecté', 'Dans les satellites seulement'], a: 2,
                ex: "TCP/IP n'est pas dans l'infrastructure : il est dans chacun des ordinateurs connectés." }
            ] }, done) });
        },
        notions: ['tcp'] },
      { id: 'm4s3', label: 'La visio qui saccade (rappeler le CDI)', target: 'telephone',
        run() {
          say([
            ['cdi', "Merci ! Le message est passé. On a lancé la visio avec Plymouth… mais l'image saccade de temps en temps. TCP ne devait pas tout régler ?"],
            ['moi', "TCP garantit que les paquets arrivent… mais pas quand. Laissez-moi vous montrer."]
          ], () => quiz({ title: '⏱️ Visio Brest – Plymouth', notion: 'temps', wide: true, questions: [
            { q: `<div class="frames">${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<span class="${n === 5 ? 'lost' : ''}">🎞️ ${n}</span>`).join('')}</div>Pendant la visio, l'image n° 5 s'est perdue en route. Que vaut-il mieux faire ?`,
              c: ["Bloquer l'image jusqu'à ce que la 5 arrive", "Passer directement à l'image 6, sans attendre la 5", "Recommencer l'appel depuis le début", "Renvoyer toute la vidéo depuis l'image 1"], a: 1,
              fb: ["Pendant ce temps, tout le monde serait figé : la conversation prendrait du retard.", null, "Tout le monde perdrait le fil… pour une seule image !", "Ce serait très long, et inutile pour une image déjà passée."],
              ex: "Dans une visio, on peut perdre une image isolée, mais pas le fil du temps." },
            { q: "Pourquoi une visio peut-elle saccader même quand TCP/IP fonctionne parfaitement ?",
              c: ['TCP jette volontairement une image sur deux', "Internet ne garantit pas le délai d'arrivée", 'Les vidéos ne passent pas par le protocole IP', 'La Manche bloque une partie des ondes radio'], a: 1,
              ex: "C'est l'<b>absence de garantie temporelle</b> : un paquet finit par arriver, mais on ne sait pas quand." },
            { q: 'Pour lequel de ces usages un retard de quelques secondes est-il le moins gênant ?',
              c: ['Un appel vidéo avec Plymouth', 'Un match du Stade Brestois en direct', "Le téléchargement d'un PDF", 'Un jeu en ligne'], a: 2,
              ex: "Pour un fichier, seul compte le résultat complet : TCP le garantit. Pour le direct, le délai compte autant que le contenu." }
          ] }, done));
        },
        notions: ['temps'] },
      { id: 'm4s4', label: 'Rapport final à Gwenaëlle', target: 'gwen',
        run() {
          say([
            ['gwen', "{nom}, Yann vient d'appeler d'Ouessant : il rentre demain matin par le premier bateau. Il paraît que tu as tenu la boutique !"],
            ['gwen', "Avant de partir, un dernier petit contrôle de ce que tu as appris aujourd'hui."]
          ], () => quiz({ title: '🏁 Le contrôle de Gwenaëlle', notion: 'tcp', questions: [
            { q: "Qui transforme <code>wikipedia.fr</code> en adresse IP ?", c: ['Le routeur', 'Le DNS', 'TCP', 'La fibre'], a: 1, ex: "Le DNS, l'annuaire d'Internet." },
            { q: "Qui choisit le prochain routeur pour un paquet ?", c: ['Le routeur, avec sa table', 'Le DNS', 'Le destinataire', "L'émetteur, une fois pour toutes"], a: 0, ex: 'Chaque routeur décide, de proche en proche.' },
            { q: "Un réseau pair-à-pair, c'est un réseau où :", c: ['Seuls deux ordinateurs communiquent', 'Un serveur central distribue tout', 'Chaque ordinateur émet et reçoit', 'Tous les échanges sont illégaux'], a: 2, ex: "Chaque ordinateur est à la fois émetteur et récepteur : utile pour partager de gros fichiers, mais illégal pour diffuser des œuvres sans l'accord des auteurs." },
            { q: "La neutralité du Net, c'est l'idée que :", c: ['Internet ne doit pas prendre parti en politique', 'Les routeurs traitent tous les paquets pareil', 'Les sites doivent rester neutres', 'Tous les abonnements coûtent le même prix'], a: 1, ex: "Les paquets sont transmis quel que soit leur contenu : texte, vidéo, jeu…" }
          ] }, done));
        },
        notions: ['p2p', 'neutralite'] }
    ]
  },
  /* ====================== MISSION 5 (partie 3 : le Web) ====================== */
  {
    id: 'm5', partie: 3, title: 'Le site de la crêperie', when: 'Mardi · 9h00 · Brest',
    story: "Deuxième jour de stage. Yann est rentré d'Ouessant par le premier bateau : il reprend la hotline. Gwenaëlle t'envoie au <b>pôle Web</b>, chez Klervi : IroiseNet héberge aussi les sites web de ses clients. Justement, la <b>crêperie Ar Vag</b>, sur le port, appelle : sur son site, le lien des horaires ne marche plus.",
    goals: ["Distinguer Internet et le Web, maîtriser les liens hypertextes", 'Connaître les étapes du développement du Web', "Décomposer l'URL d'une page et reconnaître une page sécurisée", 'Décomposer une requête HTTP et identifier les paramètres passés', 'Distinguer ce qui est exécuté par le client et par le serveur', 'Distinguer le contenu (HTML) du style (CSS), et modifier une page HTML simple'],
    steps: [
      { id: 'm5s1', label: 'Rencontrer Klervi, la webmaster', target: 'klervi',
        run() {
          say([
            ['klervi', "Salut {nom} ! Gwenaëlle m'a dit que tu avais sauvé la hotline hier. Aujourd'hui, on passe au <b>Web</b>."],
            ['moi', "Le Web… c'est pas la même chose qu'Internet ?"],
            ['klervi', "Pas du tout ! Internet, ce sont les tuyaux : les routeurs, les paquets, TCP/IP. Le <b>Web</b> est un <b>service</b> qui passe dans ces tuyaux, comme le mail."],
            ['klervi', "Le Web, ce sont des pages, des images, des vidéos, reliées par des <b>liens hypertextes</b>. Un clic, et tu passes d'une page de Brest à un serveur au Japon."]
          ], () => quiz({ title: '🕸️ Le Web selon Klervi', notion: 'hypertexte', questions: [
            { q: 'Le Web et Internet, c\'est…', c: ['La même chose, deux noms pour un seul et unique réseau', 'Différent : le Web est un service qui utilise Internet', 'Différent : Internet est une petite partie du Web', "Différent : le Web n'a besoin d'aucun câble"], a: 1,
              fb: ["Non : Internet existait déjà (1983) quand le Web est né (1989).", null, "C'est l'inverse : le Web s'appuie sur Internet.", 'Les pages web voyagent dans les mêmes câbles et les mêmes paquets IP que le reste.'],
              ex: "Internet est le réseau. Le Web est l'un des services qui l'utilisent, avec le mail, la visio, NTP…" },
            { q: "Qu'est-ce qu'un lien hypertexte ?", c: ['Un renvoi automatique vers une autre page, une image ou un son', 'Un texte écrit en très gros caractères sur la page', 'Un câble qui relie directement deux ordinateurs entre eux', 'Un message envoyé à tous les internautes connectés en même temps'], a: 0,
              ex: "Un clic sur un lien hypertexte t'emmène vers un autre contenu, sur n'importe quelle machine d'Internet, grâce à son adresse (URL)." }
          ] }, done));
        },
        notions: ['hypertexte'] },
      { id: 'm5s2', label: 'Compléter la frise avec l\'histoire du Web', target: 'frise',
        run() {
          say([['gwen', "Tu tombes bien ! J'ai ajouté le Web sur la frise. Internet date de 1983… et le Web, d'après toi ?"]], () => quiz({ title: '🕸️ La frise du Web', notion: 'web_histoire', intro: "📒 La fiche « Petite histoire du Web » vient de s'ajouter à ton carnet (touche C).", questions: [
            { t: 'order', q: "Remets ces étapes du Web dans l'ordre chronologique :", items: ["Ted Nelson invente l'hypertexte", 'Tim Berners-Lee crée le Web au CERN', 'Mosaic, premier navigateur grand public', 'JavaScript et PHP : des sites interactifs', 'Le DOM standardise les pages', 'Le Web arrive sur les mobiles'],
              hint: 'La fiche « Petite histoire du Web » de ton carnet donne les dates.', ex: '1965, 1989, 1993, 1995, 2001, 2010 : en moins de 50 ans, le Web est passé d\'une idée à nos téléphones.' },
            { q: 'Où le Web est-il né, en 1989 ?', c: ['Au CERN, près de Genève', 'Dans la Silicon Valley', "Au ministère de l'Armée américaine", 'À Brest, chez IroiseNet'], a: 0,
              ex: "Au CERN, le laboratoire européen de physique, où Tim Berners-Lee voulait partager des documents entre chercheurs." },
            { q: 'Internet (1983) et le Web (1989) : lequel est apparu en premier ?', c: ["Internet, et le Web s'appuie dessus", 'Le Web, et Internet est venu ensuite', 'Les deux sont nés le même jour', "Ils sont nés à cinquante ans d'écart"], a: 0,
              ex: "Le Web est né six ans après Internet : il utilise le réseau qui existait déjà." }
          ] }, done));
        },
        notions: ['web_histoire'] },
      { id: 'm5s3', label: "Décortiquer l'adresse du site (sur ton poste)", target: 'mon_pc',
        run() {
          quiz({ title: '🧭 Les adresses du Web', notion: 'url', questions: [
            { t: 'tri', q: 'Voici deux adresses de pages :<br><code>https://www.creperie-arvag.bzh/carte/galettes.html</code><br><code>http://mairie-brest.bzh/horaires.html</code><br>Range chaque morceau :', cats: ['Protocole', 'Nom de domaine', 'Chemin de la page'],
              items: [['https', 0], ['http', 0], ['www.creperie-arvag.bzh', 1], ['mairie-brest.bzh', 1], ['/carte/galettes.html', 2], ['/horaires.html', 2]],
              hint: 'Le protocole est avant « :// », le nom de domaine va jusqu\'au premier « / ».', ex: "Protocole :// nom de domaine / chemin de la page. Le nom de domaine est traduit en adresse IP par le DNS !" },
            { q: 'Laquelle de ces pages est <b>sécurisée</b> ?', c: ['https://www.iroisenet.bzh/compte', 'http://www.iroisenet.bzh/compte', 'http://securite.iroisenet.bzh/compte', 'http://www.iroisenet.bzh/https/compte'], a: 0,
              fb: [null, "Le protocole est http, sans s : les échanges circulent en clair.", "Le mot « securite » dans le nom ne protège rien : le protocole est http.", "« https » est ici dans le chemin, pas au début : le protocole reste http."],
              ex: "Seul le protocole <b>https</b>, au début de l'adresse, chiffre les échanges. Le navigateur affiche alors un cadenas 🔒." },
            { q: 'Que garantit le protocole HTTPS ?', c: ['Les échanges avec le serveur sont chiffrés', 'Le site est forcément honnête et sans arnaque', 'La page se charge deux fois plus vite', "Le site a été validé par l'État"], a: 0,
              fb: [null, "Non ! Un faux site peut lui aussi être en https. Le cadenas protège l'échange, pas contre un menteur.", 'HTTPS ne rend pas la page plus rapide.', "Personne ne « valide » les sites : HTTPS chiffre simplement l'échange."],
              ex: "HTTPS chiffre (crypte) les échanges : personne ne peut les lire en route. Mais un site d'arnaque peut aussi être en https." }
          ] }, done);
        },
        notions: ['url'] },
      { id: 'm5s4', label: 'Inspecter les requêtes HTTP du site (sur ton poste)', target: 'mon_pc',
        run() {
          say([['klervi', "(au téléphone) Ouvre le site de la crêperie dans ton navigateur, avec les <b>outils de développement</b> (F12). L'onglet Réseau montre chaque requête envoyée au serveur. Clique partout !"]], () => browserLab({
            title: '🌐 Navigateur — outils de développement (F12)', site: CREPERIE,
            tasks: [
              { label: 'Clique sur « La carte du jour », puis ouvre sa requête dans l\'onglet Réseau', test: o => o.opened.some(r => r.path === '/carte.php') },
              { label: 'Clique sur « Nos horaires » : quel code le serveur renvoie-t-il ?', test: o => o.log.some(r => r.status === 404) },
              { label: 'Affiche le code source de la page d\'accueil', test: o => o.source.includes('/index.html') }
            ],
            onDone: () => quiz({ title: '📨 Ce que dit l\'onglet Réseau', notion: 'http', questions: [
              { t: 'input', q: 'Dans la requête de la carte du jour, quel est le <b>nom</b> du paramètre passé au serveur ?', a: ['jour'], ph: 'nom du paramètre',
                hint: "Les paramètres sont après le « ? », sous la forme nom=valeur.", ex: "Dans <code>/carte.php?jour=mardi</code>, le paramètre s'appelle <b>jour</b>." },
              { t: 'input', q: 'Et quelle est la <b>valeur</b> de ce paramètre ?', a: ['mardi'], ph: 'valeur',
                ex: "jour=<b>mardi</b> : le serveur s'en sert pour fabriquer la carte du bon jour. Essaie <code>?jour=dimanche</code> dans la barre d'adresse, tu verras !" },
              { q: 'Quelle méthode HTTP le navigateur utilise-t-il pour demander une page ?', c: ['GET', 'POST', 'PING', 'DNS'], a: 0,
                fb: [null, 'POST sert surtout à envoyer un formulaire.', "ping est une commande de test du réseau, pas une méthode HTTP.", "Le DNS est l'annuaire d'Internet, pas une méthode HTTP."],
                ex: '<b>GET</b> veut dire « donne-moi cette page ». <b>POST</b> sert à envoyer des données, par exemple un formulaire.' },
              { q: 'Pour les horaires, le serveur a répondu <b>404 Not Found</b>. Que signifie ce code ?', c: ["La page demandée n'existe pas", 'Le serveur web est complètement éteint', 'Le DNS ne connaît pas ce nom de site', 'La fibre de la crêperie est coupée'], a: 0,
                fb: [null, "Un serveur éteint ne répondrait rien du tout. Ici, il répond… pour dire que la page n'existe pas.", "Le DNS a bien trouvé le serveur, puisque le serveur a répondu.", "Les autres pages du site s'affichent : la connexion fonctionne."],
                ex: "Le lien demande <code>horaires.htm</code>, mais le fichier s'appelle <code>horaires.html</code>. On va corriger ça avec Klervi." }
            ] }, done)
          }));
        },
        notions: ['http'] },
      { id: 'm5s5', label: 'Qui fait quoi ? Le client et le serveur (avec Klervi)', target: 'klervi',
        run() {
          say([
            ['klervi', "Alors, tu as vu ? Le navigateur, c'est le <b>client</b> : il envoie des requêtes. En face, le <b>serveur</b> de la salle des machines répond."],
            ['klervi', "La page d'accueil est un fichier tout prêt. Mais la carte du jour, le serveur la <b>fabrique</b> à chaque requête, avec un programme en PHP. Et le diaporama, lui, c'est du JavaScript, exécuté chez le client."]
          ], () => quiz({ title: '🤝 Client ou serveur ?', notion: 'clientserveur', questions: [
            { t: 'tri', q: 'Qui fait quoi, quand on visite le site de la crêperie ?', cats: ['Le client (navigateur)', 'Le serveur'],
              items: [['Envoyer la requête HTTP', 0], ['Stocker les fichiers du site', 1], ['Fabriquer la carte du jour en PHP', 1], ["Afficher la page à l'écran", 0], ['Exécuter le JavaScript du diaporama', 0], ['Renvoyer le code 404', 1]],
              hint: 'Le serveur stocke, fabrique et répond. Le navigateur demande, affiche et exécute le JavaScript.', ex: "Le serveur stocke ou fabrique les pages ; le client les demande, les affiche et exécute leur JavaScript." },
            { q: "Dans le code source, tu as vu le JavaScript du diaporama, mais jamais le code PHP de la carte. Pourquoi ?", c: ["Le serveur l'exécute et n'envoie que le résultat", 'Le code PHP est chiffré par HTTPS avant de partir', "Le navigateur l'efface tout de suite par sécurité", "Il est caché à l'intérieur de la feuille de style CSS"], a: 0,
              ex: "Le PHP est exécuté sur le <b>serveur</b> : le navigateur ne reçoit que la page HTML fabriquée. Le JavaScript, lui, est envoyé au navigateur, qui l'exécute." },
            { q: "Sur le Web, qui prend l'initiative de l'échange ?", c: ['Le client, en envoyant une requête', 'Le serveur, en envoyant ses pages à tout le monde', 'Le routeur de Brest', 'Le serveur DNS'], a: 0,
              ex: "C'est toujours le client qui demande. Le serveur ne fait que répondre." }
          ] }, done));
        },
        notions: ['clientserveur'] },
      { id: 'm5s6', label: 'Réparer la page dans l\'éditeur de Klervi', target: 'pc_klervi',
        run() {
          htmlEditor({
            title: '🎨 Éditeur de Klervi — index.html et style.css',
            intro: "La page d'accueil de la crêperie. Le <b>HTML</b> (à gauche) décrit le contenu, le <b>CSS</b> (en dessous) décrit le style. L'aperçu se met à jour quand tu tapes.",
            html: '<h1>Crêperie Ar Vag</h1>\n<p>Galettes et crêpes sur le port de Brest depuis 1987.</p>\n<h2>Infos pratiques</h2>\n<p>Ouvert du mardi au dimanche, midi et soir.</p>\n<p><a href="horaires.htm">Nos horaires</a></p>\n',
            css: 'body { font-family: sans-serif; background: #fdf6e3; }\nh1 { color: #1f4e8c; }\np { color: #333333; }\n',
            tasks: [
              { label: 'Corriger le lien « Nos horaires » : il doit mener à <code>horaires.html</code>',
                hint: 'Dans la balise <code>&lt;a href="…"&gt;</code>, remplace horaires.htm par horaires.html.',
                test: d => { const a = [...d.querySelectorAll('a')].map(x => (x.getAttribute('href') || '').trim().replace(/^\//, '')); return a.includes('horaires.html') && !a.includes('horaires.htm'); } },
              { label: 'Ajouter un lien vers la carte du jour : <code>carte.php?jour=mardi</code>',
                hint: 'Ajoute une ligne : <code>&lt;p&gt;&lt;a href="carte.php?jour=mardi"&gt;La carte du jour&lt;/a&gt;&lt;/p&gt;</code>',
                test: d => [...d.querySelectorAll('a')].some(x => /carte\.php/.test(x.getAttribute('href') || '') && x.textContent.trim()) },
              { label: 'Mettre le titre <code>h1</code> en rouge, <b>en modifiant le CSS</b> (pas le HTML)',
                hint: 'Dans le CSS, remplace <code>h1 { color: #1f4e8c; }</code> par <code>h1 { color: red; }</code>.',
                test: (d, w) => { const h = d.querySelector('h1'); if (!h || h.hasAttribute('style') || d.querySelector('font')) return false; const m = w.getComputedStyle(h).color.match(/\d+/g); return !!m && +m[0] >= 150 && +m[1] < 110 && +m[2] < 110; } }
            ],
            onDone: () => quiz({ title: '🎨 Contenu ou style ?', notion: 'html_css', questions: [
              { t: 'tri', q: 'Dans une page web, range chaque élément :', cats: ['Contenu (HTML)', 'Style (CSS)'],
                items: [['Le texte du titre', 0], ['La couleur du titre', 1], ['Un lien vers la carte', 0], ['La police de caractères', 1], ['Une photo de galette', 0], ['La couleur du fond de la page', 1]],
                ex: "Le HTML dit <b>quoi</b> afficher, le CSS dit <b>comment</b> l'afficher." },
              { q: 'Quelle balise HTML crée un lien hypertexte ?', c: ['&lt;a href="…"&gt;', '&lt;h1&gt;', '&lt;p&gt;', '&lt;lien vers="…"&gt;'], a: 0,
                ex: '<code>&lt;a href="adresse"&gt;texte du lien&lt;/a&gt;</code> : href contient l\'URL de la page visée.' }
            ] }, done)
          });
        },
        notions: ['html_css'] },
      { id: 'm5s7', label: 'Faire le point avec Klervi', target: 'klervi',
        run() {
          say([
            ['klervi', "Le patron de la crêperie est ravi : les horaires s'affichent et le titre est aux couleurs de la maison. Kenavo, la page 404 !"],
            ['klervi', "Trois questions, et je te laisse déjeuner."]
          ], () => quiz({ title: '🕸️ Le bilan de Klervi', notion: 'hypertexte', questions: [
            { q: "Quel programme affiche la page web chez l'utilisateur ?", c: ['Le navigateur', 'Le serveur DNS', 'La box', 'Le routeur de Brest'], a: 0, ex: "Le navigateur (Firefox, Chrome, Safari…) reçoit le HTML et le CSS, et affiche la page." },
            { q: 'Qui normalise HTML et CSS pour que les pages s\'affichent partout pareil ?', c: ['Le W3C, un consortium mondial', 'Google, qui possède le Web', 'Le CERN, qui contrôle tous les sites', 'Chaque navigateur, à sa façon'], a: 0, ex: 'Le W3C (World Wide Web Consortium) normalise les formats du Web.' },
            { q: 'Le Web peut se dessiner comme un graphe. Que représentent les flèches ?', c: ['Les liens hypertextes entre pages', 'Les câbles de fibre entre routeurs', 'Les paquets perdus en chemin', 'Les adresses IP des serveurs'], a: 0, ex: 'Chaque page est un sommet, chaque lien hypertexte une flèche : c\'est la toile du Web.' }
          ] }, done));
        } }
    ]
  },

  /* ====================== MISSION 6 (partie 3 : le Web) ====================== */
  {
    id: 'm6', partie: 3, title: 'Chercher, protéger, publier', when: 'Mardi · 14h00 · Brest',
    story: "L'après-midi, les appels changent : on ne te demande plus « pourquoi Internet ne marche pas ? », mais « est-ce que je peux faire confiance à ce que je vois sur le Web ? ». Moteurs de recherche, faux mails, cookies, droit d'auteur : à toi de jouer.",
    goals: ['Comprendre comment un moteur de recherche indexe et classe les pages', 'Mener une analyse critique des résultats d\'un moteur de recherche', "Repérer l'hameçonnage en examinant l'adresse d'un lien", 'Régler les cookies, l\'historique et la confidentialité d\'un navigateur', "Connaître le droit d'auteur, les licences et les enjeux de la publication"],
    onStart() { S.ring = true; },
    steps: [
      { id: 'm6s1', label: 'Décrocher le téléphone (le CDI appelle)', target: 'telephone',
        run() {
          S.ring = false;
          say([
            ['cdi', "Re-bonjour, c'est Mme Quéré, au CDI ! Les 2nde préparent un exposé sur les phares d'Ouessant. Ils tapent « phare Ouessant »…"],
            ['cdi', "… et le premier résultat, c'est une publicité pour des croisières ! Comment un moteur de recherche décide-t-il de l'ordre des résultats ?"],
            ['erwan', "Bonne question. Un moteur commence par <b>indexer</b> les pages : fais-le à la main, sur ton poste, avec quatre pages. Tu comprendras tout."]
          ], done);
        },
        skip() { S.ring = false; } },
      { id: 'm6s2', label: 'Indexer quatre pages à la main (sur ton poste)', target: 'mon_pc',
        run() {
          indexLab({
            title: '🔎 Indexation à la main', notion: 'moteur',
            pages: [
              { id: 'P1', text: "Le phare du Créac'h, à Ouessant, guide les bateaux pendant la tempête." },
              { id: 'P2', text: 'La crêperie Ar Vag sert des crêpes face au port de Brest.' },
              { id: 'P3', text: 'À Ouessant, on mange des crêpes après la visite du phare.' },
              { id: 'P4', text: 'La tempête a coupé la liaison radio entre Brest et Ouessant.' }
            ],
            index: { phare: ['P1', 'P3'], Ouessant: ['P1', 'P3', 'P4'], crêpes: ['P2', 'P3'], tempête: ['P1', 'P4'], Brest: ['P2', 'P4'] },
            query: ['phare', 'Ouessant'],
            onDone: done
          });
        },
        notions: ['moteur'] },
      { id: 'm6s3', label: 'Classer les pages par popularité (avec Soizic)', target: 'soizic',
        run() {
          say([
            ['soizic', "Indexer, c'est bien. Mais quand mille pages contiennent « phare Ouessant », laquelle mettre en premier ?"],
            ['soizic', "Les moteurs regardent la <b>popularité</b> : une page vers laquelle beaucoup d'autres pages font un lien est sans doute intéressante. Regarde ce graphe."]
          ], () => quiz({ title: '🔎 Popularité et classement', notion: 'moteur', wide: true, questions: () => [
            { t: 'input', q: `${POP_GRAPH()}Chaque flèche est un lien hypertexte d'une page vers une autre. Combien de liens <b>arrivent</b> sur la page D (mairie d'Ouessant) ?`, a: ['3', 'trois'], ph: 'un nombre',
              hint: 'Compte uniquement les flèches dont la pointe touche D.', ex: 'A, C et E font un lien vers D : 3 liens entrants.' },
            { t: 'order', q: `${POP_GRAPH()}Classe ces pages de la <b>plus populaire</b> à la <b>moins populaire</b> (nombre de liens reçus) :`, items: ["D · Mairie d'Ouessant", 'E · Office de tourisme', 'A · Encyclopédie'],
              hint: 'Compte les flèches qui arrivent sur chaque page.', ex: 'D reçoit 3 liens, E en reçoit 2, A en reçoit 1. B et C n\'en reçoivent aucun.' },
            { q: `${SERP_HTML}Aucune page ne fait de lien vers B, le site de croisières. Pourquoi apparaît-il en premier ?`, c: ["Il a payé : c'est un lien promotionnel", "C'est la page la plus populaire du Web", 'Le moteur classe les pages par ordre alphabétique', "C'est la page la plus récente sur Ouessant"], a: 0,
              fb: [null, 'Aucun lien ne mène à B : elle n\'est pas populaire du tout.', "« Croisières » ne vient pas en premier dans l'alphabet, et ce n'est pas le critère.", "La date n'explique pas sa place : regarde la petite mention au-dessus du titre."],
              ex: "La mention « Annonce » signale un <b>lien promotionnel</b> : le site a payé pour être vu en premier." },
            { q: 'Pour un exposé, quelle est la meilleure attitude face aux résultats ?', c: ['Comparer plusieurs résultats et vérifier leurs sources', "Prendre le premier résultat, puisque le moteur l'a classé en tête", 'Choisir la page qui contient le plus souvent le mot cherché', 'Ne garder que les annonces, qui sont vérifiées par le moteur'], a: 0,
              ex: "Le classement dépend de la popularité, de la pertinence… et de la publicité. On compare, on vérifie qui a écrit la page." }
          ] }, done));
        },
        notions: ['moteur'] },
      { id: 'm6s4', label: 'Le mail inquiétant de Tanguy (sur ton poste)', target: 'mon_pc',
        onEnter() { S.ring = true; },
        run() {
          S.ring = false;
          say([
            ['tanguy', "Allô ? C'est Tanguy ! J'ai reçu un mail d'IroiseNet : ma ligne va être coupée si je ne mets pas à jour ma carte bancaire tout de suite !"],
            ['erwan', "(à voix basse) IroiseNet n'envoie jamais ce genre de mail. Fais-le-toi transférer et examine le lien… <b>sans cliquer</b>."]
          ], () => mailLab({
            title: '📧 Mail transféré par Tanguy',
            from: 'Service client IroiseNet &lt;support@iroisenet-facture.com&gt;', subject: '⚠️ DERNIER AVIS avant coupure de votre ligne',
            body: "<p>Cher client,</p><p>Suite à un incident de paiement, <b>votre ligne sera coupée sous 24 h</b>. Pour l'éviter, mettez à jour immédiatement votre carte bancaire dans votre espace client :</p><p class=\"mail-link-p\">{lien}</p><p>Cordialement,<br>Le service client IroiseNet</p>",
            linkText: 'https://www.iroisenet.bzh/espace-client', linkReal: 'http://iroisenet-bzh.secure-paiement.ru/login.php',
            onDone: () => quiz({ title: '🎣 Vrai ou faux mail ?', notion: 'hameconnage', questions: [
              { q: 'Vers quel site le lien mène-t-il <b>vraiment</b> ?', c: ['iroisenet-bzh.secure-paiement.ru', 'www.iroisenet.bzh', 'iroisenet-facture.com', 'espace-client.iroisenet-facture.com'], a: 0,
                fb: [null, "C'est le texte affiché, pas la vraie destination du lien !", "C'est l'adresse de l'expéditeur, pas celle du lien.", "Ce site n'apparaît nulle part dans le lien."],
                ex: "Le nom de domaine se lit juste avant le premier « / » : <code>secure-paiement.ru</code>. Rien à voir avec iroisenet.bzh !" },
              { q: 'Comment appelle-t-on cette arnaque ?', c: ["L'hameçonnage", 'Le déni de service', 'Le pair-à-pair', 'La neutralité du Net'], a: 0, ex: "L'hameçonnage (phishing) : un faux mail et une fausse page pour voler des informations." },
              { q: 'Quel conseil donner à Tanguy ?', c: ["Ne pas cliquer, et taper soi-même l'adresse d'IroiseNet", 'Cliquer vite pour éviter la coupure, puis changer de mot de passe', "Répondre au mail pour demander si c'est vraiment IroiseNet", 'Transférer le mail à tous ses contacts pour les prévenir'], a: 0,
                ex: "On ne clique pas, on ne répond pas. Pour vérifier son compte, on tape soi-même l'adresse du vrai site." },
              { q: 'La fausse page de paiement affiche un cadenas (https). Est-elle sûre pour autant ?', c: ['Non, HTTPS chiffre mais ne prouve rien', "Oui, le cadenas prouve que le site est bien celui d'IroiseNet", 'Oui, une page chiffrée ne peut pas être une arnaque', 'Non, le cadenas veut dire que la page est piratée'], a: 0,
                ex: "Le cadenas dit seulement que l'échange est chiffré… avec l'escroc ! C'est le <b>nom de domaine</b> qu'il faut vérifier." }
            ] }, done)
          }));
        },
        notions: ['hameconnage'] },
      { id: 'm6s5', label: 'Régler le navigateur de Nolwenn (sur ton poste)', target: 'mon_pc',
        run() {
          say([
            ['nolwenn', "Bonjour ! Depuis que j'ai cherché des chaussures sur Internet, je vois des pubs de chaussures sur tous les sites. Même sur la météo !"],
            ['nolwenn', "Et je partage l'ordinateur avec mon fils : je ne veux pas qu'il voie mes recherches de cadeaux de Noël. Vous pouvez régler mon navigateur ?"],
            ['moi', "Je prends la main à distance sur votre navigateur. On commence par regarder qui vous piste."]
          ], () => settingsLab({ title: '🍪 Paramètres du navigateur de Nolwenn', onDone: () => quiz({ title: '🍪 Cookies et confidentialité', notion: 'cookies', questions: [
            { q: "Un cookie, c'est…", c: ["Un petit fichier qu'un site dépose chez toi", 'Un virus qui efface le contenu du disque dur', 'Un programme qui accélère la connexion Wi-Fi', "Une publicité qui s'ouvre dans une fenêtre"], a: 0,
              ex: "Un cookie est un petit fichier texte : pratique pour rester connecté ou garder un panier, mais aussi pour pister." },
            { q: 'Pourquoi Nolwenn voyait-elle des pubs de chaussures partout ?', c: ['Des cookies tiers la suivaient de site en site', 'Son ordinateur gardait ses mots de passe en mémoire', 'Le moteur de recherche lisait ses mails chaque matin', 'Le serveur DNS envoyait ses recherches à tous les sites'], a: 0,
              ex: "Les <b>cookies tiers</b> appartiennent à des régies publicitaires présentes sur de nombreux sites : elles reconnaissent Nolwenn partout." },
            { q: 'La navigation privée, que fait-elle vraiment ?', c: ["Elle n'enregistre pas l'historique sur ce poste", 'Elle rend totalement invisible sur Internet', 'Elle cache ton adresse IP à tous les sites', 'Elle empêche ton fournisseur de voir tes requêtes'], a: 0,
              ex: "Elle n'efface les traces que sur l'ordinateur. Les sites visités et ton fournisseur d'accès voient toujours tes requêtes." }
          ] }, done) }));
        },
        notions: ['cookies'] },
      { id: 'm6s6', label: 'Publier sur le site de la crêperie (avec Klervi)', target: 'klervi',
        run() {
          say([
            ['klervi', "Dernier chantier : le patron de la crêperie veut enrichir son site. Il m'a envoyé une liste… et je ne suis pas sûre que tout soit permis."],
            ['klervi', "Une photo du phare trouvée sur Internet, des photos de clients, une musique achetée en ligne… Aide-moi à trier."]
          ], () => quiz({ title: '©️ A-t-on le droit de publier ?', notion: 'juridique', questions: [
            { t: 'tri', q: 'Peut-on publier ces contenus sur le site de la crêperie ?', cats: ['Oui', 'Non (ou pas sans accord)'],
              items: [["Une photo du phare trouvée avec un moteur de recherche d'images", 1], ["Une photo du phare sous licence CC BY, en citant l'auteur", 0], ['Une photo de clients prise en salle, sans leur accord', 1], ['Une photo de galettes prise par le patron lui-même', 0], ['Le logo d\'une grande marque recopié pour décorer la carte', 1]],
              hint: "Qui est l'auteur ? Que dit la licence ? Les personnes photographiées sont-elles d'accord ?", ex: "Une œuvre appartient à son auteur ; une licence comme CC BY autorise la réutilisation en citant l'auteur ; une photo de personnes demande leur accord." },
            { q: 'Une image trouvée sur le Web est-elle libre de droits ?', c: ["Non, son auteur garde le droit d'auteur", 'Oui, tout ce qui est publié en ligne est public', "Oui, si on la recadre ou qu'on change ses couleurs", 'Oui, à condition de la publier sur un site gratuit'], a: 0,
              ex: "Être visible en ligne ne veut pas dire être libre : il faut une licence ou l'accord de l'auteur." },
            { q: "La <b>licence</b> d'une photo ou d'un logiciel, c'est…", c: ["Le texte qui dit ce qu'on a le droit d'en faire", "Le prix qu'il faut payer avant de pouvoir l'acheter", "Le nom de l'auteur, écrit obligatoirement en dessous", 'Le format du fichier, par exemple jpg ou png'], a: 0,
              ex: 'La licence fixe les droits : copier, modifier, partager, vendre… Par exemple, CC BY = réutilisation permise en citant l\'auteur.' },
            { q: 'Le patron a acheté une musique en ligne pour son téléphone. Peut-il la diffuser sur son site ?', c: ['Non, il a acheté un usage privé', "Oui, puisqu'il l'a payée, elle lui appartient", 'Oui, si la musique dure moins de trente secondes', 'Oui, à condition de baisser beaucoup le volume'], a: 0,
              ex: "Il a acheté un <b>droit d'usage</b> (l'écouter lui-même), pas le droit de la diffuser. Une œuvre a une valeur : la diffuser sans accord prive l'auteur de revenus." }
          ] }, () => quiz({ title: "📢 Publier, et pour combien de temps ?", notion: 'publication', questions: [
            { q: "Un vieil article sur la faillite de l'ancien patron (2009) ressort toujours dans les moteurs de recherche. Que peut-il demander ?", c: ["Son déréférencement (droit à l'oubli)", 'Rien, une information publiée en ligne est éternelle', "La coupure d'Internet dans tout le Finistère", 'La suppression de toutes les copies du Web en un clic'], a: 0,
              ex: "Le <b>droit à l'oubli</b> permet de demander au moteur de ne plus afficher le lien. Mais l'article, lui, peut encore exister ailleurs." },
            { q: 'Avant de publier une photo de toi en soirée, que faut-il savoir ?', c: ['Elle peut être copiée et rester en ligne longtemps', 'Elle disparaît automatiquement au bout de 24 heures', 'Seuls tes amis proches pourront la voir, pour toujours', 'Elle sera effacée partout dès que tu fermes ton compte'], a: 0,
              ex: "Une fois publiée, une information peut être copiée, partagée, et rester accessible des années." },
            { q: 'Un site affirme que « les phares d\'Ouessant vont être démolis l\'an prochain ». Que faire avant de le partager ?', c: ["Vérifier la source et chercher d'autres sites sérieux", "Le partager tout de suite, puisque c'est écrit sur le Web", "Le croire, s'il est en tête du moteur de recherche", 'Le partager, si le site a un cadenas https'], a: 0,
              ex: "Sur le Web, ni la qualité ni la véracité ne sont garanties : on vérifie la source avant de croire ou de partager." }
          ] }, done)));
        },
        notions: ['juridique', 'publication'] },
      { id: 'm6s7', label: 'Bilan de fin de stage avec Gwenaëlle', target: 'gwen',
        run() {
          say([
            ['gwen', "{nom}, deux jours de stage, et tu as tenu la hotline, réparé un site et déjoué une arnaque. Chapeau !"],
            ['gwen', "Un tout dernier contrôle sur le Web, et je signe ton rapport de stage."]
          ], () => quiz({ title: '🏁 Le contrôle Web de Gwenaëlle', notion: 'hypertexte', questions: [
            { q: 'Dans <code>https://www.iroisenet.bzh/aide.html</code>, quel est le nom de domaine ?', c: ['www.iroisenet.bzh', 'https', 'aide.html', 'https://www.iroisenet'], a: 0, ex: 'Protocole : https ; nom de domaine : www.iroisenet.bzh ; chemin : /aide.html.' },
            { q: "Qui exécute le code PHP d'un site ?", c: ['Le serveur', 'Le navigateur', 'La box', 'Le DNS'], a: 0, ex: "Le PHP tourne sur le serveur ; le JavaScript, lui, tourne dans le navigateur." },
            { q: 'Le CSS sert à…', c: ['définir le style de la page', 'écrire le contenu de la page', 'envoyer la page au serveur', 'chiffrer les échanges'], a: 0, ex: 'HTML = contenu, CSS = style.' },
            { q: 'Un moteur de recherche classe les pages notamment selon…', c: ['leur popularité et leur pertinence', 'la date de création de chaque site', "le nombre d'images sur chaque page", "l'ordre alphabétique de leur adresse"], a: 0, ex: 'Popularité (liens reçus), pertinence (mots de la requête)… et parfois publicité (liens promotionnels).' },
            { q: 'Un lien affiche « www.iroisenet.bzh ». Que faire avant de cliquer ?', c: ['Survoler le lien pour voir sa vraie adresse', 'Cliquer dessus pour voir où il mène vraiment', 'Faire confiance au texte, qui est vérifié', "Le transférer à un ami pour qu'il teste"], a: 0, ex: "Le texte d'un lien peut cacher une autre adresse : on la vérifie en survolant." }
          ] }, done));
        } }
    ]
  }
];

/* ---------------------------------------------------------------------
   Incidents (tickets de la hotline)
   tools : commandes lancées sur l'ordinateur du client (prise en main à distance)
   --------------------------------------------------------------------- */
const INCIDENTS = [
  { id: 'box_off', title: 'Plus rien à la maison', unlock: 'm2s3', notion: 'diagnostic',
    pick() { return busy('tanguy') ? null : { client: 'tanguy' }; },
    caller: () => 'tanguy', at: () => 'mon_pc',
    call: "Plus d'Internet du tout ! Ni sur mon PC, ni sur ma console. J'ai juste fait le ménage dans mon salon…",
    apply() { S.net.boxOff.tanguy = true; }, revert() { S.net.boxOff.tanguy = false; },
    tools: [['ipconfig', 'ipconfig'], ['ping box', 'ping 192.168.1.1'], ['ping wikipedia.fr', 'ping wikipedia.fr']],
    observe: () => "Tanguy : « Les voyants de la box ? Euh… ils sont tous éteints. »",
    causes: [{ t: "La box n'est plus alimentée", ok: true },
      { t: 'Le serveur DNS est en panne', fb: "Avec un DNS en panne, la box répondrait au ping, et ses voyants seraient allumés." },
      { t: 'La fibre de Brest est coupée', fb: "Les autres clients de Brest n'ont aucun souci, et les voyants de sa box sont éteints." },
      { t: 'Son PC a un virus', fb: 'Sa console est coupée elle aussi : le problème est commun aux deux appareils.' }],
    fixes: [{ t: 'Lui faire rebrancher la box', ok: true },
      { t: 'Lui envoyer une nouvelle box par la poste', fb: 'Trop long, et sans doute inutile : vérifions d\'abord le plus simple.' },
      { t: "Changer l'adresse IP de son ordinateur", fb: "Rien à voir : sans box allumée, aucune adresse ne fonctionnera." }],
    explain: "Toujours commencer par le plus proche : la box est-elle allumée ? Si la box ne répond pas au ping, inutile de chercher plus loin." },

  { id: 'dns_down', title: "Le CDI ne trouve plus les sites", unlock: 'm2s6', exclusive: true, notion: 'dns',
    pick() { return busy('cdi') || ['m2s5', 'm3s3'].includes((curStep() || {}).id) ? null : { client: 'cdi' }; },
    caller: () => 'cdi', at: () => 'mon_pc', fixAt: () => 'baie_dns',
    call: "Au CDI de La Croix Rouge, plus aucun site ne s'ouvre ! « Impossible de trouver l'adresse du serveur », dit le navigateur.",
    apply() { S.net.dnsUp = false; }, revert() { S.net.dnsUp = true; },
    tools: [['ipconfig', 'ipconfig'], ['ping box', 'ping 10.29.4.1'], ['ping 185.15.58.224', 'ping 185.15.58.224'], ['ping wikipedia.fr', 'ping wikipedia.fr'], ['nslookup wikipedia.fr', 'nslookup wikipedia.fr']],
    observe: () => "Mme Quéré : « Le Wi-Fi marche, les élèves voient bien le réseau du lycée. »",
    observeFix: () => "Dans la salle des machines, le serveur DNS d'IroiseNet affiche : <b>service DNS arrêté</b>.",
    causes: [{ t: 'Le serveur DNS ne répond plus', ok: true },
      { t: 'La box du lycée est éteinte', fb: 'La box répond au ping : elle est allumée.' },
      { t: 'Internet est coupé pour le lycée', fb: "Le ping vers l'adresse IP de Wikipédia fonctionne : Internet n'est pas coupé." },
      { t: 'Les ordinateurs du CDI sont trop vieux', fb: 'Par adresse IP, tout fonctionne : le matériel n\'est pas en cause.' }],
    fixes: [{ t: "Redémarrer le service DNS sur le serveur d'IroiseNet", ok: true },
      { t: 'Débrancher le serveur pour toujours', fb: "Plus aucun client ne pourrait trouver un site par son nom !" },
      { t: 'Changer l\'adresse IP de Wikipédia', fb: "On ne choisit pas l'adresse de Wikipédia, et elle n'est pas en cause." }],
    explain: "« Par adresse IP oui, par nom non » : c'est le signe d'une panne de DNS, l'annuaire qui traduit les noms en adresses." },

  { id: 'ntp', title: "L'horloge est en avance", unlock: 'm2s4', notion: 'ntp',
    pick() { return busy('nolwenn') ? null : { client: 'nolwenn' }; },
    caller: () => 'nolwenn', at: () => 'mon_pc',
    call: "L'horloge de mon ordinateur a 7 minutes d'avance… J'ai cru que le live avait commencé sans moi !",
    apply() {}, revert() {},
    tools: [['ipconfig', 'ipconfig'], ['ping ntp.iroisenet.bzh', 'ping ntp.iroisenet.bzh']],
    observe: () => "Dans les réglages de son PC : « Régler l'heure automatiquement : <b>désactivé</b> ».",
    causes: [{ t: "L'heure n'est plus synchronisée", ok: true },
      { t: 'Sa box est en panne', fb: "Sa connexion fonctionne : seule l'heure est fausse." },
      { t: 'Le serveur DNS lui donne une mauvaise heure', fb: "Le DNS traduit des noms en adresses, il ne donne pas l'heure." }],
    fixes: [{ t: "Réactiver la mise à l'heure automatique (NTP)", ok: true },
      { t: 'Changer la pile de sa box Internet', fb: "La box n'a rien à voir avec l'horloge du PC." },
      { t: "Avancer sa montre de 7 minutes pour être d'accord avec le PC", fb: '😄 Ce serait plutôt l\'inverse… et ça ne règle rien.' }],
    explain: "Le protocole NTP, qui s'appuie sur Internet, synchronise l'heure des ordinateurs et des objets connectés avec des serveurs de temps." },

  { id: 'cafe', title: 'Urgence à la machine à café', unlock: 'm2s3', notion: 'diagnostic',
    pick() { return busy('cafe') ? null : {}; },
    caller: () => 'maelys', at: () => 'cafe',
    call: "{nom}, la machine à café affiche une erreur ! Toi qui t'y connais en réseau…",
    apply() {}, revert() {},
    tools: [],
    observe: () => "L'écran affiche : « DÉTARTRAGE NÉCESSAIRE ». La machine n'a <b>ni câble réseau, ni Wi-Fi</b>.",
    causes: [{ t: 'Pas un problème réseau : il faut la détartrer', ok: true },
      { t: 'Elle a perdu son adresse IP depuis la coupure de ce matin', fb: "Elle n'est même pas reliée au réseau…" },
      { t: "Le DNS ne trouve plus l'adresse du café", fb: '😄 Bien essayé.' }],
    fixes: null,
    explain: "Savoir dire « ce n'est pas un problème réseau » fait aussi partie du diagnostic !" },

  { id: 'morlaix', title: 'Toute la ville de Morlaix est coupée', unlock: 'm3s4', exclusive: true, notion: 'limites',
    pick() { return busy('kerbrat') ? null : { client: 'kerbrat' }; },
    caller: () => 'kerbrat', at: () => 'mon_pc', fixAt: () => 'ecran',
    call: "Bonjour, M. Kerbrat, à Morlaix. Plus d'Internet, et mes voisins non plus ! On ne peut plus rien faire.",
    apply() { S.net.routerDown = 'morlaix'; }, revert() { S.net.routerDown = null; },
    tools: [['ipconfig', 'ipconfig'], ['ping box', 'ping 192.168.1.1'], ['ping wikipedia.fr', 'ping 185.15.58.224'], ['tracert wikipedia.fr', 'tracert 185.15.58.224']],
    observe: () => "M. Kerbrat : « Ma box est allumée, tous les voyants sont verts sauf celui marqué Internet. »",
    observeFix: () => "Sur le grand écran de supervision, le routeur de <b>Morlaix</b> clignote en rouge : <b>coupure d'alimentation</b>.",
    causes: [{ t: 'Le routeur de Morlaix est en panne', ok: true },
      { t: 'Sa box est éteinte', fb: 'Sa box répond au ping : elle est allumée.' },
      { t: 'Le DNS est en panne', fb: "Même par adresse IP, rien ne passe : ce n'est pas le DNS." },
      { t: 'Le serveur de Wikipédia est en panne', fb: "Toute la ville est coupée de tous les sites : le problème est plus proche." }],
    fixes: [{ t: 'Envoyer un technicien remettre le routeur en marche', ok: true },
      { t: "Attendre que les autres routeurs trouvent un autre chemin", fb: "Les clients de Morlaix n'ont qu'un seul routeur : il n'existe pas d'autre chemin pour eux." },
      { t: "Changer l'adresse IP de tous les clients", fb: 'Les adresses ne sont pas en cause : un équipement est en panne.' }],
    explain: "Limite du routage : les routeurs contournent une panne s'il existe un autre chemin. Mais si le seul routeur d'une ville tombe, ses clients sont coupés jusqu'à la réparation." },

  { id: 'ddos', title: 'Le site de la mairie ne répond plus', unlock: 'm3s3', notion: 'neutralite',
    pick() { return busy('mairie') ? null : {}; },
    caller: () => 'mairie', at: () => 'ecran',
    call: "Le site de la mairie de Brest est inaccessible depuis ce matin ! Les inscriptions à la cantine ferment ce soir…",
    apply() { S.net.ddos = true; }, revert() { S.net.ddos = false; },
    tools: [],
    observe: () => "Sur la supervision : le serveur <code>mairie-brest.bzh</code> reçoit <b>2 millions de requêtes par seconde</b>, venues de milliers d'appareils inconnus dans le monde entier. D'habitude, c'est 50.",
    causes: [{ t: 'Une attaque par déni de service sature le site', ok: true },
      { t: 'Trop de parents se sont inscrits en même temps', fb: "Brest ne compte pas des millions de parents : ces requêtes viennent du monde entier." },
      { t: 'Le DNS de la mairie est en panne', fb: "Les requêtes arrivent bien au serveur : il est saturé, pas introuvable." }],
    fixes: [{ t: "Filtrer l'attaque et porter plainte", ok: true },
      { t: 'Débrancher Internet dans tout le pays de Brest', fb: "Tout le monde serait coupé : l'attaquant aurait gagné." },
      { t: "Attaquer à leur tour les ordinateurs de l'attaquant", fb: "Se faire justice soi-même est illégal. On filtre, et on porte plainte." }],
    explain: "Un déni de service consiste à envoyer énormément de messages à un site pour le saturer. C'est une des faiblesses d'Internet, et c'est un délit." },

  { id: 'p2p', title: 'Une lettre inquiétante', unlock: 'm3s3', notion: 'p2p',
    pick() { return busy('tanguy') ? null : { client: 'tanguy' }; },
    caller: () => 'tanguy', at: () => 'mon_pc',
    call: "J'ai reçu un courrier qui dit qu'un film a été partagé illégalement depuis ma connexion, avec un logiciel « pair-à-pair ». C'est quoi ?",
    apply() {}, revert() {},
    tools: [],
    observe: () => "Tanguy : « Mon cousin est venu ce week-end. Il a installé un logiciel pour récupérer des films… »",
    causes: [{ t: 'Un logiciel pair-à-pair a partagé un film', ok: true },
      { t: 'IroiseNet a envoyé ce film sur son ordinateur par erreur', fb: "Un fournisseur d'accès transporte les paquets, il ne choisit pas les films." },
      { t: 'Un voisin a piraté sa box pour télécharger', fb: "Possible en théorie, mais le cousin a installé un logiciel de partage ce week-end…" }],
    fixes: [{ t: "Lui expliquer que le pair-à-pair est légal, mais pas pour partager des œuvres sans l'accord des auteurs", ok: true },
      { t: 'Lui dire que le pair-à-pair est interdit dans tous les cas, sans exception', fb: "Faux : il sert aussi à des usages légaux (mises à jour de jeux, logiciels libres)." },
      { t: "Lui dire que ce courrier est forcément une arnaque et qu'il peut le jeter", fb: "Ce type de courrier existe bel et bien : partager une œuvre sans l'accord de l'auteur est interdit." }],
    explain: "En pair-à-pair, chaque ordinateur reçoit ET envoie. Récupérer un film, c'est donc aussi le partager. Le pair-à-pair est utile et légal, mais pas pour diffuser des œuvres sans autorisation." },

  { id: 'neutre', title: "Une idée du service commercial", unlock: 'm3s3', notion: 'neutralite',
    pick() { return busy('gwen') ? null : {}; },
    caller: () => 'gwen', at: () => 'gwen',
    call: "{nom}, le service commercial propose de ralentir les vidéos d'une plateforme concurrente sur notre réseau. Viens me donner ton avis !",
    apply() {}, revert() {},
    tools: [],
    observe: () => "Gwenaëlle : « Techniquement, nos routeurs sauraient trier les paquets selon leur contenu… Mais a-t-on le droit ? »",
    causes: [{ t: "Ce serait contraire à la neutralité du Net", ok: true },
      { t: "Bonne idée : chaque opérateur choisit ce qu'il fait passer", fb: "La neutralité du Net dit l'inverse : les paquets sont transmis quel que soit leur contenu." },
      { t: 'Impossible : les routeurs ne voient pas les paquets', fb: "Les routeurs voient passer tous les paquets : la question est de savoir s'ils doivent les traiter différemment." }],
    fixes: null,
    explain: "Neutralité du Net : les routeurs transmettent les paquets indépendamment de leur contenu (texte, vidéo, jeu). Ce principe date de l'origine d'Internet, mais certains industriels le remettent régulièrement en cause." },

  { id: 'ouessant', title: 'La visio rame à Ouessant', unlock: 'm4s2', notion: 'physique',
    pick() { return busy('annaig') ? null : { client: 'annaig' }; },
    caller: () => 'annaig', at: () => 'mon_pc',
    call: "Allô ? Ici Annaïg, à Ouessant. Ma visio avec ma sœur saccade sans arrêt… mais mes mails partent très bien !",
    apply() {}, revert() {},
    tools: [['ipconfig', 'ipconfig'], ['ping box', 'ping 192.168.1.1'], ['ping iroisenet.bzh', 'ping iroisenet.bzh'], ['tracert iroisenet.bzh', 'tracert iroisenet.bzh']],
    observe: () => "Sur la carte de Soizic : l'île est reliée au continent par une <b>liaison radio</b>, plus lente que la fibre, et en ce moment perturbée par la tempête.",
    causes: [{ t: "La liaison radio de l'île est lente", ok: true },
      { t: "Le serveur DNS ne connaît pas les adresses de l'île", fb: "Tous les noms sont bien traduits : les mails partent." },
      { t: 'Sa box est éteinte', fb: 'La box répond au ping : elle est allumée.' }],
    fixes: [{ t: 'Expliquer, et couper la caméra pour alléger', ok: true },
      { t: "Lui conseiller de passer en Bluetooth jusqu'au continent", fb: "Le Bluetooth ne porte qu'à quelques mètres : il ne traversera pas la mer d'Iroise !" },
      { t: "Redémarrer le serveur DNS d'IroiseNet", fb: "Le DNS fonctionne : le problème vient du réseau physique." }],
    explain: "Les mails supportent d'arriver avec un peu de retard, pas la visio. Sur un réseau physique lent et irrégulier, l'absence de garantie temporelle se voit tout de suite." },

  { id: 'wifi_cle', title: 'La tablette refuse le Wi-Fi', unlock: 'm2s3', notion: 'box',
    pick() { return busy('nolwenn') ? null : { client: 'nolwenn' }; },
    caller: () => 'nolwenn', at: () => 'mon_pc',
    call: "Ma nouvelle tablette ne veut pas se connecter au Wi-Fi ! Mon PC, lui, marche très bien.",
    tools: [['ipconfig', 'ipconfig'], ['ping box', 'ping 192.168.1.1'], ['ping wikipedia.fr', 'ping wikipedia.fr']],
    observe: () => "Sur la tablette, le message dit : « <b>Mot de passe incorrect</b> ». Nolwenn : « J'ai tapé le code de la box… enfin, je crois. »",
    causes: [{ t: 'La clé Wi-Fi a été mal saisie', ok: true },
      { t: 'La box est éteinte', fb: 'Son PC est connecté et la box répond au ping : elle est allumée.' },
      { t: 'Le serveur DNS est en panne', fb: 'Son PC trouve wikipedia.fr sans problème : le DNS fonctionne.' },
      { t: 'La fibre du quartier est coupée', fb: 'Son PC accède à Internet : la fibre fonctionne.' }],
    fixes: [{ t: "Lui faire retaper la clé Wi-Fi, écrite sur l'étiquette de la box", ok: true },
      { t: 'Supprimer la clé Wi-Fi pour que tout le monde se connecte', fb: "Sans clé, n'importe quel voisin pourrait utiliser sa connexion !" },
      { t: "Changer l'adresse IP de la box", fb: "L'adresse de la box n'y est pour rien : la tablette est refusée à cause de la clé." }],
    explain: "La clé Wi-Fi protège le réseau de la maison : sans la bonne clé, un appareil est refusé. C'est aussi ce qui empêche un voisin de s'y connecter." },

  /* tickets « quiz » : un collègue vérifie une notion (3 questions tirées au hasard dans la banque) */
  { id: 'quiz_physique', quiz: true, max: 3, title: 'Révision : réseaux et histoire', unlock: 'm2s3', notion: 'physique',
    pick() { return busy('loic') ? null : {}; },
    caller: () => 'loic', at: () => 'loic',
    call: "{nom}, tu as deux minutes ? Je range l'établi et je vérifie que tu as retenu l'essentiel sur les réseaux.",
    bank: [
      { q: 'Lequel de ces réseaux est <b>sans fil</b> ?', c: ['Fibre optique', 'Ethernet', 'Wi-Fi', 'ADSL'], a: 2, ex: 'Le Wi-Fi utilise des ondes radio, comme la 4G, la 5G ou le Bluetooth.' },
      { q: 'Lequel de ces réseaux est <b>obsolète</b> ?', c: ['Modem 56k', 'Fibre optique', '5G', 'Wi-Fi'], a: 0, ex: 'Le modem 56k passait par la ligne téléphonique : très lent, il a disparu.' },
      { q: 'Quel réseau physique est le <b>plus rapide</b> ?', c: ['Fibre optique', 'Ligne téléphonique 56k', 'Bluetooth', 'ADSL'], a: 0, ex: 'La fibre transporte la lumière dans du verre : c\'est aujourd\'hui le plus rapide.' },
      { q: 'En quelle année naît Internet, quand tous les réseaux adoptent TCP/IP ?', c: ['1983', '1950', '1971', '2001'], a: 0, ex: 'En 1983, ArpaNet et les autres réseaux adoptent le même protocole : TCP/IP.' },
      { q: 'Comment s\'appelait le réseau français des années 1970 qui a inventé les paquets indépendants ?', c: ['Cyclades', 'ArpaNet', 'Minitel', 'Ethernet'], a: 0, ex: 'Cyclades, en France, et ArpaNet, aux États-Unis, sont les ancêtres d\'Internet.' },
      { q: 'Internet fonctionne-t-il seulement avec la fibre ?', c: ['Non, il marche sur tout type de réseau physique', 'Oui, ses protocoles exigent obligatoirement de la fibre', 'Oui, sauf sur les îles', 'Non, uniquement en Wi-Fi'], a: 0, ex: 'Internet est logiciel : ses protocoles fonctionnent sur la fibre, le cuivre, la radio…' }
    ] },

  { id: 'quiz_ip', quiz: true, max: 3, title: 'Révision : adresses IP', unlock: 'm2s3', notion: 'ip',
    pick() { return busy('erwan') ? null : {}; },
    caller: () => 'erwan', at: () => 'erwan',
    call: "{nom}, petit test avant le prochain appel : à la hotline, on parle adresses IP toute la journée !",
    bank: [
      { q: 'Laquelle de ces adresses IPv4 est <b>valide</b> ?', c: ['192.168.1.300', '10.0.0.12', '172.16.4', '192.168.1.1.5'], a: 1, ex: 'Une adresse IPv4, ce sont 4 nombres de 0 à 255. 300 est trop grand, et il faut exactement 4 nombres.' },
      { q: "Quelle commande affiche l'adresse IP de ton ordinateur sous Windows ?", c: ['ping', 'nslookup', 'ipconfig', 'tracert'], a: 2, ex: 'ipconfig affiche l\'adresse IP, la passerelle et le serveur DNS.' },
      { q: 'Dans une maison, quel appareil sert de <b>passerelle</b> vers Internet ?', c: ['La box', 'Le PC du salon', 'Le serveur DNS', 'La console'], a: 0, ex: 'La box est un routeur : elle relie le réseau de la maison à Internet.' },
      { q: 'Combien de nombres compte une adresse IPv4 ?', c: ['2', '4', '6', '8'], a: 1, ex: 'Quatre nombres de 0 à 255, séparés par des points : 192.168.1.23.' },
      { q: 'Une adresse IP sert à…', c: ['identifier un appareil sur le réseau', 'traduire un nom de site en adresse', "donner l'heure aux ordinateurs", 'chiffrer les mots de passe du Wi-Fi'], a: 0, ex: "Comme une adresse postale, l'adresse IP indique à qui livrer les paquets." },
      { q: 'Que signifie <b>IP</b> ?', c: ['Internet Protocol', 'Internal Password', 'Information Publique', 'Interface de Partage'], a: 0, ex: 'IP, pour Internet Protocol : le protocole qui adresse et achemine les paquets.' }
    ] },

  { id: 'quiz_dns', quiz: true, max: 3, title: "Révision : l'annuaire DNS", unlock: 'm2s6', notion: 'dns',
    pick() { return busy('maelys') ? null : {}; },
    caller: () => 'maelys', at: () => 'maelys',
    call: "{nom}, les clients me posent sans arrêt des questions sur le DNS. Voyons si tu saurais leur répondre !",
    bank: [
      { q: 'Que fait le DNS ?', c: ['Il traduit un nom de site en adresse IP', 'Il donne une adresse IP à chaque box', 'Il remet les paquets dans le bon ordre', 'Il bloque tous les sites dangereux'], a: 0, ex: "Le DNS est l'annuaire d'Internet : nom ↔ adresse IP." },
      { q: "Un site s'ouvre avec son adresse IP, mais pas avec son nom. Quel service est en panne ?", c: ['Le DNS', 'La box', 'Le câble', 'Le site'], a: 0, ex: "Par adresse IP oui, par nom non : c'est le DNS qui ne traduit plus." },
      { q: 'Quelle commande interroge le DNS ?', c: ['ipconfig', 'nslookup', 'ping', 'tracert'], a: 1, ex: 'nslookup wikipedia.fr donne l\'adresse IP ; nslookup suivi d\'une adresse donne le nom.' },
      { q: '<code>nslookup 203.0.113.80</code> répond « lycee-lacroixrouge.bzh ». Dans quel sens as-tu utilisé le DNS ?', c: ["de l'adresse IP vers le nom", "du nom de domaine vers l'adresse IP", 'de la box vers le serveur', 'du serveur vers la box'], a: 0, ex: "Le DNS fonctionne dans les deux sens : nom → adresse, et adresse → nom." },
      { q: 'Le DNS est assuré par…', c: ['un seul ordinateur géant caché aux États-Unis', 'de nombreux serveurs répartis dans le monde', 'la box de chaque maison', 'le navigateur web'], a: 1, ex: 'Un grand nombre de serveurs DNS, répartis sur le réseau, sont mis à jour en permanence.' },
      { q: 'Pourquoi utilise-t-on des noms comme wikipedia.fr plutôt que des adresses IP ?', c: ['Ils sont plus faciles à retenir', 'Ils rendent la connexion plus rapide', 'Ils protègent contre les virus', 'Ils sont obligatoires en France'], a: 0, ex: 'Les humains retiennent les noms, les machines utilisent les adresses : le DNS fait le lien.' }
    ] },

  { id: 'quiz_routage', quiz: true, max: 3, title: 'Révision : le routage', unlock: 'm4s1', notion: 'routage',
    pick() { return busy('soizic') ? null : {}; },
    caller: () => 'soizic', at: () => 'soizic',
    call: "{nom}, viens voir la supervision ! Je vérifie que tu sais comment voyagent nos paquets.",
    bank: [
      { q: "Un routeur connaît-il le chemin complet jusqu'au destinataire ?", c: ['Non, seulement le prochain routeur voisin', 'Oui, il possède la carte complète de tout Internet', 'Oui, mais seulement pour la France', "Non, c'est la box qui le connaît"], a: 0, ex: 'Chaque routeur n\'a qu\'une carte locale : il envoie le paquet au voisin le mieux placé.' },
      { q: "Que se passe-t-il quand le compteur de sauts d'un paquet arrive à 0 ?", c: ['Le paquet est détruit', 'Le paquet repart au début', 'Le paquet est livré quand même', 'Le compteur repart à 30'], a: 0, ex: 'Le paquet est détruit, pour ne pas encombrer le réseau.' },
      { q: 'La fibre entre Morlaix et Rennes est coupée. Que font les routeurs ?', c: ['Ils trouvent un autre chemin', 'Ils arrêtent tout le trafic', 'Ils attendent la réparation', "Ils renvoient les paquets à l'émetteur"], a: 0, ex: 'Les tables de routage s\'ajustent : les paquets passent par Quimper et Nantes.' },
      { q: 'Quelle commande affiche la liste des routeurs traversés ?', c: ['tracert', 'ipconfig', 'nslookup', 'ping'], a: 0, ex: 'tracert affiche chaque routeur traversé jusqu\'au destinataire.' },
      { q: 'Comment un routeur choisit-il où envoyer un paquet ?', c: ['Il consulte sa table de routage', 'Il demande au serveur DNS', 'Il tire un voisin au hasard', 'Il suit le câble le plus long'], a: 0, ex: 'La table de routage indique, pour chaque destination, le voisin à qui passer le paquet.' },
      { q: 'Pourquoi chaque paquet a-t-il un compteur de sauts ?', c: ['Pour ne pas tourner en rond sans fin', 'Pour mesurer la vitesse de la fibre', "Pour compter les clients d'IroiseNet", 'Pour savoir quand le paquet est parti'], a: 0, ex: 'Un paquet qui tourne en rond finit détruit au lieu d\'encombrer le réseau.' }
    ] },

  { id: 'quiz_tcp', quiz: true, max: 3, title: 'Révision : IP et TCP', unlock: 'm4s2', notion: 'tcp',
    pick() { return busy('erwan') ? null : {}; },
    caller: () => 'erwan', at: () => 'erwan',
    call: "{nom}, IP ou TCP ? Les clients confondent toujours. Et toi ?",
    bank: [
      { q: 'Quel protocole remet les paquets dans le bon ordre ?', c: ['TCP', 'IP', 'DNS', 'NTP'], a: 0, ex: 'TCP numérote les paquets, les remet dans l\'ordre et redemande ceux qui manquent.' },
      { q: 'Quel protocole donne une adresse à chaque machine et achemine les paquets ?', c: ['IP', 'TCP', 'DNS', 'HTTP'], a: 0, ex: 'IP adresse et achemine ; TCP fiabilise.' },
      { q: 'Un paquet est perdu en route. Que fait TCP ?', c: ["Il le redemande à l'émetteur", 'Il le recrée seul', 'Il annule tout le message', 'Il prévient le serveur DNS'], a: 0, ex: 'Avec TCP, un paquet manquant est redemandé : le message finit par arriver complet.' },
      { q: 'Pourquoi une visio peut-elle saccader alors que la connexion est fiable ?', c: ["Rien ne garantit l'heure d'arrivée des paquets", 'TCP détruit toujours en premier les paquets de vidéo', "Les vidéos n'utilisent jamais de paquets", 'Le DNS ralentit les appels vidéo le soir'], a: 0, ex: "Fiable ne veut pas dire « à l'heure » : c'est l'absence de garantie temporelle." },
      { q: 'Pour envoyer une page web, TCP…', c: ['découpe et numérote les paquets', 'choisit à chaque routeur le chemin des paquets', 'traduit le nom du site', "donne l'heure aux ordinateurs"], a: 0, ex: 'Le chemin, ce sont les routeurs (IP) ; TCP s\'occupe de l\'ordre et des paquets manquants.' },
      { q: "Pendant un appel vidéo, que vaut-il mieux faire d'un paquet très en retard ?", c: ['Le laisser tomber et continuer', "Bloquer toute la conversation pour l'attendre", "Recommencer l'appel du début", "Le renvoyer à l'émetteur"], a: 0, ex: 'Mieux vaut perdre une image que perdre le fil de la conversation.' }
    ] },

  { id: 'quiz_usages', quiz: true, max: 3, title: "Révision : règles et usages d'Internet", unlock: 'm4s3', notion: 'neutralite',
    pick() { return busy('maelys') ? null : {}; },
    caller: () => 'maelys', at: () => 'maelys',
    call: "{nom}, pair-à-pair, neutralité du Net, déni de service… les clients posent aussi ces questions-là !",
    bank: [
      { q: 'Dans un réseau pair-à-pair…', c: ['chaque ordinateur envoie et reçoit', 'un seul serveur central distribue tous les fichiers', 'seule la box peut envoyer', 'il faut un câble entre chaque PC'], a: 0, ex: "Pas de serveur central : chaque pair reçoit ET envoie." },
      { q: "Partager un film récent en pair-à-pair, sans l'accord de ses auteurs, c'est…", c: ['interdit', 'autorisé', 'obligatoire', 'conseillé'], a: 0, ex: "Le droit d'auteur l'interdit, même si le pair-à-pair lui-même est légal." },
      { q: 'Lequel de ces usages du pair-à-pair est <b>légal</b> ?', c: ["Télécharger la mise à jour d'un jeu", 'Partager une série', 'Diffuser un album piraté', 'Recopier un film vu au cinéma'], a: 0, ex: 'Mises à jour de jeux, logiciels libres : le pair-à-pair a des usages légaux.' },
      { q: 'La neutralité du Net signifie que…', c: ['les paquets passent quel que soit leur contenu', 'les vidéos passent avant les e-mails', "chaque opérateur choisit librement les sites qu'il préfère ralentir", "Internet n'appartient à aucun pays"], a: 0, ex: 'Les routeurs transmettent les paquets sans tenir compte de leur contenu.' },
      { q: "Un déni de service, c'est…", c: ['saturer un site avec énormément de messages', "refuser de payer son abonnement Internet à l'opérateur", "couper le Wi-Fi d'un voisin", 'oublier de redémarrer sa box'], a: 0, ex: 'Des milliers de machines envoient des messages pour rendre un site inaccessible : c\'est un délit.' },
      { q: 'Le site de la mairie subit un déni de service. Que faut-il faire ?', c: ["Filtrer l'attaque et porter plainte", "Attaquer l'attaquant à son tour", 'Fermer Internet dans toute la ville', 'Ne rien faire, ça passera'], a: 0, ex: "On se protège et on porte plainte : se faire justice soi-même est illégal." }
    ] },

  /* ---- partie 3 : le Web ---- */
  { id: 'web_404', title: 'La page de la piscine est introuvable', unlock: 'm5s5', notion: 'http',
    pick() { return busy('kerbrat') || S.net.ddos || S.net.routerDown ? null : { client: 'kerbrat' }; },
    caller: () => 'kerbrat', at: () => 'mon_pc',
    call: "Je veux les horaires de la piscine sur le site de la mairie, mais j'ai une page blanche avec « 404 Not Found ». Internet est en panne ?",
    tools: [['ping mairie-brest.bzh', 'ping mairie-brest.bzh'], ['nslookup mairie-brest.bzh', 'nslookup mairie-brest.bzh'], ['ping wikipedia.fr', 'ping wikipedia.fr']],
    observe: () => "Dans la barre d'adresse de M. Kerbrat : <code>https://mairie-brest.bzh/horaires-pisicne.html</code>",
    causes: [{ t: "L'adresse de la page contient une faute : la page n'existe pas", ok: true },
      { t: 'Le serveur DNS est en panne', fb: 'nslookup trouve bien mairie-brest.bzh : le DNS fonctionne.' },
      { t: 'Le serveur de la mairie est éteint', fb: "Le serveur répond au ping, et il a même renvoyé une page d'erreur : il est allumé." },
      { t: 'La box de M. Kerbrat est débranchée', fb: 'Il accède à wikipedia.fr : sa connexion fonctionne.' }],
    fixes: [{ t: "Corriger l'adresse : « piscine » et non « pisicne »", ok: true },
      { t: 'Redémarrer le serveur de la mairie', fb: 'Le serveur fonctionne : il a répondu 404, ce qui veut dire « je n\'ai pas cette page ».' },
      { t: 'Changer le serveur DNS de M. Kerbrat', fb: 'Le DNS a bien trouvé le serveur : le problème est dans le chemin de la page.' }],
    explain: "404 est un <b>code de réponse HTTP</b> : le serveur répond bien, mais la page demandée n'existe pas à cette adresse. On vérifie toujours l'URL." },

  { id: 'form_http', title: 'Payer sur une page « non sécurisée » ?', unlock: 'm5s4', notion: 'url',
    pick() { return busy('legall') ? null : {}; },
    caller: () => 'legall', at: () => 'mon_pc',
    call: "Je commande des croquettes pour mon chat sur Internet. Le site me demande ma carte bancaire, mais le navigateur écrit « Non sécurisé ». C'est grave ?",
    observe: () => "Dans la barre d'adresse : <code>http://croquettes-du-port.bzh/paiement</code>, sans cadenas, avec la mention « Non sécurisé ».",
    causes: [{ t: 'La page est en http : les échanges ne sont pas chiffrés', ok: true },
      { t: 'Sa box est mal branchée', fb: 'La page s\'affiche : la connexion fonctionne. Le message parle de la sécurité de la page.' },
      { t: 'Le serveur DNS est en panne', fb: 'Le site a été trouvé et s\'affiche : le DNS fonctionne.' },
      { t: 'Son ordinateur a un virus', fb: "Rien ne l'indique : le navigateur signale simplement que la page n'utilise pas https." }],
    fixes: [{ t: 'Lui conseiller de ne pas payer sur une page en http', ok: true },
      { t: "Désactiver l'avertissement du navigateur", fb: "L'avertissement a raison : sans https, le numéro de carte circulerait en clair." },
      { t: "Payer quand même, le site a l'air sérieux", fb: "Sans https, n'importe qui sur le chemin des paquets pourrait lire le numéro de carte." }],
    explain: "Une page qui demande un mot de passe ou une carte bancaire doit être en <b>https</b> (cadenas). En http, les échanges circulent en clair." },

  { id: 'quiz_web', quiz: true, max: 3, title: 'Révision : histoire du Web et URL', unlock: 'm5s3', notion: 'web_histoire',
    pick() { return busy('klervi') ? null : {}; },
    caller: () => 'klervi', at: () => 'klervi',
    call: "{nom}, une petite révision ? Les clients me posent souvent ces questions sur le Web.",
    bank: [
      { q: 'Qui a créé le Web, en 1989 au CERN ?', c: ['Tim Berners-Lee', 'Ted Nelson', 'Bill Gates', 'Steve Jobs, chez Apple'], a: 0, ex: "Tim Berners-Lee, au CERN. Ted Nelson avait inventé l'hypertexte en 1965." },
      { q: "Qu'a inventé Ted Nelson en 1965 ?", c: ["L'hypertexte", 'Le protocole TCP/IP', 'Le premier navigateur', 'Le langage PHP'], a: 0, ex: "Le concept d'hypertexte : un texte avec des renvois vers d'autres contenus." },
      { q: 'Comment s\'appelait le premier navigateur grand public (1993) ?', c: ['Mosaic', 'Firefox', 'Cyclades', 'ArpaNet'], a: 0, ex: 'Mosaic, en 1993, quand le Web passe dans le domaine public.' },
      { q: 'Dans <code>http://meteo-iroise.bzh/vent.html</code>, quel est le protocole ?', c: ['http', 'meteo-iroise.bzh', 'vent.html', 'bzh'], a: 0, ex: 'Le protocole est avant « :// ». Ici http : la page n\'est pas sécurisée.' },
      { q: 'Quelle adresse correspond à une page sécurisée ?', c: ['https://ent.lycee-lacroixrouge.bzh', 'http://ent.lycee-lacroixrouge.bzh', 'http://secure.lycee-lacroixrouge.bzh', 'http://ent-https.lycee-lacroixrouge.bzh'], a: 0, ex: 'Seul le protocole https, au tout début, signale une page sécurisée.' },
      { q: 'En 1995, quels langages permettent des sites interactifs et dynamiques ?', c: ['JavaScript et PHP', 'HTML et CSS', 'Python et Scratch Junior', 'DNS et NTP'], a: 0, ex: 'JavaScript (interactif, côté client) et PHP (dynamique, côté serveur).' }
    ] },

  { id: 'quiz_clientserveur', quiz: true, max: 3, title: 'Révision : requêtes HTTP', unlock: 'm5s5', notion: 'http',
    pick() { return busy('soizic') ? null : {}; },
    caller: () => 'soizic', at: () => 'soizic',
    call: "{nom}, sur mon écran je vois passer des milliers de requêtes HTTP. Tu sais les lire ?",
    bank: [
      { q: 'Dans <code>GET /meteo.php?ville=brest&amp;jour=lundi</code>, combien de paramètres sont passés ?', c: ['2', '1', '3', '0'], a: 0, ex: 'ville=brest et jour=lundi : deux paramètres, séparés par &amp;.' },
      { q: 'Dans <code>GET /recherche.php?mot=phare</code>, quelle est la valeur du paramètre ?', c: ['phare', 'mot', 'recherche.php', 'GET'], a: 0, ex: 'Le paramètre s\'appelle mot et vaut phare.' },
      { q: 'Le code de réponse <b>200</b> signifie…', c: ['OK, voici la page', "La page n'existe pas", 'Erreur du serveur', 'Accès interdit'], a: 0, ex: '200 = OK. 404 = page introuvable. 500 = erreur du serveur.' },
      { q: 'Quel programme envoie les requêtes HTTP ?', c: ['Le navigateur (client)', 'Le serveur web', 'Le routeur de Brest', 'Le serveur de temps (NTP)'], a: 0, ex: "Le client prend toujours l'initiative : il envoie la requête, le serveur répond." },
      { q: 'Où est exécuté le JavaScript d\'une page web ?', c: ['Dans le navigateur', 'Sur le serveur', 'Dans la box', 'Dans le serveur DNS'], a: 0, ex: 'Le JavaScript est envoyé avec la page et exécuté par le navigateur, sur ton ordinateur.' },
      { q: 'Une page de résultats de recherche est différente pour chaque requête. Elle est…', c: ['fabriquée par le serveur à la demande', 'stockée à l\'avance dans un fichier HTML', 'écrite par le navigateur seul', 'envoyée par le serveur DNS'], a: 0, ex: 'Le serveur la crée dynamiquement (en PHP par exemple) selon les paramètres reçus.' }
    ] },

  { id: 'quiz_html', quiz: true, max: 3, title: 'Révision : HTML et CSS', unlock: 'm5s6', notion: 'html_css',
    pick() { return busy('klervi') ? null : {}; },
    caller: () => 'klervi', at: () => 'pc_klervi',
    call: "{nom}, viens voir mon écran : petit test de HTML et de CSS !",
    bank: [
      { q: 'Quelle balise HTML sert au titre principal d\'une page ?', c: ['&lt;h1&gt;', '&lt;p&gt;', '&lt;a&gt;', '&lt;img&gt;'], a: 0, ex: '&lt;h1&gt; est le titre principal, &lt;h2&gt; un sous-titre.' },
      { q: 'Quelle ligne CSS met tous les paragraphes en bleu ?', c: ['p { color: blue; }', '&lt;p color="blue"&gt;', 'paragraphe = bleu partout', 'color: p blue;'], a: 0, ex: 'Sélecteur (p), puis entre accolades la propriété et sa valeur.' },
      { q: 'Dans <code>&lt;a href="carte.html"&gt;Menu&lt;/a&gt;</code>, que voit le visiteur ?', c: ['Le mot « Menu », cliquable', 'Le mot « carte.html »', 'Une image de menu', 'Rien, le lien est invisible'], a: 0, ex: 'Le texte entre les balises est affiché ; href contient la page visée.' },
      { q: 'On veut changer la couleur de fond de tout le site. On modifie…', c: ['le CSS', 'le HTML de chaque page', 'le serveur DNS', "l'adresse IP du serveur"], a: 0, ex: 'Le style est dans le CSS : une seule ligne change tout le site.' },
      { q: 'Quelle information relève du <b>contenu</b> (HTML) ?', c: ['Le texte de la carte des crêpes', 'La couleur du titre', 'La taille des caractères', 'La marge laissée autour de chaque image'], a: 0, ex: 'Le texte est du contenu ; couleur, taille et marges sont du style (CSS).' },
      { q: 'Quelle balise insère une image ?', c: ['&lt;img src="galette.jpg"&gt;', '&lt;a href="galette.jpg"&gt;', '&lt;h1&gt;galette.jpg&lt;/h1&gt;', '&lt;image-css&gt;galette.jpg&lt;/image-css&gt;'], a: 0, ex: '&lt;img&gt; affiche l\'image dont l\'adresse est dans src.' }
    ] },

  { id: 'quiz_moteur', quiz: true, max: 3, title: 'Révision : moteurs de recherche', unlock: 'm6s3', notion: 'moteur',
    pick() { return busy('maelys') ? null : {}; },
    caller: () => 'maelys', at: () => 'maelys',
    call: "{nom}, une cliente me demande comment marche un moteur de recherche. Aide-moi à préparer ma réponse !",
    bank: [
      { q: 'Que font les robots d\'un moteur de recherche ?', c: ['Ils parcourent le Web en suivant les liens', 'Ils écrivent les pages des sites', 'Ils réparent les liens cassés', 'Ils bloquent tous les sites dangereux pour les enfants'], a: 0, ex: 'Les robots collectent les pages en suivant les liens, de page en page.' },
      { q: "L'annuaire inversé associe à chaque mot…", c: ['la liste des pages qui le contiennent', 'sa définition dans le dictionnaire', "l'adresse IP de son auteur", 'le nombre de fois où les internautes le cherchent'], a: 0, ex: 'Mot → liste des URL des pages où il apparaît : c\'est l\'index.' },
      { q: "La popularité d'une page dépend surtout…", c: ['des liens qui mènent vers elle', 'de sa couleur de fond', 'de la longueur de son adresse', "du nombre de photos et de vidéos qu'elle contient"], a: 0, ex: 'Une page vers laquelle beaucoup de pages font un lien est jugée populaire.' },
      { q: 'Un résultat marqué « Annonce » est…', c: ['un lien promotionnel payé', 'le résultat le plus fiable', 'une page officielle de l\'État', 'une page vérifiée par le moteur'], a: 0, ex: "Le site a payé pour apparaître : ce n'est pas un gage de qualité." },
      { q: 'Pourquoi deux moteurs donnent-ils des résultats différents ?', c: ['Ils indexent et classent chacun à leur façon', 'Un des deux est forcément en panne', 'Internet change de forme selon le moteur', 'Ils ne cherchent pas du tout sur le même Internet'], a: 0, ex: 'Chaque moteur a ses robots, son index et ses critères de classement.' },
      { q: 'Certains moteurs de recherche promettent…', c: ['de ne pas garder de traces de tes recherches', "d'effacer du Web toutes les pages qui te déplaisent", 'de vérifier que tout est vrai', 'de fonctionner sans Internet'], a: 0, ex: 'Ils s\'engagent à ne pas conserver tes recherches. À comparer avant de choisir !' }
    ] },

  { id: 'quiz_securite', quiz: true, max: 3, title: 'Révision : naviguer en sécurité', unlock: 'm6s5', notion: 'cookies',
    pick() { return busy('erwan') ? null : {}; },
    caller: () => 'erwan', at: () => 'erwan',
    call: "{nom}, après le mail de Tanguy, on révise la sécurité. Prêt(e) ?",
    bank: [
      { q: 'Quel réglage limite le pistage publicitaire de site en site ?', c: ['Bloquer les cookies tiers', 'Agrandir la taille du texte', 'Changer de fond d\'écran', 'Utiliser le Wi-Fi plutôt que la 4G'], a: 0, ex: 'Les cookies tiers servent à suivre ta navigation sur de nombreux sites.' },
      { q: 'Un site inconnu veut accéder à ta position. Que régler ?', c: ['Demander l\'autorisation à chaque fois', 'Toujours autoriser, pour gagner du temps', 'Désactiver le Wi-Fi de la maison', 'Effacer ses mots de passe'], a: 0, ex: 'On garde la main sur l\'accès à la caméra, au micro et à la position.' },
      { q: 'Tu reçois une pièce jointe inattendue « facture.pdf.exe ». Que faire ?', c: ["Ne pas l'ouvrir : c'est un programme", "L'ouvrir tout de suite pour vérifier le montant de la facture", "La transférer à tes amis", 'La renommer en facture.pdf'], a: 0, ex: "Le vrai type du fichier est .exe : c'est un programme, peut-être malveillant." },
      { q: 'Effacer son historique, cela supprime…', c: ['la liste des sites visités sur ce navigateur', "toutes les traces de tes visites chez ton fournisseur d'accès", 'les sites eux-mêmes', 'tes publications sur les réseaux sociaux'], a: 0, ex: "L'historique est local : les sites et ton fournisseur gardent leurs propres traces." },
      { q: 'Un lien dit « www.banque.fr », mais en le survolant on lit « banque-fr.secur.xyz ». C\'est…', c: ['sans doute un hameçonnage', 'une page officielle de ta banque', 'un simple bug du navigateur', 'une page plus rapide'], a: 0, ex: 'Le nom de domaine réel ne correspond pas : on ne clique pas.' },
      { q: 'Un site douteux ouvre des fenêtres sans arrêt. Quel réglage aide ?', c: ['Interdire ses programmes (JavaScript)', 'Augmenter le volume', 'Passer en mode avion pendant toute la visite du site', 'Changer d\'adresse IP'], a: 0, ex: 'On peut interdire au navigateur d\'exécuter les programmes d\'un site.' }
    ] }
];
