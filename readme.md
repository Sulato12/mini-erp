# Mini-ERP — Stock & Ventes

Application d'entraînement technique : gestion de produits, clients et commandes de vente, avec mise à jour automatique du stock. Projet réalisé pour se préparer à un poste de développeur sur une stack **Python (Django) / PostgreSQL / Ionic React**.
Ce projet a très largement était assissté par IA.

## Stack technique

| Couche               | Techno                              |
| -------------------- | ----------------------------------- |
| Backend              | Django + Django REST Framework      |
| Base de données      | PostgreSQL (conteneur Docker local) |
| Authentification     | Token (DRF `TokenAuthentication`)   |
| Frontend             | Ionic React + Capacitor             |
| Stockage local (app) | `@capacitor/preferences`            |

## Fonctionnalités

- Authentification par token
- Liste des produits avec stock calculé en temps réel (recherche, badges colorés, pull-to-refresh)
- Liste des commandes avec filtre par statut
- Détail d'une commande : confirmation / annulation avec vérification du stock
- Tableau de bord avec statistiques rapides
- Navigation mobile par onglets (tabs)

## Architecture du projet

```
mini-erp/
├── docker-compose.yml       # PostgreSQL local
├── backend/                 # API Django
│   ├── config/               # settings, urls
│   └── sales/                 # app métier
│       ├── models.py           # Partner, Product, SaleOrder, SaleOrderLine, StockMove
│       ├── serializers.py      # conversion JSON
│       ├── views.py            # ViewSets + actions confirm/cancel
│       ├── services.py         # logique métier (confirm_order, cancel_order)
│       └── admin.py            # interface d'administration
└── frontend/                # App Ionic React
    └── src/
        ├── models/            # interfaces TypeScript (Product, Order)
        ├── services/          # api.ts (appels HTTP + gestion du token)
        ├── components/         # PrivateRoute, MainTabs
        └── pages/              # Login, Home, Products, Orders, OrderDetail
```

## Modèle de données

Le stock n'est **jamais stocké directement** : il est calculé à partir de la somme des `StockMove` liés à un produit. Chaque vente confirmée crée un mouvement de sortie (quantité négative), chaque annulation crée le mouvement inverse.

```
Partner (client) ──< SaleOrder >── SaleOrderLine >── Product
                          │                              │
                          └──────< StockMove >───────────┘
```

## Prérequis

- Python 3.11+
- Node.js 18+
- Docker Desktop
- Ionic CLI (`npm install -g @ionic/cli`)

## Installation et lancement

### 1. Base de données (PostgreSQL via Docker)

Depuis la racine du projet (`mini-erp/`) :

```bash
docker compose up -d
docker compose ps        # vérifier que minierp-db tourne
```

### 2. Backend Django

```bash
cd backend
source .venv/Scripts/activate      # Windows (Git Bash)
# source .venv/bin/activate         # macOS / Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # si pas déjà fait
python manage.py runserver
```

L'API est disponible sur `http://127.0.0.1:8000/api/`, l'admin sur `http://127.0.0.1:8000/admin/`.

### 3. Frontend Ionic

Dans un second terminal :

```bash
cd frontend
npm install
ionic serve
```

L'app est disponible sur `http://localhost:8100`.

> Le backend doit tourner pour que le frontend fonctionne (`CORS_ALLOWED_ORIGINS` autorise `localhost:8100`).

## Principales routes API

| Méthode  | URL                         | Description                                            |
| -------- | --------------------------- | ------------------------------------------------------ |
| POST     | `/api/login/`               | Authentification, renvoie un token                     |
| GET/POST | `/api/products/`            | Liste / création de produits                           |
| GET/POST | `/api/partners/`            | Liste / création de clients                            |
| GET/POST | `/api/orders/`              | Liste / création de commandes                          |
| GET      | `/api/orders/{id}/`         | Détail d'une commande                                  |
| POST     | `/api/orders/{id}/confirm/` | Confirme une commande (vérifie et décrémente le stock) |
| POST     | `/api/orders/{id}/cancel/`  | Annule une commande confirmée (restaure le stock)      |

Toutes les routes (sauf `/login/`) nécessitent l'en-tête :

```
Authorization: Token <votre_token>
```

## Logique métier : confirmation d'une commande

1. La commande doit être au statut `draft`, sinon erreur `409`.
2. Pour chaque ligne, vérification que le stock disponible est suffisant.
3. Si tout est bon : création des `StockMove` de sortie et passage au statut `confirmed`, le tout dans une transaction atomique.
4. L'annulation (`cancel`) fonctionne symétriquement : elle n'est possible que depuis le statut `confirmed`, et restaure le stock via des mouvements inverses.

## Notes de développement

- Le stock étant dérivé (jamais stocké), toute nouvelle fonctionnalité qui l'affiche doit passer par `Product.objects.with_stock()`.
- `services.py` contient volontairement toute la logique métier, séparée des vues DRF, pour rester testable et réutilisable indépendamment du HTTP.
