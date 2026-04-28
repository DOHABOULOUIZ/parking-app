import React, { useState } from 'react';
import { Card, StatCard, Badge, Button, Input, Alert, Table, Modal, Progress } from '../ui/ModernComponents';

/**
 * ModernUIShowcase - Démontre tous les composants modernes
 * Page d'exemple pour tester les composants UI ultra-modernes
 */
export default function ModernUIShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom' },
    { key: 'status', label: 'Statut', render: (val) => <Badge variant={val === 'actif' ? 'success' : 'warning'}>{val}</Badge> },
    { key: 'revenue', label: 'Revenus' },
  ];

  const tableData = [
    { id: 1, name: 'Parking A', status: 'actif', revenue: '5,234 MAD' },
    { id: 2, name: 'Parking B', status: 'actif', revenue: '3,891 MAD' },
    { id: 3, name: 'Parking C', status: 'inactif', revenue: '1,234 MAD' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
      <h1 style={{ marginBottom: '8px' }}>Composants UI Modernes SaaS</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>
        Découvrez tous les composants ultra-modernes disponibles
      </p>

      {/* STAT CARDS */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Cartes Statistiques</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <StatCard
            icon="📊"
            label="Places Occupées"
            value="284"
            trend="12"
            trendPositive={true}
            color="primary"
          />
          <StatCard
            icon="🚗"
            label="Places Disponibles"
            value="516"
            trend="8"
            trendPositive={false}
            color="success"
          />
          <StatCard
            icon="💰"
            label="Revenus Aujourd'hui"
            value="12,543 MAD"
            trend="23"
            trendPositive={true}
            color="warning"
          />
          <StatCard
            icon="👥"
            label="Nouveaux Utilisateurs"
            value="89"
            trend="5"
            trendPositive={true}
            color="info"
          />
        </div>
      </section>

      {/* BADGES */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Badges</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Badge variant="primary">Principal</Badge>
          <Badge variant="success">Succès</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Attention</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="primary" size="sm">Petit</Badge>
          <Badge variant="success" size="lg">Grand</Badge>
        </div>
      </section>

      {/* BUTTONS */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Boutons</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary">Principal</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="success">Succès</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Fantôme</Button>
          <Button variant="primary" size="sm">Petit</Button>
          <Button variant="primary" size="lg">Grand</Button>
          <Button variant="primary" loading={loading}>
            {loading ? 'Chargement...' : 'Chargement'}
          </Button>
          <Button variant="primary" disabled>Désactivé</Button>
        </div>
      </section>

      {/* ALERTS */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Alertes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Alert type="success">Votre parking a été créé avec succès!</Alert>
          <Alert type="danger">Une erreur s'est produite lors du traitement.</Alert>
          <Alert type="warning">Attention: Vous avez peu de places disponibles.</Alert>
          <Alert type="info">Nouveau: Système de QR code activé!</Alert>
          <Alert type="success" dismissible>Message à fermer</Alert>
        </div>
      </section>

      {/* INPUTS */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Champs de Saisie</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <label>Normal</label>
            <Input placeholder="Entrez quelque chose..." />
          </div>
          <div>
            <label>Avec erreur</label>
            <Input placeholder="Email invalide" error="L'email n'est pas valide" />
          </div>
          <div>
            <label>Password</label>
            <Input type="password" placeholder="Mot de passe" />
          </div>
        </div>
      </section>

      {/* PROGRESS */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Barres de Progression</h2>
        <Progress value={30} label="Chargement 30%" color="primary" />
        <Progress value={65} label="Traitement 65%" color="success" />
        <Progress value={90} label="Presque terminé 90%" color="warning" />
      </section>

      {/* TABLE */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Tableau</h2>
        <Table columns={tableColumns} data={tableData} />
      </section>

      {/* MODAL BUTTON & EXAMPLE */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Modal</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Ouvrir Modal
        </Button>

        <Modal
          isOpen={showModal}
          title="Exemple de Modal"
          onClose={() => setShowModal(false)}
          size="md"
          actions={
            <>
              <Button variant="ghost" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button variant="primary" onClick={() => setShowModal(false)}>Confirmer</Button>
            </>
          }
        >
          <p>Ceci est un exemple de modal moderne SaaS avec tous les éléments.</p>
          <Input placeholder="Exemple d'input dans modal" />
        </Modal>
      </section>

      {/* CARDS */}
      <section>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Cartes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <Card hover>
            <h3>Carte Interactive</h3>
            <p style={{ color: '#64748b' }}>Survolez-moi pour voir l'effet</p>
            <Badge variant="primary">Premium</Badge>
          </Card>
          <Card>
            <h3>Carte Simple</h3>
            <p style={{ color: '#64748b' }}>Une simple carte de contenu</p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <Button variant="primary" size="sm">Éditer</Button>
              <Button variant="danger" size="sm">Supprimer</Button>
            </div>
          </Card>
          <Card hover>
            <h3>Carte avec Stats</h3>
            <p style={{ fontSize: '32px', fontWeight: '700', margin: '16px 0 0 0', color: '#2563eb' }}>256</p>
            <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>Transactions ce mois</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
