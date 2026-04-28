# 🚀 GUIDE DE DÉMARRAGE RAPIDE

## ⚠️ IMPORTANT : Avant de Commencer

**Problème identifié précédemment :** MySQL n'était pas démarré, causant une page vide.

**Solution :** Suivez ces étapes dans l'ordre pour un démarrage réussi.

---

## 📋 Checklist Pré-Démarrage

### 1️⃣ Démarrer MySQL

**Si vous utilisez XAMPP :**
1. Ouvrir **XAMPP Control Panel**
2. Cliquer **Start** pour **MySQL**
3. Attendre que le statut devienne vert
4. Vérifier que le port 3306 est actif

**Si vous utilisez WAMP :**
1. Cliquer icône WAMP (barre des tâches)
2. **Start All Services**
3. Vérifier que l'icône devient verte

**Vérification :**
```powershell
# Test connexion MySQL
mysql -u root -p
# Si ça se connecte → ✅ MySQL fonctionne
```

---

### 2️⃣ Créer la Base de Données

**Option 1 : Via phpMyAdmin**
1. Ouvrir : `http://localhost/phpmyadmin`
2. Onglet **Bases de données**
3. Créer nouvelle base : `lara_12_react_19_parking_app`
4. Encodage : `utf8mb4_general_ci`

**Option 2 : En ligne de commande**
```sql
mysql -u root -p
CREATE DATABASE lara_12_react_19_parking_app;
EXIT;
```

---

### 3️⃣ Configurer le Backend

**Fichier : `backend/.env`**

Vérifiez que ces lignes sont correctes :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lara_12_react_19_parking_app
DB_USERNAME=root
DB_PASSWORD=                    # ← Votre mot de passe MySQL (vide par défaut XAMPP)
```

---

### 4️⃣ Initialiser la Base de Données

```powershell
cd backend

# Installer dépendances (si pas déjà fait)
composer install

