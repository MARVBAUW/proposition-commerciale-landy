# 🔥 Configuration Firebase pour la Production

## 📋 Étapes de configuration

### 1. 🚀 Créer le projet Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquer "Créer un projet"
3. Nom : `progineer-signatures`
4. Activer Google Analytics (optionnel)

### 2. ⚙️ Configurer les services

#### Firestore Database
1. Dans Firebase Console → Firestore Database
2. Cliquer "Créer une base de données"
3. Mode : **Production** (avec règles de sécurité)
4. Région : `europe-west3` (Frankfurt - proche de la France)

#### Storage
1. Dans Firebase Console → Storage
2. Cliquer "Commencer"
3. Mode : **Production**
4. Région : `europe-west3`

#### Functions
1. Dans Firebase Console → Functions
2. Cliquer "Commencer"
3. Plan Blaze requis (facturation selon utilisation)

### 3. 🔧 Configuration locale

#### Installer Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

#### Initialiser le projet
```bash
cd votre-projet
firebase init

# Sélectionner :
# ✅ Functions
# ✅ Firestore
# ✅ Storage
# ✅ Hosting (optionnel)
```

#### Configurer Functions
```bash
cd functions
npm install nodemailer @types/nodemailer
```

### 4. 📧 Configuration Email

#### Option A : Gmail
1. Activer la double authentification sur votre compte Gmail
2. Générer un "Mot de passe d'application" :
   - Google Account → Sécurité → Mots de passe d'application
   - Générer pour "Autre (nom personnalisé)" : "Firebase Functions"

#### Option B : Outlook/Hotmail
1. Utiliser votre email/mot de passe normal
2. Ou configurer un mot de passe d'application

#### Configurer dans Firebase
```bash
firebase functions:config:set gmail.email="votre@email.com"
firebase functions:config:set gmail.password="votre_mot_de_passe_app"
```

### 5. 📄 Déployer les Functions

#### Copier le code Functions
1. Copier le contenu de `firebase-functions-example/index.js`
2. Le placer dans `functions/src/index.ts` (ou .js)

#### Déployer
```bash
firebase deploy --only functions
```

### 6. 🔐 Configurer les variables d'environnement

#### Récupérer la config Firebase
1. Firebase Console → Paramètres du projet → Applications
2. Cliquer sur l'icône web ⚙️
3. Copier la configuration

#### Mettre à jour .env.local
```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-projet
VITE_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 7. 🛡️ Règles de sécurité Firestore

#### Dans Firebase Console → Firestore → Règles
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Signatures : lecture/écriture pour tous (temporaire)
    match /signatures/{document} {
      allow read, write: if true;
    }
    
    // Codes de vérification : lecture/écriture pour tous
    match /verificationCodes/{document} {
      allow read, write: if true;
    }
    
    // Documents : lecture pour tous
    match /documents/{document} {
      allow read: if true;
      allow write: if false; // Seules les Functions peuvent écrire
    }
    
    // Accès documents : lecture pour tous
    match /documentAccess/{document} {
      allow read: if true;
      allow write: if false;
    }
    
    // Logs emails : seules les Functions peuvent écrire
    match /emailLogs/{document} {
      allow read, write: if false;
    }
  }
}
```

### 8. 📊 Données initiales

#### Ajouter les accès documents dans Firestore
Collection : `documentAccess`

Document : `devis-mission-complete`
```json
{
  "clientEmail": "landy.client@email.com",
  "progineersEmail": "admin@progineer.com",
  "documentName": "Devis mission complète maîtrise d'œuvre"
}
```

Document : `devis-mission-partielle`
```json
{
  "clientEmail": "landy.client@email.com", 
  "progineersEmail": "admin@progineer.com",
  "documentName": "Devis mission partielle conception permis"
}
```

Document : `contrat-moe`
```json
{
  "clientEmail": "landy.client@email.com",
  "progineersEmail": "admin@progineer.com", 
  "documentName": "Contrat de maîtrise d'œuvre"
}
```

## 🚀 Déploiement

### Build et déploiement
```bash
npm run build
firebase deploy
```

### URL de l'application
Votre app sera disponible sur :
`https://votre-projet.web.app`

## 🔍 Test et debug

### Logs Functions
```bash
firebase functions:log
```

### Émulateur local (optionnel)
```bash
firebase emulators:start
```

## 💰 Coûts estimés (gratuit dans la plupart des cas)

- **Firestore** : 50k lectures/écritures gratuits/jour
- **Functions** : 125k invocations/mois gratuits  
- **Storage** : 1GB gratuit
- **Hosting** : 10GB gratuit

Pour un usage normal, tout reste dans le plan gratuit !

## 📞 Support

En cas de problème :
1. Vérifier les logs Firebase Functions
2. Tester l'envoi d'email avec Nodemailer en local
3. Vérifier les règles Firestore
4. Consulter la documentation Firebase