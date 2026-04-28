import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { getMyReservationsApi } from '../../config/api'
import Button from '../../components/custom/Button'

// Add pulse animation style
const pulseStyle = document.createElement('style')
pulseStyle.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
`
if (!document.querySelector('style[data-pulse]')) {
    pulseStyle.setAttribute('data-pulse', 'true')
    document.head.appendChild(pulseStyle)
}

const statusLabel = {
    reserved:  { text: 'Réservée',  color: '#f59e0b' },
    parked:    { text: 'En cours',  color: '#3b82f6' },
    finished:  { text: 'Terminée', color: '#10b981' },
    cancelled: { text: 'Annulée',  color: '#ef4444' },
}

export default function Profile() {
    const { user, token } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)

    const loadReservations = () => {
        if (!token) return
        setLoading(true)
        getMyReservationsApi(token)
            .then(data => setReservations(data || []))
            .catch(err => {
                if (err?.response?.status !== 401) {
                    console.error(err)
                }
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadReservations()
    }, [token])

    // Recharge les réservations quand la fenêtre reçoit le focus (après un paiement)
    useEffect(() => {
        const handleFocus = () => {
            loadReservations()
        }
        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [token])

    // Check if there are unpaid reservations
    const unpaidReservations = reservations.filter(r => r.status === 'finished' && r.is_approved && !r.paid)

    return (
        <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>

            {/* Alert pour paiements en attente */}
            {unpaidReservations.length > 0 && (
                <div style={{ 
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
                    border: '2px solid #f59e0b',
                    borderRadius: 12, 
                    padding: '1.5rem', 
                    marginBottom: '2rem',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                }}>
                    <h3 style={{ margin: 0, marginBottom: '0.5rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ⚠️ Paiement requis
                    </h3>
                    <p style={{ margin: 0, color: '#78350f', fontSize: '0.95rem' }}>
                        Vous avez <strong>{unpaidReservations.length}</strong> réservation{unpaidReservations.length > 1 ? 's' : ''} terminée{unpaidReservations.length > 1 ? 's' : ''} en attente de paiement.
                        <br />
                        Cherchez le bouton <strong style={{ color: '#16a34a' }}>💳 PAYER MAINTENANT</strong> (en vert qui clignote) dans le tableau ci-dessous.
                    </p>
                </div>
            )}

            {/* Infos utilisateur */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Mon Profil</h2>
                <p><strong>Nom :</strong> {user?.name}</p>
                <p><strong>Email :</strong> {user?.email}</p>
                <p><strong>Rôle :</strong> {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
            </div>

            {/* Historique des réservations */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Mes Réservations</h2>

                {loading && <p style={{ color: '#64748b' }}>Chargement...</p>}

                {!loading && reservations.length === 0 && (
                    <p style={{ color: '#64748b' }}>Aucune réservation pour le moment.</p>
                )}

                {!loading && reservations.length > 0 && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                <th style={th}>Place</th>
                                <th style={th}>Secteur</th>
                                <th style={th}>Début</th>
                                <th style={th}>Montant</th>
                                <th style={th}>Statut</th>
                                <th style={th}>Approbation</th>
                                <th style={th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map(r => {
                                const s = statusLabel[r.status] || { text: r.status, color: '#64748b' }
                                const isPaid = r.paid === true || r.paid === 1
                                const canShowQR = r.status === 'parked' || (r.status === 'finished' && r.is_approved && isPaid)
                                const canPay = r.status === 'finished' && r.is_approved && !isPaid
                                const approved = r.is_approved === true
                                
                                return (
                                    <tr key={r.id} style={{ 
                                        borderBottom: '1px solid #e2e8f0',
                                        background: canPay ? '#fef9c3' : 'transparent',
                                        transition: 'background 0.2s'
                                    }}>
                                        <td style={td}>{r.place?.number || '—'}</td>
                                        <td style={td}>{r.place?.sector?.name || '—'}</td>
                                        <td style={td}>{r.start_time ? new Date(r.start_time).toLocaleString('fr-FR') : '—'}</td>
                                        <td style={td}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <strong>{r.amount ? `${parseFloat(r.amount).toFixed(2)} MAD` : '—'}</strong>
                                                {isPaid && (
                                                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold' }}>✓ Payé</span>
                                                )}
                                                {canPay && (
                                                    <span style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>⚠ À payer</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={td}>
                                            <span style={{
                                                background: s.color,
                                                color: '#fff',
                                                padding: '4px 10px',
                                                borderRadius: 4,
                                                fontSize: 11,
                                                fontWeight: 600,
                                            }}>{s.text}</span>
                                        </td>
                                        <td style={td}>
                                            {approved ? (
                                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Approuvée</span>
                                            ) : r.rejection_reason ? (
                                                <span style={{ color: '#ef4444', fontWeight: 'bold', cursor: 'help' }} title={r.rejection_reason}>❌ Rejetée</span>
                                            ) : (
                                                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⏳ En attente</span>
                                            )}
                                            {r.rejection_reason && (
                                                <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', fontStyle: 'italic' }}>
                                                    Raison: {r.rejection_reason}
                                                </div>
                                            )}
                                        </td>
                                        <td style={td}>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                {canPay && (
                                                    <Button
                                                        onClick={() => navigate(`/pay/${r.id}`)}
                                                        variant="success"
                                                        size="sm"
                                                        style={{ 
                                                            fontWeight: 'bold',
                                                            boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)',
                                                            animation: 'pulse 2s infinite'
                                                        }}
                                                    >
                                                        💳 PAYER MAINTENANT
                                                    </Button>
                                                )}
                                                {canShowQR && !canPay && (
                                                    <Button
                                                        onClick={() => navigate(`/qrcode/${r.id}`)}
                                                        variant={r.status === 'finished' ? 'dark' : 'primary'}
                                                        size="sm"
                                                    >
                                                        📱 QR Code
                                                    </Button>
                                                )}
                                                {!approved && r.status === 'reserved' && (
                                                    <div style={{ 
                                                        fontSize: '0.75rem', 
                                                        color: '#f59e0b', 
                                                        fontWeight: '600',
                                                        padding: '6px 12px',
                                                        background: '#fef3c7',
                                                        borderRadius: '6px'
                                                    }}>
                                                        ⏳ En attente admin
                                                    </div>
                                                )}
                                                {isPaid && (
                                                    <div style={{ 
                                                        fontSize: '0.75rem', 
                                                        color: '#10b981', 
                                                        fontWeight: '600',
                                                        padding: '6px 12px',
                                                        background: '#d1fae5',
                                                        borderRadius: '6px'
                                                    }}>
                                                        ✓ Paiement reçu
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

const th = { padding: '10px 12px', fontWeight: 600, color: '#475569', fontSize: 13 }
const td = { padding: '10px 12px', fontSize: 13, color: '#1e293b' }

