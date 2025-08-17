// Firebase Functions pour envoi d'emails
// À déployer dans functions/src/index.ts pour la production

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configuration Nodemailer (Gmail/Outlook)
const transporter = nodemailer.createTransporter({
  service: 'gmail', // ou 'outlook', etc.
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password, // ou App Password
  },
});

// 📧 Fonction : Envoyer code de vérification
exports.sendVerificationCode = functions.https.onCall(async (data, context) => {
  try {
    const { email, code, documentName, template } = data;
    
    const mailOptions = {
      from: `"PROGINEER" <${functions.config().gmail.email}>`,
      to: email,
      subject: template.subject,
      html: template.body,
    };

    await transporter.sendMail(mailOptions);
    
    // Log dans Firestore pour audit
    await admin.firestore().collection('emailLogs').add({
      type: 'verification_code',
      to: email,
      documentName,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      success: true
    });

    return { success: true, message: 'Code envoyé avec succès' };
  } catch (error) {
    console.error('Erreur envoi code:', error);
    
    // Log erreur
    await admin.firestore().collection('emailLogs').add({
      type: 'verification_code',
      to: data.email,
      error: error.message,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      success: false
    });
    
    throw new functions.https.HttpsError('internal', 'Erreur envoi email');
  }
});

// 🔔 Fonction : Notification signature client
exports.sendNotification = functions.https.onCall(async (data, context) => {
  try {
    const { email, template } = data;
    
    const mailOptions = {
      from: `"PROGINEER - Notification" <${functions.config().gmail.email}>`,
      to: email,
      subject: template.subject,
      html: template.body,
    };

    await transporter.sendMail(mailOptions);
    
    await admin.firestore().collection('emailLogs').add({
      type: 'signature_notification',
      to: email,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      success: true
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur notification:', error);
    throw new functions.https.HttpsError('internal', 'Erreur envoi notification');
  }
});

// 📄 Fonction : Envoyer document finalisé
exports.sendFinalDocument = functions.https.onCall(async (data, context) => {
  try {
    const { email, documentName, downloadUrl, template } = data;
    
    const mailOptions = {
      from: `"PROGINEER - Documents" <${functions.config().gmail.email}>`,
      to: email,
      subject: template.subject,
      html: template.body,
    };

    await transporter.sendMail(mailOptions);
    
    await admin.firestore().collection('emailLogs').add({
      type: 'final_document',
      to: email,
      documentName,
      downloadUrl,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      success: true
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur envoi document:', error);
    throw new functions.https.HttpsError('internal', 'Erreur envoi document');
  }
});

// 🔥 Trigger automatique : Quand une signature est ajoutée
exports.onSignatureAdded = functions.firestore
  .document('signatures/{documentId}')
  .onCreate(async (snap, context) => {
    try {
      const signatureData = snap.data();
      const { documentId } = context.params;
      
      // Récupérer les infos du document
      const docRef = admin.firestore().collection('documents').doc(documentId);
      const docSnap = await docRef.get();
      
      if (!docSnap.exists()) return;
      
      const docData = docSnap.data();
      
      // Déterminer qui a signé
      const isClientSignature = signatureData.signerRole === 'client';
      
      if (isClientSignature) {
        // Client a signé → Notifier PROGINEER
        const template = {
          subject: `✅ Document signé par le client - ${docData.name}`,
          body: `
            <h2>Le client a signé</h2>
            <p><strong>Document :</strong> ${docData.name}</p>
            <p><strong>Signé par :</strong> ${signatureData.signerEmail}</p>
            <p><strong>Action requise :</strong> Vous devez maintenant signer le document.</p>
          `
        };
        
        // Envoyer notification
        await transporter.sendMail({
          from: `"PROGINEER - Notification" <${functions.config().gmail.email}>`,
          to: docData.progineersEmail,
          subject: template.subject,
          html: template.body,
        });
      }
      
      // Vérifier si le document est complètement signé
      const signaturesRef = admin.firestore()
        .collection('signatures')
        .where('documentId', '==', documentId);
      
      const signaturesSnap = await signaturesRef.get();
      const signatures = signaturesSnap.docs.map(doc => doc.data());
      
      const hasClientSignature = signatures.some(s => s.signerRole === 'client');
      const hasProgineersSignature = signatures.some(s => s.signerRole === 'progineer');
      
      if (hasClientSignature && hasProgineersSignature) {
        // Document complètement signé → Envoyer à tous
        const finalTemplate = {
          subject: `📄 Document finalisé - ${docData.name}`,
          body: `
            <h2>Document finalisé</h2>
            <p>Le document <strong>${docData.name}</strong> a été signé par toutes les parties.</p>
            <p><a href="${signatureData.signedDocumentUrl}">Télécharger le document signé</a></p>
          `
        };
        
        // Envoyer aux deux parties
        const recipients = [docData.clientEmail, docData.progineersEmail];
        
        for (const email of recipients) {
          await transporter.sendMail({
            from: `"PROGINEER - Documents" <${functions.config().gmail.email}>`,
            to: email,
            subject: finalTemplate.subject,
            html: finalTemplate.body,
          });
        }
      }
      
    } catch (error) {
      console.error('Erreur trigger signature:', error);
    }
  });

// 🧹 Fonction : Nettoyer les codes expirés (cron job)
exports.cleanExpiredCodes = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    const expiredCodesRef = admin.firestore()
      .collection('verificationCodes')
      .where('expiresAt', '<', now);
    
    const snapshot = await expiredCodesRef.get();
    
    const batch = admin.firestore().batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Supprimé ${snapshot.size} codes expirés`);
  });