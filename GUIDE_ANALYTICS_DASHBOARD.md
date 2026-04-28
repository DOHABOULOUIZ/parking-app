# 📊 Guide d'Utilisation du Dashboard Analytics Amélioré

## 🚀 Vue d'Ensemble

Le nouveau **Tableau de Bord Analytics** offre des graphiques interactifs, des données en temps réel et des exports avancés pour une gestion intelligente du parking.

---

## ✨ Fonctionnalités Principales

### 1. **Graphiques Interactifs** (Recharts)

#### 📈 Évolution de l'Occupation
- **Type**: Graphique en courbe
- **Affiche**: Taux d'occupation au fil du temps
- **Interaction**: Hover pour voir les valeurs exactes
- **Période**: Ajustable (jour/semaine/mois/année)

#### 💰 Revenus sur la Période
- **Type**: Graphique en barres
- **Affiche**: Revenu quotidien/hebdomadaire/mensuel
- **Interaction**: Couleurs distinctes par jour
- **Formatage**: Affichage en euros (€)

#### 🎯 Réservations par Secteur
- **Type**: Graphique circulaire (Pie Chart)
- **Affiche**: Distribution des réservations par secteur (A, B, C, etc.)
- **Couleurs**: Palette de 6 couleurs distinctes
- **Labels**: Nom du secteur + nombre de réservations

#### ⏰ Heures de Pointe
- **Type**: Barres animées
- **Affiche**: Top 8 heures avec le plus de réservations
- **Format**: HH:00 avec barre de progression
- **Normalize**: Relative à l'heure la plus chargée

---

### 2. **KPI Cards (Indicateurs Clés)**

4 cartes principales affichant:
- 📊 **Taux d'occupation** (en %)
- 💰 **Revenus totaux** (en €)
- ⏱️ **Durée moyenne** (en heures)
- 👥 **Utilisateurs actifs** (nombre)

Chaque card affiche:
- La valeur principale (grande police)
- Une tendance vs période précédente
- Une icône thématique

---

### 3. **Filtres Avancés**

#### 📅 Sélecteurs de Période
```
Aujourd'hui  |  Cette semaine  |  Ce mois  |  Cette année
```

#### 🗓️ Filtres Date Personnalisés
- Date de début (format YYYY-MM-DD)
- Date de fin (format YYYY-MM-DD)
- Bouton "Appliquer" pour mettre à jour les données

---

### 4. **Exports (PDF, CSV, Excel)**

```
[📄 Exporter en PDF]  [📊 Exporter en CSV]  [📑 Exporter en Excel]
```

**Fonctionnement**:
1. Sélectionnez les dates
2. Cliquez sur le format souhaité
3. Le fichier se télécharge automatiquement

**Formats disponibles**:
- **PDF**: Document formaté pour impression
- **CSV**: Données brutes pour Excel/Sheets
- **Excel**: Classeur XLSX avec mise en forme

---

### 5. **Tableau Performance par Secteur**

| Secteur | Places | Réservations | Revenus | Moy/place |
|---------|--------|-------------|---------|-----------|
| Secteur A | 50 | 245 | €2,450.00 | €10.00 |
| Secteur B | 75 | 398 | €3,184.00 | €8.00 |
| Secteur C | 60 | 312 | €2,496.00 | €8.00 |

---

## 🔌 Intégration API

### Endpoints Utilisés

```
GET /api/admin/analytics/dashboard?period=week
GET /api/admin/analytics/occupancy-trend?days=7
GET /api/admin/analytics/revenue-trend?days=30
GET /api/admin/analytics/sector-comparison
POST /api/admin/analytics/export-report
```

### Variables d'Environnement

```env
# .env.local
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
```

---

## 📱 Design Responsive

- **Mobile** (< 768px): Grille 1 colonne
- **Tablette** (768px - 1024px): Grille 2 colonnes
- **Desktop** (> 1024px): Grille 2-4 colonnes

---

## 🎨 Palette de Couleurs

```javascript
const COLORS = [
  '#3b82f6',  // Bleu
  '#10b981',  // Vert
  '#f59e0b',  // Ambre
  '#ef4444',  // Rouge
  '#8b5cf6',  // Violet
  '#ec4899',  // Rose
];
```

---

## ⚙️ Configuration

### Installation des Dépendances

```bash
npm install recharts axios react-toastify
```

### Import dans le Composant Parent

```jsx
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function AdminDashboard() {
  return <AnalyticsDashboard />;
}
```

---

## 🧪 Tests

### Données de Test

Pour tester sans données réelles:

```bash
# Backend: Générer des données de test
php artisan tinker
>>> Artisan::call('analytics:generate', ['days' => 7])

# Frontend: Vérifier les endpoints
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/admin/analytics/dashboard?period=week
```

---

## 🐛 Troubleshooting

### Problème: Graphiques non affichés

**Solution 1**: Vérifier que Recharts est installé
```bash
npm list recharts
```

**Solution 2**: Vérifier la structure des données API
```javascript
// Console du navigateur
console.log(occupancyTrend);
// Doit avoir: [{ date: '2026-04-01', rate: 78.5 }, ...]
```

### Problème: Export ne fonctionne pas

**Solution 1**: Vérifier l'endpoint
```bash
POST /api/admin/analytics/export-report
Body: {
  "start_date": "2026-04-01",
  "end_date": "2026-04-08",
  "format": "pdf"
}
```

**Solution 2**: Vérifier les permissions Admin
```bash
# Vérifier que l'utilisateur est admin
GET /api/user
// Response: { "role": "admin", ... }
```

---

## 🚀 Next Steps

1. **Ajouter Real-time Updates** (WebSocket/Reverb)
   ```jsx
   useEffect(() => {
     Echo.channel('analytics')
       .listen('AnalyticsUpdated', (data) => {
         setAnalytics(data);
       });
   }, []);
   ```

2. **Ajouter Prédictions IA**
   ```jsx
   const predictions = await fetchAIMetrics();
   // Afficher courbes de prédiction pointillées
   ```

3. **Ajouter Comparaison avec Mois Précédent**
   ```jsx
   <LineChart>
     <Line dataKey="actual" stroke="#3b82f6" />
     <Line dataKey="predicted" stroke="#10b981" strokeDasharray="5 5" />
   </LineChart>
   ```

---

## 📚 Ressources

- [Recharts Documentation](https://recharts.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Laravel Analytics API](./ARCHITECTURE.md#analytics)
- [Stripe Reporting](https://stripe.com/docs/reports)

---

## ✅ Checklist Avant Soutenance

- [ ] Dashboard affiche correctement sur mobile/tablet/desktop
- [ ] Tous les graphiques chargent sans erreur
- [ ] Filtres de dates fonctionnent (min 3 périodes testées)
- [ ] Exports (PDF, CSV, Excel) fonctionnent
- [ ] Les données correspondent aux réservations
- [ ] Pas de console errors/warnings critiques
- [ ] Performance < 2s de chargement
- [ ] UX/Design testé avec un utilisateur externe

---

**Dernière mise à jour**: 4 Avril 2026  
**Version**: 2.0 (Améliorée)
