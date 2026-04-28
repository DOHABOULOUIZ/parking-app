# 🔧 Guide de Dépannage - Page Vide

## Problème : Page d'accueil vide

Si vous voyez une page blanche avec seulement la barre de navigation, suivez ces étapes :

### 1️⃣ Vérifier la Console du Navigateur

**Ouvrez les outils de développement :**
- Windows/Linux : `F12` ou `Ctrl+Shift+I`
- Mac : `Cmd+Option+I`

**Allez dans l'onglet "Console"** et cherchez :
- ❌ Erreurs en rouge
- ⚠️ Avertissements en jaune
- 🔴 Erreurs de réseau (Failed to fetch, 404, 500, etc.)

**Erreurs communes :**

```
Failed to fetch
→ Le backend Laravel n'est pas démarré
```

```
401 Unauthorized
→ Token expiré, reconnectez-vous
```

```
500 Internal Server Error
→ Erreur serveur Laravel, vérifiez les logs backend
```

---

### 2️⃣ Vérifier que le Backend Laravel est Démarré

**Ouvrez un terminal et lancez :**

```powershell
cd backend
php artisan serve
```

**Vous devriez voir :**
```
Starting Laravel development server: http://127.0.0.1:8000
```

**Testez l'API :**
```powershell
# Dans un autre terminal
curl http://127.0.0.1:8000/api/health
```

---

### 3️⃣ Vérifier que le Frontend React est Démarré

**Ouvrez un autre terminal :**

```powershell
cd frontend
npm run dev
```

**Vous devriez voir :**
```
VITE v7.x.x  ready in xxx ms
Local:   http://localhost:5173/
```

**Accédez à :** `http://localhost:5173` (ou le port affiché)

---

### 4️⃣ Vérifier les Données dans la Base

Le problème le plus fréquent est que **la base de données est vide**.

**A. Vérifier que MySQL tourne :**

```powershell
# Démarrer MySQL (XAMPP/WAMP/MAMP)
# Pour XAMPP : Ouvrir XAMPP Control Panel → Start MySQL
```

**B. Vérifier la connexion à la base :**

```powershell
cd backend
php artisan migrate:status
```

Si vous voyez `Connection refused`, vérifiez `backend/.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=parking_app
DB_USERNAME=root
DB_PASSWORD=
```

**C. Créer les données de test :**

```powershell
cd backend

# Réinitialiser la base avec des données de test
php artisan migrate:fresh --seed
```

Cela va créer :
- ✅ Utilisateurs de test (admin + users)
- ✅ Secteurs de parking
- ✅ Places de parking
- ✅ Réservations

---

### 5️⃣ Vérifier que Laravel Reverb est Démarré (WebSocket)

Pour les mises à jour en temps réel des places :

```powershell
cd backend
php artisan reverb:start
```

**Note :** Ce n'est pas obligatoire pour voir les places, mais nécessaire pour les updates en temps réel.

---

### 6️⃣ Solution Rapide : Tout Redémarrer

**PowerShell - Terminal 1 (Backend) :**
```powershell
cd backend
php artisan serve
```

**PowerShell - Terminal 2 (Frontend) :**
```powershell
cd frontend
npm run dev
```

**PowerShell - Terminal 3 (WebSocket - optionnel) :**
```powershell
cd backend
php artisan reverb:start
```

---

## Checklist de Débogage

| Vérification | Commande | Statut |
|-------------|----------|--------|
| **Backend démarré** | `curl http://127.0.0.1:8000/api/health` | ☐ |
| **Frontend démarré** | Ouvrir `http://localhost:5173` | ☐ |
| **MySQL actif** | XAMPP Control Panel → MySQL | ☐ |
| **Migrations exécutées** | `php artisan migrate:status` | ☐ |
| **Données créées** | `php artisan db:seed` | ☐ |
| **Pas d'erreur console** | F12 → Console (0 erreurs) | ☐ |
| **Token valide** | Reconnexion si nécessaire | ☐ |

---

## Problèmes Spécifiques

### ❌ Erreur : "Failed to fetch the places"

**Cause :** Backend Laravel non accessible

**Solution :**
1. Vérifiez que `php artisan serve` tourne
2. Vérifiez l'URL dans `frontend/src/config/api.js` :
   ```javascript
   const API_BASE_URL = 'http://127.0.0.1:8000/api'
   ```
3. Vérifiez CORS dans `backend/config/cors.php`

---

### ❌ Page blanche + Aucune erreur console

**Cause :** Probablement tableau de places vide

**Solution :**
```powershell
cd backend
php artisan db:seed --class=PlaceSeeder
```

Rechargez la page (`Ctrl+R` ou `F5`)

---

### ❌ Erreur 401 Unauthorized

**Cause :** Token expiré ou invalide

**Solution :**
1. Déconnectez-vous (bouton Déconnexion)
2. Reconnectez-vous avec vos identifiants
3. Le token sera rafraîchi

---

### ❌ Erreur 500 Internal Server Error

**Cause :** Erreur dans le code backend Laravel

**Solution :**
1. Ouvrez `backend/storage/logs/laravel.log`
2. Lisez la dernière erreur
3. Corrigez selon le message d'erreur

**Erreurs communes :**
- **"Class 'X' not found"** → `composer dump-autoload`
- **"Call to undefined method"** → Méthode manquante dans le service
- **"SQLSTATE[HY000]"** → Problème base de données

---

## Commandes Utiles

### Réinitialiser Complètement le Projet

```powershell
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

### Voir les Logs en temps réel

```powershell
# Backend
cd backend
php artisan tail

# Ou manuellement
Get-Content storage/logs/laravel.log -Tail 50 -Wait
```

### Tester l'API manuellement

```powershell
# Test sans auth
curl http://127.0.0.1:8000/api/health

# Test avec auth (remplacer YOUR_TOKEN)
curl http://127.0.0.1:8000/api/places -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Captures d'Écran Utiles

### ✅ Page Fonctionnelle Attendue

Vous devriez voir :
- Barre de navigation en haut (ParkApp, Accueil, votre nom, Admin, Déconnexion)
- **Grille de cartes de places** avec :
  - Numéro de place (P-001, P-002, etc.)
  - Badge vert "available" ou rouge "occupied"
  - Secteur et description
  - Prix par heure
  - Boutons (Reserve, Park here, End parking, etc.)

### ❌ Page Vide (Votre Cas Actuel)

- Barre de navigation visible ✅
- Zone de contenu blanche/vide ❌

**Cause probable :** Pas de données dans la base OU backend non démarré

---

## Contact/Support

Si le problème persiste après avoir suivi ce guide :

1. **Prenez une capture d'écran :**
   - Console navigateur (F12 → Console)
   - Terminal backend (erreurs)
   - Terminal frontend (erreurs)

2. **Vérifiez les fichiers logs :**
   - `backend/storage/logs/laravel.log`

3. **Information à fournir :**
   - Message d'erreur exact
   - Dernières lignes du log Laravel
   - Version PHP : `php -v`
   - Version Node : `node -v`

---

## Prochaines Étapes

Une fois le problème résolu :

1. ✅ Vérifiez que les places s'affichent
2. ✅ Testez la réservation d'une place
3. ✅ Testez l'annulation
4. ✅ Testez le démarrage/fin de parking
5. ✅ Testez le panel admin (`/admin/dashboard`)
6. ✅ Vérifiez les mises à jour temps réel (si Reverb actif)

---

**Bon débogage ! 🚀**
