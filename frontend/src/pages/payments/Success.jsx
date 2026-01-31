import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { checkPaymentSuccessApi } from '../../config/api'
import Spinner from '../../components/layouts/Spinner'

export default function Success() {
    const { token, user } = useSelector(state => state.user)
    const location = useLocation()
    const navigate = useNavigate()
    const [status, setStatus] = useState('processing')
    const [message, setMessage] = useState('Traitement du paiement en cours...')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const processPayment = async () => {
            try {
                const params = new URLSearchParams(location.search)
                const sessionId = params.get('session_id')
                const reservationId = params.get('reservation')

                const data = await checkPaymentSuccessApi({
                    session_id: sessionId,
                    reservation_id: reservationId,
                    user_id: user.id
                }, token)

                setIsLoading(false)

                if(data.error) {
                    setStatus('error')
                    setMessage(data.error)
                }else {
                    setStatus('success')
                    setMessage(data.message)
                }

            } catch (error) {
                setIsLoading(false)
                setStatus('error')
                setMessage("Erreur lors de la vérification du paiement. Veuillez réessayer plus tard.")
                console.log(error)
            }
        }
        processPayment()
    }, [])

    const getIcon = () => {
        if (status === 'success') return 'bi-check-circle-fill text-success'
        if (status === 'error') return 'bi-x-circle-fill text-danger'
        return 'bi-info-circle-fill text-info'
    }

    const getTitle = () => {
        if (status === 'success') return 'Paiement Réussi !'
        if (status === 'error') return 'Erreur de Paiement'
        return 'Traitement en Cours'
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="custom-card p-4 text-center">
                        {isLoading ? (
                            <div className="py-5">
                                <Spinner />
                                <h4 className="mt-3 text-muted">{message}</h4>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <i className={`bi ${getIcon()}`} style={{ fontSize: '4rem' }}></i>
                                </div>
                                <h2 className="mb-3">{getTitle()}</h2>
                                <p className="mb-4 lead">{message}</p>
                                {status === 'success' && (
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                        <button
                                            className="btn btn-primary me-md-2"
                                            onClick={() => navigate('/')}
                                        >
                                            <i className="bi bi-house-door me-2"></i>
                                            Retour à l'accueil
                                        </button>
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={() => navigate('/profile')}
                                        >
                                            <i className="bi bi-person me-2"></i>
                                            Voir le profil
                                        </button>
                                    </div>
                                )}
                                {status === 'error' && (
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={() => navigate('/')}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Retour à l'accueil
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
