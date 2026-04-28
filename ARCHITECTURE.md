# 🏗️ Architecture Technique — Smart Parking System

## Vue d'ensemble

Ce document décrit l'architecture technique complète du système de gestion de parking intelligent avec diagrammes UML complets.

---

## 🎨 Architecture Globale

```mermaid
graph TB
    subgraph "Frontend - React 19"
        UI[Interface Utilisateur]
        Redux[Redux Store]
        Components[Composants React]
    end
    
    subgraph "Backend - Laravel 12"
        API[API REST]
        Auth[Authentification Sanctum]
        Controllers[Controllers]
        Services[Services]
        Models[Models Eloquent]
        Queue[Queue Redis]
    end
    
    subgraph "Base de Données"
        MySQL[(MySQL Database)]
        Redis[(Redis Cache)]
    end
    
    subgraph "Services Externes"
        Stripe[Stripe Payment]
        Pusher[Pusher Broadcasting]
    end
    
    UI --> API
    API --> Auth
    Auth --> Controllers
    Controllers --> Services
    Services --> Models
    Models --> MySQL
    Services --> Redis
    Services --> Queue
    Controllers --> Stripe
    Controllers --> Pusher
```

---

## 📊 Diagramme de Classes

```mermaid
classDiagram
    class User {
        +int id
        +string name
        +string email
        +string role
        +json notification_preferences
        +isAdmin() bool
        +reservations() Reservation[]
    }
    
    class Sector {
        +int id
        +string name
        +string description
        +int total_places
        +float price_per_hour
        +places() Place[]
    }
    
    class Place {
        +int id
        +int sector_id
        +string number
        +string status
        +sector() Sector
        +reservations() Reservation[]
    }
    
    class Reservation {
        +int id
        +int user_id
        +int place_id
        +datetime start_time
        +datetime end_time
        +float total_price
        +string status
        +string qr_code_token
        +datetime checked_in_at
        +datetime checked_out_at
        +user() User
        +place() Place
    }
    
    class AuditLog {
        +int id
        +int user_id
        +string action
        +string model_type
        +int model_id
        +json changes
        +string ip_address
        +datetime created_at
    }
    
    class ParkingMetric {
        +int id
        +date date
        +int hour
        +int total_reservations
        +float occupancy_rate
        +float revenue
        +float average_duration
    }
    
    User "1" --> "*" Reservation : fait
    Sector "1" --> "*" Place : contient
    Place "1" --> "*" Reservation : est réservé
    User "1" --> "*" AuditLog : génère
```

---

## 🔄 Diagramme de Séquence - Réservation Complète

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend React
    participant A as API Laravel
    participant S as Service Réservation
    participant DB as MySQL
    participant Q as Queue
    participant N as Notification
    participant Str as Stripe
    
    U->>F: Sélectionne place et horaires
    F->>A: POST /api/predictions/recommend-sector
    A->>S: Recommandation intelligente
    S->>DB: Analyse historique
    DB-->>S: Données metrics
    S-->>A: Meilleur secteur
    A-->>F: Recommandation
    F-->>U: Affiche recommandation
    
    U->>F: Confirme réservation
    F->>A: POST /api/book/reservation
    A->>S: Créer réservation
    S->>DB: Vérifier disponibilité
    DB-->>S: Place disponible
    S->>DB: Créer réservation
    S->>DB: Marquer place occupée
    S-->>A: Réservation créée
    
    A->>Str: Créer session paiement
    Str-->>A: Session URL
    A-->>F: URL paiement
    F-->>U: Redirection Stripe
    
    U->>Str: Effectue paiement
    Str->>A: Webhook payment_intent.succeeded
    A->>S: Confirmer réservation
    S->>DB: Update status = "confirmed"
    S->>Q: Dispatch GenerateQRCodeJob
    S->>Q: Dispatch SendConfirmationEmail
    
    Q->>N: Notification utilisateur
    N-->>U: Email confirmation + QR Code
```

---

## 📱 Diagramme QR Code Check-in/Check-out
│  │  MySQL   │  │  Redis   │  │   Reverb   │  │  Stripe  │ │
│  │ Database │  │  Cache   │  │ WebSocket  │  │   API    │ │
│  └──────────┘  └──────────┘  └────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Modèle de données (ERD)

### Schéma relationnel

```
┌─────────────────────┐
│       USERS         │
├─────────────────────┤
│ id (PK)            │
│ name               │
│ email (unique)     │
│ password           │
│ role (enum)        │──┐
│ timestamps         │  │
└─────────────────────┘  │
                         │ 1:N
                         │
┌─────────────────────┐  │
│     SECTORS         │  │
├─────────────────────┤  │
│ id (PK)            │  │
│ name               │──┐│
│ description        │  ││
│ location           │  ││
│ timestamps         │  ││
└─────────────────────┘  ││
          1:N            ││
           │             ││
