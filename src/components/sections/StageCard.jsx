import { useState } from 'react'
import { STAGES } from '../../data/siteData'

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatKsh(n) {
  if (!n) return '—'
  return 'KSh ' + Number(n).toLocaleString()
}

function getStageBadge(stageId, stageDef, stages) {
  const done = stages[stageId]
  if (done) return { label: 'Done', cls: 'badge-done' }

  const plantingDate = stages['planting']?.date
  if (stageDef.scheduleDays && plantingDate) {
    const suggestedDate = new Date(addDays(plantingDate, stageDef.scheduleDays))
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (suggestedDate <= today) return { label: 'Due', cls: 'badge-due' }
  }
  return { label: 'Pending', cls: 'badge-pending' }
}

export default function StageCard({ stageId, stages, onLog }) {
  const stageDef = STAGES.find(s => s.id === stageId)
  const stageData = stages[stageId]
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ date: '', cost: '', sacks: '' })
  const [error, setError] = useState('')

  const plantingDate = stages['planting']?.date

  const suggestedDate = (stageDef.scheduleDays && plantingDate)
    ? addDays(plantingDate, stageDef.scheduleDays)
    : null

  const badge = getStageBadge(stageId, stageDef, stages)

  // Lock stages that depend on planting if planting isn't done
  const isLocked = stageId !== 'landPrep' && stageId !== 'planting' && !plantingDate

  const handleSubmit = () => {
    if (!form.date) return setError('Please enter the date.')
    if (!form.cost || isNaN(form.cost) || Number(form.cost) < 0) return setError('Please enter a valid cost.')
    if (stageId === 'harvesting' && (!form.sacks || isNaN(form.sacks) || Number(form.sacks) <= 0)) return setError('Please enter number of sacks harvested.')
    setError('')
    onLog(stageId, {
      date: form.date,
      cost: Number(form.cost),
      ...(stageId === 'harvesting' ? { sacks: Number(form.sacks) } : {}),
    })
    setOpen(false)
  }

  return (
    <div
      className="card"
      style={{
        borderColor: stageData ? 'rgba(76,175,80,0.3)' : badge.cls === 'badge-due' ? 'rgba(255,152,0,0.3)' : '#2E4A2E',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem', lineHeight: 1, marginTop: 2 }}>{stageDef.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              color: '#F5EDD8',
            }}>
              {stageDef.label}
            </h3>
            <span className={badge.cls}>{badge.label}</span>
          </div>

          {/* If done, show summary */}
          {stageData ? (
            <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#C8BC9E', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Date</p>
                <p style={{ fontSize: '0.9rem', color: '#F5EDD8' }}>{formatDate(stageData.date)}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#C8BC9E', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Cost</p>
                <p style={{ fontSize: '0.9rem', color: '#D4A843', fontWeight: 600 }}>{formatKsh(stageData.cost)}</p>
              </div>
              {stageData.sacks && (
                <div>
                  <p style={{ fontSize: '0.65rem', color: '#C8BC9E', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sacks</p>
                  <p style={{ fontSize: '0.9rem', color: '#F5EDD8' }}>{stageData.sacks} sacks</p>
                </div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: '0.82rem', color: '#C8BC9E', marginTop: '0.25rem' }}>{stageDef.description}</p>
          )}

          {/* Suggested date */}
          {!stageData && suggestedDate && (
            <p style={{ fontSize: '0.75rem', color: '#FF9800', marginTop: '0.3rem' }}>
              📅 Suggested: {formatDate(suggestedDate)}
            </p>
          )}
          {!stageData && isLocked && (
            <p style={{ fontSize: '0.75rem', color: '#4A6A4A', marginTop: '0.3rem' }}>
              Log planting first to unlock this stage.
            </p>
          )}
        </div>

        {/* Log / Edit button */}
        {!isLocked && (
          <button
            onClick={() => {
              if (stageData) {
                setForm({ date: stageData.date, cost: String(stageData.cost), sacks: stageData.sacks ? String(stageData.sacks) : '' })
              }
              setOpen(o => !o)
            }}
            style={{
              background: 'none',
              border: '1px solid #2E4A2E',
              borderRadius: 6,
              color: '#C8BC9E',
              fontSize: '0.75rem',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '0.3rem 0.6rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {stageData ? 'Edit' : 'Log'}
          </button>
        )}
      </div>

      {/* Inline form */}
      {open && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #2E4A2E' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={form.date}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label className="form-label">Total Cost (KSh)</label>
              <input
                type="number"
                inputMode="numeric"
                className="form-input"
                placeholder="e.g. 12000"
                value={form.cost}
                onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
              />
            </div>
            {stageId === 'harvesting' && (
              <div>
                <label className="form-label">Sacks Harvested (90 kg sacks)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="form-input"
                  placeholder="e.g. 34"
                  value={form.sacks}
                  onChange={e => setForm(f => ({ ...f, sacks: e.target.value }))}
                />
              </div>
            )}
            {error && <p style={{ fontSize: '0.82rem', color: '#E53935' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-primary" onClick={handleSubmit} style={{ flex: 1 }}>Save</button>
              <button
                onClick={() => { setOpen(false); setError('') }}
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
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}