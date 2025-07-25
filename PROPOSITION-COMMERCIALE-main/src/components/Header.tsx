import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import App from '../App';
import ProjectSummary from './ProjectSummary';
import PricingBreakdown from './PricingBreakdown';
import Services from './Services';
import TotalSummary from './TotalSummary';
import Exclusions from './Exclusions';
import Timeline from './Timeline';
import Footer from './Footer';
import html2pdf from 'html2pdf.js';

const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: '#fafaf9',
    color: '#222',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c1a16a',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#787346',
    marginBottom: 8,
  },
  divider: {
    borderBottom: '1pt solid #e5e7eb',
    marginVertical: 12,
  },
});

const PDFDocument = () => (
  <Document>
    <Page size="A4" style={pdfStyles.page} wrap>
      {/* En-tête */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.title}>PROGINEER</Text>
        <Text style={pdfStyles.subtitle}>Architecture & Maîtrise d'Œuvre</Text>
        <Text style={{ fontSize: 18, color: '#c1a16a', marginBottom: 8 }}>PROPOSITION COMMERCIALE</Text>
        <Text style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Construction neuve individuelle</Text>
      </View>
      <View style={pdfStyles.divider} />
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subtitle}>CLIENTS : Monsieur et Madame LANDY</Text>
        <Text style={pdfStyles.subtitle}>LOCALISATION : Le Lavandou (83980)</Text>
        <Text style={pdfStyles.subtitle}>DATE : 21 juillet 2025</Text>
      </View>
      <View style={pdfStyles.divider} />
      {/* SYNTHÈSE DU PROJET */}
      <View style={pdfStyles.section}>
        <Text style={{ fontSize: 20, color: '#c1a16a', fontWeight: 'bold', marginBottom: 8 }}>SYNTHÈSE DU PROJET</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {/* Caractéristiques */}
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 14, color: '#787346', fontWeight: 'bold', marginBottom: 6 }}>Caractéristiques du bien</Text>
            <View style={{ marginBottom: 8 }}>
              <Text>Surface habitable : 145 m²</Text>
              <Text>Configuration : Maison à étage avec piscine</Text>
              <Text>Piscine : 32 m²</Text>
              <Text>Extérieurs : Terrasse, parking</Text>
              <Text>Terrain : Argileux, pentu</Text>
            </View>
            <View style={{ marginTop: 8, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 8 }}>
              <Text style={{ fontWeight: 'bold', color: '#787346', marginBottom: 3 }}>Distribution</Text>
              <Text style={{ fontSize: 11, marginBottom: 2 }}><Text style={{ color: '#c1a16a', fontWeight: 'bold' }}>Rez-de-chaussée :</Text> Entrée, 3 chambres, 1 bureau, salle de bain, salle d'eau, WC, placards</Text>
              <Text style={{ fontSize: 11, marginBottom: 2 }}><Text style={{ color: '#c1a16a', fontWeight: 'bold' }}>Étage :</Text> Salon/salle à manger, cuisine ouverte, suite parentale, salle d'eau, WC, cellier, terrasse</Text>
              <Text style={{ fontSize: 11 }}><Text style={{ color: '#c1a16a', fontWeight: 'bold' }}>Extérieurs :</Text> Piscine 32 m², terrasse, parking</Text>
            </View>
          </View>
          {/* Prestations techniques */}
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={{ fontSize: 14, color: '#787346', fontWeight: 'bold', marginBottom: 6 }}>Prestations techniques</Text>
            <View>
              <Text style={{ fontSize: 11, marginBottom: 2 }}>Chauffage par pompe à chaleur réversible</Text>
              <Text style={{ fontSize: 11, marginBottom: 2 }}>Climatisation complète</Text>
              <Text style={{ fontSize: 11, marginBottom: 2 }}>Domotique</Text>
              <Text style={{ fontSize: 11, marginBottom: 2 }}>Menuiseries aluminium double vitrage</Text>
              <Text style={{ fontSize: 11, marginBottom: 2 }}>Volets roulants électriques</Text>
              <Text style={{ fontSize: 11, marginBottom: 2 }}>Carrelage milieu de gamme</Text>
              <Text style={{ fontSize: 11, marginBottom: 2 }}>Toiture tuiles rondes</Text>
              <Text style={{ fontSize: 11 }}>Façade enduit</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={pdfStyles.divider} />
      {/* PROPOSITION FINANCIÈRE DÉTAILLÉE */}
      <View style={pdfStyles.section}>
        <Text style={{ fontSize: 20, color: '#c1a16a', fontWeight: 'bold', marginBottom: 8 }}>PROPOSITION FINANCIÈRE DÉTAILLÉE</Text>
        {/* Tableau synthétique, puis sections détaillées (exemple simplifié) */}
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', color: '#787346', marginBottom: 3 }}>Coût des travaux</Text>
          <Text>Voir détail dans la version web/pdf complète (tableaux complexes non inclus ici pour la démo rapide)</Text>
        </View>
      </View>
      <View style={pdfStyles.divider} />
      {/* HONORAIRES DE MAÎTRISE D'ŒUVRE */}
      <View style={pdfStyles.section}>
        <Text style={{ fontSize: 20, color: '#c1a16a', fontWeight: 'bold', marginBottom: 8 }}>HONORAIRES DE MAÎTRISE D'ŒUVRE</Text>
        <Text>Missions incluses (8,2% du montant des travaux)</Text>
        <Text>Honoraires de maîtrise d'œuvre : 27 283,49 € HT, TVA 20% : 5 456,70 €, TTC : 32 740,19 €</Text>
        <Text>Prestations incluses : conception, préparation, suivi de chantier, livraison.</Text>
      </View>
      <View style={pdfStyles.divider} />
      {/* POTENTIEL IMMOBILIER */}
      <View style={pdfStyles.section}>
        <Text style={{ fontSize: 20, color: '#c1a16a', fontWeight: 'bold', marginBottom: 8 }}>POTENTIEL IMMOBILIER</Text>
        <Text>Courbe d'évolution du prix et plus-value potentielle (voir version web pour le graphique interactif)</Text>
        <Text>Valeur estimée terminé : 1 563 820 €</Text>
        <Text>Coût total projet : 432 010,82 €</Text>
        <Text>Plus-value brute : 1 131 809 € (hors coût terrain et frais annexes)</Text>
      </View>
      <View style={pdfStyles.divider} />
      {/* PRESTATIONS NON INCLUSES */}
      <View style={pdfStyles.section}>
        <Text style={{ fontSize: 20, color: '#c1a16a', fontWeight: 'bold', marginBottom: 8 }}>PRESTATIONS NON INCLUSES</Text>
        <Text>Études obligatoires à votre charge, assurances obligatoires, autres exclusions (voir version web/pdf complète pour le détail).</Text>
      </View>
      <View style={pdfStyles.divider} />
      {/* PLANNING PRÉVISIONNEL */}
      <View style={pdfStyles.section}>
        <Text style={{ fontSize: 20, color: '#c1a16a', fontWeight: 'bold', marginBottom: 8 }}>PLANNING PRÉVISIONNEL</Text>
        <Text>Phases : études, permis, préparation, travaux. Délai total : 16-20 mois.</Text>
        <Text>Points à clarifier : urbanisme, terrain, viabilisation.</Text>
      </View>
      <View style={pdfStyles.divider} />
      {/* FOOTER */}
      <View style={pdfStyles.section}>
        <Text style={{ fontWeight: 'bold', color: '#787346', marginBottom: 3 }}>NOS GARANTIES</Text>
        <Text>Assurance RC Pro, garantie décennale, suivi parfait achèvement, assistance pendant la période de garantie.</Text>
        <Text style={{ fontWeight: 'bold', color: '#c1a16a', marginTop: 8 }}>PROCHAINES ÉTAPES</Text>
        <Text>Validation, signature, études, sécurisation terrain, démarrage études sol/thermique.</Text>
        <Text style={{ fontWeight: 'bold', color: '#787346', marginTop: 8 }}>CONDITIONS</Text>
        <Text>Validité de l'offre : 30 jours. Accompte au démarrage : 20% des honoraires = 6 548,04 € TTC.</Text>
        <Text>Paiement travaux : selon avancement. Révision des prix : forfaitaire.</Text>
        <Text style={{ marginTop: 12, color: '#c1a16a', fontWeight: 'bold', fontSize: 18 }}>PROGINEER</Text>
        <Text style={{ color: '#787346', fontSize: 14 }}>Votre partenaire pour un projet réussi</Text>
        <Text style={{ fontSize: 10, marginTop: 8 }}>Contact : PROGINEER - Architecture & Maîtrise d'Œuvre | 07 83 76 21 56 | progineer.moe@gmail.com | www.progineer.fr</Text>
      </View>
    </Page>
  </Document>
);

