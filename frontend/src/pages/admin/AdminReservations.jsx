import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAdminReservationsApi, cancelAdminReservationApi, approveAdminReservationApi, rejectAdminReservationApi, deleteAllReservationsApi } from '../../config/api';
import { toast } from 'react-toastify';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const { token } = useSelector(state => state.user);
  const pageSize = 10;

  useEffect(() => {
    if (!token) return;
    fetchReservations();
  }, [token]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await getAdminReservationsApi(token);
      // Handle both paginated and non-paginated responses
      const reservationsData = response.data || [];
      setReservations(Array.isArray(reservationsData) ? reservationsData : []);
      setError(null);
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error('Erreur chargement réservations:', err);
        setError('Erreur lors du chargement des réservations');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = filterStatus
    ? reservations.filter(res => res.status === filterStatus)
    : reservations;

  const totalReservations = reservations.length;
  const totalFiltered = filteredReservations.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedReservations = filteredReservations.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        await cancelAdminReservationApi(reservationId, token);
        toast.success('Réservation annulée');
        fetchReservations();
      } catch (err) {
        toast.error('Erreur lors de l\'annulation');
        console.error(err);
      }
    }
  };

  const handleApproveReservation = async (reservationId) => {
    try {
      await approveAdminReservationApi(reservationId, token);
      toast.success('Réservation approuvée');
      fetchReservations();
    } catch (err) {
      toast.error('Erreur lors de l\'approbation');
      console.error(err);
    }
  };

  const handleRejectReservation = async (reservationId) => {
    const reason = window.prompt('Raison du rejet:');
    if (reason === null) return; // User cancelled

    if (reason.trim() === '') {
      toast.error('Veuillez fournir une raison');
      return;
    }

    try {
      await rejectAdminReservationApi(reservationId, reason, token);
      toast.success('Réservation rejetée');
      fetchReservations();
    } catch (err) {
      toast.error('Erreur lors du rejet');
      console.error(err);
    }
  };

  const handleDeleteAllReservations = async () => {
    if (!window.confirm('⚠️ Êtes-vous ABSOLUMENT sûr de vouloir supprimer TOUTES les réservations ? Cette action est irréversible !')) {
      return;
    }

    if (!window.confirm('⚠️ Dernière confirmation : toutes les réservations seront supprimées et toutes les places seront libérées. Continuer ?')) {
      return;
    }

    try {
      await deleteAllReservationsApi(token);
      toast.success('✅ Toutes les réservations ont été supprimées');
      fetchReservations();
    } catch (err) {
      toast.error('❌ Erreur lors de la suppression');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container-professional">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading"></div>
          <p style={{ marginTop: '1rem', color: 'var(--color-text-light)' }}>Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'reserved': return 'badge-warning';
      case 'parked': return 'badge-info';
      case 'finished': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-gray';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'reserved': return 'Réservée';
      case 'parked': return 'En cours';
      case 'finished': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getGlobalStatus = (res) => {
    // Priorité: Rejetée > Payée > Status actuel > Approbation
    if (res.rejection_reason) return 'Rejetée';
    if (res.paid) return 'Payée';
    if (res.status === 'cancelled') return 'Annulée';
    if (res.status === 'finished') return 'Terminée';
    if (res.status === 'parked') return 'En cours';
    if (res.status === 'reserved' && res.is_approved) return 'Approuvée';
    if (res.status === 'reserved' && !res.is_approved) return 'En attente';
    return 'Inconnu';
  };

  const getGlobalStatusBadgeColor = (res) => {
    if (res.rejection_reason) return 'badge-danger';
    if (res.paid) return 'badge-success';
    if (res.status === 'cancelled') return 'badge-danger';
    if (res.status === 'finished') return 'badge-success';
    if (res.status === 'parked') return 'badge-info';
    if (res.status === 'reserved' && res.is_approved) return 'badge-success';
    if (res.status === 'reserved' && !res.is_approved) return 'badge-warning';
    return 'badge-gray';
  };

  const reservedCount = reservations.filter(r => r.status === 'reserved').length;
  const parkedCount = reservations.filter(r => r.status === 'parked').length;
  const finishedCount = reservations.filter(r => r.status === 'finished').length;
  const cancelledCount = reservations.filter(r => r.status === 'cancelled').length;
  const pendingApprovalCount = reservations.filter(r => !r.is_approved && r.status === 'reserved').length;

  return (
    <div className="dashboard-container admin-modern-page admin-reservations-page">
      {/* Header */}
      <div className="dashboard-welcome">
        <div>
          <h1 className="dashboard-title">Gestion des Réservations</h1>
          <p className="dashboard-subtitle">
            {filterStatus
              ? `${totalFiltered} sur ${totalReservations} ${totalFiltered > 1 ? 'réservations' : 'réservation'} pour le statut ${getStatusLabel(filterStatus)}`
              : `${totalReservations} réservation${totalReservations !== 1 ? 's' : ''} au total`}
          </p>
        </div>
        <button 
          className="btn-modern btn-danger"
          onClick={handleDeleteAllReservations}
          title="Supprimer toutes les réservations"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
          Supprimer toutes
        </button>
      </div>

      {/* Alert pour approbations en attente */}
      {pendingApprovalCount > 0 && (
        <div className="alert-modern alert-warning" style={{ marginBottom: '2rem' }}>
          <div className="alert-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="alert-content">
            <h3 className="alert-title">
              {pendingApprovalCount} réservation{pendingApprovalCount > 1 ? 's' : ''} en attente d'approbation
            </h3>
            <p className="alert-text">
              Réservations <strong>orange</strong> en attente : vérifiez place et secteur avant approbation.
            </p>
          </div>
          <div className="alert-badge">
            {pendingApprovalCount}
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="alert-modern alert-danger" style={{ marginBottom: '1.5rem' }}>
          <div className="alert-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <div className="alert-content">
            <strong>Erreur</strong>
            <p style={{ margin: '0.25rem 0 0 0' }}>{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid-modern">
        {/* Total */}
        <div className="stat-card-modern" style={{ '--stat-color': '#64748b' }}>
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <circle cx="8" cy="14" r="1"/>
              <circle cx="12" cy="14" r="1"/>
              <circle cx="16" cy="14" r="1"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-label">Total</p>
            <h3 className="stat-card-value">{totalReservations}</h3>
            <p className="stat-card-description">Toutes réservations</p>
          </div>
        </div>

        {/* En attente */}
        <div className="stat-card-modern" style={{ '--stat-color': '#f59e0b', boxShadow: pendingApprovalCount > 0 ? '0 8px 24px rgba(245, 158, 11, 0.25)' : undefined }}>
          <div className="stat-card-icon" style={{ background: pendingApprovalCount > 0 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-label">En attente</p>
            <h3 className="stat-card-value" style={{ color: pendingApprovalCount > 0 ? '#f59e0b' : undefined }}>{pendingApprovalCount}</h3>
            <p className="stat-card-description" style={{ color: pendingApprovalCount > 0 ? '#d97706' : undefined, fontWeight: pendingApprovalCount > 0 ? '600' : undefined }}>
              {pendingApprovalCount > 0 ? 'Nécessite approbation !' : 'Aucune en attente'}
            </p>
          </div>
          {pendingApprovalCount > 0 && (
            <div className="stat-card-badge" style={{ background: '#f59e0b' }}>!</div>
          )}
        </div>

        {/* Réservées */}
        <div className="stat-card-modern" style={{ '--stat-color': '#eab308' }}>
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              <circle cx="12" cy="16" r="1"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-label">Réservées</p>
            <h3 className="stat-card-value">{reservedCount}</h3>
            <p className="stat-card-description">Places réservées</p>
          </div>
        </div>

        {/* En cours */}
        <div className="stat-card-modern" style={{ '--stat-color': '#3b82f6' }}>
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="22" height="14" rx="2" ry="2"/>
              <path d="M16 21h4a1 1 0 0 0 1-1v-1"/>
              <path d="M8 21H4a1 1 0 0 1-1-1v-1"/>
              <circle cx="7" cy="14" r="1"/>
              <circle cx="17" cy="14" r="1"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-label">En cours</p>
            <h3 className="stat-card-value">{parkedCount}</h3>
            <p className="stat-card-description">Stationnements actifs</p>
          </div>
        </div>

        {/* Terminées */}
        <div className="stat-card-modern" style={{ '--stat-color': '#10b981' }}>
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-label">Terminées</p>
            <h3 className="stat-card-value">{finishedCount}</h3>
            <p className="stat-card-description">Stationnements complétés</p>
          </div>
        </div>

        {/* Annulées */}
        <div className="stat-card-modern" style={{ '--stat-color': '#ef4444' }}>
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-label">Annulées</p>
            <h3 className="stat-card-value">{cancelledCount}</h3>
            <p className="stat-card-description">Réservations annulées</p>
          </div>
        </div>
      </div>

      {/* Table des réservations */}
      <div className="table-card-modern">
        <div className="table-card-header">
          <h3 className="table-card-title">Liste des réservations</h3>
          <select 
            value={filterStatus} 
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="status-select-inline"
          >
            <option value="">Tous les statuts</option>
            <option value="reserved">Réservées</option>
            <option value="parked">En cours</option>
            <option value="finished">Terminées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="empty-state-modern">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3>Aucune réservation trouvée</h3>
            <p>Il n'y a actuellement aucune réservation{filterStatus ? ` avec le statut ${getStatusLabel(filterStatus)}` : ''}</p>
          </div>
        ) : (
          <div className="table-wrapper-modern">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Utilisateur</th>
                  <th>Place</th>
                  <th>Début</th>
                  <th>Fin</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReservations.map(res => (
                  <tr key={res.id} className={!res.is_approved && res.status === 'reserved' ? 'reservation-row-pending' : ''}>
                    <td>
                      <span className="reservation-id">#{res.id}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {res.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span style={{ fontWeight: '500' }}>{res.user?.name || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="place-cell">
                        <div className="place-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="22" height="14" rx="2" ry="2"/>
                            <path d="M16 21h4a1 1 0 0 0 1-1v-1"/>
                            <path d="M8 21H4a1 1 0 0 1-1-1v-1"/>
                            <circle cx="7" cy="14" r="1"/>
                            <circle cx="17" cy="14" r="1"/>
                          </svg>
                        </div>
                        <div className="place-info">
                          <div className="place-number">{res.place?.number || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span style={{ fontSize: '0.875rem' }}>
                          {new Date(res.start_time).toLocaleString('fr-FR', { 
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      {res.end_time 
                        ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            <span style={{ fontSize: '0.875rem' }}>
                              {new Date(res.end_time).toLocaleString('fr-FR', { 
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )
                        : <span className="role-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>En cours</span>
                      }
                    </td>
                    <td>
                      <span className="role-badge" style={{ background: '#dcfce7', color: '#166534', fontWeight: '600' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        {parseFloat(res.amount || 0).toFixed(2)} MAD
                      </span>
                    </td>
                    <td>
                      <span className={`role-badge ${getGlobalStatusBadgeColor(res)}`}>
                        {getGlobalStatus(res)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {!res.is_approved ? (
                          <>
                            <button 
                              onClick={() => handleApproveReservation(res.id)}
                              className="action-btn action-btn-success"
                              title="Approuver cette réservation"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleRejectReservation(res.id)}
                              className="action-btn action-btn-danger"
                              title="Rejeter cette réservation"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                              </svg>
                            </button>
                          </>
                        ) : (
                          (res.status === 'reserved' || res.status === 'parked') && (
                            <button 
                              onClick={() => handleCancelReservation(res.id)}
                              className="action-btn action-btn-danger"
                              title="Annuler cette réservation"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                              </svg>
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-modern">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          title="Page précédente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Précédent
        </button>
        <span className="pagination-info">
          Page {page} / {totalPages}
        </span>
        <button
          className="pagination-btn"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          title="Page suivante"
        >
          Suivant
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
