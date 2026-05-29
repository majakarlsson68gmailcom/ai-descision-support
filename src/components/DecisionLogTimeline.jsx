import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, Sparkles, User, Scale } from 'lucide-react'
import { confidence as confTokens, dataQuality as dqTokens, statusLabels } from '../tokens'

// ── Chip styles ────────────────────────────────────────────────────────────────

const chipStyles = {
  high:    `${confTokens.high.bg} ${confTokens.high.text} border ${confTokens.high.border}`,
  medium:  `${confTokens.medium.bg} ${confTokens.medium.text} border ${confTokens.medium.border}`,
  low:     `${confTokens.low.bg} ${confTokens.low.text} border ${confTokens.low.border}`,
  neutral: 'bg-gray-100 text-gray-500 border border-gray-200',
  aligned: 'bg-green-50 text-green-700 border border-green-200',
}

function Chip({ label, style = 'neutral' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${chipStyles[style] || chipStyles.neutral}`}>
      {label}
    </span>
  )
}

// ── Actor badge ────────────────────────────────────────────────────────────────

function ActorBadge({ actor }) {
  if (!actor) return null
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200 flex-shrink-0">
      {actor}
    </span>
  )
}

// ── Event icon ─────────────────────────────────────────────────────────────────

const iconConfig = {
  system:   { Icon: FileText, cls: 'bg-gray-100 text-gray-500' },
  ai:       { Icon: Sparkles, cls: 'bg-blue-100 text-blue-600' },
  user:     { Icon: User,     cls: 'bg-gray-100 text-gray-500' },
  decision: { Icon: Scale,    cls: 'bg-blue-600 text-white' },
}

function EventIcon({ type }) {
  const { Icon, cls } = iconConfig[type] || iconConfig.system
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cls}`}>
      <Icon size={15} strokeWidth={1.8} />
    </div>
  )
}

// ── Expand button ──────────────────────────────────────────────────────────────

function ExpandButton({ isExpanded, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 border border-gray-200 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors flex-shrink-0 shadow-[inset_0px_-1px_2px_rgba(0,0,0,0.05),inset_0px_1px_1px_rgba(255,255,255,0.8)]"
      aria-label={isExpanded ? 'Dölj detaljer' : 'Visa detaljer'}
    >
      {isExpanded ? (
        <>Dölj <ChevronUp size={13} /></>
      ) : (
        <>Visa detaljer <ChevronDown size={13} /></>
      )}
    </button>
  )
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
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Datakällor</p>
      <div className="flex flex-col gap-1.5">
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
                <span className={`text-xs px-2 py-0.5 rounded-sm border ${q.bg} ${q.text} ${q.border}`}>
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
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Nyckelfaktorer</p>
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
                    <span className="ml-1.5 text-xs px-2 py-0.5 rounded-sm bg-orange-50 text-orange-700 border border-orange-100">Inaktuell källa</span>
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
      {/* Vertical connector line – centred on icon column (w-12 time + 4 gap + 16px half-icon = ~52px) */}
      <div className="absolute left-[3.25rem] top-4 bottom-4 w-px bg-gray-200" />

      <div className="flex flex-col">
        {events.map((ev, idx) => {
          const isExpanded = expandedId === ev.id
          const isDecision = ev.type === 'decision'
          const isSystem = ev.type === 'system'
          const hasDetail = ev.detail && (
            ev.detail.rows?.length ||
            ev.detail.factors?.length ||
            ev.detail.sources?.length ||
            ev.detail.confidenceChange
          )

          return (
            <div key={ev.id} className={`flex gap-4 ${idx < events.length - 1 ? 'pb-6' : ''}`}>

              {/* ── Left: time column ── */}
              <div className="w-12 text-right flex-shrink-0 pt-1.5">
                <span className="text-xs tabular-nums text-gray-400">{ev.time}</span>
              </div>

              {/* ── Centre: icon ── */}
              <div className="flex-shrink-0 z-10">
                <EventIcon type={ev.type} />
              </div>

              {/* ── Right: content ── */}
              <div className="flex-1 min-w-0">
                {/* Summary row */}
                <div className={`flex items-center gap-2 flex-wrap ${isDecision ? 'border-l-2 border-blue-500 pl-3 -ml-1' : ''}`}>
                  <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    {ev.actor && <ActorBadge actor={ev.actor} />}
                    <span className={`text-sm leading-snug ${isDecision ? 'font-semibold text-gray-900' : isSystem ? 'text-gray-500' : 'font-medium text-gray-700'}`}>
                      {ev.label}
                    </span>
                    {ev.chips.map((chip, ci) => (
                      <Chip key={ci} label={chip.label} style={chip.style} />
                    ))}
                  </div>
                  {hasDetail && (
                    <ExpandButton isExpanded={isExpanded} onClick={() => toggle(ev.id)} />
                  )}
                </div>

                {/* Expanded detail panel */}
                {isExpanded && hasDetail && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-lg px-4 py-3 flex flex-col gap-4">
                      {ev.detail.intro && (
                        <p className="text-xs text-gray-500">{ev.detail.intro}</p>
                      )}

                      {ev.detail.confidenceChange && (
                        <ConfidenceChange change={ev.detail.confidenceChange} />
                      )}

                      {ev.detail.confidenceReason && (
                        <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                          <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                          <p className="text-xs text-orange-700">{ev.detail.confidenceReason}</p>
                        </div>
                      )}

                      {ev.detail.factors?.length > 0 && (
                        <FactorsTable factors={ev.detail.factors} />
                      )}

                      {ev.detail.sources?.length > 0 && (
                        <SourcesTable sources={ev.detail.sources} />
                      )}

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

                      {ev.detail.rows?.length > 0 && (
                        <DetailRows rows={ev.detail.rows} />
                      )}
                    </div>
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
