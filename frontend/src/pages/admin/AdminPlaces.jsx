import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createApiClient, getAdminSectorsApi } from '../../config/api';
import { toast } from 'react-toastify';

const STATUS_COLORS = {
  available: { bg: '#dcfce7', color: '#166534', label: 'Libre' },
  occupied:  { bg: '#dbeafe', color: '#1e40af', label: 'Occupée' },
  reserved:  { bg: '#fef3c7', color: '#92400e', label: 'Réservée' },
  maintenance: { bg: '#f1f5f9', color: '#475569', label: 'Maintenance' },
};

export default function AdminPlaces() {
  const { token } = useSelector(state => state.user);
  const [places, setPlaces] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPlace, setEditPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [form, setForm] = useState({ place_number: '', status: 'available', sector_id: '' });

  useEffect(() => {
    fetchPlaces();
    fetchSectors();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const api = createApiClient(token);
      const response = await api.get('/admin/places');
      setPlaces(response.data.data || []);
    } catch (e) {
      toast.error('Erreur lors du chargement des places');
    } finally {
      setLoading(false);
    }
  };

  const fetchSectors = async () => {
    try {
      const res = await getAdminSectorsApi(token);
      setSectors(res.data || []);
    } catch (e) { /* ignore */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = createApiClient(token);
      if (editPlace) {
        await api.put(`/admin/places/${editPlace.id}`, form);
        toast.success('Place mise à jour');
      } else {
        await api.post('/admin/places', form);
        toast.success('Place créée');
      }
      setShowForm(false);
      setEditPlace(null);
      setForm({ place_number: '', status: 'available', sector_id: '' });
      fetchPlaces();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (place) => {
    setEditPlace(place);
    setForm({ place_number: place.place_number, status: place.status, sector_id: place.sector_id || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette place ?')) return;
    try {
      const api = createApiClient(token);
      await api.delete(`/admin/places/${id}`);
      toast.success('Place supprimée');
      fetchPlaces();
    } catch (e) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const api = createApiClient(token);
      await api.put(`/admin/places/${id}`, { status: newStatus });
      setPlaces(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (e) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const filtered = places.filter(p => {
    const matchSearch = p.place_number?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedPlaces = filtered.slice(startIdx, startIdx + itemsPerPage);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div className="spinner-modern" style={{ margin: '0 auto 1.5rem' }}></div>
          <p style={{ color: '#64748b' }}>Chargement des places...</p>
        </div>
      </div>
    );
  }

  const countByStatus = (s) => places.filter(p => p.status === s).length;

  return (
    <div className="dashboard-container admin-modern-page">
      <div className="dashboard-welcome">
        <div>
          <h1 className="dashboard-title">Gestion des Places</h1>
          <p className="dashboard-subtitle">Gérez les places de stationnement et suivez leur statut en temps réel.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditPlace(null); setForm({ place_number: '', status: 'available', sector_id: '' }); }}
          className="btn-modern btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {showForm ? 'Fermer' : 'Ajouter une place'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid-modern" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total', value: places.length, color: '#3b82f6', icon: '📊', description: 'Places enregistrées' },
          { label: 'Libres', value: countByStatus('available'), color: '#10b981', icon: '🟢', description: 'Places disponibles' },
          { label: 'Occupées', value: countByStatus('occupied'), color: '#3b82f6', icon: '🔵', description: 'Places occupées' },
          { label: 'Réservées', value: countByStatus('reserved'), color: '#f59e0b', icon: '🟡', description: 'Places réservées' },
        ].map((s, i) => (
          <div key={i} className="stat-card-modern" style={{ '--stat-color': s.color }}>
            <div className="stat-card-icon" style={{ background: `linear-gradient(135deg, ${s.color}20, ${s.color}40)` }}>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            </div>
            <div className="stat-card-content">
              <p className="stat-card-label">{s.label}</p>
              <h2 className="stat-card-value">{s.value}</h2>
              <p className="stat-card-description">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="form-card-modern">
          <div className="form-card-header">
            <div>
              <h3 className="form-card-title">{editPlace ? 'Modifier la place' : 'Nouvelle place'}</h3>
            </div>
            <button className="btn-icon-close" onClick={() => setShowForm(false)}>✕</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-card-body">
              <div className="form-row-modern">
                <div className="form-field-modern">
                  <label className="form-label-modern">Numéro de place <span className="required-star">*</span></label>
                  <input type="text" value={form.place_number} onChange={e => setForm({ ...form, place_number: e.target.value })}
                    placeholder="Ex: A-01" className="form-input-modern" required />
                </div>
                <div className="form-field-modern">
                  <label className="form-label-modern">Statut</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="form-input-modern">
                    <option value="available">Libre</option>
                    <option value="occupied">Occupée</option>
                    <option value="reserved">Réservée</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="form-field-modern">
                  <label className="form-label-modern">Secteur</label>
                  <select value={form.sector_id} onChange={e => setForm({ ...form, sector_id: e.target.value })} className="form-input-modern">
                    <option value="">Sans secteur</option>
                    {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-card-footer">
              <button type="button" className="btn-modern btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              <button type="submit" className="btn-modern btn-primary">{editPlace ? 'Mettre à jour' : 'Créer la place'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="form-card-modern" style={{ marginBottom: '1.5rem' }}>
        <div className="form-card-body">
          <div className="form-row-modern">
            <div className="form-field-modern">
              <label className="form-label-modern">Rechercher</label>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Numéro de place..." className="form-input-modern" />
            </div>
            <div className="form-field-modern">
              <label className="form-label-modern">Filtrer par statut</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input-modern">
                <option value="">Tous les statuts</option>
                <option value="available">Libre</option>
                <option value="occupied">Occupée</option>
                <option value="reserved">Réservée</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card-modern">
        <div className="table-card-header">
          <div>
            <h3 className="table-card-title">Liste des Places</h3>
            <p className="table-card-subtitle">Gestion rapide des statuts et actions sur les places de stationnement.</p>
          </div>
          <span className="badge-count">{filtered.length}</span>
        </div>
        {filtered.length > 0 ? (
          <>
            <div className="table-wrapper-modern">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>Secteur</th>
                    <th>Statut</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPlaces.map(place => {
                    const st = STATUS_COLORS[place.status] || STATUS_COLORS.available;
                    return (
                      <tr key={place.id}>
                        <td>
                          <div className="place-cell">
                            <div className="place-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                              <span style={{ fontSize: '1rem', fontWeight: '700' }}>🅿️</span>
                            </div>
                            <div className="place-info">
                              <div className="place-number">#{place.place_number}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {place.sector ? (
                            <span className="sector-badge">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                              </svg>
                              {place.sector.name}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>—</span>
                          )}
                        </td>
                        <td>
                          <select value={place.status} onChange={e => handleStatusChange(place.id, e.target.value)}
                            className="status-select-inline"
                            style={{
                              background: st.bg,
                              color: st.color,
                              borderColor: `${st.color}40`
                            }}>
                            <option value="available">Libre</option>
                            <option value="occupied">Occupée</option>
                            <option value="reserved">Réservée</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </td>
                        <td className="text-right">
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleEdit(place)} className="action-btn action-btn-primary" title="Modifier">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button onClick={() => handleDelete(place.id)} className="action-btn action-btn-danger" title="Supprimer">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1.5rem',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc'
              }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                    color: currentPage === 1 ? '#94a3b8' : '#475569',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                >
                  ← Précédent
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: currentPage === page ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: currentPage === page ? '#eff6ff' : '#ffffff',
                      color: currentPage === page ? '#1e40af' : '#475569',
                      cursor: 'pointer',
                      fontWeight: currentPage === page ? 700 : 600,
                      fontSize: '0.8125rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                    color: currentPage === totalPages ? '#94a3b8' : '#475569',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Suivant →
                </button>
                
                <span style={{
                  marginLeft: '1rem',
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  Page {currentPage} sur {totalPages}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state-modern">
            <div className="empty-state-icon" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="3" width="22" height="14" rx="2"/>
                <circle cx="9" cy="9" r="1"/>
                <path d="M1 15l2-2 2 2"/>
                <path d="M13 5l2 2-2 2"/>
                <path d="M21 15l-2-2 2-2"/>
              </svg>
            </div>
            <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Aucune place trouvée</h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              {searchTerm || statusFilter ? 'Aucune place ne correspond à vos critères de recherche.' : 'Commencez par ajouter votre première place de stationnement.'}
            </p>
            {(!searchTerm && !statusFilter) && (
              <button onClick={() => setShowForm(true)} className="btn-modern btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Ajouter une place
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
