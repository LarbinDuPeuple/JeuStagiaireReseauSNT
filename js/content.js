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
  'ntp.iroisenet.bzh': '203.0.113.123'
};
// où se trouve chaque serveur (routeur auquel il est relié)
const HOST_AT = { '185.15.58.224': 'paris', '203.0.113.10': 'brest', '203.0.113.80': 'brest', '198.51.100.20': 'brest', '198.51.100.71': 'quimper', '203.0.113.123': 'brest', [DNS_IP]: 'brest' };

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
              <tr><td>Decodeur-TV</td><td>192.168.1.2</td><td>câble</td><td>maintenant</td></tr>
              <tr><td>PC-JEROME</td><td>192.168.1.47</td><td>Wi-Fi</td><td>toutes les nuits, 3 h du matin</td></tr></table>
              Mme Le Gall vit seule. Quel appareil n'a rien à faire sur son réseau ?`,
              c: ['PC-SALON', 'Decodeur-TV', 'PC-JEROME', 'Tablette-Mamie'], a: 2,
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
    explain: "Les mails supportent d'arriver avec un peu de retard, pas la visio. Sur un réseau physique lent et irrégulier, l'absence de garantie temporelle se voit tout de suite." }
];
