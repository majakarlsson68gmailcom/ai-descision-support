import React from 'react'
import { colors } from '../tokens'

const levelLabel = { high: 'Hög', medium: 'Medel', low: 'Låg' }

export default function ConfidenceIndicator({ level, reasons }) {
  const c = colors[level] ?? colors.low

  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} p-4`}>
      <div className="flex items-center gap-3">
        <span className={`inline-block w-3 h-3 rounded-full flex-shrink-0 ${c.dot}`} />
        <span className={`text-sm font-semibold uppercase tracking-wide ${c.text}`}>
          Konfidens – {levelLabel[level]}
        </span>
        <span className={`ml-auto text-sm font-medium ${c.text}`}>
          {c.label}
        </span>
      </div>
      {reasons && reasons.length > 0 && (
        <ul className="mt-3 space-y-1">
          {reasons.map((r, i) => (
            <li key={i} className={`flex items-start gap-2 text-sm ${c.text}`}>
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
