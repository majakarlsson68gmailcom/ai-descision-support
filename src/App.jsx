import { useState, useEffect } from 'react'
import { CASE, DISABLED_APPROVE_REASON, DISABLED_SUPPLEMENT_REASON, REJECT_WARNING } from './constants'
import SourceDrawer from './components/SourceDrawer'
import SimulationView from './components/SimulationView'
import CashFlowSourceDrawer from './components/CashFlowSourceDrawer'
import CashFlowSimulationView from './components/CashFlowSimulationView'
import DecisionLogTimeline from './components/DecisionLogTimeline'
import {
  FileText, Users, ClipboardList, LayoutGrid, Bell, Sparkles, Lightbulb,
  BookOpen, Settings, HelpCircle, AlertTriangle, Lock, ChevronRight,
  Download, Send, CheckCircle, X, RotateCcw, ArrowRight, ArrowUpRight, ArrowUp, ArrowDown, Info, Loader2,
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

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV = [
  { label: 'Kunder', Icon: Users, id: 'customers' },
  { label: 'Mina ärenden', Icon: ClipboardList, id: 'mine', active: true },
  { label: 'Alla ärenden', Icon: LayoutGrid, id: 'all' },
  { label: 'Aviseringar', Icon: Bell, id: 'alerts' },
  { label: 'Rekommendationer', Icon: Lightbulb, id: 'recs' },
  { label: 'Beslutslogg', Icon: BookOpen, id: 'log' },
  { label: 'Inställningar', Icon: Settings, id: 'settings' },
  { label: 'Hjälp', Icon: HelpCircle, id: 'help' },
]

function Sidebar() {
  return (
    <aside className="w-[220px] flex-shrink-0 h-screen overflow-y-auto bg-grey-25 border-r border-grey-100 flex flex-col">
      {/* Logo */}
      <div className="h-12 flex items-center gap-2.5 px-4 border-b border-grey-100">
        <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center flex-shrink-0">
          <FileText size={12} color="white" />
        </div>
        <span className="text-sm font-bold text-grey-900 tracking-tight">KreditSystem</span>
      </div>

      {/* Breadcrumb-sti */}
      <div className="px-4 pt-3 pb-1 w-full overflow-hidden">
        <div className="flex items-center gap-1 text-[11px] font-medium text-grey-500 uppercase tracking-widest">
          <span className="truncate min-w-0 shrink">Mina ärenden</span>
          <ChevronRight size={10} className="text-grey-400 shrink-0" />
          <span className="truncate min-w-0 shrink">Företagslån</span>
          <ChevronRight size={10} className="text-grey-400 shrink-0" />
          <span className="text-grey-800 shrink-0 whitespace-nowrap">KR-2026-0847</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5">
        {NAV.map(({ id, label, Icon, active }) => (
          <button
            key={id}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left transition-colors
              ${active
                ? 'bg-blue-50 text-blue-500 font-medium border-l-2 border-blue-500'
                : 'text-grey-700 border-l-2 border-transparent hover:bg-grey-50'
              }`}
          >
            <Icon size={14} className="flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>
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
            Exportera <Download size={16} />
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-white bg-[#3059CE] rounded px-5 py-2 hover:bg-blue-700 transition-colors shadow-sm">
            Skicka till <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}

function CaseInfoCard({ d }) {
  const fields = [
    { label: 'Företag', value: d.company },
    { label: 'Org.nr', value: d.orgNr, mono: true },
    { label: 'Belopp', value: `${d.amount.toLocaleString('sv-SE')} kr`, mono: true },
    { label: 'Ändamål', value: d.purpose },
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
  const confBadge = confidence >= 80
    ? { label: 'Hög konfidens', dot: 'bg-green-500', cls: 'bg-green-50 border-green-200 text-green-800' }
    : confidence >= 60
      ? { label: 'Medel konfidens', dot: 'bg-[#f97316]', cls: 'bg-[#fef3e6] border-[#fddeb9] text-[#9f5704]' }
      : { label: 'Låg konfidens', dot: 'bg-red-500', cls: 'bg-red-50 border-red-200 text-red-800' }

  const renderValue = (f) => {
    const hasUp = f.value.includes('↑')
    const hasDown = f.value.includes('↓')
    const clean = f.value.replace(/↑|↓/g, '').trim()
    return (
      <div className="flex items-center gap-0.5 text-[#dc2626] text-xs font-medium">
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
    <section className="bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden mt-2 text-left">

      {/* Header: AI badge + AVSLAG + konfidensgrad */}
      <div className="px-3 py-4 border-b border-gray-200 flex flex-col gap-3">
        <div className="flex items-center gap-1 self-start px-2 py-0.5 rounded-xl bg-[#e9effb] border border-[#c2d2f5] text-[#112b64] text-xs font-medium">
          <Sparkles size={14} />
          AI-recommendation
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-semibold text-[#dc2626] leading-8">{d.aiRecommendation}</p>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              Konfidensgrad <Info size={12} />
            </span>
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-xl border ${confBadge.cls}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${confBadge.dot}`} />
              {confBadge.label}
            </div>
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
            <div className="flex items-center gap-0.5">
              <p className="text-xs font-medium text-gray-900">Påverkan</p>
              <Info size={12} className="text-gray-500" />
            </div>
            <p className="text-xs font-medium text-gray-900 w-40 text-center">Källa</p>
          </div>
        </div>
      </div>

      {/* Faktorrader */}
      {activeFactors.map((f, i) => (
        <div key={i} className={`p-3 flex items-center gap-12 ${i < activeFactors.length - 1 ? 'border-b border-gray-200' : ''}`}>
          <div className="flex-1 flex flex-col gap-2.5 min-w-0">
            <p className="text-sm text-gray-900">{f.factor}</p>
            <p className="text-xs font-medium text-gray-500 leading-relaxed">{f.description}</p>
          </div>
          <div className="flex items-center gap-9 justify-end shrink-0 w-[340px]">
            <div className="w-10 flex justify-center">{renderValue(f)}</div>
            <div className="flex justify-center">{renderDots(f.weight)}</div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-xl border text-xs font-medium w-40 justify-center
              ${f.stale ? 'bg-[#fef3e6] border-[#fddeb9] text-[#9f5704]' : 'bg-[#f2f2f2] border-[#dbdbdb] text-[#525252]'}`}>
              <span className="truncate">{f.source}</span>
              {f.stale
                ? <AlertTriangle size={14} className="shrink-0" />
                : <FileText size={14} className="text-gray-500 shrink-0" />}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

// ── Nyckeldata cards ──────────────────────────────────────────────────────────

function MetricCard({ factor, onGranska }) {
  const isOver = factor.diffDirection === 'över'
  const isStale = factor.stale
  const paverkanLevel = factor.weight === 'hög' ? 3 : factor.weight === 'medel' ? 2 : 1

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">

      {/* Header: värde + badges + titel */}
      <div className="px-6 pt-6 pb-0 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[32px] font-bold text-gray-900 leading-10">
              {factor.value.replace(/↑|↓/g, '').trim()}
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-[#fbe9e9] border border-[#f5c2c2] text-[#8c1717] text-xs font-medium">
              {isOver ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {isOver ? 'Överstiger gräns' : 'Under gräns'}
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-[#e9effb] border border-[#c2d2f5] text-[#112b64] text-xs font-medium">
            <Sparkles size={14} />
            AI
          </div>
        </div>
        <p className="text-base font-medium text-gray-900">{factor.factor}</p>
      </div>

      {/* Krav/gräns + diff */}
      <div className="px-6 pt-5 pb-0">
        <div className="flex items-center gap-5">
          <p className="text-lg font-semibold text-gray-500">
            {isOver ? 'Gräns' : 'Krav'}:{' '}
            <span className="text-gray-900">{factor.limit}</span>
          </p>
          <div className="w-0.5 h-14 bg-gray-300" />
          <p className="text-lg font-semibold text-gray-900">
            {factor.diff} {factor.diffDirection}
          </p>
        </div>
      </div>

      {/* Tidsperiod */}
      <div className="px-6 pt-4 pb-0">
        <p className="text-sm text-gray-500">Tidsperiod: {factor.period.replace('–', '-')}</p>
      </div>

      {/* Stale-varning */}
      {isStale && (
        <div className="px-6 pt-3">
          <p className="text-xs text-amber-700 leading-relaxed">
            Källan är föråldrad. Bankens policy: Max 12 månader.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 border-t border-gray-200 px-3 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${i <= paverkanLevel ? 'bg-[#245bd1]' : 'bg-gray-200'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500 flex items-center gap-0.5 whitespace-nowrap">
              Påverkan <Info size={10} className="inline ml-0.5" />
            </span>
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-xl border text-xs font-medium whitespace-nowrap
            ${isStale ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
            {isStale ? <AlertTriangle size={14} className="text-amber-700" /> : <FileText size={14} className="text-gray-500" />}
            {factor.source}
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
  const statusLabel = { ok: 'Aktuell', stale: 'Inaktuell' }

  const confidenceBadge = confidence >= 80
    ? { label: 'Hög konfidens', dot: 'bg-green-500', badge: 'bg-green-50 text-green-800 border-green-200' }
    : confidence >= 60
      ? { label: 'Medel konfidens', dot: 'bg-[#F98806]', badge: 'bg-[#FEF3E6] text-[#9f5704] border-[#FDDEB9]' }
      : { label: 'Låg konfidens', dot: 'bg-red-500', badge: 'bg-red-50 text-red-800 border-red-200' }

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 mt-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-bold text-gray-900">Sammanfattning</h2>
        <div className="flex items-center gap-1 text-xs font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
          <Sparkles size={12} /> AI
        </div>
      </div>

      {/* Konfidensgrad */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          Konfidensgrad <Info size={12} className="text-gray-400" />
        </span>
        <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border w-fit ${confidenceBadge.badge}`}>
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
            <span className="text-2xl font-medium text-red-600">{d.aiRecommendation.charAt(0).toUpperCase() + d.aiRecommendation.slice(1).toLowerCase()}</span>
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
                    <div className={`inline-flex items-center gap-1 text-xs font-medium ${s.status === 'stale' ? 'text-amber-700' : 'text-green-700'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.status === 'stale' ? 'bg-amber-500' : 'bg-green-500'}`} />
                      {statusLabel[s.status]}
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

function DecisionPanel({ aiReviewed, onUnlocked, onOpenCF, analysisComplete, onReject }) {
  const unlocked = analysisComplete || aiReviewed
  return (
    <aside className="bg-white border border-grey-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-fit">

      {/* Warning Top Section – döljs efter analys */}
      {!analysisComplete && (
        <div className="p-4 bg-red-50/30 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Kritisk granskning saknas</h3>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <AlertTriangle size={16} className="text-amber-600" />
            Kassaflöde (föråldrad källa)
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Rekommenderade nästa steg</h4>
            <button onClick={onOpenCF} className="flex items-center justify-between w-full text-sm text-blue-700 hover:text-blue-800 transition-colors py-1">
              <span>Granska kassaflöde</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col gap-6">

        {/* Beslut Section */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Beslut</h3>
          <div className="flex flex-col gap-3">

            {/* Avslå – primär CTA efter analys */}
            <div>
              <button
                disabled={!unlocked}
                onClick={unlocked ? onReject : undefined}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors
                  ${unlocked
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300/80 text-gray-500 border border-gray-300 cursor-not-allowed'}`}
              >
                Avslå {!unlocked && <Lock size={14} />}
              </button>
              {!unlocked && (
                <div className="flex justify-between items-start mt-1.5">
                  <p className="text-xs italic text-gray-500">Låst tills AI-underlaget har granskats.</p>
                  <Info size={14} className="text-gray-400" />
                </div>
              )}
              {unlocked && (
                <p className="text-xs text-gray-400 mt-1">Kräver motivering – loggas automatiskt</p>
              )}
            </div>

            {/* Godkänn – sekundär */}
            <div>
              <button
                disabled={!unlocked}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors
                  ${unlocked
                    ? 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
                    : 'bg-gray-300/80 text-gray-600 border border-gray-300 cursor-not-allowed'}`}
              >
                Godkänn {!unlocked && <Lock size={14} />}
              </button>
              {!unlocked && (
                <div className="flex justify-between items-start mt-1.5">
                  <p className="text-xs italic text-gray-500">Låst tills AI-underlaget har granskats.</p>
                  <Info size={14} className="text-gray-400" />
                </div>
              )}
              {unlocked && (
                <p className="text-xs text-gray-400 mt-1">Bekräftar beviljat kreditbeslut</p>
              )}
            </div>
          </div>
        </div>

        {/* Hantera ärende Section */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Hantera ärende</h3>
          <div>
            <button
              disabled={!unlocked}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors
                ${unlocked
                  ? 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
                  : 'bg-gray-400/80 text-gray-700 border border-gray-400/50 cursor-not-allowed'}`}
            >
              Begär komplettering {!unlocked && <Lock size={14} />}
            </button>
            {!unlocked && (
              <div className="flex justify-between items-start mt-1.5">
                <p className="text-xs italic text-gray-500">Låst tills AI-underlaget har granskats.</p>
                <Info size={14} className="text-gray-400" />
              </div>
            )}
            {unlocked && (
              <p className="text-xs text-gray-400 mt-1">Pausar ärendet och begär underlag</p>
            )}
          </div>
        </div>

      </div>
    </aside>
  )
}

// ── Bottom action bar ─────────────────────────────────────────────────────────

function BottomActionBar({ aiReviewed }) {
  const [rejected, setRejected] = useState(false)
  const [requested, setRequested] = useState(false)

  if (rejected) return (
    <div className="border-t border-grey-200 bg-red-50 px-6 py-3 flex items-center gap-3">
      <X size={14} className="text-red-600" />
      <p className="text-sm font-medium text-red-700">Ansökan avslagen. Åtgärden loggad.</p>
    </div>
  )
  if (requested) return (
    <div className="border-t border-grey-200 bg-blue-50 px-6 py-3 flex items-center gap-3">
      <RotateCcw size={14} className="text-blue-500" />
      <p className="text-sm font-medium text-blue-800">Komplettering begärd. Ärendet pausat.</p>
    </div>
  )

  return (
    <div className="border-t border-grey-200 bg-white px-6 py-3 flex items-center justify-between flex-shrink-0">
      <span className="text-xsm font-semibold uppercase tracking-widest text-grey-400">Hantera ärende</span>
      <div className="flex items-center gap-3">
        {/* Begär komplettering */}
        <button
          disabled={!aiReviewed}
          onClick={() => setRequested(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold border transition-colors
            ${aiReviewed
              ? 'bg-white text-grey-700 border-grey-300 hover:bg-grey-50'
              : 'bg-grey-50 text-grey-300 border-grey-200 cursor-not-allowed'}`}
        >
          {!aiReviewed && <Lock size={12} />}
          <RotateCcw size={13} /> Begär komplettering
        </button>

        {/* Godkänn */}
        <div className="flex flex-col items-start">
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold bg-grey-100 text-grey-400 border border-grey-200 cursor-not-allowed"
          >
            <Lock size={12} /> Godkänn
          </button>
          <span className="text-xsm text-orange-700 mt-0.5 flex items-center gap-1">
            <Lock size={9} /> {DISABLED_APPROVE_REASON}
          </span>
        </div>

        {/* Avslå */}
        <div className="flex flex-col items-start">
          <button
            onClick={() => setRejected(true)}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <X size={13} /> Avslå
          </button>
          <span className="text-xsm text-grey-400 mt-0.5">{REJECT_WARNING}</span>
        </div>
      </div>
    </div>
  )
}

// ── MotivationModal ───────────────────────────────────────────────────────────

const MOTIVATION_CATEGORIES = [
  'Uppfyller ej kreditkrav',
  'Otillräcklig återbetalningsförmåga',
  'Förhöjd kreditrisk',
  'Bristfälligt underlag',
]

function MotivationModal({ d, onConfirm, onCancel }) {
  const [selected, setSelected] = useState(null)
  const [freetext, setFreetext] = useState('')

  const handleConfirm = () => {
    onConfirm(selected + (freetext.trim() ? ': ' + freetext.trim() : ''))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[520px] flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Bekräfta avslag</h2>
          <p className="text-sm text-gray-500 mt-1">Välj en kategori och lägg till en kommentar om du vill. Motiveringen loggas.</p>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg mt-3">
            <span className="text-sm font-medium text-gray-800">{d.company}</span>
            <span className="text-gray-400">·</span>
            <span className="text-sm text-gray-600">{d.amount.toLocaleString('sv-SE')} kr</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {MOTIVATION_CATEGORIES.map(cat => (
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

        <textarea
          value={freetext}
          onChange={e => setFreetext(e.target.value)}
          placeholder="Lägg till kommentar... (valfritt)"
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <div className="flex items-center justify-between pt-1">
          <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Avbryt
          </button>
          <button
            onClick={handleConfirm}
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
  const confBadge = confidence >= 80
    ? { label: 'Hög konfidens', dot: 'bg-green-500', cls: 'text-green-800 bg-green-50 border-green-200' }
    : confidence >= 60
      ? { label: 'Medel konfidens', dot: 'bg-orange-500', cls: 'text-orange-800 bg-orange-50 border-orange-200' }
      : { label: 'Låg konfidens', dot: 'bg-red-500', cls: 'text-red-800 bg-red-50 border-red-200' }

  const today = new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })

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
          { label: 'Belopp', value: '2 500 000 kr' },
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
        { label: 'Medel konfidens', style: 'medium' },
      ],
      detail: {
        intro: 'Initiell analys baserad på 3 datakällor. En källa äldre än 180 dagar.',
        confidenceReason: 'Årsredovisning 2022 är 250 dagar gammal – sänker konfidens.',
        factors: [
          { name: 'Räntetäckningsgrad', value: '0.8x', limit: '≥ 1.2x', direction: 'negativ', source: 'Årsredovisning 2022', quality: 'stale' },
          { name: 'Skuldkvot', value: '1.2x', limit: '≤ 0.8x', direction: 'negativ', source: 'Kreditupplysning UC', quality: 'ok' },
          { name: 'Kassaflöde', value: '−240 000 kr', limit: '> 0', direction: 'negativ', source: 'Årsredovisning 2022', quality: 'stale' },
        ],
        sources: [
          { name: 'Kreditupplysning UC', date: '2024-12-15', status: 'ok' },
          { name: 'Skatteregistret', date: '2024-10-20', status: 'ok' },
          { name: 'Årsredovisning 2022', date: '2024-04-10', status: 'stale', note: '250 dagar gammal' },
        ]
      }
    },
    {
      id: 3,
      time: '10:31',
      type: 'user',
      actor: 'Handläggare',
      label: 'Nytt underlag uppladdad',
      chips: [],
      detail: {
        rows: [
          { label: 'Fil', value: 'Årsredovisning_2025.pdf' },
          { label: 'Period', value: 'Januari – December 2025' },
          { label: 'Ersätter', value: 'Årsredovisning 2022 (inaktuell)' },
          { label: 'Uppladdad av', value: d.officer },
        ]
      }
    },
    {
      id: 4,
      time: '10:32',
      type: 'ai',
      actor: 'AI',
      label: 'AI-analys uppdaterad',
      chips: [
        { label: 'Konfidens höjd', style: 'high' },
      ],
      detail: {
        intro: 'Ny källa analyserad. Alla datakällor nu aktuella. Rekommendation oförändrad.',
        confidenceReason: 'Inaktuell källa ersatt med aktuell årsredovisning. Skuldkvot och räntetäckningsgrad fortfarande kritiska.',
        confidenceChange: { from: 61, fromLevel: 'medium', to: 87, toLevel: 'high' },
        factors: [
          { name: 'Räntetäckningsgrad', value: '0.8x', limit: '≥ 1.2x', direction: 'negativ', source: 'Årsredovisning 2025', quality: 'ok' },
          { name: 'Skuldkvot', value: '1.2x', limit: '≤ 0.8x', direction: 'negativ', source: 'Kreditupplysning UC', quality: 'ok' },
          { name: 'Kassaflöde', value: '−240 000 kr', limit: '> 0', direction: 'negativ', source: 'Årsredovisning 2025', quality: 'ok' },
        ],
        sources: [
          { name: 'Kreditupplysning UC', date: '2024-12-15', status: 'ok' },
          { name: 'Skatteregistret', date: '2024-10-20', status: 'ok' },
          { name: 'Årsredovisning 2025', date: '2025-01-10', status: 'ok', note: 'Ny källa' },
        ]
      }
    },
    {
      id: 5,
      time: '10:33',
      type: 'user',
      actor: 'Handläggare',
      label: 'AI-underlag granskat och bekräftat',
      chips: [],
      detail: {
        rows: [
          { label: 'Granskad av', value: d.officer },
          { label: 'Bekräftelse', value: 'Jag har tagit del av och granskat AI-underlaget' },
        ]
      }
    },
    {
      id: 6,
      time: '10:34',
      type: 'decision',
      actor: 'Handläggare',
      label: 'Beslut fattat: AVSLAG',
      chips: [
        { label: '✓ Följde AI-rekommendation', style: 'aligned' },
      ],
      detail: {
        decision: 'AVSLAG',
        motivationCategory: 'Otillräcklig återbetalningsförmåga',
        motivationText: motivation,
        alignment: 'Följde AI-rekommendation',
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
          <div className="max-w-[760px] flex flex-col gap-5">

            {/* Confirmation banner */}
            <div className="bg-blue-600 text-white rounded-xl px-6 py-5 flex items-start gap-4">
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Avslag bekräftat – ärende avslutat</p>
                <p className="text-sm text-blue-100 mt-0.5">{today} · Sara Lindgren · {d.id}</p>
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
                    <span className="text-lg font-bold text-[#D03027]">AVSLAG</span>
                    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${confBadge.cls}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${confBadge.dot}`} />
                      {confBadge.label}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Saras beslut</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-gray-900">AVSLAG</span>
                    <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Följde AI-rekommendation</span>
                  </div>
                </div>
                <div className="col-span-2 border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400 mb-1">Motivering</p>
                  <p className="text-sm text-gray-800 font-medium">{motivation}</p>
                </div>
                <div className="col-span-2 border-t border-gray-100 pt-3 flex justify-between text-xs text-gray-400">
                  <span>Handläggare: Sara Lindgren</span>
                  <span>{today} · 10:34</span>
                </div>
              </div>
            </div>

            {/* Spårlogg */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Spårlogg</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />AI</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />Handläggare</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />System</span>
                </div>
              </div>
              <div className="px-6 py-5">
                <DecisionLogTimeline events={auditEvents} />
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSimulationMode, setIsSimulationMode] = useState(false)
  const [isCFDrawerOpen, setIsCFDrawerOpen] = useState(false)
  const [isCFSimulationMode, setIsCFSimulationMode] = useState(false)
  const [cfUploadState, setCfUploadState] = useState('idle') // 'idle' | 'analyzing' | 'complete'
  const [liveConfidence, setLiveConfidence] = useState(CASE.confidence)
  const [liveSources, setLiveSources] = useState(CASE.dataSources)
  const [liveFactors, setLiveFactors] = useState(CASE.topFactors)
  const [rejectionState, setRejectionState] = useState('idle') // 'idle' | 'motivating' | 'rejected'
  const [rejectionMotivation, setRejectionMotivation] = useState('')

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

  if (isSimulationMode) return <SimulationView onClose={() => setIsSimulationMode(false)} />
  if (isCFSimulationMode) return <CashFlowSimulationView onClose={() => setIsCFSimulationMode(false)} />
  if (rejectionState === 'rejected') return (
    <ClosedCaseView
      d={CASE}
      confidence={liveConfidence}
      motivation={rejectionMotivation}
      onClose={() => { setRejectionState('idle'); setCfUploadState('idle'); setLiveConfidence(CASE.confidence); setLiveSources(CASE.dataSources); setLiveFactors(CASE.topFactors); setRejectionMotivation('') }}
    />
  )

  // Nyckeldata – koppla "Granska underlag" till respektive drawer/sim
  const granskaHandlers = [
    () => { setIsCFDrawerOpen(false); setIsDrawerOpen(false) }, // Skuldkvot – ingen drawer ännu
    () => setIsDrawerOpen(true),      // Räntetäckningsgrad
    () => setIsCFDrawerOpen(true),    // Kassaflöde
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F6F6] font-sans">
      <Sidebar />

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
                  {/* Skuldkvot, Räntetäckningsgrad, Kassaflöde */}
                  {[liveFactors[2], liveFactors[0], liveFactors[1]].map((f, i) => (
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
                aiReviewed={aiReviewed}
                onUnlocked={setAiReviewed}
                onOpenCF={() => setIsCFDrawerOpen(true)}
                analysisComplete={cfUploadState === 'complete'}
                onReject={() => setRejectionState('motivating')}
              />
            </div>

          </div>
        </main>
      </div>

      <SourceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSimulate={() => { setIsDrawerOpen(false); setIsSimulationMode(true) }}
      />
      <CashFlowSourceDrawer
        isOpen={isCFDrawerOpen}
        onClose={() => setIsCFDrawerOpen(false)}
        onSimulate={() => { setIsCFDrawerOpen(false); setIsCFSimulationMode(true) }}
        onUpload={() => { setIsCFDrawerOpen(false); setCfUploadState('analyzing') }}
      />
      {cfUploadState === 'analyzing' && (
        <AIAnalysisProgress onComplete={handleCFAnalysisComplete} />
      )}
      {rejectionState === 'motivating' && (
        <MotivationModal
          d={CASE}
          onConfirm={motivation => { setRejectionMotivation(motivation); setRejectionState('rejected') }}
          onCancel={() => setRejectionState('idle')}
        />
      )}
    </div>
  )
}

