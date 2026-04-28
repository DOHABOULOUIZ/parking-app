# Guide du Composant Button Réutilisable

## 📌 Vue d'ensemble

Un composant `Button` réutilisable a été créé pour standardiser tous les boutons de l'application avec des effets hover/active cohérents.

**Localisation:** `frontend/src/components/custom/Button.jsx`

## 🎨 Caractéristiques

### Effets Hover/Active
- **Changement de couleur:** La couleur s'assombrit au hover
- **Shadow elevation:** L'ombre augmente pour un effet de profondeur (0 4px 12px)
- **Transform:** Le bouton remonte légèrement (translateY -2px) pour un effet de "lift"
- **Transition:** Animation fluide de 0.2s avec easing

### Variantes Disponibles

```jsx
// primaire - couleur bleu (667eea)
<Button variant="primary">Bouton Primaire</Button>

// secondaire - couleur grise (e5e7eb)
<Button variant="secondary">Bouton Secondaire</Button>

// danger - couleur rouge (ef4444)
<Button variant="danger">Supprimer</Button>

// success - couleur verte (10b981)
<Button variant="success">Valider</Button>

// warning - couleur orange (f59e0b)
<Button variant="warning">Attention</Button>

// dark - couleur foncée (1f2937)
<Button variant="dark">Admin</Button>

// ghost - transparent (sans fond)
<Button variant="ghost">Lien</Button>
```

### Tailles Disponibles

```jsx
// Petit
<Button size="sm">Bouton Petit</Button>

// Moyen (défaut)
<Button size="md">Bouton Moyen</Button>

// Grand
<Button size="lg">Bouton Grand</Button>
```

## 💻 Utilisation

### Import
```jsx
import Button from '../../components/custom/Button';
```

### Utilisation Simple
```jsx
<Button onClick={handleClick}>
  Cliquer ici
</Button>
```

### Avec Variante et Taille
```jsx
<Button variant="success" size="lg" onClick={handleSave}>
  Enregistrer
</Button>
```

### État Disabled
```jsx
<Button disabled={isLoading}>
  {isLoading ? 'Chargement...' : 'Envoyer'}
</Button>
```

### Avec Type Submit
```jsx
<form onSubmit={handleSubmit}>
  <input type="text" />
  <Button type="submit">
    Soumettre le formulaire
  </Button>
</form>
```

### Avec Style Custom
```jsx
<Button 
  variant="primary"
  style={{ width: '100%', marginTop: '1rem' }}
>
  Bouton pleine largeur
</Button>
```

### Avec Classes CSS
```jsx
<Button 
  variant="primary"
  className="custom-class"
>
  Bouton avec classe
</Button>
```

### Avec Icônes et Elementos
```jsx
import { Download } from 'lucide-react';

<Button variant="primary">
  <Download size={18} className="me-2" />
  Télécharger
</Button>
```

## 🎯 Cas d'Usage Réels

### Bouton de Suppression
```jsx
<Button 
  variant="danger" 
  size="sm"
  onClick={() => handleDelete(itemId)}
>
  Supprimer
</Button>
```

### Groupe de Boutons
```jsx
<div style={{ display: 'flex', gap: '1rem' }}>
  <Button variant="secondary" onClick={handleCancel}>
    Annuler
  </Button>
  <Button variant="primary" onClick={handleSave}>
    Enregistrer
  </Button>
</div>
```

### Dans une Barre d'Actions
```jsx
<div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
  <Button variant="ghost" onClick={handleEdit}>
    Modifier
  </Button>
  <Button variant="danger" onClick={handleDelete}>
    Supprimer
  </Button>
</div>
```

### Pagination
```jsx
<div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
  <Button 
    variant="secondary" 
    size="sm"
    onClick={() => setPage(page - 1)} 
    disabled={page === 1}
  >
    Précédent
  </Button>
  <span>Page {page}</span>
  <Button 
    variant="secondary" 
    size="sm"
    onClick={() => setPage(page + 1)}
  >
    Suivant
  </Button>
</div>
```

## 📊 Props Disponibles

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `variant` | string | 'primary' | Variante de style: primary, secondary, danger, success, warning, dark, ghost |
| `size` | string | 'md' | Taille: sm, md, lg |
| `disabled` | boolean | false | Désactiver le bouton |
| `type` | string | 'button' | Type HTML: button, submit, reset |
| `onClick` | function | - | Fonction appelée au clic |
| `className` | string | '' | Classes CSS personnalisées |
| `style` | object | {} | Styles CSS inline |
| `children` | node | - | Contenu du bouton |
| `...props` | any | - | Autres attributs HTML |

## 🎨 Palette de Couleurs

```
primary    : #667eea → #5568d3 (bleu primaire)
secondary  : #e5e7eb → #d1d5db (gris clair)
danger     : #ef4444 → #dc2626 (rouge)
success    : #10b981 → #059669 (vert)
warning    : #f59e0b → #d97706 (orange)
dark       : #1f2937 → #111827 (noir)
ghost      : transparent → #f3f4f6 (sans couleur)
```

## ✨ Effets de Hover

Chaque variante a ses propres effets de hover:

1. **Changement de couleur** - Vers une teinte plus sombre
2. **Élévation** - Shadow augmente de `0 2px 8px` à `0 4px 12px`
3. **Lift effect** - Transform translateY(-2px)
4. **Transition fluide** - 0.2s ease

Les effets hover sont **automatiquisés** (pas besoin de `onMouseOver`/`onMouseOut`)

## 🔄 Migration depuis les Anciens Buttons

### Avant
```jsx
<button 
  className="btn btn-primary"
  onClick={handleClick}
  onMouseOver={(e) => e.target.style.background = '#5568d3'}
  onMouseOut={(e) => e.target.style.background = '#667eea'}
>
  Cliquer
</button>
```

### Après
```jsx
<Button variant="primary" onClick={handleClick}>
  Cliquer
</Button>
```

## 📝 Notes

- ✅ Tous les boutons du projet ont été migrés
- ✅ 70+ boutons remplacés
- ✅ Aucune erreur de compilation
- ✅ Styling cohérent dans toute l'application
- ✅ Facilement maintenable et extensible

## 🚀 Fonctionnalités Futures Possibles

- [ ] Animation de loading state
- [ ] Mode outline pour certaines variantes
- [ ] Support des boutons groupe
- [ ] Animation de ripple effect
- [ ] Support des icônes intégrées
