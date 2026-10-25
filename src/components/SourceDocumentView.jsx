import { useState } from 'react'
import { ArrowLeft, AlertTriangle, FileText, Sparkles, ChevronRight } from 'lucide-react'

// ── Topbar ─────────────────────────────────────────────────────────────────

function SourceDocTopbar({ caseData, onBack }) {
  return (
    <header className="px-6 py-4 shrink-0 bg-card border-b border-border flex items-center justify-between">
      <div>
        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground/60 mb-1 font-medium">
          <span>Mina ärenden</span>
          <ChevronRight size={13} />
          <span>Företagslån</span>
          <ChevronRight size={13} />
          <span>{caseData.id} · {caseData.company}</span>
          <ChevronRight size={13} />
          <span className="text-muted-foreground">Källgranskning</span>
        </div>
        <h1 className="text-lg font-semibold text-foreground">
          Bokslut (oreviderat) &middot; {caseData.company}
        </h1>
      </div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded hover:bg-muted transition-colors"
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
    <div className="bg-dq-stale-bg border-b border-dq-stale-border px-6 py-2.5 flex items-center gap-2 shrink-0">
      <AlertTriangle size={15} className="text-dq-stale-fg shrink-0" />
      <p className="text-sm text-dq-stale-fg">{message}</p>
    </div>
  )
}

// ── Document section row ────────────────────────────────────────────────────

function DocumentRow({ section, isHighlighted }) {
  if (section.type === 'heading') {
    return (
      <div className="mt-6 mb-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
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
        isTotal ? 'border-t border-border mt-0.5' : 'border-b border-border',
        isHighlighted ? 'bg-dq-stale-bg' : '',
      ].join(' ')}
    >
      <span
        className={[
          'text-sm',
          isSub ? 'pl-5 text-muted-foreground' : 'text-foreground',
          isBold || isTotal ? 'font-semibold text-foreground' : '',
        ].join(' ')}
      >
        {section.label}
      </span>
      <span
        className={[
          'text-sm font-mono tabular-nums',
          isBold || isTotal ? 'font-semibold text-foreground' : 'text-muted-foreground',
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
    <div className="flex-[3] overflow-y-auto border-r border-border bg-card">
      <div className="max-w-[640px] mx-auto px-10 py-8">

        {/* Document header */}
        <div className="mb-6 pb-5 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-muted-foreground/60" />
            <span className="text-xs text-muted-foreground/60 font-medium uppercase tracking-widest">
              {doc.preparedBy}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">{doc.title}</h2>
          <p className="text-sm text-muted-foreground">{doc.company} &middot; Org.nr {doc.orgNr}</p>
          <p className="text-sm text-muted-foreground">{doc.period}</p>
          <p className="text-xs text-muted-foreground/60 mt-2">Upprättad: {doc.preparedDate}</p>
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
        <p className="text-xs text-muted-foreground/60 mt-8 italic">
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
        'px-5 py-4 border-b border-border cursor-default transition-all duration-100',
        isActive ? 'bg-dq-stale-bg border-l-2 border-l-dq-stale-solid pl-[18px]' : 'border-l-2 border-l-transparent hover:bg-muted',
      ].join(' ')}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">
        {stamp.label}
      </p>
      <p className="text-lg font-semibold font-mono text-foreground leading-tight">
        {stamp.value}
      </p>
      <div className="flex items-center gap-1 mt-1.5">
        <FileText size={11} className="text-muted-foreground/60 shrink-0" />
        <span className="text-xs text-muted-foreground/60">{stamp.location}</span>
      </div>
    </div>
  )
}

// ── Stamp panel (right) ─────────────────────────────────────────────────────

function StampPanel({ stamps, hoveredStamp, onStampHover }) {
  return (
    <div className="flex-[2] overflow-y-auto bg-card flex flex-col">

      {/* Panel header */}
      <div className="px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-accent-subtle border border-accent-border text-accent-strong text-xs font-medium">
            <Sparkles size={12} />
            AI-extraherade värden
          </div>
        </div>
        <p className="text-xs text-muted-foreground/60 mt-2 leading-relaxed">
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
