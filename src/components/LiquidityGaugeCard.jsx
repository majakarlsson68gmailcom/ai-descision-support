import { AlertTriangle } from 'lucide-react'

// Likviditetsgrad: zoner 0–0.75 (röd), 0.75–1.0 (orange), 1.0–2.0 (grön)
// Skala: 0 till 2.0, kritisk gräns vid 1.0

const SCALE_MAX = 2.0
const THRESHOLD = 1.0
const ZONES = [
  { from: 0,    to: 0.75, color: '#FEE2E2', label: 'Kritisk' },
  { from: 0.75, to: 1.0,  color: '#FFEDD5', label: 'Varning' },
  { from: 1.0,  to: 2.0,  color: '#DCFCE7', label: 'OK' },
]

function pct(value) {
  return Math.min(1, Math.max(0, value / SCALE_MAX)) * 100
}

export default function LiquidityGaugeCard({
  value = 0.8,
  source = 'Årsredovisning 2022',
  sourceStale = true,
  impact = 'hög',
}) {
  const markerPct = pct(value)
  const isNegative = value < THRESHOLD

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
            {value}
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
              background: isNegative ? '#FEF2F2' : '#ECFDF5',
              color: isNegative ? '#DC2626' : '#065F46',
            }}
          >
            {isNegative ? '↓' : '↑'} {isNegative ? 'Under kritisk gräns' : 'Godkänd nivå'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>Likviditetsgrad</p>
      </div>

      {/* Gauge */}
      <div style={{ padding: '0 16px 14px' }}>
        {/* Zonbar */}
        <div
          style={{
            position: 'relative',
            height: 20,
            borderRadius: 4,
            overflow: 'visible',
            display: 'flex',
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

          {/* Tröskelmarkör vid 1.0 */}
          <div
            style={{
              position: 'absolute',
              left: `${pct(THRESHOLD)}%`,
              top: -4,
              bottom: -4,
              width: 2,
              background: '#374151',
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
        <div style={{ position: 'relative', height: 32, marginTop: 4 }}>
          <span
            style={{
              position: 'absolute',
              left: 0,
              fontSize: 11,
              color: '#6B7280',
            }}
          >
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
            {value}
          </span>

          {/* Tröskelmarkör-label */}
          <span
            style={{
              position: 'absolute',
              left: `${pct(THRESHOLD)}%`,
              transform: 'translateX(-50%)',
              fontSize: 11,
              color: '#374151',
              whiteSpace: 'nowrap',
              marginTop: 16,
              top: 14,
            }}
          >
            Kritisk gräns 1.0
          </span>

          <span
            style={{
              position: 'absolute',
              right: 0,
              fontSize: 11,
              color: '#6B7280',
            }}
          >
            2.0
          </span>
        </div>

        {/* Zonlabels */}
        <div style={{ display: 'flex', fontSize: 10, color: '#9CA3AF', gap: 4, marginTop: 2 }}>
          <span style={{ flex: `${pct(0.75)}`, textAlign: 'left' }}>Kritisk</span>
          <span style={{ flex: `${pct(1.0) - pct(0.75)}`, textAlign: 'center' }}>Varning</span>
          <span style={{ flex: `${pct(2.0) - pct(1.0)}`, textAlign: 'right' }}>OK</span>
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
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#6B7280' }}>
            Källa: {source}
            {sourceStale && <AlertTriangle size={10} style={{ color: '#F97316', flexShrink: 0 }} />}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 9999,
              background: '#FEF2F2',
              color: '#DC2626',
            }}
          >
            Påverkan: Hög negativ
          </span>
        </div>
      </div>
    </div>
  )
}
