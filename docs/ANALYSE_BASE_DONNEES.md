# Analyse pour le remplacement des données mock

## Contexte actuel

- Le projet est une application React/TypeScript démarrée avec Vite.
- Les modules de l'IHM (par exemple `ConsultantDashboard`, `ClientManagement` ou `ESNManagementModule`) utilisent des `useState` contenant des tableaux d'objets pour simuler des clients, consultants, projets, etc.
- Il n'existe actuellement aucun appel réseau ni backend : toutes les données sont chargées directement depuis le code source.
- Les composants de l'interface utilisent ces structures pour afficher des tableaux, graphiques et formulaires.

## Objectif

Remplacer ces données statiques par des données provenant d'une base de données tout en conservant les écrans existants tels quels.

## Proposition d'architecture

1. **Backend API**
   - Mettre en place un service Node.js (Express) exposant une API REST ou GraphQL.
   - Utiliser un ORM comme Prisma ou TypeORM pour interagir avec une base PostgreSQL (ou autre SGBD selon les contraintes).
   - Définir les modèles : `Consultant`, `Client`, `Project`, `Contract`, etc., en suivant la structure des objets actuellement utilisés dans les hooks `useState`.
   - Prévoir des routes CRUD (liste, création, mise à jour, suppression) pour chacune de ces entités.

2. **Accès base de données**
   - Créer un schéma SQL reprenant les champs présents dans les mocks (ex. `consultants`, `clients`, `projects`).
   - Prévoir des relations :
     - un client possède plusieurs projets et contrats ;
     - un consultant peut être affecté à un projet ;
     - etc.
   - Initialiser la base avec des données de test permettant de reproduire l'affichage actuel.

3. **Intégration front‑end**
   - Remplacer les `useState([...])` par des appels API via `fetch` ou `axios` dans des `useEffect` ou hooks dédiés.
   - Conserver la même forme des objets côté front pour ne pas modifier les composants de présentation.
   - Gérer le chargement et les erreurs (états `loading`/`error`).
   - Mettre à jour les hooks personnalisés (`useConsultantData`, etc.) pour utiliser l'API.

4. **Tests et validation**
   - Ajouter des tests backend (ex. Jest + Supertest) pour les routes.
   - Adapter les tests front existants en simulant les appels réseau.
   - Vérifier que l'interface ne change pas (mêmes colonnes, mêmes cartes, etc.).

## Points de vigilance

- Les formats de dates et d'énumérations doivent rester identiques pour éviter de modifier la logique d'affichage.
- Privilégier une compatibilité ascendante : conserver les mêmes noms de champs dans les réponses API que dans les mocks.
- Prévoir une étape de migration progressive : possibilité de conserver des mocks lorsque l'API n'est pas disponible.

