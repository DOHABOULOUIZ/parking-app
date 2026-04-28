# 🔳 Guide Complet : Système QR Code Backend

## 📍 **Localisation des Fichiers Responsables du QR Code**

### 🎯 **Fichiers Principaux**

| Fichier | Chemin | Responsabilité |
|---------|--------|-----------------|
| **QRCodeService** | `backend/app/Services/QRCodeService.php` | ⭐ Logique principale du QR code |
| **QRCodeController** | `backend/app/Http/Controllers/QRCodeController.php` | 🔌 API REST endpoints |
| **ReservationController** | `backend/app/Http/Controllers/Api/v1/ReservationController.php` | Génération au moment de la réservation |
| **Reservation Model** | `backend/app/Models/Reservation.php` | Stockage du token QR (`qr_code_token`) |

---

## 🔧 **1. QRCodeService.php - LE CŒUR DU SYSTÈME**

**Chemin:** `backend/app/Services/QRCodeService.php`

C'est le service qui gère **TOUTE la logique QR Code**.

### ✨ **Méthodes Principales:**

#### **1. `generateQRCode($reservation)`**
Génère un nouveau token QR unique pour une réservation.

```php
public function generateQRCode(Reservation $reservation)
{
    // 1. Crée un token aléatoire de 32 caractères
    $token = Str::random(32);
    
    // 2. Stocke le token dans Redis/Cache pour 24h
    Cache::put(
        "qr_code:{$token}",
        [
            'reservation_id' => $reservation->id,
            'user_id' => $reservation->user_id,
            'place_id' => $reservation->place_id,
            'generated_at' => now(),
        ],
        now()->addHours(24)  // ⏰ Expire après 24 heures
    );
    
    // 3. Stocke aussi dans la base de données
    $reservation->update(['qr_code_token' => $token]);
    
    return $token;  // retourne le token (ex: "a3f5d8c9e1b2f4a6d8e9c1b5...")
}
```

**Retour:** Token string (32 caractères)

---

#### **2. `verifyQRCode($token)`**
Vérifie si un token QR est valide.

```php
public function verifyQRCode($token)
{
    // 1. Cherche d'abord dans le Cache (plus rapide)
    $data = Cache::get("qr_code:{$token}");
    
    // 2. Si pas en cache, cherche dans la DB
    if ($data) {
        $reservation = Reservation::with(['place.sector', 'user'])
            ->find($data['reservation_id']);
    } else {
        $reservation = Reservation::with(['place.sector', 'user'])
            ->where('qr_code_token', $token)
            ->first();
    }
    
    // 3. Retourne succès ou erreur
    if (!$reservation) {
        return [
            'success' => false,
            'message' => 'QR Code invalide ou expiré'
        ];
    }
    
    return [
        'success' => true,
        'reservation' => $reservation,
        'place' => $reservation->place,
        'user' => $reservation->user,
    ];
}
```

**Retour:** Tableau avec `success` (bool) et données de réservation

---

#### **3. `checkIn($token)`**
Change le statut de la réservation à "parked" (commencer le stationnement).

```php
public function checkIn($token)
{
    // 1. Vérifie le token
    $verification = $this->verifyQRCode($token);
    
    if (!$verification['success']) {
        return $verification;
    }
    
    // 2. Change le statut et la place
    $reservation = $verification['reservation'];
    $reservation->update(['status' => 'parked']);
    $reservation->place()->update(['status' => 'occupied']);
    
    return [
        'success' => true,
        'message' => 'Check-in effectué avec succès',
        'reservation' => $reservation
    ];
}
```

**Statut avant:** `reserved` → **Statut après:** `parked`

---

#### **4. `checkOut($token)`**
Change le statut à "finished" (terminer le stationnement).

```php
public function checkOut($token)
{
    // Similaire à checkIn mais:
    // Statut: 'finished'
    // Place: 'available' (libérée)
    // Calcul du montant
}
```

**Statut avant:** `parked` → **Statut après:** `finished`

---

