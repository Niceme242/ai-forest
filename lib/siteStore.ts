// ─── TYPES ─────────────────────────────────────────────────────────────────────

export type Article = {
  id: number;
  category: 'Agriculture' | 'Technologie' | 'Partenariats' | 'Événements';
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
  src: string;
  author: { name: string; role: string };
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  position: string;
  description: string;
  src: string;
};

export type Partner = {
  id: number;
  name: string;
  description: string;
  href: string;
};

export type GalleryImage = {
  id: number;
  title: string;
  src: string;
};

export type WorkflowStep = {
  id: number;
  step: string;
  title: string;
  text: string;
};

export type GuideSection = {
  id: number;
  number: string;
  title: string;
  text: string;
  image: string;
  points: string[];
};

export type DownloadLinks = {
  android: { label: string; url: string };
  ios: { label: string; url: string };
};

export type FooterInfo = {
  description: string;
  email: string;
  phone: string;
  socialLinks: Array<{ label: string; href: string }>;
  copyright: string;
  websiteUrl: string;
};

export type MonitoringCard = { id: number; label: string; title: string; value: string; sort_order: number };
export type MonitoringStat = { id: number; label: string; target: number; suffix: string; sort_order: number };
export type DashboardItem  = { id: number; label: string; value: string; description: string; sort_order: number };
export type MonitoringSettings = {
  hero_title: string; hero_description: string;
  metric_value: string; metric_label: string;
  stats_title: string; stats_description: string; bg_image: string;
};

export type Feature = {
  id: number;
  icon: string;
  accent: string;
  title: string;
  description: string;
  image: string;
  sort_order: number;
};

export type MarketProduct = {
  id: number;
  name: string;
  unit: string;
  price: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
  description: string;
  sort_order: number;
};

export type CommunityLink = {
  id: number;
  label: string;
  href: string;
  value: string;
  sort_order: number;
};

export type Message = {
  id: number;
  type: 'partner_request' | 'newsletter';
  name?: string;
  organization?: string;
  email: string;
  partnershipType?: string;
  messageText?: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
};

// ─── DEFAULT DATA ──────────────────────────────────────────────────────────────

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: 1,
    category: 'Agriculture',
    tag: 'Nouveau',
    date: '5 mai 2026',
    title: 'AI-Forest Planner déploie des alertes météo en temps réel pour les agriculteurs du Cameroun',
    excerpt: 'Plus de 4 000 producteurs du bassin du Noun reçoivent désormais des alertes personnalisées avant chaque épisode pluvieux ou de chaleur intense, grâce à notre module météo IA.',
    body: [
      "Depuis le 1er mai 2026, plus de 4 000 agriculteurs de la région du Noun au Cameroun bénéficient d'alertes météo personnalisées directement sur leur téléphone, via l'application AI-Forest Planner. Ces alertes sont générées par notre module d'intelligence artificielle qui analyse en continu les données satellitaires, les relevés des stations météo locales et les historiques climatiques.",
      "Chaque alerte est contextualisée selon le type de culture pratiqué par l'agriculteur. Un producteur de maïs recevra ainsi une recommandation différente d'un producteur de manioc face au même épisode météo.",
      "Ce déploiement est le fruit d'un partenariat avec la délégation régionale de l'Agriculture du Noun et l'Institut de Recherche Agricole pour le Développement (IRAD).",
    ],
    src: '',
    author: { name: 'Fatou Camara', role: 'Communauté & Terrain' },
  },
  {
    id: 2,
    category: 'Technologie',
    tag: 'Mise à jour',
    date: '28 avril 2026',
    title: 'Version 3.2 : analyse des sols enrichie et nouveau tableau de bord parcelles',
    excerpt: "La dernière mise à jour apporte une cartographie des sols haute résolution, des recommandations d'engrais affinées par culture et une refonte complète du tableau de bord.",
    body: [
      "La version 3.2 d'AI-Forest Planner est disponible dès aujourd'hui sur l'App Store et le Google Play Store. Cette mise à jour majeure introduit plusieurs fonctionnalités très attendues par notre communauté d'utilisateurs.",
      "La cartographie des sols passe à une résolution de 10 mètres, contre 30 mètres précédemment.",
      "Les recommandations d'engrais ont été entièrement recalibrées. L'algorithme intègre désormais 47 variables agronomiques.",
    ],
    src: '',
    author: { name: 'Amina Diallo', role: 'Directrice Technique & IA' },
  },
  {
    id: 3,
    category: 'Partenariats',
    tag: 'Partenariat',
    date: '15 avril 2026',
    title: "AI-Forest Planner s'associe à l'AGRA pour accélérer l'agriculture digitale en Afrique",
    excerpt: "Ce partenariat stratégique permettra de former 10 000 agriculteurs supplémentaires aux outils numériques et d'étendre notre couverture à trois nouveaux pays d'ici fin 2026.",
    body: [
      "AI-Forest Planner et l'Alliance pour une Révolution Verte en Afrique (AGRA) ont signé le 15 avril 2026 un accord de partenariat stratégique à Nairobi.",
      "Dans le cadre de ce partenariat, AGRA contribuera à financer la formation de 10 000 agriculteurs supplémentaires d'ici décembre 2026.",
    ],
    src: '',
    author: { name: 'Kofi Mensah', role: 'PDG & Co-Fondateur' },
  },
];

