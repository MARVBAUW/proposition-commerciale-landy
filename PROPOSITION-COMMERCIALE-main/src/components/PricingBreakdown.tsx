import React from 'react';
import PricingSection from './PricingTable';

const PricingBreakdown: React.FC = () => {
  const sections = [
    {
      title: "TERRASSEMENT ET VIABILISATION",
      icon: "⛏️",
      rows: [
        { title: "Terrassements viabilisation (terrain argileux pentu)", htAmount: "32 987,50 €", tva: "6 597,50 €", ttcAmount: "39 585,00 €" },
      ],
      subtotal: { htAmount: "32 987,50 €", tva: "6 597,50 €", ttcAmount: "39 585,00 €" }
    },
    {
      title: "GROS ŒUVRE ET MAÇONNERIE",
      icon: "🏗️",
      rows: [
        { title: "Gros œuvre parpaing", htAmount: "73 587,50 €", tva: "14 717,50 €", ttcAmount: "88 305,00 €" },
      ],
      subtotal: { htAmount: "73 587,50 €", tva: "14 717,50 €", ttcAmount: "88 305,00 €" }
    },
    {
      title: "CHARPENTE ET COUVERTURE",
      icon: "🏠",
      rows: [
        { title: "Charpente industrielle", htAmount: "6 027,87 €", tva: "1 205,58 €", ttcAmount: "7 233,45 €" },
        { title: "Couverture tuile ronde", htAmount: "17 381,87 €", tva: "3 476,38 €", ttcAmount: "20 858,25 €" },
      ],
      subtotal: { htAmount: "23 409,74 €", tva: "4 681,96 €", ttcAmount: "28 091,70 €" }
    },
    {
      title: "ISOLATION ET FAÇADES",
      icon: "🧱",
      rows: [
        { title: "Isolation thermique réglementaire", htAmount: "10 150,00 €", tva: "2 030,00 €", ttcAmount: "12 180,00 €" },
        { title: "Façade enduit", htAmount: "8 881,25 €", tva: "1 776,25 €", ttcAmount: "10 657,50 €" },
      ],
      subtotal: { htAmount: "19 031,25 €", tva: "3 806,25 €", ttcAmount: "22 837,50 €" }
    },
    {
      title: "MENUISERIES EXTÉRIEURES",
      icon: "🚪",
      rows: [
        { title: "Menuiseries extérieures aluminium", htAmount: "21 238,87 €", tva: "4 247,79 €", ttcAmount: "25 486,66 €" },
      ],
      subtotal: { htAmount: "21 238,87 €", tva: "4 247,79 €", ttcAmount: "25 486,66 €" }
    },
    {
      title: "INSTALLATIONS ÉLECTRIQUES",
      icon: "⚡",
      rows: [
        { title: "Électricité haut de gamme avec domotique", htAmount: "24 106,25 €", tva: "4 821,25 €", ttcAmount: "28 927,50 €" },
      ],
      subtotal: { htAmount: "24 106,25 €", tva: "4 821,25 €", ttcAmount: "28 927,50 €" }
    },
    {
      title: "PLOMBERIE ET SANITAIRE",
      icon: "🚿",
      rows: [
        { title: "Plomberie prestations de base", htAmount: "10 150,00 €", tva: "2 030,00 €", ttcAmount: "12 180,00 €" },
      ],
      subtotal: { htAmount: "10 150,00 €", tva: "2 030,00 €", ttcAmount: "12 180,00 €" }
    },
    {
      title: "CHAUFFAGE ET CLIMATISATION",
      icon: "❄️",
      rows: [
        { title: "Chauffage de base", htAmount: "7 612,50 €", tva: "1 522,50 €", ttcAmount: "9 135,00 €" },
        { title: "Climatisation", htAmount: "8 246,87 €", tva: "1 649,38 €", ttcAmount: "9 896,25 €" },
      ],
      subtotal: { htAmount: "15 859,37 €", tva: "3 171,88 €", ttcAmount: "19 031,25 €" }
    },
    {
      title: "CLOISONS ET PLÂTRERIE",
      icon: "🧱",
      rows: [
        { title: "Plâtrerie avec spécificités techniques", htAmount: "13 321,87 €", tva: "2 664,38 €", ttcAmount: "15 986,25 €" },
      ],
      subtotal: { htAmount: "13 321,87 €", tva: "2 664,38 €", ttcAmount: "15 986,25 €" }
    },
    {
      title: "MENUISERIES INTÉRIEURES",
      icon: "🚪",
      rows: [
        { title: "Menuiseries intérieures standing", htAmount: "7 612,50 €", tva: "1 522,50 €", ttcAmount: "9 135,00 €" },
      ],
      subtotal: { htAmount: "7 612,50 €", tva: "1 522,50 €", ttcAmount: "9 135,00 €" }
    },
    {
      title: "REVÊTEMENTS DE SOLS ET MURS",
      icon: "🪟",
      rows: [
        { title: "Carrelage milieu de gamme", htAmount: "11 571,00 €", tva: "2 314,20 €", ttcAmount: "13 885,20 €" },
        { title: "Faïence milieu de gamme", htAmount: "840,00 €", tva: "168,00 €", ttcAmount: "1 008,00 €" },
      ],
      subtotal: { htAmount: "11 411,00 €", tva: "2 482,20 €", ttcAmount: "14 893,20 €" }
    },
    {
      title: "PEINTURE ET FINITIONS",
      icon: "🎨",
      rows: [
        { title: "Peinture de base", htAmount: "7 358,75 €", tva: "1 471,75 €", ttcAmount: "8 830,50 €" },
      ],
      subtotal: { htAmount: "7 358,75 €", tva: "1 471,75 €", ttcAmount: "8 830,50 €" }
    },
    {
      title: "ÉNERGIES RENOUVELABLES",
      icon: "🌞",
      rows: [
        { title: "Optimisation énergétique", htAmount: "9 070,25 €", tva: "1 814,05 €", ttcAmount: "10 884,30 €" },
      ],
      subtotal: { htAmount: "9 070,25 €", tva: "1 814,05 €", ttcAmount: "10 884,30 €" }
    },
    {
      title: "AMÉNAGEMENTS EXTÉRIEURS",
      icon: "🌳",
      rows: [
        { title: "Aménagement paysager", htAmount: "503,12 €", tva: "100,63 €", ttcAmount: "603,75 €" },
        { title: "Portail standard (4 ml)", htAmount: "5 075,00 €", tva: "1 015,00 €", ttcAmount: "6 090,00 €" },
        { title: "Terrasse (25 m²)", htAmount: "1 968,75 €", tva: "393,75 €", ttcAmount: "2 362,50 €" },
      ],
      subtotal: { htAmount: "7 546,87 €", tva: "1 509,38 €", ttcAmount: "9 056,25 €" }
    },
    {
      title: "ÉQUIPEMENTS AQUATIQUES",
      icon: "🏊",
      rows: [
        { title: "Piscine enterrée béton (32 m²)", htAmount: "37 800,00 €", tva: "7 560,00 €", ttcAmount: "45 360,00 €" },
      ],
      subtotal: { htAmount: "37 800,00 €", tva: "7 560,00 €", ttcAmount: "45 360,00 €" }
    },
    {
      title: "AMÉNAGEMENT CUISINE",
      icon: "🍽️",
      rows: [
        { title: "Cuisine gamme supérieure", htAmount: "11 812,50 €", tva: "2 362,50 €", ttcAmount: "14 175,00 €" },
      ],
      subtotal: { htAmount: "11 812,50 €", tva: "2 362,50 €", ttcAmount: "14 175,00 €" }
    },
    {
      title: "ÉQUIPEMENTS SANITAIRES",
      icon: "🚽",
      rows: [
        { title: "Salles de bain premium (2 unités)", htAmount: "7 350,00 €", tva: "1 470,00 €", ttcAmount: "8 820,00 €" },
      ],
      subtotal: { htAmount: "7 350,00 €", tva: "1 470,00 €", ttcAmount: "8 820,00 €" }
    },
  ];

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#c1a16a' }}>PROPOSITION FINANCIÈRE DÉTAILLÉE</h2>
        
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-6" style={{ color: '#787346' }}>COÛT DES TRAVAUX</h3>
          
          {sections.map((section, index) => (
            <PricingSection key={index} {...section} />
          ))}
        </div>

        {/* Total des travaux */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-6 mb-8 border-2 shadow-lg" style={{ borderColor: '#c1a16a' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(193, 161, 106, 0.5)' }}>
                  <th className="text-left px-4 py-3 text-lg" style={{ color: '#c1a16a' }}>TOTAL TRAVAUX</th>
                  <th className="text-right px-4 py-3" style={{ color: '#c1a16a' }}>MONTANT HT</th>
                  <th className="text-right px-4 py-3" style={{ color: '#c1a16a' }}>TVA 20%</th>
                  <th className="text-right px-4 py-3" style={{ color: '#c1a16a' }}>MONTANT TTC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100/50">
                  <td className="px-4 py-4 text-gray-900 font-semibold">COÛT DES TRAVAUX</td>
                  <td className="px-4 py-4 text-right text-gray-900 font-mono font-bold text-lg">332 725,52 €</td>
                  <td className="px-4 py-4 text-right text-gray-600 font-mono">66 545,11 €</td>
                  <td className="px-4 py-4 text-right font-mono font-bold text-lg" style={{ color: '#c1a16a' }}>399 270,63 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingBreakdown;