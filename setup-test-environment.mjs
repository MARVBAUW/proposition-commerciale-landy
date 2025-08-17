// Script pour configurer l'environnement de test avec votre email
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

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

async function setupTestEnvironment() {
  try {
    console.log('🔄 Configuration de l\'environnement de test...');

    // 1. Supprimer toutes les signatures existantes
    console.log('🗑️ Suppression des signatures existantes...');
    const signaturesSnapshot = await getDocs(collection(db, 'signatures'));
    for (const signature of signaturesSnapshot.docs) {
      await deleteDoc(doc(db, 'signatures', signature.id));
    }
    console.log(`✅ ${signaturesSnapshot.size} signatures supprimées`);

    // 2. Configurer les emails pour test avec votre email comme "client"
    console.log('📧 Configuration des emails de test...');
    const testEmailConfig = {
      'devis-mission-complete': {
        clientEmail: 'progineer.moe@gmail.com', // Votre email pour tester
        progineersEmail: 'progineer.moe@gmail.com',
        documentName: 'Devis mission complète maîtrise d\'œuvre'
      },
      'devis-mission-partielle': {
        clientEmail: 'progineer.moe@gmail.com', // Votre email pour tester
        progineersEmail: 'progineer.moe@gmail.com',
        documentName: 'Devis mission partielle conception permis'
      },
      'contrat-moe': {
        clientEmail: 'progineer.moe@gmail.com', // Votre email pour tester
        progineersEmail: 'progineer.moe@gmail.com',
        documentName: 'Contrat de maîtrise d\'œuvre'
      }
    };

    // Mettre à jour les accès documents
    for (const [docId, config] of Object.entries(testEmailConfig)) {
      await setDoc(doc(db, 'documentAccess', docId), config);
      console.log(`✅ Email configuré pour ${docId}`);
    }

    console.log('🎉 Environnement de test configuré !');
    console.log('');
    console.log('📋 Configuration actuelle:');
    console.log('- 🌐 App locale: http://localhost:5173');
    console.log('- 🔧 Admin: http://localhost:5173/admin-progineer-2025');
    console.log('- 📧 Email test (client): progineer.moe@gmail.com');
    console.log('- 📧 Email PROGINEER: progineer.moe@gmail.com');
    console.log('- 🔄 Toutes les signatures réinitialisées');
    console.log('');
    console.log('🔧 Pour tester la signature:');
    console.log('1. Lancez l\'app en local: npm run dev');
    console.log('2. Allez dans Documents et Plans > Administratif');
    console.log('3. Cliquez "Signer" sur un document');
    console.log('4. Utilisez progineer.moe@gmail.com comme email');
    console.log('5. Vérifiez la réception du code par email');
    console.log('6. Testez la signature électronique');
    console.log('');
    console.log('🛠️ Réinitialisation via Admin:');
    console.log('- Connectez-vous au panel admin');
    console.log('- Utilisez le bouton "Réinitialiser signatures" pour remettre à zéro');
    console.log('- Modifiez les emails via "Gérer les emails" si besoin');
    
  } catch (error) {
    console.error('❌ Erreur configuration test:', error);
  }
}

setupTestEnvironment();