import { useState, useEffect } from 'react'
import { CASE, DISABLED_APPROVE_REASON, DISABLED_SUPPLEMENT_REASON, REJECT_WARNING, BOKSLUT_DOCUMENT } from './constants'
import SourceDrawer from './components/SourceDrawer'
import SimulationView from './components/SimulationView'
import CashFlowSourceDrawer from './components/CashFlowSourceDrawer'
import CashFlowSimulationView from './components/CashFlowSimulationView'
import KeyMetricSourceDrawer from './components/KeyMetricSourceDrawer'
import SourceDocumentView from './components/SourceDocumentView'
import {
  FileText, ClipboardList, LayoutGrid, Bell, Sparkles, Lightbulb,
  BookOpen, Settings, HelpCircle, AlertTriangle, CircleAlert, Lock, ChevronRight, ChevronDown, User,
  Download, Send, CheckCircle, X, RotateCcw, ArrowRight, ArrowUpRight, ArrowUp, ArrowDown, Info, Loader2,
  Shield, PanelLeftClose,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function Tag({ children, color = 'neutral' }) {
  const styles = {
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    red: 'bg-red-50    text-red-700    border-red-100',
    green: 'bg-green-50  text-green-700  border-green-100',
    neutral: 'bg-grey-50   text-grey-600   border-grey-100',
    blue: 'bg-blue-50   text-blue-800   border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-500',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xsm font-medium ${styles[color]}`}>
      {children}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-xsm font-semibold uppercase tracking-widest text-grey-600 mb-2">
      {children}
    </p>
  )
}

function getConfidenceBadge(confidence) {
  const level = typeof confidence === 'number'
    ? confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low'
    : confidence // 'high' | 'medium' | 'low'
  if (level === 'high') return { label: 'Hög konfidens', dot: 'bg-green-500', cls: 'bg-green-50 border-green-200 text-green-800' }
  if (level === 'medium') return { label: 'Medel konfidens', dot: 'bg-[#f97316]', cls: 'bg-[#fef3e6] border-[#fddeb9] text-[#9f5704]' }
  return { label: 'Låg konfidens', dot: 'bg-red-500', cls: 'bg-red-50 border-red-200 text-red-800' }
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar() {
  return (
    <aside className="w-[220px] flex-shrink-0 h-screen overflow-y-auto bg-[#f2f2f2] border-r border-[#d4d4d4] flex flex-col">

      {/* Section: Ärenden */}
      <div className="pl-6 pr-4 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between px-4">
          <span className="text-[18px] font-medium text-black/60 leading-normal">Ärenden</span>
          <button className="bg-gradient-to-b from-[#fbfbfb] to-[rgba(207,207,207,0.1)] border border-[#d4d4d4] rounded-lg p-2 flex items-center justify-center">
            <PanelLeftClose size={16} className="text-black/60" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Översikt',      Icon: LayoutGrid   },
            { label: 'Kunder',        Icon: User         },
            { label: 'Mina ärenden',  Icon: ClipboardList, active: true },
            { label: 'Alla ärenden',  Icon: ClipboardList },
          ].map(({ label, Icon, active }) => (
            <button key={label} className={`w-full flex items-center gap-2 px-4 py-2 rounded-[4px] text-[16px] font-medium text-black text-left transition-colors ${active ? 'bg-[rgba(71,71,71,0.15)]' : 'hover:bg-[rgba(71,71,71,0.08)]'}`}>
              <Icon size={16} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Section: Beslutsstöd */}
      <div className="pl-6 pr-4 py-6 border-t border-[#d4d4d4] flex flex-col gap-4">
        <div className="px-4">
          <span className="text-[18px] font-medium text-black/60 leading-normal">Beslutsstöd</span>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Aviseringar',       Icon: Bell      },
            { label: 'Rekommendationer',  Icon: Lightbulb },
            { label: 'Beslutslogg',       Icon: BookOpen  },
          ].map(({ label, Icon }) => (
            <button key={label} className="w-full flex items-center gap-2 px-4 py-2 rounded-[4px] text-[16px] font-medium text-black text-left transition-colors hover:bg-[rgba(71,71,71,0.08)]">
              <Icon size={16} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Section: System */}
      <div className="pl-6 pr-4 py-6 border-t border-[#d4d4d4] flex flex-col gap-4">
        <div className="px-4">
          <span className="text-[18px] font-medium text-black/60 leading-normal">System</span>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Inställningar', Icon: Settings   },
            { label: 'Hjälp',         Icon: HelpCircle },
            { label: 'Säkerhet',      Icon: Shield     },
          ].map(({ label, Icon }) => (
            <button key={label} className="w-full flex items-center gap-2 px-4 py-2 rounded-[4px] text-[16px] font-medium text-black text-left transition-colors hover:bg-[rgba(71,71,71,0.08)]">
              <Icon size={16} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

    </aside>
  )
}

// ── Page header ───────────────────────────────────────────────────────────────

function PageHeader({ d }) {
  return (
    <header className="px-6 py-6 pb-2 shrink-0">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-grey-500 mb-2">
            <span className="hover:text-gray-700 cursor-pointer transition-colors">Mina ärenden</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="hover:text-gray-700 cursor-pointer transition-colors">Företagslån</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-grey-900">{d.id} · {d.company}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{d.id}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-medium text-[#3059CE] bg-white border border-[#3059CE]/30 rounded px-5 py-2 hover:bg-blue-50 transition-colors">
            Exportera PDF <Download size={16} />
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-white bg-[#3059CE] rounded px-5 py-2 hover:bg-blue-700 transition-colors shadow-sm">
            Eskalera ärende <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}

function CaseInfoCard({ d }) {
  const amountStr = typeof d.amount === 'number'
    ? `${d.amount.toLocaleString('sv-SE')} kr`
    : d.amount
  const fields = [
    { label: 'Företag', value: d.company },
    { label: 'Org.nr', value: d.orgNr, mono: true },
    { label: 'Belopp', value: amountStr, mono: true },
    { label: 'Ändamål', value: d.purpose },
    ...(d.contact ? [{ label: 'Kontakt', value: d.contact }] : []),
    { label: 'Handläggare', value: d.officer },
    { label: 'Ärendenummer', value: d.id, mono: true },
  ]
  return (
    <section className="bg-white border text-left border-grey-200 rounded-xl p-6 shadow-sm">
      <SectionLabel>Ärende</SectionLabel>
      <dl className="grid grid-cols-2 gap-x-12 gap-y-5 mt-4">
        {fields.map(f => (
          <div key={f.label}>
            <dt className="text-xs text-grey-500">{f.label}</dt>
            <dd className={`text-sm font-medium text-grey-900 mt-1 ${f.mono ? 'font-mono tracking-tight' : ''}`}>
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// ── AI Recommendation ─────────────────────────────────────────────────────────

function AIRecommendationSection({ d, confidence, factors }) {
  const confBadge = getConfidenceBadge(d.confidence ?? confidence)

  const renderValue = (f) => {
    if (f.status === 'unavailable' || f.value == null) {
      return <span className="text-xs font-medium text-gray-400">–</span>
    }
    const hasUp = f.value.includes('↑')
    const hasDown = f.value.includes('↓')
    const clean = f.value.replace(/↑|↓/g, '').trim()
    const isPositive = f.direction === 'positiv'
    return (
      <div className={`flex items-center gap-0.5 text-xs font-medium whitespace-nowrap ${isPositive ? 'text-green-600' : 'text-[#dc2626]'}`}>
        {hasDown && <ArrowDown size={12} />}
        {hasUp && <ArrowUp size={12} />}
        <span>{clean}</span>
      </div>
    )
  }

  const renderDots = (weight) => {
    const count = weight === 'hög' ? 3 : weight === 'medel' ? 2 : 1
    return (
      <div className="flex gap-1 items-center">
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-2 h-2 rounded-full ${i <= count ? 'bg-[#245bd1]' : 'bg-gray-200'}`} />
        ))}
      </div>
    )
  }

  const activeFactors = factors ?? d.topFactors

  return (
    <section className="bg-white border border-gray-300 rounded-2xl shadow-sm mt-2 text-left">

      {/* Header: AI badge + AVSLAG + konfidensgrad */}
      <div className="px-3 py-4 border-b border-gray-200 flex flex-col gap-3">
        <div className="flex items-center gap-1 self-start px-2 py-0.5 rounded-xl bg-[#e9effb] border border-[#c2d2f5] text-[#112b64] text-xs font-medium">
          <Sparkles size={14} />
          AI-recommendation
        </div>

        {/* AI Scope Banner */}
        <div className="flex items-stretch gap-2 bg-[#e9effb] border border-[#c2d2f5] rounded-lg px-3 py-2 text-[#112b64] text-xs">
          <span className="text-sm leading-none shrink-0 mt-0.5">ⓘ</span>
          <span className="flex-1 min-w-0 leading-relaxed"><span className="font-medium">Analyserar:</span> Strukturerad data från kopplade källor · Nyckeltal mot bankpolicy · Datakvalitet</span>
          <span className="w-px bg-[#c2d2f5] shrink-0 mx-1" />
          <span className="flex-1 min-w-0 leading-relaxed"><span className="font-medium">Bedömer inte:</span> Oreviderade siffrors tillförlitlighet · Framtida marknadsutveckling · Affärsbedömning</span>
        </div>

        <div className="flex items-end justify-between">
          <p className="text-2xl font-semibold leading-8 text-gray-900">{d.aiRecommendation}</p>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              Konfidensgrad <Info size={12} />
            </span>
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-xl border ${confBadge.cls}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${confBadge.dot}`} />
              {confBadge.label}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{d.aiSummaryShort}</p>
          </div>
        </div>
      </div>

      {/* Faktorer header + kolumnrubriker */}
      <div className="px-3 py-4 border-b border-gray-200 flex flex-col gap-4">
        <p className="text-sm text-gray-500">Faktorer som påverkat rekommendationen</p>
        <div className="flex items-center">
          <p className="text-xs font-medium text-gray-900 flex-1">Faktor</p>
          <div className="flex items-center gap-9 justify-end w-[340px]">
            <p className="text-xs font-medium text-gray-900 w-10 text-center">Värde</p>
            <PaverkanLabel align="right" direction="down" />
            <p className="text-xs font-medium text-gray-900 w-40 text-center">Källa</p>
          </div>
        </div>
      </div>

      {/* Faktorrader */}
      {activeFactors.map((f, i) => {
        const isUnavailable = f.status === 'unavailable'
        return (
          <div key={i} className={`p-3 flex items-center gap-12 ${i < activeFactors.length - 1 ? 'border-b border-gray-200' : ''} ${isUnavailable ? 'opacity-60' : ''}`}>
            <div className="flex-1 flex flex-col gap-2.5 min-w-0">
              <p className="text-sm text-gray-900">{f.factor}</p>
              <p className={`text-xs font-medium leading-relaxed ${isUnavailable ? 'text-gray-400 italic' : 'text-gray-500'}`}>{f.description}</p>
            </div>
            <div className="flex items-center gap-9 justify-end shrink-0 w-[340px]">
              <div className="w-24 flex justify-center">{renderValue(f)}</div>
              <div className="flex justify-center">{renderDots(f.weight)}</div>
              {isUnavailable ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-xl border text-xs font-medium w-40 justify-center bg-gray-100 border-gray-300 text-gray-400">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span className="truncate">Källa otillgänglig</span>
                </div>
              ) : (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-xl border text-xs font-medium w-40 justify-center
                  ${f.stale ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-[#f2f2f2] border-[#dbdbdb] text-[#525252]'}`}>
                  <span className="truncate">{f.source}</span>
                  {f.stale
                    ? <AlertTriangle size={14} className="shrink-0" />
                    : <FileText size={14} className="text-gray-500 shrink-0" />}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}

