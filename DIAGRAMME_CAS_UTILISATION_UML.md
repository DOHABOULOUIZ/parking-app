# 🎨 DIAGRAMME DE CAS D'UTILISATION UML - FORMAT IMAGE
## Système de Parking Intelligent

---

## ✅ DIAGRAMMES MERMAID GÉNÉRÉS

**3 versions différentes ont été générées ci-dessus :**

### **VERSION 1 : Diagramme Standard (Top to Bottom)**
- Layout vertical classique
- Tous les cas d'utilisation visibles
- Idéal pour rapport écrit

### **VERSION 2 : Diagramme Organisé par Acteur (Left to Right)**
- Layout horizontal
- Cas groupés par type d'acteur
- Meilleure séparation visuelle

### **VERSION 3 : Diagramme Simplifié avec Numéros** ⭐ **RECOMMANDÉ POUR PRÉSENTATION**
- Cas d'utilisation numérotés
- Groupés par fonctionnalité (Gestion, Réservation, Administration)
- Plus facile à expliquer oralement
- Couleurs par catégorie

**Caractéristiques communes :**
- ✅ 2 Acteurs (Utilisateur, Administrateur)
- ✅ 12 Cas d'utilisation
- ✅ Relations include/extend
- ✅ Couleurs distinctives par acteur
- ✅ Format professionnel

---

## 📝 CODE PLANTUML - VERSION CLASSIQUE UML

Pour générer un **diagramme UML classique** avec des ovales, utilisez ce code sur **PlantUML** :

### **Code PlantUML :**

```plantuml
@startuml
!theme cerulean-outline

skinparam actor {
    BackgroundColor<<User>> LightGreen
    BorderColor<<User>> Green
    BackgroundColor<<Admin>> LightSalmon
    BorderColor<<Admin>> OrangeRed
}

skinparam usecase {
    BackgroundColor<<User>> LightGreen
    BorderColor<<User>> Green
    BackgroundColor<<Admin>> LightSalmon
    BorderColor<<Admin>> Orange
    BackgroundColor<<Shared>> LightYellow
    BorderColor<<Shared>> Gold
}

left to right direction

actor "👤 Utilisateur" as User <<User>>
actor "👨‍💼 Administrateur" as Admin <<Admin>>

rectangle "SYSTÈME DE PARKING INTELLIGENT" {
    
    ' Cas d'utilisation Utilisateur
    usecase "S'inscrire" as UC1 <<User>>
    usecase "Se connecter" as UC2 <<Shared>>
    usecase "Rechercher place\ndisponible" as UC3 <<User>>
    usecase "Réserver\nune place" as UC4 <<User>>
    usecase "Effectuer paiement\n(Stripe)" as UC5 <<User>>
    usecase "Recevoir\nQR Code" as UC6 <<User>>
    usecase "Consulter historique\nréservations" as UC7 <<User>>
    
    ' Cas d'utilisation Administrateur
    usecase "Gérer secteurs\nde parking" as UC8 <<Admin>>
    usecase "Gérer places de\nstationnement" as UC9 <<Admin>>
    usecase "Valider\nQR Code" as UC10 <<Admin>>
    usecase "Dashboard\nAnalytics" as UC11 <<Admin>>
    usecase "Gérer\nutilisateurs" as UC12 <<Admin>>
}

' Relations Utilisateur
User --> UC1
User --> UC2
User --> UC3
User --> UC4
User --> UC5
User --> UC6
User --> UC7

' Relations Administrateur
Admin --> UC2
Admin --> UC8
Admin --> UC9
Admin --> UC10
Admin --> UC11
Admin --> UC12

' Relations include/extend
UC4 .> UC5 : <<include>>
UC5 .> UC6 : <<include>>
UC3 .> UC4 : <<extend>>

note right of UC4
  La réservation inclut
  obligatoirement le paiement
  et la génération du QR Code
end note

note right of UC11
  Le dashboard affiche les
  statistiques en temps réel
  (WebSocket Laravel Reverb)
end note

@enduml
```

---

## 🌐 COMMENT GÉNÉRER L'IMAGE ?

### **MÉTHODE 1 : PlantUML Online** ⭐ **RECOMMANDÉ**

1. Allez sur : **https://www.plantuml.com/plantuml/uml/**
2. Copiez-collez le code PlantUML ci-dessus
3. Cliquez sur **"Submit"**
4. Téléchargez l'image (PNG/SVG)

**Avantages :** 
- ✅ Diagramme UML classique avec ovales
- ✅ Export PNG, SVG, PDF
- ✅ Haute qualité professionnelle

