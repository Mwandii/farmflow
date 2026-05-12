import { useState } from 'react'
import { FARM_INFO } from '../data/siteData'
import FadeIn from '../components/ui/FadeIn'

export default function Home({ onStart }) {
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [error, setError] = useState('')

  const handleStart = () => {
    if (!year || isNaN(year) || year.length !== 4) return setError('Enter a valid year e.g. 2026')
    setError('')
    onStart(year)
  }

  return (
    <div style={{ paddingTop: '2rem' }}>
      {/* Hero */}
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🌽</p>
          <p className="overline" style={{ marginBottom: '0.4rem' }}>Kiriku, Kwale County</p>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: '2.8rem',
              textTransform: 'uppercase',
              color: '#F5EDD8',
              lineHeight: 1.05,
              marginBottom: '0.5rem',
            }}
          >
            Kiriku<br />
            <span style={{ color: '#D4A843' }}>Farm Tracker</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#C8BC9E', maxWidth: 280, margin: '0 auto', lineHeight: 1.6 }}>
            Track every season from land prep to harvest. Know your costs, your yield, and your profit.
          </p>
        </div>
      </FadeIn>

      {/* Farm info card */}
      <FadeIn delay={100}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <p className="overline" style={{ marginBottom: '0.75rem' }}>Your Shamba</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { icon: '📍', label: 'Location', val: 'Kiriku' },
              { icon: '📐', label: 'Size', val: FARM_INFO.size },
              { icon: '🌽', label: 'Crop', val: FARM_INFO.crop },
              { icon: '☀️', label: 'Season', val: 'Long Rains' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: '0.62rem', color: '#C8BC9E', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.label}</p>
                  <p style={{ fontSize: '0.9rem', color: '#F5EDD8', fontWeight: 500 }}>{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Start season */}
      <FadeIn delay={160}>
        <div className="card">
          <p className="overline" style={{ marginBottom: '0.75rem' }}>Start New Season</p>
          <div style={{ marginBottom: '0.75rem' }}>
            <label className="form-label">Season Year</label>
            <input
              type="number"
              inputMode="numeric"
              className="form-input"
              placeholder="e.g. 2026"
              value={year}
              onChange={e => { setYear(e.target.value); setError('') }}
              maxLength={4}
            />
            {error && <p style={{ fontSize: '0.8rem', color: '#E53935', marginTop: '0.3rem' }}>{error}</p>}
          </div>
          <button className="btn-primary" onClick={handleStart}>
            🌱 Start Season {year}
          </button>
        </div>
      </FadeIn>

      {/* How it works */}
      <FadeIn delay={220}>
        <div style={{ marginTop: '2rem' }}>
          <p className="overline" style={{ marginBottom: '0.75rem' }}>How It Works</p>
          {[
            { n: '01', title: 'Log Each Stage', desc: 'Record date and cost for land prep, planting, weeding, and harvest.' },
            { n: '02', title: 'Get Reminders', desc: 'The app tells you when weeding and harvest are due based on your planting date.' },
            { n: '03', title: 'See Your Report', desc: 'Enter your selling price and see your total profit or loss for the season.' },
            { n: '04', title: 'Keep History', desc: 'Past seasons are saved so you can compare year over year.' },
          ].map((item) => (
            <div key={item.n} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: '1.6rem',
                color: '#2E4A2E',
                lineHeight: 1,
                minWidth: 32,
              }}>
                {item.n}
              </span>
              <div>
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', color: '#F5EDD8', marginBottom: '0.1rem' }}>{item.title}</p>
                <p style={{ fontSize: '0.82rem', color: '#C8BC9E', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  )
}