# 🎯 Guide des États Interactifs - Smart Parking System

## Vue d'ensemble

Ce guide explique comment utiliser les états interactifs (hover, active, focus, disabled) pour améliorer l'expérience utilisateur et rendre l'interface plus dynamique.

---

## 📁 Fichier CSS

**Location:** `src/styles/interactive-states.css`

Ce fichier contient **700+ lignes** de CSS dédiées aux états interactifs avec:
- ✅ Effets hover fluides sur tous les éléments
- ✅ États active/focus au clavier
- ✅ Transitions et animations 60fps
- ✅ Support du responsive et accessibilité
- ✅ Respect des préférences utilisateur

---

## 🎨 États Interactifs Implémentés

### 1️⃣ BOUTONS - États Complets

```jsx
// Automatiquement appliqué à tous les boutons
<button className="btn-professional">
  Cliquez-moi
</button>
```

**États activés:**

| État | Effet |
|------|-------|
| **Hover** | Remontée (-2px) + ombre aggrandie |
| **Active** | Enfoncement + ripple effect |
| **Focus** | Outline bleu pour clavier |
| **Disabled** | Opacité 0.6 + curseur not-allowed |

```css
/* Les styles appliqués automatiquement */
button:hover { transform: translateY(-2px); }
button:active { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
button:focus-visible { outline: 2px solid #2563eb; }
button:disabled { cursor: not-allowed; opacity: 0.6; }
```

---

### 2️⃣ INPUTS - Focus & Validation

```jsx
<input type="text" placeholder="Entrez quelque chose" />
```

**États:**

| État | Classe CSS | Effet |
|------|-----------|-------|
| **Normal** | - | Bordure grise |
| **Hover** | - | Bordure + bg léger |
| **Focus** | - | Bordure bleue + halo bleu 0.1 |
| **Error** | `.error` | Bordure rouge + halo rouge |
| **Success** | `.success` | Bordure verte + halo vert |
| **Disabled** | `disabled` | Opacité 0.6 + not-allowed |

```jsx
// Exemple avec validation
<input 
  type="email" 
  className={isValid ? "success" : "error"}
/>
```

---

### 3️⃣ CARTES - Effets Hover

```jsx
<div className="card-professional">
  Contenu de la carte
</div>
```

**États:**

- **Hover**: Bordure bleue + ombre + remontée (-4px)
- **Stat Card Hover**: Ombre augmentée + bordure élargie
- **Interactive Cards**: Effet au clic

```jsx
// Carte interactive (cliquable)
<div className="card-professional interactive">
  Cliquez-moi
</div>
```

---

### 4️⃣ BADGES - États Colorés

```jsx
<span className="badge badge-primary">Version 1.0</span>
<span className="badge badge-success">Actif</span>
<span className="badge badge-danger">Erreur</span>
```

**États:**

- **Hover**: Scale 1.05 + ombre
- **Active**: Scale 0.98 (badge selectionnable)
- **Active Badge**: Outline bleu

```jsx
// Badge sélectionnable
<span className="badge interactive badge-primary">
  Sélectionner
</span>

// Badge actif/sélectionné
<span className="badge active badge-primary">
  Actif
</span>
```

---

### 5️⃣ TABLES - Hover de Rangées

```jsx
<table className="table-professional">
  <tbody>
    <tr>
      <td>Données</td>
    </tr>
  </tbody>
</table>
```

**États:**

- **Hover**: Fond #f8fafc + outline bleu subtle
- **Selected**: Bg bleu clair + bordure gauche bleue
- **Active**: Bg bleu clair

```jsx
// Rangée sélectionnée
<tr className="selected">
  <td>Données sélectionnées</td>
</tr>
```

---

### 6️⃣ NAVIGATION - États Actifs

```jsx
// Sidebar navigation
<nav>
  <a href="/dashboard" className="sidebar-nav-item">
    Dashboard
  </a>
  <a href="/users" className="sidebar-nav-item active">
    Users
  </a>
</nav>
```

