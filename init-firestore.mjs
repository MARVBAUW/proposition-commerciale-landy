// Script pour initialiser Firestore avec les données d'accès documents
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB5FZySSHZsc0dZUPISND_Nz5GeOz8NTyM",
  authDomain: "projet-landy.firebaseapp.com",
  projectId: "projet-landy",
  storageBucket: "projet-landy.firebasestorage.app",
  messagingSenderId: "1095665968123",
  appId: "1:1095665968123:web:04d4d5925617a0c225215e"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initFirestore() {
  try {
    console.log('🔄 Initialisation Firestore...');

    // Documents d'accès
    const documentAccessData = {
      'devis-mission-complete': {
        clientEmail: 'landy.client@email.com',
        progineersEmail: 'progineer.moe@gmail.com',
        documentName: 'Devis mission complète maîtrise d\'œuvre'
      },
      'devis-mission-partielle': {
        clientEmail: 'landy.client@email.com',
        progineersEmail: 'progineer.moe@gmail.com',
        documentName: 'Devis mission partielle conception permis'
      },
      'contrat-moe': {
        clientEmail: 'landy.client@email.com',
        progineersEmail: 'progineer.moe@gmail.com',
        documentName: 'Contrat de maîtrise d\'œuvre'
      }
    };

    // Ajouter chaque document
    for (const [docId, data] of Object.entries(documentAccessData)) {
      await setDoc(doc(db, 'documentAccess', docId), data);
      console.log(`✅ Document ${docId} ajouté`);
    }

    console.log('🎉 Initialisation Firestore terminée !');
    console.log('\n📋 Données ajoutées:');
    console.log('- Collection: documentAccess');
    console.log('- Documents: devis-mission-complete, devis-mission-partielle, contrat-moe');
    console.log('\n🌐 Application disponible sur: https://projet-landy.web.app');
    console.log('🔧 Panel Admin: https://projet-landy.web.app/admin-progineer-2025');
    console.log('📧 Emails configurés: landy.client@email.com + progineer.moe@gmail.com');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

initFirestore();