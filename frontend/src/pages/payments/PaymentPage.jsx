import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { getReservationDetailsApi, createPaymentSessionApi } from '../../config/api'
import Spinner from '../../components/layouts/Spinner'
import { toast } from 'react-toastify'

export default function PaymentPage() {
    const { reservationId } = useParams()
    const navigate = useNavigate()
    const { token } = useSelector(state => state.user)
    const [reservation, setReservation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                console.log('Fetching reservation with ID:', reservationId)
                const data = await getReservationDetailsApi(reservationId, token)
                console.log('Reservation data received:', data)
                setReservation(data.data)
                setLoading(false)
            } catch (error) {
                toast.error('Failed to fetch reservation details')
                console.log('Error fetching reservation:', error)
                setLoading(false)
            }
        }
        fetchReservation()
    }, [reservationId, token])

    const handlePayment = async () => {
        setProcessing(true)
        try {
            console.log('Creating payment session for reservation:', reservationId)
            const data = await createPaymentSessionApi(reservationId, token)
            console.log('Payment session response:', data)
            
            if (data.payment_url) {
                console.log('Redirecting to:', data.payment_url)
                window.location.href = data.payment_url
            } else {
                toast.error('Failed to create payment session')
                console.log('No payment_url in response:', data)
            }
        } catch (error) {
            toast.error('Payment error. Please try again.')
            console.log('Payment error:', error)
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="custom-card p-4">
                        <h2 className="mb-4 text-center">Complete Payment</h2>
                        
                        {reservation && (
                            <>
                                <div className="mb-4 p-3 bg-light rounded">
                                    <h5>Reservation Details</h5>
                                    <hr />
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <p className="mb-1">
                                                <strong>Place:</strong> {reservation.place?.place_number}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Sector:</strong> {reservation.place?.sector?.name}
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <p className="mb-1">
                                                <strong>Price/Hour:</strong> ${reservation.place?.sector?.price}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Status:</strong> <span className="badge bg-warning">{reservation.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4 p-3 border-3 border-top">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">Amount to Pay</h5>
                                        <h4 className="mb-0 text-success">
                                            ${reservation.amount}
                                        </h4>
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button 
                                        className="btn btn-primary btn-lg"
                                        onClick={handlePayment}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-credit-card me-2"></i>
                                                Pay Now
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/')}
                                        disabled={processing}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Home
                                    </button>
                                </div>

                                <p className="text-muted text-center mt-4 small">
                                    You will be redirected to our secure payment gateway
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
