# Politique de Sécurité — Smart Parking System

## 🔒 Vue d'Ensemble

Ce document décrit les mesures de sécurité implémentées dans le système de gestion de parking intelligent.

---

## 🛡️ Principes de Sécurité

### 1. Defense in Depth (Défense en Profondeur)

Nous appliquons plusieurs couches de sécurité :

1. **Couche Réseau** : HTTPS/TLS, Firewall, DDoS protection
2. **Couche Application** : Authentication, Authorization, Input validation
3. **Couche Base de Données** : Encryption, Prepared statements, Access control
4. **Couche Métier** : Audit logs, Rate limiting, Data validation

### 2. Principle of Least Privilege

- Chaque utilisateur/service a uniquement les permissions nécessaires
- Rôles clairement définis (Admin, User)
- Accès aux données limité au strict nécessaire

### 3. Security by Design

- Sécurité intégrée dès la conception
- Revue de code systématique
- Tests de sécurité automatisés

---

## 🔐 Authentification & Autorisation

### Mécanisme d'Authentification

**Laravel Sanctum (Token-based)**
```php
✅ Tokens personnels stockés de manière sécurisée
✅ Expiration automatique (24h par défaut)
✅ Révocation possible à tout moment
✅ Protection CSRF intégrée
```

**Gestion des Mots de Passe**
```php
✅ Hashing bcrypt (cost factor 12)
✅ Salage automatique
✅ Politique de complexité :
   - Minimum 8 caractères
   - Majuscules + minuscules recommandées
   - Chiffres + caractères spéciaux recommandés
✅ Prévention réutilisation anciens mots de passe
```

### Système de Rôles (RBAC)

**Admin :**
- Accès dashboard analytics
- CRUD utilisateurs, places, secteurs
- Gestion réservations globales
- Génération rapports
- Vue audit logs

**User :**
- Visualisation places disponibles
- Créer/annuler ses propres réservations
- Historique personnel
- Génération QR codes

**Middleware de Protection**
```php
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Routes admin protégées
});
```

---

## 🚨 Protection contre les Attaques

### 1. SQL Injection

**Mesures :**
✅ Utilisation exclusive ORM Eloquent  
✅ Prepared statements automatiques  
✅ Validation stricte des inputs  
✅ Pas de requêtes SQL brutes sans binding  

**Exemple :**
```php
// ❌ DANGEREUX
DB::raw("SELECT * FROM users WHERE id = $request->id");

// ✅ SÉCURISÉ
User::find($request->id);
```

### 2. XSS (Cross-Site Scripting)

**Mesures :**
✅ Auto-escaping Blade templates  
✅ React auto-escaping par défaut  
✅ Content-Security-Policy headers  
✅ Sanitization inputs utilisateurs  

**Exemple :**
```javascript
// React échappe automatiquement
<div>{userInput}</div>

// Laravel Blade échappe avec {{ }}
{{ $userInput }}
```

### 3. CSRF (Cross-Site Request Forgery)

**Mesures :**
✅ Tokens CSRF sur tous les formulaires  
✅ Sanctum CSRF protection  
✅ SameSite cookie attribute  
✅ Validation origin/referer  

### 4. Injection de Commandes

**Mesures :**
✅ Pas d'exécution shell directe  
✅ Validation stricte fichiers uploadés  
✅ Whitelist extensions autorisées  
✅ Scan antivirus (si applicable)  

### 5. Mass Assignment

**Mesures :**
✅ Propriété `$fillable` sur tous les modèles  
✅ Validation Form Requests  
✅ Pas d'assignation massive non contrôlée  

**Exemple :**
```php
// Modèle User
protected $fillable = ['name', 'email'];
protected $guarded = ['role', 'is_admin'];
```

### 6. Broken Authentication

**Mesures :**
✅ Rate limiting tentatives connexion (5/min)  
✅ Account lockout après 5 échecs  
✅ Captcha après 3 échecs (recommandé)  
✅ Notification connexions suspectes  
✅ Expiration session automatique  

### 7. Broken Access Control

**Mesures :**
✅ Vérification permissions à chaque requête  
✅ Policies Laravel pour autorizations  
✅ Middleware guards  
✅ Pas de trust client-side  

**Exemple :**
```php
// Policy ReservationPolicy
public function cancel(User $user, Reservation $reservation)
{
    return $user->id === $reservation->user_id || $user->isAdmin();
}
```

### 8. Security Misconfiguration

**Mesures :**
✅ APP_DEBUG=false en production  
✅ Fichiers .env exclu du versioning  
✅ Permissions fichiers correctes (644/755)  
✅ Headers sécurité configurés  
✅ Versions à jour (Laravel, dépendances)  

**Headers Sécurité :**
```nginx
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

### 9. Sensitive Data Exposure

**Mesures :**
✅ HTTPS obligatoire en production  
✅ Données sensibles chiffrées en DB  
✅ Pas de données carte bancaire stockées  
✅ Logs sans informations sensibles  
✅ Tokens API en variables d'environnement  

**Encryption :**
```php
// Chiffrement sensitive data
use Illuminate\Support\Facades\Crypt;

