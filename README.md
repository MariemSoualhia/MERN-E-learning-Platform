# E-Learning Platform

Bienvenue dans le projet **E-Learning Platform**. Cette application est conçue pour offrir une solution d'apprentissage en ligne, permettant aux utilisateurs de suivre des formations, de s'inscrire à des cours, et aux administrateurs de gérer l'ensemble des formations, formateurs, et apprenants.

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Contributions](#contributions)
- [Licence](#licence)

## Fonctionnalités

- **Authentification et Autorisation**: Connexion sécurisée avec gestion des rôles (admin, formateur, apprenant).
- **Gestion des Formateurs**: Ajout, modification, suppression de formateurs et de leurs formations.
- **Ajout d'une formation**: Possibilité pour un formateur d'ajouter une formation à la plateforme.
- **Gestion des Formations**: Création, modification, suppression de formations par les administrateurs.
- **Suivi des Formations**: Les formateurs peuvent suivre leurs formations et gérer les inscriptions des apprenants.
- **Inscriptions aux Formations**: Les apprenants peuvent consulter les formations disponibles, s'inscrire aux formations de leur choix et suivre leur progression.
- **Dashboard**: Tableau de bord pour les apprenants, formateurs, et administrateurs avec statistiques détaillées.
- **Support de l'Upload d'Images**: Gestion des images pour les profils et les formations.
- **Notifications en temps réel**: Notifications via socket.io pour les mises à jour en temps réel.

## Installation

### Prérequis

- **Node.js** (version 14.x ou supérieure)
- **MongoDB** (version 4.x ou supérieure)
- **npm** ou **yarn**

### Étapes d'installation

1. Clonez ce dépôt :

   ```bash
   git clone https://github.com/votre-nom-utilisateur/e-learning-platform.git
   cd e-learning-platform
   ```

2. Installez les dépendances pour le backend :

   ```bash
   cd backend
   npm install
   ```

3. Créez un fichier .env dans le dossier backend et ajoutez les configurations nécessaires :

   ```
   # .env file
   MONGO_URI=mongodb://localhost:27017/e-learning
   JWT_SECRET=votre_secret_jwt
   PORT=5000
   EMAIL_USER=user@gmail.com
   EMAIL_PASS=**********
   ```

4. Installez les dépendances pour le frontend :

   ```
   cd ../frontend
   npm install
   ```

### Démarrez l'application :

```
# Démarrage du backend
cd backend
npm start

# Démarrage du frontend
cd ../frontend
npm start

```
