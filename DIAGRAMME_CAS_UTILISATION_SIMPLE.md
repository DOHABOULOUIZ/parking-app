# 📊 DIAGRAMME DE CAS D'UTILISATION
## Système de Parking Intelligent - Version Simple pour Présentation

---

## 🎯 VERSION 1 : DIAGRAMME ASCII (Simple)

```
┌─────────────────────────────────────────────────────────────────┐
│                 SYSTÈME DE PARKING INTELLIGENT                  │
└─────────────────────────────────────────────────────────────────┘

    👤 Utilisateur                                   👤 Administrateur
         │                                                   │
         │                                                   │
         ├──────► (S'inscrire)                              │
         │                                                   │
         ├──────► (Se connecter) ◄──────────────────────────┤
         │                                                   │
         ├──────► (Rechercher place disponible)             │
         │                                                   │
         ├──────► (Réserver une place)                      │
         │                                                   │
         ├──────► (Effectuer paiement Stripe)               │
         │                                                   │
         ├──────► (Recevoir QR Code)                        │
         │                                                   │
         ├──────► (Consulter mes réservations)              │
         │                                                   │
         │                                                   ├──────► (Gérer les secteurs)
         │                                                   │
         │                                                   ├──────► (Gérer les places)
         │                                                   │
         │                                                   ├──────► (Valider QR Code)
         │                                                   │
         │                                                   ├──────► (Voir statistiques)
         │                                                   │
         │                                                   ├──────► (Gérer utilisateurs)
         │                                                   │
```

---

## 🎯 VERSION 2 : DIAGRAMME DÉTAILLÉ (Pour PowerPoint)

```
═══════════════════════════════════════════════════════════════════════════
                    SYSTÈME DE PARKING INTELLIGENT
═══════════════════════════════════════════════════════════════════════════

┌──────────────┐                                           ┌──────────────┐
│              │                                           │              │
│ UTILISATEUR  │                                           │ADMINISTRATEUR│
│              │                                           │              │
└──────┬───────┘                                           └──────┬───────┘
       │                                                          │
       │  ┌─────────────────────────────────────────────┐        │
       │  │                                             │        │
       ├──┤  Inscription / Création de compte          │        │
       │  │                                             │        │
       │  └─────────────────────────────────────────────┘        │
       │                                                          │
       │  ┌─────────────────────────────────────────────┐        │
       │  │                                             │        │
       ├──┤  Authentification (Login)                  ├────────┤
       │  │                                             │        │
       │  └─────────────────────────────────────────────┘        │
       │                                                          │
       │  ┌─────────────────────────────────────────────┐        │
       │  │  Rechercher places disponibles              │        │
       ├──┤  (Temps réel)                               │        │
       │  │                                             │        │
       │  └─────────────────────────────────────────────┘        │
       │                                                          │
       │  ┌─────────────────────────────────────────────┐        │
       │  │  Réserver une place                         │        │
       ├──┤  (Sélection date/heure)                     │        │
       │  │                                             │        │
       │  └─────────────────────────────────────────────┘        │
       │                                                          │
       │  ┌─────────────────────────────────────────────┐        │
       │  │  Payer en ligne                             │        │
       ├──┤  (Stripe - Carte bancaire)                  │        │
       │  │                                             │        │
       │  └─────────────────────────────────────────────┘        │
       │                                                          │
       │  ┌─────────────────────────────────────────────┐        │
       │  │  Recevoir QR Code                           │        │
       ├──┤  (Ticket électronique)                      │        │
       │  │                                             │        │
       │  └─────────────────────────────────────────────┘        │
       │                                                          │
       │  ┌─────────────────────────────────────────────┐        │
       │  │  Consulter historique                       │        │
       ├──┤  (Mes réservations)                         │        │
       │  │                                             │        │
       │  └─────────────────────────────────────────────┘        │
       │                                                          │
       │                                                          │
       │                 ┌─────────────────────────────────────────────┐
       │                 │  Gérer secteurs de parking                  │
       │                 │  (Ajouter / Modifier / Supprimer)          │
       │                 │                                             │
       │                 └─────────────────────────────────────────────┘
       │                                                          │
       │                 ┌─────────────────────────────────────────────┐
       │                 │  Gérer places de stationnement              │
       │                 │  (CRUD complet)                             │
       │                 │                                             │
       │                 └─────────────────────────────────────────────┘
       │                                                          │
       │                 ┌─────────────────────────────────────────────┐
       │                 │  Valider QR Code                            │
       │                 │  (Scanner à l'entrée/sortie)               │
       │                 │                                             │
       │                 └─────────────────────────────────────────────┘
       │                                                          │
       │                 ┌─────────────────────────────────────────────┐
       │                 │  Consulter tableau de bord                  │
       │                 │  (Statistiques & Analytics)                │
       │                 │                                             │
       │                 └─────────────────────────────────────────────┘
       │                                                          │
       │                 ┌─────────────────────────────────────────────┐
       │                 │  Gérer les utilisateurs                     │
       │                 │  (Liste, rôles, permissions)               │
       │                 │                                             │
       │                 └─────────────────────────────────────────────┘
       │                                                          │

```

