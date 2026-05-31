import React from 'react'

const directionIcon = { positiv: '↑', negativ: '↓', neutral: '→' }
const directionColor = { positiv: 'text-conf-high-fg', negativ: 'text-conf-low-fg', neutral: 'text-muted-foreground' }
const weightDot = { hög: 'bg-foreground', medel: 'bg-muted-foreground', låg: 'bg-border' }

export default function AIRecommendationCard({ caseData }) {
  const { company, orgNr, amount, purpose, aiRecommendation, topFactors } = caseData

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      {/* AI-label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-strong bg-accent-subtle border border-accent-border px-2 py-0.5 rounded-sm">
          AI-förslag
        </span>
        <span className="text-xs text-muted-foreground/60">– inte ett beslut</span>
      </div>

      {/* Case meta */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-4 text-sm">
        <div>
          <span className="text-muted-foreground/60">Företag</span>
          <p className="font-medium text-foreground">{company}</p>
        </div>
        <div>
          <span className="text-muted-foreground/60">Org.nr</span>
          <p className="font-medium text-foreground">{orgNr}</p>
        </div>
        <div>
          <span className="text-muted-foreground/60">Belopp</span>
          <p className="font-medium text-foreground">
            {amount.toLocaleString('sv-SE')} kr
          </p>
        </div>
        <div>
          <span className="text-muted-foreground/60">Ändamål</span>
          <p className="font-medium text-foreground">{purpose}</p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="flex items-center gap-3 rounded-md bg-conf-low-surface border border-conf-low-border px-4 py-3 mb-4">
        <span className="text-conf-low-fg text-xl font-bold">✕</span>
        <div>
          <p className="text-xs text-conf-low-fg uppercase tracking-wide font-semibold">AI rekommenderar</p>
          <p className="text-lg font-bold text-conf-low-fg">{aiRecommendation}</p>
        </div>
      </div>

      {/* Top 3 factors */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Top 3 faktorer
        </p>
        <div className="space-y-2">
          {topFactors.map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${weightDot[f.weight] ?? 'bg-muted-foreground'}`} />
              <span className="flex-1 text-muted-foreground">{f.factor}</span>
              <span className={`font-semibold tabular-nums ${directionColor[f.direction] ?? ''}`}>
                {directionIcon[f.direction]} {f.value}
              </span>
              <span className="text-xs text-muted-foreground/60 w-10 text-right">{f.weight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
