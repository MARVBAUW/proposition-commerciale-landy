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
  { label: 'Surface habitable', value: '150 m²' },
  { label: 'Configuration', value: 'Bâtiment 3 niveaux à rénover' },
  { label: 'Type de projet', value: 'Rénovation lourde' },
  { label: 'Solutions proposées', value: '2 options : Coliving ou 3 logements' },
  { label: 'Option Coliving', value: '4-5 chambres sur 3 niveaux' },
  { label: 'Option 3 logements', value: '1 logement par niveau' },
];

const technicalColiving = [
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

const technical3Logements = [
  'Démolition complète : planchers, cloisons, équipements existants',
  'Gros œuvre : reprise structure, planchers bois, réseaux évacuation',
  'Charpente : rénovation traditionnelle avec renforcement',
  'Isolation thermique réglementaire renforcée',
  'Menuiseries bois neuves avec porte anti-effraction',
  'Installations électriques renforcées pour 3 compteurs',
  'Plomberie séparative pour chaque logement',
  'Chauffage PAC air/air multi-split pour 3 logements',
  'Cloisons de distribution et finitions plâtrerie',
  'Revêtements : carrelage, faïence, parquet selon zones',
  'Peinture et finitions dans tous les locaux',
  'Blocs-portes palières sécurisés pour accès indépendants',
  'Équipements cuisine pour 3 logements (3 × 5 500€)',
  'Équipements sanitaires : 2 salles d\'eau'
];

// Fonction pour calculer les données selon la solution avec TVA différentielle
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
    const honorairesTtc = Math.round(honorairesHt * 1.2);
    const prime = -2500;
    
    const totalGeneralTtc = totalTravauxTtc + honorairesTtc + prime;
    
    return {
      totalHt: totalTravauxHt,
      totalTtc: totalGeneralTtc,
      electriciteHt,
      plomberieHt,
      pacHt,
      menuiseriesIntHt,
      cuisineHt,
      sanitairesHt,
      honoraires: honorairesHt,
      prime,
      potentiel: {
        valeurTotale: 471000,
        loyer: 1884,
        plusValue: 471000 - totalGeneralTtc
      }
    };
  } else {
    // Coûts variables pour solution coliving
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
    const honorairesTtc = Math.round(honorairesHt * 1.2);
    const prime = -2500;
    
    const totalGeneralTtc = totalTravauxTtc + honorairesTtc + prime;
    
    return {
      totalHt: totalTravauxHt,
      totalTtc: totalGeneralTtc,
      electriciteHt,
      plomberieHt,
      pacHt,
      menuiseriesIntHt,
      cuisineHt,
      sanitairesHt,
      honoraires: honorairesHt,
      prime,
      potentiel: {
        valeurTotale: 515000,
        loyer: 2420,
        plusValue: 515000 - totalGeneralTtc
      }
    };
  }
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR', 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(price).replace(/[\u202F\u00A0]/g, ' '); // Remplace tous les espaces insécables par espaces normaux
};

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 25,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#c1a16a',
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
    color: '#787346',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
    lineHeight: 1.4
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#787346',
    marginBottom: 10
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#787346',
    padding: 5
  },
  tableCell: {
    fontSize: 9,
    textAlign: 'center',
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  comparisonColumn: {
    width: '48%'
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#c1a16a',
    backgroundColor: '#f5f5f5',
    padding: 8
  }
});

