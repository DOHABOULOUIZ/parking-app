import React, { useState } from 'react'
import {
    cancelReservationApi, endParkingApi,
    handlePlaceRequest, reservePlaceApi, startParkingApi
} from '../../config/api'
import { useSelector } from 'react-redux'
import PaymentModal from './PaymentModal'

/* ── Icons ─────────────────────────────────────────────────── */
const IcoSector = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
)

const IcoMAD = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
)

const IcoClock = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
)

const IcoPlay = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
)

const IcoStop = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
    </svg>
)

const IcoPlus = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
)

const IcoX = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
)

const IcoLogin = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
        <polyline points="10 17 15 12 10 7"/>
        <line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
)

/* ── StatusBadge ────────────────────────────────────────────── */
function StatusBadge({ status }) {
    const map = {
        available: 'Disponible',
        reserved:  'Réservée',
        occupied:  'Occupée',
    }
    return (
        <span className={`status-badge status-badge--${status}`}>
            <span className="status-badge__dot" />
            {map[status] ?? status}
        </span>
    )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function PlaceListItem({ places, updatePlaceInList }) {
    const { token, user } = useSelector(state => state.user)
    const [showPaymentModal, setShowPaymentModal]     = useState(false)
    const [selectedReservation, setSelectedReservation] = useState(null)

    const onPayment = (reservation) => {
        setSelectedReservation(reservation)
        setShowPaymentModal(true)
    }

    const find = (status, reservations) =>
        reservations.find(r => r.user_id === user?.id && r.status === status)

    const renderActions = (place) => {
        /* — not logged in — */
        if (!user) {
            return (
                <div className="login-prompt">
                    <p>Connectez-vous pour réserver</p>
                    <a href="/login" className="btn-action btn-action--primary"
                       style={{ display: 'inline-flex', width: 'auto', padding: '0.5rem 1.25rem' }}>
                        <IcoLogin /> Se connecter
                    </a>
                </div>
            )
        }

        const { status, reservations } = place

        /* — available — */
        if (status === 'available') {
            return (
                <button
                    className="btn-action btn-action--primary"
                    onClick={() => handlePlaceRequest(
                        () => reservePlaceApi(place.id, token),
                        updatePlaceInList, onPayment
                    )}
                >
                    <IcoPlus /> Réserver cette place
                </button>
            )
        }

        /* — reserved — */
        if (status === 'reserved') {
            const reservation = find('reserved', reservations)
            if (!reservation) return null
            const approved = reservation.is_approved

            return (
                <>
                    {!approved && (
                        <div className="pending-badge">
                            <IcoClock />
                            En attente d'approbation
                        </div>
                    )}
                    <div className="btn-group-row">
                        <button
                            className="btn-action btn-action--success"
                            disabled={!approved}
                            onClick={() => handlePlaceRequest(
                                () => startParkingApi(reservation.id, token),
                                updatePlaceInList, onPayment
                            )}
                        >
                            <IcoPlay /> Démarrer
                        </button>
                        <button
                            className="btn-action btn-action--danger"
                            onClick={() => handlePlaceRequest(
                                () => cancelReservationApi(reservation.id, token),
                                updatePlaceInList, onPayment
                            )}
                        >
                            <IcoX /> Annuler
                        </button>
                    </div>
                </>
            )
        }

        /* — occupied — */
        if (status === 'occupied') {
            const reservation = find('parked', reservations)
            if (!reservation) return null
            return (
                <button
                    className="btn-action btn-action--end"
                    onClick={() => handlePlaceRequest(
                        () => endParkingApi(reservation.id, token),
                        updatePlaceInList, onPayment
                    )}
                >
                    <IcoStop /> Terminer le stationnement
                </button>
            )
        }

        return null
    }

    return (
        <>
            <PaymentModal
                show={showPaymentModal}
                reservation={selectedReservation}
                onClose={() => setShowPaymentModal(false)}
            />

            {places.map(place => (
                <div
                    key={place.id}
                    className={`place-card place-card--${place.status}`}
                >
                    {/* ── Header ── */}
                    <div className="place-card__header">
                        <div className="place-card__number-wrap">
                            <span className="place-card__label">Place de parking</span>
                            <span className="place-card__number">{place.place_number}</span>
                        </div>
                        <StatusBadge status={place.status} />
                    </div>

                    {/* ── Body ── */}
                    <div className="place-card__body">
                        <div className="place-card__info">

                            {/* Sector */}
                            <div className="place-card__row">
                                <span className="place-card__row-label">
                                    <IcoSector /> Secteur
                                </span>
                                <span className="place-card__row-value">
                                    {place.sector?.name ?? '—'}
                                </span>
                            </div>

                            {/* Description */}
                            {place.sector?.description && (
                                <p className="place-card__desc">
                                    {place.sector.description}
                                </p>
                            )}

                            {/* Price */}
                            <div className="place-card__row">
                                <span className="place-card__row-label">
                                    <IcoMAD /> Tarif
                                </span>
                                <span className="place-card__price-pill">
                                    <IcoMAD />
                                    {place.sector?.price ?? '—'}&nbsp;MAD / h
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* ── Footer / actions ── */}
                    <div className="place-card__footer">
                        {renderActions(place)}
                    </div>
                </div>
            ))}
        </>
    )
}
