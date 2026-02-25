import React from 'react'

const directionIcon = { positiv: '↑', negativ: '↓', neutral: '→' }
const directionColor = { positiv: 'text-green-600', negativ: 'text-red-600', neutral: 'text-gray-500' }
const weightDot = { hög: 'bg-gray-800', medel: 'bg-gray-400', låg: 'bg-gray-200' }

export default function AIRecommendationCard({ caseData }) {
  const { company, orgNr, amount, purpose, aiRecommendation, topFactors } = caseData

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      {/* AI-label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded">
          AI-förslag
        </span>
        <span className="text-xs text-gray-400">– inte ett beslut</span>
      </div>

      {/* Case meta */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-4 text-sm">
        <div>
          <span className="text-gray-400">Företag</span>
          <p className="font-medium text-gray-800">{company}</p>
        </div>
        <div>
          <span className="text-gray-400">Org.nr</span>
          <p className="font-medium text-gray-800">{orgNr}</p>
        </div>
        <div>
          <span className="text-gray-400">Belopp</span>
          <p className="font-medium text-gray-800">
            {amount.toLocaleString('sv-SE')} kr
          </p>
        </div>
        <div>
          <span className="text-gray-400">Ändamål</span>
          <p className="font-medium text-gray-800">{purpose}</p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="flex items-center gap-3 rounded-md bg-red-50 border border-red-200 px-4 py-3 mb-4">
        <span className="text-red-600 text-xl font-bold">✕</span>
        <div>
          <p className="text-xs text-red-500 uppercase tracking-wide font-semibold">AI rekommenderar</p>
          <p className="text-lg font-bold text-red-700">{aiRecommendation}</p>
        </div>
      </div>

      {/* Top 3 factors */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Top 3 faktorer
        </p>
        <div className="space-y-2">
          {topFactors.map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${weightDot[f.weight] ?? 'bg-gray-300'}`} />
              <span className="flex-1 text-gray-700">{f.factor}</span>
              <span className={`font-semibold tabular-nums ${directionColor[f.direction] ?? ''}`}>
                {directionIcon[f.direction]} {f.value}
              </span>
              <span className="text-xs text-gray-400 w-10 text-right">{f.weight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
