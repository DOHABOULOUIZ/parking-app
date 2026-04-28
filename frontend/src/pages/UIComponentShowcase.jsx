import React, { useState } from 'react';

export default function UIComponentShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState('success');

  return (
    <div className="container-professional">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">🎨 Système UI Professionnel</h1>
        <p className="page-subtitle">Démonstration de tous les composants</p>
      </div>

      {/* Success Alert */}
      <div className="alert-professional alert-success" style={{ marginBottom: '2rem' }}>
        <strong>✅ Succès!</strong>
        <p style={{ margin: '0.25rem 0 0 0' }}>Le système UI professionnel est maintenant actif sur votre application.</p>
      </div>

      {/* Section 1: Buttons */}
      <div className="card-professional" style={{ marginBottom: '2rem' }}>
        <div className="card-professional-header">
          <h3>🔘 Boutons</h3>
        </div>
        <div className="card-professional-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <button className="btn-professional btn-primary">Primary</button>
            <button className="btn-professional btn-secondary">Secondary</button>
            <button className="btn-professional btn-success">Success</button>
            <button className="btn-professional btn-danger">Danger</button>
            <button className="btn-professional btn-warning">Warning</button>
            <button className="btn-professional btn-ghost">Ghost</button>
          </div>
          
          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Tailles</h4>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button className="btn-professional btn-primary btn-sm">Small</button>
            <button className="btn-professional btn-primary">Normal</button>
            <button className="btn-professional btn-primary btn-lg">Large</button>
            <button className="btn-professional btn-primary" disabled>Disabled</button>
          </div>
        </div>
      </div>

      {/* Section 2: Badges */}
      <div className="card-professional" style={{ marginBottom: '2rem' }}>
        <div className="card-professional-header">
          <h3>🏷️ Badges & Statuts</h3>
        </div>
        <div className="card-professional-body">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge-professional badge-success">Disponible</span>
            <span className="badge-professional badge-danger">Occupée</span>
            <span className="badge-professional badge-warning">Réservée</span>
            <span className="badge-professional badge-info">Information</span>
            <span className="badge-professional badge-primary">Admin</span>
            <span className="badge-professional badge-gray">Neutre</span>
          </div>
        </div>
      </div>

      {/* Section 3: Forms */}
      <div className="card-professional" style={{ marginBottom: '2rem' }}>
        <div className="card-professional-header">
          <h3>📝 Formulaires</h3>
        </div>
        <div className="card-professional-body">
          <form style={{ maxWidth: '500px' }}>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input 
                id="email"
                type="email"
                placeholder="exemple@mail.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sector">Sélection *</label>
              <select id="sector">
                <option value="">-- Choisissez une option --</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message"
                placeholder="Entrez votre message..."
                rows={4}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn-professional btn-primary">
                Envoyer
              </button>
              <button type="reset" className="btn-professional btn-secondary">
                Réinitialiser
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Section 4: Table */}
      <div className="card-professional" style={{ marginBottom: '2rem' }}>
        <div className="card-professional-header">
          <h3>📊 Table Professionnelle</h3>
        </div>
        <div className="card-professional-body">
          <div style={{ overflowX: 'auto' }}>
            <table className="table-professional">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td><strong>Place A-001</strong></td>
                  <td><span className="badge-professional badge-success">Disponible</span></td>
                  <td>
                    <button className="btn-professional btn-secondary btn-sm">Modifier</button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td><strong>Place A-002</strong></td>
                  <td><span className="badge-professional badge-danger">Occupée</span></td>
                  <td>
                    <button className="btn-professional btn-secondary btn-sm">Modifier</button>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td><strong>Place B-001</strong></td>
                  <td><span className="badge-professional badge-warning">Réservée</span></td>
                  <td>
                    <button className="btn-professional btn-secondary btn-sm">Modifier</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 5: Alerts */}
      <div className="card-professional" style={{ marginBottom: '2rem' }}>
        <div className="card-professional-header">
          <h3>⚠️ Alertes</h3>
        </div>
        <div className="card-professional-body" style={{ display: 'grid', gap: '1rem' }}>
          <div className="alert-professional alert-success">
            <strong>Succès!</strong>
            <p style={{ margin: '0.25rem 0 0 0' }}>L'opération a été complétée avec succès.</p>
          </div>

          <div className="alert-professional alert-danger">
            <strong>Erreur</strong>
            <p style={{ margin: '0.25rem 0 0 0' }}>Une erreur s'est produite lors du traitement.</p>
          </div>

          <div className="alert-professional alert-warning">
            <strong>Attention</strong>
            <p style={{ margin: '0.25rem 0 0 0' }}>Veuillez vérifier cette information importante.</p>
          </div>

          <div className="alert-professional alert-info">
            <strong>Information</strong>
            <p style={{ margin: '0.25rem 0 0 0' }}>Ceci est une simple notification d'information.</p>
          </div>
        </div>
      </div>

      {/* Section 6: Cards */}
      <div className="card-professional" style={{ marginBottom: '2rem' }}>
        <div className="card-professional-header">
          <h3>🃏 Cards</h3>
        </div>
        <div className="card-professional-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card-professional" style={{ border: '1px solid #e5e7eb' }}>
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Card {i}</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                    Ceci est un exemple de card réutilisable avec contenu flexible.
                  </p>
                  <button className="btn-professional btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                    Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 7: Modal Button */}
      <div className="card-professional" style={{ marginBottom: '2rem' }}>
        <div className="card-professional-header">
          <h3>🪟 Modale</h3>
        </div>
        <div className="card-professional-body">
          <button 
            className="btn-professional btn-primary"
            onClick={() => setShowModal(true)}
          >
            Ouvrir la modale
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '500px', width: '90%' }}>
            <div className="modal-header">
              <h2>Exemple de Modale</h2>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Ceci est un exemple de modale avec le système UI professionnel.</p>
              <p>Elle peut contenir du contenu complexe.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-professional btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button 
                className="btn-professional btn-primary"
                onClick={() => setShowModal(false)}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 8: Empty State */}
      <div className="card-professional" style={{ marginBottom: '2rem' }}>
        <div className="card-professional-header">
          <h3>📭 État Vide</h3>
        </div>
        <div className="empty-state">
          <h3>Aucune donnée trouvée</h3>
          <p>Commencez par créer un nouvel élément pour voir les données ici.</p>
          <button className="btn-professional btn-primary" style={{ marginTop: '1rem' }}>
            Créer un nouvel élément
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="card-professional">
        <div className="card-professional-header">
          <h3>ℹ️ Informations</h3>
        </div>
        <div className="card-professional-body">
          <h4>Caractéristiques du système:</h4>
          <ul style={{ color: '#6b7280', lineHeight: '1.8' }}>
            <li>✅ Minimaliste - Peu/pas d'icônes</li>
            <li>✅ Professionnel - Couleurs cohérentes</li>
            <li>✅ Accessible - Contrastes WCAG AA</li>
            <li>✅ Responsive - Mobile-first design</li>
            <li>✅ Performance - CSS pur, zéro overhead</li>
            <li>✅ Personnalisable - Variables CSS</li>
          </ul>
          <p style={{ marginTop: '1rem', color: '#9ca3af' }}>
            Tous les fichiers CSS se trouvent dans <code>src/styles/</code>
          </p>
        </div>
      </div>
    </div>
  );
}
