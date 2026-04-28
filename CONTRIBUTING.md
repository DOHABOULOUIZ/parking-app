# Guide de Contribution — Smart Parking System

Merci de votre intérêt pour contribuer au projet Smart Parking! 🚗

---

## 📋 Table des Matières

- [Code of Conduct](#-code-of-conduct)
- [Comment Contribuer](#-comment-contribuer)
- [Standards de Code](#-standards-de-code)
- [Workflow Git](#-workflow-git)
- [Pull Requests](#-pull-requests)
- [Tests](#-tests)
- [Documentation](#-documentation)

---

## 🤝 Code of Conduct

### Nos Engagements

En contribuant à ce projet, vous acceptez de :

✅ Respecter tous les contributeurs  
✅ Accepter les critiques constructives  
✅ Communiquer de manière professionnelle  
✅ Mettre l'intérêt du projet en priorité  
✅ Ne pas partager d'informations sensibles  

### Comportements Inacceptables

❌ Harassment ou discrimination  
❌ Trolling ou commentaires insultants  
❌ Spam ou publicité non sollicitée  
❌ Divulgation d'informations privées  
❌ Tout comportement non professionnel  

**Signalement:** Contactez [security@votredomaine.com]

---

## 🚀 Comment Contribuer

### Types de Contributions

Nous accueillons plusieurs types de contributions :

#### 1. 🐛 Rapporter un Bug

**Avant de créer un rapport:**
- Vérifiez que le bug n'a pas déjà été reporté
- Assurez-vous que c'est bien un bug (pas un choix de design)
- Collectez autant d'informations que possible

**Template de rapport:**
```markdown
**Description du bug**
Description claire et concise

**Étapes pour reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement attendu**
Ce qui devrait se passer

**Comportement observé**
Ce qui se passe réellement

**Screenshots**
Si applicable

**Environnement**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Logs**
```
[Copier les logs pertinents]
```
```

#### 2. ✨ Proposer une Fonctionnalité

**Template de proposition:**
```markdown
**Problème résolu**
Quelle frustration/besoin cette feature résout?

**Solution proposée**
Description détaillée de la feature

**Alternatives considérées**
Autres solutions envisagées

**Impact**
- Users: [Impact utilisateurs]
- Admins: [Impact administrateurs]
- Performance: [Impact performance]
- Sécurité: [Considérations sécurité]

**Contexte additionnel**
Mockups, exemples, références
```

#### 3. 📝 Améliorer la Documentation

Les contributions documentation sont tout aussi importantes!

**Domaines:**
- Corriger typos/erreurs
- Clarifier instructions
- Ajouter exemples
- Traduire contenu
- Améliorer diagrammes

#### 4. 💻 Contribuer du Code

Voir sections suivantes pour le workflow.

---

## 📐 Standards de Code

### Backend (PHP/Laravel)

#### Style de Code

Nous suivons **PSR-12** avec Laravel conventions.

**Formateur automatique:**
```bash
# Formatter le code
./vendor/bin/pint

# Vérifier sans modifier
./vendor/bin/pint --test
```

**Conventions:**
```php
// ✅ BON
class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::with('reservations')
            ->where('active', true)
            ->paginate(15);

        return response()->json([
            'users' => $users,
        ]);
    }
}

// ❌ MAUVAIS
class UserController extends Controller {
    function index() {
        $users=User::with('reservations')->where('active',true)->paginate(15);
        return response()->json(['users'=>$users]);
    }
}
```

#### Analyse Statique

**PHPStan (Level 6):**
```bash
./vendor/bin/phpstan analyse
```

**Règles:**
- Pas de `any` types
- Type hints obligatoires
- Return types explicites
- Pas de variables dynamiques

#### Naming Conventions

```php
// Classes: PascalCase
class ReservationService {}

// Méthodes: camelCase
public function createReservation() {}

// Variables: camelCase
$userId = 123;

// Constants: SCREAMING_SNAKE_CASE
const MAX_RESERVATIONS = 10;

// Database tables: snake_case pluriel
// reservations, stripe_sessions

// Database columns: snake_case
// user_id, created_at
```

### Frontend (JavaScript/React)

#### Style de Code

Nous utilisons **ESLint + Prettier**.

**Formateur automatique:**
```bash
npm run lint
npm run format
```

**Conventions React:**
```javascript
// ✅ BON
import React, { useState, useEffect } from 'react';

const PlaceCard = ({ place, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Effect logic
  }, [place.id]);

  const handleClick = () => {
    onSelect(place);
  };

  return (
    <div 
      className="place-card"
      onMouseEnter={() => setIsHovered(true)}
      onClick={handleClick}
    >
      <h3>{place.number}</h3>
      <p>{place.status}</p>
    </div>
  );
};

export default PlaceCard;

// ❌ MAUVAIS
import React from 'react'
const PlaceCard=({place,onSelect})=>{
const [isHovered,setIsHovered]=useState(false)
return <div className="place-card" onMouseEnter={()=>setIsHovered(true)} onClick={()=>onSelect(place)}><h3>{place.number}</h3><p>{place.status}</p></div>
}
export default PlaceCard
```

#### Naming Conventions

```javascript
// Composants: PascalCase
const UserProfile = () => {};

// Hooks: camelCase avec 'use' prefix
const useAuth = () => {};

// Fonctions: camelCase
const fetchData = () => {};

// Constants: SCREAMING_SNAKE_CASE
const API_URL = 'http://localhost:8000';

// Props: camelCase
<PlaceCard placeId={123} onSelect={handler} />
```

---

## 🔀 Workflow Git

### Branches

**Structure:**
```
main (production)
  └── develop (integration)
       ├── feature/nom-feature
       ├── bugfix/nom-bug
       ├── hotfix/nom-hotfix
       └── docs/nom-doc
```

**Conventions nommage:**
```
feature/add-payment-refund
bugfix/fix-reservation-overlap
hotfix/security-csrf-token
docs/update-api-documentation
```

### Commits

**Convention: Conventional Commits**

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Formatage (pas de changement code)
- `refactor`: Refactoring code
- `perf`: Amélioration performance
- `test`: Ajout/modification tests
- `chore`: Tâches build, config, etc.

**Exemples:**
```bash
# Good ✅
feat(reservation): add cancellation with refund
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
test(payment): add stripe webhook tests

# Bad ❌
add stuff
fix bug
update
changes
```

**Règles:**
- Sujet < 50 caractères
- Impératif présent ("add" pas "added")
- Pas de point final
- Body optionnel (expliquer le "pourquoi")
- Footer pour breaking changes et issues

**Exemple complet:**
```
feat(prediction): implement ML-based occupancy prediction

Add linear regression algorithm to predict parking
occupancy based on 90 days historical data.
Includes day-of-week adjustment factor.

Closes #45
```

### Workflow de Contribution

**1. Fork le Repository**
```bash
# Fork sur GitHub
# Clone votre fork
git clone https://github.com/VOTRE_USERNAME/parking-app.git
cd parking-app

# Ajouter upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/parking-app.git
```

**2. Créer une Branche**
```bash
# Synchroniser avec develop
git checkout develop
git pull upstream develop

# Créer votre branche
git checkout -b feature/ma-feature
```

**3. Développer**
```bash
# Faire vos modifications
# ...

# Commiter régulièrement
git add .
git commit -m "feat(scope): description"
```

**4. Tester**
```bash
# Backend
cd backend
./vendor/bin/pest
./vendor/bin/pint --test
./vendor/bin/phpstan analyse

# Frontend
cd frontend
npm test
npm run lint
```

**5. Push**
```bash
# Push vers votre fork
git push origin feature/ma-feature
```

**6. Pull Request**

Voir section suivante.

---

## 📬 Pull Requests

### Avant de Soumettre

**Checklist:**
- [ ] Code suit les standards
- [ ] Tests passent (100%)
- [ ] Nouvelle feature a des tests
- [ ] Documentation mise à jour
- [ ] Pas de conflits avec develop
- [ ] Commits sont propres
- [ ] Description complète

### Template PR

```markdown
## Description

Résumé clair des changements

## Type de changement

- [ ] Bug fix (non-breaking)
- [ ] Nouvelle fonctionnalité (non-breaking)
- [ ] Breaking change
- [ ] Documentation

## Motivation

Pourquoi ce changement est nécessaire?

## Solution

Comment le problème est résolu?

## Tests

- [ ] Tests unitaires ajoutés
- [ ] Tests d'intégration ajoutés
- [ ] Tests manuels effectués

## Checklist

- [ ] Code suit les standards
- [ ] Tests passent
- [ ] Documentation mise à jour
- [ ] Pas de breaking changes (ou documentés)
- [ ] Commits conventionnels

## Screenshots

Si applicable

## Issues liées

Closes #123
Related to #456
```

### Review Process

**Après soumission:**
1. **CI/CD** lance tests automatiques
2. **Mainteneur** review le code
3. **Feedback** peut être demandé
4. **Approval** par au moins 1 reviewer
5. **Merge** dans develop

**Délai:** Généralement 48-72h

---

## 🧪 Tests

### Tests Obligatoires

**Pour toute nouvelle fonctionnalité:**
- Tests unitaires (couverture > 80%)
- Tests d'intégration si API
- Tests E2E si workflow complet

**Backend (Pest):**
```php
test('user can create reservation', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create(['status' => 'available']);
    
    $response = $this->actingAs($user, 'sanctum')
        ->postJson('/api/book/reservation', [
            'place_id' => $place->id,
            'start_time' => now()->addHours(1),
            'end_time' => now()->addHours(3),
        ]);
    
    $response->assertStatus(201);
    expect(Reservation::count())->toBe(1);
});
```

**Frontend (Vitest):**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import PlaceCard from './PlaceCard';

test('renders place number', () => {
  const place = { id: 1, number: 'A1', status: 'available' };
  render(<PlaceCard place={place} />);
  
  expect(screen.getByText('A1')).toBeInTheDocument();
});

test('calls onSelect when clicked', () => {
  const place = { id: 1, number: 'A1', status: 'available' };
  const onSelect = jest.fn();
  render(<PlaceCard place={place} onSelect={onSelect} />);
  
  fireEvent.click(screen.getByText('A1'));
  expect(onSelect).toHaveBeenCalledWith(place);
});
```

---

## 📖 Documentation

### Documentation Code

**PHP DocBlocks:**
```php
/**
 * Create a new reservation
 *
 * @param  array  $data  Reservation data
 * @return Reservation
 * @throws InvalidReservationException
 */
public function createReservation(array $data): Reservation
{
    // Implementation
}
```

**JSDoc:**
```javascript
/**
 * Fetch available places for a given date
 * @param {string} date - ISO date string
 * @returns {Promise<Place[]>} Array of available places
 */
export const fetchAvailablePlaces = async (date) => {
  // Implementation
};
```

### Documentation Markdown

**Pour nouvelle feature:**
- Mettre à jour README.md
- Ajouter examples si nécessaire
- Documenter API endpoints
- Mettre à jour CHANGELOG.md

---

## ❓ Questions & Support

**Besoin d'aide?**

📧 Email: dev@votredomaine.com  
💬 Discord: [Lien serveur]  
🐛 Issues: [GitHub Issues](https://github.com/votre-username/parking-app/issues)  
📖 Docs: [Documentation complète](README.md)

---

## 🎉 Reconnaissance

Les contributeurs sont listés dans:
- README.md (section Remerciements)
- CHANGELOG.md (notes de version)
- GitHub Contributors

**Merci de contribuer à Smart Parking System! 🚗✨**

---

Dernière mise à jour: Mars 2026
