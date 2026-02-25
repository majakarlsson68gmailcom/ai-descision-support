import { AlertTriangle } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

const trendData = [
  { period: 'Q3 2023', value: 4  },
  { period: 'Q4 2023', value: 6  },
  { period: 'Q1 2024', value: 5  },
  { period: 'Q2 2024', value: 8  },
  { period: 'Q3 2024', value: 10 },
  { period: 'Q4 2024', value: 12 },
]

const IMPACT_STYLE = {
  hög:     { bg: '#FEF2F2', text: '#DC2626' },
  medel:   { bg: '#F3F4F6', text: '#4B5563' },
  positiv: { bg: '#ECFDF5', text: '#065F46' },
}

export default function SparklineCard({ value = '+12%', direction = 'positiv', label = 'Omsättningstillväxt', source = 'Årsredovisning 2022–2024', sourceStale = false, impact = 'medel' }) {
  const isPositive = direction === 'positiv'
  const impactStyle = IMPACT_STYLE[impact] ?? IMPACT_STYLE.medel
  const impactLabel = impact === 'hög' ? 'Hög negativ' : impact === 'positiv' ? 'Positiv' : 'Medel'

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
              background: isPositive ? '#ECFDF5' : '#FEF2F2',
              color: isPositive ? '#065F46' : '#DC2626',
            }}
          >
            {isPositive ? '↑' : '↓'} {isPositive ? 'Positiv trend' : 'Negativ trend'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 10 }}>{label}</p>
      </div>

      {/* Sparkline */}
      <div style={{ height: 60 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={1.5}
              fill="url(#sparkGradient)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI-badge sektion */}
      <div style={{ borderTop: '1px solid #E5E7EB', padding: '10px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>

          {/* AI-källbadge */}
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

          {/* Källa */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#6B7280' }}>
            Källa: {source}
            {sourceStale && (
              <AlertTriangle size={10} style={{ color: '#F97316', flexShrink: 0 }} />
            )}
          </span>

          {/* Påverkan */}
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 9999,
              background: impactStyle.bg,
              color: impactStyle.text,
            }}
          >
            Påverkan: {impactLabel}
          </span>

        </div>
      </div>
    </div>
  )
}
