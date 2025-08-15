import React from 'react';
import { Shield, Phone, FileText, CheckCircle, Lock, AlertCircle } from 'lucide-react';

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
                <div className="text-sm text-gray-500 mb-1">Accompte au démarrage</div>
                <div className="font-semibold" style={{ color: '#c1a16a' }}>20% = 6 548,04 € TTC</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Révision des prix</div>
                <div className="text-gray-900 font-semibold">Forfaitaire (pas de révision)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone CONCEPTION verrouillée */}
        <div className="mt-12 mb-8">
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg p-8 border-2 border-gray-400 opacity-75">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <Lock className="w-8 h-8 text-gray-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-600">SECTION CONCEPTION</h3>
              </div>
              
              <div className="flex justify-center items-center mb-4">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                <p className="text-gray-700 font-medium">Section verrouillée - Déverrouillage après signature et validation de l'offre</p>
              </div>
              
              <div className="text-gray-600 max-w-3xl mx-auto">
                <p className="mb-3">
                  Cette section contiendra les prestations incluses dans nos honoraires de maîtrise d'œuvre :
                </p>
                <div className="text-center max-w-2xl mx-auto">
                  <div className="text-left">
                    <strong>CONCEPTION (Esquisse à Permis de Construire)</strong><br/>
                    • Esquisse : Étude de faisabilité et premiers plans (2-3 semaines)<br/>
                    • Avant-projet sommaire (APS) : Définition des volumes et surfaces (2-3 semaines)<br/>
                    • Avant-projet définitif (APD) : Plans définitifs et choix techniques (4-6 semaines)<br/>
                    • Dossier de Permis de Construire : Constitution et dépôt du dossier (2 semaines)<br/>
                    • Établissement du planning général des travaux
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                  <p className="text-amber-800 text-sm font-medium">
                    📋 Déverrouillage prévu : Après signature et validation de l'offre
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm">
            <p className="text-gray-600 mb-4">
              Cette proposition est établie sur la base des éléments transmis et reste soumise à la validation des contraintes techniques et réglementaires, notamment liées à la nature argileuse et pentue du terrain.
            </p>
            <div className="text-center">
              <img src="/Diapositive15-removebg-preview.png" alt="PROGINEER" className="mx-auto h-11 w-auto mb-2" />
              <div className="text-lg" style={{ color: '#787346' }}>Votre partenaire pour un projet réussi</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;