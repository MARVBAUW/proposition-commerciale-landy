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

// Données extraites des composants React (synchronisées avec l'UI web)
const characteristics = [
  { label: 'Surface habitable', value: '145 m²' },
  { label: 'Configuration', value: 'Maison à étage avec piscine' },
  { label: 'Terrain', value: 'Argileux, pentu' },
  { label: 'Piscine', value: '32 m²' },
  { label: 'Chambres', value: '4 chambres + 1 bureau' },
  { label: 'Salles d\'eau', value: '2 salles de bain + 1 salle d\'eau' },
];
const technical = [
  'Chauffage par pompe à chaleur réversible',
  'Climatisation complète',
  'Domotique',
  'Menuiseries aluminium double vitrage',
  'Volets roulants électriques',
  'Carrelage milieu de gamme',
  'Toiture tuiles rondes',
  'Façade enduit'
];
const pricingSections = [
  {
    title: 'TERRASSEMENT ET VIABILISATION', icon: '🚧', rows: [
      { title: 'Terrassements viabilisation (terrain argileux pentu)', ht: '32 987,50 €', tva: '6 597,50 €', ttc: '39 585,00 €' },
    ], subtotal: { ht: '32 987,50 €', tva: '6 597,50 €', ttc: '39 585,00 €' }
  },
  {
    title: 'GROS ŒUVRE ET MAÇONNERIE', icon: '🏗️', rows: [
      { title: 'Gros œuvre parpaing', ht: '73 587,50 €', tva: '14 717,50 €', ttc: '88 305,00 €' },
    ], subtotal: { ht: '73 587,50 €', tva: '14 717,50 €', ttc: '88 305,00 €' }
  },
  {
    title: 'CHARPENTE ET COUVERTURE', icon: '🏠', rows: [
      { title: 'Charpente industrielle', ht: '6 027,87 €', tva: '1 205,58 €', ttc: '7 233,45 €' },
      { title: 'Couverture tuile ronde', ht: '17 381,87 €', tva: '3 476,38 €', ttc: '20 858,25 €' },
    ], subtotal: { ht: '23 409,74 €', tva: '4 681,96 €', ttc: '28 091,70 €' }
  },
  {
    title: 'ISOLATION ET FAÇADES', icon: '🧱', rows: [
      { title: 'Isolation thermique réglementaire', ht: '10 150,00 €', tva: '2 030,00 €', ttc: '12 180,00 €' },
      { title: 'Façade enduit', ht: '8 881,25 €', tva: '1 776,25 €', ttc: '10 657,50 €' },
    ], subtotal: { ht: '19 031,25 €', tva: '3 806,25 €', ttc: '22 837,50 €' }
  },
  {
    title: 'MENUISERIES EXTÉRIEURES', icon: '🚪', rows: [
      { title: 'Menuiseries extérieures aluminium', ht: '21 238,87 €', tva: '4 247,79 €', ttc: '25 486,66 €' },
    ], subtotal: { ht: '21 238,87 €', tva: '4 247,79 €', ttc: '25 486,66 €' }
  },
  {
    title: 'INSTALLATIONS ÉLECTRIQUES', icon: '⚡', rows: [
      { title: 'Électricité haut de gamme avec domotique', ht: '24 106,25 €', tva: '4 821,25 €', ttc: '28 927,50 €' },
    ], subtotal: { ht: '24 106,25 €', tva: '4 821,25 €', ttc: '28 927,50 €' }
  },
  {
    title: 'PLOMBERIE ET SANITAIRE', icon: '🚰', rows: [
      { title: 'Plomberie prestations de base', ht: '10 150,00 €', tva: '2 030,00 €', ttc: '12 180,00 €' },
    ], subtotal: { ht: '10 150,00 €', tva: '2 030,00 €', ttc: '12 180,00 €' }
  },
  {
    title: 'CHAUFFAGE ET CLIMATISATION', icon: '🌡️', rows: [
      { title: 'Chauffage de base', ht: '7 612,50 €', tva: '1 522,50 €', ttc: '9 135,00 €' },
      { title: 'Climatisation', ht: '8 246,87 €', tva: '1 649,38 €', ttc: '9 896,25 €' },
    ], subtotal: { ht: '15 859,37 €', tva: '3 171,88 €', ttc: '19 031,25 €' }
  },
  {
    title: 'CLOISONS ET PLÂTRERIE', icon: '🧱', rows: [
      { title: 'Plâtrerie avec spécificités techniques', ht: '13 321,87 €', tva: '2 664,38 €', ttc: '15 986,25 €' },
    ], subtotal: { ht: '13 321,87 €', tva: '2 664,38 €', ttc: '15 986,25 €' }
  },
  {
    title: 'MENUISERIES INTÉRIEURES', icon: '🚪', rows: [
      { title: 'Menuiseries intérieures standing', ht: '7 612,50 €', tva: '1 522,50 €', ttc: '9 135,00 €' },
    ], subtotal: { ht: '7 612,50 €', tva: '1 522,50 €', ttc: '9 135,00 €' }
  },
  {
    title: 'REVÊTEMENTS DE SOLS ET MURS', icon: '🏠', rows: [
      { title: 'Carrelage standing', ht: '11 571,00 €', tva: '2 314,20 €', ttc: '13 885,20 €' },
      { title: 'Faïence standing', ht: '840,00 €', tva: '168,00 €', ttc: '1 008,00 €' },
    ], subtotal: { ht: '12 411,00 €', tva: '2 482,20 €', ttc: '14 893,20 €' }
  },
  {
    title: 'PEINTURE ET FINITIONS', icon: '🎨', rows: [
      { title: 'Peinture de base', ht: '7 358,75 €', tva: '1 471,75 €', ttc: '8 830,50 €' },
    ], subtotal: { ht: '7 358,75 €', tva: '1 471,75 €', ttc: '8 830,50 €' }
  },
  {
    title: 'ÉNERGIES RENOUVELABLES', icon: '🔋', rows: [
      { title: 'Optimisation énergétique', ht: '9 070,25 €', tva: '1 814,05 €', ttc: '10 884,30 €' },
    ], subtotal: { ht: '9 070,25 €', tva: '1 814,05 €', ttc: '10 884,30 €' }
  },
  {
    title: 'AMÉNAGEMENTS EXTÉRIEURS', icon: '🌿', rows: [
      { title: 'Aménagement paysager', ht: '503,12 €', tva: '100,63 €', ttc: '603,75 €' },
      { title: 'Portail standard', ht: '1 968,75 €', tva: '393,75 €', ttc: '2 362,50 €' },
      { title: 'Terrasse (25 m²)', ht: '5 075,00 €', tva: '1 015,00 €', ttc: '6 090,00 €' },
    ], subtotal: { ht: '7 546,87 €', tva: '1 509,38 €', ttc: '9 056,25 €' }
  },
  {
    title: 'ÉQUIPEMENTS AQUATIQUES', icon: '🏊', rows: [
      { title: 'Piscine enterrée béton (32 m²)', ht: '37 800,00 €', tva: '7 560,00 €', ttc: '45 360,00 €' },
    ], subtotal: { ht: '37 800,00 €', tva: '7 560,00 €', ttc: '45 360,00 €' }
  },
  {
    title: 'AMÉNAGEMENT CUISINE', icon: '🍳', rows: [
      { title: 'Cuisine gamme supérieure', ht: '11 812,50 €', tva: '2 362,50 €', ttc: '14 175,00 €' },
    ], subtotal: { ht: '11 812,50 €', tva: '2 362,50 €', ttc: '14 175,00 €' }
  },
  {
    title: 'ÉQUIPEMENTS SANITAIRES', icon: '🚿', rows: [
      { title: 'Salles de bain premium (2 unités)', ht: '7 350,00 €', tva: '1 470,00 €', ttc: '8 820,00 €' },
    ], subtotal: { ht: '7 350,00 €', tva: '1 470,00 €', ttc: '8 820,00 €' }
  },
];
const pricingTotals = {
  ht: '332 725,52 €',
  tva: '66 545,11 €',
  ttc: '399 270,63 €',
};
const honoraires = {
  ht: '27 283,49 €',
  tva: '5 456,70 €',
  ttc: '32 740,19 €',
};
const totalGeneral = {
  ht: '360 009,01 €',
  tva: '72 001,81 €',
  ttc: '432 010,82 €',
};
const potentiel = {
  valeur: '1 563 820 €',
  cout: '432 011 €',
  plusValue: '1 131 809 €',
  fiabilite: 'Très élevée (5/5)',
};
const services = [
  { title: 'CONCEPTION', subtitle: '(Esquisse à Permis de Construire)', items: [
    "Esquisse : Étude de faisabilité et premiers plans",
    "Avant-projet sommaire (APS) : Définition des volumes et surfaces",
    "Avant-projet définitif (APD) : Plans définitifs et choix techniques",
    "Dossier de Permis de Construire : Constitution et dépôt du dossier"
  ] },
  { title: 'PRÉPARATION DES TRAVAUX', items: [
    "Projet d'exécution : Plans techniques détaillés pour les entreprises",
    "Assistance aux contrats de travaux : Aide à la consultation et sélection des entreprises",
    "Établissement du planning général des travaux"
  ] },
  { title: 'SUIVI DE CHANTIER', items: [
    "Direction d'exécution des travaux (DET) : Coordination et contrôle du chantier",
    "Visites régulières : Vérification de la conformité aux plans",
    "Réunions de chantier : Animation et compte-rendus",
    "Validation des travaux : Contrôle qualité à chaque étape"
  ] },
  { title: 'LIVRAISON', items: [
    "Opérations préalables à la réception (OPR) : Vérifications finales",
    "Assistance à la réception des travaux : Accompagnement lors de la livraison",
    "Levée des réserves : Suivi jusqu'à parfait achèvement",
    "Remise de la documentation : Dossier des ouvrages exécutés (DOE)"
  ] },
];
const studies = [
  { name: "Étude de sol G1 et G2", cost: "2 500 à 4 000 €", provider: "Bureau d'études géotechniques agréé (terrain argileux)" },
  { name: "Étude thermique RE2020", cost: "800 à 1 500 €", provider: "Bureau d'études thermiques certifié" },
  { name: "Test de perméabilité", cost: "300 à 500 €", provider: "Organisme agréé" },
  { name: "Contrôle Consuel", cost: "150 à 200 €", provider: "Consuel (sécurité électrique)" },
];
const insurances = [
  { name: "Assurance Dommage-Ouvrage", cost: "3 500 à 5 000 €", period: "À souscrire avant ouverture du chantier" },
];
const exclusions = [
  "Aménagement paysager complet (seul aménagement de base inclus)",
  "Clôtures additionnelles (portail standard inclus)",
  "Raccordements aux réseaux (si éloignés)",
  "Taxes d'aménagement et archéologique",
  "Taxe foncière",
  "Études géotechniques complémentaires si sol complexe"
];
const phases = [
  { name: "Études et permis de construire", duration: "3-4 mois", start: "À partir de la signature" },
  { name: "Instruction du permis", duration: "2-3 mois", start: "Dépôt en mairie" },
  { name: "Préparation des travaux", duration: "1 mois", start: "Après obtention PC" },
  { name: "Travaux de construction", duration: "10-12 mois", start: "Selon planning détaillé" },
];
const clarifications = [
  { title: "Urbanisme et réglementations", items: [
    "Validation de l'emprise au sol autorisée selon le PLU du Lavandou",
    "Vérification des prescriptions architecturales locales",
    "Contraintes liées à la proximité de la mer (Plan de Prévention des Risques)"
  ] },
  { title: "Terrain et contraintes techniques", items: [
    "Étude géotechnique approfondie nécessaire (terrain argileux pentu)",
    "Stabilité des sols et fondations adaptées",
    "Gestion des eaux pluviales sur terrain pentu",
    "Accessibilité du chantier"
  ] },
  { title: "Viabilisation", items: [
    "Distance des arrivées électricité et télécom",
    "Coût des raccordements si éloignés de la parcelle",
    "Évacuation des eaux usées et pluviales"
  ] },
];
const guarantees = [
  "Assurance Responsabilité Civile Professionnelle",
  "Garantie décennale maîtrise d'œuvre",
  "Suivi jusqu'au parfait achèvement",
  "Assistance pendant la période de garantie"
];
const nextSteps = [
  "Validation de cette proposition par vos soins",
  "Signature du contrat de maîtrise d'œuvre",
  "Lancement des études préliminaires",
  "Sécurisation du terrain (compromis de vente)",
  "Démarrage des études de sol et thermiques (prioritaire - terrain argileux)"
];
const conditions = [
  { label: "Validité de l'offre", value: "30 jours" },
  { label: "Accompte au démarrage", value: "20% = 6 548,04 € TTC" },
  { label: "Révision des prix", value: "Forfaitaire (pas de révision)" },
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
    <Text style={styles.footerBarText}>Contact : progineer.moe@gmail.com | 07 83 76 21 56 | www.progineer.fr</Text>
  </View>
);

