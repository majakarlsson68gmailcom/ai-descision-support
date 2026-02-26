import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { confidence as confTokens, dataQuality as dqTokens, statusLabels } from '../tokens'

// ── Chip styles ────────────────────────────────────────────────────────────────

const chipStyles = {
  high:    `${confTokens.high.bg} ${confTokens.high.text} border ${confTokens.high.border}`,
  medium:  `${confTokens.medium.bg} ${confTokens.medium.text} border ${confTokens.medium.border}`,
  neutral: 'bg-gray-100 text-gray-500 border border-gray-200',
  aligned: 'bg-green-50 text-green-700 border border-green-200',
}

function Chip({ label, style = 'neutral' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${chipStyles[style] || chipStyles.neutral}`}>
      {label}
    </span>
  )
}

// ── Actor label (plain text, no badge) ─────────────────────────────────────────

function ActorLabel({ actor }) {
  if (!actor) return null
  return (
    <span className="text-xs text-gray-400 flex-shrink-0">{actor}</span>
  )
}

// ── Dot colors by event type ───────────────────────────────────────────────────

const dotColor = {
  system:   'bg-gray-300',
  ai:       'bg-blue-500',
  user:     'bg-gray-400',
  decision: 'bg-blue-700',
}

// ── Expanded detail sub-components ────────────────────────────────────────────

function DetailRows({ rows }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
      {rows.map(({ label, value }) => (
        <div key={label} className="contents">
          <span className="text-xs text-gray-400 whitespace-nowrap">{label}</span>
          <span className="text-xs text-gray-700">{value}</span>
        </div>
      ))}
    </div>
  )
}

function SourcesTable({ sources }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Datakällor</p>
      <div className="flex flex-col gap-1">
        {sources.map(src => {
          const q = dqTokens[src.status] || dqTokens.ok
          const isOk = src.status === 'ok'
          return (
            <div key={src.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isOk ? 'bg-green-500' : src.status === 'stale' ? 'bg-orange-400' : 'bg-gray-300'}`} />
                <span className="text-xs text-gray-700 truncate">{src.name}</span>
                {src.note && <span className="text-xs text-gray-400 flex-shrink-0">· {src.note}</span>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-400">{src.date}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full border ${q.bg} ${q.text} ${q.border}`}>
                  {statusLabels[src.status] || src.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FactorsTable({ factors }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nyckelfaktorer</p>
      <div className="flex flex-col gap-1.5">
        {factors.map(f => {
          const isStale = f.quality === 'stale'
          return (
            <div key={f.name} className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-1 h-1 rounded-full flex-shrink-0 mt-1.5 ${f.direction === 'negativ' ? 'bg-red-400' : 'bg-green-400'}`} />
                <div className="min-w-0">
                  <span className="text-xs text-gray-700">{f.name}</span>
                  {isStale && (
                    <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100">Inaktuell källa</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs flex-shrink-0">
                <span className="font-medium text-gray-900">{f.value}</span>
                <span className="text-gray-400">krav: {f.limit}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ConfidenceChange({ change }) {
  const fromConf = confTokens[change.fromLevel]
  const toConf = confTokens[change.toLevel]
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`font-medium ${fromConf.text}`}>{fromConf.label}</span>
      <span className="text-gray-300">→</span>
      <span className={`font-medium ${toConf.text}`}>{toConf.label}</span>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function DecisionLogTimeline({ events }) {
  const [expandedId, setExpandedId] = useState(null)

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gray-200" />

      <div className="flex flex-col gap-0">
        {events.map((ev, idx) => {
          const isExpanded = expandedId === ev.id
          const isDecision = ev.type === 'decision'
          const hasDetail = ev.detail && (
            ev.detail.rows?.length ||
            ev.detail.factors?.length ||
            ev.detail.sources?.length ||
            ev.detail.confidenceChange
          )

          return (
            <div key={ev.id} className={`relative ${idx < events.length - 1 ? 'pb-5' : ''}`}>
              {/* Dot */}
              <div className={`absolute left-0 top-[10px] w-3.5 h-3.5 rounded-full z-10 ${dotColor[ev.type] || 'bg-gray-300'} ${isDecision ? 'ring-2 ring-blue-200' : ''}`} />

              {/* Content */}
              <div className={`ml-7 ${isDecision ? 'bg-blue-50 border border-blue-100 rounded-xl px-4 py-3' : ''}`}>
                {/* Top row */}
                <div className="flex items-start gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    <ActorLabel actor={ev.actor} />
                    <span className={`text-sm ${isDecision ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'} leading-snug`}>
                      {ev.label}
                    </span>
                    {ev.chips.map((chip, ci) => (
                      <Chip key={ci} label={chip.label} style={chip.style} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                    <span className="text-xs text-gray-400 whitespace-nowrap">{ev.time}</span>
                    {hasDetail && (
                      <button
                        onClick={() => toggle(ev.id)}
                        className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={isExpanded ? 'Dölj detaljer' : 'Visa detaljer'}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && hasDetail && (
                  <div className={`mt-3 flex flex-col gap-4 ${isDecision ? '' : 'pl-0'}`}>
                    {/* Intro text */}
                    {ev.detail.intro && (
                      <p className="text-xs text-gray-500">{ev.detail.intro}</p>
                    )}

                    {/* Confidence change visual */}
                    {ev.detail.confidenceChange && (
                      <ConfidenceChange change={ev.detail.confidenceChange} />
                    )}

                    {/* Confidence reason */}
                    {ev.detail.confidenceReason && (
                      <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                        <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                        <p className="text-xs text-orange-700">{ev.detail.confidenceReason}</p>
                      </div>
                    )}

                    {/* Factors table */}
                    {ev.detail.factors?.length > 0 && (
                      <FactorsTable factors={ev.detail.factors} />
                    )}

                    {/* Sources table */}
                    {ev.detail.sources?.length > 0 && (
                      <SourcesTable sources={ev.detail.sources} />
                    )}

                    {/* Decision detail */}
                    {ev.detail.decision && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Kategori</span>
                          <span className="text-xs font-medium text-gray-700">{ev.detail.motivationCategory}</span>
                        </div>
                        {ev.detail.motivationText && (
                          <div>
                            <span className="text-xs text-gray-400 block mb-1">Motivering</span>
                            <p className="text-xs text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 leading-relaxed">
                              {ev.detail.motivationText}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Generic detail rows */}
                    {ev.detail.rows?.length > 0 && (
                      <DetailRows rows={ev.detail.rows} />
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
