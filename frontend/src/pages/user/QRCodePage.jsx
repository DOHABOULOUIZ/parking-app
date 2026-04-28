import React from 'react'
import { useParams, useNavigate } from 'react-router'
import QRCodeDisplay from '../../components/QRCodeDisplay'
import Button from '../../components/custom/Button'

export default function QRCodePage() {
    const { reservationId } = useParams()
    const navigate = useNavigate()

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
            <Button
                onClick={() => navigate('/profile')}
                variant="ghost"
                size="md"
                className="flex items-center gap-1.5"
                style={{ marginBottom: '1.5rem', width: 'auto' }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Retour aux réservations
            </Button>

            <QRCodeDisplay reservationId={reservationId} />

            <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 12,
                padding: '1.5rem',
                marginTop: '2rem',
            }}>
                <h3 style={{ color: '#1e40af', marginBottom: '1rem', fontSize: 16, fontWeight: 600 }}>
                    📱 Instructions
                </h3>
                <ul style={{ color: '#1e40af', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                    <li>Présentez ce QR code à l'entrée du parking pour le <strong>check-in</strong></li>
                    <li>Scannez-le à nouveau à la sortie pour le <strong>check-out</strong></li>
                    <li>Vous pouvez télécharger le QR code sur votre téléphone</li>
                    <li>Gardez ce QR code accessible pendant toute la durée de votre stationnement</li>
                </ul>
            </div>
        </div>
    )
}