# Exécuter migrations et seeders
php artisan migrate:fresh --seed
```

**Résultat attendu :**
```
Migration completed successfully.
Seeding: Database\Seeders\AdminUserSeeder
Seeding completed successfully.
```

**Cela va créer :**
- ✅ Tables (users, places, sectors, reservations, etc.)
- ✅ Utilisateur admin : `admin@example.com` / `password`
- ✅ Utilisateurs test
- ✅ Secteurs de parking (A, B, C)
- ✅ Places de parking (P-001 à P-030)

---

## 🚀 Démarrer l'Application

### TERMINAL 1 : Backend Laravel

```powershell
cd backend
php artisan serve
```

**Résultat attendu :**
```
Laravel development server started: http://127.0.0.1:8000
```

✅ **Backend opérationnel**

---

### TERMINAL 2 : Frontend React

```powershell
cd frontend
npm install    # Si pas déjà fait
npm run dev
```

**Résultat attendu :**
```
VITE v7.x.x  ready in xxx ms
Local:   http://localhost:5173/
```

✅ **Frontend opérationnel**

---

### TERMINAL 3 (Optionnel) : WebSocket

Pour les mises à jour en temps réel :

```powershell
cd backend
php artisan reverb:start
```

**Note :** Pas obligatoire pour tester l'app, mais nécessaire pour :
- Mises à jour places en temps réel
- Notifications instantanées
- Dashboard admin live

---

## 🧪 Tester l'Application

### 1. Ouvrir le Navigateur

```
http://localhost:5173
```

### 2. Se Connecter

**Compte Admin :**
```
Email: admin@example.com
Password: password
```

**Compte Utilisateur :**
```
Email: user@example.com
Password: password
```

### 3. Vérifications Rapides

**Page d'accueil (User) :**
- ✅ Voir les places de parking affichées (grille de cartes)
- ✅ Places avec badge "available" (vert) ou "occupied" (rouge)
- ✅ Secteur et prix visibles

**Dashboard Admin :**
- ✅ Statistiques affichées (utilisateurs, places, revenus)
- ✅ Card violette "Scanner QR Code" en bas
- ✅ Accès rapides fonctionnels

**Profil Utilisateur :**
- ✅ Mes Réservations (si vous en créez une)
- ✅ Bouton "QR Code" visible pour réservations actives

---

## 🎯 Test Complet : Workflow Réservation → QR Code

### Étape 1 : Créer une Réservation

1. **Connexion utilisateur** (`user@example.com`)
2. **Page d'accueil** → Trouver une place "available"
3. **Cliquer "Reserve"**
4. **Sélectionner dates/heures**
5. **Payer** (carte test Stripe : `4242 4242 4242 4242`)
6. ✅ Réservation créée

### Étape 2 : Voir le QR Code

1. **Aller dans Profil** (menu)
2. **Section "Mes Réservations"**
3. **Cliquer bouton "QR Code"** de la réservation
4. ✅ Page QR s'affiche avec le code

### Étape 3 : Scanner (Admin)

1. **Se déconnecter** → **Se reconnecter en admin**
2. **Admin Dashboard** → **Card "Scanner QR Code"** → **Ouvrir Scanner**
3. **Copier le token** du QR code utilisateur
4. **Coller dans l'input** du scanner
5. **Cliquer "Vérifier"** → ✅ Détails réservation
6. **Cliquer "Check-In"** → ✅ Statut passe à "parked"
7. **Cliquer "Check-Out"** → ✅ Statut passe à "finished"

---

## 🛠️ Dépannage

### ❌ Page vide / Erreur "Failed to fetch"

**Cause :** Backend Laravel pas démarré

**Solution :**
```powershell
cd backend
php artisan serve
```

### ❌ Erreur "Target machine actively refused"

**Cause :** MySQL pas démarré

**Solution :**
- XAMPP → Start MySQL
- Vérifier port 3306 libre

### ❌ Erreur 500 "Internal Server Error"

**Cause :** Erreur dans le code Laravel

**Solution :**
```powershell
cd backend
# Voir les logs
Get-Content storage/logs/laravel.log -Tail 50
```

### ❌ Aucune place affichée

**Cause :** Base de données vide

**Solution :**
```powershell
cd backend
php artisan migrate:fresh --seed
```

### ❌ Erreur 401 "Unauthorized"

**Cause :** Token expiré

**Solution :**
- Se déconnecter
- Se reconnecter
- Token sera rafraîchi

---

## 📊 État Attendu Après Setup

### Base de Données

**Tables créées (11) :**
- users
- places
- sectors
- reservations
- stripe_sessions
- tasks
- analytics
- notifications
- audit_logs
- migrations
- cache

**Données initiales :**
- 2+ utilisateurs (admin, user)
- 3+ secteurs (A, B, C)
- 30+ places (P-001 à P-030)
- Réservations test (optionnel)

### Ports Utilisés

- **3306** : MySQL
- **8000** : Laravel Backend
- **5173** : React Frontend (Vite)
- **8080** : Laravel Reverb WebSocket (optionnel)
- **6379** : Redis (si utilisé)

---

## ✅ Checklist de Vérification Finale

Avant de dire que tout fonctionne, vérifiez :

- [ ] **MySQL démarré** (XAMPP green)
- [ ] **Base de données créée** (phpMyAdmin)
- [ ] **Migrations exécutées** (`php artisan migrate`)
- [ ] **Seeders exécutés** (données de test créées)
- [ ] **Backend started** (`php artisan serve` → http://127.0.0.1:8000)
- [ ] **Frontend started** (`npm run dev` → http://localhost:5173)
- [ ] **Page d'accueil affiche places** (pas vide)
- [ ] **Login fonctionne** (admin@example.com)
- [ ] **Dashboard admin complet** (stats + card QR)
- [ ] **Réservation possible** (workflow complet)
- [ ] **QR Code accessible** (depuis profil)
- [ ] **Scanner QR opérationnel** (admin)

---

## 🎉 Succès !

Si toutes les cases sont cochées, votre application Smart Parking est **100% opérationnelle** !

**Prochaines étapes :**
1. ✅ Testez toutes les fonctionnalités
2. ✅ Préparez votre démo PFE
3. ✅ Lisez [GUIDE_SOUTENANCE.md](GUIDE_SOUTENANCE.md)
4. ✅ Pratiquez votre présentation

---

## 📞 Besoin d'Aide ?

**Fichiers de référence :**
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Guide dépannage complet
- [FONCTIONNALITES_AJOUTEES.md](FONCTIONNALITES_AJOUTEES.md) - QR Code et dashboard
- [PFE_DOCUMENTATION.md](PFE_DOCUMENTATION.md) - Documentation principale
- [README.md](README.md) - Vue d'ensemble projet

**Logs à consulter en cas d'erreur :**
```powershell
# Backend Laravel
cd backend
Get-Content storage/logs/laravel.log -Tail 100

# Console navigateur
F12 → Onglet Console
```

---

**Dernière mise à jour : 21 Mars 2026**  
**Status : ✅ Guide complet et testé**