---

### **MÉTHODE 2 : Mermaid Live Editor**

1. Allez sur : **https://mermaid.live/**
2. Copiez-collez le code Mermaid (voir section suivante)
3. Exportez en PNG ou SVG

**Avantages :**
- ✅ Éditeur interactif en temps réel
- ✅ Export facile
- ✅ Design moderne

---

### **MÉTHODE 3 : Draw.io (Diagrams.net)** 💡 **MANUEL MAIS FLEXIBLE**

1. Allez sur : **https://app.diagrams.net/**
2. Nouveau diagramme → UML → Use Case Diagram
3. Utilisez les formes :
   - **Actor** (bonhomme) pour Utilisateur et Admin
   - **Use Case** (ovale) pour chaque cas
   - **Subsystem** (rectangle) pour le système
4. Exportez en PNG/SVG/PDF

**Avantages :**
- ✅ Contrôle total sur le design
- ✅ Facile à personnaliser
- ✅ Export multi-formats

---

### **MÉTHODE 4 : Visual Paradigm Online**

1. Allez sur : **https://online.visual-paradigm.com/**
2. Create → UML → Use Case Diagram
3. Dessinez le diagramme
4. Exportez

**Avantages :**
- ✅ Outil professionnel UML
- ✅ Templates prédéfinis
- ✅ Version gratuite disponible

---

## 📋 CODE MERMAID (Pour référence)

```mermaid
graph TB
    subgraph System["🏢 SYSTÈME DE PARKING INTELLIGENT"]
        UC1[("S'inscrire")]
        UC2[("Se connecter")]
        UC3[("Rechercher place<br/>disponible")]
        UC4[("Réserver<br/>une place")]
        UC5[("Effectuer<br/>paiement Stripe")]
        UC6[("Recevoir<br/>QR Code")]
        UC7[("Consulter<br/>historique")]
        UC8[("Gérer<br/>secteurs")]
        UC9[("Gérer<br/>places")]
        UC10[("Valider<br/>QR Code")]
        UC11[("Dashboard<br/>Analytics")]
        UC12[("Gérer<br/>utilisateurs")]
    end
    
    User["👤 UTILISATEUR"]
    Admin["👨‍💼 ADMINISTRATEUR"]
    
    User -->|utilise| UC1
    User -->|utilise| UC2
    User -->|utilise| UC3
    User -->|utilise| UC4
    User -->|utilise| UC5
    User -->|utilise| UC6
    User -->|utilise| UC7
    
    Admin -->|utilise| UC2
    Admin -->|utilise| UC8
    Admin -->|utilise| UC9
    Admin -->|utilise| UC10
    Admin -->|utilise| UC11
    Admin -->|utilise| UC12
    
    UC4 -.->|include| UC5
    UC5 -.->|include| UC6
    UC3 -.->|extend| UC4
    
    style System fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    style User fill:#c8e6c9,stroke:#388e3c,stroke-width:2px
    style Admin fill:#ffe0b2,stroke:#f57c00,stroke-width:2px
    
    style UC1 fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
    style UC2 fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
    style UC3 fill:#c8e6c9,stroke:#388e3c,stroke-width:2px
    style UC4 fill:#c8e6c9,stroke:#388e3c,stroke-width:2px
    style UC5 fill:#c8e6c9,stroke:#388e3c,stroke-width:2px
    style UC6 fill:#c8e6c9,stroke:#388e3c,stroke-width:2px
    style UC7 fill:#c8e6c9,stroke:#388e3c,stroke-width:2px
    
    style UC8 fill:#ffccbc,stroke:#f57c00,stroke-width:2px
    style UC9 fill:#ffccbc,stroke:#f57c00,stroke-width:2px
    style UC10 fill:#ffccbc,stroke:#f57c00,stroke-width:2px
    style UC11 fill:#ffccbc,stroke:#f57c00,stroke-width:2px
    style UC12 fill:#ffccbc,stroke:#f57c00,stroke-width:2px
```

---

## 🎨 CODE POUR LUCIDCHART

Si vous préférez **Lucidchart** :

1. Allez sur : **https://www.lucidchart.com/**
2. Nouveau document → UML → Use Case Diagram
3. Importez depuis PlantUML OU dessinez manuellement
4. Exportez en PNG/PDF

---

## 🖼️ TEMPLATE POWERPOINT ALTERNATIF

Si vous voulez créer le diagramme **directement dans PowerPoint** :

### **Éléments à utiliser :**

#### 1. **Acteurs** (Insertion → Icônes → "person")
```
👤 Utilisateur (à gauche)
👨‍💼 Administrateur (à droite)
```