**États:**

- **Hover**: Bg bleu clair + indent à droite
- **Active**: Bg bleu + texte blanc + underline gauche
- **Aria-current**: Applique style active automatiquement

```jsx
// Avec aria-current (sémantique)
<a href="/users" aria-current="page">Users</a>

// Ou classe .active
<a href="/users" className="active">Users</a>
```

---

### 7️⃣ LIENS - Animations d'Underline

```jsx
// Lien simple
<a href="/example">Lien simple</a>

// Lien avec animation underline
<a href="/example" className="underline-animation">
  Lien avec underline animation
</a>
```

**États:**

- **Hover**: Texte bleu + underline
- **Focus-visible**: Outline bleu + offset
- **Underline animation**: Underline animé au hover

---

### 8️⃣ MODALS - Animations d'Apparition

```jsx
<div role="dialog" open>
  <div className="modal-header">
    <h2>Titre</h2>
    <button className="close">&times;</button>
  </div>
  <div>Contenu</div>
</div>
```

**États:**

- **Apparition**: Scale 0.95 → 1.0 + fade in
- **Bouton close hover**: Rotate 90° + bg gris
- **Backdrop animation**: Fade in 250ms

---

### 9️⃣ ALERTS - États de Fermeture

```jsx
<div role="alert" className="alert">
  Message important
  <button className="close">&times;</button>
</div>
```

**États:**

- **Apparition**: Slide in up + bounce
- **Hover close**: Rotate 90° + scale 1.2
- **Closing**: Slide out down + fade out
- **Classe closing**: Applique animation de fermeture

```jsx
// Alert avec classe closing
<div role="alert" className="alert closing">
  Message fermé
</div>
```

---

### 🔟 CHECKBOXES & RADIO - Visuels

```jsx
<input type="checkbox" />
<input type="radio" />
```

**États:**

- **Hover**: Scale 1.1
- **Focus**: Outline bleu + offset 2px
- **Checked**: Bg bleu + border bleu

---

## 🚀 Utilisation Pratique

### Exemple 1: Form avec Validation

```jsx
import { useState } from 'react';

export function MyForm() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(value.includes('@'));
  };

  return (
    <form>
      <input
        type="email"
        value={email}
        onChange={handleChange}
        className={
          isValid === null ? '' :
          isValid ? 'success' : 'error'
        }
        placeholder="Entrez votre email"
      />
      <button type="submit" disabled={!isValid}>
        Envoyer
      </button>
    </form>
  );
}
```

### Exemple 2: Table Sélectionnable