const PdfDocumentDual: React.FC = () => {
  const colivingData = getPdfData('coliving');
  const logementsData = getPdfData('logements');

  return (
    <Document>
      {/* Page de garde */}
      <Page size="A4" style={styles.page}>
        <View style={{ textAlign: 'center', marginBottom: 40 }}>
          <Text style={styles.title}>AVANT-PROJET DÉTAILLÉ</Text>
          <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold', marginBottom: 10 }]}>
            Rénovation Pierre Lauzier
          </Text>
          <Text style={[styles.text, { fontSize: 14, marginBottom: 5 }]}>
            31C rue Curiol, Marseille 13001
          </Text>
          <Text style={[styles.text, { fontSize: 12, color: '#787346' }]}>
            PROGINEER - Architecture & Maîtrise d'Œuvre
          </Text>
        </View>

        <View style={{ backgroundColor: '#f5f5f5', padding: 15, marginBottom: 20 }}>
          <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 10 }]}>
            COMPARATIF DES 2 SOLUTIONS PROPOSÉES
          </Text>
          <Text style={[styles.text, { textAlign: 'center', fontSize: 10, color: '#666' }]}>
            Analyse comparative technique et financière - 150 m² habitables sur 3 niveaux
          </Text>
        </View>

        {/* Caractéristiques du projet */}
        <Text style={styles.sectionTitle}>SYNTHÈSE DU PROJET</Text>
        {characteristics.map((item, index) => (
          <Text key={index} style={styles.text}>• {item.label}: {item.value}</Text>
        ))}

        {/* Résumé des différences principales */}
        <Text style={styles.sectionTitle}>PRINCIPALES DIFFÉRENCES</Text>
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonColumn}>
            <Text style={[styles.comparisonTitle, { backgroundColor: '#e3f2fd' }]}>COLIVING - 4/5 CHAMBRES</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Cuisine commune partagée</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• 2 salles d'eau pour tous</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Installation électrique standard</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Plomberie centralisée</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Climatisation simple</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Revenus locatifs optimisés</Text>
          </View>
          
          <View style={styles.comparisonColumn}>
            <Text style={[styles.comparisonTitle, { backgroundColor: '#f3e5f5' }]}>3 LOGEMENTS INDÉPENDANTS</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• 3 cuisines équipées (une par logement)</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• 3 salles d'eau complètes</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Électricité renforcée - 3 compteurs</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Plomberie séparative</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Climatisation multi-split</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Blocs-portes palières sécurisés</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Indépendance totale - Vente séparée possible</Text>
          </View>
        </View>

        {/* Saut de page avant les prestations techniques */}
        <View break />
        
        {/* Comparaison des prestations techniques */}
        <Text style={styles.sectionTitle}>PRESTATIONS TECHNIQUES COMPARATIVES</Text>
        
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonColumn}>
            <Text style={styles.comparisonTitle}>SOLUTION COLIVING</Text>
            {technicalColiving.map((item, index) => (
              <Text key={index} style={[styles.text, { fontSize: 8 }]}>• {item}</Text>
            ))}
          </View>
          
          <View style={styles.comparisonColumn}>
            <Text style={styles.comparisonTitle}>SOLUTION 3 LOGEMENTS</Text>
            {technical3Logements.map((item, index) => (
              <Text key={index} style={[styles.text, { fontSize: 8 }]}>• {item}</Text>
            ))}
          </View>
        </View>
      </Page>

      {/* Page comparative des coûts */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>COMPARATIF FINANCIER DES ESTIMATIONS</Text>

        {/* Tableau comparatif des coûts */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Poste de travaux</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Coliving</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>3 Logements</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Différence</Text>
            </View>
          </View>
          
          {/* Postes identiques */}
          <View style={[styles.tableRow, { backgroundColor: '#f9f9f9' }]}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8, fontWeight: 'bold' }]}>POSTES IDENTIQUES</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>-</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>-</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>-</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>Démolition complète</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>{formatPrice(21738)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>{formatPrice(21738)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>Identique</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>Gros œuvre</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>{formatPrice(23633)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>{formatPrice(23633)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>Identique</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>Charpente/Isolation/Menuiseries ext.</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>{formatPrice(12766 + 16560 + 23324)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>{formatPrice(12766 + 16560 + 23324)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>Identique</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>Cloisons/Revêtements/Peinture</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>{formatPrice(19666 + 15112 + 12006)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>{formatPrice(19666 + 15112 + 12006)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>Identique</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>Chauffage central</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>{formatPrice(12420)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>{formatPrice(12420)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>Identique</Text>
            </View>
          </View>

          {/* Postes variables */}
          <View style={[styles.tableRow, { backgroundColor: '#fff3e0' }]}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8, fontWeight: 'bold' }]}>POSTES VARIABLES</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>-</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>-</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontSize: 8 }]}>-</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Électricité</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(colivingData.electriciteHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(logementsData.electriciteHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>+{formatPrice(logementsData.electriciteHt - colivingData.electriciteHt)}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Plomberie</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(colivingData.plomberieHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(logementsData.plomberieHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>+{formatPrice((logementsData.plomberieHt - colivingData.plomberieHt))}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Chauffage/Clim PAC</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(colivingData.pacHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(logementsData.pacHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>+{formatPrice((logementsData.pacHt - colivingData.pacHt))}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Menuiseries intérieures</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(colivingData.menuiseriesIntHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(logementsData.menuiseriesIntHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>+{formatPrice((logementsData.menuiseriesIntHt - colivingData.menuiseriesIntHt))}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Équipements cuisine</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(colivingData.cuisineHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(logementsData.cuisineHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>+{formatPrice((logementsData.cuisineHt - colivingData.cuisineHt))}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Équipements sanitaires</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(colivingData.sanitairesHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(logementsData.sanitairesHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>+{formatPrice((logementsData.sanitairesHt - colivingData.sanitairesHt))}</Text>
            </View>
          </View>

          {/* Sous-total travaux */}
          <View style={[styles.tableRow, { backgroundColor: '#e8f4f8' }]}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL TRAVAUX HT</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{formatPrice(colivingData.totalHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{formatPrice(logementsData.totalHt)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>+{formatPrice((logementsData.totalHt - colivingData.totalHt))}</Text>
            </View>
          </View>

          {/* Honoraires */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Honoraires maîtrise d'œuvre</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(8514)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(8514)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Identique</Text>
            </View>
          </View>

          {/* Prime CEE */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Prime CEE (sous conditions)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(-2500)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(-2500)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Identique</Text>
            </View>
          </View>

          {/* Total final */}
          <View style={[styles.tableRow, { backgroundColor: '#f5f5f5' }]}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL GÉNÉRAL TTC</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{formatPrice(colivingData.totalTtc)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{formatPrice(logementsData.totalTtc)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>+{formatPrice((logementsData.totalTtc - colivingData.totalTtc))}</Text>
            </View>
          </View>
        </View>

        {/* Potentiel immobilier comparatif */}
        <Text style={styles.sectionTitle}>POTENTIEL IMMOBILIER COMPARATIF</Text>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Indicateur</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Coliving</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>3 Logements</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Différence</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Valeur estimée</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(colivingData.potentiel.valeurTotale)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(logementsData.potentiel.valeurTotale)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice((logementsData.potentiel.valeurTotale - colivingData.potentiel.valeurTotale))}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Loyer mensuel</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(colivingData.potentiel.loyer)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(logementsData.potentiel.loyer)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice((logementsData.potentiel.loyer - colivingData.potentiel.loyer))}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Plus-value</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(colivingData.potentiel.plusValue)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice(logementsData.potentiel.plusValue)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatPrice((logementsData.potentiel.plusValue - colivingData.potentiel.plusValue))}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.text, { marginTop: 20, fontSize: 8, fontStyle: 'italic' }]}>
          Cette estimation est établie sur la base des éléments transmis et reste soumise à la validation des contraintes techniques et réglementaires de rénovation, notamment les autorisations de copropriété et les démarches administratives.
        </Text>
      </Page>

      {/* Page de recommandations */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>ANALYSE ET RECOMMANDATIONS</Text>

        {/* Recommandations financières */}
        <Text style={styles.sectionTitle}>ANALYSE FINANCIÈRE</Text>
        <View style={{ marginBottom: 15 }}>
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 5 }]}>
            Coût supplémentaire solution 3 logements : +{formatPrice(logementsData.totalTtc - colivingData.totalTtc)}
          </Text>
          <Text style={styles.text}>
            • La solution 3 logements nécessite un investissement supplémentaire de {formatPrice(logementsData.totalTtc - colivingData.totalTtc)}, soit +{Math.round(((logementsData.totalTtc - colivingData.totalTtc) / colivingData.totalTtc) * 100)}%
          </Text>
          <Text style={styles.text}>
            • Cet écart s'explique principalement par les installations séparatives (électricité, plomberie) et les équipements supplémentaires
          </Text>
          <Text style={styles.text}>
            • Le retour sur investissement est plus rapide avec la plus-value immobilière supérieure (+{formatPrice(logementsData.potentiel.plusValue - colivingData.potentiel.plusValue)})
          </Text>
        </View>

        {/* Recommandations techniques */}
        <Text style={styles.sectionTitle}>POINTS TECHNIQUES CRUCIAUX</Text>
        <Text style={styles.text}>• <Text style={{ fontWeight: 'bold' }}>Autorisations copropriété</Text> : Indispensables pour menuiseries et groupes climatisation</Text>
        <Text style={styles.text}>• <Text style={{ fontWeight: 'bold' }}>Contraintes ABF</Text> : Validation Architecte des Bâtiments de France requis</Text>
        <Text style={styles.text}>• <Text style={{ fontWeight: 'bold' }}>Phasage travaux</Text> : Coordination avec les travaux de toiture copropriété</Text>

        {/* Recommandations d'investissement */}
        <Text style={styles.sectionTitle}>RECOMMANDATIONS STRATÉGIQUES</Text>
        
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonColumn}>
            <Text style={[styles.comparisonTitle, { backgroundColor: '#e8f5e8' }]}>COLIVING RECOMMANDÉ SI :</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Budget d'investissement limité</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Recherche de rentabilité immédiate</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Gestion locative simplifiée souhaitée</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Marché locatif étudiant dynamique</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Possibilité de conversion ultérieure</Text>
          </View>
          
          <View style={styles.comparisonColumn}>
            <Text style={[styles.comparisonTitle, { backgroundColor: '#fff3e0' }]}>3 LOGEMENTS RECOMMANDÉS SI :</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Budget d'investissement confortable</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Stratégie patrimoniale long terme</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Possibilité de vente séparée</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Diversification des profils locataires</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>• Plus-value immobilière prioritaire</Text>
          </View>
        </View>

        {/* Planning et étapes */}
        <Text style={styles.sectionTitle}>PLANNING PRÉVISIONNEL</Text>
        <Text style={styles.text}>• <Text style={{ fontWeight: 'bold' }}>Choix solution :</Text> Juillet 2025</Text>
        <Text style={styles.text}>• <Text style={{ fontWeight: 'bold' }}>Plans définitifs + autorisations :</Text> Août 2025 (3 semaines)</Text>
        <Text style={styles.text}>• <Text style={{ fontWeight: 'bold' }}>Consultation entreprises :</Text> Septembre 2025 (3 semaines)</Text>
        <Text style={styles.text}>• <Text style={{ fontWeight: 'bold' }}>Démarrage travaux :</Text> Octobre 2025</Text>
        <Text style={styles.text}>• <Text style={{ fontWeight: 'bold' }}>Fin travaux :</Text> Avril 2026 (6,5 mois)</Text>

        {/* Contact et signature */}
        <View style={{ marginTop: 30, padding: 15, backgroundColor: '#f8f9fa' }}>
          <Text style={[styles.text, { fontSize: 10, fontWeight: 'bold', marginBottom: 5 }]}>
            PROGINEER - Architecture & Maîtrise d'Œuvre
          </Text>
          <Text style={[styles.text, { fontSize: 9 }]}>
            Contact : progineer.moe@gmail.com | Tél: 07 83 76 21 56
          </Text>
          <Text style={[styles.text, { fontSize: 8, marginTop: 5 }]}>
            PGR PROGINEER SAS au capital de 1 500 € - SIRET : 93518578500018
          </Text>
          <Text style={[styles.text, { fontSize: 8 }]}>
            RCS PARIS : 935185785 / RM : 935185785 75 - N° TVA Intracom. : FR80935185785
          </Text>
          <Text style={[styles.text, { fontSize: 8 }]}>
            Mode de paiement IBAN : FR76 1732 8844 0036 0407 3262 287 - BIC : SWNBFR22
          </Text>
          <Text style={[styles.text, { fontSize: 8, fontStyle: 'italic', marginTop: 10 }]}>
            Document établi le 24 juillet 2025 - Valable 3 mois
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocumentDual;