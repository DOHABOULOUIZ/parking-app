import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

export default function PaymentModal({ show, reservation, onClose }) {
    const navigate = useNavigate()
    const [processing, setProcessing] = useState(false)

    const handlePaymentClick = () => {
        console.log('Reservation object:', reservation)
        if (reservation?.id) {
            navigate(`/pay/${reservation.id}`)
        } else {
            toast.error('Reservation ID not found')
            console.log('Available reservation data:', reservation)
        }
    }

    if (!show || !reservation) return null

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content custom-card">
                    <div className="modal-header border-0">
                        <h5 className="modal-title">Complete Payment</h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={onClose}
                            disabled={processing}
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
                    <div className="modal-footer border-0">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Close
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary"
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
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
