#!/bin/bash

echo "🔥 Déploiement des règles Firestore..."
echo
echo "⚠️  ATTENTION: Ces règles sont en mode développement"
echo "⚠️  Elles permettent l'accès libre aux données"
echo "⚠️  À modifier avant la production !"
echo

read -p "Appuyez sur Entrée pour continuer..."

echo "Déploiement en cours..."
firebase deploy --only firestore:rules

echo
echo "✅ Règles Firestore déployées !"
echo "🔄 Attendez quelques secondes pour la propagation..."
echo

read -p "Appuyez sur Entrée pour terminer..."