const PageNumber = () => (
  <Text style={styles.pageNumber} fixed render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
);

const PdfDocument = () => (
  <Document>
    {/* Page de garde raffinée avec logo */}
    <Page size="A4" style={styles.page}>
      <View style={styles.cover}>
        {/* Logo centré, ratio respecté, plus grand, plus haut */}
        <Image src="/Diapositive10-removebg-preview.png" style={styles.coverLogo} />
        <Text style={styles.coverTitle}>PROPOSITION COMMERCIALE</Text>
        <Text style={styles.coverSubtitle}>Construction neuve individuelle</Text>
        <View style={styles.coverSeparator} />
        <Text style={styles.coverClient}>Clients : Monsieur et Madame LANDY</Text>
        <Text style={styles.coverClient}>Localisation : Le Lavandou (83980)</Text>
        <Text style={styles.coverDate}>Date : 21 juillet 2025</Text>
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
        <Text>Rez-de-chaussée : Entrée, 3 chambres, 1 bureau, salle de bain, salle d'eau, WC, placards</Text>
        <Text>Étage : Salon/salle à manger, cuisine ouverte, suite parentale, salle d'eau, WC, cellier, terrasse</Text>
        <Text>Extérieurs : Piscine 32 m², terrasse, parking</Text>
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
        <Text style={styles.title}>Proposition financière détaillée</Text>
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
          <Text style={[styles.cell, { flex: 2 }]}>TOTAL GÉNÉRAL</Text>
          <Text style={styles.cellEuro}>HT (€)</Text>
          <Text style={styles.cellEuro}>TVA (€)</Text>
          <Text style={styles.cellEuro}>TTC (€)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { flex: 2 }]}>TOTAL</Text>
          <Text style={styles.cellEuro}>{totalGeneral.ht}</Text>
          <Text style={styles.cellEuro}>{totalGeneral.tva}</Text>
          <Text style={styles.cellEuro}>{totalGeneral.ttc}</Text>
        </View>
      </View>
      {/* Potentiel immobilier */}
      <View style={styles.section} wrap={false}>
        <Text style={styles.title}>Plus-value potentielle</Text>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, flex: 2 }}>Valeur estimée terminée :</Text>
          <Text style={{ fontSize: 10, flex: 1, textAlign: 'right', fontWeight: 'bold' }}>1 563 820 €</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, flex: 2 }}>Coût total projet :</Text>
          <Text style={{ fontSize: 10, flex: 1, textAlign: 'right', fontWeight: 'bold' }}>432 011 €</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, flex: 2 }}>Plus-value brute :</Text>
          <Text style={{ fontSize: 10, flex: 1, textAlign: 'right', fontWeight: 'bold', color: '#c1a16a' }}>1 131 809 €</Text>
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
          <Text style={{ flex: 2, fontWeight: 'bold' }}>Total</Text>
          <Text style={{ fontWeight: 'bold' }}>16-20 mois</Text>
          <Text style={{ fontWeight: 'bold' }}>De la signature à la livraison</Text>
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
        <Text style={styles.subtitleSpaced}>Prochaines étapes</Text>
        {nextSteps.map((item, i) => (
          <Text key={i}>{i + 1}. {item}</Text>
        ))}
        {/* Conditions */}
        <Text style={styles.subtitleSpaced}>Conditions</Text>
        {conditions.map((item, i) => (
          item.label === "Accompte au démarrage" ? (
            <Text key={i} style={{ color: '#c1a16a', fontWeight: 'bold', marginBottom: 4 }}>
              {item.label} : {item.value}
            </Text>
          ) : (
            <Text key={i}>{item.label} : {item.value}</Text>
          )
        ))}
        <View style={styles.divider} />
        <Text style={{ textAlign: 'center', color: '#787346', marginTop: 6 }}>
          Cette proposition est établie sur la base des éléments transmis et reste soumise à la validation des contraintes techniques et réglementaires, notamment liées à la nature argileuse et pentue du terrain.
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

export default PdfDocument; 