// ── Påverkan tooltip ──────────────────────────────────────────────────────────
function PaverkanLabel({ align = 'left', direction = 'up' }) {
  const isDown = direction === 'down'
  return (
    <div className="relative group inline-flex items-center gap-0.5 cursor-default">
      <span className="text-xs font-medium text-gray-900 whitespace-nowrap">Påverkan</span>
      <Info size={11} className="text-gray-500" />
      <div className={`absolute hidden group-hover:block z-[9999] w-64 bg-gray-900 text-white rounded-xl px-4 py-3 shadow-xl pointer-events-none
        ${isDown ? 'top-full mt-2' : 'bottom-full mb-2'}
        ${align === 'right' ? 'right-0' : 'left-0'}`}>
        <p className="text-sm font-bold leading-snug mb-1.5">Visar hur mycket faktorn påverkat rekommendationen</p>
        <p className="text-xs text-gray-300 leading-relaxed">
          Prickarna visar AI:ns viktning av faktorn:<br />
          <span className="text-white font-medium">●●●&nbsp;Hög</span> – faktorn vägde tungt och hade stor inverkan på rekommendationen.<br />
          <span className="text-white font-medium">●●○&nbsp;Medel</span> – faktorn bidrog men var inte avgörande.<br />
          <span className="text-white font-medium">●○○&nbsp;Låg</span> – faktorn ingick men hade liten inverkan.
        </p>
        {isDown
          ? <div className={`absolute bottom-full border-4 border-transparent border-b-gray-900 ${align === 'right' ? 'right-4' : 'left-4'}`} />
          : <div className={`absolute top-full border-4 border-transparent border-t-gray-900 ${align === 'right' ? 'right-4' : 'left-4'}`} />
        }
      </div>
    </div>
  )
}

