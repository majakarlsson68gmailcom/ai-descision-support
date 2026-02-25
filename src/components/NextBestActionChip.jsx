import React from 'react'

export default function NextBestActionChip({ actions }) {
  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 mb-2">
        Rekommenderade nästa steg
      </p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, i) => (
          <button
            key={i}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-800 bg-white border border-orange-300 rounded-full px-3 py-1 hover:bg-orange-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <span className="text-orange-500">→</span>
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}
