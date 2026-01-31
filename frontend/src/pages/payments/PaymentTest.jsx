import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { checkPaymentSuccessApi, getReservationDetailsApi } from '../../config/api'
import { toast } from 'react-toastify'
import Spinner from '../../components/layouts/Spinner'

export default function PaymentTest() {
    const { reservationId } = useParams()
    const navigate = useNavigate()
    const { token, user } = useSelector(state => state.user)
    const [processing, setProcessing] = useState(false)
    const [reservation, setReservation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
    const [expiryDate, setExpiryDate] = useState('12/26')
    const [cvc, setCvc] = useState('123')
    const [name, setName] = useState('')

    React.useEffect(() => {
        const fetchReservation = async () => {
            try {
                const data = await getReservationDetailsApi(reservationId, token)
                setReservation(data.data)
                setLoading(false)
            } catch (error) {
                toast.error('Failed to fetch reservation')
                setLoading(false)
            }
        }
        fetchReservation()
    }, [reservationId, token])

    const handlePayment = async (e) => {
        e.preventDefault()
        setProcessing(true)
        
        try {
            // Simulate payment with test data
            const sessionId = `test_session_${reservationId}_${Date.now()}`
            
            const data = await checkPaymentSuccessApi({
                session_id: sessionId,
                reservation_id: reservationId,
                user_id: user.id
            }, token)

            if (data.message) {
                toast.success(data.message)
                setTimeout(() => {
                    navigate('/pay/success/?session_id=' + sessionId + '&reservation=' + reservationId)
                }, 1500)
            } else {
                toast.error(data.error || 'Payment failed')
            }
        } catch (error) {
            toast.error('Payment error')
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <div style={{ backgroundColor: '#F6F8FB', minHeight: '100vh', padding: '40px 20px' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5">
                        {/* Left side - Order Summary */}
                        <div className="mb-4 mb-lg-0">
                            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>TEST MODE</span>
                                </div>

                                <hr style={{ margin: '20px 0', borderColor: '#e5e7eb' }} />

                                {reservation && (
                                    <>
                                        <div style={{ marginBottom: '16px' }}>
                                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Reservation Place</p>
                                            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>
                                                {reservation.place?.place_number} - {reservation.place?.sector?.name}
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Price per hour</p>
                                            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>
                                                ${reservation.place?.sector?.price}
                                            </p>
                                        </div>
                                    </>
                                )}

                                <hr style={{ margin: '20px 0', borderColor: '#e5e7eb' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Amount to Pay</span>
                                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                                        ${reservation?.amount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        {/* Right side - Payment Form */}
                        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1f2937' }}>
                                Payment Details
                            </h3>

                            <form onSubmit={handlePayment}>
                                {/* Email */}
                                <div className="mb-3">
                                    <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px', color: '#374151' }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="you@example.com"
                                        defaultValue={user?.email}
                                        style={{ borderColor: '#d1d5db', padding: '10px 12px', fontSize: '14px' }}
                                        disabled
                                    />
                                </div>

                                {/* Cardholder Name */}
                                <div className="mb-3">
                                    <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px', color: '#374151' }}>
                                        Cardholder name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Full name on card"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        style={{ borderColor: '#d1d5db', padding: '10px 12px', fontSize: '14px' }}
                                    />
                                </div>

                                {/* Card Number */}
                                <div className="mb-3">
                                    <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px', color: '#374151' }}>
                                        Card information
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="4242 4242 4242 4242"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        style={{ borderColor: '#d1d5db', padding: '10px 12px', fontSize: '14px', marginBottom: '8px' }}
                                        disabled
                                    />

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="MM / YY"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                            style={{ borderColor: '#d1d5db', padding: '10px 12px', fontSize: '14px' }}
                                            disabled
                                        />
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="CVC"
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value)}
                                            style={{ borderColor: '#d1d5db', padding: '10px 12px', fontSize: '14px' }}
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* Country */}
                                <div className="mb-4">
                                    <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px', color: '#374151' }}>
                                        Country or region
                                    </label>
                                    <select
                                        className="form-control"
                                        defaultValue="US"
                                        style={{ borderColor: '#d1d5db', padding: '10px 12px', fontSize: '14px' }}
                                    >
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="FR">France</option>
                                        <option value="DE">Germany</option>
                                    </select>
                                </div>

                                {/* Test Notice */}
                                <div style={{
                                    backgroundColor: '#F3E8FF',
                                    border: '1px solid #E9D5FF',
                                    borderRadius: '6px',
                                    padding: '12px',
                                    marginBottom: '16px',
                                    fontSize: '13px',
                                    color: '#6B21A8'
                                }}>
                                    <strong>Test Card:</strong> Use 4242 4242 4242 4242 with any future expiry and CVC
                                </div>

                                {/* Pay Button */}
                                <button
                                    type="submit"
                                    disabled={processing || !name}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: processing ? '#9CA3AF' : '#059669',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: processing || !name ? 'not-allowed' : 'pointer',
                                        transition: 'background-color 0.3s'
                                    }}
                                    onMouseEnter={(e) => !processing && !name ? null : e.target.style.backgroundColor = '#047857'}
                                    onMouseLeave={(e) => !processing && !name ? null : e.target.style.backgroundColor = '#059669'}
                                >
                                    {processing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay $${reservation?.amount}`
                                    )}
                                </button>

                                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/')}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: 'transparent',
                                            color: '#059669',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