---

## 🎯 VERSION 3 : TABLEAU RÉCAPITULATIF (Ultra-simple)

| **ACTEUR**       | **CAS D'UTILISATION**                              |
|------------------|---------------------------------------------------|
| 👤 **UTILISATEUR** |                                                   |
|                  | ✅ S'inscrire (créer un compte)                   |
|                  | ✅ Se connecter                                   |
|                  | ✅ Rechercher une place disponible                |
|                  | ✅ Réserver une place                             |
|                  | ✅ Effectuer un paiement (Stripe)                 |
|                  | ✅ Recevoir un QR Code                            |
|                  | ✅ Consulter l'historique des réservations        |
|                  |                                                   |
| 👨‍💼 **ADMINISTRATEUR** |                                            |
|                  | ✅ Se connecter                                   |
|                  | ✅ Gérer les secteurs de parking                  |
|                  | ✅ Gérer les places de stationnement              |
|                  | ✅ Valider les QR Codes                           |
|                  | ✅ Consulter les statistiques                     |
|                  | ✅ Gérer les utilisateurs                         |

---

## 🎯 VERSION 4 : DIAGRAMME STYLE UML PROFESSIONNEL

```
                    ╔════════════════════════════════════════╗
                    ║   SYSTÈME DE PARKING INTELLIGENT       ║
                    ╚════════════════════════════════════════╝

    Utilisateur                                        Administrateur
        👤                                                  👤
        │                                                   │
        │                                                   │
        ├─────┐                                             │
        │     │                                             │
        │  ┌──▼────────────────────────┐                    │
        │  │  S'inscrire               │                    │
        │  └───────────────────────────┘                    │
        │                                                   │
        │  ┌───────────────────────────┐                    │
        ├──┤  Se connecter             ├────────────────────┤
        │  └───────────────────────────┘                    │
        │                                                   │
        │  ┌───────────────────────────┐                    │
        ├──┤  Rechercher place         │                    │
        │  │  disponible               │                    │
        │  └───────────────────────────┘                    │
        │           │                                       │
        │           │ <<extend>>                            │
        │           ▼                                       │
        │  ┌───────────────────────────┐                    │
        ├──┤  Réserver une place       │                    │
        │  └───────────────────────────┘                    │
        │           │                                       │
        │           │ <<include>>                           │
        │           ▼                                       │
        │  ┌───────────────────────────┐                    │
        ├──┤  Effectuer paiement       │                    │
        │  │  (Stripe)                 │                    │
        │  └───────────────────────────┘                    │
        │           │                                       │
        │           │ <<include>>                           │
        │           ▼                                       │
        │  ┌───────────────────────────┐                    │
        ├──┤  Recevoir QR Code         │                    │
        │  └───────────────────────────┘                    │
        │                                                   │
        │  ┌───────────────────────────┐                    │
        ├──┤  Consulter historique     │                    │
        │  │  réservations             │                    │
        │  └───────────────────────────┘                    │
        │                                                   │
        │                                                   │
        │                  ┌───────────────────────────┐    │
        │                  │  Gérer secteurs           ├────┤
        │                  └───────────────────────────┘    │
        │                                                   │
        │                  ┌───────────────────────────┐    │
        │                  │  Gérer places             ├────┤
        │                  └───────────────────────────┘    │
        │                                                   │
        │                  ┌───────────────────────────┐    │
        │                  │  Valider QR Code          ├────┤
        │                  └───────────────────────────┘    │
        │                                                   │
        │                  ┌───────────────────────────┐    │
        │                  │  Dashboard Analytics      ├────┤
        │                  └───────────────────────────┘    │
        │                                                   │
        │                  ┌───────────────────────────┐    │
        │                  │  Gérer utilisateurs       ├────┤
        │                  └───────────────────────────┘    │

        Légende :
        ──────► : Association
        <<include>> : Relation d'inclusion (obligatoire)
        <<extend>> : Relation d'extension (optionnelle)
```