┌─────────────────────┐  ││
│      PLACES         │  ││
├─────────────────────┤  ││
│ id (PK)            │  ││
│ sector_id (FK) ────┘  ││
│ place_number       │   │
│ status (enum)      │──┐│
│ timestamps         │  ││
└─────────────────────┘  ││
          1:N            ││
           │             ││
┌─────────────────────┐  ││
│   RESERVATIONS      │  ││
├─────────────────────┤  ││
│ id (PK)            │  ││
│ user_id (FK) ──────┼──┘│
│ place_id (FK) ─────┘   │
│ start_time         │    │
│ end_time           │    │
│ status (enum)      │    │
│ amount (decimal)   │    │
│ paid (boolean)     │    │
│ timestamps         │────┐
└─────────────────────┘   │
          1:1             │
           │              │
┌─────────────────────┐   │
│  STRIPE_SESSIONS    │   │
├─────────────────────┤   │
│ id (PK)            │   │
│ reservation_id (FK)┼───┘
│ session_id (unique)│
│ status (enum)      │
│ timestamps         │
└─────────────────────┘

┌─────────────────────┐
│       TASKS         │
├─────────────────────┤
│ id (PK)            │
│ title              │
│ description        │
│ assigned_to (FK)   │──┐
│ status (enum)      │  │ N:1
│ priority           │  │
│ timestamps         │  │
└─────────────────────┘  │
                         │
         ┌───────────────┘
         │
┌─────────────────────┐
│    AUDIT_LOGS       │
├─────────────────────┤
│ id (PK)            │
│ user_id (FK) ──────┼─►
│ action             │
│ entity_type        │
│ entity_id          │
│ old_values (json)  │
│ new_values (json)  │
│ ip_address         │
│ user_agent         │
│ created_at         │
└─────────────────────┘
```

### Status et énumérations

#### User.role
- `admin` : Administrateur (accès complet)
- `user` : Utilisateur standard

#### Place.status
- `available` : Place disponible
- `reserved` : Place réservée
- `occupied` : Place occupée

#### Reservation.status
- `pending` : En attente de paiement
- `reserved` : Réservée et payée
- `parked` : Véhicule présent sur la place
- `finished` : Terminée
- `cancelled` : Annulée

---

## 🔄 Flux de données

### 1. Flux de réservation

```
[Client React]                [Laravel API]              [Services Externes]
      │                             │                            │
      ├─ GET /api/places ──────────►│                            │
      │                             ├─ Query DB                  │
      │◄─── Places disponibles ─────┤                            │
      │                             │                            │
      ├─ POST /api/book/reservation►│                            │
      │  {place_id, start, end}     ├─ Validate                  │
      │                             ├─ Create Reservation        │
      │                             │   (status: pending)         │
      │◄─── {reservation_id} ────────┤                            │
      │                             │                            │
      ├─ POST /api/pay/create/:id ──►│                            │
      │                             ├─ Create Stripe Session ───►│
      │                             │                            │
      │◄─── {checkout_url} ──────────┤◄────── session_id ────────┤
      │                             │                            │
      ├─ Redirect to Stripe ────────┼───────────────────────────►│
      │                             │                            │
      │                   [Webhook] │                            │
      │                             │◄─── payment_succeeded ──────┤
      │                             ├─ Update Reservation        │
      │                             │   (status: reserved)        │
      │                             ├─ Broadcast Event           │
      │                             │   (WebSocket)               │
      │◄──── Place status updated ───┤                            │
      │      (via WebSocket)        │                            │
```

### 2. Flux d'authentification

```
[React Client]              [Laravel API]                [DB]
      │                             │                      │
      ├─ POST /api/user/register ──►│                      │
      │  {name, email, password}    ├─ Validate            │
      │                             ├─ Hash password       │
      │                             ├─ Create User ───────►│
      │                             │                      │
      │◄─── {user, token} ───────────┤◄─────────────────────┤
      │                             │                      │
      ├─ Store token (localStorage) │                      │
      │                             │                      │
      ├─ GET /api/user ─────────────►│                      │
      │  Header: Bearer {token}     ├─ auth:sanctum        │
      │                             ├─ Verify token        │
      │                             ├─ Load User ─────────►│
      │◄─── {user} ──────────────────┤◄─────────────────────┤
```

### 3. Flux temps réel (WebSocket)

```
[Admin Dashboard]        [Reverb Server]         [Laravel Backend]
       │                        │                        │
       ├─ Subscribe to ─────────►│                        │
       │  "place.updated"       │                        │
       │                        │         [Event]        │
       │                        │◄─── PlaceStatusUpdated ┤
       │                        │      {place_id, status}│
       │                        │                        │
       │◄─── Broadcast event ────┤                        │
       ├─ Update UI             │                        │
       │  (place status)        │                        │
