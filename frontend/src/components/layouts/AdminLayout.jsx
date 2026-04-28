import React, { useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserApi } from '../../config/api'
import { logout } from '../../redux/slices/userSlice'
import { persistor } from '../../redux/store'
import { toast } from 'react-toastify'

const navItems = [
    {
        to: '/admin/dashboard',
        label: 'Dashboard',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
        )
    },
    {
        to: '/admin/users',
        label: 'Utilisateurs',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        )
    },
    {
        to: '/admin/places',
        label: 'Places',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="22" height="14" rx="2"/>
                <path d="M16 21h4a1 1 0 0 0 1-1v-1"/><path d="M8 21H4a1 1 0 0 1-1-1v-1"/>
                <circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/>
            </svg>
        )
    },
    {
        to: '/admin/sectors',
        label: 'Secteurs',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
        )
    },
    {
        to: '/admin/reservations',
        label: 'Réservations',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
        )
    },
    {
        to: '/admin/tasks',
        label: 'Tâches',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
        )
    },
    {
        to: '/admin/qr-scanner',
        label: 'Scanner QR',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h6v6H4z" />
                <path d="M14 4h6v6h-6z" />
                <path d="M14 14h6v6h-6z" />
                <path d="M4 14h6v6H4z" />
                <path d="M9 9h6m0 6h-6" strokeLinecap="round" />
            </svg>
        )
    },
    {
        to: '/admin/statistics',
        label: 'Statistiques',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 17h3V10H4z" />
                <path d="M10.5 17h3V7h-3z" />
                <path d="M17 17h3V13h-3z" />
                <path d="M4 21h16" strokeLinecap="round" />
            </svg>
        )
    },
]

const pageTitles = {
    '/admin/dashboard':    'Dashboard',
    '/admin/users':        'Gestion des Utilisateurs',
    '/admin/places':       'Gestion des Places',
    '/admin/sectors':      'Gestion des Secteurs',
    '/admin/reservations': 'Gestion des Réservations',
    '/admin/tasks':        'Gestion des Tâches',
    '/admin/qr-scanner':   'Scanner QR Code',
    '/admin/statistics':   'Statistiques',
}

export default function AdminLayout({ children }) {
    const { user, token, isLoggedIn } = useSelector(state => state.user)
    const dispatch  = useDispatch()
    const navigate  = useNavigate()
    const location  = useLocation()

    const logoutUser = async () => {
        // Clear Redux state and localStorage immediately
        dispatch(logout())
        persistor.purge() // Clear persisted state
        navigate('/login') // Navigate immediately
        
        // Make API call in background (fire and forget)
        try {
            const data = await logoutUserApi(token)
            toast.success(data.message)
        } catch (error) {
            console.log('Logout API error (unexpected):', error)
        }
    }

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'A'

    const pageTitle = pageTitles[location.pathname] || 'Admin'

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-logo">
                        <img src="/logo.png" alt="ParkApp Logo" />
                    </div>
                    <div className="brand-text">
                        <h1>ParkApp Admin</h1>
                        <p>Panneau d'administration</p>
                    </div>
                </div>

                <nav className="sidebar-navigation">
                    <div className="nav-section">
                        <span className="nav-section-title">Navigation</span>
                    </div>
                    {navItems.map(item => (
                        <NavLink key={item.to} to={item.to} end={item.to === '/admin/dashboard'} className="nav-link">
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}

                    <div className="nav-divider"></div>
                    <div className="nav-section">
                        <span className="nav-section-title">Utilisateur</span>
                    </div>
                    <NavLink to="/" className="nav-link">
                        <span className="nav-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            </svg>
                        </span>
                        <span className="nav-label">Vue utilisateur</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button 
                        className="logout-btn"
                        onClick={logoutUser}

                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="admin-main">
                <div className="admin-topbar">
                    <div className="topbar-title">
                        <h2>{pageTitle}</h2>
                        <p>Vue globale du back-office du parking</p>
                    </div>
                    <div className="topbar-user">
                        <span>{user?.name}</span>
                        <div className="avatar">{initials}</div>
                    </div>
                </div>
                <div className="admin-content">
                    {children}
                </div>
            </div>
        </div>
    )
}
