# ⚡ Guide Rapide MCD - 3 Étapes Simples

## 🚀 MÉTHODE EXPRESS (5 minutes)

### 1️⃣ Ouvrir Draw.io
```
https://app.diagrams.net/
```

### 2️⃣ Importer le Template
- **File** → **Open from** → **Device**
- Sélectionner : **`MCD_PARKING_TEMPLATE.drawio`**
- ✅ Votre MCD s'affiche automatiquement !

### 3️⃣ Exporter en PNG Haute Qualité
- **File** → **Export as** → **PNG**
- ✅ Cocher **"Transparent Background"**
- ✅ **Zoom** : **300%** (IMPORTANT !)
- ✅ **Border** : 10
- Cliquer **Export**
- Sauvegarder : `MCD_Parking_Final.png`

---

## 📄 Insérer dans Word

1. Ouvrir votre rapport Word (page 22)
2. **Supprimer** l'ancien MCD
3. **Insertion** → **Images** → Sélectionner `MCD_Parking_Final.png`
4. Redimensionner : **Largeur 16 cm** (pleine page)
5. Centrer l'image
6. ✅ TERMINÉ !

---

## 🎨 Alternative : JMerise (Outil Français Spécialisé)

Si Draw.io ne convient pas :

### Installation
1. Télécharger : http://www.jfreesoft.com/JMerise/
2. Installer JMerise
3. Lancer le logiciel

### Création Rapide
1. **Nouveau** → **MCD**
2. Ajouter entités : `SECTEUR`, `PLACE`, `RÉSERVATION`, `UTILISATEUR`, `PAIEMENT`
3. Ajouter associations : `CONTIENT`, `CONCERNE`, `EFFECTUE`, `GÉNÈRE`
4. Définir cardinalités : `1,1` / `0,n` / `0,1`
5. **Fichier** → **Exporter** → **PNG** (300 DPI)

---

## 📊 Vos Données à Saisir

### ENTITÉS
```
SECTEUR (id, nom, description, prix, timestamps)
PLACE (id, place_number, status, timestamps)
RÉSERVATION (id, start_time, end_time, status, amount, qr_code_token, vehicle_reg, checked_in_at, checked_out_at)
UTILISATEUR (id, name, email, password, role, email_verified_at, timestamps)
PAIEMENT (id, stripe_session_id)
```

### ASSOCIATIONS
```
CONTIENT : SECTEUR (1,1) ---- PLACE (0,n)
CONCERNE : PLACE (1,1) ---- RÉSERVATION (0,n)
EFFECTUE : UTILISATEUR (1,1) ---- RÉSERVATION (0,n)
GÉNÈRE : RÉSERVATION (0,1) ---- PAIEMENT (1,1)
```

### CLÉS ÉTRANGÈRES
```
PLACE.sector_id → SECTEUR.id
RÉSERVATION.place_id → PLACE.id
RÉSERVATION.user_id → UTILISATEUR.id
```

---

## 🎯 Couleurs Recommandées

| Élément | Couleur | Code Hex |
|---------|---------|----------|
| Bordure entités | Bleu foncé | `#1B2A6B` |
| Fond entités | Bleu clair | `#EDF4FF` |
| RÉSERVATION fond | Jaune clair | `#FFF9E6` |
| Losanges (associations) | Orange | `#F39C12` |
| PAIEMENT bordure/fond | Teal | `#009B9B` / `#E6FAFA` |
| Clés primaires (PK) | Vert | `#27ae60` |
| Clés étrangères (FK) | Rouge | `#c0392b` |

---

## ✅ Checklist Avant Export

- [ ] 5 entités visibles (SECTEUR, PLACE, RÉSERVATION, UTILISATEUR, PAIEMENT)
- [ ] 4 losanges d'associations
- [ ] Toutes les cardinalités affichées
- [ ] Aucune superposition
- [ ] Export en 300% de zoom
- [ ] Taille finale : environ 16 cm de large pour Word

---

## 📱 Si Vous Êtes Pressé

### Option Ultra-Rapide : PowerPoint
1. Ouvrir PowerPoint
2. Insérer des rectangles pour les entités
3. Insérer des losanges pour les associations
4. Ajouter du texte
5. **Fichier** → **Enregistrer sous** → **PNG** (haute qualité)
6. Importer dans Word

**Temps : 15 minutes**

---

## 🆘 Problème ?

**MCD trop petit dans Word ?**
→ Clic droit → Format → Taille → Largeur : 16 cm

**Qualité floue ?**
→ Ré-exporter avec Zoom 400% au lieu de 300%

**Fichier .drawio ne s'ouvre pas ?**
→ Utiliser https://app.diagrams.net/ (navigateur web)

---

## 📞 Fichiers Fournis

1. **`MCD_PARKING_TEMPLATE.drawio`** - Template complet Draw.io
2. **`GUIDE_DRAWIO_MCD.md`** - Guide détaillé complet
3. **`GUIDE_RAPIDE_MCD.md`** - Ce fichier (version express)

---

**⏱️ Temps total : 5-10 minutes avec le template !**

**🎓 Résultat : MCD professionnel prêt pour votre soutenance !**
