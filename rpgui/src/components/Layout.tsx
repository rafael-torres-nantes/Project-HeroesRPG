import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', color: '#d8d8d8' }}>
      <header className="halftone-header" style={{
        background: '#080808',
        borderBottom: '1px solid #1a1a1a',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div className="font-impact" style={{ color: '#d8d8d8', fontSize: '18px', letterSpacing: '4px' }}>
          H.I.K.{' '}
          <span style={{ color: '#444', fontSize: '12px', fontWeight: 400, letterSpacing: '1px', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>v2.0</span>
        </div>
      </header>
      <main className="halftone-page" style={{ minHeight: 'calc(100vh - 52px)' }}>
        {children}
      </main>
    </div>
  )
}
