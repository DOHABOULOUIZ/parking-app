import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import useValidation from '../../components/custom/useValidation'
import Spinner from '../../components/layouts/Spinner'
import { registerUserApi } from '../../config/api'
import { useSelector } from 'react-redux'
import './auth.css'

export default function Register() {
    const { isLoggedIn } = useSelector(state => state.user) 
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [validationErrors, setValidationErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if(isLoggedIn) navigate('/')
    }, [isLoggedIn, navigate])

    const registerNewUser = async (e) => {
        e.preventDefault()
        setValidationErrors(null)
        setLoading(true)
        try {
            const data = await registerUserApi(user)
            toast.success(data.message)
            navigate('/login')
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
                    <h2 className="auth-title">Créer un compte</h2>
                    <p className="auth-subtitle">
                        S'inscrire pour accéder à la plateforme de stationnement
                    </p>
                </div>

                {/* Form */}
                <div className="auth-form-container">
                    <form onSubmit={(e) => registerNewUser(e)}>
                        {/* Name */}
                        <div className="form-group">
                            <label className="form-label">Nom complet</label>
                            <input 
                                type="text" 
                                className="form-input"
                                value={user.name}
                                onChange={(e) => setUser({...user, name: e.target.value})}
                                placeholder="Jean Dupont"
                                required
                            />
                            {useValidation(validationErrors, 'name')}
                        </div>

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
                                S'inscrire
                            </button>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="auth-footer">
                    <p>
                        Vous avez déjà un compte ? <NavLink to="/login">Se connecter</NavLink>
                    </p>
                </div>
            </div>
        </div>
    )
}