// ── Nyckeldata cards ──────────────────────────────────────────────────────────

function MetricCard({ factor, onGranska }) {
  const isOver = factor.diffDirection === 'över'
  const isStale = factor.stale
  const isPositive = factor.direction === 'positiv'
  const isUnknown = !factor.value || factor.value === 'Okänt'
  const isUnavailable = factor.status === 'unavailable'
  const paverkanLevel = factor.weight === 'hög' ? 3 : factor.weight === 'medel' ? 2 : 1

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col ${isUnavailable ? 'opacity-70' : ''}`}>

      {/* Header: värde + badges + titel */}
      <div className="px-6 pt-6 pb-0 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`text-[32px] font-bold leading-10 ${isUnavailable ? 'text-gray-400' : 'text-gray-900'}`}>
              {isUnavailable ? '–' : (isUnknown ? 'Okänt' : factor.value.replace(/↑|↓/g, '').trim())}
            </span>
            {isUnavailable ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-xl text-xs font-medium bg-gray-100 border border-gray-300 text-gray-400">
                <AlertTriangle size={14} className="shrink-0" />
                Källa otillgänglig
              </div>
            ) : isUnknown ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-xl text-xs font-medium bg-gray-100 border border-gray-300 text-gray-500">
                Kan ej bedömas
              </div>
            ) : (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-xl text-xs font-medium ${isPositive ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-[#fbe9e9] border border-[#f5c2c2] text-[#8c1717]'}`}>
                {!isPositive && (isOver ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
                {isPositive ? 'Uppfyller krav' : (isOver ? 'Överstiger gräns' : 'Under gräns')}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-[#e9effb] border border-[#c2d2f5] text-[#112b64] text-xs font-medium">
            <Sparkles size={14} />
            AI
          </div>
        </div>
        <p className="text-base font-medium text-gray-900">{factor.factor}</p>
      </div>

      {/* Krav/gräns + diff */}
      {!isUnavailable && (
        <div className="px-6 pt-5 pb-0">
          <div className="flex items-center gap-5">
            <p className="text-lg font-semibold text-gray-500">
              {factor.limitLabel ?? (isOver ? 'Gräns' : 'Krav')}:{' '}
              <span className="text-gray-900">{factor.limit}</span>
            </p>
            {!isUnknown && (
              <>
                <div className="w-0.5 h-14 bg-gray-300" />
                <p className="text-lg font-semibold text-gray-900">
                  {factor.diff} {factor.diffDirection}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tidsperiod */}
      {!isUnavailable && (
        <div className="px-6 pt-4 pb-0">
          <p className="text-sm text-gray-500">Tidsperiod: {factor.period.replace('–', '-')}</p>
        </div>
      )}

      {/* Unavailable description */}
      {isUnavailable && (
        <div className="px-6 pt-4 pb-0">
          <p className="text-xs text-gray-400 leading-relaxed italic">Branschdata-API:t svarade inte vid analystillfället. Värdet kunde inte hämtas.</p>
        </div>
      )}

      {/* Stale-varning */}
      {isStale && (
        <div className="px-6 pt-3">
          <p className="text-xs text-amber-700 leading-relaxed">
            {factor.staleReason ?? 'Källan är föråldrad.'}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 border-t border-gray-200 px-3 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative group flex items-center gap-2 cursor-default">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${i <= paverkanLevel ? 'bg-[#245bd1]' : 'bg-gray-200'}`} />
              ))}
            </div>
            <PaverkanLabel />
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-xl border text-xs font-medium whitespace-nowrap
            ${isUnavailable ? 'bg-gray-100 text-gray-400 border-gray-300' :
              isStale ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
            {isUnavailable
              ? <AlertTriangle size={14} className="text-gray-400 shrink-0" />
              : isStale
                ? <AlertTriangle size={14} className="text-orange-700" />
                : <FileText size={14} className="text-gray-500" />}
            {isUnavailable ? 'Källa otillgänglig' : factor.source}
          </div>
        </div>
        <button
          onClick={onGranska}
          className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-[#245bd1] border border-[#245bd1] hover:bg-blue-50 transition-colors rounded"
        >
          Granska underlag <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  )
}

const CF_ANALYSIS_STEPS = [
  { id: 1, text: 'Laddar upp dokument: Kassaflödesanalys_Q3Q4_2024.pdf', type: 'loading' },
  { id: 2, text: 'Läser dokument och identifierar nyckeltal', type: 'loading' },
  { id: 3, text: 'rörelseresultat · EBITDA · kassaflöde från rörelseverksamhet', type: 'searching' },
  { id: 4, text: 'Hittade: Rörelseresultat +171 400 kr (Q3 2024)', type: 'found' },
  { id: 5, text: 'Hittade: Kassaflöde +204 000 kr (Q4 2024)', type: 'found' },
  { id: 6, text: 'Verifierar mot Kreditupplysning UC och Årsredovisning 2025', type: 'verifying' },
  { id: 7, text: 'Uppdaterar konfidensgrad: Medel → Hög', type: 'updating' },
]

function AIAnalysisProgress({ onComplete }) {
  const [visibleSteps, setVisibleSteps] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timers = CF_ANALYSIS_STEPS.map((step, i) =>
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, step])
        if (i === CF_ANALYSIS_STEPS.length - 1) {
          setTimeout(() => {
            setDone(true)
            setTimeout(() => onComplete(), 1800)
          }, 800)
        }
      }, i * 700)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[520px] flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-600" />
          <span className="text-base font-semibold text-gray-900">AI analyserar nytt underlag</span>
          {done
            ? <CheckCircle size={15} className="text-green-500 ml-auto" />
            : <Loader2 size={15} className="animate-spin text-blue-500 ml-auto" />
          }
        </div>
        <div className="flex flex-col gap-2.5">
          {visibleSteps.map(step => (
            <div key={step.id} className="flex items-start gap-2">
              {step.type === 'found' && <CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" />}
              {(step.type === 'loading' || step.type === 'verifying') && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mt-1.5 shrink-0" />
              )}
              {step.type === 'searching' && <span className="text-xs text-gray-400 mt-0.5 shrink-0">Söker</span>}
              {step.type === 'updating' && <span className="text-xs text-orange-500 mt-0.5 shrink-0">↑</span>}
              {step.type === 'searching'
                ? (
                  <div className="flex items-center gap-1 flex-wrap">
                    {step.text.split(' · ').map((q, j) => (
                      <span key={j} className="inline-flex items-center px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-xs text-gray-700 font-mono">
                        {q}
                      </span>
                    ))}
                  </div>
                )
                : (
                  <span className={`text-sm ${step.type === 'found' ? 'text-gray-800' : step.type === 'updating' ? 'text-orange-700 font-semibold' : 'text-gray-600'}`}>
                    {step.text}
                  </span>
                )
              }
            </div>
          ))}
        </div>
        {done && (
          <p className="text-xs text-green-700 font-medium border-t border-gray-100 pt-3">
            Analys klar – konfidensgrad uppdaterad.
          </p>
        )}
      </div>
    </div>
  )
}

function AISummaryCard({ d, confidence, sources, aiReviewed, onUnlocked }) {
  const statusLabel = { ok: 'Aktuell', stale: 'Inaktuell', current: 'Aktuell', warning: 'Inaktuell' }
  const confidenceBadge = getConfidenceBadge(d.confidence ?? confidence)
  const hasUnavailableSource = (d.topFactors ?? []).some(f => f.status === 'unavailable')

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 mt-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-bold text-gray-900">Sammanfattning</h2>
        <div className="flex items-center gap-1 text-xs font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
          <Sparkles size={12} /> AI
        </div>
      </div>

      {/* Unavailable source warning */}
      {hasUnavailableSource && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-amber-800">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">En datakälla kunde inte nås. AI-rekommendationen baseras på ofullständigt underlag.</p>
        </div>
      )}

      {/* Konfidensgrad */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          Konfidensgrad <Info size={12} className="text-gray-400" />
        </span>
        <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border w-fit ${confidenceBadge.cls}`}>
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${confidenceBadge.dot}`} />
          {confidenceBadge.label}
        </div>
      </div>

      {/* Korttext */}
      <p className="text-xs text-gray-500 font-medium">{d.aiSummaryShort}</p>

      {/* Mittsektion */}
      <div className="border-t border-b border-gray-200 py-4 flex gap-12 items-start">
        {/* Vänster */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-medium text-gray-500">Rekommendation:</span>
            <span className={`text-2xl font-bold ${d.aiRecommendation === 'GODKÄNN' ? 'text-gray-900' : 'text-red-600'}`}>{d.aiRecommendation.charAt(0).toUpperCase() + d.aiRecommendation.slice(1).toLowerCase()}</span>
          </div>
          <p className="text-sm text-gray-500 leading-6">{d.aiSummary}</p>
          <div className="mt-2">
            <p className="text-base font-bold text-gray-900 mb-1">Nästa steg:</p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5 text-left">
              {d.nextBestActions[0]}
              <ArrowRight size={14} className="shrink-0" />
            </button>
          </div>
        </div>

        {/* Höger */}
        <div className="w-[420px] shrink-0 flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-500">Underlag</p>
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-sm font-normal text-gray-500 pb-1 pr-8">Källa</th>
                <th className="text-sm font-normal text-gray-500 pb-1 pr-8">Datum</th>
                <th className="text-sm font-normal text-gray-500 pb-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s, i) => (
                <tr key={i}>
                  <td className="pr-8 align-middle">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-200 bg-gray-100 text-xs text-gray-700 font-medium whitespace-nowrap">
                      {s.name} <FileText size={12} className="text-gray-400 shrink-0" />
                    </div>
                  </td>
                  <td className="pr-8 align-middle text-xs font-medium text-gray-900 whitespace-nowrap">{s.period}</td>
                  <td className="align-middle">
                    <div className={`inline-flex items-center gap-1 text-xs font-medium ${s.status === 'unavailable' ? 'text-gray-400' :
                        s.status === 'ok' || s.status === 'current' ? 'text-green-700' : 'text-amber-700'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.status === 'unavailable' ? 'bg-gray-300' :
                          s.status === 'ok' || s.status === 'current' ? 'bg-green-500' : 'bg-amber-500'}`} />
                      {s.status === 'unavailable' ? 'Otillgänglig' : (s.statusLabel ?? statusLabel[s.status] ?? s.status)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex items-start gap-3 p-2.5">
        <div className="flex items-center py-1 shrink-0">
          <input
            type="checkbox"
            id="ai-reviewed"
            checked={aiReviewed}
            onChange={e => onUnlocked(e.target.checked)}
            className="w-4 h-4 rounded border border-gray-400 accent-blue-600 cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="ai-reviewed" className="flex items-center gap-2 cursor-pointer">
            <span className="text-base text-gray-900">Jag har tagit del av och granskat AI-underlaget</span>
            <span className="text-sm text-gray-500">(Valfritt)</span>
            <Info size={14} className="text-gray-400 shrink-0" />
          </label>
          <p className="text-xs text-gray-500 font-medium">
            Genom att kryssa i rutan bekräftar du att du tagit del av och värderat AI-rekommendationen. Detta val loggas med din tidsstämpel och identitet
          </p>
        </div>
      </div>
    </section>
  )
}

function DecisionPanel({ d, aiReviewed, onUnlocked, analysisComplete, onOverride, onApprove, onGranskaKallor }) {
  const unlocked = analysisComplete || aiReviewed
  const uncertaintyReasons = d?.uncertaintyReasons ?? []
  const problematicSourceCount = d?.dataSources?.filter(s => s.status === 'stale' || s.status === 'unavailable').length ?? 0

  return (
    <aside className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-fit w-[360px]">

      {/* Top banner – Datakvalitet kräver uppmärksamhet */}
      {!unlocked && (
        <div className="bg-[#fef3e6] border-b border-[#fddeb9] px-3 py-2 flex flex-col gap-[5px]">
          <div className="py-1">
            <CircleAlert size={16} className="text-[#9f5704]" />
          </div>
          <div className="flex flex-col gap-[5px] text-[#9f5704]">
            <p className="text-base leading-6">Datakvalitet kräver uppmärksamhet</p>
            <div className="text-xs leading-5">
              {uncertaintyReasons.map((reason, i) => (
                <p key={i}>{reason}.</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nästa steg – primär CTA för att granska källorna */}
      {!unlocked && (
        <div className="px-3 pb-3 pt-0 border-b border-gray-200 flex flex-col gap-1">
          <p className="text-base font-semibold text-gray-900 pt-3">Nästa steg:</p>
          <button
            onClick={onGranskaKallor}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2 bg-[#245bd1] border border-[#245bd1] text-white rounded text-base font-medium hover:bg-blue-700 transition-colors"
          >
            Granska källor ({problematicSourceCount})
            <ArrowUpRight size={16} />
          </button>
        </div>
      )}

      <div className="px-3 pt-5 pb-5 flex flex-col gap-5">

        {/* Beslut Section */}
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-gray-900">Beslut</p>
          <div className="flex flex-col gap-5">

            {/* Godkänn */}
            <div className="flex flex-col gap-1">
              <button
                disabled={!unlocked}
                onClick={unlocked ? onApprove : undefined}
                className={`w-full flex items-center justify-center gap-2.5 px-4 py-2 rounded text-base font-medium transition-colors
                  ${unlocked
                    ? 'bg-[#245bd1] border border-[#245bd1] text-white hover:bg-blue-700'
                    : 'bg-[#adadad] border border-[#adadad] text-[#3b3b3b] cursor-not-allowed'}`}
              >
                Godkänn
                {!unlocked && <Lock size={16} />}
              </button>
              {!unlocked && (
                <div className="flex gap-1 items-center">
                  <p className="text-xs italic text-gray-500">Låst tills AI-underlaget har granskats.</p>
                  <Info size={14} className="text-gray-400 shrink-0" />
                </div>
              )}
              {unlocked && (
                <p className="text-xs text-gray-400">Följer AI-rekommendation – loggas automatiskt</p>
              )}
            </div>

            {/* Avslå */}
            <div className="flex flex-col gap-1">
              <button
                disabled={!unlocked}
                onClick={unlocked ? onOverride : undefined}
                className={`w-full flex items-center justify-center gap-2.5 px-4 py-2 rounded text-base font-medium transition-colors
                  ${unlocked
                    ? 'bg-white border border-[#245bd1] text-[#245bd1] hover:bg-blue-50'
                    : 'bg-[#adadad] border border-[#adadad] text-[#3b3b3b] cursor-not-allowed'}`}
              >
                Avslå
                {!unlocked && <Lock size={16} />}
              </button>
              {!unlocked && (
                <div className="flex gap-1 items-center">
                  <p className="text-xs italic text-gray-500">Låst tills AI-underlaget har granskats.</p>
                  <Info size={14} className="text-gray-400 shrink-0" />
                </div>
              )}
              {unlocked && (
                <p className="text-xs text-gray-400">Avviker från AI – kräver motivering</p>
              )}
            </div>
          </div>
        </div>

        {/* Hantera ärende Section */}
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-gray-900">Hantera ärende</p>
          <div className="flex flex-col gap-1">
            <button
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2 border border-[#245bd1] rounded text-base font-medium text-[#245bd1] hover:bg-blue-50 transition-colors"
            >
              Begär komplettering
            </button>
            {!unlocked && (
              <div className="flex gap-1 items-center">
                <p className="text-xs italic text-gray-500">Låst tills AI-underlaget har granskats.</p>
                <Info size={14} className="text-gray-400 shrink-0" />
              </div>
            )}
            {unlocked && (
              <p className="text-xs text-gray-400">Pausar ärendet och begär underlag</p>
            )}
          </div>
        </div>

      </div>
    </aside>
  )
}

// ── OverrideModal ─────────────────────────────────────────────────────────────

const OVERRIDE_CATEGORIES = [
  'Felaktig datakälla',
  'Kontextuell bedömning',
  'Kompletterande information',
  'Riskbedömning avviker',
  'Annan',
]

function OverrideModal({ d, onConfirm, onCancel }) {
  const [selected, setSelected] = useState(null)
  const [freetext, setFreetext] = useState('')
  const now = new Date().toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[560px] flex flex-col gap-5 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div>
          <h2 className="text-base font-semibold text-gray-900">Du avviker från AI:ns rekommendation</h2>
          <p className="text-sm text-gray-500 mt-1">Välj en kategori som beskriver din bedömning. Avvikelsen loggas.</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle size={14} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">AI rekommenderade: GODKÄNN</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg">
              <X size={14} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Ditt beslut: AVSLAG</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-2">
          {OVERRIDE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors
                ${selected === cat
                  ? 'bg-blue-50 border-blue-400 text-blue-800'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              {selected === cat && <span className="mr-2 text-blue-600">✓</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Freetext */}
        <textarea
          value={freetext}
          onChange={e => setFreetext(e.target.value)}
          placeholder="Lägg till kommentar... (valfritt)"
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* Preview section */}
        {selected && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Följande loggas</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-700">
              <span className="text-gray-400">Ärende</span><span className="font-medium">{d.id}</span>
              <span className="text-gray-400">Handläggare</span><span className="font-medium">{d.officer}</span>
              <span className="text-gray-400">Tidsstämpel</span><span className="font-medium">{now}</span>
              <span className="text-gray-400">Kategori</span><span className="font-medium">{selected}</span>
              <span className="text-gray-400">Avvikelse</span><span className="font-medium text-orange-700">AI: GODKÄNN → Beslut: AVSLAG</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Avbryt
          </button>
          <button
            onClick={() => onConfirm({ category: selected, text: freetext.trim() })}
            disabled={!selected}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors
              ${selected ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Bekräfta avslag
          </button>
        </div>
      </div>
    </div>
  )
}

// ── ClosedCaseView ────────────────────────────────────────────────────────────

function ClosedCaseView({ d, confidence, motivation, onClose }) {
  const today = new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })
  const timeNow = new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
  const confBadge = getConfidenceBadge(d.confidence ?? confidence)

  const [feedbackChoice, setFeedbackChoice] = useState(null)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [openEvents, setOpenEvents] = useState(new Set())

  const auditEvents = [
    {
      id: 1,
      time: '10:14',
      type: 'system',
      actor: null,
      label: 'Ärende öppnat',
      chips: [],
      detail: {
        rows: [
          { label: 'Handläggare', value: d.officer },
          { label: 'Ärende-ID', value: d.id },
          { label: 'Bolag', value: d.company },
          { label: 'Belopp', value: typeof d.amount === 'number' ? `${d.amount.toLocaleString('sv-SE')} kr` : d.amount },
        ]
      }
    },
    {
      id: 2,
      time: '10:14',
      type: 'ai',
      actor: 'AI',
      label: 'AI-analys klar',
      chips: [
        { label: confBadge.label, style: confBadge.label.includes('Låg') ? 'low' : confBadge.label.includes('Medel') ? 'medium' : 'high' },
      ],
      detail: {
        intro: `Initiell analys baserad på ${d.dataSources.length} datakällor.${d.uncertaintyReasons?.length ? ' ' + d.uncertaintyReasons[0] + '.' : ''}`,
        confidenceReason: d.uncertaintyReasons?.join(' ') || '',
        factors: d.topFactors.map(f => ({
          name: f.factor,
          value: f.value,
          limit: f.limit ?? 'N/A',
          direction: f.direction,
          source: f.source,
          quality: f.stale ? 'stale' : 'ok',
        })),
        sources: d.dataSources.map(s => ({
          name: s.name,
          date: s.date || s.period,
          status: s.status === 'current' ? 'ok' : s.status,
          note: s.staleReason,
        })),
      }
    },
    {
      id: 3,
      time: '10:28',
      type: 'user',
      actor: 'Handläggare',
      label: 'AI-underlag granskat',
      chips: [],
      detail: {
        rows: [
          { label: 'Granskad av', value: d.officer },
          { label: 'Bekräftelse', value: 'Jag har tagit del av och granskat AI-underlaget' },
        ]
      }
    },
    {
      id: 4,
      time: timeNow,
      type: 'decision',
      actor: 'Handläggare',
      label: 'Beslut fattat: AVSLAG (avviker från AI)',
      chips: [
        { label: '⚠ Avvek från AI-rekommendation', style: 'medium' },
      ],
      detail: {
        decision: 'AVSLAG',
        motivationCategory: motivation?.category || '',
        motivationText: motivation?.text || '',
        alignment: 'Avvek från AI-rekommendation',
        rows: [
          { label: 'Handläggare', value: d.officer },
          { label: 'Modell', value: 'Kreditrisk v2.3 · Tränad nov 2024' },
        ]
      }
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F6F6] font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <PageHeader d={d} />
        <main className="flex-1 overflow-y-auto p-6 pt-4">
          <div className="flex flex-col gap-5">

            {/* Override banner */}
            <div className="bg-[#e9effb] border border-[#c2d2f5] rounded-xl p-4 flex items-start gap-4">
              <div className="flex items-center py-1 flex-shrink-0">
                <CircleAlert size={16} className="text-[#112b64]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#112b64] leading-7 text-lg">Avvikelse från AI-rekommendation registrerad</p>
                <p className="text-sm text-[#112b64] leading-5 mt-0.5">{today} · {timeNow} · {d.officer} · {d.id}</p>
              </div>
              <button
                className="w-5 h-5 flex items-center justify-center rounded bg-[#f2f2f2] border border-[#dbdbdb] flex-shrink-0 shadow-[inset_0px_-3px_4px_rgba(0,0,0,0.07),inset_0px_2px_2px_1px_rgba(244,244,244,0.93)] hover:bg-[#e8e8e8] transition-colors"
                aria-label="Stäng"
              >
                <X size={12} className="text-gray-500" />
              </button>
            </div>

            {/* DiffView (S3) */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col gap-3">
              <p className="text-xl font-bold text-gray-900">AI-rekommendation vs Beslut</p>
              <div className="flex items-center gap-12">
                {/* Vänster: AI-rekommendation */}
                <div className="flex items-start justify-between w-[343px]">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-500">AI-rekommendation</p>
                      <p className="text-2xl font-medium text-gray-900">{d.aiRecommendation}</p>
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xl border text-xs font-medium w-fit ${confBadge.cls}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${confBadge.dot}`} />
                      {confBadge.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e9effb] border border-[#c2d2f5] text-[#112b64] text-xs font-medium shrink-0">
                    <Sparkles size={14} />
                    AI
                  </div>
                </div>
                {/* Divider */}
                <div className="w-px h-[131px] bg-gray-200 shrink-0" />
                {/* Höger: Slutgiltigt beslut */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Slutgiltigt beslut</p>
                    <p className="text-2xl font-medium text-gray-900">AVSLAG</p>
                  </div>
                  {motivation?.category && (
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-gray-500">Kategori:</p>
                      <p className="text-base font-medium text-gray-900">{motivation.category}</p>
                    </div>
                  )}
                  {motivation?.text && (
                    <p className="text-xs text-gray-600">{motivation.text}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-[760px] flex flex-col gap-5 w-full">
            {/* Spårlogg */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-end justify-between pb-3 border-b border-gray-200">
                <p className="text-3xl font-bold text-gray-900">Spårlogg</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>AI-modell:</span>
                  <span className="text-gray-900">Kreditrisk v2.3 · Tränad nov 2024</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex flex-col">
                {auditEvents.map((ev, i) => {
                  const isOpen = openEvents.has(ev.id)
                  const toggleOpen = () => setOpenEvents(prev => {
                    const next = new Set(prev)
                    if (next.has(ev.id)) next.delete(ev.id)
                    else next.add(ev.id)
                    return next
                  })
                  return (
                    <div key={ev.id} className="flex gap-4">
                      {/* Icon + connector line */}
                      <div className="flex flex-col items-center w-6 flex-shrink-0">
                        <div className={`mt-3 w-6 h-6 rounded-xl flex items-center justify-center border shrink-0 ${
                          ev.type === 'ai' ? 'bg-[#e9effb] border-[#c2d2f5]' : 'bg-gray-100 border-gray-300'
                        }`}>
                          {ev.type === 'ai'
                            ? <Sparkles size={12} className="text-[#112b64]" />
                            : ev.type === 'system'
                            ? <ClipboardList size={12} className="text-gray-500" />
                            : <User size={12} className="text-gray-500" />
                          }
                        </div>
                        {i < auditEvents.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 mt-3 min-h-4" />
                        )}
                      </div>

                      {/* Event card */}
                      <div className="flex-1 min-w-0 pb-2">
                        <div className="overflow-hidden">
                          {/* Row header */}
                          <div className="flex items-center justify-between p-3">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-medium text-gray-700">{ev.label}</p>
                                {ev.type === 'ai' && ev.chips?.map(chip => (
                                  <div key={chip.label} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xl border text-xs font-medium ${
                                    chip.style === 'low' ? 'bg-red-50 border-red-200 text-red-800'
                                    : chip.style === 'medium' ? 'bg-[#fef3e6] border-[#fddeb9] text-[#9f5704]'
                                    : 'bg-green-50 border-green-200 text-green-700'
                                  }`}>
                                    <div className={`w-1 h-1 rounded-full ${
                                      chip.style === 'low' ? 'bg-red-500'
                                      : chip.style === 'medium' ? 'bg-[#f97316]'
                                      : 'bg-green-500'
                                    }`} />
                                    {chip.label}
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-gray-500">{ev.time}</p>
                            </div>
                            <button
                              onClick={toggleOpen}
                              className="flex items-center gap-2 text-xs font-medium text-gray-900 shrink-0"
                            >
                              Visa detaljer
                              <div className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 border border-gray-200 shadow-[inset_0px_-3px_4px_rgba(0,0,0,0.07),inset_0px_2px_2px_1px_rgba(244,244,244,0.93)]">
                                <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                              </div>
                            </button>
                          </div>

                          {/* Detail section */}
                          {isOpen && ev.detail && (
                            <div className="px-5 py-4 bg-gray-50 flex flex-col gap-2 text-xs border-t border-gray-100">
                              {/* Decision type: override badge first */}
                              {ev.type === 'decision' && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl border bg-[#e9effb] border-[#c2d2f5] text-[#112b64] text-xs font-medium w-fit mb-1">
                                  Avvek från AI-rekommendation: {d.aiRecommendation}
                                  <CircleAlert size={12} />
                                </div>
                              )}

                              {/* Rows (all types) */}
                              {ev.detail.rows?.map(row => (
                                <div key={row.label} className="flex items-start gap-6">
                                  <span className="text-gray-400 w-28 shrink-0">{row.label}</span>
                                  <span className="text-gray-700">{row.value}</span>
                                </div>
                              ))}

                              {/* Decision: category + motivation */}
                              {ev.type === 'decision' && ev.detail.motivationCategory && (
                                <div className="flex items-center gap-6">
                                  <span className="text-gray-400 w-28 shrink-0">Kategori:</span>
                                  <span className="text-gray-700">{ev.detail.motivationCategory}</span>
                                </div>
                              )}
                              {ev.type === 'decision' && ev.detail.motivationText && (
                                <div className="flex items-start gap-6">
                                  <span className="text-gray-400 w-28 shrink-0">Motivering:</span>
                                  <span className="text-gray-600 flex-1">{ev.detail.motivationText}</span>
                                </div>
                              )}

                              {/* AI type: intro + factors + sources */}
                              {ev.type === 'ai' && ev.detail.intro && (
                                <p className="text-gray-500 mb-1">{ev.detail.intro}</p>
                              )}
                              {ev.type === 'ai' && ev.detail.factors?.length > 0 && (
                                <div className="flex flex-col gap-1.5">
                                  <p className="text-sm font-medium text-gray-700">Nyckelfaktorer</p>
                                  {ev.detail.factors.map(f => (
                                    <div key={f.name} className="flex items-center justify-between">
                                      <div className="flex items-center gap-6">
                                        <span className="text-gray-400 w-[125px] shrink-0">{f.name}</span>
                                        <span className="text-gray-900">{f.value}</span>
                                      </div>
                                      <span className="text-gray-400">Krav: {f.limit}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {ev.type === 'ai' && ev.detail.sources?.length > 0 && (
                                <div className="flex flex-col gap-1.5 mt-1">
                                  <p className="text-sm font-medium text-gray-700">Datakällor</p>
                                  {ev.detail.sources.map(s => (
                                    <div key={s.name} className="flex items-center justify-between">
                                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xl border text-xs font-medium ${
                                        s.status === 'stale' ? 'bg-orange-50 border-orange-200 text-orange-700'
                                        : 'bg-gray-100 border-gray-300 text-gray-600'
                                      }`}>
                                        {s.name}
                                        {s.status === 'stale'
                                          ? <AlertTriangle size={12} className="shrink-0" />
                                          : <FileText size={12} className="shrink-0" />}
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                                          s.status === 'stale' ? 'text-orange-700' : 'text-gray-600'
                                        }`}>
                                          <div className={`w-1 h-1 rounded-full ${
                                            s.status === 'stale' ? 'bg-orange-500' : 'bg-gray-400'
                                          }`} />
                                          {s.status === 'stale' ? 'Inaktuell' : 'Aktuell'}
                                        </span>
                                        <span className="text-gray-400">{s.date}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Feedback widget */}
            {feedbackSent ? (
              <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-500 shrink-0" />
                Tack – din feedback har loggats
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <p className="text-xl font-bold text-gray-900">Var AI:ns rekommendation korrekt?</p>
                  <p className="text-sm text-gray-500">Din feedback används för att förbättra AI-modellen. Loggat med tidsstämpel och handläggare-ID.</p>
                </div>

                {/* Segmented control */}
                <div className="bg-[#f2f2f2] flex gap-0.5 items-center p-0.5 rounded-md w-full">
                  {[
                    { id: 'rätt', label: 'Rätt' },
                    { id: 'fel', label: 'Fel' },
                    { id: 'vet_inte', label: 'Vet inte' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setFeedbackChoice(id)}
                      className={`flex flex-1 items-center justify-center px-3 py-2 rounded text-base font-medium transition-all border ${
                        feedbackChoice === id
                          ? 'bg-white border-gray-300 text-gray-900 shadow-sm'
                          : 'bg-[#f2f2f2] border-transparent text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Textarea */}
                <div className="flex flex-col gap-2">
                  <p className="text-base font-medium text-gray-900">Ge din feedback</p>
                  <textarea
                    value={feedbackComment}
                    onChange={e => setFeedbackComment(e.target.value.slice(0, 500))}
                    placeholder="Valfri kommentar - vad tyckte du om AI:ns rekommendation?"
                    className="w-full h-[182px] text-base text-gray-700 placeholder-gray-400 border border-gray-400 rounded px-2 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                  />
                  <div className="text-right text-sm text-gray-400">{feedbackComment.length}/500 tecken</div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setFeedbackSent(true)}
                    className="bg-[#245bd1] text-white px-4 py-2 rounded text-base font-medium hover:bg-[#1d4db8] transition-colors"
                  >
                    Skicka feedback
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pb-6">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={14} /> Exportera logg
              </button>
              <button onClick={onClose} className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                ← Tillbaka till ärendelistan
              </button>
            </div>

            </div>{/* /max-w-[760px] */}
          </div>
        </main>
      </div>
    </div>
  )
}

// ── ApprovedCaseView ──────────────────────────────────────────────────────────

function ApprovedCaseView({ d, confidence, onClose }) {
  const today = new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })
  const timeNow = new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
  const confBadge = getConfidenceBadge(d.confidence ?? confidence)

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F6F6] font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <PageHeader d={d} />
        <main className="flex-1 overflow-y-auto p-6 pt-4">
          <div className="max-w-[760px] flex flex-col gap-5">

            {/* Confirmation banner */}
            <div className="bg-green-600 text-white rounded-xl px-6 py-5 flex items-start gap-4">
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Kreditansökan godkänd – ärende avslutat</p>
                <p className="text-sm text-green-100 mt-0.5">{today} · {d.officer} · {d.id}</p>
              </div>
            </div>

            {/* Decision summary */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40">
                <p className="text-sm font-semibold text-gray-700">Beslutssummering</p>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">AI rekommenderade</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-lg font-bold ${d.aiRecommendation === 'GODKÄNN' ? 'text-green-600' : 'text-red-600'}`}>{d.aiRecommendation}</span>
                    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${confBadge.cls}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${confBadge.dot}`} />
                      {confBadge.label}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Saras beslut</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-gray-900">GODKÄNN</span>
                    <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Följde AI-rekommendation</span>
                  </div>
                </div>
                <div className="col-span-2 border-t border-gray-100 pt-3 flex justify-between text-xs text-gray-400">
                  <span>Handläggare: {d.officer}</span>
                  <span>{today} · {timeNow}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pb-6">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={14} /> Exportera logg
              </button>
              <button onClick={onClose} className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                ← Tillbaka till ärendelistan
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [aiReviewed, setAiReviewed] = useState(false)

  // Track which metric's drawer or simulation is currently open
  const [activeDrawerMetric, setActiveDrawerMetric] = useState(null)
  const [activeSimulationMetric, setActiveSimulationMetric] = useState(null)

  const [cfUploadState, setCfUploadState] = useState('idle') // 'idle' | 'analyzing' | 'complete'
  const [liveConfidence, setLiveConfidence] = useState(CASE.confidence)
  const [liveSources, setLiveSources] = useState(CASE.dataSources)
  const [liveFactors, setLiveFactors] = useState(CASE.topFactors)
  const [overrideState, setOverrideState] = useState('idle') // 'idle' | 'confirming' | 'completed'
  const [overrideMotivation, setOverrideMotivation] = useState(null)
  const [approvedState, setApprovedState] = useState('idle') // 'idle' | 'completed'
  const [activeSourceDocument, setActiveSourceDocument] = useState(null) // null | { metric }

  const handleCFAnalysisComplete = () => {
    setCfUploadState('complete')
    setLiveConfidence(87)
    setLiveSources(prev => [
      ...prev.filter(s => s.status !== 'stale'),
      { name: 'Årsredovisning 2025', period: 'Januari – December 2025', status: 'ok' },
    ])
    setLiveFactors(prev => prev.map(f =>
      f.stale ? { ...f, source: 'Årsredovisning 2025', stale: false } : f
    ))
  }

  if (activeSimulationMetric) {
    if (activeSimulationMetric.factor.includes('Kassaflöde')) {
      return <CashFlowSimulationView onClose={() => setActiveSimulationMetric(null)} />
    } else {
      return <SimulationView onClose={() => setActiveSimulationMetric(null)} />
    }
  }
  if (overrideState === 'completed') return (
    <ClosedCaseView
      d={CASE}
      confidence={liveConfidence}
      motivation={overrideMotivation}
      onClose={() => { setOverrideState('idle'); setCfUploadState('idle'); setLiveConfidence(CASE.confidence); setLiveSources(CASE.dataSources); setLiveFactors(CASE.topFactors); setOverrideMotivation(null) }}
    />
  )
  if (approvedState === 'completed') return (
    <ApprovedCaseView
      d={CASE}
      confidence={liveConfidence}
      onClose={() => { setApprovedState('idle'); setCfUploadState('idle'); setLiveConfidence(CASE.confidence); setLiveSources(CASE.dataSources); setLiveFactors(CASE.topFactors) }}
    />
  )

  // Nyckeldata – koppla "Granska underlag" till respektive drawer/sim
  const granskaHandlers = [
    () => setActiveDrawerMetric(liveFactors[2]), // Omsättningsdata
    () => setActiveDrawerMetric(liveFactors[0]), // Betalningshistorik
    () => setActiveDrawerMetric(liveFactors[1]), // Utnyttjandegrad
    () => setActiveDrawerMetric(liveFactors[3]), // Branschrisk
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F6F6] font-sans">
      <Sidebar />

      {activeSourceDocument ? (
        <SourceDocumentView
          document={BOKSLUT_DOCUMENT}
          metric={activeSourceDocument.metric}
          onBack={() => {
            setActiveSourceDocument(null)
            setActiveDrawerMetric(activeSourceDocument.metric)
          }}
          caseData={CASE}
        />
      ) : (
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <PageHeader d={CASE} />

        <main className="flex-1 overflow-y-auto p-6 pt-2">
          <div className="flex gap-6 items-start max-w-[1400px]">

            {/* ── Vänster kolumn ─────────────────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              <CaseInfoCard d={CASE} />
              <AIRecommendationSection d={CASE} confidence={liveConfidence} factors={liveFactors} />

              {/* Nyckeldata */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Nyckeldata</h2>
                <div className="flex flex-col gap-4">
                  {[liveFactors[2], liveFactors[0], liveFactors[1], liveFactors[3]].map((f, i) => (
                    <MetricCard key={f.factor} factor={f} onGranska={granskaHandlers[i]} />
                  ))}
                </div>
              </div>

              <AISummaryCard
                d={CASE}
                confidence={liveConfidence}
                sources={liveSources}
                aiReviewed={aiReviewed}
                onUnlocked={setAiReviewed}
              />
            </div>

            {/* ── Höger kolumn ───────────────────────────────────────── */}
            <div className="w-[360px] flex-shrink-0 sticky top-6">
              <DecisionPanel
                d={CASE}
                aiReviewed={aiReviewed}
                onUnlocked={setAiReviewed}
                analysisComplete={cfUploadState === 'complete'}
                onOverride={() => setOverrideState('confirming')}
                onApprove={() => setApprovedState('completed')}
                onGranskaKallor={() => setActiveDrawerMetric(liveFactors[2])}
              />
            </div>

          </div>
        </main>
      </div>
      )}

      <KeyMetricSourceDrawer
        isOpen={!!activeDrawerMetric && !activeSourceDocument}
        onClose={() => setActiveDrawerMetric(null)}
        metric={activeDrawerMetric}
        caseData={CASE}
        onSimulate={() => {
          const metric = activeDrawerMetric;
          setActiveDrawerMetric(null);
          setActiveSimulationMetric(metric);
        }}
        onUpload={() => {
          setActiveDrawerMetric(null);
          setCfUploadState('analyzing');
        }}
        onOpenSource={(payload) => {
          setActiveDrawerMetric(null);
          setActiveSourceDocument(payload);
        }}
      />
      {cfUploadState === 'analyzing' && (
        <AIAnalysisProgress onComplete={handleCFAnalysisComplete} />
      )}
      {overrideState === 'confirming' && (
        <OverrideModal
          d={CASE}
          onConfirm={motivation => { setOverrideMotivation(motivation); setOverrideState('completed') }}
          onCancel={() => setOverrideState('idle')}
        />
      )}
    </div>
  )
}

