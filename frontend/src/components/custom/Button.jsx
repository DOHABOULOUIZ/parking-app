import React from 'react';

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    ...props
}) {
    // Styles de base par variant - Version moderne
    const variantStyles = {
        primary: {
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            hoverBackground: '#2563eb',
            hoverShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
        secondary: {
            background: '#f1f5f9',
            color: '#475569',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            hoverBackground: '#e2e8f0',
            hoverShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
        danger: {
            background: '#ef4444',
            color: 'white',
            border: 'none',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            hoverBackground: '#dc2626',
            hoverShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
        success: {
            background: '#10b981',
            color: 'white',
            border: 'none',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            hoverBackground: '#059669',
            hoverShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
        warning: {
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            hoverBackground: '#d97706',
            hoverShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
        dark: {
            background: '#1e293b',
            color: 'white',
            border: 'none',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            hoverBackground: '#0f172a',
            hoverShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
        ghost: {
            background: 'transparent',
            color: '#64748b',
            border: '1px solid #cbd5e1',
            boxShadow: 'none',
            hoverBackground: '#f8fafc',
            hoverShadow: 'none',
        }
    };

    // Styles de taille - Version moderne
    const sizeStyles = {
        sm: { 
            padding: '0.5rem 0.875rem', 
            fontSize: '0.875rem',
            borderRadius: '6px',
            fontWeight: '500'
        },
        md: { 
            padding: '0.625rem 1.125rem', 
            fontSize: '0.9375rem',
            borderRadius: '6px',
            fontWeight: '500'
        },
        lg: { 
            padding: '0.75rem 1.5rem', 
            fontSize: '1rem',
            borderRadius: '8px',
            fontWeight: '500'
        }
    };

    const currentVariant = variantStyles[variant] || variantStyles.primary;
    const currentSize = sizeStyles[size] || sizeStyles.md;

    const baseStyle = {
        ...currentSize,
        background: currentVariant.background,
        color: currentVariant.color,
        border: currentVariant.border,
        boxShadow: currentVariant.boxShadow,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        outline: 'none',
        opacity: disabled ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        position: 'relative',
        overflow: 'hidden',
        ...props.style
    };

    const handleMouseEnter = (e) => {
        if (!disabled) {
            e.currentTarget.style.background = currentVariant.hoverBackground;
            e.currentTarget.style.boxShadow = currentVariant.hoverShadow;
        }
    };

    const handleMouseLeave = (e) => {
        if (!disabled) {
            e.currentTarget.style.background = currentVariant.background;
            e.currentTarget.style.boxShadow = currentVariant.boxShadow;
        }
    };

    const handleMouseDown = (e) => {
        if (!disabled) {
            e.currentTarget.style.transform = 'scale(0.98)';
        }
    };

    const handleMouseUp = (e) => {
        if (!disabled) {
            e.currentTarget.style.transform = 'scale(1)';
        }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            style={baseStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            {...props}
        >
            {children}
        </button>
    );
}
