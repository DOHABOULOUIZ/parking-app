import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Button from './custom/Button';
import { API_BASE_URL } from '../config/api';

export default function QRCodeDisplay({ reservationId }) {
  const { token } = useSelector(state => state.user);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [qrCodeToken, setQrCodeToken] = useState(null); // Le token texte
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token) {
      fetchQRCode();
    } else {
      setLoading(false);
      setError('Vous devez être connecté pour voir le QR code');
    }
  }, [reservationId, token]);

  const fetchQRCode = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/qrcode/reservation/${reservationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQrCodeImage(response.data.qr_code_image);
      setQrCodeToken(response.data.qr_code); // Stocker le token texte
      setReservation(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setError(error.response?.data?.message || 'Impossible de charger le QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeImage) {
      // Convert SVG to downloadable file
      const downloadLink = document.createElement('a');
      downloadLink.href = qrCodeImage;
      downloadLink.download = `parking-reservation-${reservationId}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - Réservation #${reservationId}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: white;
            }
            .print-container {
              text-align: center;
              max-width: 600px;
              padding: 40px;
            }
            .header {
              margin-bottom: 30px;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
            }
            h1 {
              color: #1e40af;
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .subtitle {
              color: #64748b;
              font-size: 14px;
            }
            .qr-code-container {
              background: #f8fafc;
              border: 2px solid #e2e8f0;
              border-radius: 16px;
              padding: 30px;
              margin: 30px 0;
            }
            .qr-code-container img {
              max-width: 300px;
              width: 100%;
            }
            .details {
              background: #f1f5f9;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
              text-align: left;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              color: #64748b;
              font-weight: 600;
            }
            .detail-value {
              color: #0f172a;
              font-weight: 700;
            }
            .instructions {
              background: #dbeafe;
              border-left: 4px solid #2563eb;
              padding: 15px;
              margin-top: 30px;
              text-align: left;
            }
            .instructions h3 {
              color: #1e40af;
              margin: 0 0 10px 0;
              font-size: 16px;
            }
            .instructions ol {
              margin: 0;
              padding-left: 20px;
              color: #1e293b;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              color: #64748b;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              <h1>🅿️ Smart Parking System</h1>
              <p class="subtitle">Ticket de Réservation Électronique</p>
            </div>
            
            <div class="qr-code-container">
              <img src="${qrCodeImage}" alt="QR Code Réservation">
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Place de parking</span>
                <span class="detail-value">${reservation.place_number}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Secteur</span>
                <span class="detail-value">${reservation.sector_name || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Début</span>
                <span class="detail-value">${new Date(reservation.start_time).toLocaleString('fr-FR')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Statut</span>
                <span class="detail-value">${reservation.status}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Client</span>
                <span class="detail-value">${reservation.user_name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Véhicule</span>
                <span class="detail-value">${reservation.vehicle_info || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Montant</span>
                <span class="detail-value">${reservation.total_price} MAD</span>
              </div>
            </div>

            <div class="instructions">
              <h3>📱 Instructions d'utilisation</h3>
              <ol>
                <li>Présentez ce QR code à la borne d'entrée du parking</li>
                <li>Scannez le code pour enregistrer votre arrivée</li>
                <li>Stationnez votre véhicule à la place indiquée</li>
                <li>Scannez à nouveau le code à la sortie</li>
              </ol>
            </div>

            <div class="footer">
              <p>Document généré le ${new Date(reservation.generated_at).toLocaleString('fr-FR')}</p>
              <p>Conservez ce ticket pendant toute la durée de votre stationnement</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Réservation Parking #${reservationId}`,
          text: `Place ${reservation.place_number} - ${new Date(reservation.start_time).toLocaleDateString('fr-FR')}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Sharing cancelled');
      }
    } else {
      // Fallback: Copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyToken = () => {
    if (qrCodeToken) {
      navigator.clipboard.writeText(qrCodeToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { bg: '#dbeafe', color: '#1e40af', text: '✓ Confirmée' },
      active: { bg: '#d1fae5', color: '#065f46', text: '● Active' },
      pending: { bg: '#fef3c7', color: '#92400e', text: '⏳ En attente' },
      completed: { bg: '#f3f4f6', color: '#374151', text: '✓ Terminée' },
      cancelled: { bg: '#fee2e2', color: '#991b1b', text: '✕ Annulée' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span style={{
        background: config.bg,
        color: config.color,
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        display: 'inline-block'
      }}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        minHeight: '400px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '16px' }}>
          Chargement de votre QR code...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        border: '2px solid #f87171',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⚠️</div>
        <p style={{ color: '#991b1b', marginBottom: '0.5rem', fontWeight: 700, fontSize: '18px' }}>
          Erreur de chargement
        </p>
        <p style={{ color: '#7f1d1d', fontSize: '14px' }}>{error}</p>
        <div style={{ marginTop: '1.5rem' }}>
          <Button
            onClick={fetchQRCode}
            variant="danger"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!qrCodeImage || !reservation) {
    return (
      <div style={{
        background: '#fef3c7',
        border: '2px solid #fde047',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
        <p style={{ color: '#92400e', fontWeight: '600' }}>
          Aucun QR code disponible pour cette réservation.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      {/* Header avec gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        padding: '2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>🅿️</div>
        <h2 style={{ margin: '0 0 0rem 0', fontSize: '24px', fontWeight: '700' }}>
          Votre Pass de Stationnement
        </h2>
      </div>

      <div style={{ padding: '2rem' }}>
        {/* Status Badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {getStatusBadge(reservation.status)}
        </div>

        {/* QR Code avec cadre professionnel */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '3px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            display: 'inline-block',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <img 
              src={qrCodeImage} 
              alt="QR Code de réservation" 
              style={{ 
                maxWidth: '280px', 
                width: '100%', 
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
          <p style={{
            marginTop: '1rem',
            color: '#64748b',
            fontSize: '13px',
            fontWeight: '500'
          }}>
            Scannez ce code à l'entrée et à la sortie
          </p>
        </div>

        {/* Token code - NOUVEAU */}
        {qrCodeToken && (
          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              margin: '0 0 0.75rem 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔑 Code Token (pour l'admin)
            </h3>
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '0.75rem',
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              fontSize: '13px',
              color: '#1e293b',
              lineHeight: '1.6'
            }}>
              {qrCodeToken}
            </div>
            <Button
              onClick={copyToken}
              variant={copied ? 'success' : 'primary'}
              style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
            >
              <span style={{ fontSize: '16px' }}>{copied ? '✓' : '📋'}</span>
              {copied ? 'Token copié !' : 'Copier le token'}
            </Button>
            <p style={{
              margin: '0.75rem 0 0 0',
              color: '#64748b',
              fontSize: '11px',
              lineHeight: '1.5'
            }}>
              💡 <strong>Astuce :</strong> Ce code peut être collé directement dans le scanner de l'admin à l'entrée/sortie du parking
            </p>
          </div>
        )}

        {/* Informations détaillées */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '16px',
            fontWeight: '700',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📋 Détails de la réservation
          </h3>
          
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <DetailRow icon="🚗" label="Place de parking" value={`N° ${reservation.place_number}`} />
            <DetailRow icon="🏢" label="Secteur" value={reservation.sector_name || 'N/A'} />
            <DetailRow icon="📅" label="Début" value={formatDateTime(reservation.start_time)} />
            <DetailRow icon="📊" label="Statut" value={getStatusBadge(reservation.status)} />
            <DetailRow icon="👤" label="Client" value={reservation.user_name} />
            {reservation.vehicle_info && reservation.vehicle_info !== 'N/A' && (
              <DetailRow icon="🔖" label="Immatriculation" value={reservation.vehicle_info} />
            )}
            <DetailRow 
              icon="💰" 
              label="Montant total" 
              value={`${reservation.total_price} MAD`}
              highlight={true}
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <Button
            onClick={downloadQRCode}
            variant="primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span style={{ fontSize: '18px' }}>⬇️</span>
            Télécharger
          </Button>
          
          <Button
            onClick={printQRCode}
            variant="success"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span style={{ fontSize: '18px' }}>🖨️</span>
            Imprimer
          </Button>
        </div>

        <Button
          onClick={shareQRCode}
          variant="secondary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
        >
          <span style={{ fontSize: '18px' }}>📤</span>
          {copied ? 'Lien copié !' : 'Partager'}
        </Button>

        {/* Footer */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '2px solid #f1f5f9',
          textAlign: 'center'
        }}>
          <p style={{
            margin: '0 0 0.5rem 0',
            color: '#94a3b8',
            fontSize: '12px'
          }}>
            QR Code généré le {new Date(reservation.generated_at).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p style={{
            margin: 0,
            color: '#cbd5e1',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            🔒 Code sécurisé et crypté
          </p>
        </div>
      </div>
    </div>
  );
}

// Composant helper pour les lignes de détails
function DetailRow({ icon, label, value, highlight = false }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem',
      background: highlight ? '#dbeafe' : 'white',
      borderRadius: '8px',
      border: highlight ? '2px solid #2563eb' : '1px solid #e2e8f0'
    }}>
      <span style={{
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        {label}
      </span>
      <span style={{
        color: highlight ? '#1e40af' : '#0f172a',
        fontSize: '14px',
        fontWeight: highlight ? '700' : '600'
      }}>
        {value}
      </span>
    </div>
  );
}
