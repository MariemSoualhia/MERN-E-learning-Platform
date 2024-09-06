# E-Learning Platform

Bienvenue dans le projet **E-Learning Platform**. Cette application est conçue pour offrir une solution d'apprentissage en ligne, permettant aux utilisateurs de suivre des formations, de s'inscrire à des cours, et aux administrateurs de gérer l'ensemble des formations, formateurs, et apprenants.

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)

## Fonctionnalités

- **Authentification et Autorisation** : Connexion sécurisée avec gestion des rôles (admin, formateur, apprenant).
- **Gestion des Formateurs** : Ajout, modification, suppression de formateurs et de leurs formations.
- **Ajout d'une Formation** : Possibilité pour un formateur d'ajouter une formation à la plateforme.
- **Gestion des Formations** : Création, modification, suppression de formations par les administrateurs.
- **Ajout de Vidéos par les Formateurs** : Les formateurs peuvent ajouter des vidéos aux formations, permettant une meilleure expérience d'apprentissage.
- **Consultation des Vidéos par les Apprenants** : Les apprenants peuvent visionner les vidéos associées aux formations auxquelles ils sont inscrits.
- **Suivi des Formations** : Les formateurs peuvent suivre leurs formations et gérer les inscriptions des apprenants.
- **Inscriptions aux Formations** : Les apprenants peuvent consulter les formations disponibles, s'inscrire aux formations de leur choix et suivre leur progression.
- **Gestion des Quiz** : Création, modification, et suppression de quiz associés aux formations.
- **Soumission de Quiz** : Les apprenants peuvent soumettre leurs réponses aux quiz et recevoir un score.
- **Statistiques des Quiz** : Les formateurs et les administrateurs peuvent visualiser des statistiques détaillées sur les quiz, y compris le nombre de quiz créés, les soumissions totales de quiz, et les scores moyens.
- **Dashboard** : Tableau de bord pour les apprenants, formateurs, et administrateurs avec statistiques détaillées.
- **Support de l'Upload d'Images** : Gestion des images pour les profils et les formations.
- **Notifications en Temps Réel** : Notifications via socket.io pour les mises à jour en temps réel.

## Installation

### Prérequis

- **Node.js** (version 14.x ou supérieure)
- **MongoDB** (version 4.x ou supérieure)
- **npm** ou **yarn**

### Étapes d'Installation

1. Clonez ce dépôt :

   ```bash
   git clone https://github.com/MariemSoualhia/MERN-E-learning-Platform.git
   cd e-learning-platform
   ```

2. Installez les dépendances pour le backend :

   ```
   cd backend
   npm install
   ```

3. Installez les dépendances pour le frontend :

   ```
   cd ../frontend
   npm install

   ```

### Configuration

Créez un fichier .env dans le dossier backend et ajoutez les configurations nécessaires :

```
# .env file
MONGO_URI=mongodb://localhost:27017/e-learning
JWT_SECRET=votre_secret_jwt
PORT=5000
EMAIL_USER=user@gmail.com
EMAIL_PASS=**********

```

### Utilisation

1. Démarrez le backend :
   ```
   cd backend
   npm start
   ```
2. Démarrez le frontend :
   ```
   cd ../frontend
   npm start
   ```

### Structure du Projet

Voici la structure du projet :

```
e-learning-platform/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── db.js
│   ├── package.json
│   ├── server.js
│   └── socket.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   └── reportWebVitals.js
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```