export const DEFAULT_TEAM: TeamMember[] = [
  { id: 1, name: 'Kofi Mensah',      role: 'PDG & Co-Fondateur',       position: '', description: "Agronome avec plus de 12 ans d'expérience terrain en Afrique Centrale et de l'Ouest. Convaincu que la technologie peut moderniser l'agriculture familiale.", src: '' },
  { id: 2, name: 'Amina Diallo',     role: 'Directrice Technique & IA', position: '', description: "Ingénieure en apprentissage automatique spécialisée dans les modèles de données agricoles. Ancienne chercheuse à l'Institut Africain des Sciences Mathématiques.", src: '' },
  { id: 3, name: 'Jean-Pierre Nkosi',role: 'Responsable Produit',       position: '', description: 'Designer produit et stratège UX spécialisé dans les outils adaptés aux environnements à faible connectivité, au service des communautés rurales.', src: '' },
  { id: 4, name: 'Fatou Camara',     role: 'Communauté & Croissance',   position: '', description: "Spécialiste en vulgarisation agricole, elle fait le lien entre la technologie et les agriculteurs sur le terrain. Elle pilote l'accompagnement dans 6 pays.", src: '' },
];

export const DEFAULT_PARTNERS: Partner[] = [
  { id: 1, name: 'FAO', description: 'Food & Agriculture Organization', href: 'https://www.fao.org' },
  { id: 2, name: 'AGRA', description: 'Alliance for a Green Revolution in Africa', href: 'https://agra.org' },
  { id: 3, name: 'AfDB', description: 'African Development Bank', href: 'https://www.afdb.org' },
  { id: 4, name: 'CGIAR', description: 'Global Agriculture Research', href: 'https://www.cgiar.org' },
  { id: 5, name: 'WFP', description: 'World Food Programme', href: 'https://www.wfp.org' },
];

export const DEFAULT_GALLERY: GalleryImage[] = [
  { id: 1, title: 'Suivi des cultures',  src: '' },
  { id: 2, title: 'Analyse des parcelles', src: '' },
  { id: 3, title: 'Travail de terrain',  src: '' },
  { id: 4, title: 'Récoltes locales',    src: '' },
];

export const DEFAULT_WORKFLOW: WorkflowStep[] = [
  { id: 1, step: '01', title: 'Ajoutez vos parcelles', text: 'Renseignez la localisation, la surface et les cultures suivies.' },
  { id: 2, step: '02', title: 'Recevez les analyses', text: "L'application croise météo, sol et données agricoles pour donner une lecture claire." },
  { id: 3, step: '03', title: 'Agissez au bon moment', text: "AVA vous guide sur l'irrigation, les risques, les intrants et les priorités." },
  { id: 4, step: '04', title: 'Suivez les résultats', text: 'Visualisez la santé des cultures et les progrès de rendement.' },
];

