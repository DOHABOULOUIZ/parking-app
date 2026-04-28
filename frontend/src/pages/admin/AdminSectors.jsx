import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createApiClient } from '../../config/api';
import { toast } from 'react-toastify';

export default function AdminSectors() {
  const { token } = useSelector(state => state.user);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSector, setEditSector] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '' });

  useEffect(() => { fetchSectors(); }, []);

  const fetchSectors = async () => {
    try {
      setLoading(true);
      const api = createApiClient(token);
      const response = await api.get('/admin/sectors');
      setSectors(response.data.data || response.data || []);
    } catch (e) {
      toast.error('Erreur lors du chargement des secteurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = createApiClient(token);
      if (editSector) {
        await api.put(`/admin/sectors/${editSector.id}`, form);
        toast.success('Secteur mis à jour');
      } else {
        await api.post('/admin/sectors', form);
        toast.success('Secteur créé');
      }
      setShowForm(false);
      setEditSector(null);
      setForm({ name: '', description: '', price: '' });
      fetchSectors();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (sector) => {
    setEditSector(sector);
    setForm({ name: sector.name, description: sector.description || '', price: sector.price || '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce secteur ? Les places associées seront désaffectées.')) return;
    try {
      const api = createApiClient(token);
      await api.delete(`/admin/sectors/${id}`);
      toast.success('Secteur supprimé');
      fetchSectors();
    } catch (e) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const averagePrice = sectors.length
    ? (sectors.reduce((acc, sector) => acc + parseFloat(sector.price || 0), 0) / sectors.length).toFixed(2)
    : '0.00';

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div className="spinner-modern" style={{ margin: '0 auto 1.5rem' }}></div>
          <p style={{ color: '#64748b' }}>Chargement des secteurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container admin-sectors-page">
      <div className="dashboard-welcome">
        <div>
          <h1 className="dashboard-title">Gestion des Secteurs</h1>
          <p className="dashboard-subtitle">Organisez votre parking en secteurs avec tarifs et capacité claire.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditSector(null); setForm({ name: '', description: '', price: '' }); }}
          className="btn-modern btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {showForm ? 'Fermer' : 'Nouveau secteur'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid-modern" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Secteurs', value: sectors.length, color: '#8b5cf6', icon: '🗂️', description: 'Secteurs actifs' },
          { label: 'Places totales', value: sectors.reduce((a, s) => a + (s.places_count || 0), 0), color: '#3b82f6', icon: '🚗', description: 'Places gérées' },
          { label: 'Prix moyen (DH/h)', value: averagePrice, color: '#10b981', icon: '💰', description: 'Tarif moyen' },
        ].map((stat, i) => (
          <div key={i} className="stat-card-modern" style={{ '--stat-color': stat.color }}>
            <div className="stat-card-icon" style={{ background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}55)` }}>
              <span>{stat.icon}</span>
            </div>
            <div className="stat-card-content">
              <p className="stat-card-label">{stat.label}</p>
              <h2 className="stat-card-value">{stat.value}</h2>
              <p className="stat-card-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="form-card-modern" style={{ marginBottom: '1.5rem' }}>
          <div className="form-card-header">
            <h3 className="form-card-title">{editSector ? 'Modifier le secteur' : 'Nouveau secteur'}</h3>
            <button className="btn-icon-close" onClick={() => setShowForm(false)}>✕</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-card-body">
              <div className="form-row-modern">
                <div className="form-field-modern">
                  <label className="form-label-modern">Nom du secteur <span className="required-star">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Secteur A" className="form-input-modern" required />
                </div>
                <div className="form-field-modern">
                  <label className="form-label-modern">Prix (DH/h)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="Ex: 5.00" className="form-input-modern" min="0" step="0.01" />
                </div>
              </div>
              <div className="form-field-modern">
                <label className="form-label-modern">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Description optionnelle du secteur..." className="form-input-modern" rows="3" />
              </div>
            </div>
            <div className="form-card-footer">
              <button type="button" className="btn-modern btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              <button type="submit" className="btn-modern btn-primary">{editSector ? 'Mettre à jour' : 'Créer le secteur'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="table-card-modern">
        <div className="table-card-header">
          <div>
            <h3 className="table-card-title">Liste des Secteurs</h3>
            <p className="table-card-subtitle">Suivez les tarifs, la description et le nombre de places par secteur.</p>
          </div>
          <span className="badge-count">{sectors.length}</span>
        </div>
        {sectors.length > 0 ? (
          <div className="table-wrapper-modern">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Prix (DH/h)</th>
                  <th>Places</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map(sector => (
                  <tr key={sector.id}>
                    <td>
                      <div className="sector-cell">
                        <div className="sector-avatar">
                          {sector.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div>
                          <div className="sector-name">{sector.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="sector-description">{sector.description || '—'}</td>
                    <td>
                      {sector.price ? <span className="price-badge">{sector.price} DH</span> : <span className="text-muted">—</span>}
                    </td>
                    <td>
                      <span className="count-badge">{sector.places_count || 0}</span>
                    </td>
                    <td className="text-right">
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(sector)} className="action-btn action-btn-primary" title="Modifier">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(sector.id)} className="action-btn action-btn-danger" title="Supprimer">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-modern">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
            </div>
            <h3>Aucun secteur créé</h3>
            <p>Commencez par créer votre premier secteur de stationnement</p>
          </div>
        )}
      </div>
    </div>
  );
}
