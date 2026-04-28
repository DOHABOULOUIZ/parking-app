import React, { useState } from 'react';

/**
 * InteractiveStatesDemo
 * 
 * Démontre tous les états interactifs disponibles:
 * - Hover effects
 * - Active effects
 * - Focus states
 * - Disabled states
 * - Validation states
 */
export default function InteractiveStatesDemo() {
  const [email, setEmail] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [alertOpen, setAlertOpen] = useState(true);

  const isEmailValid = email.includes('@') && email.length > 5;

  const demoData = [
    { id: 1, name: 'Alice Dupont', email: 'alice@example.com', reservations: 12 },
    { id: 2, name: 'Bob Martin', email: 'bob@example.com', reservations: 8 },
    { id: 3, name: 'Charlie Lemoine', email: 'charlie@example.com', reservations: 15 },
  ];

  return (
    <div className="container-professional" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ marginBottom: '3rem' }}>
        <h1>🎯 Démo des États Interactifs</h1>
        <p style={{ color: 'var(--color-text-light)' }}>
          Explorez tous les effets hover, active, focus et autres états interactifs
        </p>
      </div>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 1: BUTTONS */}
      {/* ═══════════════════════════════════ */}
      <div className="card-professional" style={{ marginBottom: '3rem' }}>
        <div className="card-professional-header">
          <h2 style={{ margin: 0 }}>1️⃣ États des Boutons</h2>
        </div>
        <div className="card-professional-body">
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
            Survolez et cliquez les boutons pour voir les effets hover, active et ripple
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <button className="btn-professional btn-primary">
              Primaire
            </button>
            <button className="btn-professional btn-secondary">
              Secondaire
            </button>
            <button className="btn-professional btn-success">
              Succès
            </button>
            <button className="btn-professional btn-danger">
              Danger
            </button>
            <button className="btn-professional btn-secondary" disabled>
              Désactivé
            </button>
            <button className="btn-professional btn-primary" style={{ fontSize: '18px' }}>
              Grand
            </button>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0 }}>✨ Effets Visibles</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>Hover:</strong> Remontée (-2px) + ombre augmentée</li>
              <li><strong>Active:</strong> Enfoncement + ripple effect blanc</li>
              <li><strong>Focus:</strong> Outline bleu au clavier</li>
              <li><strong>Disabled:</strong> Opacité 0.6 + curseur not-allowed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 2: INPUTS & VALIDATION */}
      {/* ═══════════════════════════════════ */}
      <div className="card-professional" style={{ marginBottom: '3rem' }}>
        <div className="card-professional-header">
          <h2 style={{ margin: 0 }}>2️⃣ États des Inputs</h2>
        </div>
        <div className="card-professional-body">
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
            Testez les états normal, hover, focus, error et success
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email (Validation en temps réel)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={email === '' ? '' : isEmailValid ? 'success' : 'error'}
                placeholder="Entrez votre email..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  transition: 'all 250ms'
                }}
              />
              <small style={{ 
                display: 'block', 
                marginTop: '0.5rem',
                color: email === '' ? '#64748b' : isEmailValid ? '#10b981' : '#ef4444'
              }}>
                {email === '' ? 'Vide' : isEmailValid ? '✓ Email valide' : '✗ Email invalide'}
              </small>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Champ désactivé</label>
              <input
                type="text"
                disabled
                placeholder="Je suis désactivé..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0 }}>✨ Effets Visibles</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>Hover:</strong> Bordure grise foncée + bg léger</li>
              <li><strong>Focus:</strong> Bordure bleue + halo bleu 0.1</li>
              <li><strong>Success:</strong> Bordure verte + bg vert clair</li>
              <li><strong>Error:</strong> Bordure rouge + bg rouge clair</li>
              <li><strong>Disabled:</strong> Opacité 0.6 + not-allowed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 3: CARDS */}
      {/* ═══════════════════════════════════ */}
      <div className="card-professional" style={{ marginBottom: '3rem' }}>
        <div className="card-professional-header">
          <h2 style={{ margin: 0 }}>3️⃣ États des Cartes</h2>
        </div>
        <div className="card-professional-body">
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
            Survolez les cartes pour voir les effets
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card-professional" style={{ cursor: 'pointer' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Carte Normale</h3>
              <p style={{ color: 'var(--color-text-light)', margin: '0' }}>
                Survolez pour voir l'effet hover
              </p>
            </div>

            <div className="card-professional stat-card stat-card-success" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Succès</p>
                  <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem' }}>+42%</h3>
                </div>
                <div style={{ fontSize: '2rem' }}>✓</div>
              </div>
            </div>

            <div className="card-professional stat-card stat-card-danger" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Erreur</p>
                  <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem' }}>-5%</h3>
                </div>
                <div style={{ fontSize: '2rem' }}>✕</div>
              </div>
            </div>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0 }}>✨ Effets Visibles</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>Hover:</strong> Bordure bleue + ombre augmentée + translateY(-4px)</li>
              <li><strong>Stat Card Hover:</strong> Ombre maximale + bordure élargie</li>
              <li><strong>Transition:</strong> 250ms cubic-bezier smooth</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 4: BADGES */}
      {/* ═══════════════════════════════════ */}
      <div className="card-professional" style={{ marginBottom: '3rem' }}>
        <div className="card-professional-header">
          <h2 style={{ margin: 0 }}>4️⃣ États des Badges</h2>
        </div>
        <div className="card-professional-body">
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
            Cliquez sur les badges pour les sélectionner
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {['primary', 'success', 'danger', 'warning', 'info'].map(type => (
              <span
                key={type}
                className={`badge badge-${type} ${selectedBadge === type ? 'active' : ''}`}
                onClick={() => setSelectedBadge(selectedBadge === type ? null : type)}
                style={{
                  cursor: 'pointer',
                  padding: '8px 16px'
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
          </div>

          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0 }}>✨ Effets Visibles</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>Hover:</strong> Scale 1.05 + ombre ajoutée</li>
              <li><strong>Active:</strong> Outline bleu + box-shadow</li>
              <li><strong>Click:</strong> Sélectionnable avec état persistant</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 5: TABLE */}
      {/* ═══════════════════════════════════ */}
      <div className="card-professional" style={{ marginBottom: '3rem' }}>
        <div className="card-professional-header">
          <h2 style={{ margin: 0 }}>5️⃣ États de Table</h2>
        </div>
        <div className="card-professional-body">
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
            Survolez les rangées et cliquez pour les sélectionner
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
            <table className="table-professional">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th style={{ textAlign: 'center' }}>Réservations</th>
                </tr>
              </thead>
              <tbody>
                {demoData.map(row => (
                  <tr
                    key={row.id}
                    className={selectedRow === row.id ? 'selected' : ''}
                    onClick={() => setSelectedRow(selectedRow === row.id ? null : row.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td><strong>{row.name}</strong></td>
                    <td>{row.email}</td>
                    <td style={{ textAlign: 'center' }}>{row.reservations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0 }}>✨ Effets Visibles</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>Hover:</strong> Bg gris clair + outline bleu subtle</li>
              <li><strong>Selected:</strong> Bg bleu clair + bordure gauche bleue</li>
              <li><strong>Active:</strong> Bg bleu clair intensifié</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 6: NAVIGATION */}
      {/* ═══════════════════════════════════ */}
      <div className="card-professional" style={{ marginBottom: '3rem' }}>
        <div className="card-professional-header">
          <h2 style={{ margin: 0 }}>6️⃣ États de Navigation</h2>
        </div>
        <div className="card-professional-body">
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
            Navigation avec états active, hover et aria-current
          </p>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            <a href="#" className="sidebar-nav-item" aria-current="page">
              🏠 Dashboard (Active)
            </a>
            <a href="#" className="sidebar-nav-item">
              👥 Utilisateurs
            </a>
            <a href="#" className="sidebar-nav-item">
              🚗 Réservations
            </a>
            <a href="#" className="sidebar-nav-item">
              ⚙️ Paramètres
            </a>
          </nav>

          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0 }}>✨ Effets Visibles</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>Hover:</strong> Bg bleu clair + indent à droite</li>
              <li><strong>Active:</strong> Bg bleu + texte blanc + underline gauche</li>
              <li><strong>aria-current="page":</strong> Applique style active</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════ */}
      {/* SECTION 7: ALERTS */}
      {/* ═══════════════════════════════════ */}
      <div className="card-professional">
        <div className="card-professional-header">
          <h2 style={{ margin: 0 }}>7️⃣ États des Alerts</h2>
        </div>
        <div className="card-professional-body">
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
            Alerts avec animations d'apparition et de fermeture
          </p>

          {alertOpen && (
            <div 
              role="alert" 
              className="alert-professional alert-info"
              style={{ 
                marginBottom: '1.5rem',
                padding: '1rem',
                borderRadius: '8px',
                background: '#f0f9ff',
                border: '1px solid #0ea5e9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                animation: 'slideInUp 300ms ease-out'
              }}
            >
              <span>✓ Ceci est une notification avec animation smooth</span>
              <button
                onClick={() => setAlertOpen(false)}
                className="close"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#0ea5e9'
                }}
              >
                ×
              </button>
            </div>
          )}

          {!alertOpen && (
            <button
              onClick={() => setAlertOpen(true)}
              className="btn-professional btn-primary"
              style={{ marginBottom: '1.5rem' }}
            >
              Afficher l'alert
            </button>
          )}

          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0 }}>✨ Effets Visibles</h4>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>Apparition:</strong> Slide in up + bounce animation</li>
              <li><strong>Hover close btn:</strong> Rotate 90° + scale 1.2</li>
              <li><strong>Fermeture:</strong> Slide out down + fade out</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