export const DEFAULT_GUIDE: GuideSection[] = [
  { id: 1, number: '01', title: 'Introduction à AI Forest Planner', text: "AI Forest Planner est une application mobile intelligente dédiée aux agriculteurs d'Afrique Centrale, notamment du Congo-Brazzaville, du Cameroun, du Gabon, de la RCA et de la RDC.", image: '', points: ['Tableau de bord agricole avec météo en temps réel', "Recommandations IA personnalisées selon vos cultures et votre localisation", "Assistant agricole conversationnel disponible dans l'application", 'Marketplace pour vendre et acheter des produits agricoles', "Carte agricole interactive couvrant 82 régions d'Afrique Centrale"] },
  { id: 2, number: '02', title: 'Prise en main et authentification', text: "À l'ouverture de l'application, l'utilisateur peut se connecter avec son numéro de téléphone et son mot de passe, ou continuer sans compte avec un accès limité.", image: '', points: ['Créer un compte avec nom complet, pays, département, téléphone et mot de passe', "Accepter les conditions d'utilisation pour activer la création du compte", "Réinitialiser le mot de passe avec un code de vérification envoyé par email", "Utiliser l'application sans compte pour découvrir les fonctions de base"] },
  { id: 3, number: '03', title: 'Tableau de bord agricole', text: "Le tableau de bord regroupe les informations essentielles pour gérer une exploitation au quotidien: météo, cultures populaires et actualités agricoles.", image: '', points: ["Température pour planifier l'irrigation et les travaux", 'Humidité pour évaluer les risques de maladies fongiques', 'Vent pour décider des traitements et pulvérisations', 'Cultures recommandées par région, saison et niveau de difficulté', 'Actualités agricoles locales, événements et innovations'] },
  { id: 4, number: '04', title: 'Intelligence artificielle', text: "L'IA analyse la localisation, la météo, les cultures, le calendrier saisonnier et l'historique d'activité pour produire des conseils adaptés.", image: '', points: ["Recommandations classées par priorité: urgent, important, information ou conseil", 'Conseils personnalisés selon le département, les cultures et les conditions météo', 'Chat AI disponible pour poser des questions agricoles en français simple', 'Aide sur les cultures, maladies, ravageurs, météo, irrigation, marché et planification', "Possibilité d'améliorer les conseils en gardant le profil agricole à jour"] },
  { id: 5, number: '05', title: 'Marketplace agricole', text: "Le Marketplace permet d'acheter et de vendre des produits agricoles directement depuis l'application.", image: '', points: ["Publier un produit avec catégorie, photos, prix, unité, stock et description", 'Ajouter un numéro de téléphone pour faciliter les échanges', 'Activer le prix négociable pour recevoir des offres', "Consulter l'assistant IA pour estimer les prix du marché", "Ajouter jusqu'à cinq photos pour améliorer la visibilité d'une annonce"] },
  { id: 6, number: '06', title: 'Carte agricole interactive', text: "La carte agricole offre une vue géographique des zones de culture et opportunités agricoles en Afrique Centrale.", image: '', points: ['Recherche rapide par nom de région', 'Filtres par pays: Cameroun, Congo-Brazzaville, Gabon, RCA et RDC', 'Affichage des régions agricoles avec marqueurs interactifs', "Couverture de 82 régions réparties dans 5 pays"] },
  { id: 7, number: '07', title: 'Profil et sécurité', text: "Le profil centralise les informations personnelles, la localisation, les paramètres et les options de sécurité.", image: '', points: ['Modifier le nom complet, le téléphone, le mail et la localisation', 'Changer le mot de passe depuis la section sécurité', 'Mettre à jour la localisation pour améliorer les recommandations', "Supprimer le compte depuis les paramètres, avec suppression irréversible des données", "Retrouver ses données sur un nouvel appareil grâce aux serveurs sécurisés de DAS"] },
  { id: 8, number: '08', title: "Navigation dans l'application", text: "La barre de navigation donne accès aux sections principales de l'application mobile.", image: '', points: ['Accueil pour le tableau de bord et les informations agricoles', 'Marketplace pour les produits et annonces', "Chat AI pour l'assistant agricole", 'Calendrier pour organiser les activités', 'Profil pour les paramètres et informations personnelles'] },
];

export const DEFAULT_MONITORING_CARDS: MonitoringCard[] = [
  { id: 1, label: 'Carte',      title: 'Parcelles analysées',  value: '+24 régions', sort_order: 0 },
  { id: 2, label: 'Flux',       title: 'Alertes prioritaires', value: '14',          sort_order: 1 },
  { id: 3, label: 'Ressources', title: "Économie d'eau",       value: '27%',         sort_order: 2 },
];

export const DEFAULT_MONITORING_STATS: MonitoringStat[] = [
  { id: 1, label: 'Utilisateurs actifs', target: 12800,  suffix: '+', sort_order: 0 },
  { id: 2, label: 'Parcelles suivies',   target: 18500,  suffix: '+', sort_order: 1 },
  { id: 3, label: 'Hectares monitorés',  target: 72000,  suffix: '+', sort_order: 2 },
  { id: 4, label: 'Données analysées',   target: 430000, suffix: '+', sort_order: 3 },
];