---

## 📝 EXPLICATIONS POUR LA PRÉSENTATION

### **Qu'est-ce qu'un diagramme de cas d'utilisation ?**

C'est un diagramme UML qui montre :
- **Les acteurs** (qui utilise le système ?)
- **Les cas d'utilisation** (que peut-on faire ?)
- **Les relations** (comment interagissent-ils ?)

---

### **Les 2 Acteurs Principaux :**

#### 👤 **UTILISATEUR** (Client)
Personne qui cherche et réserve une place de parking.

**Objectif :** Trouver et réserver une place rapidement

**Actions possibles :**
1. Créer un compte
2. Se connecter
3. Chercher une place libre
4. Réserver
5. Payer en ligne
6. Recevoir un QR Code
7. Voir son historique

---

#### 👨‍💼 **ADMINISTRATEUR** (Gestionnaire)
Personne qui gère le système de parking.

**Objectif :** Gérer et optimiser le parking

**Actions possibles :**
1. Se connecter (espace admin)
2. Gérer les secteurs (Ajouter/Modifier/Supprimer)
3. Gérer les places (Disponibles/Occupées/Hors service)
4. Scanner et valider les QR Codes
5. Consulter les statistiques en temps réel
6. Gérer les comptes utilisateurs

---

## 🎨 COMMENT LE DESSINER DANS POWERPOINT ?

### **Méthode facile en 5 étapes :**

#### **Étape 1 : Dessiner le système (rectangle)**
```
Insertion → Formes → Rectangle arrondi
Texte : "SYSTÈME DE PARKING INTELLIGENT"
Couleur : Bleu (#007bff)
```

#### **Étape 2 : Ajouter les acteurs (bonhommes)**
```
Insertion → Icônes → Rechercher "person" ou "user"
OU
Insertion → Formes → Forme personnalisée (bonhomme stick)

Placer :
- Utilisateur à GAUCHE du système
- Administrateur à DROITE du système
```

#### **Étape 3 : Ajouter les cas d'utilisation (ovales)**
```
Insertion → Formes → Ovale
Texte dans l'ovale : nom de l'action

Exemples :
○ S'inscrire
○ Rechercher place
○ Réserver
○ Payer
○ Recevoir QR Code
○ Gérer places
○ Dashboard
```

#### **Étape 4 : Relier avec des flèches**
```
Insertion → Formes → Ligne avec flèche
Connecter l'acteur à ses cas d'utilisation
```

#### **Étape 5 : Colorer pour clarté**
```
- Acteurs : Bleu foncé
- Cas Utilisateur : Vert clair
- Cas Admin : Orange clair
- Système : Bleu
```