```

---

## 🔒 Sécurité

### Architecture de sécurité

#### 1. Authentification (Laravel Sanctum)
```
Client Request
    ↓
Bearer Token Validation
    ↓
User Identity Resolution
    ↓
Access Granted/Denied
```

**Avantages:**
- Token stateless (pas de session serveur)
- Révocation possible (table personal_access_tokens)
- Compatible SPA et mobile

#### 2. Autorisation (Middleware & Policies)

```php
// Middleware d'administration
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Routes admin uniquement
});

// Policy pour réservation
Gate::define('cancel-reservation', function ($user, $reservation) {
    return $user->id === $reservation->user_id || $user->isAdmin();
});
```

#### 3. Validation stricte (Form Requests)

Toutes les données entrantes sont validées:

```php
class StoreReservationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'place_id' => 'required|exists:places,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
        ];
    }
}
```

#### 4. Protection CSRF & CORS

```php
// CORS configuré pour frontend uniquement
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
```

#### 5. Rate Limiting

```php
// 60 requêtes par minute par IP
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->ip());
});
```

#### 6. Audit Logging

Toutes les actions sensibles sont enregistrées:
- Changement de rôle utilisateur
- Annulation de réservation
- Modification de place
- Accès admin

---

## 📡 API REST

### Convention de nommage

```
GET    /api/resource          Liste (index)
GET    /api/resource/{id}     Détail (show)
POST   /api/resource          Création (store)
PUT    /api/resource/{id}     Mise à jour complète (update)
DELETE /api/resource/{id}     Suppression (destroy)
```

### Format de réponse standardisé

#### Succès (2xx)
```json
{
  "data": { ... },
  "message": "Success",
  "meta": {
    "page": 1,
    "per_page": 15,
    "total": 150
  }
}
```

#### Erreur (4xx, 5xx)
```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### Authentification

Toutes les routes protégées requièrent:

```
Authorization: Bearer {sanctum_token}
```

---

## ⚡ Performance

### Stratégies d'optimisation

#### 1. Cache (Redis)
- Configuration utilisateur
- Places disponibles (TTL: 60s)
- Statistiques dashboard (TTL: 5min)

#### 2. Eager Loading (N+1 Query Problem)
```php
// ❌ Mauvais (N+1 problème)
$reservations = Reservation::all();
foreach ($reservations as $r) {
    echo $r->user->name; // Query additionnel
}

// ✅ Bon (Eager loading)
$reservations = Reservation::with('user', 'place')->get();
```

#### 3. Pagination
Toutes les listes utilisent la pagination:
```php
return PlaceResource::collection(
    Place::paginate(15)
);
```

#### 4. Queue pour tâches lourdes
- Envoi d'emails
- Génération de rapports
- Traitement paiements

```php
ProcessPayment::dispatch($reservation)->onQueue('payments');
```

---

## 🚀 Déploiement

### Architecture de déploiement

```
                     ┌──────────────┐
                     │   NGINX      │
                     │ Reverse Proxy│
                     │  (Port 80)   │
                     └──────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
      ┌───────▼─────┐            ┌────────▼─────┐
      │   React     │            │   Laravel    │
      │   (Vite)    │            │   (PHP-FPM)  │
      │  Port 5173  │            │  Port 8000   │
      └─────────────┘            └───────┬──────┘
                                         │
                        ┌────────────────┼────────────────┐
                        │                │                │
                 ┌──────▼────┐   ┌──────▼────┐   ┌──────▼────┐
                 │   MySQL   │   │   Redis   │   │  Reverb   │
                 │  Port 3306│   │ Port 6379 │   │ Port 8080 │
                 └───────────┘   └───────────┘   └───────────┘
```

### Docker Compose

Voir fichier `docker-compose.yml` (à créer dans prochaine étape)

---

## 📊 Monitoring

### Métriques à surveiller

#### Application
- Temps de réponse API (< 200ms)
- Taux d'erreur (< 1%)
- Disponibilité (> 99.5%)

#### Business
- Nombre de réservations/jour
- Taux d'occupation
- Revenus

#### Infrastructure
- CPU, RAM, Disk
- Connexions DB actives
- Queue backlog

---

## 🔄 CI/CD Pipeline

```
GitHub Push
    ↓
GitHub Actions Trigger
    ↓
Run Tests
    ├─ PHPUnit/Pest (Backend)
    ├─ Jest (Frontend)
    └─ Linting (Pint, ESLint)
    ↓
Build Docker Images
    ↓
Push to Registry (Docker Hub)
    ↓
Deploy to Production
    ↓
Health Check
    ↓
Success Notification
```

---

**Auteur:** [Votre nom]  
**Date:** 17 Mars 2026  
**Version:** 1.0
