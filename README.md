# ESN

Ce projet contient une interface React et un petit serveur Express.

## Démarrage du serveur API

```
npm run server
```

Le serveur fournit des endpoints REST sous `/api/consultants` et `/api/clients` permettant de récupérer, créer, mettre à jour et supprimer respectivement des consultants et des clients.

### Filtrage et pagination

Les endpoints `/api/consultants` et `/api/clients` acceptent plusieurs paramètres de requête :

- `status` &nbsp;: filtre les consultants par statut.
- `search` &nbsp;: recherche par prénom ou nom (insensible à la casse).
- `limit` &nbsp;: nombre d'éléments par page.
- `page` &nbsp;: numéro de la page (par défaut `1`).

Exemple :

```
GET /api/consultants?status=available&limit=20&page=2

GET /api/clients?limit=20&page=1
```

## Démarrage de l'application

```
npm run dev
```

