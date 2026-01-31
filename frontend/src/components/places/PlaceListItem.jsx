import React, { useState } from 'react'
import { cancelReservationApi, endParkingApi, handlePlaceRequest, reservePlaceApi, startParkingApi } from '../../config/api'
import { useSelector } from 'react-redux'
import PaymentModal from './PaymentModal'

export default function PlaceListItem({places, updatePlaceInList}) {
    const { token, user } = useSelector(state => state.user) 
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [selectedReservation, setSelectedReservation] = useState(null) 

    const handlePaymentRequired = (reservation) => {
        setSelectedReservation(reservation)
        setShowPaymentModal(true)
    }

    const findReservation = (status, reservations) => {
        const reservation = reservations.find(reservation => reservation.user_id === user?.id && reservation.status === status)
        return reservation
    }

    const renderButtons = (place) => {
        const { status, reservations } = place
        switch(status) {
            case 'available':
                return (
                    <button className="btn btn-sm btn-dark"
                        onClick={() => handlePlaceRequest(() => reservePlaceApi(place.id, token), updatePlaceInList, handlePaymentRequired)}
                    >Reserve</button>
                )
            case 'reserved':
                return (
                    <>
                        <button className="btn btn-sm btn-primary"
                            onClick={() => handlePlaceRequest(() => startParkingApi(findReservation('reserved', reservations).id, token), updatePlaceInList, handlePaymentRequired)}
                            hidden={!findReservation('reserved', reservations)}
                        >Park here</button>
                        <button className="btn btn-sm btn-warning"
                            onClick={() => handlePlaceRequest(() => cancelReservationApi(findReservation('reserved', reservations).id, token), updatePlaceInList, handlePaymentRequired)}
                            hidden={!findReservation('reserved', reservations)}
                        >Cancel</button>
                    </>
                )
            case 'occupied':
                return (
                    <button className="btn btn-sm btn-danger"
                        onClick={() => handlePlaceRequest(() => endParkingApi(findReservation('parked', reservations).id, token), updatePlaceInList, handlePaymentRequired)}
                        hidden={!findReservation('parked', reservations)}
                    >End parking</button> 
                )
            default:
                return null
        }
    }

    return (
        <>
            <PaymentModal 
                show={showPaymentModal}
                reservation={selectedReservation}
                onClose={() => setShowPaymentModal(false)}
            />
            {
                places?.map(place => (
                    <div className="col-md-4" key={place.id}>
                        <div className="card custom-card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">
                                    { place.place_number }   
                                    <span className={`badge 
                                        ${place.status === 'available' ? 'bg-success' : 'bg-danger'}
                                        float-end`}>
                                        { place.status }
                                    </span>
                                </h5>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="card-text mb-1">
                                            <strong>Sector:</strong> { place.sector.name } {" "}
                                            { place.sector.description }
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Price:</strong> { place.sector.price } / hour
                                        </p>
                                    </div>
                                    <div>
                                        {
                                            place.status === 'available' ?
                                                <i className="bi bi-p-circle h1"></i>
                                            :
                                                <i className="bi bi-sign-no-parking h1"></i>
                                        }
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mt-3">
                                       { renderButtons(place) } 
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
