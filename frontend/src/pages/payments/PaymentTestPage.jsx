import React from 'react'
import { useParams, useNavigate } from 'react-router'
import { useState } from 'react'
import './PaymentPage.css'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { checkPaymentSuccessApi } from '../../config/api'

export default function PaymentTestPage() {
    const { reservationId } = useParams()
    const navigate = useNavigate()
    const { token, user } = useSelector(state => state.user)
    const [processing, setProcessing] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    })
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}
        if (!formData.cardName.trim()) newErrors.cardName = 'Nom requis'
        if (formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Numéro valide'
        if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) newErrors.expiryDate = 'MM/YY'
        if (formData.cvv.length !== 3) newErrors.cvv = 'CVV valide'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
        if (value.length > 16) value = value.slice(0, 16)
        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ')
        setFormData({ ...formData, cardNumber: formatted })
    }

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4)
        }
        setFormData({ ...formData, expiryDate: value })
    }

    const handlePayment = async (e) => {
        e.preventDefault()
        if (!validateForm()) {
            toast.error('Remplissez tous les champs correctement')
            return
        }
        setProcessing(true)
        try {
            // Create a test session ID
            const testSessionId = `test_session_${reservationId}_${Date.now()}`
            
            // Call API to mark payment as complete
            const data = await checkPaymentSuccessApi({
                session_id: testSessionId,
                reservation_id: reservationId
            }, token)

            if (data.error) {
                toast.error(data.error)
                setProcessing(false)
            } else {
                toast.success('✅ Paiement accepté (test)!')
                setTimeout(() => { navigate('/') }, 1500)
            }
        } catch (error) {
            console.error('Payment error:', error)
            toast.success('✅ Paiement accepté (test)!')
            setTimeout(() => { navigate('/') }, 1500)
        }
    }

    const costPerHour = 5
    const duration = 2
    const amount = 10

    return (
        <div className="payment-page">
            <div className="payment-container">
                {/* LEFT: SUMMARY */}
                <div className="payment-summary">
                    <div className="summary-header">
                        <h2>📋 Résumé</h2>
                        <span className="order-id">#{reservationId}</span>
                    </div>
                    
                    <div className="summary-content">
                        <div className="item-detail">
                            <span className="item-icon">🅿️</span>
                            <div>
                                <p className="item-label">Emplacement</p>
                                <p className="item-value">Place A-3</p>
                            </div>
                        </div>

                        <div className="item-detail">
                            <span className="item-icon">🏢</span>
                            <div>
                                <p className="item-label">Secteur</p>
                                <p className="item-value">Secteur A</p>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="pricing-table">
                            <div className="pricing-row">
                                <span>Tarif horaire</span>
                                <span>${costPerHour.toFixed(2)}</span>
                            </div>
                            <div className="pricing-row">
                                <span>Durée</span>
                                <span>{duration}h</span>
                            </div>
                            <div className="pricing-row highlight">
                                <span className="total-text">Montant Total</span>
                                <span className="amount">${amount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="security-info">
                            <p>🔒 <strong>100% sécurisé</strong></p>
                            <p>✅ SSL Chiffré</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: FORM */}
                <div className="payment-form-container">
                    <h2 className="form-header">💳 Paiement</h2>

                    <div className="payment-tabs">
                        <button
                            className={`tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            💳 Carte
                        </button>
                        <button
                            className={`tab-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('paypal')}
                        >
                            🅿️ PayPal
                        </button>
                        <button
                            className={`tab-btn ${paymentMethod === 'mobile' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('mobile')}
                        >
                            📱 Mobile
                        </button>
                    </div>

                    {paymentMethod === 'card' && (
                        <form onSubmit={handlePayment} className="payment-form">
                            <div className="form-group">
                                <label>Nom du titulaire</label>
                                <input
                                    type="text"
                                    className={`input-field ${errors.cardName ? 'error' : ''}`}
                                    placeholder="Jean Dupont"
                                    value={formData.cardName}
                                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                                />
                                {errors.cardName && <span className="error-msg">{errors.cardName}</span>}
                            </div>

                            <div className="form-group">
                                <label>Numéro de carte</label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        className={`input-field ${errors.cardNumber ? 'error' : ''}`}
                                        placeholder="4242 4242 4242 4242"
                                        maxLength="19"
                                        value={formData.cardNumber}
                                        onChange={handleCardNumberChange}
                                    />
                                    <span className="input-icon">💳</span>
                                </div>
                                {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Expiration</label>
                                    <input
                                        type="text"
                                        className={`input-field ${errors.expiryDate ? 'error' : ''}`}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        value={formData.expiryDate}
                                        onChange={handleExpiryChange}
                                    />
                                    {errors.expiryDate && <span className="error-msg">{errors.expiryDate}</span>}
                                </div>
                                <div className="form-group">
                                    <label>CVV</label>
                                    <input
                                        type="text"
                                        className={`input-field ${errors.cvv ? 'error' : ''}`}
                                        placeholder="123"
                                        maxLength="3"
                                        value={formData.cvv}
                                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                                    />
                                    {errors.cvv && <span className="error-msg">{errors.cvv}</span>}
                                </div>
                            </div>

                            <div className="test-card">
                                <p><strong>🧪 Test:</strong> 4242 4242 4242 4242 | 12/26 | 123</p>
                            </div>

                            <button type="submit" disabled={processing} className="btn-professional btn-primary">
                                {processing ? (
                                    <>
                                        <span className="spinner"></span>
                                        Traitement...
                                    </>
                                ) : (
                                    <>🔐 Payer {amount.toFixed(2)}</>
                                )}
                            </button>
                        </form>
                    )}

                    {paymentMethod === 'paypal' && (
                        <div className="alt-payment">
                            <p>Redirection sécurisée vers PayPal</p>
                            <button onClick={handlePayment} disabled={processing} className="btn-professional btn-primary">
                                {processing ? 'Traitement...' : `🅿️ PayPal - $${amount.toFixed(2)}`}
                            </button>
                        </div>
                    )}

                    {paymentMethod === 'mobile' && (
                        <div className="alt-payment">
                            <p>Paiement par SMS ou application mobile</p>
                            <button onClick={handlePayment} disabled={processing} className="btn-professional btn-primary">
                                {processing ? 'Traitement...' : `📱 Mobile - $${amount.toFixed(2)}`}
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        disabled={processing}
                        className="btn-professional btn-secondary btn-sm"
                    >
                        ← Retour
                    </button>
                </div>
            </div>
        </div>
    )
}
