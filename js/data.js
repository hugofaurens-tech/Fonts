/* ============================================================
   CONTENU DU SITE — c'est ce fichier qu'il faut modifier
   pour changer les coordonnées, les biens et les avis.
   ============================================================ */

const SITE = {
  nom: "Sébastien Faurens",
  sousTitre: "Agent immobilier Century 21",
  slogan: "Votre projet,<br>mon engagement.",
  description: "Sébastien Faurens, agent immobilier indépendant au sein de l’agence Century 21",
  agence: "Century 21 Patrimoine 17",
  adresse: ["60 rue des Batignolles", "75017 Paris"],
  telephone: "+33 6 65 62 10 91",
  email: "sebastien.faurens@century21.com",
  whatsapp: "33665621091", // numéro au format international, sans + ni espaces
  instagram: "https://www.instagram.com/",
  linkedin: "https://www.linkedin.com/",
  copyright: "Sébastien Faurens — Agent commercial indépendant mandataire Century 21 Les Batignolles",

  // Adresse d'envoi des formulaires (ex. "https://formspree.io/f/xxxxxxx").
  // Laisser vide : les formulaires affichent la page de confirmation sans rien envoyer.
  formEndpoint: "",
};

/* ---------- Biens ----------
   id        : identifiant unique, utilisé dans l'adresse de la page (bien.html?id=...)
   statut    : "vente" ou "vendu"
   type      : "appartement", "maison", "loft", "immeuble"…
   photo     : image de la carte (dossier assets/img/)
   photos    : galerie de la page du bien (facultatif)
   Tous les champs après "dpe" sont facultatifs : une rubrique vide
   n'apparaît simplement pas sur la page du bien.                     */
const BIENS = [
  {
    id: "style-haussmannien", statut: "vente", type: "appartement",
    titre: "Style Haussmanien", ville: "Paris 17ème", quartier: "Batignolles",
    prix: 1350000, surface: 120, pieces: 4, dpe: "C",
    photo: "assets/img/bien-haussmannien.jpg",
  },
  {
    id: "duplex-terrasse", statut: "vente", type: "appartement",
    titre: "Duplex avec terrasse", ville: "Paris 16ème", quartier: "Trocadéro",
    prix: 950000, surface: 95, pieces: 3, dpe: "B",
    photo: "assets/img/bien-duplex.jpg",
    photos: [
      "assets/img/duplex-terrasse-1.jpg",
      "assets/img/duplex-terrasse-2.jpg",
      "assets/img/duplex-terrasse-3.jpg",
      "assets/img/duplex-terrasse-4.jpg",
      "assets/img/bien-duplex.jpg",
    ],
    adresse: "Avenue Georges Mandel, 75016 Paris",
    chambres: 2, sallesDeBain: 2, etage: 3, annee: 1975, chauffage: "Électrique",
    charges: 240, taxeFonciere: 1420,
    description: "Rare à la vente, magnifique duplex en dernier étage avec terrasse privative de 25 m² exposée sud-ouest. Séjour lumineux prolongé par une cuisine américaine équipée, deux chambres spacieuses, salle de bains et dressing. Prestations haut de gamme, matériaux nobles, parking et cave en sous-sol.",
    pointsForts: [
      "Terrasse privative 25 m² exposée sud-ouest",
      "Dernier étage sans vis-à-vis",
      "Parking en sous-sol inclus",
      "Résidence récente 2002",
    ],
    equipements: ["Ascenseur", "Parking", "Cave", "Terrasse", "Climatisation", "Fibre"],
    quartierTexte: [
      "Nichée dans le cœur du très prisé 16e arrondissement, l'avenue Georges Mandel est l'une des adresses les plus élégantes de Paris. Ses immeubles haussmanniens aux façades soignées, son large terre-plein arboré et sa proximité immédiate avec le Trocadéro et la Tour Eiffel en font un cadre de vie d'exception.",
      "Le quartier offre toutes les commodités à portée de main : boulangeries, fromageries, cavistes et belles tables se concentrent rue de la Pompe, tandis que le marché de Passy satisfait les plus exigeants. La station de métro Trocadéro (lignes 6 et 9) permet de rejoindre le centre de Paris en quelques minutes seulement.",
      "Un quartier résidentiel calme, verdoyant et sécurisé, où il fait bon vivre au quotidien.",
    ],
  },
  {
    id: "studio-design", statut: "vente", type: "appartement",
    titre: "Studio design", ville: "Paris 8ème", quartier: "Champs Elysées",
    prix: 450000, surface: 32, pieces: 1, dpe: "D",
    photo: "assets/img/bien-studio.jpg",
  },
  // Exemples de biens vendus (reprennent les visuels de la maquette — à remplacer)
  {
    id: "style-haussmannien-vendu", statut: "vendu", type: "appartement",
    titre: "Style Haussmanien", ville: "Paris 17ème", quartier: "Batignolles",
    prix: 1350000, surface: 120, pieces: 4, dpe: "C",
    photo: "assets/img/bien-haussmannien.jpg",
  },
  {
    id: "duplex-vendu", statut: "vendu", type: "appartement",
    titre: "Duplex avec terrasse", ville: "Levallois-Perret", quartier: "Planchette",
    prix: 850000, surface: 95, pieces: 3, dpe: "B",
    photo: "assets/img/bien-duplex.jpg",
  },
  {
    id: "studio-design-vendu", statut: "vendu", type: "appartement",
    titre: "Studio design", ville: "Paris 8ème", quartier: "Champs Elysées",
    prix: 450000, surface: 32, pieces: 1, dpe: "D",
    photo: "assets/img/bien-studio.jpg",
  },
];

/* ---------- Avis clients ---------- */
const AVIS = [
  {
    nom: "Marie-Claire T.", lieu: "Paris 17e",
    texte: "Sébastien a vendu notre appartement en moins de 3 semaines, au prix que nous souhaitions. Son calme et sa transparence tout au long du processus nous ont vraiment rassurés. On recommande sans hésitation.",
  },
  {
    nom: "François & Isabelle D.", lieu: "Levallois-Perret",
    texte: "Nous avions déjà tenté de vendre seuls pendant quatre mois sans succès. Sébastien a repositionné le prix, repris les photos et restructuré l'annonce. Résultat : deux offres en dix jours. On regrette de ne pas l'avoir appelé plus tôt.",
  },
  {
    nom: "Thomas & Camille B.", lieu: "Neuilly-sur-Seine",
    texte: "Nous cherchions depuis six mois sans trouver le bon bien. Sébastien a pris le temps de vraiment comprendre notre projet avant de nous proposer des visites. Il ne nous a pas fait perdre de temps avec des biens hors critères. On a trouvé notre appartement dès la troisième visite.",
  },
  {
    nom: "Natali.S", lieu: "Paris 17e",
    texte: "Estimation précise et accompagnement professionnel. Notre appartement s'est vendu au prix estimé en moins de 3 semaines.",
  },
];