export const DEFAULT_DASHBOARD_ITEMS: DashboardItem[] = [
  { id: 1, label: 'Sol',      value: 'pH 6.8', description: 'Acidité optimale',  sort_order: 0 },
  { id: 2, label: 'Humidité', value: '68%',    description: 'Niveau correct',    sort_order: 1 },
  { id: 3, label: 'Temp.',    value: '27°C',   description: 'Journée',           sort_order: 2 },
  { id: 4, label: 'Pluie',    value: '12mm',   description: 'Prévue demain',     sort_order: 3 },
  { id: 5, label: 'Vent',     value: '8km/h',  description: 'Léger',             sort_order: 4 },
  { id: 6, label: 'Récolte',  value: 'J+14',   description: 'Estimée',           sort_order: 5 },
];

export const DEFAULT_MONITORING_SETTINGS: MonitoringSettings = {
  hero_title:       'Suivez vos terres avec des données claires.',
  hero_description: 'Cartes, alertes et indicateurs agricoles dans un tableau de bord simple.',
  metric_value:     '89%',
  metric_label:     'Cultures en bonne santé',
  stats_title:      'Des indicateurs faciles à lire.',
  stats_description:'',
  bg_image:         '',
};

export const DEFAULT_FEATURES: Feature[] = [
  { id: 1, icon: 'SO', accent: 'Parcelles',  title: 'Analyse des sols',           description: "Comprenez la fertilité, l'eau et les besoins de chaque parcelle.", image: '', sort_order: 0 },
  { id: 2, icon: 'IA', accent: 'Cultures',   title: 'Recommandations IA',         description: 'Choisissez les bonnes cultures selon le climat, le sol et la saison.', image: '', sort_order: 1 },
  { id: 3, icon: 'MT', accent: 'Météo',      title: 'Alertes climatiques',        description: 'Anticipez pluie, chaleur, sécheresse et risques pour vos cultures.', image: '', sort_order: 2 },
  { id: 4, icon: 'RD', accent: 'Rendement',  title: 'Suivi des cultures',         description: 'Suivez la croissance, la santé et la performance agricole.', image: '', sort_order: 3 },
  { id: 5, icon: 'AL', accent: 'Alertes',    title: 'Notifications intelligentes',description: "Recevez les bonnes actions au bon moment: irrigation, ravageurs, récolte.", image: '', sort_order: 4 },
  { id: 6, icon: 'RS', accent: 'Ressources', title: 'Optimisation des intrants',  description: "Réduisez le gaspillage d'eau, fertilisant et énergie.", image: '', sort_order: 5 },
];

export const DEFAULT_MARKET: MarketProduct[] = [
  { id: 1, name: 'Maïs', unit: 'kg', price: '150 FCFA', trend: 'up', category: 'Céréales', description: '', sort_order: 0 },
  { id: 2, name: 'Manioc', unit: 'kg', price: '80 FCFA', trend: 'stable', category: 'Tubercules', description: '', sort_order: 1 },
  { id: 3, name: 'Arachide', unit: 'kg', price: '450 FCFA', trend: 'down', category: 'Légumineuses', description: '', sort_order: 2 },
  { id: 4, name: 'Tomate', unit: 'kg', price: '300 FCFA', trend: 'up', category: 'Légumes', description: '', sort_order: 3 },
  { id: 5, name: 'Plantain', unit: 'régime', price: '1 200 FCFA', trend: 'stable', category: 'Fruits', description: '', sort_order: 4 },
  { id: 6, name: 'Igname', unit: 'kg', price: '250 FCFA', trend: 'up', category: 'Tubercules', description: '', sort_order: 5 },
];

export const DEFAULT_COMMUNITY_LINKS: CommunityLink[] = [
  { id: 1, label: 'WhatsApp', href: 'https://www.whatsapp.com/', value: 'Groupe terrain', sort_order: 0 },
  { id: 2, label: 'Telegram', href: 'https://telegram.org/', value: 'Alertes & ressources', sort_order: 1 },
  { id: 3, label: 'LinkedIn', href: 'https://www.linkedin.com/', value: 'Réseau professionnel', sort_order: 2 },
  { id: 4, label: 'Facebook', href: 'https://www.facebook.com/', value: 'Événements locaux', sort_order: 3 },
];

export const DEFAULT_DOWNLOADS: DownloadLinks = {
  android: { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=ai.agri.planner' },
  ios: { label: 'App Store', url: 'https://apps.apple.com/app/id000000000' },
};

export const DEFAULT_FOOTER: FooterInfo = {
  description: 'Une plateforme africaine de gestion agricole durable, pensée pour les fermiers et les collectifs.',
  email: 'contact@ai-agri-planner.africa',
  phone: '+221 77 123 45 67',
  socialLinks: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
  ],
  copyright: '© 2026 DAS - Data Analytic Solutions — Tous droits réservés. Conçu pour l\'agriculture intelligente.',
  websiteUrl: 'https://das-congo.tech',
};
