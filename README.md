# ESN

Ce projet contient une interface React et un petit serveur Express.

## Démarrage du serveur API

```
npm run server
```

Le serveur fournit des endpoints REST sous `/api/consultants` permettant de récupérer, créer, mettre à jour et supprimer des consultants.

### Filtrage et pagination

L'endpoint `/api/consultants` accepte plusieurs paramètres de requête :

- `status` &nbsp;: filtre les consultants par statut.
- `search` &nbsp;: recherche par prénom ou nom (insensible à la casse).
- `limit` &nbsp;: nombre d'éléments par page.
- `page` &nbsp;: numéro de la page (par défaut `1`).

Exemple :

```
GET /api/consultants?status=available&limit=20&page=2
```

## Démarrage de l'application

```
npm run dev
```