#### 2. **Système** (Rectangle arrondi bleu)
```
Couleur : #1976D2
Texte : "SYSTÈME DE PARKING INTELLIGENT"
Dimension : Large (couvre 60% de la slide)
```

#### 3. **Cas d'utilisation** (Ovales)
```
Pour Utilisateur : Ovales vertes (#4CAF50)
Pour Admin : Ovales oranges (#FF9800)
Partagés : Ovales jaunes (#FBC02D)

Texte centré, police 12pt
```

#### 4. **Flèches** (Connecteurs)
```
Utilisateur → Cas : Ligne pleine
Admin → Cas : Ligne pleine
Include/Extend : Ligne pointillée
```

---

## 📊 LÉGENDE DU DIAGRAMME

```
┌─────────────────────────────────────────────────┐
│  LÉGENDE                                        │
├─────────────────────────────────────────────────┤
│  👤 = Acteur (Utilisateur)                      │
│  👨‍💼 = Acteur (Administrateur)                   │
│  ( ) = Cas d'utilisation                        │
│  ──► = Association (utilise)                    │
│  -.-> = Relation include/extend                 │
│                                                 │
│  🟢 Vert  = Fonctionnalités utilisateur         │
│  🟠 Orange = Fonctionnalités administrateur     │
│  🟡 Jaune = Fonctionnalités partagées           │
└─────────────────────────────────────────────────┘
```

---

## 📝 DESCRIPTION DÉTAILLÉE DES RELATIONS

### **Relations <<include>>** (Inclusion obligatoire)

```
Réserver une place ──include──> Effectuer paiement
                                      │
                                      ├──include──> Recevoir QR Code
```

**Signification :** 
- Quand un utilisateur réserve, il DOIT payer
- Quand il paie, il DOIT recevoir un QR Code

---

### **Relations <<extend>>** (Extension optionnelle)

```
Rechercher place ──extend──> Réserver une place
```

**Signification :**
- L'utilisateur peut rechercher sans réserver
- Mais s'il veut réserver, il doit d'abord rechercher

---

## ✅ CHECKLIST EXPORT IMAGE

Avant d'utiliser le diagramme dans votre présentation :

- [ ] Image exportée en **PNG** (haute résolution : 300 DPI minimum)
- [ ] Ou exportée en **SVG** (vectoriel, meilleure qualité)
- [ ] Texte lisible (police ≥ 14pt)
- [ ] Couleurs cohérentes avec votre charte graphique
- [ ] Acteurs clairement identifiés
- [ ] Flèches bien orientées
- [ ] Légende ajoutée si nécessaire
- [ ] Image testée en mode présentation (visible de loin)

---

## 🚀 RECOMMANDATION FINALE

### **Pour votre soutenance, utilisez :**

1. **PlantUML Online** pour générer un diagramme UML classique professionnel
2. Exportez en **PNG 300 DPI** ou **SVG**
3. Insérez dans PowerPoint slide **"Analyse & Conception"**
4. Ajoutez un titre : **"Diagramme de Cas d'Utilisation"**
5. Préparez l'explication (1 min 30 sec)

---

## 🔗 LIENS RAPIDES

| Outil | URL | Usage |
|-------|-----|-------|
| **PlantUML Online** | https://www.plantuml.com/plantuml/uml/ | ⭐ Diagramme UML classique |
| **Mermaid Live** | https://mermaid.live/ | Diagramme moderne |
| **Draw.io** | https://app.diagrams.net/ | Manuel, flexible |
| **Lucidchart** | https://www.lucidchart.com/ | Professionnel |
| **Visual Paradigm** | https://online.visual-paradigm.com/ | UML complet |

---

## 💡 CONSEIL POUR LA PRÉSENTATION

**Ce qu'il faut dire en montrant le diagramme :**

> *"Voici le diagramme de cas d'utilisation UML de notre système."*
>
> *"On identifie 2 acteurs principaux :"*
> - *"L'Utilisateur en vert, qui peut s'inscrire, rechercher des places, réserver et payer"*
> - *"L'Administrateur en orange, qui gère les secteurs, les places et consulte le dashboard"*
>
> *"Les relations 'include' montrent que la réservation inclut obligatoirement le paiement et la génération du QR Code."*
>
> *"La relation 'extend' indique que la recherche peut être étendue par une réservation."*

⏱️ **Temps : 1 minute 30 secondes maximum**

---

**✨ Votre diagramme est prêt ! Choisissez votre méthode préférée et générez l'image.**
