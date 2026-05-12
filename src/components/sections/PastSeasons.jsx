import { useState } from 'react'
import { STAGES, FARM_INFO } from '../../data/siteData'
import FadeIn from '../ui/FadeIn'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatKsh(n) {
  return 'KSh ' + Number(n).toLocaleString()
}

function SeasonSummary({ season }) {
  const [expanded, setExpanded] = useState(false)
  const stages = season.stages

  const totalExpenses = STAGES.reduce((sum, s) => sum + (stages[s.id]?.cost || 0), 0)
  const sacks = stages['harvesting']?.sacks || 0
  const revenue = (season.sellPricePerSack || 0) * sacks
  const profit = revenue - totalExpenses
  const profitPositive = profit >= 0

  const mostExpensive = STAGES.reduce((max, s) => {
    const c = stages[s.id]?.cost || 0
    return c > (max.cost || 0) ? { label: s.label, cost: c } : max
  }, { label: '', cost: 0 })

  return (
    <div
      className="card"
      style={{ borderColor: profitPositive ? 'rgba(76,175,80,0.2)' : 'rgba(229,57,53,0.2)', cursor: 'pointer' }}
      onClick={() => setExpanded(e => !e)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className="overline" style={{ marginBottom: '0.2rem' }}>Season {season.year}</p>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '1.2rem',
            textTransform: 'uppercase',
            color: '#F5EDD8',
          }}>
            {sacks} Sacks Harvested
          </p>
          <p style={{ fontSize: '0.8rem', color: '#C8BC9E', marginTop: '0.2rem' }}>
            {formatDate(stages['planting']?.date)} → {formatDate(stages['harvesting']?.date)}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: profitPositive ? '#4CAF50' : '#E53935' }}>
            {profitPositive ? '+' : '-'}{formatKsh(Math.abs(profit))}
          </p>
          <p style={{ fontSize: '0.7rem', color: '#C8BC9E', marginTop: '0.1rem' }}>{profitPositive ? 'Profit' : 'Loss'}</p>
          <p style={{ fontSize: '0.8rem', color: '#C8BC9E', marginTop: '0.3rem' }}>{expanded ? '▲' : '▼'}</p>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #2E4A2E' }}>
          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.75rem' }}>
            {[
              { label: 'Land Size', val: FARM_INFO.size },
              { label: 'Avg/Acre', val: `${(sacks / 6).toFixed(1)} sacks` },
              { label: 'Total Expenses', val: formatKsh(totalExpenses) },
              { label: 'Revenue', val: formatKsh(revenue) },
              { label: 'Sell Price', val: season.sellPricePerSack ? formatKsh(season.sellPricePerSack) + '/sack' : '—' },
              { label: 'Most Expensive', val: mostExpensive.label },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontSize: '0.62rem', color: '#C8BC9E', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.label}</p>
                <p style={{ fontSize: '0.85rem', color: '#F5EDD8' }}>{item.val}</p>
              </div>
            ))}
          </div>

          {/* Stage breakdown */}
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8BC9E', marginBottom: '0.4rem' }}>
            Stage Costs
          </p>
          {STAGES.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid rgba(46,74,46,0.5)' }}>
              <span style={{ fontSize: '0.82rem', color: '#C8BC9E' }}>{s.icon} {s.label}</span>
              <span style={{ fontSize: '0.82rem', color: '#F5EDD8' }}>{formatKsh(stages[s.id]?.cost || 0)}</span>
            </div>
          ))}

          <p style={{
            textAlign: 'center',
            marginTop: '0.75rem',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '0.95rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: profitPositive ? '#4CAF50' : '#E53935',
          }}>
            {profitPositive ? '✅ Profitable Season' : '❌ Loss-Making Season'}
          </p>
        </div>
      )}
    </div>
  )
}

export default function PastSeasons({ seasons }) {
  if (!seasons.length) return null

  return (
    <div style={{ marginTop: '2rem' }}>
      <FadeIn>
        <p className="overline" style={{ marginBottom: '0.4rem' }}>Past Seasons</p>
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>
          Season History
        </h2>
      </FadeIn>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {seasons.map((s, i) => (
          <FadeIn key={s.id} delay={i * 60}>
            <SeasonSummary season={s} />
          </FadeIn>
        ))}
      </div>
    </div>
  )
}