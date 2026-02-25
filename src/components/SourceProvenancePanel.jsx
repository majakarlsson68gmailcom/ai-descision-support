import React from 'react'
import { colors, statusLabels } from '../tokens'

function SourceRow({ source }) {
  const c = colors[source.status] ?? colors.ok
  const label = statusLabels[source.status] ?? source.status

  return (
    <div className="flex items-center gap-3 py-2.5 border-b last:border-b-0 border-gray-100">
      {/* Status badge */}
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border} flex-shrink-0`}
      >
        {source.status === 'ok' ? '✓' : '⚠'} {label}
      </span>

      {/* Name */}
      <span className="flex-1 text-sm text-gray-800">{source.name}</span>

      {/* Date + age */}
      <span className="text-xs text-gray-500 text-right">
        {source.date}
        {source.daysOld > 0 && (
          <span className={source.status === 'stale' ? 'ml-1 text-orange-600 font-medium' : 'ml-1'}>
            ({source.daysOld} d)
          </span>
        )}
      </span>
    </div>
  )
}

export default function SourceProvenancePanel({ sources }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Källor &amp; proveniens</h3>
      <p className="text-xs text-gray-400 mb-3">Alla datakällor som AI-analysen baseras på.</p>
      <div>
        {sources.map((s, i) => (
          <SourceRow key={i} source={s} />
        ))}
      </div>
    </div>
  )
}
