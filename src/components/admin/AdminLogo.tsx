import React from 'react'

export const AdminLogo: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: 'inherit',
        textDecoration: 'none',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #465640 0%, #2f3a2b 100%)',
          color: '#ffffff',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 700,
          fontSize: '16px',
          letterSpacing: '-0.5px',
          boxShadow: '0 2px 8px rgba(70, 86, 64, 0.35)',
        }}
      >
        F
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: '17px',
            fontWeight: 700,
            letterSpacing: '-0.4px',
            lineHeight: 1.15,
            color: 'var(--theme-elevation-1000, #1a1c18)',
          }}
        >
          fieldnotes
        </span>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--theme-elevation-500, #788466)',
          }}
        >
          Studio CMS
        </span>
      </div>
    </div>
  )
}

export default AdminLogo
