import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import Button from '../../components/custom/Button'
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
                    reservation_id: reservationId
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
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate('/')}
                                            style={{ minWidth: '200px' }}
                                        >
                                            <i className="bi bi-house-door me-2"></i>
                                            Retour à l'accueil
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => navigate('/profile')}
                                            style={{ minWidth: '200px' }}
                                        >
                                            <i className="bi bi-person me-2"></i>
                                            Voir le profil
                                        </Button>
                                    </div>
                                )}
                                {status === 'error' && (
                                    <Button
                                        variant="danger"
                                        onClick={() => navigate('/')}
                                        style={{ minWidth: '200px' }}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Retour à l'accueil
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
