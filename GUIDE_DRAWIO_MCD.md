# 🎨 Guide Complet : Créer votre MCD avec Draw.io

## 📥 Méthode 1 : Utiliser le Template (LE PLUS RAPIDE)

### Étape 1 : Ouvrir Draw.io
1. Allez sur **https://app.diagrams.net/**
2. Cliquez sur **"Create New Diagram"**
3. Fermez la fenêtre qui s'ouvre

### Étape 2 : Importer le Template
1. Cliquez sur **File** → **Open from** → **Device**
2. Sélectionnez le fichier **`MCD_PARKING_TEMPLATE.drawio`** (dans votre dossier projet)
3. ✅ Votre MCD s'ouvre immédiatement avec toutes les entités !

### Étape 3 : Ajuster si Nécessaire
1. Cliquez sur n'importe quel élément pour le déplacer
2. Double-cliquez sur un texte pour le modifier
3. Utilisez les poignées pour redimensionner

### Étape 4 : Exporter en Haute Qualité
1. Cliquez sur **File** → **Export as** → **PNG**
2. Cochez **"Transparent Background"** (facultatif)
3. Réglez **Zoom** à **300%** pour haute résolution
4. Cliquez sur **Export**
5. Sauvegardez : `MCD_Parking_System.png`

---

## 🔨 Méthode 2 : Créer depuis Zéro (POUR APPRENDRE)

### Configuration Initiale
1. Ouvrez **https://app.diagrams.net/**
2. **Create New Diagram** → Choisir **"Blank Diagram"**
3. Nom : `MCD_Parking_System`

### Créer les Entités (Rectangles)

#### SECTEUR
1. Dans la palette de gauche, cherchez **"Rectangle"**
2. Glissez sur la zone de dessin
3. Taille : **200 × 160 px**
4. Clic droit → **Edit Style** :
   ```
   fillColor=#EDF4FF;strokeColor=#1B2A6B;strokeWidth=3;rounded=0;
   ```
5. Double-cliquez → Tapez :
   ```
   SECTEUR
   ────────────
   ▸ id (PK)
     nom : VARCHAR(100)
     description : TEXT
     prix : DECIMAL(8,2)
     timestamps
   ```

#### PLACE
- Position : En dessous de SECTEUR (avec espace)
- Taille : **200 × 180 px**
- Même style que SECTEUR
- Texte :
  ```
  PLACE
  ────────────
  ▸ id (PK)
    place_number : INT
    status : ENUM
      ('libre', 'occupée',
       'réservée')
    timestamps
  ```

#### RÉSERVATION (Entité Centrale)
- Position : Au centre du diagramme
- Taille : **260 × 260 px**
- Style :
  ```
  fillColor=#FFF9E6;strokeColor=#1B2A6B;strokeWidth=4;rounded=0;
  ```
- Texte :
  ```
  RÉSERVATION
  ────────────────────
  ▸ id (PK)
    start_time : DATETIME
    end_time : DATETIME
    status : ENUM
    amount : DECIMAL(10,2)
    qr_code_token : STR(255)
    vehicle_reg : VARCHAR(20)
    checked_in_at : DATETIME
    checked_out_at : DATETIME
  ```

#### UTILISATEUR
- Position : En haut à droite
- Taille : **260 × 220 px**
- Style : Identique à SECTEUR
- Texte :
  ```
  UTILISATEUR
  ────────────────
  ▸ id (PK)
    name : VARCHAR(255)
    email : VARCHAR(255)
    password : VARCHAR(255)
    role : ENUM
      ('admin', 'user')
    email_verified_at : DT
    timestamps
  ```

#### PAIEMENT
- Position : En bas (sous RÉSERVATION)
- Taille : **180 × 80 px**
- Style :
  ```
  fillColor=#E6FAFA;strokeColor=#009B9B;strokeWidth=3;rounded=0;
  ```
