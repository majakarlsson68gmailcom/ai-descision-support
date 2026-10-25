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
  hög:     { bg: 'hsl(var(--conf-low-bg))', text: 'hsl(var(--conf-low-fg))' },
  medel:   { bg: 'hsl(var(--muted))', text: 'hsl(var(--muted-foreground))' },
  positiv: { bg: 'hsl(var(--conf-high-bg))', text: 'hsl(var(--conf-high-fg))' },
}

export default function SparklineCard({ value = '+12%', direction = 'positiv', label = 'Omsättningstillväxt', source = 'Årsredovisning 2022–2024', sourceStale = false, impact = 'medel' }) {
  const isPositive = direction === 'positiv'
  const impactStyle = IMPACT_STYLE[impact] ?? IMPACT_STYLE.medel
  const impactLabel = impact === 'hög' ? 'Hög negativ' : impact === 'positiv' ? 'Positiv' : 'Medel'

  const rootStyle = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null
  const tokenColor = (v, fallback) => rootStyle ? `hsl(${rootStyle.getPropertyValue(v).trim()})` : fallback
  const trendSolid = isPositive ? tokenColor('--conf-high-solid', '#10B981') : tokenColor('--conf-low-solid', '#DC2626')
  const trendBg = isPositive ? '--conf-high-bg' : '--conf-low-bg'

  return (
    <div
      style={{
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: 'hsl(var(--foreground))', lineHeight: 1 }}>
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
              background: isPositive ? 'hsl(var(--conf-high-bg))' : 'hsl(var(--conf-low-bg))',
              color: isPositive ? 'hsl(var(--conf-high-fg))' : 'hsl(var(--conf-low-fg))',
            }}
          >
            {isPositive ? '↑' : '↓'} {isPositive ? 'Positiv trend' : 'Negativ trend'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginBottom: 10 }}>{label}</p>
      </div>

      {/* Sparkline */}
      <div style={{ height: 60 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tokenColor(trendBg, '#10B981')} stopOpacity={0.6} />
                <stop offset="100%" stopColor={tokenColor(trendBg, '#10B981')} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={trendSolid}
              strokeWidth={1.5}
              fill="url(#sparkGradient)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI-badge sektion */}
      <div style={{ borderTop: '1px solid hsl(var(--border))', padding: '10px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>

          {/* AI-källbadge */}
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 9999,
              background: 'hsl(var(--accent-subtle))',
              color: 'hsl(var(--accent-strong))',
            }}
          >
            ✦ AI-analys
          </span>

          {/* Källa */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
            Källa: {source}
            {sourceStale && (
              <AlertTriangle size={10} style={{ color: 'hsl(var(--dq-stale-solid))', flexShrink: 0 }} />
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
