import { AlertTriangle } from 'lucide-react'

// Skuldsättningsgrad: zoner 0–1.5x (grön), 1.5–2.5x (orange), 2.5–4.0x (röd)
// Skala: 0 till 6.0x, branschmedian 1.8x

const SCALE_MAX = 6.0
const ZONES = [
  { from: 0, to: 1.5, color: '#DCFCE7', label: 'Låg risk' },
  { from: 1.5, to: 2.5, color: '#FFEDD5', label: 'Förhöjd risk' },
  { from: 2.5, to: 6.0, color: '#FEE2E2', label: 'Överstiger gräns' },
]

function pct(value) {
  return Math.min(1, Math.max(0, value / SCALE_MAX)) * 100
}

export default function DebtRatioZoneCard({
  value = 2.4,
  industryMedian = 1.8,
  source = 'Årsredovisning 2022',
  sourceStale = true,
}) {
  const markerPct = pct(value)
  const medianPct = pct(industryMedian)

  // Avgör vilken zon värdet befinner sig i
  const zone = value < 1.5 ? 'låg' : value < 2.5 ? 'förhöjd' : 'hög'
  const isNegative = zone !== 'låg'

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#111827', lineHeight: 1 }}>
            {value}x
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 9999,
              background: zone === 'hög' ? '#FEF2F2' : zone === 'förhöjd' ? '#FFF7ED' : '#ECFDF5',
              color: zone === 'hög' ? '#DC2626' : zone === 'förhöjd' ? '#C2410C' : '#065F46',
            }}
          >
            {zone === 'hög' ? '↑ Överstiger gräns' : zone === 'förhöjd' ? '↑ Förhöjd risk' : 'Låg risk'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>Skuldkvot</p>
      </div>

      {/* Gauge */}
      <div style={{ padding: '0 16px 14px' }}>
        {/* Zonbar */}
        <div
          style={{
            position: 'relative',
            height: 20,
            display: 'flex',
            overflow: 'visible',
          }}
        >
          {ZONES.map((z, i) => (
            <div
              key={i}
              style={{
                width: `${pct(z.to) - pct(z.from)}%`,
                background: z.color,
                borderRadius: i === 0 ? '4px 0 0 4px' : i === ZONES.length - 1 ? '0 4px 4px 0' : 0,
                border: '1px solid #E5E7EB',
                borderLeft: i > 0 ? 'none' : '1px solid #E5E7EB',
              }}
            />
          ))}

          {/* Branschmedian-markör */}
          <div
            style={{
              position: 'absolute',
              left: `${medianPct}%`,
              top: 0,
              bottom: 0,
              width: 2,
              background: '#6B7280',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Positionsmarkör (triangel) vid aktuellt värde */}
          <div
            style={{
              position: 'absolute',
              left: `${markerPct}%`,
              top: -10,
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '8px solid #111827',
            }}
          />
        </div>

        {/* Etiketter under baren */}
        <div style={{ position: 'relative', height: 48, marginTop: 4 }}>
          <span style={{ position: 'absolute', left: 0, fontSize: 11, color: '#6B7280' }}>
            0
          </span>

          {/* Värdemarkör */}
          <span
            style={{
              position: 'absolute',
              left: `${markerPct}%`,
              transform: 'translateX(-50%)',
              fontSize: 12,
              fontWeight: 700,
              color: '#111827',
              whiteSpace: 'nowrap',
            }}
          >
            {value}x
          </span>

          {/* Branschmedian-label */}
          <span
            style={{
              position: 'absolute',
              left: `${medianPct}%`,
              transform: 'translateX(-50%)',
              top: 16,
              fontSize: 10,
              color: '#6B7280',
              whiteSpace: 'nowrap',
            }}
          >
            Bransch {industryMedian}x
          </span>

          <span style={{ position: 'absolute', right: 0, fontSize: 11, color: '#6B7280' }}>
            6.0x
          </span>
        </div>

        {/* Zonlabels */}
        <div style={{ display: 'flex', fontSize: 10, color: '#9CA3AF', gap: 4, marginTop: 4 }}>
          <span style={{ width: `${pct(1.5)}%`, textAlign: 'left' }}>Låg risk</span>
          <span style={{ width: `${pct(2.5) - pct(1.5)}%`, textAlign: 'center' }}>Förhöjd risk</span>
          <span style={{ width: `${pct(6.0) - pct(2.5)}%`, textAlign: 'right' }}>Överstiger gräns</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #E5E7EB', padding: '10px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 9999,
              background: '#EEF2FF',
              color: '#4338CA',
            }}
          >
            ✦ AI-analys
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              {source}
            </span>
            {sourceStale ? (
              <AlertTriangle size={10} style={{ color: '#F97316', flexShrink: 0 }} />
            ) : (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 500, padding: '2px 9px',
                borderRadius: 9999, background: 'var(--c-green-light)',
                color: 'var(--c-green)', border: '1px solid var(--c-green-border)'
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Aktuell
              </span>
            )}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <span style={{ fontSize: 11, color: '#6B7280' }}>Vikt i beslut</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3].map(i => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: i <= 1 ? '#4338CA' : '#E5E7EB'
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
