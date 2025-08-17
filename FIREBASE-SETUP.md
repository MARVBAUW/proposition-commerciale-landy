# 🔥 Configuration Firebase pour PROGINEER LANDY

## ❌ Problème identifié
**Firebase Firestore: "Missing or insufficient permissions"**

Les notifications et autres données ne s'enregistrent pas car Firebase Firestore bloque l'accès aux collections.

## ✅ Solution

### 1. **Déployer les nouvelles règles Firestore**

#### Option A: Via le script automatique (Windows)
```bash
.\deploy-firestore-rules.bat
```

#### Option B: Via le script automatique (Mac/Linux)
```bash
chmod +x deploy-firestore-rules.sh
./deploy-firestore-rules.sh
```

#### Option C: Manuellement
```bash
firebase deploy --only firestore:rules
```

### 2. **Ou via la console Firebase**

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionner le projet **projet-landy**
3. Aller dans **Firestore Database** → **Règles**
4. Remplacer les règles par le contenu du fichier `firestore.rules`
5. Cliquer sur **Publier**

### 3. **Vérifier que ça fonctionne**

1. Retourner dans l'admin de l'app
2. Cliquer sur le bouton **🧪 Test** 
3. Vérifier que le message est "✅ Firebase OK!"
4. Essayer de créer une notification via un document

## ⚠️ **IMPORTANT SÉCURITÉ**

Ces règles sont **TEMPORAIRES** pour le développement :
- Elles permettent l'accès libre à toutes les données
- **À MODIFIER avant la mise en production**
- Ajouter l'authentification Firebase Auth
- Restreindre l'accès selon les rôles utilisateur

## 🔧 **Collections Firebase utilisées**

- `notifications` - Notifications de l'app
- `projectConfig` - Configuration du projet
- `documents` - Documents de l'app
- `documentAccess` - Accès aux documents
- `signatureConfigs` - Configuration des signatures
- `signatures` - Signatures électroniques
- `pushNotificationLogs` - Logs des notifications push

## 📋 **Règles de production recommandées**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authentification requise
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Règles spécifiques par collection avec validation
    // À implémenter selon les besoins business
  }
}
```