## 🔌 **2. QRCodeController.php - LES ENDPOINTS API**

**Chemin:** `backend/app/Http/Controllers/QRCodeController.php`

### **Endpoints Disponibles:**

| Méthode | URL | Action |
|---------|-----|--------|
| `POST` | `/api/qrcode/generate/{reservationId}` | Génère le QR code |
| `POST` | `/api/qrcode/verify` | Vérifie un QR code |
| `POST` | `/api/qrcode/check-in` | Démarre le stationnement |
| `POST` | `/api/qrcode/check-out` | Termine le stationnement |

---

## 📐 **3. ReservationController - Génération Automatique**

**Chemin:** `backend/app/Http/Controllers/Api/v1/ReservationController.php` (ligne 106-108)

Quand une réservation est créée :

```php
// À la création de la réservation
DB::transaction(function() use ($place, $request, &$reservation) {
    // Créer la réservation
    $reservation = Reservation::create([...]);
    
    // ✨ GÉNÉRER LE QR CODE AUTOMATIQUEMENT
    $qrCodeService = app(QRCodeService::class);
    $qrCodeService->generateQRCode($reservation);
});
```

**Résultat:** Un token est généré automatiquement et stocké en même temps que la réservation.

---

## 💾 **4. Reservation Model - Stockage des Données**

**Chemin:** `backend/app/Models/Reservation.php`

**Champ Important:**
```php
protected $fillable = [
    'qr_code_token',  // ← Stocke le token généré
    // ... autres champs
];
```

---

## 🔄 **Flux Complet du QR Code**

```
┌──────────────────────────────────────────────────────────────┐
│                    CYCLE COMPLET DU QR CODE                   │
└──────────────────────────────────────────────────────────────┘

1️⃣ CRÉER UNE RÉSERVATION
   └─ User clique sur "Réserver"
   └─ Endpoint: POST /api/reservations
   └─ ReservationController crée la réservation
   └─ ✨ QRCodeService génère le token automatiquement
   └─ Token stocké dans DB et Cache (24h)
        ↓
2️⃣ AFFICHER LE QR CODE (Frontend)
   └─ User voit le QR code à l'écran
   └─ Endpoint: GET /api/qrcode/reservation/{id}
   └─ QRCodeController retourne:
      - Token texte (ex: "a3f5d8c9e1b2f4a6d8e9c1b5...")
      - Image SVG encodée en base64
        ↓
3️⃣ CHECK-IN AU PARKING (Admin Scanner)
   └─ Admin scanne le QR code / saisit le token
   └─ Endpoint: POST /api/qrcode/check-in
   └─ Requête: { "qr_code": "a3f5d8c9e1b2f4a6d8e9c1b5..." }
   └─ QRCodeService::checkIn() vérifie et update statut
   └─ Statut: reserved → parked
   └─ Place: reserved → occupied
        ↓
4️⃣ STATIONNEMENT EN COURS
   └─ Timer de facturation commence
   └─ Tarif: Prix/heure du secteur
        ↓
5️⃣ CHECK-OUT AU PARKING (Admin Scanner)
   └─ Admin scanne QR code / saisit le token
   └─ Endpoint: POST /api/qrcode/check-out
   └─ Statut: parked → finished
   └─ Place: occupied → available (libérée)
   └─ Montant calculé automatiquement
        ↓
6️⃣ PAIEMENT
   └─ User paie le montant
   └─ Statut: finished → paid
   └─ ✅ Réservation complète
```

---

## 📊 **Statuts de Réservation**

| Statut | Meaning | QR Active | Check-in/out |
|--------|---------|-----------|--------------|
| `reserved` | Réservée, pas commencée | ✅ Oui | ❌ Pas possible |
| `parked` | En stationnement | ✅ Oui | ❌ Check-in fait |
| `finished` | Stationnement terminé | ⚠️ Cache expiré | ✅ Check-out fait |
| `paid` | Paiement reçu | ❌ Non | Cycle complet |
| `cancelled` | Annulée | ❌ Non | - |

