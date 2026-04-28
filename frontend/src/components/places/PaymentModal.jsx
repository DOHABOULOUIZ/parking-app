import React, { useState } from 'react'
import Button from '../custom/Button'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

export default function PaymentModal({ show, reservation, onClose }) {
    const navigate = useNavigate()
    const [processing, setProcessing] = useState(false)

    const handlePaymentClick = () => {
        console.log('Reservation object:', reservation)
        if (reservation?.id) {
            setProcessing(true)
            // Close modal and navigate
            onClose()
            // Give modal time to close before navigating
            setTimeout(() => {
                navigate(`/pay/${reservation.id}`)
            }, 100)
        } else {
            toast.error('ID de réservation introuvable')
            console.log('Available reservation data:', reservation)
        }
    }

    if (!show || !reservation) return null

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content custom-card">
                    <div className="modal-header border-0" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h5 className="modal-title">Complete Payment</h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={onClose}
                            disabled={processing}
                            style={{ cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.6 : 1 }}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="alert alert-info mb-3">
                            <i className="bi bi-info-circle me-2"></i>
                            <strong>Parking ended!</strong> Complete your payment to finish the reservation.
                        </div>

                        <div className="p-3 bg-light rounded mb-3">
                            <p className="mb-2">
                                <strong>Place:</strong> {reservation.place?.place_number}
                            </p>
                            <p className="mb-2">
                                <strong>Sector:</strong> {reservation.place?.sector?.name}
                            </p>
                            <p className="mb-0">
                                <strong>Price/Hour:</strong> ${reservation.place?.sector?.price}
                            </p>
                        </div>

                        <div className="p-3 border-top">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">Amount to Pay:</h6>
                                <h5 className="mb-0 text-success">${reservation.amount}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0" style={{ display: 'flex', gap: '0.75rem' }}>
                        <Button 
                            variant="secondary"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Close
                        </Button>
                        <Button 
                            variant="primary"
                            onClick={handlePaymentClick}
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
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