- Texte :
  ```
  PAIEMENT
  ──────────────
  ▸ id (PK)
    stripe_session_id : STR
  ```

---

### Créer les Associations (Losanges)

1. Dans la palette, cherchez **"Rhombus"** (losange)
2. Créez 4 losanges pour les associations

#### CONTIENT (SECTEUR → PLACE)
- Position : Entre SECTEUR et PLACE
- Taille : **120 × 80 px**
- Style :
  ```
  fillColor=#F39C12;strokeColor=#1B2A6B;strokeWidth=3;fontColor=#FFFFFF;
  ```
- Texte : **CONTIENT**

#### CONCERNE (PLACE → RÉSERVATION)
- Entre PLACE et RÉSERVATION
- Même style
- Texte : **CONCERNE**

#### EFFECTUE (UTILISATEUR → RÉSERVATION)
- Entre UTILISATEUR et RÉSERVATION
- Même style
- Texte : **EFFECTUE**

#### GÉNÈRE (RÉSERVATION → PAIEMENT)
- Entre RÉSERVATION et PAIEMENT
- Style : `strokeColor=#009B9B` (teal au lieu de bleu)
- Texte : **GÉNÈRE**

---

### Ajouter les Lignes de Relation

1. Sélectionnez l'outil **"Connector"** (ligne avec flèche)
2. Cliquez sur une entité puis sur le losange associé
3. Style des lignes :
   - **Stroke Width** : 3
   - **Color** : #1B2A6B (bleu) ou #009B9B (teal pour GÉNÈRE)
   - **Line End** : None (pas de flèche)

**Connexions à créer :**
- SECTEUR ↔ CONTIENT ↔ PLACE
- PLACE ↔ CONCERNE ↔ RÉSERVATION
- UTILISATEUR ↔ EFFECTUE ↔ RÉSERVATION
- RÉSERVATION ↔ GÉNÈRE ↔ PAIEMENT

---

### Ajouter les Cardinalités

1. Utilisez l'outil **Text** (icône "A")
2. Ajoutez ces textes près des lignes :

**CONTIENT :**
- Près de SECTEUR : **1,1**
- Près de PLACE : **0,n**

**CONCERNE :**
- Près de PLACE : **1,1**
- Près de RÉSERVATION : **0,n**

**EFFECTUE :**
- Près de UTILISATEUR : **1,1**
- Près de RÉSERVATION : **0,n**

**GÉNÈRE :**
- Près de RÉSERVATION : **0,1**
- Près de PAIEMENT : **1,1**

Style des cardinalités :
```
fontSize=14;fontStyle=1;fontColor=#1B2A6B;
```
(Pour GÉNÈRE : `fontColor=#009B9B`)

---

### Ajouter les Clés Étrangères (FK)

1. Ajoutez des lignes **pointillées rouges** :
   - Style : `strokeColor=#c0392b;strokeWidth=2;dashed=1;dashPattern=6 4;`

2. Ajoutez des étiquettes texte :
   - **FK: sector_id** (de PLACE vers SECTEUR)
   - **FK: place_id** (de RÉSERVATION vers PLACE)
   - **FK: user_id** (de RÉSERVATION vers UTILISATEUR)

Style du texte FK :
```
fontSize=11;fontStyle=1;fontColor=#c0392b;fontFamily=Consolas;
```

---

## 📤 Export en Haute Qualité

### Option 1 : PNG (Recommandé pour Word)
1. **File** → **Export as** → **PNG**
2. Paramètres :
   - ✅ **Transparent Background** : Coché
   - ✅ **Selection Only** : Décoché
   - ✅ **Zoom** : **300%** (très important !)
   - ✅ **Border Width** : 10
3. **Export** → Sauvegarder : `MCD_Parking_300dpi.png`

### Option 2 : SVG (Qualité Vectorielle)
1. **File** → **Export as** → **SVG**
2. Cochez **"Embed Fonts"**
3. **Export**

