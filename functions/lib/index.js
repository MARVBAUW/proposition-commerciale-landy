const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
admin.initializeApp();
// Configuration Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});
// Function de test
exports.helloWorld = functions.https.onCall(async (data, context) => {
    return { message: "Functions Firebase déployées avec succès!" };
});
// 📧 Fonction : Envoyer code de vérification
exports.sendVerificationCode = functions.https.onCall(async (data, context) => {
    try {
        const { email, documentName, template } = data;
        const mailOptions = {
            from: `"PROGINEER" <${process.env.GMAIL_EMAIL}>`,
            to: email,
            subject: template.subject,
            html: template.body,
        };
        await transporter.sendMail(mailOptions);
        // Log dans Firestore
        await admin.firestore().collection('emailLogs').add({
            type: 'verification_code',
            to: email,
            documentName,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            success: true
        });
        return { success: true, message: 'Code envoyé avec succès' };
    }
    catch (error) {
        console.error('Erreur envoi code:', error);
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
// 🔔 Fonction : Notification signature
exports.sendNotification = functions.https.onCall(async (data, context) => {
    try {
        const { email, template } = data;
        const mailOptions = {
            from: `"PROGINEER - Notification" <${process.env.GMAIL_EMAIL}>`,
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
    }
    catch (error) {
        console.error('Erreur notification:', error);
        throw new functions.https.HttpsError('internal', 'Erreur envoi notification');
    }
});
// 📧 Fonction : Envoyer notification par email
exports.sendNotificationEmail = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        try {
            const { to, subject, templateData } = req.body;
            // Template HTML pour les notifications
            const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${templateData.title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #c1a16a 0%, #d4c09a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">${templateData.title}</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">PROGINEER - Espace Client</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="margin-bottom: 25px;">
          ${templateData.type === 'new_document' ?
                '<div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50; margin-bottom: 20px;"><strong>📄 Nouveau document disponible</strong></div>' :
                templateData.type === 'document_modified' ?
                    '<div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;"><strong>🔄 Document mis à jour</strong></div>' :
                    '<div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-bottom: 20px;"><strong>🔔 Nouvelle notification</strong></div>'}
          
          <p style="font-size: 16px; margin-bottom: 20px;">${templateData.message}</p>
          
          ${templateData.documentName ?
                `<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>Document concerné :</strong> ${templateData.documentName}
            </div>` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${templateData.actionUrl}" style="background: #c1a16a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; transition: all 0.3s;">
            Accéder à l'espace client
          </a>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
          <p><strong>PROGINEER</strong><br>
          Maîtrise d'œuvre architecturale</p>
          <p style="margin-top: 15px;">
            <small>Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.</small>
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
        © ${templateData.year} ${templateData.companyName}. Tous droits réservés.
      </div>
    </body>
    </html>`;
            const mailOptions = {
                from: `"PROGINEER" <${process.env.GMAIL_EMAIL}>`,
                to: to,
                subject: subject,
                html: htmlTemplate,
            };
            const result = await transporter.sendMail(mailOptions);
            // Log dans Firestore
            await admin.firestore().collection('emailLogs').add({
                type: 'notification_email',
                to: to,
                subject: subject,
                notificationType: templateData.type,
                documentName: templateData.documentName,
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
                success: true,
                messageId: result.messageId
            });
            res.status(200).json({
                success: true,
                message: 'Email de notification envoyé avec succès',
                emailId: result.messageId
            });
        }
        catch (error) {
            console.error('Erreur envoi email notification:', error);
            // Log d'erreur
            await admin.firestore().collection('emailLogs').add({
                type: 'notification_email',
                to: req.body.to,
                error: error.message,
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
                success: false
            });
            res.status(500).json({
                success: false,
                error: 'Erreur envoi email de notification'
            });
        }
    });
});
// 📱 Fonction : Envoyer notification push PWA
exports.sendPushNotification = functions.https.onCall(async (data, context) => {
    try {
        const { token, notification, data: notificationData } = data;
        const message = {
            notification: {
                title: notification.title,
                body: notification.body,
                icon: notification.icon || '/icon-192x192.png',
            },
            data: notificationData || {},
            token: token,
        };
        const response = await admin.messaging().send(message);
        // Log dans Firestore
        await admin.firestore().collection('pushNotificationLogs').add({
            token: token,
            notification: notification,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            success: true,
            messageId: response
        });
        return {
            success: true,
            message: 'Notification push envoyée avec succès',
            messageId: response
        };
    }
    catch (error) {
        console.error('Erreur envoi notification push:', error);
        // Log d'erreur
        await admin.firestore().collection('pushNotificationLogs').add({
            token: data.token,
            error: error.message,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            success: false
        });
        throw new functions.https.HttpsError('internal', 'Erreur envoi notification push');
    }
});
//# sourceMappingURL=index.js.map