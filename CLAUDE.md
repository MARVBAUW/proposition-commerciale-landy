# Projet Rénovation Curiol - Documentation Memory Bank

## Vue d'ensemble du projet
**Nom :** Avant-Projet Détaillé - Rénovation Pierre Lauzier
**Client :** Pierre Lauzier
**Localisation :** 31C rue Curiol, Marseille 13001
**Type :** Application React TypeScript pour génération de propositions commerciales

## Architecture technique

### Stack technologique
- **Framework :** React 18.3.1 avec TypeScript
- **Build :** Vite 5.4.2
- **Styling :** Tailwind CSS 3.4.1
- **PDF Generation :** @react-pdf/renderer 4.3.0
- **Charts :** Chart.js 4.5.0 avec react-chartjs-2 5.3.0
- **Icons :** Lucide React 0.344.0
- **Dev Tools :** ESLint

### Structure du projet
```
src/
├── App.tsx                    # App principale avec gestion mobile/desktop
├── main.tsx                   # Point d'entrée React
├── index.css                  # Styles CSS globaux
├── vite-env.d.ts             # Types Vite
└── components/
    ├── Header.tsx             # En-tête avec logo et titre
    ├── NavigationSidebar.tsx  # Navigation latérale/mobile
    ├── ProjectSummary.tsx     # Synthèse du projet client
    ├── PricingBreakdown.tsx   # Détail des coûts par lot
    ├── PricingTable.tsx       # Composant table de prix
    ├── Services.tsx           # Services de maîtrise d'œuvre
    ├── TotalSummary.tsx       # Récapitulatif général
    ├── Exclusions.tsx         # Prestations non incluses
    ├── Timeline.tsx           # Planning et clarifications
    ├── PdfDocument.tsx        # Génération PDF complète
    └── Footer.tsx             # Pied de page et contact
```

### Fonctionnalités principales

#### 1. Mode d'affichage responsive
- **Mode mobile adaptatif** avec détection du device physique
- **Bouton toggle desktop/mobile** pour smartphones
- **Viewport dynamique** avec gestion du zoom
- **Navigation adaptative** (latérale desktop, horizontale mobile)

#### 2. Navigation intelligente
- **Scroll spy** automatique avec détection de section active
- **Navigation par sections** : Synthèse, Coûts, Services, Potentiel, Total, Exclusions, Planning, Collaboration
- **Indicateurs visuels** avec progression et états (actif/passé)

#### 3. Contenu du devis
- **Synthèse projet** : Caractéristiques, distribution, prestations techniques
- **Proposition financière** : 17 lots détaillés, 399 270,63 € TTC total travaux
- **Honoraires maîtrise d'œuvre** : 32 740,19 € TTC
- **Total général** : 432 010,82 € TTC
- **Potentiel immobilier** : Plus-value de 1 131 809 €

#### 4. Génération PDF
- **Document PDF complet** avec page de garde
- **Tableaux formatés** avec tous les détails financiers
- **Styles cohérents** avec l'interface web
- **Footer de contact** et numérotation des pages

## Données du projet

### Client et localisation
- **Clients :** Monsieur et Madame LANDY
- **Lieu :** Le Lavandou (83980)
- **Terrain :** Argileux, pentu
- **Surface habitable :** 145 m²
- **Configuration :** Maison à étage avec piscine 32 m²

### Répartition des coûts (17 lots)
1. **Terrassement** : 39 585,00 € TTC
2. **Gros œuvre** : 88 305,00 € TTC
3. **Charpente/Couverture** : 28 091,70 € TTC
4. **Isolation/Façades** : 22 837,50 € TTC
5. **Menuiseries extérieures** : 25 486,66 € TTC
6. **Électricité** : 28 927,50 € TTC
7. **Plomberie** : 12 180,00 € TTC
8. **Chauffage/Climatisation** : 19 031,25 € TTC
9. **Plâtrerie** : 15 986,25 € TTC
10. **Menuiseries intérieures** : 9 135,00 € TTC
11. **Revêtements** : 14 893,20 € TTC
12. **Peinture** : 8 830,50 € TTC
13. **Énergies renouvelables** : 10 884,30 € TTC
14. **Aménagements extérieurs** : 9 056,25 € TTC
15. **Piscine** : 45 360,00 € TTC
16. **Cuisine** : 14 175,00 € TTC
17. **Sanitaires** : 8 820,00 € TTC

### Prestations techniques
- Chauffage par pompe à chaleur réversible
- Climatisation complète + domotique
- Menuiseries aluminium double vitrage
- Volets roulants électriques
- Carrelage et toiture de qualité

## Commandes de développement

### Scripts disponibles
```bash
npm run dev        # Serveur de développement Vite
npm run build      # Build de production
npm run lint       # Linting ESLint
npm run preview    # Aperçu du build
```

### Configuration
- **Vite config :** Configuration standard React avec optimisation lucide-react
- **Tailwind :** Configuration basique avec scan des fichiers src
- **TypeScript :** Config stricte avec tsconfig.app.json et tsconfig.node.json

## Couleurs et thème
- **Couleur principale :** #c1a16a (doré)
- **Couleur secondaire :** #787346 (brun)
- **Couleur accent :** #b8a994 (beige)
- **Arrière-plan :** #f9fafb (gris clair)

## Contraintes et spécificités
- **Terrain argileux pentu** : Étude géotechnique obligatoire
- **Réglementation Le Lavandou** : Contraintes proximité mer
- **Planning :** 16-20 mois total (études + travaux)
- **Fiabilité potentiel :** Très élevée (5/5)

## Points d'attention
- Le dossier contient deux versions (racine + PROPOSITION-COMMERCIALE-main)
- Version racine = version active avec NavigationSidebar et PdfDocument
- Données synchronisées entre interface web et PDF
- Gestion spécifique du responsive pour vrais mobiles uniquement