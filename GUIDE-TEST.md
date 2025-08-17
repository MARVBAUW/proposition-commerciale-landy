# 🧪 Guide de test - Système de signature électronique

## ✅ Corrections appliquées

1. **Service email corrigé** - Les Functions Firebase sont maintenant utilisées au lieu de la simulation
2. **Configuration test** - Votre email configuré comme client de test
3. **CRUD opérationnel** - Plus de fausses données, connexion Firebase réelle
4. **Notifications mises à jour** - Nouvelles notifications système de signature

## 🚀 Pour tester

### 1. Démarrer l'application
```bash
cd "PROPOSITION-COMMERCIALE-main"
npm run dev
```

### 2. URLs de test
- **Application :** http://localhost:5173
- **Admin :** http://localhost:5173/admin-progineer-2025
- **Identifiants admin :** `admin` / `progineer2025`

### 3. Test complet de signature

#### A. Test côté client (votre perspective)
1. Allez sur http://localhost:5173
2. Section **Documents et Plans** > Onglet **Administratif**
3. Cliquez **"Signer"** sur le "Devis mission complète"
4. Saisissez votre email : `progineer.moe@gmail.com`
5. **✅ VÉRIFIEZ VOTRE EMAIL** - vous devriez recevoir un code 6 chiffres
6. Saisissez le code reçu par email
7. Remplissez et signez électroniquement
8. Validez la signature

#### B. Test côté admin (perspective PROGINEER)
1. Allez sur http://localhost:5173/admin-progineer-2025
2. Connectez-vous avec `admin` / `progineer2025`
3. Vérifiez dans l'onglet **"Signatures"** que le statut est "En attente PROGINEER"
4. Testez les boutons :
   - **📧 Gérer emails** (modifier les emails des signataires)
   - **🔄 Réinitialiser signatures** (remettre à zéro pour retester)
   - **⚙️ Configurer zones** (définir position signatures PDF)

### 4. Points à vérifier

#### Emails
- [ ] Réception du code de vérification à votre email
- [ ] Template d'email professionnel PROGINEER
- [ ] Code à 6 chiffres fonctionnel
- [ ] Expiration 10 minutes

#### Interface
- [ ] Processus de signature fluide
- [ ] Capture de signature fonctionne
- [ ] Notifications en temps réel (cloche en haut)
- [ ] Statuts mis à jour dans l'admin

#### Admin CRUD
- [ ] Connexion admin fonctionne
- [ ] Statuts de signature corrects (pas de fausses données)
- [ ] Modification emails fonctionnelle
- [ ] Réinitialisation signatures opérationnelle
- [ ] Style harmonisé avec l'app

## 🔧 Fonctionnalités testables

### Gestion des emails (Admin)
- Modifier l'email client ou PROGINEER pour chaque document
- Sauvegarder et voir les changements appliqués

### Réinitialisation (Admin)
- Remettre à zéro les signatures d'un document
- Permettre de refaire des tests propres

### Configuration signatures (Admin)
- Interface pour définir où apparaîtront les signatures sur le PDF
- Positions configurables en pourcentage

### Workflow complet
1. Client signe → notification à PROGINEER
2. PROGINEER signe → document finalisé
3. Statuts mis à jour en temps réel

## 🐛 Si problèmes

### Email pas reçu
- Vérifiez spams/promotions
- Testez avec `node test-email-function.mjs` pour debug
- Logs Firebase : `firebase functions:log`

### Erreur interface
- F12 → Console pour voir erreurs JavaScript
- Vérifiez connexion Firebase

### CRUD admin
- Assurez-vous d'être connecté avec les bons identifiants
- Rechargez la page si statuts incorrects

## 📝 Validation

Avant déploiement, validez :
- [ ] Emails reçus correctement
- [ ] Signature électronique fonctionne
- [ ] Admin CRUD opérationnel
- [ ] Réinitialisation pour tests OK
- [ ] Pas de fausses données
- [ ] Interface fluide et intuitive

Une fois validé, je procéderai au déploiement Netlify sur votre URL existante.