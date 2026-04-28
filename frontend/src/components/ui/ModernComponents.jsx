import React from 'react';

/**
 * Card - Component hyper-moderne pour contenir du contenu
 */
export function Card({ children, className = '', hover = false, onClick, style }) {
  return (
    <div
      onClick={onClick}
      className={`card-modern ${hover ? 'card-modern-hover' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/**
 * StatCard - Carte de statistique avec icône et tendance
 */
export function StatCard({ icon, label, value, trend, trendPositive = true, color = 'primary' }) {
  return (
    <Card className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <div className="stat-icon">{icon}</div>
        <span className={`stat-trend ${trendPositive ? 'positive' : 'negative'}`}>
          {trendPositive ? '↑' : '↓'} {trend}%
        </span>
      </div>
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
    </Card>
  );
}

/**
 * Badge - Petit tag coloré pour les statuts
 */
export function Badge({ children, variant = 'primary', size = 'md', className = '' }) {
  const sizeClass = size === 'sm' ? 'badge-sm' : size === 'lg' ? 'badge-lg' : 'badge-md';
  return (
    <span className={`badge badge-${variant} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Button - Bouton ultra-mode avec plusieurs variantes
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : 'btn-md';
  
  return (
    <button
      className={`btn btn-${variant} ${sizeClass} ${disabled ? 'btn-disabled' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn-spinner"></span>
          {children}
        </>
      ) : (
        <>
          {Icon && <Icon className="btn-icon" />}
          {children}
        </>
      )}
    </button>
  );
}

/**
 * Input - Champ de saisie professionnel
 */
export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className={`input-group ${error ? 'input-error' : ''}`}>
      {Icon && <Icon className="input-icon" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field ${className}`}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}

/**
 * Alert - Bannière d'alerte
 */
export function Alert({ children, type = 'info', dismissible = false, onClose }) {
  const icons = {
    success: '✓',
    danger: '⚠',
    warning: '!',
    info: 'ℹ'
  };

  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">{icons[type]}</span>
      <div className="alert-content">{children}</div>
      {dismissible && (
        <button className="btn-professional btn-ghost btn-sm" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}

/**
 * Skeleton - Composant de loading shimmer
 */
export function Skeleton({ height = '20px', width = '100%', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        height,
        width,
        borderRadius: '6px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite'
      }}
    />
  );
}

/**
 * Table - Tableau professionnel
 */
export function Table({ columns, data, loading = false, empty = false }) {
  return (
    <div className="table-wrapper">
      <table className="table-modern">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="loading-cell">
                <Skeleton height="40px" />
              </td>
            </tr>
          ) : empty ? (
            <tr>
              <td colSpan={columns.length} className="empty-cell">
                Aucune donnée disponible
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Modal - Dialogue modal moderne
 */
export function Modal({ isOpen, title, children, actions, onClose, size = 'md' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content modal-${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn-professional btn-ghost btn-sm" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-footer">{actions}</div>}
      </div>
    </div>
  );
}

/**
 * Progress - Barre de progression
 */
export function Progress({ value = 0, label, color = 'primary' }) {
  return (
    <div className="progress-container">
      {label && <p className="progress-label">{label}</p>}
      <div className="progress-bar">
        <div className={`progress-fill progress-${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="progress-value">{value}%</span>
    </div>
  );
}

export default {
  Card,
  StatCard,
  Badge,
  Button,
  Input,
  Alert,
  Skeleton,
  Table,
  Modal,
  Progress
};