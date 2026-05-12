import { useState } from 'react'
import { STAGES, FARM_INFO } from '../../data/siteData'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatKsh(n) {
  return 'KSh ' + Number(n).toLocaleString()
}

export default function SeasonReport({ season, onComplete, onBack }) {
  const [sellPrice, setSellPrice] = useState('')
  const [priceMode, setPriceMode] = useState('sack') // 'sack' or 'kg'
  const [error, setError] = useState('')

  const stages = season.stages
  const totalExpenses = STAGES.reduce((sum, s) => sum + (stages[s.id]?.cost || 0), 0)
  const harvest = stages['harvesting']
  const sacks = harvest?.sacks || 0
  const plantingDate = stages['planting']?.date
  const harvestDate = harvest?.date

  const pricePerSack = priceMode === 'sack'
    ? Number(sellPrice)
    : Number(sellPrice) * 90 // 90kg per sack

  const revenue = pricePerSack * sacks
  const profit = revenue - totalExpenses
  const profitPositive = profit >= 0

  // Most expensive stage
  const mostExpensive = STAGES.reduce((max, s) => {
    const c = stages[s.id]?.cost || 0
    return c > (max.cost || 0) ? { label: s.label, cost: c } : max
  }, { label: '', cost: 0 })

  const allStagesDone = STAGES.every(s => stages[s.id])

  const handleComplete = () => {
    if (!sellPrice || isNaN(sellPrice) || Number(sellPrice) <= 0) {
      return setError('Enter a valid selling price.')
    }
    setError('')
    onComplete(pricePerSack)
  }

  if (!allStagesDone) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem 1.25rem' }}>
        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</p>
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', color: '#F5EDD8', marginBottom: '0.5rem' }}>
          Season In Progress
        </p>
        <p style={{ fontSize: '0.85rem', color: '#C8BC9E' }}>
          Complete all 5 stages to generate the season report.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Report Card */}
      <div
        className="card"
        style={{
          borderColor: 'rgba(212,168,67,0.4)',
          background: 'linear-gradient(145deg, #243824, #1e341e)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <p className="overline" style={{ marginBottom: '0.25rem' }}>Season Report</p>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: '1.8rem',
            textTransform: 'uppercase',
            color: '#F5EDD8',
            lineHeight: 1.1,
          }}>
            {FARM_INFO.name}<br />
            <span style={{ color: '#D4A843' }}>Season {season.year}</span>
          </h2>
        </div>

        <hr className="divider" />

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          {[
            { label: 'Location', val: FARM_INFO.location },
            { label: 'Land Size', val: FARM_INFO.size },
            { label: 'Crop', val: FARM_INFO.crop },
            { label: 'Planting Date', val: formatDate(plantingDate) },
            { label: 'Harvest Date', val: formatDate(harvestDate) },
            { label: 'Sacks Harvested', val: `${sacks} sacks` },
            { label: 'Avg per Acre', val: `${(sacks / 6).toFixed(1)} sacks/acre` },
          ].map(item => (
            <div key={item.label}>
              <p style={{ fontSize: '0.65rem', color: '#C8BC9E', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.label}</p>
              <p style={{ fontSize: '0.9rem', color: '#F5EDD8', fontWeight: 500 }}>{item.val}</p>
            </div>
          ))}
        </div>

        <hr className="divider" />

        {/* Expense breakdown */}
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8BC9E', marginBottom: '0.6rem' }}>
            Expense Breakdown
          </p>
          {STAGES.map(s => {
            const cost = stages[s.id]?.cost || 0
            return (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0', borderBottom: '1px solid rgba(46,74,46,0.5)' }}>
                <span style={{ fontSize: '0.85rem', color: '#C8BC9E' }}>{s.icon} {s.label}</span>
                <span style={{ fontSize: '0.85rem', color: cost === mostExpensive.cost ? '#D4A843' : '#F5EDD8', fontWeight: cost === mostExpensive.cost ? 600 : 400 }}>
                  {formatKsh(cost)}
                </span>
              </div>
            )
          })}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#F5EDD8' }}>Total Expenses</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#E53935' }}>{formatKsh(totalExpenses)}</span>
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#C8BC9E', marginBottom: '0.3rem' }}>
          Most expensive activity: <span style={{ color: '#D4A843' }}>{mostExpensive.label} — {formatKsh(mostExpensive.cost)}</span>
        </p>

        <hr className="divider" />

        {/* Selling price input */}
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8BC9E', marginBottom: '0.6rem' }}>
            Selling Price
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
            {['sack', 'kg'].map(mode => (
              <button
                key={mode}
                onClick={() => setPriceMode(mode)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: 6,
                  border: priceMode === mode ? '1px solid #D4A843' : '1px solid #2E4A2E',
                  background: priceMode === mode ? 'rgba(212,168,67,0.15)' : 'transparent',
                  color: priceMode === mode ? '#D4A843' : '#C8BC9E',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Per {mode === 'sack' ? '90kg Sack' : 'Kg'}
              </button>
            ))}
          </div>
          <input
            type="number"
            inputMode="numeric"
            className="form-input"
            placeholder={priceMode === 'sack' ? 'e.g. 4500' : 'e.g. 50'}
            value={sellPrice}
            onChange={e => { setSellPrice(e.target.value); setError('') }}
          />
          {error && <p style={{ fontSize: '0.8rem', color: '#E53935', marginTop: '0.3rem' }}>{error}</p>}
        </div>

        {/* Revenue + Profit preview */}
        {sellPrice && !isNaN(sellPrice) && Number(sellPrice) > 0 && (
          <div
            style={{
              background: profitPositive ? 'rgba(76,175,80,0.1)' : 'rgba(229,57,53,0.1)',
              border: `1px solid ${profitPositive ? 'rgba(76,175,80,0.3)' : 'rgba(229,57,53,0.3)'}`,
              borderRadius: 10,
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#C8BC9E' }}>Revenue ({sacks} sacks)</span>
              <span style={{ fontSize: '0.85rem', color: '#F5EDD8' }}>{formatKsh(revenue)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#C8BC9E' }}>Total Expenses</span>
              <span style={{ fontSize: '0.85rem', color: '#E53935' }}>− {formatKsh(totalExpenses)}</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: '#F5EDD8' }}>
                {profitPositive ? 'Profit' : 'Loss'}
              </span>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: profitPositive ? '#4CAF50' : '#E53935' }}>
                {formatKsh(Math.abs(profit))}
              </span>
            </div>
            <p style={{
              textAlign: 'center',
              marginTop: '0.75rem',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: profitPositive ? '#4CAF50' : '#E53935',
            }}>
              {profitPositive ? '✅ Profitable Season' : '❌ Loss-Making Season'}
            </p>
          </div>
        )}

        <button className="btn-primary" onClick={handleComplete}>
          ✓ Complete & Archive Season
        </button>
        <p style={{ fontSize: '0.75rem', color: '#4A6A4A', textAlign: 'center', marginTop: '0.5rem' }}>
          This will save the season to your records.
        </p>
      </div>
    </div>
  )
}