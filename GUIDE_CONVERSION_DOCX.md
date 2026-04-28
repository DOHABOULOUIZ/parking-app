# 📘 GUIDE DE CONVERSION : HTML → DOCX Professionnel

## 🎯 Étapes de Conversion

### Méthode 1 : Script PowerShell Automatique (RECOMMANDÉ)

1. **Exécuter le script de conversion** :
   ```powershell
   .\convert_rapport_to_docx.ps1
   ```

2. Le script va :
   - ✅ Ouvrir le fichier HTML dans Word
   - ✅ Le convertir automatiquement en DOCX
   - ✅ Sauvegarder le fichier `RAPPORT_STAGE_FINAL.docx`
   - ✅ Préserver tous les diagrammes (MCD, UML, etc.)

---

### Méthode 2 : Conversion Manuelle dans Word

Si le script ne fonctionne pas :

1. **Ouvrir le fichier HTML dans Word** :
   - Clic droit sur `RAPPORT_STAGE_FINAL.html`
   - Choisir "Ouvrir avec → Microsoft Word"

2. **Sauvegarder en DOCX** :
   - Fichier → Enregistrer sous
   - Type : "Document Word (*.docx)"
   - Nom : `RAPPORT_STAGE_FINAL.docx`

---

## 🎨 Améliorations Post-Conversion

Une fois le fichier DOCX créé, voici les ajustements à faire dans Word :

### 1. Vérifier la Table des Matières

```
Références → Table des matières → Table automatique
```

- ✅ Vérifier que tous les titres sont bien détectés
- ✅ Mettre à jour les numéros de page : Clic droit → "Mettre à jour les champs"

---

### 2. Ajuster les Diagrammes SVG

Les diagrammes (MCD, UML) sont en SVG dans le HTML. Dans Word :

**✅ MCD (Page 22)** :
- Si le diagramme n'est pas net, vous pouvez :
  - Le capturer en haute résolution (Outil Capture Windows)
  - L'insérer comme image PNG

**✅ Diagramme de Classes (Page 26)** :
- Vérifier que toutes les relations sont visibles
- Ajuster la taille si nécessaire

**✅ Diagrammes de Séquence (Pages 27-28)** :
- S'assurer que les flèches sont bien orientées

---

### 3. Formater les Pages

#### Page de Garde :
- ✅ Vérifier que le logo OFPPT est bien affiché
- ✅ Ajuster les cercles décoratifs si décalés
- ✅ Centrer le titre principal

#### Pieds de Page :
- ✅ Chaque page doit avoir : "Rapport de Stage — Doha Boulouiz — ISTICG Berrechid 2025/2026"
- ✅ Numéro de page dans un cercle bleu-vert

---

### 4. Vérifier les Tableaux

Toutes les pages contenant des tableaux :

| Pages | Contenu | Action |
|-------|---------|--------|
| 11, 20-21 | Dictionnaire de données | Vérifier alignement colonnes |
| 18 | Besoins non fonctionnels | Vérifier couleurs (Must/Should/Could) |
| 29 | Product Backlog | Vérifier priorités colorées |

**Astuce** : Clic droit sur tableau → "Propriétés du tableau" → Centrer

---

### 5. Styles et Couleurs

Vérifier que les couleurs du thème sont préservées :

- **Bleu marine** (`#1B2A6B`) : Titres principaux
- **Bleu-vert** (`#009B9B`) : Sections secondaires, badges
- **Vert** (`#27ae60`) : Éléments positifs (Must Have)
- **Orange** (`#e65100`) : Avertissements (Should Have)

---

### 6. Export PDF Final (Pour Soumission)

Une fois le DOCX parfait :

```
Fichier → Exporter → Créer PDF/XPS
```

**Options recommandées** :
- ✅ Qualité : "Optimisé pour l'impression"
- ✅ Inclure les signets (table des matières)
- ✅ Compatibilité : PDF/A (archivage)

---

## 🔍 Checklist de Vérification Finale

Avant de soumettre votre rapport :

### Contenu
- [ ] **60 pages** complètes
- [ ] **MCD** visible et clair (page 22)
- [ ] **MLD** correct (page 23)
- [ ] **Diagrammes UML** nets (pages 24-28)
- [ ] **Tous les tableaux** bien formatés

