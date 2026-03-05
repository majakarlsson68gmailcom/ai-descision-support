import { useState } from 'react'
import { ArrowLeft, AlertTriangle, FileText, Sparkles, ChevronRight } from 'lucide-react'

// ── Topbar ─────────────────────────────────────────────────────────────────

function SourceDocTopbar({ caseData, onBack }) {
  return (
    <header className="px-6 py-4 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-1.5 text-[13px] text-gray-400 mb-1 font-medium">
          <span>Mina ärenden</span>
          <ChevronRight size={13} />
          <span>Företagslån</span>
          <ChevronRight size={13} />
          <span>{caseData.id} · {caseData.company}</span>
          <ChevronRight size={13} />
          <span className="text-gray-700">Källgranskning</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-900">
          Bokslut (oreviderat) &middot; {caseData.company}
        </h1>
      </div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft size={15} />
        Tillbaka
      </button>
    </header>
  )
}

// ── Warning banner ──────────────────────────────────────────────────────────

function StaleWarningBanner({ message }) {
  return (
    <div className="bg-[#FFF4E5] border-b border-[#fddeb9] px-6 py-2.5 flex items-center gap-2 shrink-0">
      <AlertTriangle size={15} className="text-amber-600 shrink-0" />
      <p className="text-sm text-amber-800">{message}</p>
    </div>
  )
}

// ── Document section row ────────────────────────────────────────────────────

function DocumentRow({ section, isHighlighted }) {
  if (section.type === 'heading') {
    return (
      <div className="mt-6 mb-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          {section.text}
        </h3>
      </div>
    )
  }

  const isSub = section.type === 'row-sub'
  const isBold = section.type === 'row-bold'
  const isTotal = section.type === 'row-total'

  return (
    <div
      className={[
        'flex justify-between items-baseline py-2.5 px-2 -mx-2 transition-colors duration-100',
        isTotal ? 'border-t border-gray-300 mt-0.5' : 'border-b border-gray-100',
        isHighlighted ? 'bg-amber-50' : '',
      ].join(' ')}
    >
      <span
        className={[
          'text-sm',
          isSub ? 'pl-5 text-gray-500' : 'text-gray-800',
          isBold || isTotal ? 'font-semibold text-gray-900' : '',
        ].join(' ')}
      >
        {section.label}
      </span>
      <span
        className={[
          'text-sm font-mono tabular-nums',
          isBold || isTotal ? 'font-semibold text-gray-900' : 'text-gray-600',
        ].join(' ')}
      >
        {section.value}
      </span>
    </div>
  )
}

// ── Document panel (left) ───────────────────────────────────────────────────

function DocumentPanel({ doc, hoveredStamp }) {
  return (
    <div className="flex-[3] overflow-y-auto border-r border-gray-200 bg-white">
      <div className="max-w-[640px] mx-auto px-10 py-8">

        {/* Document header */}
        <div className="mb-6 pb-5 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-gray-400" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              {doc.preparedBy}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{doc.title}</h2>
          <p className="text-sm text-gray-500">{doc.company} &middot; Org.nr {doc.orgNr}</p>
          <p className="text-sm text-gray-500">{doc.period}</p>
          <p className="text-xs text-gray-400 mt-2">Upprättad: {doc.preparedDate}</p>
        </div>

        {/* Sections */}
        <div>
          {doc.sections.map(section => (
            <DocumentRow
              key={section.id}
              section={section}
              isHighlighted={hoveredStamp === section.id}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-8 italic">
          Belopp i TSEK (tusen kronor). Ej externt reviderat.
        </p>
      </div>
    </div>
  )
}

// ── Stamp item ──────────────────────────────────────────────────────────────

function StampItem({ stamp, isActive, onMouseEnter, onMouseLeave }) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={[
        'px-5 py-4 border-b border-gray-100 cursor-default transition-all duration-100',
        isActive ? 'bg-amber-50 border-l-2 border-l-amber-400 pl-[18px]' : 'border-l-2 border-l-transparent hover:bg-gray-50',
      ].join(' ')}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
        {stamp.label}
      </p>
      <p className="text-lg font-semibold font-mono text-gray-900 leading-tight">
        {stamp.value}
      </p>
      <div className="flex items-center gap-1 mt-1.5">
        <FileText size={11} className="text-gray-400 shrink-0" />
        <span className="text-xs text-gray-400">{stamp.location}</span>
      </div>
    </div>
  )
}

// ── Stamp panel (right) ─────────────────────────────────────────────────────

function StampPanel({ stamps, hoveredStamp, onStampHover }) {
  return (
    <div className="flex-[2] overflow-y-auto bg-white flex flex-col">

      {/* Panel header */}
      <div className="px-5 py-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f0eafb] border border-[#d6c3f3] text-[#451b88] text-xs font-medium">
            <Sparkles size={12} />
            AI-extraherade värden
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          Håll markören över ett värde för att markera var AI hittade det i dokumentet.
        </p>
      </div>

      {/* Stamp items */}
      <div>
        {stamps.map(stamp => (
          <StampItem
            key={stamp.id}
            stamp={stamp}
            isActive={hoveredStamp === stamp.rowId}
            onMouseEnter={() => onStampHover(stamp.rowId)}
            onMouseLeave={() => onStampHover(null)}
          />
        ))}
      </div>
    </div>
  )
}

// ── Root component ──────────────────────────────────────────────────────────

export default function SourceDocumentView({ document: doc, metric, onBack, caseData }) {
  const [hoveredStamp, setHoveredStamp] = useState(null)

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full">
      <SourceDocTopbar caseData={caseData} onBack={onBack} />

      {doc.isUnreviewed && (
        <StaleWarningBanner message={doc.staleWarning} />
      )}

      <div className="flex flex-1 overflow-hidden">
        <DocumentPanel doc={doc} hoveredStamp={hoveredStamp} />
        <StampPanel
          stamps={doc.stamps}
          hoveredStamp={hoveredStamp}
          onStampHover={setHoveredStamp}
        />
      </div>
    </div>
  )
}
