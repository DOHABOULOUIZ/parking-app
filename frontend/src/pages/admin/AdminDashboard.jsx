import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAdminDashboardApi } from '../../config/api';
import { NavLink } from 'react-router';

const quickLinks = [
    { 
        to: '/admin/users', 
        label: 'Utilisateurs',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        color: '#3b82f6'
    },
    { 
        to: '/admin/places', 
        label: 'Places',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="22" height="14" rx="2" ry="2"/>
                <path d="M16 21h4a1 1 0 0 0 1-1v-1"/>
                <path d="M8 21H4a1 1 0 0 1-1-1v-1"/>
                <circle cx="7" cy="14" r="1"/>
                <circle cx="17" cy="14" r="1"/>
            </svg>
        ),
        color: '#f59e0b'
    },
    { 
        to: '/admin/sectors', 
        label: 'Secteurs',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
        ),
        color: '#8b5cf6'
    },
    { 
        to: '/admin/reservations', 
        label: 'Réservations',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
        ),
        color: '#ef4444'
    },
    { 
        to: '/admin/tasks', 
        label: 'Tâches',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
        ),
        color: '#10b981'
    },
    { 
        to: '/admin/qr-scanner', 
        label: 'Scanner QR',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" ry="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1" ry="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1" ry="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>
            </svg>
        ),
        color: '#06b6d4'
    },
]

export default function AdminDashboard() {
    const [stats, setStats]     = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState(null)
    const { token }             = useSelector(state => state.user)

    useEffect(() => { 
        if (!token) return // Évite les appels si pas de token
        fetchDashboardStats() 
    }, [token])

    const fetchDashboardStats = async () => {
        try {
            setLoading(true)
            const response = await getAdminDashboardApi(token)
            setStats(response.data)
            setError(null)
        } catch (err) {
            // Ignore l'erreur si on est déconnecté
            if (err?.response?.status !== 401) {
                setError('Impossible de charger les statistiques. Vérifiez que le serveur est démarré.')
                console.error(err)
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container-professional">
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--color-text-light)' }}>Chargement du tableau de bord...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container-professional">
                <div className="alert-professional alert-danger" style={{ marginBottom: '1.5rem' }}>
                    <strong>Erreur</strong>
                    <p style={{ margin: '0.25rem 0 0 0' }}>{error}</p>
                </div>
            </div>
        )
    }

    if (!stats) return null

    return (
        <div className="dashboard-container">
            {/* Welcome Section */}
            <div className="dashboard-welcome">
                <div>
                    <h1 className="dashboard-title">Tableau de Bord</h1>
                    <p className="dashboard-subtitle">Bienvenue sur votre système de gestion de parking</p>
                </div>
                <div className="dashboard-welcome-date">
                    {new Date().toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid-modern">
                {/* Users Card */}
                <div className="stat-card-modern" style={{ '--stat-color': '#3b82f6' }}>
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <div className="stat-card-content">
                        <p className="stat-card-label">Utilisateurs</p>
                        <h3 className="stat-card-value">{stats.users.total}</h3>
                        <div className="stat-card-details">
                            <span className="stat-detail-item">
                                <span className="stat-detail-dot" style={{ background: '#3b82f6' }}></span>
                                {stats.users.admins} admin(s)
                            </span>
                            <span className="stat-detail-item">
                                <span className="stat-detail-dot" style={{ background: '#60a5fa' }}></span>
                                {stats.users.users} users
                            </span>
                        </div>
                    </div>
                </div>

                {/* Places Card */}
                <div className="stat-card-modern" style={{ '--stat-color': '#f59e0b' }}>
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="22" height="14" rx="2" ry="2"/>
                            <path d="M16 21h4a1 1 0 0 0 1-1v-1"/>
                            <path d="M8 21H4a1 1 0 0 1-1-1v-1"/>
                            <circle cx="7" cy="14" r="1"/>
                            <circle cx="17" cy="14" r="1"/>
                        </svg>
                    </div>
                    <div className="stat-card-content">
                        <p className="stat-card-label">Places de Parking</p>
                        <h3 className="stat-card-value">{stats.places.total}</h3>
                        <div className="stat-card-badges">
                            <span className="mini-badge success">{stats.places.available} libres</span>
                            <span className="mini-badge danger">{stats.places.occupied} occupées</span>
                            <span className="mini-badge warning">{stats.places.reserved} réservées</span>
                        </div>
                    </div>
                    <div className="stat-card-progress">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ 
                                    width: `${(stats.places.occupied / stats.places.total) * 100}%`,
                                    background: '#f59e0b'
                                }}
                            ></div>
                        </div>
                        <p className="progress-label">
                            {Math.round((stats.places.occupied / stats.places.total) * 100)}% occupées
                        </p>
                    </div>
                </div>

                {/* Sectors Card */}
                <div className="stat-card-modern" style={{ '--stat-color': '#8b5cf6' }}>
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                    </div>
                    <div className="stat-card-content">
                        <p className="stat-card-label">Secteurs</p>
                        <h3 className="stat-card-value">{stats.sectors.total}</h3>
                        <p className="stat-card-description">Zones de stationnement</p>
                    </div>
                </div>

                {/* Reservations Card */}
                <div className="stat-card-modern" style={{ '--stat-color': '#ef4444' }}>
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </div>
                    <div className="stat-card-content">
                        <p className="stat-card-label">Réservations</p>
                        <h3 className="stat-card-value">{stats.reservations.total}</h3>
                        <div className="stat-card-badges">
                            <span className="mini-badge info">{stats.reservations.ongoing} en cours</span>
                            <span className="mini-badge success">{stats.reservations.completed} terminées</span>
                        </div>
                    </div>
                </div>

                {/* Revenue Card */}
                <div className="stat-card-modern stat-card-featured" style={{ '--stat-color': '#10b981' }}>
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div className="stat-card-content">
                        <p className="stat-card-label">Revenus Totaux</p>
                        <h3 className="stat-card-value">{parseFloat(stats.revenue.total || 0).toFixed(2)} MAD</h3>
                        <div className="stat-card-details">
                            <span className="stat-detail-item">
                                <span className="stat-detail-dot" style={{ background: '#fbbf24' }}></span>
                                En attente: {parseFloat(stats.revenue.pending || 0).toFixed(2)} MAD
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">Accès Rapide</h2>
                    <p className="section-subtitle">Actions et raccourcis fréquents</p>
                </div>
                <div className="quick-actions-grid">
                    {quickLinks.map(link => (
                        <NavLink 
                            key={link.to}
                            to={link.to}
                            className="quick-action-card"
                            style={{ '--action-color': link.color }}
                        >
                            <div className="quick-action-icon">
                                {link.icon}
                            </div>
                            <span className="quick-action-label">{link.label}</span>
                            <svg className="quick-action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* QR Scanner Highlight */}
            <div className="dashboard-highlight">
                <div className="highlight-content">
                    <div className="highlight-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" ry="1"/>
                            <rect x="14" y="3" width="7" height="7" rx="1" ry="1"/>
                            <rect x="14" y="14" width="7" height="7" rx="1" ry="1"/>
                            <rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>
                        </svg>
                    </div>
                    <div className="highlight-text">
                        <h3 className="highlight-title">Scanner QR Code</h3>
                        <p className="highlight-description">
                            Effectuez rapidement le check-in/check-out des réservations en scannant les codes QR
                        </p>
                    </div>
                </div>
                <NavLink to="/admin/qr-scanner" className="highlight-button">
                    <span>Ouvrir le Scanner</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                    </svg>
                </NavLink>
            </div>
        </div>
    )
}