### Option 3 : PDF
1. **File** → **Export as** → **PDF**
2. Idéal pour impression

---

## 🎯 Conseils Pro

### Alignement Parfait
- Sélectionnez plusieurs éléments
- **Arrange** → **Align** → Choisir l'alignement
- Utilisez **Distribute** pour espacer uniformément

### Grille et Guides
- **View** → **Grid** : Activer la grille
- **View** → **Guides** : Ajouter des guides

### Couleurs Cohérentes
Utilisez ces codes couleur du projet :
- **Bleu principal** : `#1B2A6B`
- **Teal** : `#009B9B`
- **Orange** : `#F39C12`
- **Fond bleu clair** : `#EDF4FF`
- **Fond jaune clair** : `#FFF9E6`
- **Rouge FK** : `#c0392b`
- **Vert PK** : `#27ae60`

### Police Professionnelle
- **Titres entités** : Arial, 14pt, Bold
- **Attributs** : Consolas, 11pt
- **Cardinalités** : Arial, 14pt, Bold

---

## 💾 Insérer dans Word

### Méthode 1 : Insertion Simple
1. Ouvrez votre rapport Word
2. Allez à la page 22 (MCD)
3. **Insertion** → **Images** → **Cet appareil**
4. Sélectionnez `MCD_Parking_300dpi.png`
5. Redimensionnez si nécessaire

### Méthode 2 : Qualité Maximale
1. Clic droit sur l'image dans Word
2. **Format de l'image** → **Taille**
3. Décochez **"Verrouiller les proportions"** temporairement
4. Largeur : **16 cm** (pleine page)
5. Hauteur : Ajuster automatiquement
6. ✅ Re-cochez **"Verrouiller les proportions"**

### Centrer et Légende
1. Sélectionnez l'image
2. **Format** → **Position** → **Centré**
3. Sous l'image, ajoutez :
   ```
   Figure X : Modèle Conceptuel de Données (MCD) selon MERISE
   ```

---

## 🔧 Raccourcis Utiles

| Action | Raccourci |
|--------|-----------|
| Dupliquer | `Ctrl + D` |
| Aligner | `Ctrl + Shift + Arrow` |
| Grouper | `Ctrl + G` |
| Dégrouper | `Ctrl + Shift + U` |
| Zoom + | `Ctrl + Mouse Wheel` |
| Sauvegarder | `Ctrl + S` |
| Annuler | `Ctrl + Z` |

---

## ✅ Checklist Finale

Avant d'exporter, vérifiez :
- [ ] Toutes les entités sont visibles et bien espacées
- [ ] Les 4 associations (losanges) sont présentes
- [ ] Toutes les cardinalités sont affichées
- [ ] Les clés étrangères (FK) sont indiquées
- [ ] Les couleurs sont cohérentes
- [ ] Le texte est lisible (taille suffisante)
- [ ] Aucun élément ne se chevauche
- [ ] Export en 300% pour haute résolution

---

## 📞 Support

**Template Draw.io fourni :** `MCD_PARKING_TEMPLATE.drawio`  
**À ouvrir avec :** https://app.diagrams.net/

**Résultat attendu :**
- Image PNG haute résolution (300 DPI)
- Prête pour insertion dans Word
- Style professionnel académique
- Conforme à la méthode MERISE

---

## 🎓 Ressources

- **Draw.io Documentation** : https://www.diagrams.net/doc/
- **Tutoriel vidéo Draw.io** : YouTube "Draw.io tutorial"
- **Méthode MERISE** : https://merise.developpez.com/

**Temps estimé :** 
- Avec template : **5 minutes**
- Depuis zéro : **30 minutes**

---

**✨ Astuce finale :** Sauvegardez toujours votre fichier `.drawio` en plus du PNG exporté. Cela vous permettra de modifier facilement le MCD plus tard si nécessaire !
