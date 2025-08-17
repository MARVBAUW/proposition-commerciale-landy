// Script pour initialiser Firestore avec les données du projet
const admin = require('firebase-admin');

// Initialiser Firebase Admin
const serviceAccount = require('./service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'projet-landy.firebasestorage.app'
});

const db = admin.firestore();

async function setupFirestore() {
  try {
    console.log('🔄 Initialisation des données Firestore...');
    
    // Données d'accès aux documents
    const documentAccess = {
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

    // Ajout des données d'accès
    for (const [docId, data] of Object.entries(documentAccess)) {
      await db.collection('documentAccess').doc(docId).set(data);
      console.log(`✅ Document ${docId} configuré`);
    }

    console.log('🎉 Firestore initialisé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

setupFirestore();