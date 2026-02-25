import { useState, useEffect } from 'react'
import { CASE, DISABLED_APPROVE_REASON, DISABLED_SUPPLEMENT_REASON, REJECT_WARNING } from './constants'
import SourceDrawer from './components/SourceDrawer'
import SimulationView from './components/SimulationView'
import CashFlowSourceDrawer from './components/CashFlowSourceDrawer'
import CashFlowSimulationView from './components/CashFlowSimulationView'
import {
  FileText, Users, ClipboardList, LayoutGrid, Bell, Sparkles, Lightbulb,
  BookOpen, Settings, HelpCircle, AlertTriangle, Lock, ChevronRight,
  Download, Send, CheckCircle, X, RotateCcw, ArrowRight, ArrowUpRight, Info, Loader2,
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
  { label: 'Mina ärenden', Icon: ClipboardList, id: 'mine' },
  { label: 'Ärende', Icon: FileText, id: 'case', active: true },
  { label: 'Alla ärenden', Icon: LayoutGrid, id: 'all' },
  { label: 'Beslut', Icon: CheckCircle, id: 'decisions' },
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
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-1 text-xsm text-grey-400">
          <span>Ärenden</span>
          <ChevronRight size={10} />
          <span>Ärende</span>
          <ChevronRight size={10} />
          <span className="text-grey-700 font-medium">Företagslån</span>
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
      <div className="flex items-center gap-2 text-sm text-grey-600 mb-2">
        <span>Ärende</span>
        <ChevronRight size={14} className="text-grey-400" />
        <span>Företagslån</span>
        <ChevronRight size={14} className="text-grey-400" />
        <span className="text-blue-600">#{d.id} · {d.company}</span>
      </div>
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">{d.id}</h1>
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
    ? { label: 'Hög konfidens', dot: 'bg-green-500', cls: 'text-green-800 bg-green-50 border-green-200' }
    : confidence >= 60
    ? { label: 'Medel konfidens', dot: 'bg-[#EA580C]', cls: 'text-[#B95000] bg-[#FFF4E5] border-[#FED7AA]' }
    : { label: 'Låg konfidens', dot: 'bg-red-500', cls: 'text-red-800 bg-red-50 border-red-200' }
  const renderDots = (factorName) => {
    let dots = 3;
    if (factorName.includes('Kassaflöde')) dots = 2;
    if (factorName.includes('Skuldkvot')) dots = 1;
    return (
      <div className="flex gap-1.5 items-center">
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= dots ? 'bg-[#3059CE]' : 'bg-gray-200'}`} />
        ))}
      </div>
    )
  }

  return (
    <section className="bg-white border text-left border-gray-200 rounded-xl shadow-sm overflow-hidden mt-2">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          <Lightbulb size={14} /> AI-recommendation
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-500 flex items-center gap-1">Konfidensgrad <Info size={12} /></span>
          <div className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full border ${confBadge.cls}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${confBadge.dot}`} />
            {confBadge.label}
          </div>
        </div>
      </div>

      {/* Rekommendation */}
      <div className="px-6 py-5 border-b border-gray-100">
        <p className="text-4xl font-bold text-[#D03027] tracking-tight">{d.aiRecommendation}</p>
      </div>

      {/* Faktorer Header*/}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <p className="text-sm text-gray-600">Faktorer som påverkat rekommendationen</p>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 w-[45%]">Faktor</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500">Värde</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Påverkan <Info size={12} className="inline ml-1" /></th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500">Källa</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-left">
          {(factors ?? d.topFactors).map((f, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 align-top">
                <p className="text-sm font-medium text-gray-900 mb-2">{f.factor}</p>
                <p className="text-xs text-gray-500 leading-relaxed pr-4">{f.description}</p>
              </td>
              <td className="px-6 py-4 align-top">
                <span className={`text-sm font-medium whitespace-nowrap ${f.value.includes('↓') || f.value.includes('↑') || f.value.includes('-') ? 'text-[#D03027]' : 'text-gray-900'}`}>
                  {f.value}
                </span>
              </td>
              <td className="px-6 py-4 align-top pt-5">
                {renderDots(f.factor)}
              </td>
              <td className="px-6 py-4 align-top text-right">
                <div className={`inline-flex items-center justify-start gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium whitespace-nowrap w-40
                  ${f.stale ? 'bg-[#FEF3C7] text-amber-900 border-amber-200/60' : 'bg-gray-50 text-gray-700 border-gray-200'}
                `}>
                  {f.stale && <AlertTriangle size={12} className="text-amber-600 shrink-0" />}
                  {!f.stale && <FileText size={12} className="text-gray-400 shrink-0" />}
                  <span className="truncate">{f.source}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

// ── Nyckeldata cards ──────────────────────────────────────────────────────────

function MetricCard({ factor, onGranska }) {
  const isOver = factor.diffDirection === 'över'
  const isStale = factor.stale

  return (
    <div className={`bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col ${isStale ? 'border-amber-200/50' : 'border-gray-200'}`}>

      {/* Värde + status */}
      <div className="px-6 pt-5 pb-5 border-b border-gray-100 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-sans text-3xl font-bold text-gray-900 tracking-tight leading-none">{factor.value.replace(/↑|↓/g, '').trim()}</span>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${isOver ? 'bg-red-50/50 text-red-700 border-red-100' : isStale ? 'bg-red-50/50 text-red-700 border-red-100' : 'bg-red-50/50 text-red-700 border-red-100'}`}>
              {isOver ? <span className="text-[10px]">↑</span> : isStale ? <span className="text-[10px]">↘</span> : <span className="text-[10px]">↓</span>}
              {isOver ? 'Överstiger gräns' : isStale ? 'Negativt kassaflöde' : 'Under gräns'}
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">{factor.factor}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-blue-800 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <Lightbulb size={12} /> AI-recommendation
        </div>
      </div>

      {/* Metrik-info */}
      <div className="px-6 py-5 flex flex-col gap-5 bg-white">
        <div className="flex items-center text-sm font-medium">
          <span className="text-gray-500">{isOver ? 'Gräns' : 'Krav'}: <span className="text-gray-900 font-semibold">{factor.limit}</span></span>
          <div className="w-px h-6 bg-gray-300 mx-5" />
          <span className="text-gray-900">{factor.diff} {factor.diffDirection}</span>
        </div>
        <span className="text-xs text-gray-400">Tidsperiod: {factor.period.replace('–', '-')}</span>
      </div>

      <div className="border-t border-gray-100 px-6 py-4 flex justify-between items-center bg-gray-50/30">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => {
                let dots = 3;
                if (factor.factor.includes('Kassaflöde')) dots = 2;
                if (factor.factor.includes('Skuldkvot')) dots = 1;
                return <div key={i} className={`w-2 h-2 rounded-full ${i <= dots ? 'bg-[#3059CE]' : 'bg-gray-200'}`} />
              })}
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">Påverkan <Info size={10} className="inline ml-0.5" /></span>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium whitespace-nowrap
               ${factor.stale ? 'bg-[#FEF3C7] text-amber-900 border-amber-200/60' : 'bg-white text-gray-700 border-gray-200 shadow-sm'}`}>
            {factor.stale && <AlertTriangle size={12} className="text-amber-700" />}
            {!factor.stale && <FileText size={12} className="text-gray-400" />}
            {factor.source}
          </div>
        </div>

        <button
          onClick={onGranska}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 transition-colors rounded-md shadow-sm"
        >
          Granska underlag <ArrowUpRight size={14} />
        </button>
      </div>

      {isStale && (
        <div className="px-6 py-4 flex justify-between items-end bg-gray-50/30 border-t border-transparent relative -mt-3">
          <p className="text-xs text-amber-700 max-w-[50%] leading-relaxed pt-1.5">
            Källan är föråldrad. Bankenspolicy: Max 12 månader.
          </p>
          <p className="text-sm font-medium text-[#D03027]">Uppdaterad data behövs</p>
        </div>
      )}
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

function DecisionPanel({ aiReviewed, onUnlocked, onOpenCF, analysisComplete }) {
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
                disabled={!analysisComplete && !aiReviewed}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors
                  ${analysisComplete
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : aiReviewed
                    ? 'bg-[#E69391] text-white hover:bg-red-500'
                    : 'bg-gray-300/80 text-gray-500 border border-gray-300 cursor-not-allowed'}`}
              >
                Avslå {!analysisComplete && !aiReviewed && <Lock size={14} />}
              </button>
              {!analysisComplete && (
                <div className="flex justify-between items-start mt-1.5">
                  <p className="text-xs italic text-gray-500">
                    {aiReviewed ? 'Kräver motivering om granskning ej genomförts' : 'Låst tills AI-underlaget har granskats.'}
                  </p>
                  <Info size={14} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Godkänn – sekundär */}
            <div>
              <button
                disabled={!analysisComplete}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors
                  ${analysisComplete
                    ? 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
                    : 'bg-gray-300/80 text-gray-600 border border-gray-300 cursor-not-allowed'}`}
              >
                Godkänn {!analysisComplete && <Lock size={14} />}
              </button>
              {!analysisComplete && (
                <div className="flex justify-between items-start mt-1.5">
                  <p className="text-xs italic text-gray-500">Låst tills kritisk granskning är genomförd.</p>
                  <Info size={14} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hantera ärende Section */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Hantera ärende</h3>
          <div>
            <button
              disabled={!analysisComplete && !aiReviewed}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors
                ${analysisComplete
                  ? 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
                  : aiReviewed
                  ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                  : 'bg-gray-400/80 text-gray-700 border border-gray-400/50 cursor-not-allowed'}`}
            >
              Begär komplettering {!analysisComplete && !aiReviewed && <Lock size={14} />}
            </button>
            {!analysisComplete && (
              <div className="flex justify-between items-start mt-1.5">
                <p className="text-xs italic text-gray-500">Låst tills AI-underlaget har granskats.</p>
                <Info size={14} className="text-gray-400" />
              </div>
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
              <DecisionPanel aiReviewed={aiReviewed} onUnlocked={setAiReviewed} onOpenCF={() => setIsCFDrawerOpen(true)} analysisComplete={cfUploadState === 'complete'} />
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
    </div>
  )
}