const Header: React.FC = () => {
  const handleExportPDF = () => {
    const element = document.getElementById('main-content');
    if (!element) return;
    // Sauvegarde le style original
    const originalWidth = element.style.width;
    const originalClass = element.className;
    element.style.width = '794px'; // A4 portrait à 96dpi
    element.classList.add('pdf-export-mode');

    html2pdf()
      .set({
        margin: 0,
        filename: 'proposition-commerciale.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save()
      .then(() => {
        // Restaure la largeur et la classe originale
        element.style.width = originalWidth;
        element.className = originalClass;
      });
  };
  return (
    <header className="bg-gradient-to-r from-white via-gray-50 to-white text-gray-900 py-8 px-6 border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img src="/Diapositive4.PNG" alt="PROGINEER Logo" className="h-16 w-auto" />
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#c1a16a' }}>PROGINEER</h1>
              <p className="text-lg text-gray-600">Architecture & Maîtrise d'Œuvre</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold mb-1" style={{ color: '#c1a16a' }}>PROPOSITION COMMERCIALE</div>
            <div className="text-gray-600">Construction neuve individuelle</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: '#787346' }}></div>
            <div>
              <div className="text-sm text-gray-500">CLIENTS</div>
              <div className="font-semibold">Monsieur et Madame LANDY</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5" style={{ color: '#787346' }} />
            <div>
              <div className="text-sm text-gray-500">LOCALISATION</div>
              <div className="font-semibold">Le Lavandou (83980)</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5" style={{ color: '#787346' }} />
            <div>
              <div className="text-sm text-gray-500">DATE</div>
              <div className="font-semibold">21 juillet 2025</div>
            </div>
            <button
              onClick={handleExportPDF}
              className="ml-4 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded shadow"
              style={{ backgroundColor: '#c1a16a' }}
            >
              Exporter PDF
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;