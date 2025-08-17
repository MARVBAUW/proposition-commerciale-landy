// Test direct de la fonction d'envoi d'email
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

async function testEmailFunction() {
  try {
    console.log('🔄 Test de la fonction d\'envoi d\'email...');

    // Créer un template d'email de test
    const emailTemplate = {
      subject: '🔐 Code de vérification - PROGINEER Test',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #c1a16a, #787346); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">PROGINEER</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Architecture & Maîtrise d'Œuvre</p>
          </div>
          
          <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Code de vérification</h2>
            <p style="color: #666; margin-bottom: 30px;">Votre code de vérification pour signer le document :</p>
            
            <div style="background: #f8f9fa; border: 2px dashed #c1a16a; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #c1a16a; letter-spacing: 5px;">123456</div>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Ce code expire dans 10 minutes</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
              <p style="margin: 0; color: #1565c0; font-size: 14px;">
                <strong>Document :</strong> Test de fonction email
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>© 2025 PROGINEER - Architecture & Maîtrise d'Œuvre</p>
          </div>
        </div>
      `
    };

    // Appeler la fonction sendVerificationCode
    const sendVerificationCode = httpsCallable(functions, 'sendVerificationCode');
    
    const result = await sendVerificationCode({
      email: 'progineer.moe@gmail.com',
      documentName: 'Test de fonction email',
      template: emailTemplate
    });

    console.log('✅ Fonction appelée avec succès !');
    console.log('📧 Réponse :', result.data);
    console.log('');
    console.log('📮 Vérifiez votre boîte mail : progineer.moe@gmail.com');
    console.log('📝 Sujet : 🔐 Code de vérification - PROGINEER Test');
    
  } catch (error) {
    console.error('❌ Erreur lors du test :', error);
    console.error('❌ Code erreur :', error.code);
    console.error('❌ Message :', error.message);
    
    if (error.code === 'functions/unauthenticated') {
      console.log('');
      console.log('🔧 Solution possible : Problème d\'authentification Firebase');
    } else if (error.code === 'functions/internal') {
      console.log('');
      console.log('🔧 Solution possible : Erreur interne de la fonction (configuration email ?)');
    }
  }
}

testEmailFunction();