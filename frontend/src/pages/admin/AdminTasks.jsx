import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createApiClient } from '../../config/api';
import { toast } from 'react-toastify';

const PRIORITY_STYLES = {
  low:    { bg: '#dcfce7', color: '#166534', label: 'Basse' },
  medium: { bg: '#fef3c7', color: '#92400e', label: 'Moyenne' },
  high:   { bg: '#fee2e2', color: '#991b1b', label: 'Haute' },
};

const STATUS_STYLES = {
  pending:     { bg: '#f1f5f9', color: '#475569', label: 'En attente' },
  in_progress: { bg: '#dbeafe', color: '#1e40af', label: 'En cours' },
  completed:   { bg: '#dcfce7', color: '#166534', label: 'Terminée' },
  cancelled:   { bg: '#fce7f3', color: '#9d174d', label: 'Annulée' },
};

export default function AdminTasks() {
  const { token } = useSelector(state => state.user);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'pending', due_date: '' });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const api = createApiClient(token);
      const response = await api.get('/admin/tasks');
      setTasks(response.data.data || response.data || []);
    } catch (e) {
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = createApiClient(token);
      if (editTask) {
        await api.put(`/admin/tasks/${editTask.id}`, form);
        toast.success('Tâche mise à jour');
      } else {
        await api.post('/admin/tasks', form);
        toast.success('Tâche créée');
      }
      setShowForm(false);
      setEditTask(null);
      setForm({ title: '', description: '', priority: 'medium', status: 'pending', due_date: '' });
      fetchTasks();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title, description: task.description || '',
      priority: task.priority || 'medium', status: task.status || 'pending',
      due_date: task.due_date ? task.due_date.substring(0, 10) : ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette tâche ?')) return;
    try {
      const api = createApiClient(token);
      await api.delete(`/admin/tasks/${id}`);
      toast.success('Tâche supprimée');
      fetchTasks();
    } catch (e) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const api = createApiClient(token);
      await api.put(`/admin/tasks/${id}`, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (e) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const filtered = tasks.filter(t => {
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchPriority = !priorityFilter || t.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div className="spinner-modern" style={{ margin: '0 auto 1.5rem' }}></div>
          <p style={{ color: '#64748b' }}>Chargement des tâches...</p>
        </div>
      </div>
    );
  }

  const countByStatus = (s) => tasks.filter(t => t.status === s).length;

  return (
    <div className="dashboard-container admin-modern-page admin-tasks-page">
      <div className="dashboard-welcome">
        <div>
          <h1 className="dashboard-title">Gestion des Tâches</h1>
          <p className="dashboard-subtitle">Planifiez et suivez les tâches de maintenance</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditTask(null); setForm({ title: '', description: '', priority: 'medium', status: 'pending', due_date: '' }); }}
          className="btn-modern btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {showForm ? 'Fermer' : 'Nouvelle tâche'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid-modern" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total', value: tasks.length, color: '#3b82f6' },
          { label: 'En cours', value: countByStatus('in_progress'), color: '#3b82f6' },
          { label: 'En attente', value: countByStatus('pending'), color: '#f59e0b' },
          { label: 'Terminées', value: countByStatus('completed'), color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="stat-card-modern" style={{ '--stat-color': s.color }}>
            <p className="stat-card-label">{s.label}</p>
            <h2 className="stat-card-value">{s.value}</h2>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="form-card-modern" style={{ marginBottom: '1.5rem' }}>
          <div className="form-card-header">
            <h3 className="form-card-title">{editTask ? 'Modifier la tâche' : 'Nouvelle tâche'}</h3>
            <button className="btn-icon-close" onClick={() => setShowForm(false)}>✕</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-card-body">
              <div className="form-field-modern">
                <label className="form-label-modern">Titre <span className="required-star">*</span></label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Titre de la tâche..." className="form-input-modern" required />
              </div>
              <div className="form-row-modern">
                <div className="form-field-modern">
                  <label className="form-label-modern">Priorité</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="form-input-modern">
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
                <div className="form-field-modern">
                  <label className="form-label-modern">Statut</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="form-input-modern">
                    <option value="pending">En attente</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </div>
                <div className="form-field-modern">
                  <label className="form-label-modern">Date limite</label>
                  <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="form-input-modern" />
                </div>
              </div>
              <div className="form-field-modern">
                <label className="form-label-modern">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Description de la tâche..." className="form-input-modern" rows="3" />
              </div>
            </div>
            <div className="form-card-footer">
              <button type="button" className="btn-modern btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              <button type="submit" className="btn-modern btn-primary">{editTask ? 'Mettre à jour' : 'Créer la tâche'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="form-card-modern" style={{ marginBottom: '1.5rem' }}>
        <div className="form-card-body">
          <div className="form-row-modern">
            <div className="form-field-modern">
              <label className="form-label-modern">Statut</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input-modern">
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
            <div className="form-field-modern">
              <label className="form-label-modern">Priorité</label>
              <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="form-input-modern">
                <option value="">Toutes les priorités</option>
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card-modern">
        <div className="table-card-header">
          <h3 className="table-card-title">Liste des Tâches</h3>
          <span className="badge-count">{filtered.length}</span>
        </div>
        {filtered.length > 0 ? (
          <div className="table-wrapper-modern">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>Date limite</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => {
                  const pr = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
                  const st = STATUS_STYLES[task.status] || STATUS_STYLES.pending;
                  return (
                    <tr key={task.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{task.title}</div>
                          {task.description && <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: 2 }}>{task.description.substring(0, 60)}{task.description.length > 60 ? '...' : ''}</div>}
                        </div>
                      </td>
                      <td>
                        <span style={{ background: pr.bg, color: pr.color, borderRadius: '6px', padding: '3px 10px', fontWeight: 600, fontSize: '0.8125rem' }}>
                          {pr.label}
                        </span>
                      </td>
                      <td>
                        <select value={task.status} onChange={e => handleStatusChange(task.id, e.target.value)}
                          style={{ background: st.bg, color: st.color, border: 'none', borderRadius: '6px',
                            padding: '4px 8px', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>
                          <option value="pending">En attente</option>
                          <option value="in_progress">En cours</option>
                          <option value="completed">Terminée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {task.due_date ? new Date(task.due_date).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="text-right">
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleEdit(task)} className="action-btn action-btn-primary" title="Modifier">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(task.id)} className="action-btn action-btn-danger" title="Supprimer">
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
        ) : (
          <div className="empty-state-modern">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h3>Aucune tâche trouvée</h3>
            <p>Créez votre première tâche de maintenance</p>
          </div>
        )}
      </div>
    </div>
  );
}