$encrypted = Crypt::encryptString($sensitive_data);
$decrypted = Crypt::decryptString($encrypted);
```

### 10. Insufficient Logging & Monitoring

**Mesures :**
✅ Audit logs pour toutes actions admin  
✅ Logging échecs authentification  
✅ Monitoring erreurs (Sentry)  
✅ Alertes anomalies détectées  
✅ Backup logs réguliers  

---

## 🔑 Gestion des Secrets

### Variables d'Environnement

**Bonnes Pratiques :**
```bash
# ❌ Ne JAMAIS commiter
APP_KEY=base64:xxx
DB_PASSWORD=secret
STRIPE_SECRET=sk_live_xxx

# ✅ Utiliser .env.example avec valeurs factices
APP_KEY=
DB_PASSWORD=
STRIPE_SECRET=
```

### Rotation des Secrets

**Planification :**
- API Keys : Rotation tous les 90 jours
- JWT Secrets : Rotation tous les 6 mois
- Database passwords : Rotation annuelle
- Stripe keys : Selon recommandations Stripe

---

## 💳 Sécurité des Paiements (Stripe)

### Conformité PCI-DSS

✅ **Niveau 1** : Stripe gère la conformité  
✅ **Pas de stockage** : Aucune donnée carte en base  
✅ **Tokenization** : Tokens Stripe uniquement  
✅ **HTTPS** : Obligatoire pour checkout  
✅ **Webhooks signés** : Validation signature Stripe  

**Validation Webhook :**
```php
$signature = $request->header('Stripe-Signature');
$event = \Stripe\Webhook::constructEvent(
    $payload, 
    $signature, 
    config('services.stripe.webhook_secret')
);
```

---

## 📊 Audit & Logging

### Événements Loggés

**Actions Admin :**
- Création/modification/suppression utilisateur
- Modification places/secteurs
- Annulation réservations
- Génération rapports

**Actions Sensibles :**
- Connexions réussies/échouées
- Changements mot de passe
- Tentatives accès non autorisé
- Modifications données personnelles

**Format Audit Log :**
```json
{
  "user_id": 1,
  "action": "update_user",
  "entity_type": "User",
  "entity_id": 42,
  "old_values": {"role": "user"},
  "new_values": {"role": "admin"},
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "created_at": "2026-03-20 10:30:00"
}
```

---

## 🚦 Rate Limiting

### API Endpoints

**Configuration :**
```php
// Authenticated users
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

// Login attempts
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->email.$request->ip());
});

// Payment endpoints
RateLimiter::for('payment', function (Request $request) {
    return Limit::perMinute(10)->by($request->user()->id);
});
```

### Protection DDoS

✅ Rate limiting par IP  
✅ CloudFlare (recommandé en prod)  
✅ Fail2ban configuration  
✅ Monitoring trafic anormal  

---

## 🔄 Backup & Recovery

### Stratégie de Sauvegarde

**Base de Données :**
- Backup complet : Quotidien (04:00 AM)
- Backup incrémental : Toutes les 6h
- Rétention : 30 jours
- Stockage : Offsite (S3/Backblaze)
- Encryption : AES-256

**Fichiers Application :**
- Code source : Git repository
- Uploads utilisateurs : Backup quotidien
- Logs : Rotation 7 jours

**Tests de Restauration :**
- Test mensuel de restauration
- Procédure documentée
- RTO : < 4 heures
- RPO : < 24 heures

---

## 🔍 Tests de Sécurité

### Tests Automatisés

```bash
# Scan vulnérabilités dépendances
composer audit

# Analyse statique code
./vendor/bin/phpstan analyse

# Tests sécurité
./vendor/bin/pest --filter=Security
```

### Pen Tests Recommandés

**Annuel :**
- [ ] Penetration testing externe
- [ ] Vulnerability scanning (OWASP ZAP)
- [ ] Code review sécurité
- [ ] Social engineering test

---

## 📋 Checklist Sécurité Déploiement

### Avant Mise en Production

- [ ] APP_DEBUG=false
- [ ] HTTPS configuré (SSL/TLS)
- [ ] Firewall configuré
- [ ] Rate limiting activé
- [ ] Backup automatiques configurés
- [ ] Monitoring erreurs (Sentry)
- [ ] Logs configurés (rotation)
- [ ] Variables .env sécurisées
- [ ] Permissions fichiers correctes
- [ ] Dependencies à jour
- [ ] Tests sécurité passés
- [ ] Documentation à jour

---

## 📞 Signalement Vulnérabilité

Si vous découvrez une vulnérabilité de sécurité :

**Email :** security@votredomaine.com  
**PGP Key :** [Clé publique]  

**Processus :**
1. Envoi email détaillé (chiffré si possible)
2. Accusé réception < 24h
3. Investigation & patch
4. Notification après correction
5. Crédit public (si souhaité)

**Récompenses :**
- Vulnérabilité critique : Mention spéciale
- Vulnérabilité haute : Remerciements publics
- Disclosure responsable apprécié

---

## 📚 Références

### Standards & Frameworks
- OWASP Top 10 (2021)
- PCI-DSS v4.0
- RGPD (GDPR)
- ISO 27001
- CWE/SANS Top 25

### Ressources Laravel
- [Laravel Security Best Practices](https://laravel.com/docs/security)
- [Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Encryption Documentation](https://laravel.com/docs/encryption)

---

**Dernière mise à jour :** Mars 2026  
**Version :** 1.0  
**Responsable Sécurité :** [Nom]
