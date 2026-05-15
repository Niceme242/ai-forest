import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'afp_db',
  user: process.env.USER || 'unlockeurdramane',
});

async function seed() {
  const client = await pool.connect();
  try {
    // Articles
    const articleCount = (await client.query('SELECT COUNT(*) FROM articles')).rows[0].count;
    if (parseInt(articleCount) === 0) {
      await client.query(`
        INSERT INTO articles (category, tag, date, title, excerpt, body, src, author_name, author_role) VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9),
        ($10,$11,$12,$13,$14,$15,$16,$17,$18),
        ($19,$20,$21,$22,$23,$24,$25,$26,$27)
      `, [
        'Agriculture','Nouveau','5 mai 2026',
        'AI-Forest Planner déploie des alertes météo en temps réel pour les agriculteurs du Cameroun',
        "Plus de 4 000 producteurs du bassin du Noun reçoivent désormais des alertes personnalisées avant chaque épisode pluvieux ou de chaleur intense, grâce à notre module météo IA.",
        JSON.stringify(["Depuis le 1er mai 2026, plus de 4 000 agriculteurs de la région du Noun au Cameroun bénéficient d'alertes météo personnalisées directement sur leur téléphone, via l'application AI-Forest Planner.","Chaque alerte est contextualisée selon le type de culture pratiqué par l'agriculteur.","Ce déploiement est le fruit d'un partenariat avec la délégation régionale de l'Agriculture du Noun et l'IRAD."]),
        'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&h=500&fit=crop&crop=center',
        'Fatou Camara','Communauté & Terrain',

        'Technologie','Mise à jour','28 avril 2026',
        'Version 3.2 : analyse des sols enrichie et nouveau tableau de bord parcelles',
        "La dernière mise à jour apporte une cartographie des sols haute résolution, des recommandations d'engrais affinées par culture et une refonte complète du tableau de bord.",
        JSON.stringify(["La version 3.2 d'AI-Forest Planner est disponible dès aujourd'hui sur l'App Store et le Google Play Store.","La cartographie des sols passe à une résolution de 10 mètres, contre 30 mètres précédemment.","Les recommandations d'engrais ont été entièrement recalibrées. L'algorithme intègre désormais 47 variables agronomiques."]),
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop&crop=center',
        'Amina Diallo','Directrice Technique & IA',

        'Partenariats','Partenariat','15 avril 2026',
        "AI-Forest Planner s'associe à l'AGRA pour accélérer l'agriculture digitale en Afrique",
        "Ce partenariat stratégique permettra de former 10 000 agriculteurs supplémentaires aux outils numériques et d'étendre notre couverture à trois nouveaux pays d'ici fin 2026.",
        JSON.stringify(["AI-Forest Planner et l'Alliance pour une Révolution Verte en Afrique (AGRA) ont signé le 15 avril 2026 un accord de partenariat stratégique à Nairobi.","Dans le cadre de ce partenariat, AGRA contribuera à financer la formation de 10 000 agriculteurs supplémentaires d'ici décembre 2026."]),
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=500&fit=crop&crop=center',
        'Kofi Mensah','PDG & Co-Fondateur',
      ]);
      console.log('✓ Articles seeded');
    } else {
      console.log('- Articles already present, skipping');
    }

    // Guide sections
    const guideCount = (await client.query('SELECT COUNT(*) FROM guide_sections')).rows[0].count;
    if (parseInt(guideCount) === 0) {
      const sections = [
        ['01', 'Introduction à AI Forest Planner', "AI Forest Planner est une application mobile intelligente dédiée aux agriculteurs d'Afrique Centrale, notamment du Congo-Brazzaville, du Cameroun, du Gabon, de la RCA et de la RDC.", 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=760&h=560&fit=crop&crop=center', ["Tableau de bord agricole avec météo en temps réel","Recommandations IA personnalisées selon vos cultures et votre localisation","Assistant agricole conversationnel disponible dans l'application","Marketplace pour vendre et acheter des produits agricoles","Carte agricole interactive couvrant 82 régions d'Afrique Centrale"], 0],
        ['02', 'Prise en main et authentification', "À l'ouverture de l'application, l'utilisateur peut se connecter avec son numéro de téléphone et son mot de passe, ou continuer sans compte avec un accès limité.", 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=760&h=560&fit=crop&crop=center', ["Créer un compte avec nom complet, pays, département, téléphone et mot de passe","Accepter les conditions d'utilisation pour activer la création du compte","Réinitialiser le mot de passe avec un code de vérification envoyé par email","Utiliser l'application sans compte pour découvrir les fonctions de base"], 1],
        ['03', 'Tableau de bord agricole', "Le tableau de bord regroupe les informations essentielles pour gérer une exploitation au quotidien: météo, cultures populaires et actualités agricoles.", 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=760&h=560&fit=crop&crop=center', ["Température pour planifier l'irrigation et les travaux","Humidité pour évaluer les risques de maladies fongiques","Vent pour décider des traitements et pulvérisations","Cultures recommandées par région, saison et niveau de difficulté","Actualités agricoles locales, événements et innovations"], 2],
        ['04', 'Intelligence artificielle', "L'IA analyse la localisation, la météo, les cultures, le calendrier saisonnier et l'historique d'activité pour produire des conseils adaptés.", 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=760&h=560&fit=crop&crop=center', ["Recommandations classées par priorité: urgent, important, information ou conseil","Conseils personnalisés selon le département, les cultures et les conditions météo","Chat AI disponible pour poser des questions agricoles en français simple","Aide sur les cultures, maladies, ravageurs, météo, irrigation, marché et planification","Possibilité d'améliorer les conseils en gardant le profil agricole à jour"], 3],
        ['05', 'Marketplace agricole', "Le Marketplace permet d'acheter et de vendre des produits agricoles directement depuis l'application.", 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=760&h=560&fit=crop&crop=center', ["Publier un produit avec catégorie, photos, prix, unité, stock et description","Ajouter un numéro de téléphone pour faciliter les échanges","Activer le prix négociable pour recevoir des offres","Consulter l'assistant IA pour estimer les prix du marché","Ajouter jusqu'à cinq photos pour améliorer la visibilité d'une annonce"], 4],
        ['06', 'Carte agricole interactive', "La carte agricole offre une vue géographique des zones de culture et opportunités agricoles en Afrique Centrale.", 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=760&h=560&fit=crop&crop=center', ["Recherche rapide par nom de région","Filtres par pays: Cameroun, Congo-Brazzaville, Gabon, RCA et RDC","Affichage des régions agricoles avec marqueurs interactifs","Couverture de 82 régions réparties dans 5 pays"], 5],
        ['07', 'Profil et sécurité', "Le profil centralise les informations personnelles, la localisation, les paramètres et les options de sécurité.", 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=760&h=560&fit=crop&crop=center', ["Modifier le nom complet, le téléphone, le mail et la localisation","Changer le mot de passe depuis la section sécurité","Mettre à jour la localisation pour améliorer les recommandations","Supprimer le compte depuis les paramètres, avec suppression irréversible des données","Retrouver ses données sur un nouvel appareil grâce aux serveurs sécurisés de DAS"], 6],
        ['08', "Navigation dans l'application", "La barre de navigation donne accès aux sections principales de l'application mobile.", 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=760&h=560&fit=crop&crop=center', ["Accueil pour le tableau de bord et les informations agricoles","Marketplace pour les produits et annonces","Chat AI pour l'assistant agricole","Calendrier pour organiser les activités","Profil pour les paramètres et informations personnelles"], 7],
      ];
      for (const [number, title, text, image, points, sort_order] of sections) {
        await client.query(
          'INSERT INTO guide_sections (number, title, text, image, points, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
          [number, title, text, image, JSON.stringify(points), sort_order]
        );
      }
      console.log('✓ Guide sections seeded');
    } else {
      console.log('- Guide sections already present, skipping');
    }

    // Settings
    const settingsCount = (await client.query('SELECT COUNT(*) FROM settings')).rows[0].count;
    if (parseInt(settingsCount) === 0) {
      await client.query(`
        INSERT INTO settings (key, value) VALUES
        ('downloads', $1),
        ('footer', $2)
      `, [
        JSON.stringify({ android: { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=ai.agri.planner' }, ios: { label: 'App Store', url: 'https://apps.apple.com/app/id000000000' } }),
        JSON.stringify({ description: 'Une plateforme africaine de gestion agricole durable, pensée pour les fermiers et les collectifs.', email: 'contact@ai-agri-planner.africa', phone: '+221 77 123 45 67', socialLinks: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/' }, { label: 'Instagram', href: 'https://www.instagram.com/' }], copyright: "© 2026 DAS - Data Analytic Solutions — Tous droits réservés. Conçu pour l'agriculture intelligente.", websiteUrl: 'https://das-congo.tech' }),
      ]);
      console.log('✓ Settings seeded');
    } else {
      console.log('- Settings already present, skipping');
    }

    console.log('\nSeed completed successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
