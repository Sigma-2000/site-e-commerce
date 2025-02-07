# site-e-commerce

## Description

Ce projet est un **site e-commerce** destiné à promouvoir et vendre les œuvres d'une **artiste pluridisciplinaire** (graffiti, art numérique, Polaroid, peinture, monotypes). Le site propose une galerie pour exposer les œuvres, une boutique pour acheter des prints et des peintures originales, ainsi qu'une section biographique et des informations sur les expositions passées et futures.

## Lien du projet

Dépôt **GitHub** : Sigma-2000/site-e-commerce
Déploiement **Front-end** sur [Vercel](https://site-e-commerce-git-staging-sigma2000s-projects.vercel.app?_vercel_share=Vc6VxGuArxuoxQwbRv7RyGUfDCwk5gQK)
Deploiement **Back-end** sur [render](https://site-e-commerce-ydc0.onrender.com/)

## Technologies utilisées

### Front-end

Vue.js 3 + Vue Router + Pinia

Sass (SCSS)

Axios

i18n

### Back-end

Node.js + Express.js

MongoDB + Mongoose

Multer

Cloudinary

Bcrypt

Cookie Parser + JWT

Stripe

### Déploiement & CI/CD

Front-end : Vercel

Back-end : Render

Base de données : MongoDB Atlas

Gestion du code : GitHub avec branches (main, staging, feat/)

## Fonctionnalités principales

Galerie d'œuvres

Catégorisation des œuvres par medium (peinture, graffiti, photographie...)

Page détaillée pour chaque œuvre (dimensions, description, disponibilité...)

E-commerce

Sélection et achat de produits

Gestion du panier

Paiement sécurisé via Stripe

Compte utilisateur

Inscription et connexion avec JWT

Interface de gestion des comptes

Suivi des commandes

Suppression du compte

Interface administrateur

CRUD (lecture, ajout, modification, suppression) des œuvres et produits

Gestion des commandes

Système de gestion des stocks

Paramètres utilisateur

Sélection du mode jour/nuit

Choix de langue (FR/EN)

## Installation et exécution

### Cloner le projet

```sh
git clone https://github.com/Sigma-2000/site-e-commerce.git
cd site-e-commerce
```

### Installation des dépendances

#### Front-end

```sh
cd front
cd site-e-commerce
npm install
```

#### Back-end

```sh
cd back
cd site-e-commerce
npm install
```

#### Configuration des variables d'environnement

Créer un fichier **.env** dans le dossier back avec les variables nécessaires :

```sh
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET=your_stripe_key
CLOUDINARY_URL=your_cloudinary_url
```

Créer un fichier **.env** dans le dossier front avec les variables nécessaires :

```sh
VITE_BACK_API_BASE_URL
VITE_STRIPE_PUBLIC_KEY
```

## Lancer le projet en local

### Démarrer le back-end

```sh
cd back
cd site-e-commerce
npm start
```

### Démarrer le front-end

```sh
cd front
cd site-e-commerce
npm run dev
```

### Tester le tableau de bord de l'admin

connectez-vous à amelieguyot7@gmail.com
entrez le mdp: PASSWORDsoutenance7@

## Ressources

[Vue](https://vuejs.org/)

[Vue-Router](https://router.vuejs.org/)

[Sass](https://sass-lang.com/blog/import-is-deprecated/)

[i18n](https://vue-i18n.intlify.dev/)

[Axios](https://axios-http.com/fr/docs/intro)

[Express](https://expressjs.com/)

[Mongoose](https://mongoosejs.com/)

[Stripe](https://docs.stripe.com/payments/checkout)

[Stripe-js](https://docs.stripe.com/js)

[Multer](https://github.com/expressjs/multer/blob/master/doc/README-fr.md)

Exemple d'articles consultés pour résolution de problème:

[erreur-404-deploy-vercel](http://medium.com/%40awdhesh1700/how-to-resolve-the-404-not-found-error-in-vercel-deployments-a0fe90c1447a)

[no-password-in-api-response](https://stackoverflow.com/questions/28838640/mongoose-how-can-i-access-a-selectfalse-property-in-a-schema-method)

[remove-vue-html](https://vue-i18n.intlify.dev/guide/advanced/component)

[read-me](https://medium.com/@lexnotor/%C3%A9crire-un-fichier-readme-md-37bad6cb2a7e)

[manage-cart](https://medium.com/@qausa/the-dynamics-of-shopping-carts-in-e-commerce-bridging-the-frontend-and-backend-786c19def4cb)

[cart-process](https://www.quora.com/What-happens-at-the-back-end-of-a-website-between-when-a-user-adds-a-product-to-cart-and-the-final-checkout-process-is-complete-Can-a-developer-please-give-a-step-by-step-overview-that-a-layperson-would-understand)

[tmp-remove-by-render](https://nodejs.org/api/fs.html)
