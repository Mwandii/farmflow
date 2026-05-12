import { useState } from 'react'
import { STAGES } from '../../data/siteData'
import StageCard from './StageCard'
import SeasonReport from './SeasonReport'
import FadeIn from '../ui/FadeIn'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatKsh(n) {
  return 'KSh ' + Number(n).toLocaleString()
}

export default function ActiveSeason({ season, onLogStage, onComplete, onDelete }) {
  const [tab, setTab] = useState('stages') // 'stages' | 'report'
  const [confirmDelete, setConfirmDelete] = useState(false)

  const stages = season.stages
  const completedCount = STAGES.filter(s => stages[s.id]).length
  const totalExpenses = STAGES.reduce((sum, s) => sum + (stages[s.id]?.cost || 0), 0)
  const allDone = completedCount === STAGES.length

  return (
    <div>
      {/* Season header */}
      <FadeIn>
        <div style={{ padding: '1.25rem 0 0.75rem' }}>
          <p className="overline">Active Season</p>
          <h2 className="section-title" style={{ marginTop: '0.2rem' }}>
            Maize Season <span style={{ color: '#D4A843' }}>{season.year}</span>
          </h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.6rem' }}>
            <div>
              <p style={{ fontSize: '0.65rem', color: '#C8BC9E', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Stages</p>
              <p style={{ fontSize: '1rem', color: '#F5EDD8', fontWeight: 600 }}>{completedCount} / {STAGES.length}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', color: '#C8BC9E', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Spent So Far</p>
              <p style={{ fontSize: '1rem', color: '#D4A843', fontWeight: 600 }}>{totalExpenses > 0 ? formatKsh(totalExpenses) : '—'}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', color: '#C8BC9E', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Started</p>
              <p style={{ fontSize: '1rem', color: '#F5EDD8', fontWeight: 600 }}>{formatDate(season.startedAt)}</p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Progress bar */}
      <FadeIn delay={60}>
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ height: 6, background: '#2E4A2E', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(completedCount / STAGES.length) * 100}%`,
                background: 'linear-gradient(90deg, #D4A843, #E8C070)',
                borderRadius: 3,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      </FadeIn>

      {/* Tab switcher */}
      <FadeIn delay={80}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {['stages', 'report'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: 8,
                border: tab === t ? '1px solid #D4A843' : '1px solid #2E4A2E',
                background: tab === t ? 'rgba(212,168,67,0.15)' : 'transparent',
                color: tab === t ? '#D4A843' : '#C8BC9E',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {t === 'stages' ? '📋 Stages' : '📊 Report'}
              {t === 'report' && allDone && (
                <span style={{ marginLeft: '0.3rem', fontSize: '0.65rem', background: '#D4A843', color: '#1A2E1A', borderRadius: 3, padding: '0 0.25rem' }}>READY</span>
              )}
            </button>
          ))}
        </div>
      </FadeIn>

      {tab === 'stages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {STAGES.map((s, i) => (
            <FadeIn key={s.id} delay={i * 60}>
              <StageCard
                stageId={s.id}
                stages={stages}
                onLog={onLogStage}
              />
            </FadeIn>
          ))}

          {/* Delete season */}
          <FadeIn delay={400}>
            <div style={{ marginTop: '1rem' }}>
              {!confirmDelete ? (
                <button
                  className="btn-danger"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete This Season
                </button>
              ) : (
                <div className="card" style={{ borderColor: 'rgba(229,57,53,0.3)', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.9rem', color: '#F5EDD8', marginBottom: '1rem' }}>
                    Are you sure? All data for this season will be lost.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-danger" style={{ flex: 1 }} onClick={onDelete}>Yes, Delete</button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      style={{
                        flex: 1,
                        background: 'none',
                        border: '1px solid #2E4A2E',
                        borderRadius: 8,
                        color: '#C8BC9E',
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        padding: '0.8rem',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      )}

      {tab === 'report' && (
        <FadeIn>
          <SeasonReport
            season={season}
            onComplete={onComplete}
          />
        </FadeIn>
      )}
    </div>
  )
}