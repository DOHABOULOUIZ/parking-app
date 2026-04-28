import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import Button from '../../components/custom/Button'
import { checkPaymentSuccessApi, getReservationDetailsApi } from '../../config/api'
import Spinner from '../../components/layouts/Spinner'
import './SuccessPage.css'

export default function Success() {
    const { token, user } = useSelector(state => state.user)
    const location = useLocation()
    const navigate = useNavigate()
    const [status, setStatus] = useState('processing')
    const [message, setMessage] = useState('Traitement du paiement en cours...')
    const [isLoading, setIsLoading] = useState(true)
    const [reservation, setReservation] = useState(null)
    const [countdown, setCountdown] = useState(4)

    useEffect(() => {
        const processPayment = async () => {
            try {
                const params = new URLSearchParams(location.search)
                const sessionId = params.get('session_id')
                const reservationId = params.get('reservation')

                console.log('Processing payment with sessionId:', sessionId, 'reservationId:', reservationId)

                if (!sessionId || !reservationId) {
                    setIsLoading(false)
                    setStatus('error')
                    setMessage('Paramètres manquants. Veuillez réessayer.')
                    return
                }

                const data = await checkPaymentSuccessApi({
                    session_id: sessionId,
                    reservation_id: reservationId
                }, token)

                console.log('Payment response:', data)

                // Fetch reservation details
                if (reservationId && token) {
                    try {
                        const resData = await getReservationDetailsApi(reservationId, token)
                        if (resData?.data) {
                            setReservation(resData.data)
                        }
                    } catch (err) {
                        console.error('Error fetching reservation:', err)
                    }
                }

                setIsLoading(false)

                if(data.error) {
                    setStatus('error')
                    setMessage(data.error)
                }else {
                    setStatus('success')
                    setMessage(data.message || 'Le paiement a été effectué avec succès.')
                }

            } catch (error) {
                console.error('Payment processing error:', error)
                setIsLoading(false)
                setStatus('error')
                setMessage("Erreur lors de la vérification du paiement. Veuillez réessayer plus tard.")
            }
        }
        processPayment()
    }, [location.search, token])

    // Auto-redirect after success
    useEffect(() => {
        if (status === 'success' && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (status === 'success' && countdown === 0) {
            console.log('Redirecting to home...')
            // Force redirect to home
            window.location.href = '/'
        }
    }, [status, countdown])

    const getIcon = () => {
        if (status === 'success') return '✅'
        if (status === 'error') return '❌'
        return '⏳'
    }

    const getTitle = () => {
        if (status === 'success') return 'Paiement Réussi !'
        if (status === 'error') return 'Erreur de Paiement'
        return 'Traitement en Cours'
    }

    return (
        <div className="success-page">
            <div className="success-container">
                {isLoading ? (
                    <div className="loading-state">
                        <Spinner />
                        <h4 style={{ marginTop: '2rem', color: '#666' }}>{message}</h4>
                    </div>
                ) : (
                    <div className={`success-card ${status}`}>
                        <div className={`icon-container ${status}`}>
                            <span className="icon">{getIcon()}</span>
                        </div>

                        <h1 className="title">{getTitle()}</h1>
                        <p className="message">{message}</p>

                        {status === 'success' && reservation && (
                            <div className="reservation-details">
                                <h3>Détails de votre réservation</h3>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="label">Emplacement</span>
                                        <span className="value">🅿️ {reservation?.place?.place_number || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Secteur</span>
                                        <span className="value">🏢 {reservation?.place?.sector?.name || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Montant payé</span>
                                        <span className="value amount">💰 ${reservation?.amount?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Statut</span>
                                        <span className="value">✓ Payé</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="auto-redirect-info">
                                <p>Redirection automatique vers l'accueil dans <strong>{countdown}s</strong>...</p>
                            </div>
                        )}

                        <div className="button-group">
                            {status === 'success' && (
                                <>
                                    <Button
                                        variant="primary"
                                        onClick={() => window.location.href = '/'}
                                        className="btn-large"
                                    >
                                        🏠 Retour à l'accueil
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => window.location.href = '/profile'}
                                        className="btn-large"
                                    >
                                        👤 Voir mes réservations
                                    </Button>
                                </>
                            )}
                            {status === 'error' && (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={() => window.location.href = '/'}
                                        className="btn-large"
                                    >
                                        🏠 Retour à l'accueil
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => window.location.href = '/profile'}
                                        className="btn-large"
                                    >
                                        👤 Mes réservations
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

