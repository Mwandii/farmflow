import { FARM_INFO } from '../../data/siteData'

export default function Navbar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(26, 46, 26, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2E4A2E',
        padding: '0.9rem 1rem',
      }}
    >
      <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.4rem' }}>🌽</span>
        <div>
          <p className="overline" style={{ fontSize: '0.62rem' }}>{FARM_INFO.location}</p>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#F5EDD8',
              lineHeight: 1,
            }}
          >
            {FARM_INFO.name}
          </h1>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <p style={{ fontSize: '0.7rem', color: '#C8BC9E', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {FARM_INFO.size} · {FARM_INFO.crop}
          </p>
        </div>
      </div>
    </header>
  )
}