---

## 🖼️ TEMPLATE POWERPOINT READY

### **Disposition slide :**

```
┌────────────────────────────────────────────────────────────┐
│  ANALYSE & CONCEPTION                                      │
│  Diagramme de Cas d'Utilisation                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   👤 Utilisateur          [SYSTÈME]         👨‍💼 Admin        │
│                                                            │
│      │                  ┌─────────┐              │         │
│      ├─────────────────►│S'inscrire│              │         │
│      │                  └─────────┘              │         │
│      │                  ┌─────────┐              │         │
│      ├─────────────────►│Réserver │              │         │
│      │                  └─────────┘              │         │
│      │                  ┌─────────┐              │         │
│      ├─────────────────►│Payer    │              │         │
│      │                  └─────────┘              │         │
│      │                                           │         │
│      │                  ┌──────────┐             │         │
│      │                  │Gérer     │◄────────────┤         │
│      │                  │places    │             │         │
│      │                  └──────────┘             │         │
│      │                  ┌──────────┐             │         │
│      │                  │Dashboard │◄────────────┤         │
│      │                  └──────────┘             │         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 💡 POINTS À MENTIONNER LORS DE LA PRÉSENTATION

### **Ce qu'il faut dire :**

> *"Ce diagramme montre les interactions entre les 2 types d'acteurs et le système."*

> *"À gauche, l'UTILISATEUR peut s'inscrire, rechercher une place, réserver, payer et recevoir un QR Code."*

> *"À droite, l'ADMINISTRATEUR gère les secteurs, les places, valide les QR Codes et consulte les statistiques."*

> *"Les deux acteurs partagent la fonctionnalité de connexion."*

> *"Ce diagramme représente les 12 cas d'utilisation principaux du système."*

---

## 📊 STATISTIQUES DU DIAGRAMME

```
🎯 Nombre total de cas d'utilisation : 12
   - Utilisateur : 7 cas
   - Administrateur : 5 cas
   - Partagés : 1 cas (connexion)

👥 Nombre d'acteurs : 2
   - Utilisateur (client)
   - Administrateur (gestionnaire)

🔗 Relations :
   - Association simple : 11
   - Include : 2 (Paiement → QR Code)
   - Extend : 1 (Recherche → Réservation)
```

---

## ✅ CHECKLIST AVANT LA SOUTENANCE

- [ ] Diagramme créé dans PowerPoint
- [ ] Acteurs clairement identifiables (icônes)
- [ ] Cas d'utilisation dans des ovales
- [ ] Flèches bien orientées
- [ ] Couleurs cohérentes (Utilisateur vert, Admin orange)
- [ ] Titre du slide visible : "Diagramme de Cas d'Utilisation"
- [ ] Légende ajoutée si nécessaire
- [ ] Diagramme lisible même de loin (police ≥ 16pt)
- [ ] Explications préparées (30-45 secondes max)

---

## 🎯 TIMING RECOMMANDÉ POUR CETTE SLIDE

```
⏱️ Durée totale : 1 minute 30 secondes

00:00-00:15 → Introduction du diagramme
00:15-00:45 → Explication acteur Utilisateur
00:45-01:15 → Explication acteur Administrateur  
01:15-01:30 → Transition vers slide suivante
```

---

## 🚀 VERSION ULTRA-MINIMALISTE (Si manque de temps)

```
SYSTÈME DE PARKING INTELLIGENT

UTILISATEUR peut :               ADMINISTRATEUR peut :
• S'inscrire                    • Gérer les places
• Réserver                      • Valider QR Codes
• Payer                         • Voir statistiques
• Recevoir QR Code              • Gérer utilisateurs
• Voir historique
```

---

**✨ Choisissez la VERSION qui vous convient le mieux !**
**Recommandation : VERSION 3 (Tableau) ou VERSION 4 (UML) pour la présentation**