---

## 🔐 **Stockage du Token QR**

### **Contrainte Temporelle:**
```
⏰ Cache Redis: 24 heures
📅 Base de données: Permanent
```

**Stratégie:**
1. **Cache** : Stocké 24h pour vérification rapide
2. **Database** : `reservations.qr_code_token` pour historique

---

## 🖼️ **Format de l'Image QR**

```php
$qrCodeImage = QrCode::format('svg')  // Format SVG (léger, scalable)
    ->size(300)                        // 300x300 pixels
    ->margin(2)                        // Marge autour
    ->errorCorrection('H')             // Haute correction d'erreur (30%)
    ->generate($qrCode);               // Génère à partir du token
```

**Retour:** Image en base64
```
data:image/svg+xml;base64,PHN2ZyB3aWR0aD0i...
```

---

## 📋 **Endpoints API Détail**

### **1. Générer/Obtenir QR Code**
```
POST /api/qrcode/generate/{reservationId}

Réponse:
{
  "qr_code": "a3f5d8c9e1b2f4a6d8e9c1b5...",
  "qr_code_image": "data:image/svg+xml;base64,...",
  "reservation_id": 123,
  "place_number": "A-05",
  "sector_name": "Secteur A",
  "status": "confirmed",
  "total_price": 25.50
}
```

### **2. Vérifier QR Code**
```
POST /api/qrcode/verify

Body:
{
  "qr_code": "a3f5d8c9e1b2f4a6d8e9c1b5..."
}

Réponse:
{
  "success": true,
  "reservation": {...},
  "place": {...},
  "user": {...}
}
```

### **3. Check-in (Commencer Stationnement)**
```
POST /api/qrcode/check-in

Body:
{
  "qr_code": "a3f5d8c9e1b2f4a6d8e9c1b5..."
}

Réponse:
{
  "success": true,
  "message": "Check-in effectué avec succès",
  "reservation": {...}
}
```

### **4. Check-out (Terminer Stationnement)**
```
POST /api/qrcode/check-out

Body:
{
  "qr_code": "a3f5d8c9e1b2f4a6d8e9c1b5..."
}

Réponse:
{
  "success": true,
  "message": "Check-out effectué avec succès",
  "reservation": {...},
  "amount": 25.50
}
```

---

## 🎯 **Files de Responsabilité**

```
Frontend (React)
    ↓ (Affiche le QR aux users)
    ↓
QRCodeController (API REST)
    ↓ (Route les requêtes)
    ↓
QRCodeService (Logique métier) ⭐ CŒUR
    ↓ (Génère/Vérifie tokens)
    ↓
Cache (Redis) + Database
    ↓ (Stocke les tokens)
```

---

## 🔍 **Recherche de Bugs / Maintenance**

Si le QR code ne fonctionne pas:

1. ✅ Vérifier `QRCodeService.php` si la logique est correcte
2. ✅ Vérifier `QRCodeController.php` si l'API répond
3. ✅ Vérifier Cache Redis (24h d'expiration)
4. ✅ Vérifier `reservations.qr_code_token` en base de données
5. ✅ Vérifier les routes dans `routes/api.php`

---

## 📦 **Dépendances Utilisées**

```php
use SimpleSoftwareIO\QrCode\Facades\QrCode;  // Génération QR
use Illuminate\Support\Facades\Cache;         // Stock. Cache
use Illuminate\Support\Str;                   // Génération token
```

**Package:** `simplesoftware/simple-qrcode` (installed in composer.json)

---

## ✅ **Résumé**

| Composant | Rôle |
|-----------|------|
| **QRCodeService** | 🎯 Logique principale (générer, vérifier, check-in/out) |
| **QRCodeController** | 🔌 Expose les endpoints API |
| **ReservationController** | 🔄 Génère le QR at creation |
| **Reservation Model** | 💾 Stocke le token |
| **Cache/Redis** | ⚡ Accès rapide (24h) |
| **Database** | 📊 Historique permanent |
