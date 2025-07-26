import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image
} from '@react-pdf/renderer';

interface PdfDocumentProps {
  solution?: 'coliving' | 'logements';
}


// Données extraites des composants React (synchronisées avec l'UI web)
const characteristics = [
  { label: 'Surface habitable', value: '150 m²' },
  { label: 'Configuration', value: 'Bâtiment 3 niveaux à rénover' },
  { label: 'Type de projet', value: 'Rénovation lourde' },
  { label: 'Solutions proposées', value: '2 options : Coliving ou 3 logements' },
  { label: 'Option Coliving', value: '4-5 chambres sur 3 niveaux' },
  { label: 'Option 3 logements', value: '1 logement par niveau' },
];
const technical = [
  'Démolition complète : planchers, cloisons, équipements existants',
  'Gros œuvre : reprise structure, planchers bois, réseaux évacuation',
  'Charpente : rénovation traditionnelle avec renforcement',
  'Isolation thermique réglementaire renforcée',
  'Menuiseries bois neuves avec porte anti-effraction',
  'Installations électriques complètes selon NFC 15-100',
  'Plomberie et sanitaire : prestations avancées complètes',
  'Chauffage PAC air/air et climatisation avec régulation',
  'Cloisons de distribution et finitions plâtrerie',
  'Revêtements : carrelage, faïence, parquet selon zones',
  'Peinture et finitions dans tous les locaux',
  'Équipements cuisine et sanitaires (2 salles d\'eau)'
];
const pricingSections = [
  {
    title: 'DÉMOLITION ET DÉPOSE', icon: '🔨', rows: [
      { title: 'Plâtrerie à démolir (100%)', ht: '3 934,00 €', tva: '216,37 €', ttc: '4 150,37 €' },
      { title: 'Revêtements de sol à démolir', ht: '5 176,00 €', tva: '284,68 €', ttc: '5 460,68 €' },
      { title: 'Menuiseries intérieures à déposer', ht: '2 070,00 €', tva: '113,85 €', ttc: '2 183,85 €' },
      { title: 'Menuiseries extérieures à déposer', ht: '1 656,00 €', tva: '91,08 €', ttc: '1 747,08 €' },
      { title: 'Plomberie ancienne à déposer', ht: '3 520,00 €', tva: '193,60 €', ttc: '3 713,60 €' },
      { title: 'Équipements sanitaires à déposer', ht: '1 656,00 €', tva: '91,08 €', ttc: '1 747,08 €' },
      { title: 'Électricité ancienne à déposer', ht: '3 726,00 €', tva: '204,93 €', ttc: '3 930,93 €' },
    ], subtotal: { ht: '21 738,00 €', tva: '1 195,59 €', ttc: '22 933,59 €' }
  },
  {
    title: 'GROS ŒUVRE ET STRUCTURE', icon: '🏗️', rows: [
      { title: 'Plancher bois (100 m²)', ht: '11 040,00 €', tva: '607,20 €', ttc: '11 647,20 €' },
      { title: 'Reprise réseaux évacuation (25 ml)', ht: '4 140,00 €', tva: '227,70 €', ttc: '4 367,70 €' },
      { title: 'Ouverture mur porteur (10 m²)', ht: '1 656,00 €', tva: '91,08 €', ttc: '1 747,08 €' },
      { title: 'Création trémie (1 m²)', ht: '1 242,00 €', tva: '68,31 €', ttc: '1 310,31 €' },
      { title: 'Chape (150 m²)', ht: '4 554,00 €', tva: '250,47 €', ttc: '4 804,47 €' },
      { title: 'Raccordement réseau urbain (5 ml)', ht: '1 001,00 €', tva: '55,06 €', ttc: '1 056,06 €' },
    ], subtotal: { ht: '23 633,00 €', tva: '1 299,82 €', ttc: '24 932,82 €' }
  },
  {
    title: 'CHARPENTE ET TOITURE', icon: '🏠', rows: [
      { title: 'Charpente traditionnelle rénovation (50 m²)', ht: '12 766,00 €', tva: '702,13 €', ttc: '13 468,13 €' },
    ], subtotal: { ht: '12 766,00 €', tva: '702,13 €', ttc: '13 468,13 €' }
  },
  {
    title: 'ISOLATION THERMIQUE', icon: '🧱', rows: [
      { title: 'Isolation thermique réglementaire', ht: '16 560,00 €', tva: '910,80 €', ttc: '17 470,80 €' },
    ], subtotal: { ht: '16 560,00 €', tva: '910,80 €', ttc: '17 470,80 €' }
  },
  {
    title: 'MENUISERIES EXTÉRIEURES', icon: '🚪', rows: [
      { title: 'Remplacement menuiseries bois (25 m²)', ht: '22 426,00 €', tva: '1 233,43 €', ttc: '23 659,43 €' },
      { title: 'Création menuiserie bois (1 m²)', ht: '898,00 €', tva: '49,39 €', ttc: '947,39 €' },
    ], subtotal: { ht: '23 324,00 €', tva: '1 282,82 €', ttc: '24 606,82 €' }
  },
  {
    title: 'INSTALLATIONS ÉLECTRIQUES', icon: '⚡', rows: [
      { title: 'Prestations avancées selon NFC 15-100', ht: '25 876,00 €', tva: '1 423,18 €', ttc: '27 299,18 €' },
    ], subtotal: { ht: '25 876,00 €', tva: '1 423,18 €', ttc: '27 299,18 €' }
  },
  {
    title: 'PLOMBERIE ET SANITAIRE', icon: '🚰', rows: [
      { title: 'Prestations avancées complètes', ht: '20 700,00 €', tva: '1 138,50 €', ttc: '21 838,50 €' },
    ], subtotal: { ht: '20 700,00 €', tva: '1 138,50 €', ttc: '21 838,50 €' }
  },
  {
    title: 'CHAUFFAGE ET CLIMATISATION', icon: '🌡️', rows: [
      { title: 'Installation de chauffage central', ht: '12 420,00 €', tva: '683,10 €', ttc: '13 103,10 €' },
      { title: 'Climatisation air/air avec PAC', ht: '13 456,00 €', tva: '740,08 €', ttc: '14 196,08 €' },
    ], subtotal: { ht: '25 876,00 €', tva: '1 423,18 €', ttc: '27 299,18 €' }
  },
  {
    title: 'CLOISONS ET PLÂTRERIE', icon: '🧱', rows: [
      { title: 'Cloisons de distribution et plâtrerie', ht: '19 666,00 €', tva: '1 081,63 €', ttc: '20 747,63 €' },
    ], subtotal: { ht: '19 666,00 €', tva: '1 081,63 €', ttc: '20 747,63 €' }
  },
  {
    title: 'MENUISERIES INTÉRIEURES', icon: '🚪', rows: [
      { title: 'Menuiseries intérieures standard', ht: '10 350,00 €', tva: '2 070,00 €', ttc: '12 420,00 €' },
    ], subtotal: { ht: '10 350,00 €', tva: '2 070,00 €', ttc: '12 420,00 €' }
  },
  {
    title: 'REVÊTEMENTS DE SOLS ET MURS', icon: '🏠', rows: [
      { title: 'Carrelage grès cérame pour sols', ht: '4 554,00 €', tva: '910,80 €', ttc: '5 464,80 €' },
      { title: 'Faïence murale salle d\'eau', ht: '1 450,00 €', tva: '290,00 €', ttc: '1 740,00 €' },
      { title: 'Parquet contrecollé chêne', ht: '9 108,00 €', tva: '1 821,60 €', ttc: '10 929,60 €' },
    ], subtotal: { ht: '15 112,00 €', tva: '3 022,40 €', ttc: '18 134,40 €' }
  },
  {
    title: 'PEINTURE ET FINITIONS', icon: '🎨', rows: [
      { title: 'Peinture complète murs et plafonds', ht: '12 006,00 €', tva: '2 401,20 €', ttc: '14 407,20 €' },
    ], subtotal: { ht: '12 006,00 €', tva: '2 401,20 €', ttc: '14 407,20 €' }
  },
  {
    title: 'ÉQUIPEMENTS CUISINE', icon: '🍳', rows: [
      { title: 'Équipement cuisine complet', ht: '11 730,00 €', tva: '2 346,00 €', ttc: '14 076,00 €' },
    ], subtotal: { ht: '11 730,00 €', tva: '2 346,00 €', ttc: '14 076,00 €' }
  },
  {
    title: 'ÉQUIPEMENTS SANITAIRES', icon: '🚿', rows: [
      { title: 'Équipements sanitaires pour salles d\'eau', ht: '11 040,00 €', tva: '2 208,00 €', ttc: '13 248,00 €' },
    ], subtotal: { ht: '11 040,00 €', tva: '2 208,00 €', ttc: '13 248,00 €' }
  },
];

