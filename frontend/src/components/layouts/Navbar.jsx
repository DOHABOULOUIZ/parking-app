import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { getLoggedInUserApi, logoutUserApi } from '../../config/api'
import { logout, setCredentials } from '../../redux/slices/userSlice'
import { persistor } from '../../redux/store'
import { toast } from 'react-toastify'

export default function Navbar() {
    const { user, token, isLoggedIn } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const getLoggedInUser = async () => {
            try {
                const data = await getLoggedInUserApi(token)
                dispatch(setCredentials({ user: data.user, token: data.access_token }))
            } catch (error) {
                if (error?.response?.status === 401) dispatch(logout())
            }
        }
        if (token) getLoggedInUser()
    }, [token, dispatch])

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

    return (
        <nav className="user-navbar">
            {/* Brand */}
            <NavLink to="/" className="brand">
                <img src="/logo.png" alt="ParkApp" className="brand-logo-img" />
                ParkApp
            </NavLink>

            {/* Links */}
            <ul className="nav-links">
                <li>
                    <NavLink to="/">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Accueil
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profile">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {user?.name}
                    </NavLink>
                </li>
                {user?.role === 'admin' && (
                    <li>
                        <NavLink to="/admin/dashboard" style={{ background: '#eff6ff', color: '#1e40af', fontWeight: 600 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                            Admin
                        </NavLink>
                    </li>
                )}
                <li>
                    <button 
                        onClick={logoutUser}
                        className="logout-btn-simple"
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            padding: '10px 16px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'background 0.2s',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Déconnexion
                    </button>
                </li>
            </ul>
        </nav>
    )
}

