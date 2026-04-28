# Guide d'Administration — Parking App

## Vue d'ensemble

L'application dispose d'un système d'administration complet permettant de gérer :

| Module       | Description                              |
|--------------|------------------------------------------|
| Utilisateurs | Gestion des comptes et des rôles         |
| Places       | CRUD complet des places de parking       |
| Secteurs     | Organisation et regroupement des places  |
| Réservations | Visualisation et annulation              |
| Tâches       | Suivi des tâches administratives         |
| Dashboard    | Statistiques en temps réel               |

---

## Démarrage rapide

### 1. Initialiser la base de données

```bash
cd backend
php artisan migrate:fresh --seed
```

### 2. Démarrer les serveurs

```bash
# Backend
cd backend
php artisan serve

# Frontend (dans un autre terminal)
cd frontend
npm run dev
```

### 3. Connexion admin

Ouvrez le navigateur sur `http://localhost:5173` et connectez-vous avec :

```
Email        : admin@example.com
Mot de passe : secret123
```

> **Important** : Changez ces identifiants avant toute mise en production.

---

## Pages d'administration

| URL                   | Description                    |
|-----------------------|--------------------------------|
| `/admin/dashboard`    | Statistiques globales           |
| `/admin/users`        | Gestion des utilisateurs        |
| `/admin/places`       | Gestion des places de parking   |
| `/admin/sectors`      | Gestion des secteurs            |
| `/admin/reservations` | Gestion des réservations        |
| `/admin/tasks`        | Gestion des tâches              |

---

## API Endpoints

Toutes les routes nécessitent un **Bearer Token** Sanctum et le rôle `admin`.

**Base URL** : `http://localhost:8000/api/admin`

### Dashboard

```
GET  /dashboard
```

### Utilisateurs

```
GET    /users
GET    /users/{id}
PUT    /users/{id}
DELETE /users/{id}
POST   /users/{id}/change-role
```

### Places

```
GET    /places
POST   /places
GET    /places/{id}
PUT    /places/{id}
DELETE /places/{id}
GET    /places/sector/{id}
```

### Secteurs

```
GET    /sectors
POST   /sectors
GET    /sectors/{id}
PUT    /sectors/{id}
DELETE /sectors/{id}
```

### Réservations

```
GET  /reservations
GET  /reservations/statistics
GET  /reservations/{id}
POST /reservations/{id}/cancel
```

### Tâches

```
GET    /tasks
POST   /tasks
GET    /tasks/{id}
PUT    /tasks/{id}
DELETE /tasks/{id}
PUT    /tasks/{id}/status
```

---

## Statuts métier

### Réservations

| Statut      | Signification               |
|-------------|-----------------------------|
| `reserved`  | Réservation confirmée        |
| `parked`    | Véhicule actuellement garé   |
| `finished`  | Réservation terminée         |
| `cancelled` | Réservation annulée          |

### Places

| Statut      | Signification  |
|-------------|----------------|
| `available` | Place libre     |
| `reserved`  | Place réservée  |
| `occupied`  | Place occupée   |

---

## Sécurité

### Backend — Middleware `AdminCheck`

```php
// backend/app/Http/Middleware/AdminCheck.php
if (!$request->user() || !$request->user()->isAdmin()) {
    return response()->json([
        'message' => "Accès réservé aux administrateurs.",
        'error'   => 'admin_only'
    ], 403);
}
```

### Frontend — Composant `AdminRoute`

```jsx
// frontend/src/components/middleware/AdminRoute.jsx
if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
}
```

### Règles de protection

- Un admin ne peut pas **supprimer son propre compte**
- Un admin ne peut pas **retirer ses propres droits**
- Un secteur ne peut pas être **supprimé s'il contient des places**

---

## Structure du projet

### Backend

```
backend/app/Http/Controllers/Api/v1/Admin/
├── AdminDashboardController.php
├── AdminUserController.php
├── AdminPlaceController.php
├── AdminSectorController.php
├── AdminReservationController.php
└── AdminTaskController.php

backend/app/Http/Middleware/
└── AdminCheck.php

backend/database/seeders/
└── AdminUserSeeder.php

backend/routes/
└── api.php  ← routes admin protégées
```

### Frontend

```
frontend/src/
├── components/middleware/
│   └── AdminRoute.jsx
└── pages/admin/
    ├── AdminDashboard.jsx
    ├── AdminUsers.jsx
    ├── AdminPlaces.jsx
    ├── AdminSectors.jsx
    ├── AdminReservations.jsx
    └── AdminTasks.jsx
```

---

## Dépannage

### Dashboard vide ou erreur 500

1. Vérifier que le serveur tourne : `php artisan serve`
2. Consulter les logs : `backend/storage/logs/laravel.log`
3. Si vous avez relancé `migrate:fresh --seed`, **reconnectez-vous** — l'ancien token est invalidé

### Erreur 401 — Non autorisé

Le token stocké dans le navigateur est expiré ou invalide.

**Solution** : Déconnectez-vous et reconnectez-vous avec les identifiants admin.

### Erreur 403 — Accès refusé

Le compte utilisé n'a pas le rôle `admin`.

**Solution** : Vérifiez la colonne `role` dans la table `users` en base de données.

---

## Checklist de mise en production

- [ ] Modifier `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans `.env`
- [ ] Activer HTTPS
- [ ] Configurer le rate limiting sur les routes admin
- [ ] Vérifier les permissions (suppression, modification de rôle)
- [ ] Tester l'accès avec un compte utilisateur normal (doit être refusé)
- [ ] Surveiller `storage/logs/laravel.log`