// Fonction pour formater les prix sans séparateurs problématiques
const formatPrice = (price: number): string => {
  return price.toLocaleString('fr-FR', { minimumFractionDigits: 2 }).replace(/[\u202F\u00A0]/g, ' ') + ' €';
};

// Fonction pour calculer les données selon la solution avec TVA correcte
const getPdfData = (solution: 'coliving' | 'logements') => {
  if (solution === 'logements') {
    // Coûts variables pour solution 3 logements  
    const electriciteHt = 30534;
    const plomberieHt = 27945;
    const pacHt = 20184;
    const menuiseriesIntHt = 15600;
    const cuisineHt = 16500;
    const sanitairesHt = 14290;
    
    // TVA 5.5% : Amélioration énergétique
    const amelioration55Ht = 16560 + 12420 + pacHt; // Isolation + Chauffage + PAC
    
    // TVA 10% : Rénovation
    const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + electriciteHt + plomberieHt;
    
    // TVA 20% : Équipements
    const variables20Ht = menuiseriesIntHt + cuisineHt + sanitairesHt;
    
    const totalTravauxHt = amelioration55Ht + renovation10Ht + variables20Ht;
    const tva55 = Math.round(amelioration55Ht * 0.055);
    const tva10 = Math.round(renovation10Ht * 0.10);
    const tva20 = Math.round(variables20Ht * 0.2);
    const tvaTravauxHt = tva55 + tva10 + tva20;
    const totalTravauxTtc = totalTravauxHt + tvaTravauxHt;
    
    const honorairesHt = 7095;
    const honorairesTva = Math.round(honorairesHt * 0.2);
    const honorairesTtc = honorairesHt + honorairesTva;
    
    const prime = -2500;
    
    const totalGeneralHt = totalTravauxHt + honorairesHt + prime;
    const totalGeneralTva = tvaTravauxHt + honorairesTva;
    const totalGeneralTtc = totalTravauxTtc + honorairesTtc + prime;
    
    const valeurImmobiliere = 471000;
    const plusValue = valeurImmobiliere - totalGeneralTtc;
    
    return {
      pricingTotals: {
        ht: formatPrice(totalTravauxHt),
        tva: formatPrice(tvaTravauxHt),
        ttc: formatPrice(totalTravauxTtc),
      },
      honoraires: {
        ht: formatPrice(honorairesHt),
        tva: formatPrice(honorairesTva),
        ttc: formatPrice(honorairesTtc),
      },
      totalGeneral: {
        ht: formatPrice(totalGeneralHt),
        tva: formatPrice(totalGeneralTva),
        ttc: formatPrice(totalGeneralTtc),
      },
      potentiel: {
        valeur: formatPrice(valeurImmobiliere),
        cout: formatPrice(totalGeneralTtc),
        plusValue: formatPrice(plusValue),
        fiabilite: 'Élevée (4/5)',
      }
    };
  } else {
    // Solution coliving
    const electriciteHt = 25876;
    const plomberieHt = 20700;
    const pacHt = 13456;
    const menuiseriesIntHt = 10350;
    const cuisineHt = 11730;
    const sanitairesHt = 11040;
    
    // TVA 5.5% : Amélioration énergétique
    const amelioration55Ht = 16560 + 12420 + pacHt; // Isolation + Chauffage + PAC
    
    // TVA 10% : Rénovation
    const renovation10Ht = 21738 + 23633 + 12766 + 23324 + 19666 + 15112 + 12006 + electriciteHt + plomberieHt;
    
    // TVA 20% : Équipements
    const variables20Ht = menuiseriesIntHt + cuisineHt + sanitairesHt;
    
    const totalTravauxHt = amelioration55Ht + renovation10Ht + variables20Ht;
    const tva55 = Math.round(amelioration55Ht * 0.055);
    const tva10 = Math.round(renovation10Ht * 0.10);
    const tva20 = Math.round(variables20Ht * 0.2);
    const tvaTravauxHt = tva55 + tva10 + tva20;
    const totalTravauxTtc = totalTravauxHt + tvaTravauxHt;
    
    const honorairesHt = 7095;
    const honorairesTva = Math.round(honorairesHt * 0.2);
    const honorairesTtc = honorairesHt + honorairesTva;
    
    const prime = -2500;
    
    const totalGeneralHt = totalTravauxHt + honorairesHt + prime;
    const totalGeneralTva = tvaTravauxHt + honorairesTva;
    const totalGeneralTtc = totalTravauxTtc + honorairesTtc + prime;
    
    const valeurImmobiliere = 515000;
    const plusValue = valeurImmobiliere - totalGeneralTtc;
    
    return {
      pricingTotals: {
        ht: formatPrice(totalTravauxHt),
        tva: formatPrice(tvaTravauxHt),
        ttc: formatPrice(totalTravauxTtc),
      },
      honoraires: {
        ht: formatPrice(honorairesHt),
        tva: formatPrice(honorairesTva),
        ttc: formatPrice(honorairesTtc),
      },
      totalGeneral: {
        ht: formatPrice(totalGeneralHt),
        tva: formatPrice(totalGeneralTva),
        ttc: formatPrice(totalGeneralTtc),
      },
      potentiel: {
        valeur: formatPrice(valeurImmobiliere),
        cout: formatPrice(totalGeneralTtc),
        plusValue: formatPrice(plusValue),
        fiabilite: 'Élevée (4/5)',
      }
    };
  }
};
const services = [
  { title: 'ÉTUDES PRÉALABLES AVP', subtitle: '(Phase actuelle)', items: [
    "Diagnostic existant et relevés sur site",
    "Étude de faisabilité des 2 solutions proposées",
    "Estimation financière détaillée des travaux",
    "Analyse du potentiel immobilier et rentabilité"
  ] },
  { title: 'AVANT-PROJET DÉFINITIF', subtitle: '(Phase suivante - Déverrouillage après choix solution)', items: [
    "Plans d'exécution définitifs de la solution retenue",
    "Dépôt autorisation copropriété et ABF",
    "Finalisation du cahier des charges détaillé",
    "Préparation dossier consultation entreprises"
  ] },
  { title: 'CONSULTATION ENTREPRISES', subtitle: '(DCE - Septembre 2025)', items: [
    "Édition cahiers des charges par corps d'état",
    "Consultation et analyse des offres entreprises",
    "Négociation et calage technique des prix",
    "Attribution des marchés et préparation chantier"
  ] },
  { title: 'SUIVI DE CHANTIER', subtitle: '(Octobre 2025 - Avril 2026)', items: [
    "Direction d'exécution des travaux (DET)",
    "Coordination des entreprises et planning",
    "Contrôle qualité et conformité aux plans",
    "Réception des travaux et levée des réserves",
    "⚠️ Note : Cette prestation sera incluse dans l'offre d'ACTIV TRAVAUX"
  ] },
];
const studies = [
  { name: "Diagnostic structurel", cost: "1 500 à 2 500 €", provider: "Bureau d'études structure agréé" },
  { name: "Diagnostic amiante/plomb", cost: "500 à 800 €", provider: "Diagnostiqueur certifié" },
  { name: "Contrôle Consuel", cost: "150 à 200 €", provider: "Consuel (sécurité électrique)" },
];
const insurances = [
  { name: "Assurance Dommage-Ouvrage", cost: "2 500 à 4 000 €", period: "À souscrire avant ouverture du chantier" },
  { name: "DROC (Déclaration d'ouverture de chantier)", cost: "Gratuit", period: "À déposer en mairie avant démarrage" },
];
const exclusions = [
  "Autorisation de copropriété (menuiseries et groupe climatisation)",
  "Occupation du domaine public pour travaux",
  "Études complémentaires si découvertes imprévues",
  "Prestations non mentionnées à la présente estimation"
];
const phases = [
  { name: "Choix solution et validation client", duration: "1 semaine", start: "31 juillet 2025" },
  { name: "Plans définitifs + autorisations urbanisme", duration: "3 semaines", start: "15 août 2025" },
  { name: "Consultation des entreprises", duration: "3 semaines", start: "Début septembre 2025" },
  { name: "Validation offres + démarrage travaux", duration: "2 semaines", start: "15 octobre 2025" },
  { name: "Travaux de rénovation", duration: "6,5 mois", start: "Octobre 2025 - Avril 2026" },
];
const clarifications = [
  { title: "Autorisations et démarches", items: [
    "Autorisation de copropriété pour menuiseries et groupe climatisation",
    "Dossier DP menuiseries (Déclaration Préalable)",
    "Consultation de l'ABF (Architecte des Bâtiments de France)",
    "Déclaration d'ouverture de chantier (DROC) en mairie",
    "Occupation du domaine public ou de la cour copropriété"
  ] },
  { title: "Coordination avec la copropriété", items: [
    "Travaux de toiture de la copropriété (phasage à définir)",
    "Protection temporaire durant les travaux copropriété",
    "Attention aux nuisances sonores du groupe climatisation",
    "Accès et stockage matériaux dans les parties communes"
  ] },
  { title: "Aspects techniques spécifiques", items: [
    "Bureau d'études pour plan de démolition et phasage",
    "Mise en sécurité de l'ouvrage pendant la démolition",
    "Vérification des branchements EP et EU sur réseau public",
    "Coordination importante entre les différents corps de métier"
  ] },
];
const guarantees = [
  "Assurance Responsabilité Civile Professionnelle",
  "Garantie décennale maîtrise d'œuvre",
  "Suivi jusqu'au parfait achèvement",
  "Assistance pendant la période de garantie"
];

