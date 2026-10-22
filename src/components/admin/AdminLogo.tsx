import React from 'react'

export const AdminLogo: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontFamily: 'var(--font-sans, inherit)',
        textDecoration: 'none',
        padding: '4px 0',
      }}
    >
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          color: '#ffffff',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 800,
          fontSize: '15px',
          letterSpacing: '-0.5px',
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
          flexShrink: 0,
        }}
      >
        FN
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              color: 'var(--mad-text-primary, #0f172a)',
            }}
          >
            Fieldnotes
          </span>
          <span
            style={{
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#059669',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '1px 5px',
              borderRadius: '4px',
            }}
          >
            PRO
          </span>
        </div>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: 600,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            color: 'var(--mad-text-muted, #94a3b8)',
          }}
        >
          Studio Engine
        </span>
      </div>
    </div>
  )
}

export default AdminLogo
