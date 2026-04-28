import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import useValidation from '../../components/custom/useValidation'
import Spinner from '../../components/layouts/Spinner'
import { loginUserApi } from '../../config/api'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../../redux/slices/userSlice'
import './auth.css'

export default function Login() {
    const { isLoggedIn } = useSelector(state => state.user) 
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const [validationErrors, setValidationErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if(isLoggedIn) {
            // Small delay to ensure state is fully committed
            const timer = setTimeout(() => {
                navigate('/')
            }, 0)
            return () => clearTimeout(timer)
        }
    }, [isLoggedIn, navigate])

    const loginUser = async (e) => {
        e.preventDefault()
        setValidationErrors(null)
        setLoading(true)
        try {
            const data = await loginUserApi(user)
            
            // Vérifier que c'est un utilisateur normal (pas admin)
            if (data.user.role === 'admin') {
                toast.error('Accès refusé. Veuillez utiliser la page admin.')
                setLoading(false)
                return
            }
            
            // Update Redux state with user data - useEffect will handle navigation
            dispatch(setCredentials({user: data.user, token: data.access_token}))
        } catch (error) {
            if(error?.response?.status === 422) {
                setValidationErrors(error.response.data.errors)
            }
            console.log(error)
        }finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-background">
            <div className="auth-container">
                {/* Header */}
                <div className="auth-header">
                    <h2 className="auth-title">Connexion Utilisateur</h2>
                    <p className="auth-subtitle">
                        Connectez-vous pour réserver votre place
                    </p>
                </div>

                {/* Form */}
                <div className="auth-form-container">
                    <form onSubmit={(e) => loginUser(e)}>
                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-input"
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                                placeholder="votre@email.com"
                                required
                            />
                            {useValidation(validationErrors, 'email')}
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label">Mot de passe</label>
                            <input 
                                type="password" 
                                className="form-input"
                                value={user.password}
                                onChange={(e) => setUser({...user, password: e.target.value})}
                                placeholder="••••••••"
                                required
                            />
                            {useValidation(validationErrors, 'password')}
                        </div>

                        {/* Submit Button */}
                        {loading ? (
                            <div className="auth-loading">
                                <Spinner />
                            </div>
                        ) : (
                            <button 
                                type="submit"
                                className="auth-submit-btn"
                            >
                                Se connecter
                            </button>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="auth-footer">
                    <p>
                        Pas de compte ? <NavLink to="/register">S'inscrire ici</NavLink>
                    </p>
                </div>
            </div>
        </div>
    )
}
