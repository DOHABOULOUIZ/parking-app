import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { createApiClient } from '../../config/api';
import { toast } from 'react-toastify';

const STATUS_LABELS = {
  reserved:  { label: 'Reserve',   bg: '#dbeafe', color: '#1e40af' },
  parked:    { label: 'Gare',      bg: '#dcfce7', color: '#166534' },
  finished:  { label: 'Termine',   bg: '#f1f5f9', color: '#475569' },
  paid:      { label: 'Paye',      bg: '#ede9fe', color: '#6d28d9' },
  cancelled: { label: 'Annule',    bg: '#fee2e2', color: '#991b1b' },
};

export default function QRScanner() {
  const { token } = useSelector(state => state.user);
  const [qrCode, setQrCode]               = useState('');
  const [loadingAction, setLoadingAction] = useState('');
  const [result, setResult]               = useState(null);
  const [history, setHistory]             = useState([]);
  const [stats, setStats]                 = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchStats();
    fetchHistory();
    inputRef.current?.focus();
  }, []);

  const fetchStats = async () => {
    try {
      const api = createApiClient(token);
      const res = await api.get('/admin/qr-scanner/stats');
      setStats(res.data);
    } catch (e) {}
  };

  const fetchHistory = async () => {
    try {
      const api = createApiClient(token);
      const res = await api.get('/admin/qr-scanner/history');
      setHistory(res.data.data || res.data || []);
    } catch (e) {}
  };

  const handleVerify = async () => {
    if (!qrCode.trim()) { toast.warn('Veuillez saisir un token QR'); return; }
    setLoadingAction('verify');
    setResult(null);
    try {
      const api = createApiClient(token);
      const res = await api.post('/admin/qr-scanner/verify', { token: qrCode.trim() });
      setResult({ type: 'verify', success: true, reservation: res.data.reservation, message: res.data.message, readOnly: res.data.read_only });
      toast.success(res.data.message || 'QR Code valide');
      fetchHistory();
    } catch (error) {
      const msg = error.response?.data?.message || 'QR Code invalide ou expire';
      setResult({ type: 'verify', success: false, message: msg });
      toast.error(msg);
    } finally {
      setLoadingAction('');
    }
  };

  const handleCheckIn = async () => {
    if (!qrCode.trim()) { toast.warn('Veuillez saisir un token QR'); return; }
    setLoadingAction('check-in');
    try {
      const api = createApiClient(token);
      const res = await api.post('/admin/qr-scanner/check-in', { token: qrCode.trim() });
      setResult({ type: 'check-in', success: true, message: res.data.message || 'Check-in reussi !' });
      toast.success('Check-in reussi ! Statut : Gare');
      fetchStats();
      fetchHistory();
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors du check-in';
      setResult({ type: 'check-in', success: false, message: msg });
      toast.error(msg);
    } finally {
      setLoadingAction('');
    }
  };

  const handleCheckOut = async () => {
    if (!qrCode.trim()) { toast.warn('Veuillez saisir un token QR'); return; }
    setLoadingAction('check-out');
    try {
      const api = createApiClient(token);
      const res = await api.post('/admin/qr-scanner/check-out', { token: qrCode.trim() });
      setResult({ type: 'check-out', success: true, message: res.data.message || 'Check-out effectue !' });
      toast.success('Check-out effectue ! Statut : Termine');
      fetchStats();
      fetchHistory();
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors du check-out';
      setResult({ type: 'check-out', success: false, message: msg });
      toast.error(msg);
    } finally {
      setLoadingAction('');
    }
  };

  const resetForm = () => {
    setQrCode('');
    setResult(null);
    inputRef.current?.focus();
  };

  const fmt = (d) => d
    ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' ' + new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--';

  const fmtShort = (d) => d
    ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' ' + new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : '--';

  const statusBadge = (status) => {
    const s = STATUS_LABELS[status] || { label: status, bg: '#f1f5f9', color: '#475569' };
    return (
      <span style={{
        background: s.bg, color: s.color, borderRadius: '5px',
        padding: '2px 10px', fontWeight: 600, fontSize: '0.8rem',
        display: 'inline-flex', alignItems: 'center', gap: '4px'
      }}>
        {status === 'finished' && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
        {s.label}
      </span>
    );
  };

  const busy = loadingAction !== '';
  const totalScans = stats?.total_scans ?? 0;
  const reussis    = stats ? (stats.checked_in ?? 0) + (stats.checked_out ?? 0) : 0;
  const echecs     = stats ? Math.max(0, totalScans - reussis) : 0;

  /* ---- result header config ---- */
  const resultCfg = result ? (() => {
    if (result.type === 'verify' && result.success && result.readOnly) {
      return { title: 'Lecture Seule', sub: result.message || 'Reservation consultable uniquement', bg: '#fffbeb', border: '#fde68a', iconBg: '#fef3c7', iconColor: '#92400e' };
    }
    return {
      verify:      { title: 'Code Valide',        sub: 'Reservation trouvee',  bg: '#f0fdf4', border: '#bbf7d0', iconBg: '#dcfce7', iconColor: '#166534' },
      'check-in':  { title: 'Check-In Reussi',    sub: result?.message || '',  bg: '#f0fdf4', border: '#bbf7d0', iconBg: '#dcfce7', iconColor: '#166534' },
      'check-out': { title: 'Check-Out Effectue', sub: result?.message || '',  bg: '#faf5ff', border: '#e9d5ff', iconBg: '#ede9fe', iconColor: '#7c3aed' },
    }[result.type];
  })() : null;

  return (
    <div className="dashboard-container admin-modern-page admin-qr-scanner-page">
      <div className="dashboard-welcome">
        <div>
          <h1 className="dashboard-title">Scanner QR Code</h1>
          <p className="dashboard-subtitle">Gestion des entrées et sorties parking</p>
        </div>
      </div>

      <div className="qr-scanner-grid">
        {/* ============ COLONNE GAUCHE ============ */}
        <div className="qr-scanner-left">

          {/* --- Stats 3 cards --- */}
          <div className="stats-grid-modern">
            {[
              { label: 'Scans aujourd hui', value: totalScans, color: '#3b82f6' },
              { label: 'Reussis',           value: reussis,    color: '#10b981' },
              { label: 'Echecs',            value: echecs,     color: '#ef4444' },
            ].map(s => (
              <div key={s.label} className="stat-card-modern" style={{ '--stat-color': s.color }}>
                <div className="stat-card-icon" style={{ background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}dd 100%)` }}>
                  {s.label === 'Scans aujourd hui' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                  )}
                  {s.label === 'Reussis' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  {s.label === 'Echecs' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  )}
                </div>
                <div className="stat-card-content">
                  <p className="stat-card-label">{s.label}</p>
                  <h3 className="stat-card-value">{s.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* --- Scanner form card --- */}
          <div className="form-card-modern">
            <div className="form-card-header">
              <h3 className="form-card-title">Scanner le QR Code</h3>
            </div>
            <div className="form-card-body">

              {/* Yellow tip */}
              <div style={{
                background: '#fffbeb', border: '1px solid #fde68a',
                borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem'
              }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: 700, color: '#92400e', fontSize: '0.85rem' }}>
                  Comment ca marche ?
                </p>
              <ol style={{ margin: 0, paddingLeft: '1.2rem', color: '#b45309', fontSize: '0.8rem', lineHeight: 1.75 }}>
                <li>Le client genere son QR code depuis son espace</li>
                <li>A l entree, il vous montre le QR code sur son telephone</li>
                <li>Vous collez le code token dans le champ ci-dessous</li>
                <li>Cliquez sur "Check-In" pour valider l entree</li>
                <li>A la sortie, meme processus avec "Check-Out"</li>
              </ol>
            </div>

            {/* Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label-modern">
                Code QR ou Token
              </label>
              <input
                ref={inputRef}
                type="text"
                value={qrCode}
                onChange={e => { setQrCode(e.target.value); setResult(null); }}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                placeholder="Collez ou scannez le token ici..."
                disabled={busy}
                className="form-input-modern"
              />
              {qrCode.length > 0 && (
                <p style={{ margin: '0.3rem 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>
                  {qrCode.length} caracteres • Appuyez sur Entree pour verifier
                </p>
              )}
            </div>

            {/* 3 buttons in a row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              {[
                {
                  label: loadingAction === 'verify'    ? 'Verification...' : 'Verifier',
                  className: 'btn-modern', action: 'verify', handler: handleVerify
                },
                {
                  label: loadingAction === 'check-in'  ? 'En cours...'     : 'Check-In',
                  className: 'btn-modern btn-primary', action: 'check-in', handler: handleCheckIn
                },
                {
                  label: loadingAction === 'check-out' ? 'En cours...'     : 'Check-Out',
                  className: 'btn-modern btn-danger', action: 'check-out', handler: handleCheckOut
                },
              ].map(btn => (
                <button
                  key={btn.action}
                  type="button"
                  onClick={btn.handler}
                  disabled={busy || !qrCode.trim()}
                  className={btn.className}
                  style={{ opacity: (busy || !qrCode.trim()) ? 0.6 : 1 }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {(qrCode || result) && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: 'none', border: 'none',
                    color: '#94a3b8', cursor: 'pointer',
                    fontSize: '0.8rem', textDecoration: 'underline'
                  }}
                >
                  Reinitialiser
                </button>
              </div>
            )}
            </div>
          </div>

          {/* --- Result card (appears below scanner) --- */}
          {result && (
            <div className="form-card-modern" style={{ overflow: 'hidden' }}>
              {/* result header band */}
              <div style={{
                padding: '1.1rem 1.4rem',
                background: result.success ? (resultCfg?.bg || '#f0fdf4') : '#fef2f2',
                borderBottom: '1px solid',
                borderBottomColor: result.success ? (resultCfg?.border || '#bbf7d0') : '#fecaca',
                display: 'flex', alignItems: 'center', gap: '0.875rem'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: result.success ? (resultCfg?.iconBg || '#dcfce7') : '#fee2e2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {result.success && result.readOnly
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    : result.success
                      ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={resultCfg?.iconColor || '#166534'} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0, fontWeight: 700, fontSize: '1.025rem',
                    color: result.success ? (resultCfg?.iconColor || '#166534') : '#dc2626'
                  }}>
                    {result.success ? (resultCfg?.title || 'Succes') : 'Action Impossible'}
                  </p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    {result.success ? (resultCfg?.sub || '') : result.message}
                  </p>
                </div>
              </div>

              {/* details for verify */}
              {result.success && result.type === 'verify' && result.reservation && (
                <div className="form-card-body" style={{ padding: '1.1rem 1.4rem' }}>
                  {result.readOnly && (
                    <div style={{
                      background: '#fffbeb', border: '1px solid #fde68a',
                      borderRadius: '8px', padding: '0.6rem 0.875rem',
                      marginBottom: '0.875rem',
                      fontSize: '0.8rem', color: '#92400e', fontWeight: 600
                    }}>
                      Lecture seule — aucune action possible sur cette reservation
                    </div>
                  )}
                  {[
                    ['Reservation', '#' + result.reservation.id],
                    ['Place',       result.reservation.place?.place_number || '--'],
                    ['Secteur',     result.reservation.place?.sector?.name || '--'],
                    ['Client',      result.reservation.user?.name || '--'],
                    ['Email',       result.reservation.user?.email || '--'],
                    ['Statut',      '__badge__'],
                    ['Debut',       fmt(result.reservation.start_time)],
                    ['Fin prevue',  fmt(result.reservation.end_time)],
                    ['Check-in',    fmt(result.reservation.checked_in_at)],
                    ['Check-out',   fmt(result.reservation.checked_out_at)],
                    ['Montant',     result.reservation.amount != null ? result.reservation.amount + ' MAD' : '--'],
                    ['Paiement',    result.reservation.paid ? 'Paye' : 'En attente'],
                  ].map(([label, val]) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.45rem 0', borderBottom: '1px solid #f1f5f9'
                    }}>
                      <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>{label}</span>
                      {val === '__badge__'
                        ? statusBadge(result.reservation.status)
                        : <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{val}</span>
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
        {/* ============ COLONNE DROITE ============ */}
        <div className="qr-scanner-right">

          {/* Mode d emploi */}
          <div className="form-card-modern">
            <div className="form-card-header">
              <h3 className="form-card-title">Mode d emploi</h3>
            </div>
            <div className="form-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { color: '#3b82f6', title: 'Verifier',   sub: 'Controle sans modification' },
                { color: '#16a34a', title: 'Check-in',   sub: 'Entree parking (-> parked)' },
                { color: '#94a3b8', title: 'Check-Out',  sub: 'Sortie parking (-> finished)' },
              ].map(item => (
                <div key={item.title} style={{
                  borderLeft: '4px solid ' + item.color,
                  paddingLeft: '1rem'
                }}>
                  <p style={{ margin: '0 0 0.2rem', fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
                    {item.title}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '1rem',
              background: 'rgba(254, 243, 199, 0.45)', borderLeft: '4px solid #f59e0b',
              borderRadius: '8px', padding: '0.85rem',
              fontSize: '0.8rem', color: '#92400e', lineHeight: 1.6
            }}>
              <strong>Note :</strong> Check-in sur 'reserved' uniquement. Check-out apres check-in.
            </div>
          </div>

          {/* Historique */}
          <div className="form-card-modern">
            <div className="form-card-header" style={{ justifyContent: 'space-between' }}>
              <h3 className="form-card-title">Historique</h3>
              <button
                type="button"
                onClick={() => setHistory([])}
                style={{
                  background: 'none', border: 'none',
                  color: '#94a3b8', cursor: 'pointer',
                  fontSize: '0.8rem', padding: '0.2rem 0.4rem',
                  textDecoration: 'underline'
                }}
              >
                Effacer
              </button>
            </div>
            <div className="form-card-body">

            {history.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', padding: '1.5rem 0', margin: 0 }}>
                Aucun scan enregistre
              </p>
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '0.7rem',
                maxHeight: '340px', overflowY: 'auto'
              }}>
                {history.slice(0, 12).map((r, i) => {
                  const isOut = !!r.checked_out_at;
                  const isIn  = !!r.checked_in_at && !r.checked_out_at;
                  const label = isOut ? 'Check-Out' : isIn ? 'Check-In' : 'Verification';
                  const lBg   = isOut ? '#fee2e2'  : isIn ? '#dcfce7'  : '#dbeafe';
                  const lClr  = isOut ? '#dc2626'  : isIn ? '#166534'  : '#1d4ed8';
                  const ts    = r.checked_out_at || r.checked_in_at || r.created_at;
                  const ok    = !!ts;
                  return (
                    <div key={r.id || i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.625rem',
                      padding: '0.625rem 0.875rem',
                      background: '#f8fafc', borderRadius: '8px'
                    }}>
                      <span style={{
                        background: lBg, color: lClr,
                        borderRadius: '5px', padding: '3px 8px',
                        fontSize: '0.75rem', fontWeight: 700,
                        whiteSpace: 'nowrap', flexShrink: 0
                      }}>
                        {label}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          margin: 0, fontSize: '0.8rem', color: '#475569', fontWeight: 500,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {r.user?.name || 'Utilisateur #' + r.id}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                          {fmtShort(ts)}
                        </p>
                      </div>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        background: ok ? '#dcfce7' : '#fee2e2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {ok
                          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
