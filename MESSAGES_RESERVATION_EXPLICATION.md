# 📝 Document : Messages de Réservation - Explication Complète

## 📌 Message Principal : "Vous avez déjà une place réservée..."

### Où est le message ?
**Fichier Backend:** `backend/app/Http/Controllers/Api/v1/ReservationController.php` (ligne 69)

### La Logique de Validation

Quand un utilisateur essaie de réserver une place, le système vérifie **3 choses dans cet ordre** :

#### 1️⃣ **Vérification : Réservation Active **
```php
$reservationExists = Reservation::where([
    'user_id' => $request->user()->id,
    'status' => 'reserved'
])->exists();

if($reservationExists) {
    return 'Vous avez déjà une place réservée. Veuillez l\'annuler pour réserver une nouvelle place.'
}
```

**Pourquoi ?** Un utilisateur ne peut avoir qu'**UNE SEULE réservation avec le statut `reserved`** à la fois.

**Statut `reserved` veut dire :**
- ✅ La place est réservée mais pas encore utilisée
- ⏳ L'utilisateur n'a pas encore commencé le stationnement
- ❌ Impossible de réserver une autre place tant que cette réservation est active

---

#### 2️⃣ **Vérification : Stationnement en Cours**
```php
$reservationParked = Reservation::where([
    'user_id' => $request->user()->id,
    'status' => 'parked'
])->exists();

if($reservationParked) {
    return 'Vous avez déjà un stationnement en cours. Veuillez le terminer pour réserver une nouvelle place.'
}
```

**Pourquoi ?** Un utilisateur ne peut avoir qu'**UN SEUL stationnement actif** (`status` = `parked`).

**Statut `parked` veut dire :**
- 🅿️ L'utilisateur est actuellement en train de se garer
- 🚗 La voiture est à la place
- ❌ Impossible de réserver une autre place tant que celle-ci est occupée

---

#### 3️⃣ **Vérification : Disponibilité de la Place**
```php
$place = Place::find($request->place_id);

if(!$place || $place->status !== 'available') {
    return 'La place n\'est pas disponible.'
}
```

**Pourquoi ?** Vérifier que la place demandée existe et est encore disponible.

**Les statuts d'une place :**
- ✅ `available` = Libre (peut être réservée)
- 🔴 `reserved` = Déjà réservée par quelqu'un
- 🚴 `occupied` = Actuellement occupée

---

## 🔄 Cycle de Vie d'une Réservation

```
┌─────────────────────────────────────────────────────────────┐
│                  CYCLE DE RÉSERVATION                        │
└─────────────────────────────────────────────────────────────┘

1. RÉSERVATION
   │
   ├─ Utilisateur clique sur "Réserver"
   ├─ Vérification : pas d'autre réservation active
   ├─ Statut initial = 'reserved'
   └─ Place passe de 'available' à 'reserved'
        ↓
2. DÉBUT STATIONNEMENT
   │
   ├─ Utilisateur clique sur "Commencer le stationnement"
   ├─ Statut change à 'parked'
   ├─ Place passe de 'reserved' à 'occupied'
   └─ Timer de facturation commence
        ↓
3. FIN STATIONNEMENT
   │
   ├─ Utilisateur clique sur "Terminer"
   ├─ Statut change à 'finished'
   ├─ Place revient à 'available'
   └─ Calcul du montant à payer
        ↓
4. PAIEMENT
   │
   ├─ Paiement via Stripe
   ├─ Statut change à 'paid'
   └─ Réservation terminée ✅
```

---

## 🚫 Raison du Message d'Erreur

Le message **"Vous avez déjà une place réservée..."** s'affiche quand :

❌ **Cas 1 : L'utilisateur a déjà une réservation active (`reserved`)**
```
Scénario : 
1. Utilisateur réserve la place #5
2. Statut = "reserved"
3. Il clique sur "Réserver" pour la place #10
4. ❌ Le système refuse car il a déjà la place #5 en attente
5. Message : "Vous avez déjà une place réservée..."
```

✅ **Solution :** Cliquer sur "Annuler" pour la place #5, puis réserver la place #10

---

❌ **Cas 2 : L'utilisateur est actuellement en stationnement (`parked`)**
```
Scénario : 
1. Utilisateur a réservé et commence le stationnement
2. Statut = "parked"
3. Il clique sur "Réserver" une autre place
4. ❌ Le système refuse car il est toujours garé
5. Message : "Vous avez déjà un stationnement en cours..."
```

✅ **Solution :** Cliquer sur "Terminer" pour finir le stationnement actuel

---

## 📊 Tableau des Statuts

| Statut | Signification | Peut Réserver | Remarques |
|--------|---------------|---------------|-----------|
| `available` | Place libre | ✅ Oui | Place peut être réservée |
| `reserved` | Réservée, pas commencée | ❌ Non | Doit attendre le début ou annuler |
| `parked` | Actuellement en stationnement | ❌ Non | Doit terminer le stationnement |
| `occupied` | Occupée | ❌ Non | Place n'est pas disponible |
| `finished` | Stationnement terminé | ✅ Oui | En attente de paiement |
| `paid` | Paiement reçu | ✅ Oui | Réservation complètement fermée |

---

## 💡 Explication Résumée

> **Pourquoi le système refuse une 2e réservation ?**

Le système empêche qu'un utilisateur ait **plusieurs réservations/stationnements simultanés** pour :
- 🔒 **Éviter les abus** : Un utilisateur ne peut pas bloquer plusieurs places
- 👥 **Équité** : Plus de places disponibles pour les autres utilisateurs
- 💰 **Traçabilité financière** : Un seul stationnement actif à la fois
- 🚗 **Logique réelle** : Une personne ne peut stationner qu'une voiture à la fois

---

## 🗑️ Comment Annuler une Réservation

**Frontend - fichier:** `frontend/src/components/places/PlaceListItem.jsx`

Bouton "Annuler" disponible quand `status === 'reserved'`
```jsx
if (status === 'reserved') {
    return <Button variant="warning">Annuler</Button>
}
```

**Backend - endpoint:** `DELETE /api/reservations/{id}/cancel`

---

## ✅ Résumé des Changements

- ✅ Tous les messages de réservation en **français**
- ✅ Message principal traduit : "Vous avez déjà une place réservée..."
- ✅ Message de parking en cours traduit : "Vous avez déjà un stationnement en cours..."
- ✅ Message indisponibilité traduit : "La place n'est pas disponible."
- ✅ Tous les autres messages d'erreur en français
