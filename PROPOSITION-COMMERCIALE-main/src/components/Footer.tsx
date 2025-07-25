import React from 'react';
import { Shield, Phone, FileText, CheckCircle } from 'lucide-react';

const Footer: React.FC = () => {
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

  return (
    <footer className="bg-gray-50 py-12 px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Garanties */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 mr-3" style={{ color: '#787346' }} />
              <h2 className="text-xl font-bold" style={{ color: '#787346' }}>NOS GARANTIES</h2>
            </div>
            <div className="space-y-3">
              {guarantees.map((guarantee, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#787346' }} />
                  <span className="text-gray-600 text-sm">{guarantee}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prochaines étapes */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <Phone className="w-6 h-6 mr-3" style={{ color: '#b8a994' }} />
              <h2 className="text-xl font-bold" style={{ color: '#c1a16a' }}>PROCHAINES ÉTAPES</h2>
            </div>
            <div className="space-y-3">
              {nextSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#c1a16a' }}>
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-600 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-gray-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-600">CONDITIONS</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Validité de l'offre</div>
                <div className="text-gray-900 font-semibold">30 jours</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Modalités de paiement honoraires</div>
                <div className="font-semibold" style={{ color: '#c1a16a' }}>
                  Accompte au démarrage : 20% des honoraires de maîtrise d'œuvre = <span style={{ color: '#c1a16a', fontWeight: 'bold' }}>6 548,04 € TTC</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Paiement travaux</div>
                <div className="text-gray-900 font-semibold">Selon avancement et situations des entreprises</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Révision des prix</div>
                <div className="text-gray-900 font-semibold">Forfaitaire (pas de révision)</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <img src="/Diapositive15.PNG" alt="PROGINEER Signature" className="h-20 w-auto" style={{ height: '80px', width: 'auto' }} />
        </div>

        {/* Signature */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm">
            <p className="text-gray-600 mb-4">
              Cette proposition est établie sur la base des éléments transmis et reste soumise à la validation des contraintes techniques et réglementaires.
            </p>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: '#c1a16a' }}>PROGINEER</div>
              <div className="text-lg" style={{ color: '#787346' }}>Votre partenaire pour un projet réussi</div>
              <div className="mt-4 text-gray-600 text-sm">
                <div>Contact :</div>
                <div>PROGINEER - Architecture & Maîtrise d'Œuvre</div>
                <div>Téléphone : 07 83 76 21 56</div>
                <div>Email : progineer.moe@gmail.com</div>
                <div>Site web : www.progineer.fr</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;