const styles = StyleSheet.create({
  page: { backgroundColor: '#fafaf9', color: '#222', padding: 32, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.4 },
  section: { marginBottom: 14, padding: 10, backgroundColor: '#fff', borderRadius: 8, border: '1pt solid #e5e7eb' },
  title: { fontSize: 14, fontWeight: 'bold', color: '#c1a16a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' },
  subtitle: { fontSize: 11, color: '#787346', marginBottom: 6, textAlign: 'center', textTransform: 'uppercase' },
  subtitleSpaced: { fontSize: 11, color: '#787346', marginBottom: 6, textAlign: 'center', textTransform: 'uppercase', marginTop: 18 },
  divider: { borderBottom: '1pt solid #e5e7eb', marginVertical: 8 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderBottom: '1pt solid #e5e7eb', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottom: '1pt solid #e5e7eb' },
  cell: { flex: 1, padding: 2, fontSize: 9 },
  cellRight: { flex: 1, padding: 2, fontSize: 9, textAlign: 'right' },
  small: { fontSize: 8, color: '#666' },
  footer: { marginTop: 18, padding: 8, borderTop: '1pt solid #e5e7eb', textAlign: 'center', color: '#787346', fontSize: 9 },
  pageNumber: { position: 'absolute', fontSize: 8, bottom: 12, right: 32, color: '#b8a994' },
  cover: { justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#fff', padding: 40, position: 'relative' },
  coverTitle: { fontSize: 24, color: '#c1a16a', fontWeight: 'bold', marginBottom: 12, textAlign: 'center', letterSpacing: 2 },
  coverSubtitle: { fontSize: 14, color: '#787346', marginBottom: 18, textAlign: 'center' },
  coverClient: { fontSize: 12, color: '#222', marginBottom: 4, textAlign: 'center' },
  coverDate: { fontSize: 10, color: '#666', textAlign: 'center', marginBottom: 24 },
  coverProgineer: { fontSize: 18, color: '#c1a16a', textAlign: 'center', marginTop: 40, marginBottom: 12, letterSpacing: 1, alignSelf: 'center' },
  coverMetier: { fontSize: 11, color: '#787346', textAlign: 'center', marginTop: 12, marginBottom: 0 },
  coverSeparator: { height: 1, backgroundColor: '#c1a16a', width: 120, alignSelf: 'center', marginVertical: 16 },
  coverBandeau: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 24, backgroundColor: '#c1a16a', justifyContent: 'center', alignItems: 'center' },
  coverBandeauText: { color: '#fff', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  coverLogo: { width: 120, height: 60, objectFit: 'contain', marginBottom: 16, alignSelf: 'center', marginTop: -30 },
  footerBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 24, backgroundColor: '#fafaf9', borderTop: '1pt solid #e5e7eb', justifyContent: 'center', alignItems: 'center' },
  footerBarText: { color: '#787346', fontSize: 9, textAlign: 'center' },
  cellEuro: { flex: 1, padding: 2, fontSize: 9, textAlign: 'right', color: '#222' },
  cell40: { flex: 4, padding: 2, fontSize: 9 },
  cell30: { flex: 3, padding: 2, fontSize: 9 },
  cell50: { flex: 5, padding: 2, fontSize: 9 },
  cell25: { flex: 2.5, padding: 2, fontSize: 9, textAlign: 'center' },
});

const EuroIcon = () => <Text style={{ color: '#c1a16a', fontSize: 10, marginRight: 2 }}>€</Text>;
const LotIcon = ({ icon }) => <Text style={{ fontSize: 12, marginRight: 4 }}>{icon}</Text>;

const FooterBar = () => (
  <View style={styles.footerBar} fixed>
    <Text style={styles.footerBarText}>Contact : progineer.moe@gmail.com | 07 83 76 21 56 | www.progineer.fr | SIRET : 93518578500018</Text>
  </View>
);

const PageNumber = () => (
  <Text style={styles.pageNumber} fixed render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
);

const PdfDocument: React.FC<PdfDocumentProps> = ({ solution = 'coliving' }) => {
  const { pricingTotals, honoraires, totalGeneral, potentiel } = getPdfData(solution);
  
  return (
  <Document>
    {/* Page de garde raffinée avec logo */}
    <Page size="A4" style={styles.page}>
      <View style={styles.cover}>
        {/* Logo centré, ratio respecté, plus grand, plus haut */}
        <Image src="/Diapositive10-removebg-preview.png" style={styles.coverLogo} />
        <Text style={styles.coverTitle}>AVANT-PROJET</Text>
        <Text style={styles.coverSubtitle}>Avant-Projet Détaillé</Text>
        <View style={styles.coverSeparator} />
        <Text style={styles.coverClient}>Client : Pierre Lauzier</Text>
        <Text style={styles.coverClient}>Localisation : 31C rue Curiol, Marseille 13001</Text>
        <Text style={styles.coverClient}>Solution : {solution === 'coliving' ? 'Coliving 4-5 chambres' : '3 Logements indépendants'}</Text>
        <Text style={styles.coverDate}>Date : 24 juillet 2025</Text>
        <View style={{ alignSelf: 'center', width: '100%' }}>
          <Text style={styles.coverProgineer}>PROGINEER</Text>
          <Text style={styles.coverMetier}>Architecture & Maîtrise d'Œuvre</Text>
        </View>
        <View style={styles.coverBandeau} fixed>
          <Text style={styles.coverBandeauText}>PROGINEER - www.progineer.fr</Text>
        </View>
      </View>
      <PageNumber />
    </Page>
    {/* Contenu principal avec pied de page sur chaque page */}
    <Page size="A4" style={styles.page} wrap>
      {/* Synthèse du projet */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>Synthèse du projet</Text>
        <Text style={styles.subtitle}>Caractéristiques du bien</Text>
        {characteristics.map((item, i) => (
          <Text key={i}>{item.label} : {item.value}</Text>
        ))}
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Distribution</Text>
        <Text>Solution 1 - Coliving : 4-5 chambres réparties sur 3 niveaux avec espaces communs</Text>
        <Text>Solution 2 - 3 logements : 1 logement par niveau, chacun avec cuisine et salle d'eau</Text>
        <Text>Surface habitable totale : 150 m² à rénover complètement</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Prestations techniques</Text>
        {technical.map((item, i) => (
          <Text key={i}>• {item}</Text>
        ))}
      </View>
      {/* Saut de page avant la proposition financière détaillée */}
      <View break />
      {/* Détail financier */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>ESTIMATION FINANCIÈRE DÉTAILLÉE</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 2 }]}></Text>
          <Text style={styles.cellEuro}>HT (€)</Text>
          <Text style={styles.cellEuro}>TVA (€)</Text>
          <Text style={styles.cellEuro}>TTC (€)</Text>
        </View>
        {pricingSections.map((section, i) => (
          <React.Fragment key={i}>
            {/* Titre du lot comme ligne de séparation */}
            <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
              <Text style={{ fontWeight: 'bold', color: '#c1a16a', flex: 2, fontSize: 10, padding: 2 }}>- {section.title}</Text>
              <Text style={styles.cellEuro}></Text>
              <Text style={styles.cellEuro}></Text>
              <Text style={styles.cellEuro}></Text>
            </View>
            {section.rows.map((row, j) => (
              <View key={j} style={[styles.tableRow, { backgroundColor: j % 2 === 0 ? '#fff' : '#f9fafb' }]}>
                <Text style={[styles.cell, { flex: 2, paddingLeft: 16 }]}>{
                  i === 0 && j === 0
                    ? row.title.replace('(terrain argileux pentu)', '').replace('milieu de gamme', 'standing').trim()
                    : row.title.replace('milieu de gamme', 'standing')
                }</Text>
                <Text style={styles.cellEuro}>{row.ht}</Text>
                <Text style={styles.cellEuro}>{row.tva}</Text>
                <Text style={styles.cellEuro}>{row.ttc}</Text>
              </View>
            ))}
          </React.Fragment>
        ))}
        {/* Remettre l'en-tête avant le total */}
        <View style={[styles.tableHeader, { backgroundColor: '#f8ecd7' }]}>
          <Text style={{ flex: 2, fontWeight: 'bold', fontSize: 10 }}></Text>
          <Text style={{ ...styles.cellEuro, fontWeight: 'bold', fontSize: 10 }}>HT (€)</Text>
          <Text style={{ ...styles.cellEuro, fontWeight: 'bold', fontSize: 10 }}>TVA (€)</Text>
          <Text style={{ ...styles.cellEuro, fontWeight: 'bold', fontSize: 10 }}>TTC (€)</Text>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#f8ecd7', marginTop: 6, alignItems: 'center', minHeight: 24 }}>
          <Text style={{ flex: 2, fontWeight: 'bold', fontSize: 12, color: '#c1a16a', padding: 4 }}>TOTAL TRAVAUX</Text>
          <Text style={{ ...styles.cellEuro, fontWeight: 'bold', fontSize: 12, color: '#c1a16a' }}>{pricingTotals.ht}</Text>
          <Text style={{ ...styles.cellEuro, fontWeight: 'bold', fontSize: 12, color: '#c1a16a' }}>{pricingTotals.tva}</Text>
          <Text style={{ ...styles.cellEuro, fontWeight: 'bold', fontSize: 12, color: '#c1a16a' }}>{pricingTotals.ttc}</Text>
        </View>
      </View>
      {/* Honoraires */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>Honoraires de maîtrise d'œuvre</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 2 }]}>HONORAIRES</Text>
          <Text style={styles.cellEuro}>HT (€)</Text>
          <Text style={styles.cellEuro}>TVA (€)</Text>
          <Text style={styles.cellEuro}>TTC (€)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { flex: 2 }]}>Honoraires de maîtrise d'œuvre</Text>
          <Text style={styles.cellEuro}>{honoraires.ht}</Text>
          <Text style={styles.cellEuro}>{honoraires.tva}</Text>
          <Text style={styles.cellEuro}>{honoraires.ttc}</Text>
        </View>
      </View>
      {/* Récapitulatif général */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>Récapitulatif général</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 2 }]}></Text>
          <Text style={styles.cellEuro}>HT (€)</Text>
          <Text style={styles.cellEuro}>TVA (€)</Text>
          <Text style={styles.cellEuro}>TTC (€)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { flex: 2 }]}>COÛT DES TRAVAUX RÉNOVATION</Text>
          <Text style={styles.cellEuro}>{pricingTotals.ht}</Text>
          <Text style={styles.cellEuro}>{pricingTotals.tva}</Text>
          <Text style={styles.cellEuro}>{pricingTotals.ttc}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { flex: 2 }]}>HONORAIRES MAÎTRISE D'ŒUVRE</Text>
          <Text style={styles.cellEuro}>{honoraires.ht}</Text>
          <Text style={styles.cellEuro}>{honoraires.tva}</Text>
          <Text style={styles.cellEuro}>{honoraires.ttc}</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#f0f9ff' }]}>
          <Text style={[styles.cell, { flex: 2 }]}>POTENTIEL PRIME CEE</Text>
          <Text style={[styles.cellEuro, { color: '#10b981' }]}>{'-2 500,00 €'}</Text>
          <Text style={styles.cellEuro}>{'0,00 €'}</Text>
          <Text style={[styles.cellEuro, { color: '#10b981' }]}>{'-2 500,00 €'}</Text>
        </View>
        <View style={[styles.tableRow, { backgroundColor: '#f8ecd7', fontWeight: 'bold' }]}>
          <Text style={[styles.cell, { flex: 2, fontWeight: 'bold', color: '#c1a16a' }]}>TOTAL GÉNÉRAL</Text>
          <Text style={[styles.cellEuro, { fontWeight: 'bold', color: '#c1a16a' }]}>{totalGeneral.ht}</Text>
          <Text style={[styles.cellEuro, { fontWeight: 'bold', color: '#c1a16a' }]}>{totalGeneral.tva}</Text>
          <Text style={[styles.cellEuro, { fontWeight: 'bold', color: '#c1a16a' }]}>{totalGeneral.ttc}</Text>
        </View>
      </View>
      {/* Potentiel immobilier */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>Plus-value potentielle</Text>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, flex: 2 }}>Valeur estimée terminée :</Text>
          <Text style={{ fontSize: 10, flex: 1, textAlign: 'right', fontWeight: 'bold' }}>{potentiel.valeur}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, flex: 2 }}>Coût total projet :</Text>
          <Text style={{ fontSize: 10, flex: 1, textAlign: 'right', fontWeight: 'bold' }}>{potentiel.cout}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, flex: 2 }}>Plus-value brute :</Text>
          <Text style={{ fontSize: 10, flex: 1, textAlign: 'right', fontWeight: 'bold', color: '#c1a16a' }}>{potentiel.plusValue}</Text>
        </View>
        <Text style={{ fontSize: 9, color: '#787346', marginTop: 2 }}>(Hors coût terrain et frais annexes)</Text>
      </View>
      {/* Prestations incluses */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>Prestations incluses</Text>
        {services.map((service, i) => (
          <View key={i} style={{ marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold', color: '#c1a16a' }}>{service.title} {service.subtitle || ''}</Text>
            {service.items.map((item, j) => (
              <Text key={j}>• {item}</Text>
            ))}
          </View>
        ))}
      </View>
      {/* Exclusions */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>Prestations non incluses</Text>
        <Text style={styles.subtitleSpaced}>Études obligatoires à votre charge</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.cell50}>Prestation</Text>
          <Text style={styles.cell25}>Coût estimé (€)</Text>
          <Text style={styles.cell25}>Organisme</Text>
        </View>
        {studies.map((study, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.cell50}>{study.name}</Text>
            <Text style={styles.cell25}>{study.cost}</Text>
            <Text style={styles.cell25}>{study.provider}</Text>
          </View>
        ))}
        <Text style={{ fontSize: 9, color: '#787346', marginTop: 8, marginBottom: 8 }}>
          Certaines études peuvent être prises en charge si vous le souhaitez selon négociation commerciale (hors étude de sol)
        </Text>
        <Text style={styles.subtitleSpaced}>Assurances obligatoires à votre charge</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.cell50}>Assurance</Text>
          <Text style={styles.cell25}>Coût estimé (€)</Text>
          <Text style={styles.cell25}>Période</Text>
        </View>
        {insurances.map((insurance, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.cell50}>{insurance.name}</Text>
            <Text style={styles.cell25}>{insurance.cost}</Text>
            <Text style={styles.cell25}>{insurance.period}</Text>
          </View>
        ))}
        <Text style={styles.subtitleSpaced}>Autres exclusions</Text>
        {exclusions.map((item, i) => (
          <Text key={i}>• {item.replace('(si éloignés)', '').trim()}</Text>
        ))}
      </View>
      {/* Planning */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>Planning prévisionnel</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 2 }]}>Phase</Text>
          <Text style={styles.cell}>Durée</Text>
          <Text style={styles.cell}>Délai</Text>
        </View>
        {phases.map((phase, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.cell, { flex: 2 }]}>{phase.name}</Text>
            <Text style={styles.cell}>{phase.duration}</Text>
            <Text style={styles.cell}>{phase.start}</Text>
          </View>
        ))}
        {/* Total planning */}
        <View style={[styles.tableRow, { backgroundColor: '#f3f4f6', fontWeight: 'bold' }]}>
          <Text style={{ flex: 2, fontWeight: 'bold' }}>DÉLAI TOTAL</Text>
          <Text style={{ fontWeight: 'bold' }}>9 mois</Text>
          <Text style={{ fontWeight: 'bold' }}>Juillet 2025 - Avril 2026</Text>
        </View>
        <Text style={styles.subtitleSpaced}>Points à clarifier</Text>
        {clarifications.map((section, i) => (
          <View key={i} style={{ marginBottom: 2 }}>
            <Text style={{ fontWeight: 'bold', color: '#c1a16a' }}>{section.title}</Text>
            {section.items.map((item, j) => (
              <Text key={j}>• {item}</Text>
            ))}
          </View>
        ))}
      </View>
      {/* Footer */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>Garanties & conditions</Text>
        <Text style={styles.subtitle}>Nos garanties</Text>
        {guarantees.map((item, i) => (
          <Text key={i}>• {item}</Text>
        ))}
        <View style={styles.divider} />
        <Text style={{ textAlign: 'center', color: '#787346', marginTop: 6 }}>
          Cette proposition est établie sur la base des éléments transmis et reste soumise à la validation des contraintes techniques et réglementaires de rénovation, notamment les autorisations de copropriété et les démarches administratives.
        </Text>
        <Text style={{ textAlign: 'center', color: '#787346', marginTop: 6 }}>
          PROGINEER - Votre partenaire pour un projet réussi
        </Text>
      </View>
      <FooterBar />
      <PageNumber />
    </Page>
  </Document>
  );
};

export default PdfDocument; 