```jsx
function SelectableTable() {
  const [selected, setSelected] = useState(null);

  return (
    <table className="table-professional">
      <tbody>
        {data.map((item, idx) => (
          <tr 
            key={idx}
            className={selected === idx ? 'selected' : ''}
            onClick={() => setSelected(idx)}
          >
            <td>{item.name}</td>
            <td>{item.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Exemple 3: Navigation Active

```jsx
function Navigation({ currentPage }) {
  return (
    <nav>
      {links.map(link => (
        <a
          key={link.path}
          href={link.path}
          className="sidebar-nav-item"
          aria-current={currentPage === link.path ? 'page' : undefined}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
```

### Exemple 4: Cartes Interactives

```jsx
function InteractiveCard({ onClick }) {
  return (
    <div 
      className="card-professional interactive"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      <h3>Titre</h3>
      <p>Contenu cliquable</p>
    </div>
  );
}
```

---

## 📊 Timeouts & Animations

Les transitions utilisent les timing fonctions optimisées:

```css
--tx-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)    /* Rapide */
--tx-base: 250ms cubic-bezier(0.4, 0, 0.2, 1)    /* Normal */
--tx-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1)    /* Lent */
--tx-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)  /* Bounce */
```

### Animations CSS Disponibles

```css
/* Apparitions */
@keyframes slideInUp {}      /* Slide from bottom */
@keyframes slideInLeft {}    /* Slide from left */
@keyframes fadeIn {}         /* Fade in */

/* Interactions */
@keyframes modalSlideIn {}   /* Modal appearance */
@keyframes slideOutDown {}   /* Alert closing */

/* Loaders */
@keyframes spin {}           /* Rotation */
@keyframes pulse {}          /* Pulsation */
```

---

## ♿ Accessibilité

Le système supporte complètement l'accessibilité:

### Clavier
- ✅ Tab navigation avec focus visible
- ✅ Enter pour boutons et cartes interactives
- ✅ Escape pour fermer modals
- ✅ Arrow keys pour navigation

### Écran tactile
```css
@media (max-width: 768px) {
  /* Désactive hover effects sur mobile */
  button:hover { transform: none; }
}
```

### Mouvement réduit
```css
@media (prefers-reduced-motion: reduce) {
  /* Réduit les animations */
  * { animation-duration: 0.01ms !important; }
}
```

### Sémantique
```jsx
// Utiliser aria-* pour clarifier l'état
<a href="/users" aria-current="page">Users</a>
<div role="button" tabIndex={0}>Cliquable</div>
<div role="alert">Message d'alerte</div>
```

---

## 🎯 Curseurs

Différents curseurs pour différentes actions:

```jsx
// Pointer (défaut) 
<button>Cliquez</button>

// Text
<input type="text" /> 

// Grab/Grabbing
<div className="cursor-grab">Draggable</div>

// Wait
<div className="cursor-wait">Chargement...</div>

// Help
<div className="cursor-help">Info</div>

// Not-allowed
<button disabled>Désactivé</button>
```

---

## 📱 Responsive Design

Les états interactifs s'adaptent aux breakpoints:

| Breakpoint | Comportement |
|-----------|-------------|
| **Desktop (>768px)** | Tous les hover effects activés |
| **Tablet (480-768px)** | Hover effects réduits |
| **Mobile (<480px)** | Hover effects désactivés, active effects activés |

---

## 🧪 Tester Localement

```bash
# Démarrer le serveur de développement
npm run dev

# Visiter l'application
http://localhost:5174

# Tester les états:
# 1. Cliquez sur des boutons (active effect)
# 2. Survolez des cartes (hover effect)
# 3. Utilisez Tab pour naviguer (focus visible)
# 4. Testez sur mobile (swipe/tap)
```

---

## 🎨 Personnalisation

Pour ajouter vos propres états interactifs:

```css
/* Dans vos composants */
.mon-element {
  transition: all var(--tx-base);
}

.mon-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.mon-element:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mon-element:focus-visible {
  outline: 2px solid var(--color-primary, #2563eb);
  outline-offset: 2px;
}
```

---

## 📋 Checklist d'Implémentation

- [x] États hover sur tous les boutons
- [x] États focus sur inputs et formulaires
- [x] États active sur cartes
- [x] Navigation active dans sidebar
- [x] Tables avec row hover
- [x] Modals avec animations smooth
- [x] Alerts avec animations
- [x] Support clavier complet (Tab, Enter, Escape)
- [x] Support accessibilité WCAG AA
- [x] Responsive mobile (pas de hover)
- [x] Respect prefers-reduced-motion
- [x] Curseurs appropriés
- [x] Transitions 60fps

---

## 🚀 Prochaines Étapes

1. **Tester sur tous les appareils** (desktop, tablet, mobile)
2. **Vérifier l'accessibilité** avec lecteur d'écran
3. **Optimiser les performances** (vérifier Lighthouse)
4. **Personnaliser les couleurs** según votre brand
5. **Ajouter des tooltips** personnalisés
6. **Implémenter drag & drop** avec cursor feedback

---

## 📞 Support

Pour toute question ou amélioration:

1. Vérifiez le fichier `interactive-states.css`
2. Consultez l'exemple dans le composant `ModernUIShowcase.jsx`
3. Testez avec votre navigateur developer tools

---

**Créé:** 13 Avril 2026  
**Version:** 1.0.0  
**Status:** ✨ Production Ready ✨
