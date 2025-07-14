# TODO

Cette liste regroupe les étapes à réaliser pour remplacer les données simulées par une vraie base de données sans modifier l'interface utilisateur.

1. **Mettre en place le backend**
   - [x] Initialiser un projet Node.js/Express dans un dossier `server/`.
   - [ ] Configurer un ORM (Prisma ou TypeORM) et la connexion à PostgreSQL.
   - [ ] Définir les modèles `Consultant`, `Client`, `Project`, `Contract`, etc.
   - [ ] Générer la base et créer un script de peuplement avec les données de départ.
2. **Créer les routes API**
   - [x] Endpoints REST pour récupérer, créer, mettre à jour et supprimer chaque entité.
   - [ ] Gestion des filtres et de la pagination pour les listes.
3. **Adapter le front‑end**
   - [x] Créer des hooks (`useClients`, `useConsultants`, …) effectuant les appels `fetch` vers l'API.
   - [x] Remplacer les `useState` contenant des mocks par ces hooks.
   - [x] Prévoir des états de chargement/erreur.
4. **Mise à jour des tests**
   - [x] Écrire des tests backend pour les routes (Jest + Supertest).
   - [ ] Adapter les tests React existants pour utiliser `msw` ou `jest-fetch-mock` et simuler l'API.
5. **Déploiement et documentation**
   - [x] Documenter la configuration de la base et la procédure de démarrage du serveur.
   - [x] Ajouter des scripts npm (`npm run server`, `npm run dev:full` pour lancer front et back).

