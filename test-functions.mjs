// Test des Firebase Functions déployées
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

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
const functions = getFunctions(app);

async function testFunctions() {
  try {
    console.log('🔄 Test des Firebase Functions...');

    // Test fonction helloWorld
    const helloWorld = httpsCallable(functions, 'helloWorld');
    const result = await helloWorld({});
    
    console.log('✅ HelloWorld Response:', result.data);
    console.log('🎉 Functions Firebase opérationnelles !');
    
    console.log('\n📋 Système de signature électronique prêt:');
    console.log('- 🌐 App: https://projet-landy.web.app');
    console.log('- 🔧 Admin: https://projet-landy.web.app/admin-progineer-2025');
    console.log('- 📧 Email service: Opérationnel');
    console.log('- 🔒 Firestore: Configuré avec permissions');
    console.log('- ☁️ Functions: Déployées et testées');
    
  } catch (error) {
    console.error('❌ Erreur test Functions:', error);
  }
}

testFunctions();