### Mise en Page
- [ ] **Marges** : 2,5 cm partout
- [ ] **Police** : Times New Roman 12pt (corps), Montserrat (titres)
- [ ] **Interlignes** : 1,5 pour le texte
- [ ] **Numérotation** : Continue de 1 à 60

### Sections Critiques
- [ ] **Remerciements** (page 3)
- [ ] **Sommaire** (page 2)
- [ ] **Introduction** (page 4)
- [ ] **Problématique** (page 5-6)
- [ ] **Conception** (pages 17-28)
- [ ] **Développement** (pages 31-51)
- [ ] **Conclusion** (pages 52-55)
- [ ] **Bibliographie** (page 57)
- [ ] **Annexes** (pages 56-60)

---

## 🐛 Problèmes Courants et Solutions

### Problème 1 : Les diagrammes SVG ne s'affichent pas

**Solution** :
```
1. Utiliser l'Outil Capture Windows (Win + Shift + S)
2. Capturer chaque diagramme en haute résolution
3. Insertion → Images → Sélectionner l'image capturée
4. Ajuster la taille et le positionnement
```

---

### Problème 2 : Les couleurs sont différentes

**Solution** :
```
1. Sélectionner l'élément coloré
2. Accueil → Couleur de surbrillance du texte
3. Choisir la couleur appropriée :
   - Bleu pour titres
   - Vert pour "Must Have"
   - Orange pour "Should Have"
```

---

### Problème 3 : Le formatage est cassé

**Solution** :
```
1. Édition → Sélectionner tout (Ctrl+A)
2. Accueil → Effacer la mise en forme
3. Réappliquer les styles :
   - Titre 1 pour chapitres
   - Titre 2 pour sections
   - Normal pour paragraphes
```

---

### Problème 4 : La table des matières ne se met pas à jour

**Solution** :
```
1. Clic droit sur la table des matières
2. "Mettre à jour les champs"
3. Choisir "Mettre à jour toute la table"
```

---

## 📊 Optimisation du MCD pour DOCX

Le **MCD (page 22)** est critique pour votre rapport. Voici comment l'optimiser :

### Option 1 : Garder le SVG (si net)
Si le diagramme s'affiche bien, gardez-le tel quel.

### Option 2 : Recréer avec Visio/Draw.io
Pour un rendu parfait :

1. **Aller sur https://app.diagrams.net/** (gratuit)
2. **Recréer le MCD** avec ces entités :

```
SECTEUR ─── contient (1,N) ─── PLACE
                                  │
                                  │ est réservée (0,N)
                                  │
                              RESERVATION
                                  │
                                  │ effectue (1,1)
                                  │
                              UTILISATEUR
```

3. **Exporter en PNG haute qualité** (300 DPI)
4. **Insérer dans Word** à la page 22

---

## ✅ Validation Finale

Avant la soumission :

1. **Imprimez une page test** pour vérifier :
   - Qualité des diagrammes
   - Lisibilité des tableaux
   - Alignement des textes

2. **Demandez à quelqu'un de relire** :
   - Fautes d'orthographe
   - Cohérence des sections
   - Clarté des explications techniques

3. **Testez le PDF** :
   - Ouvrez-le sur un autre ordinateur
   - Vérifiez que tous les liens internes fonctionnent
   - Assurez-vous que les signets sont corrects

---

## 🎓 Conseils pour la Soutenance

Une fois le rapport DOCX/PDF prêt :

1. **Imprimez 3 exemplaires** :
   - 1 pour vous
   - 1 pour le jury
   - 1 de secours

2. **Créez une version PowerPoint** :
   - Extraire les diagrammes du rapport
   - Créer 15-20 slides pour la présentation (30 min)
   - Ajouter des screenshots de l'application

3. **Préparez une démo live** :
   - Réservation d'une place
   - Paiement Stripe
   - Génération du QR Code
   - Dashboard administrateur

---

## 📞 Support

Si vous rencontrez des problèmes lors de la conversion :

1. Vérifiez que **Microsoft Word** est installé et à jour
2. Essayez de **redémarrer Word** et réessayer
3. Utilisez la **méthode manuelle** (Ouvrir HTML dans Word)
4. En dernier recours, utilisez un **convertisseur en ligne** :
   - https://www.online-convert.com/
   - https://convertio.co/fr/html-docx/

---

**Bonne chance pour votre soutenance ! 🎓🚀**
