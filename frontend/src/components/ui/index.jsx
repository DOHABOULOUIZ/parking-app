import React from 'react';

// ═════════════════════════════════════════════════ 
// BUTTON COMPONENT
// ═════════════════════════════════════════════════

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  icon = null,
  children,
  ...props 
}) {
  const sizeClass = size === 'md' ? '' : `btn-${size}`;
  const variantClass = `btn-${variant}`;
  
  return (
    <button 
      className={`btn-professional ${variantClass} ${sizeClass}`.trim()}
      disabled={loading || props.disabled}
      {...props}
    >
      {icon && <i className={`bi ${icon}`}></i>}
      {loading ? <span className="animate-spin">⟳</span> : children}
    </button>
  );
}

// ═════════════════════════════════════════════════ 
// CARD COMPONENT
// ═════════════════════════════════════════════════

export function Card({ 
  children, 
  elevated = false,
  className = '',
  ...props 
}) {
  return (
    <div 
      className={`card-modern ${elevated ? 'elevated' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ═════════════════════════════════════════════════ 
// BADGE COMPONENT
// ═════════════════════════════════════════════════

const BADGE_TYPES = {
  available: { class: 'badge-available', label: '✓ Disponible', icon: 'check-circle' },
  occupied: { class: 'badge-occupied', label: '● Occupée', icon: 'dash-circle' },
  reserved: { class: 'badge-reserved', label: '◯ Réservée', icon: 'bookmark' },
  pending: { class: 'badge-pending', label: '⋯ En Attente', icon: 'hourglass-split' },
};

export function Badge({ status = 'pending', customLabel = null }) {
  const config = BADGE_TYPES[status] || BADGE_TYPES.pending;
  
  return (
    <span className={`badge ${config.class}`}>
      <i className={`bi bi-${config.icon}`} style={{ marginRight: '4px' }}></i>
      {customLabel || config.label}
    </span>
  );
}

// ═════════════════════════════════════════════════ 
// ALERT COMPONENT
// ═════════════════════════════════════════════════

const ALERT_ICONS = {
  success: 'check-circle',
  danger: 'exclamation-circle',
  warning: 'exclamation-triangle',
  info: 'info-circle',
};

export function Alert({ 
  type = 'info', 
  title = null,
  children, 
  onClose = null,
  ...props 
}) {
  const icon = ALERT_ICONS[type];
  
  return (
    <div className={`alert alert-${type}`} {...props}>
      <i className={`bi bi-${icon}`} style={{ minWidth: '20px' }}></i>
      <div style={{ flex: 1 }}>
        {title && <strong style={{ display: 'block', marginBottom: '4px' }}>{title}</strong>}
        {children}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════ 
// STAT CARD COMPONENT
// ═════════════════════════════════════════════════

export function StatCard({ 
  label, 
  value, 
  change = null,
  type = 'primary',
  icon = null,
}) {
  const isPositive = change && change > 0;
  
  return (
    <div className={`stat-card ${type}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div className="stat-card-label">{label}</div>
          <div className="stat-card-value">{value}</div>
          {change !== null && (
            <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
              <i className={`bi bi-arrow-${isPositive ? 'up' : 'down'}`}></i>
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        {icon && <i className={`bi ${icon}`} style={{ fontSize: '2rem', opacity: 0.2 }}></i>}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════ 
// FORM GROUP COMPONENT
// ═════════════════════════════════════════════════

export function FormGroup({ 
  label, 
  error = null,
  required = false,
  children,
  hint = null,
}) {
  return (
    <div className="form-group">
      {label && (
        <label>
          {label}
          {required && <span style={{ color: 'var(--danger-600)', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      {children}
      {error && <small style={{ color: 'var(--danger-600)', marginTop: '4px', display: 'block' }}>{error}</small>}
      {hint && <small style={{ color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>{hint}</small>}
    </div>
  );
}

// ═════════════════════════════════════════════════ 
// TABLE COMPONENT
// ═════════════════════════════════════════════════

export function DataTable({ 
  columns, 
  rows = [],
  loading = false,
  onEdit = null,
  onDelete = null,
  pagination = null,
  title = null,
}) {
  return (
    <div className="table-container">
      {title && (
        <div className="table-header">
          <h3>{title}</h3>
          <div className="table-actions">
            {/* Action buttons go here */}
          </div>
        </div>
      )}
      
      <div className="table-wrapper">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <span className="animate-spin" style={{ fontSize: '1.5rem' }}>⟳</span>
          </div>
        ) : rows.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            Aucune donnée trouvée
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                {(onEdit || onDelete) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {onEdit && (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            icon="pencil"
                            onClick={() => onEdit(row)}
                            aria-label="Edit"
                          />
                        )}
                        {onDelete && (
                          <Button 
                            variant="danger" 
                            size="sm"
                            icon="trash"
                            onClick={() => onDelete(row)}
                            aria-label="Delete"
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination && (
        <div className="table-footer">
          <div></div>
          <div className="pagination">
            <Button 
              variant="secondary" 
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              ← Précédent
            </Button>
            <span>Page {pagination.page} / {pagination.totalPages}</span>
            <Button 
              variant="secondary" 
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Suivant →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════ 
// LOADING SPINNER
// ═════════════════════════════════════════════════

export function LoadingSpinner({ size = 'md', label = 'Chargement...' }) {
  const sizeMap = { sm: '20px', md: '40px', lg: '60px' };
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      gap: '12px',
      padding: '2rem'
    }}>
      <div 
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: '3px solid var(--border-color)',
          borderTop: '3px solid var(--primary-600)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      {label && <p style={{ color: 'var(--text-tertiary)' }}>{label}</p>}
    </div>
  );
}

// ═════════════════════════════════════════════════ 
// MODAL/DIALOG COMPONENT
// ═════════════════════════════════════════════════

export function Modal({ 
  open = false, 
  title = null,
  children, 
  onClose = null,
  footer = null,
  size = 'md',
}) {
  if (!open) return null;

  const sizeMap = { sm: '400px', md: '600px', lg: '800px' };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <Card 
        className="animate-slideUp"
        style={{
          width: '90%',
          maxWidth: sizeMap[size],
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {title && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-4)',
            borderBottom: '1px solid var(--border-color)',
          }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            {onClose && (
              <button 
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                }}
              >
                ×
              </button>
            )}
          </div>
        )}
        
        <div style={{ padding: 'var(--space-4)' }}>
          {children}
        </div>

        {footer && (
          <div style={{
            padding: 'var(--space-4)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: 'var(--space-3)',
            justifyContent: 'flex-end',
          }}>
            {footer}
          </div>
        )}
      </Card>
    </div>
  );
}

export default {
  Button,
  Card,
  Badge,
  Alert,
  StatCard,
  FormGroup,
  DataTable,
  LoadingSpinner,
  Modal,
};
