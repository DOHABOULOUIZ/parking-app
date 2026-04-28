import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createApiClient } from '../../config/api';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const { token } = useSelector(state => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [stats, setStats] = useState({ total: 0, admins: 0, users: 0, active: 0 });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const api = createApiClient(token);
      const response = await api.get('/admin/users');
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const api = createApiClient(token);
      const response = await api.get('/admin/users/stats');
      setStats(response.data);
    } catch (error) {
      // ignore
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const api = createApiClient(token);
      await api.put(`/admin/users/${userId}`, { role: newRole });
      toast.success('Rôle mis à jour');
      fetchUsers();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      const api = createApiClient(token);
      await api.delete(`/admin/users/${userId}`);
      toast.success('Utilisateur supprimé');
      fetchUsers();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div className="spinner-modern" style={{ margin: '0 auto 1.5rem' }}></div>
          <p style={{ color: '#64748b' }}>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container admin-modern-page">
      {/* Header */}
      <div className="dashboard-welcome">
        <div>
          <h1 className="dashboard-title">Gestion des Utilisateurs</h1>
          <p className="dashboard-subtitle">Gérez les utilisateurs et leurs permissions au sein de votre back-office.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid-modern" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total Utilisateurs', value: stats.total || users.length, color: '#3b82f6', gradient: '#3b82f6, #2563eb', description: 'Comptes actifs',
            icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
          { label: 'Administrateurs', value: stats.admins || users.filter(u => u.role === 'admin').length, color: '#8b5cf6', gradient: '#8b5cf6, #7c3aed', description: 'Accès privilégiés',
            icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></> },
          { label: 'Utilisateurs', value: stats.users || users.filter(u => u.role === 'user').length, color: '#10b981', gradient: '#10b981, #059669', description: 'Clients et employés',
            icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></> },
          { label: 'Actifs aujourd\'hui', value: stats.active || 0, color: '#f59e0b', gradient: '#f59e0b, #d97706', description: 'Connexions récentes',
            icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
        ].map((stat, i) => (
          <div key={i} className="stat-card-modern" style={{ '--stat-color': stat.color }}>
            <div className="stat-card-icon" style={{ background: `linear-gradient(135deg, ${stat.gradient})` }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {stat.icon}
              </svg>
            </div>
            <p className="stat-card-label">{stat.label}</p>
            <h2 className="stat-card-value">{stat.value}</h2>
            <p className="stat-card-description">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="form-card-modern" style={{ marginBottom: '1.5rem' }}>
        <div className="form-card-body">
          <div className="form-row-modern">
            <div className="form-field-modern">
              <label className="form-label-modern">Rechercher</label>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Nom ou email..." className="form-input-modern" />
            </div>
            <div className="form-field-modern">
              <label className="form-label-modern">Filtrer par rôle</label>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="form-input-modern">
                <option value="">Tous les rôles</option>
                <option value="admin">Administrateur</option>
                <option value="user">Utilisateur</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card-modern">
        <div className="table-card-header">
          <div>
            <h3 className="table-card-title">Liste des Utilisateurs</h3>
            <p className="table-card-subtitle">Filtrez, modifiez les rôles et gérez les accès en un seul endroit.</p>
          </div>
          <span className="badge-count">{filteredUsers.length}</span>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="table-wrapper-modern">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Inscrit le</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{user.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.875rem' }}>{user.email || 'N/A'}</td>
                    <td>
                      <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}
                        className={`role-badge ${user.role === 'admin' ? 'badge-warning' : 'badge-info'}`}
                        style={{ border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        <option value="user">Utilisateur</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.875rem' }}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="text-right">
                      <button onClick={() => handleDelete(user.id)} className="action-btn action-btn-danger" title="Supprimer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <h3>Aucun utilisateur trouvé</h3>
            <p>Aucun utilisateur ne correspond à vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}
