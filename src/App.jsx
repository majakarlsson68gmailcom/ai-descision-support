import { useState, useEffect, useRef } from 'react'
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
  Download, Send, CheckCircle, X, RotateCcw, ArrowRight, ArrowUpRight, ArrowDown, Info, Loader2,
  Shield, PanelLeftClose, CircleMinus, Search, Sun, Moon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { confidence as confTokens } from './tokens'

// ── Helpers ───────────────────────────────────────────────────────────────────

function Tag({ children, color = 'neutral' }) {
  const styles = {
    orange:  'bg-conf-medium-bg text-conf-medium-fg border-conf-medium-border',
    red:     'bg-conf-low-bg     text-conf-low-fg     border-conf-low-border',
    green:   'bg-conf-high-bg    text-conf-high-fg    border-conf-high-border',
    neutral: 'bg-muted          text-muted-foreground border-border',
    blue:    'bg-accent-subtle   text-accent-strong   border-accent-border',
    purple:  'bg-accent-subtle   text-accent-strong   border-accent-border',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-xsm font-medium ${styles[color]}`}>
      {children}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-xsm font-semibold uppercase tracking-widest text-muted-foreground mb-2">
      {children}
    </p>
  )
}

// Enda källa till sanning för konfidensbadgen – härleds ur tokens.confidence
function getConfidenceBadge(confidence) {
  const level = typeof confidence === 'number'
    ? confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low'
    : confidence // 'high' | 'medium' | 'low'
  const t = confTokens[level] ?? confTokens.low
  return { label: t.label, dot: t.dot, cls: `${t.bg} ${t.border} ${t.text}` }
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar() {
  return (
    <aside className="w-[220px] flex-shrink-0 h-screen overflow-y-auto bg-secondary border-r border-border flex flex-col">

      {/* Section: Ärenden */}
      <div className="pl-6 pr-4 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between px-4">
          <span className="text-base font-semibold text-muted-foreground leading-normal">Ärenden</span>
          <button className="bg-card border border-border rounded-md p-2 flex items-center justify-center hover:bg-accent transition-colors">
            <PanelLeftClose size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {[
            { label: 'Översikt', Icon: LayoutGrid },
            { label: 'Kunder', Icon: User },
            { label: 'Mina ärenden', Icon: ClipboardList, active: true },
            { label: 'Alla ärenden', Icon: ClipboardList },
          ].map(({ label, Icon, active }) => (
            <button key={label} className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${active ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
              <Icon size={16} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Section: Beslutsstöd */}
      <div className="pl-6 pr-4 py-6 border-t border-border flex flex-col gap-4">
        <div className="px-4">
          <span className="text-base font-semibold text-muted-foreground leading-normal">Beslutsstöd</span>
        </div>
        <div className="flex flex-col gap-1">
          {[
            { label: 'Aviseringar', Icon: Bell },
            { label: 'Rekommendationer', Icon: Lightbulb },
            { label: 'Beslutslogg', Icon: BookOpen },
          ].map(({ label, Icon }) => (
            <button key={label} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground text-left transition-colors hover:bg-accent hover:text-foreground">
              <Icon size={16} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Section: System */}
      <div className="pl-6 pr-4 py-6 border-t border-border flex flex-col gap-4">
        <div className="px-4">
          <span className="text-base font-semibold text-muted-foreground leading-normal">System</span>
        </div>
        <div className="flex flex-col gap-1">
          {[
            { label: 'Inställningar', Icon: Settings },
            { label: 'Hjälp', Icon: HelpCircle },
            { label: 'Säkerhet', Icon: Shield },
          ].map(({ label, Icon }) => (
            <button key={label} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground text-left transition-colors hover:bg-accent hover:text-foreground">
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

function PageHeader({ d, theme, onToggleTheme }) {
  return (
    <header className="px-6 py-6 pb-2 shrink-0">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground mb-2">
            <span className="hover:text-foreground cursor-pointer transition-colors">Mina ärenden</span>
            <ChevronRight size={14} className="text-muted-foreground/60" />
            <span className="hover:text-foreground cursor-pointer transition-colors">Företagslån</span>
            <ChevronRight size={14} className="text-muted-foreground/60" />
            <span className="text-foreground">{d.id} · {d.company}</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">{d.id}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button variant="outline">
            Exportera PDF <Download size={16} />
          </Button>
          <Button>
            Eskalera ärende <ArrowUpRight size={16} />
          </Button>
        </div>
      </div>
    </header>
  )
}

function CaseInfoCard({ d }) {
  const amountStr = typeof d.amount === 'number'
    ? `${d.amount.toLocaleString('sv-SE')} kr`
    : d.amount
  return (
    <Card className="p-6 flex flex-col gap-3 text-left">
      {/* Rad 1: Ärende-rubrik + Företag (vänster) | Org.nr (höger) */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-base font-medium text-foreground leading-6">Ärende</p>
          <div className="flex flex-col gap-0.5 leading-5">
            <p className="text-xs text-muted-foreground">Företag</p>
            <p className="text-sm text-foreground">{d.company}</p>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 leading-5 w-[173px]">
          <p className="text-xs text-muted-foreground">Org.nr</p>
          <p className="text-xs text-foreground">{d.orgNr}</p>
        </div>
      </div>
      {/* Rad 2: Belopp (vänster) | Ändamål (höger) */}
      <div className="flex items-center justify-between leading-5">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-muted-foreground">Belopp</p>
          <p className="text-sm text-foreground w-[308px]">{amountStr}</p>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-muted-foreground">Ändamål</p>
          <p className="text-sm text-foreground w-[171px]">{d.purpose}</p>
        </div>
      </div>
      {/* Rad 3: Handläggare (vänster) | Ärendenummer (höger) */}
      <div className="flex items-center justify-between leading-5">
        <div className="flex flex-col gap-0.5 w-[112px]">
          <p className="text-xs text-muted-foreground">Handläggare</p>
          <p className="text-xs text-foreground">{d.officer}</p>
        </div>
        <div className="flex flex-col gap-0.5 w-[172px]">
          <p className="text-xs text-muted-foreground">Ärendenummer</p>
          <p className="text-xs text-foreground">{d.id}</p>
        </div>
      </div>
    </Card>
  )
}

// ── TabBar ────────────────────────────────────────────────────────────────────

function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'overblick', label: 'Överblick' },
    { id: 'underlag', label: 'Underlag' },
    { id: 'sparlogg', label: 'Spårlogg' },
  ]
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

// ── AIBanner ──────────────────────────────────────────────────────────────────

function AIBanner({ onClose }) {
  return (
    <div className="bg-accent-surface border border-accent-border rounded-lg p-4 w-full">
      <div className="flex items-start justify-between w-full">
        {/* Left: icon + content */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="flex items-center py-1 shrink-0">
            <CircleAlert size={20} className="text-accent-strong" />
          </div>
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            {/* Header row: "AI" title + AI badge */}
            <div className="flex items-center gap-2">
              <p className="text-[20px] font-bold leading-7 text-accent-strong">AI</p>
              <Badge variant="accent"><Sparkles size={12} />AI</Badge>
            </div>
            {/* Body text */}
            <div className="text-[14px] leading-5 text-foreground/80">
              <p><span className="font-bold">Analyserar:</span>{' '}Strukturerad data från kopplade källor · Nyckeltal mot bankpolicy · Datakvalitet. </p>
              <p><span className="font-bold">Bedömer inte:</span>{' '}Oreviderade siffrors tillförlitlighet · Framtida marknadsutveckling · Affärsbedömning</p>
            </div>
            {/* Läs mer link */}
            <div className="flex justify-end">
              <button className="text-[12px] font-medium leading-5 text-accent-strong hover:underline">
                Läs mer
              </button>
            </div>
          </div>
        </div>
        {/* Close button */}
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center bg-card border border-border rounded-md shrink-0 ml-4 hover:bg-accent transition-colors"
          aria-label="Stäng"
        >
          <X size={12} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

// ── RecommendationCard ────────────────────────────────────────────────────────

function RecommendationCard({ d, confidence }) {
  const confBadge = getConfidenceBadge(d.confidence ?? confidence)
  const level = typeof (d.confidence ?? confidence) === 'string'
    ? (d.confidence ?? confidence)
    : (d.confidence ?? confidence) >= 80 ? 'high' : (d.confidence ?? confidence) >= 60 ? 'medium' : 'low'

  const innerCls = level === 'high'
    ? 'bg-conf-high-surface border-conf-high-border'
    : level === 'medium'
      ? 'bg-conf-medium-surface border-conf-medium-border'
      : 'bg-conf-low-surface border-conf-low-border'

  const shortLabel = confBadge.label.split(' ')[0] // "Låg" / "Medel" / "Hög"

  return (
    <Card className="p-3 flex flex-col gap-4 text-left">
      {/* AI-rekommendation badge */}
      <Badge variant="accent" className="self-start px-3 py-1 text-sm">
        <Sparkles size={14} />
        AI-rekommendation
      </Badge>
      {/* Inner confidence box */}
      <div className={`border rounded-lg p-3 flex flex-col gap-4 w-full ${innerCls}`}>
        {/* Rekommendation + Konfidensgrad */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold text-muted-foreground leading-7">Rekommendation:</p>
            <p className="text-lg font-bold text-foreground leading-7">{d.aiRecommendation}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">Konfidensgrad</p>
              <Info size={12} className="text-muted-foreground" />
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm border ${confBadge.cls}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${confBadge.dot}`} />
              <p className="text-[12px] font-medium leading-5">{shortLabel}</p>
            </div>
          </div>
        </div>
        {/* Konfidensorsak */}
        <div className="flex justify-end">
          <p className="text-sm font-medium text-muted-foreground">{d.aiSummaryShort}</p>
        </div>
        {/* Divider + beskrivning */}
        <div className="border-t border-border pt-3">
          <p className="text-base text-foreground leading-6">{d.aiSummary}</p>
        </div>
      </div>
    </Card>
  )
}

// ── WhyDecisionCard ───────────────────────────────────────────────────────────

function WhyDecisionCard({ factors, d }) {
  const cleanValue = (f) => {
    if (f.status === 'unavailable' || f.value == null) return 'Okänt'
    return f.value.replace(/↑|↓/g, '').trim()
  }

  const renderDirectionChip = (f) => {
    if (f.status === 'unavailable') {
      return (
        <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-sm bg-muted border border-border">
          <p className="text-[12px] font-medium text-muted-foreground whitespace-nowrap leading-5">Ej bedömt</p>
        </div>
      )
    }
    const isPositive = f.direction === 'positiv'
    if (isPositive) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-conf-high-bg border border-conf-high-border">
          <ArrowRight size={12} className="text-conf-high-fg" />
          <p className="text-[12px] font-medium text-conf-high-fg whitespace-nowrap leading-5">Godkänn</p>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-conf-low-bg border border-conf-low-border">
        <ArrowRight size={12} className="text-conf-low-fg" />
        <p className="text-[12px] font-medium text-conf-low-fg whitespace-nowrap leading-5">Avslå</p>
        {f.stale && <AlertTriangle size={12} className="text-dq-stale-fg" />}
      </div>
    )
  }

  // Impact dots (3 dots) + weight label + info icon
  const renderDots = (f) => {
    if (f.status === 'unavailable') {
      return <span className="text-[12px] font-medium text-muted-foreground">–</span>
    }
    const count = f.weight === 'hög' ? 3 : f.weight === 'medel' ? 2 : 1
    const label = f.weight === 'hög' ? 'Hög' : f.weight === 'medel' ? 'Medel' : 'Låg'
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full ${i <= count ? 'bg-accent-strong' : 'bg-border'}`} />
          ))}
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-[12px] font-medium text-muted-foreground whitespace-nowrap leading-5">{label}</span>
          <Info size={12} className="text-muted-foreground" />
        </div>
      </div>
    )
  }

  // Underlagsstatus: "Ej flaggad" (grey dot), "Oreviderad" (orange triangle), "Otillgänglig" (grey ban)
  const renderStatus = (f) => {
    if (f.status === 'unavailable') {
      return (
        <div className="flex items-center gap-1 px-2 py-0.5">
          <CircleMinus size={12} className="text-muted-foreground shrink-0" />
          <span className="text-[12px] font-medium text-muted-foreground whitespace-nowrap leading-5">Otillgänglig</span>
        </div>
      )
    }
    if (f.stale) {
      return (
        <div className="flex items-center gap-1 px-2 py-0.5">
          <AlertTriangle size={12} className="text-dq-stale-fg shrink-0" />
          <span className="text-[12px] font-medium text-dq-stale-fg whitespace-nowrap leading-5">Oreviderad</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 px-2 py-0.5">
        <div className="w-[5px] h-[5px] rounded-full bg-dq-ok-solid shrink-0" />
        <span className="text-[12px] font-medium text-muted-foreground whitespace-nowrap leading-5">Ej flaggad</span>
      </div>
    )
  }

  return (
    <Card className="px-6 py-5 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-bold text-foreground leading-7">Varför detta beslut?</h2>
          <Info size={20} className="text-muted-foreground" />
        </div>
        <Badge variant="accent"><Sparkles size={12} />AI</Badge>
      </div>
      {/* Tabellhuvud */}
      <div className="flex items-center justify-between border-b border-border pb-3 pt-1 text-[14px] text-foreground leading-5">
        <span>Faktor</span>
        <div className="flex items-center gap-5">
          <span className="w-[117px]">Nyckelvärde</span>
          <span className="w-[170px]">Bidrag (riktning)</span>
          <span className="w-[95px]">Underlagsstatus</span>
        </div>
      </div>
      {/* Rader */}
      {factors.map((f, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-[14px] text-foreground leading-5">{f.factor}</span>
          <div className="flex items-center gap-5">
            <span className="text-[14px] font-medium text-foreground leading-5 w-[117px]">{cleanValue(f)}</span>
            <div className="w-[170px] flex items-center gap-2.5">
              {renderDirectionChip(f)}
              {renderDots(f)}
            </div>
            <div className="w-[95px] flex items-end flex-col justify-center">
              {renderStatus(f)}
            </div>
          </div>
        </div>
      ))}
      {/* Sammanfattningstext */}
      <p className="text-[12px] font-medium text-muted-foreground mt-5 max-w-[500px] leading-5">
        {d.aiSummary}
      </p>
    </Card>
  )
}

// ── ConfidenceImpactCard ──────────────────────────────────────────────────────

function ConfidenceImpactCard({ factors }) {
  const impactFactors = factors.filter(f => f.stale || f.status === 'unavailable')
  if (impactFactors.length === 0) return null

  // Source pill: grey (stale) or dark-grey/unavailable
  const getSourceChip = (f) => {
    if (f.status === 'unavailable') {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-muted border border-border opacity-80">
          <p className="text-[12px] font-medium text-muted-foreground whitespace-nowrap leading-5">{f.source}</p>
          <CircleMinus size={12} className="text-muted-foreground shrink-0" />
        </div>
      )
    }
    // stale
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-muted border border-border">
        <p className="text-[12px] font-medium text-muted-foreground whitespace-nowrap leading-5">{f.source}</p>
        <FileText size={12} className="text-muted-foreground shrink-0" />
      </div>
    )
  }

  // Status badge
  const getStatusBadge = (f) => {
    if (f.status === 'unavailable') {
      return (
        <div className="flex items-center gap-1 px-2 py-0.5">
          <CircleMinus size={12} className="text-muted-foreground shrink-0" />
          <p className="text-[12px] font-medium text-muted-foreground whitespace-nowrap leading-5">Otillgänglig</p>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 px-2 py-0.5">
        <AlertTriangle size={12} className="text-dq-stale-fg shrink-0" />
        <p className="text-[12px] font-medium text-dq-stale-fg whitespace-nowrap leading-5">Oreviderad</p>
      </div>
    )
  }

  // Konfidenspåverkan chip (röd, ArrowDown – konflikt/täckning sänker konfidens)
  const getImpactChip = (f) => {
    const text = f.status === 'unavailable' ? 'Konfidens (täckning)' : 'Konfidens (data kvalitet)'
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-conf-low-bg border border-conf-low-border">
        <ArrowDown size={12} className="text-conf-low-fg shrink-0" />
        <p className="text-[12px] font-medium text-conf-low-fg whitespace-nowrap leading-5">{text}</p>
      </div>
    )
  }

  return (
    <Card className="px-6 py-5 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-bold text-foreground leading-7">Vad påverkar konfidensen?</h2>
          <Info size={20} className="text-muted-foreground" />
        </div>
        <Badge variant="accent"><Sparkles size={12} />AI</Badge>
      </div>
      {/* Tabellhuvud */}
      <div className="flex items-center justify-between border-b border-border pb-3 pt-1 text-[14px] text-foreground leading-5">
        <span>Faktor</span>
        <div className="flex items-center gap-5">
          <span className="w-[165px]">Källa</span>
          <span className="w-[90px]">Status</span>
          <span className="w-[151px]">Konfidenspåverkan</span>
        </div>
      </div>
      {/* Rader */}
      {impactFactors.map((f, i) => (
        <div key={i} className="flex items-center justify-between py-4">
          <span className="text-[14px] text-foreground leading-5">{f.factor}</span>
          <div className="flex items-center gap-5">
            <div className="w-[165px] flex items-start">
              {getSourceChip(f)}
            </div>
            <div className="w-[90px] flex items-start">
              {getStatusBadge(f)}
            </div>
            <div className="w-[151px] flex items-end justify-end">
              {getImpactChip(f)}
            </div>
          </div>
        </div>
      ))}
    </Card>
  )
}

// ── Underlag overview card ────────────────────────────────────────────────────

function UnderlandOverviewCard({ sources }) {
  const ejFlaggade = sources.filter(s => s.status === 'current').length
  const oreviderade = sources.filter(s => s.status === 'stale').length
  const saknas = sources.filter(s => s.status === 'unavailable').length

  const getStatusBadge = (s) => {
    if (s.status === 'stale') {
      return (
        <div className="flex items-center gap-1">
          <AlertTriangle size={12} className="text-dq-stale-fg shrink-0" />
          <span className="text-xs font-medium text-dq-stale-fg whitespace-nowrap">
            {s.statusLabel ?? 'Oreviderad'}
          </span>
        </div>
      )
    }
    if (s.status === 'unavailable') {
      return (
        <div className="flex items-center gap-1">
          <CircleMinus size={12} className="text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Otillgänglig</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-dq-ok-solid shrink-0" />
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Ej flaggad</span>
      </div>
    )
  }

  return (
    <Card className="p-3">
      <div className="flex flex-col gap-4">
        <p className="text-base font-medium text-muted-foreground">Underlag</p>
        <div className="flex gap-14">
          {/* Källa */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">Källa</p>
            <div className="flex flex-col gap-2">
              {sources.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-sm bg-muted border border-border self-start ${s.status === 'unavailable' ? 'opacity-50' : ''}`}
                >
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{s.name}</span>
                  <FileText size={14} className="text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </div>
          {/* Datum */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">Datum</p>
            <div className="flex flex-col gap-3">
              {sources.map((s, i) => (
                <p key={i} className="text-xs font-medium text-foreground leading-5">
                  {s.status === 'unavailable' ? '–' : s.period}
                </p>
              ))}
            </div>
          </div>
          {/* Status */}
          <div className="flex flex-col gap-3 flex-1 min-w-0 items-end">
            <p className="text-sm text-muted-foreground text-right w-full">Status</p>
            <div className="flex flex-col gap-2 items-end">
              {sources.map((s, i) => (
                <div key={i}>{getStatusBadge(s)}</div>
              ))}
            </div>
          </div>
        </div>
        {/* Summary */}
        <div className="flex justify-end">
          <p className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Underlag: {ejFlaggade} ej flaggade{oreviderade > 0 ? ` · ${oreviderade} oreviderad` : ''}{saknas > 0 ? ` · ${saknas} saknas` : ''}
          </p>
        </div>
      </div>
    </Card>
  )
}

// ── Nyckeldata cards ──────────────────────────────────────────────────────────

function MetricCard({ factor, onGranska }) {
  const isStale = factor.stale
  const isPositive = factor.direction === 'positiv'
  const isUnavailable = factor.status === 'unavailable'
  const paverkanLevel = factor.weight === 'hög' ? 3 : factor.weight === 'medel' ? 2 : 1
  const showDiff = factor.diff && factor.diff !== '–' && factor.diff !== '—'
  const displayValue = isUnavailable
    ? '—'
    : factor.value ? factor.value.replace(/↑|↓/g, '').trim() : '—'

  return (
    <Card className="flex flex-col">

      {/* Header: värde + status badge + AI badge */}
      <div className="px-6 pt-5 pb-0 flex flex-col gap-4">
        <div className="flex items-center justify-between h-8">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold text-foreground">{displayValue}</span>
            {isUnavailable ? (
              <span className="text-xs font-medium text-muted-foreground px-2 py-0.5">Kan ej bedömas</span>
            ) : isPositive ? (
              <span className="text-xs font-medium text-conf-high-fg px-2 py-0.5">Uppfyller krav</span>
            ) : (
              <span className="text-xs font-medium text-conf-low-fg px-2 py-0.5">Uppfyller ej krav</span>
            )}
          </div>
          <Badge variant="accent" className="shrink-0"><Sparkles size={12} />AI</Badge>
        </div>

        {/* Faktornamn */}
        <p className="text-base font-semibold text-foreground">{factor.factor}</p>

        {/* Krav/gräns + diff, eller beskrivning */}
        {isUnavailable ? (
          <p className="text-base text-muted-foreground leading-6">{factor.description}</p>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-lg font-bold text-muted-foreground">
              {factor.limitLabel ?? 'Krav'}:{' '}
              <span className="text-foreground">{factor.limit}</span>
            </p>
            {showDiff && (
              <>
                <div className="w-px h-14 bg-border" />
                <p className="text-lg font-bold text-foreground">
                  {factor.diff}{factor.diffDirection ? ` ${factor.diffDirection}` : ''}
                </p>
              </>
            )}
          </div>
        )}

        {/* Tidsperiod */}
        {!isUnavailable && (
          <p className="text-base text-muted-foreground">Tidsperiod: {factor.period.replace('–', '-')}</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 border-t border-border px-3 pt-3 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Påverkan-chip + impact dots */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-muted border border-border">
              {!isUnavailable && <ArrowRight size={12} className="text-muted-foreground" />}
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                {isUnavailable ? 'Ej bedömt' : isPositive ? 'Godkänn' : 'Avslå'}
              </span>
              {isStale && <AlertTriangle size={12} className="text-dq-stale-fg ml-0.5 shrink-0" />}
            </div>
            {!isUnavailable ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i <= paverkanLevel ? 'bg-accent-strong' : 'bg-border'}`} />
                  ))}
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {factor.weight === 'hög' ? 'Hög' : factor.weight === 'medel' ? 'Medel' : 'Låg'}
                  </span>
                  <Info size={12} className="text-muted-foreground" />
                </div>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">–</span>
            )}
          </div>
          {/* Source chip + status badge */}
          <div className="flex items-center">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-sm border text-xs font-medium whitespace-nowrap bg-muted border-border text-muted-foreground ${isUnavailable ? 'opacity-80' : ''}`}>
              {factor.source}
              {isUnavailable
                ? <CircleMinus size={12} className="ml-1 text-muted-foreground shrink-0" />
                : <FileText size={12} className="ml-1 text-muted-foreground shrink-0" />}
            </div>
            {isStale && (
              <div className="flex items-center gap-1 px-2 py-0.5">
                <AlertTriangle size={12} className="text-dq-stale-fg shrink-0" />
                <span className="text-xs font-medium text-dq-stale-fg whitespace-nowrap">Oreviderat</span>
              </div>
            )}
            {isUnavailable && (
              <div className="flex items-center gap-1 px-2 py-0.5">
                <CircleMinus size={12} className="text-muted-foreground shrink-0" />
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Otillgänglig</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onGranska}>
          Granska underlag <ArrowUpRight size={16} />
        </Button>
      </div>
    </Card>
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
  const completedRef = useRef(false)

  useEffect(() => {
    completedRef.current = false
    const timers = CF_ANALYSIS_STEPS.map((step, i) =>
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, step])
        if (i === CF_ANALYSIS_STEPS.length - 1) {
          setTimeout(() => {
            setDone(true)
            setTimeout(() => {
              if (!completedRef.current) {
                completedRef.current = true
                onComplete()
              }
            }, 1800)
          }, 800)
        }
      }, i * 700)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-2xl shadow-xl p-8 w-[520px] flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent-strong" />
          <span className="text-base font-semibold text-foreground">AI analyserar nytt underlag</span>
          {done
            ? <CheckCircle size={15} className="text-conf-high-solid ml-auto" />
            : <Loader2 size={15} className="animate-spin text-accent-strong ml-auto" />
          }
        </div>
        <div className="flex flex-col gap-2.5">
          {visibleSteps.map(step => (
            <div key={step.id} className="flex items-start gap-2">
              {step.type === 'found' && <CheckCircle size={13} className="text-conf-high-solid mt-0.5 shrink-0" />}
              {(step.type === 'loading' || step.type === 'verifying') && (
                <div className="w-1.5 h-1.5 rounded-full bg-accent-strong animate-pulse mt-1.5 shrink-0" />
              )}
              {step.type === 'searching' && <span className="text-xs text-muted-foreground/60 mt-0.5 shrink-0">Söker</span>}
              {step.type === 'updating' && <span className="text-xs text-dq-stale-fg mt-0.5 shrink-0">↑</span>}
              {step.type === 'searching'
                ? (
                  <div className="flex items-center gap-1 flex-wrap">
                    {step.text.split(' · ').map((q, j) => (
                      <span key={j} className="inline-flex items-center px-2 py-0.5 rounded border border-border bg-muted text-xs text-muted-foreground font-mono">
                        {q}
                      </span>
                    ))}
                  </div>
                )
                : (
                  <span className={`text-sm ${step.type === 'found' ? 'text-foreground' : step.type === 'updating' ? 'text-dq-stale-fg font-semibold' : 'text-muted-foreground'}`}>
                    {step.text}
                  </span>
                )
              }
            </div>
          ))}
        </div>
        {done && (
          <p className="text-xs text-conf-high-fg font-medium border-t border-border pt-3">
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
    <section className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 mt-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-bold text-foreground">Sammanfattning</h2>
        <div className="flex items-center gap-1 text-xs font-medium text-accent-strong bg-accent-subtle px-2 py-0.5 rounded-sm border border-accent-border">
          <Sparkles size={12} /> AI
        </div>
      </div>

      {/* Unavailable source warning */}
      {hasUnavailableSource && (
        <div className="flex items-start gap-2 bg-dq-stale-bg border border-dq-stale-border rounded-lg px-3 py-2.5 text-dq-stale-fg">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">En datakälla kunde inte nås. AI-rekommendationen baseras på ofullständigt underlag.</p>
        </div>
      )}

      {/* Konfidensgrad */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          Konfidensgrad <Info size={12} className="text-muted-foreground/60" />
        </span>
        <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-sm border w-fit ${confidenceBadge.cls}`}>
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${confidenceBadge.dot}`} />
          {confidenceBadge.label}
        </div>
      </div>

      {/* Korttext */}
      <p className="text-xs text-muted-foreground font-medium">{d.aiSummaryShort}</p>

      {/* Mittsektion */}
      <div className="border-t border-b border-border py-4 flex gap-12 items-start">
        {/* Vänster */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-medium text-muted-foreground">Rekommendation:</span>
            <span className={`text-2xl font-bold ${d.aiRecommendation === 'GODKÄNN' ? 'text-foreground' : 'text-conf-low-fg'}`}>{d.aiRecommendation.charAt(0).toUpperCase() + d.aiRecommendation.slice(1).toLowerCase()}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-6">{d.aiSummary}</p>
          <div className="mt-2">
            <p className="text-base font-bold text-foreground mb-1">Nästa steg:</p>
            <button className="text-sm text-accent-strong hover:text-accent-strong/80 font-medium flex items-center gap-0.5 text-left">
              {d.nextBestActions[0]}
              <ArrowRight size={14} className="shrink-0" />
            </button>
          </div>
        </div>

        {/* Höger */}
        <div className="w-[420px] shrink-0 flex flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">Underlag</p>
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-sm font-normal text-muted-foreground pb-1 pr-8">Källa</th>
                <th className="text-sm font-normal text-muted-foreground pb-1 pr-8">Datum</th>
                <th className="text-sm font-normal text-muted-foreground pb-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s, i) => (
                <tr key={i}>
                  <td className="pr-8 align-middle">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-border bg-muted text-xs text-muted-foreground font-medium whitespace-nowrap">
                      {s.name} <FileText size={12} className="text-muted-foreground/60 shrink-0" />
                    </div>
                  </td>
                  <td className="pr-8 align-middle text-xs font-medium text-foreground whitespace-nowrap">{s.period}</td>
                  <td className="align-middle">
                    <div className={`inline-flex items-center gap-1 text-xs font-medium ${s.status === 'unavailable' ? 'text-muted-foreground/60' :
                      s.status === 'ok' || s.status === 'current' ? 'text-conf-high-fg' : 'text-dq-stale-fg'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.status === 'unavailable' ? 'bg-dq-missing-solid' :
                        s.status === 'ok' || s.status === 'current' ? 'bg-conf-high-solid' : 'bg-dq-stale-solid'}`} />
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
            className="w-4 h-4 rounded border border-border accent-primary cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="ai-reviewed" className="flex items-center gap-2 cursor-pointer">
            <span className="text-base text-foreground">Jag har tagit del av och granskat AI-underlaget</span>
            <span className="text-sm text-muted-foreground">(Valfritt)</span>
            <Info size={14} className="text-muted-foreground/60 shrink-0" />
          </label>
          <p className="text-xs text-muted-foreground font-medium">
            Genom att kryssa i rutan bekräftar du att du tagit del av och värderat AI-rekommendationen. Detta val loggas med din tidsstämpel och identitet
          </p>
        </div>
      </div>
    </section>
  )
}

function DecisionPanel({ d, aiReviewed, onUnlocked, onOverride, onApprove, onGranskaKallor }) {
  const criticalFactors = (d?.topFactors ?? []).filter(f => f.stale || f.status === 'unavailable')
  const criticalCount = criticalFactors.length
  const criticalNames = criticalFactors.map(f =>
    f.status === 'unavailable' ? `${f.source} (otillgängligt)` : `${f.source} (oreviderat)`
  )

  return (
    <div className="flex flex-col gap-2.5">

      {/* Kort 1: Beslutspanel */}
      <Card className="overflow-hidden w-full flex flex-col gap-5 pb-5">

        {/* Banner – datakvalitet (orange = stale, ej rött) */}
        <div className="bg-dq-stale-bg border-b border-dq-stale-border px-3 py-2 flex flex-col gap-0.5">
          <div className="py-1">
            <CircleAlert size={20} className="text-dq-stale-fg" />
          </div>
          <div className="flex flex-col gap-[5px] text-dq-stale-fg">
            <p className="text-base font-medium leading-6">Datakvalitet kräver uppmärksamhet</p>
            <div className="text-xs leading-5">
              {(d?.uncertaintyReasons ?? []).map((reason, i) => (
                <p key={i}>{reason}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Nästa steg */}
        <div className="px-3 pb-3 border-b border-border flex flex-col gap-2">
          <p className="text-base font-medium text-foreground">Nästa steg:</p>
          <Button onClick={onGranskaKallor} className="w-full">
            Granska kritiska källor ({criticalCount})
            <ArrowUpRight size={18} />
          </Button>
          <ul className="list-disc pl-[18px] text-xs font-medium text-muted-foreground leading-5">
            {criticalNames.map((name, i) => <li key={i}>{name}</li>)}
          </ul>
        </div>

        {/* Beslut */}
        <div className="px-3 flex flex-col gap-1">
          <p className="text-base font-medium text-foreground">Beslut</p>
          <div className="flex flex-col gap-5">

            {/* Godkänn (AI rekommenderar godkänn → primär) */}
            <div className="flex flex-col gap-1">
              <Button
                className="w-full"
                disabled={!aiReviewed}
                onClick={aiReviewed ? onApprove : undefined}
              >
                Godkänn
              </Button>
              {!aiReviewed && (
                <div className="flex items-center gap-1">
                  <p className="text-[12px] text-muted-foreground">Låst tills AI-underlaget har granskats.</p>
                  <Info size={14} className="text-muted-foreground/60 shrink-0" />
                </div>
              )}
            </div>

            {/* Avslå (sekundär) */}
            <div className="flex flex-col gap-1">
              <Button
                variant="outline"
                className="w-full"
                disabled={!aiReviewed}
                onClick={aiReviewed ? onOverride : undefined}
              >
                Avslå
              </Button>
              {!aiReviewed && (
                <div className="flex items-center gap-1">
                  <p className="text-[12px] text-muted-foreground">Låst tills AI-underlaget har granskats.</p>
                  <Info size={14} className="text-muted-foreground/60 shrink-0" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hantera ärende */}
        <div className="px-3 flex flex-col gap-1">
          <p className="text-base font-medium text-foreground">Hantera ärende</p>
          <div className="flex flex-col gap-1">
            <Button variant="outline" className="w-full">
              Begär komplettering
            </Button>
            {!aiReviewed && (
              <div className="flex items-center gap-1">
                <p className="text-[12px] text-muted-foreground">Låst tills AI-underlaget har granskats.</p>
                <Info size={14} className="text-muted-foreground/60 shrink-0" />
              </div>
            )}
          </div>
        </div>

      </Card>

      {/* Kort 2: Checkbox */}
      <Card className="p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="ai-reviewed"
            checked={aiReviewed}
            onCheckedChange={onUnlocked}
          />
          <label htmlFor="ai-reviewed" className="text-base font-medium text-foreground cursor-pointer">
            Jag har tagit del av AI-underlaget
          </label>
        </div>
        <p className="text-xs font-medium text-muted-foreground leading-5">
          Genom att kryssa i rutan bekräftar du att du tagit del av och värderat AI-rekommendationen. Detta val loggas med din tidsstämpel och identitet
        </p>
      </Card>

    </div>
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
  const cb = getConfidenceBadge(d.confidence)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-2xl shadow-xl px-9 py-6 w-[606px] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">

        {/* 1. Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Avslå ansökan — {d.id}</h2>
            <button
              onClick={onCancel}
              className="w-8 h-8 flex items-center justify-center bg-muted border border-border rounded shrink-0"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
          <p className="text-base text-muted-foreground">
            {d.company} beviljas inte kreditlimitökning från 500 000 kr till 900 000 kr.
          </p>
        </div>

        {/* 2. Beslutsbanner */}
        <div className="bg-muted border-l-2 border-border px-2 py-3 rounded-r-md">
          <p className="text-2xl font-semibold text-foreground">Slutgiltigt beslut: AVSLÅ</p>
        </div>

        {/* 3. AI-rekommendationsrad */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-muted-foreground">Rekommendation: GODKÄNN</span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-accent-subtle border border-accent-border text-accent-strong text-xs font-medium shrink-0">
                <Sparkles size={12} />AI
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Konfidensgrad:</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-xs font-medium ${cb.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cb.dot}`} />
                {cb.label.replace(' konfidens', '')}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            AI:ns rekommendation var GODKÄNN med låg konfidens. Din motivering sparas i spårloggen.
          </p>
        </div>

        {/* 4. Kategorisektionen */}
        <div className="flex flex-col gap-5">
          <p className="text-xl font-bold text-foreground">Välj orsak till ditt beslut</p>
          <div className="flex flex-col gap-5">
            {OVERRIDE_CATEGORIES.map(cat => (
              <div
                key={cat}
                onClick={() => setSelected(cat)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0
                  ${selected === cat ? 'bg-primary border-primary' : 'border-border'}`}
                >
                  {selected === cat && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-base text-foreground">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Textfält */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-medium text-foreground">Motivering (fri text)</label>
          <textarea
            value={freetext}
            onChange={e => setFreetext(e.target.value.slice(0, 300))}
            placeholder="Beskriv din bedömning. Var specifik — motiveringen kan granskas vid revision."
            className="w-full border border-border rounded p-2 text-base text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring h-[182px]"
          />
          <div className="flex items-start justify-between gap-4 text-sm text-muted-foreground">
            <p>Beslutet och din motivering loggas automatiskt med tidsstämpel och kopplas till ärende {d.id}.</p>
            <p className="shrink-0">{freetext.length}/300 tecken</p>
          </div>
        </div>

        {/* 6. Loggsektion – alltid synlig */}
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-foreground">Följande loggas</p>
          <div className="bg-muted rounded-xl p-3 flex flex-col gap-2">
            {[
              { label: 'Ärende', value: d.id },
              { label: 'Handläggare', value: d.officer },
              { label: 'Tidstämpel', value: now },
              { label: 'Kategori', value: selected ?? '' },
            ].map(row => (
              <div key={row.label} className="flex gap-9 items-center text-xs">
                <span className="w-[70px] shrink-0 text-muted-foreground">{row.label}</span>
                <span className="font-medium text-foreground">{row.value}</span>
              </div>
            ))}
            <div className="flex gap-9 items-center text-xs">
              <span className="w-[70px] shrink-0 text-muted-foreground">Beslut</span>
              <span className="font-medium text-foreground">Avslå</span>
              <span className="italic text-muted-foreground">Avviker från AI-rekommendation</span>
            </div>
          </div>
        </div>

        {/* 7. Knappar */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onCancel}>
            Avbryt
          </Button>
          <Button
            onClick={() => onConfirm({ category: selected, text: freetext.trim() })}
            disabled={!selected}
          >
            Bekräfta
          </Button>
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
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <PageHeader d={d} />
        <main className="flex-1 overflow-y-auto p-6 pt-4">
          <div className="flex flex-col gap-5">

            {/* Override banner */}
            <div className="bg-dq-stale-bg border border-dq-stale-border rounded-xl p-4 flex items-start gap-4">
              <div className="flex items-center py-1 flex-shrink-0">
                <CircleAlert size={16} className="text-dq-stale-fg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-dq-stale-fg leading-7 text-lg">Avvikelse från AI-rekommendation registrerad</p>
                <p className="text-sm text-dq-stale-fg leading-5 mt-0.5">{today} · {timeNow} · {d.officer} · {d.id}</p>
              </div>
              <button
                className="w-5 h-5 flex items-center justify-center rounded bg-muted border border-border flex-shrink-0 shadow-[inset_0px_-3px_4px_rgba(0,0,0,0.07),inset_0px_2px_2px_1px_rgba(244,244,244,0.93)] hover:bg-muted/80 transition-colors"
                aria-label="Stäng"
              >
                <X size={12} className="text-muted-foreground" />
              </button>
            </div>

            {/* DiffView (S3) */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col gap-3">
              <p className="text-xl font-bold text-foreground">AI-rekommendation vs Beslut</p>
              <div className="flex items-center gap-12">
                {/* Vänster: AI-rekommendation */}
                <div className="flex items-start justify-between w-[343px]">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground">AI-rekommendation</p>
                      <p className="text-2xl font-medium text-foreground">{d.aiRecommendation}</p>
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-xs font-medium w-fit ${confBadge.cls}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${confBadge.dot}`} />
                      {confBadge.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-accent-subtle border border-accent-border text-accent-strong text-xs font-medium shrink-0">
                    <Sparkles size={14} />
                    AI
                  </div>
                </div>
                {/* Divider */}
                <div className="w-px h-[131px] bg-border shrink-0" />
                {/* Höger: Slutgiltigt beslut */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">Slutgiltigt beslut</p>
                    <p className="text-2xl font-medium text-foreground">AVSLAG</p>
                  </div>
                  {motivation?.category && (
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-muted-foreground">Kategori:</p>
                      <p className="text-base font-medium text-foreground">{motivation.category}</p>
                    </div>
                  )}
                  {motivation?.text && (
                    <p className="text-xs text-muted-foreground">{motivation.text}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-[760px] flex flex-col gap-5 w-full">
              {/* Spårlogg */}
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-end justify-between pb-3 border-b border-border">
                  <p className="text-3xl font-bold text-foreground">Spårlogg</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>AI-modell:</span>
                    <span className="text-foreground">Kreditrisk v2.3 · Tränad nov 2024</span>
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
                          <div className={`mt-3 w-6 h-6 rounded-xl flex items-center justify-center border shrink-0 ${ev.type === 'ai' ? 'bg-accent-subtle border-accent-border' : 'bg-muted border-border'
                            }`}>
                            {ev.type === 'ai'
                              ? <Sparkles size={12} className="text-accent-strong" />
                              : ev.type === 'system'
                                ? <ClipboardList size={12} className="text-muted-foreground" />
                                : <User size={12} className="text-muted-foreground" />
                            }
                          </div>
                          {i < auditEvents.length - 1 && (
                            <div className="w-px flex-1 bg-border mt-3 min-h-4" />
                          )}
                        </div>

                        {/* Event card */}
                        <div className="flex-1 min-w-0 pb-2">
                          <div className="overflow-hidden">
                            {/* Row header */}
                            <div className="flex items-center justify-between p-3">
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-medium text-muted-foreground">{ev.label}</p>
                                  {ev.type === 'ai' && ev.chips?.map(chip => (
                                    <div key={chip.label} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-xs font-medium ${chip.style === 'low' ? 'bg-conf-low-bg border-conf-low-border text-conf-low-fg'
                                      : chip.style === 'medium' ? 'bg-dq-stale-bg border-dq-stale-border text-dq-stale-fg'
                                        : 'bg-conf-high-bg border-conf-high-border text-conf-high-fg'
                                      }`}>
                                      <div className={`w-1 h-1 rounded-full ${chip.style === 'low' ? 'bg-conf-low-solid'
                                        : chip.style === 'medium' ? 'bg-dq-stale-solid'
                                          : 'bg-conf-high-solid'
                                        }`} />
                                      {chip.label}
                                    </div>
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground">{ev.time}</p>
                              </div>
                              <button
                                onClick={toggleOpen}
                                className="flex items-center gap-2 text-xs font-medium text-foreground shrink-0"
                              >
                                Visa detaljer
                                <div className="w-5 h-5 flex items-center justify-center rounded bg-muted border border-border shadow-[inset_0px_-3px_4px_rgba(0,0,0,0.07),inset_0px_2px_2px_1px_rgba(244,244,244,0.93)]">
                                  <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </div>
                              </button>
                            </div>

                            {/* Detail section */}
                            {isOpen && ev.detail && (
                              <div className="px-5 py-4 bg-muted flex flex-col gap-2 text-xs border-t border-border">
                                {/* Decision type: override badge first */}
                                {ev.type === 'decision' && (
                                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border bg-dq-stale-bg border-dq-stale-border text-dq-stale-fg text-xs font-medium w-fit mb-1">
                                    Avvek från AI-rekommendation: {d.aiRecommendation}
                                    <CircleAlert size={12} />
                                  </div>
                                )}

                                {/* Rows (all types) */}
                                {ev.detail.rows?.map(row => (
                                  <div key={row.label} className="flex items-start gap-6">
                                    <span className="text-muted-foreground/60 w-28 shrink-0">{row.label}</span>
                                    <span className="text-muted-foreground">{row.value}</span>
                                  </div>
                                ))}

                                {/* Decision: category + motivation */}
                                {ev.type === 'decision' && ev.detail.motivationCategory && (
                                  <div className="flex items-center gap-6">
                                    <span className="text-muted-foreground/60 w-28 shrink-0">Kategori:</span>
                                    <span className="text-muted-foreground">{ev.detail.motivationCategory}</span>
                                  </div>
                                )}
                                {ev.type === 'decision' && ev.detail.motivationText && (
                                  <div className="flex items-start gap-6">
                                    <span className="text-muted-foreground/60 w-28 shrink-0">Motivering:</span>
                                    <span className="text-muted-foreground flex-1">{ev.detail.motivationText}</span>
                                  </div>
                                )}

                                {/* AI type: intro + factors + sources */}
                                {ev.type === 'ai' && ev.detail.intro && (
                                  <p className="text-muted-foreground mb-1">{ev.detail.intro}</p>
                                )}
                                {ev.type === 'ai' && ev.detail.factors?.length > 0 && (
                                  <div className="flex flex-col gap-1.5">
                                    <p className="text-sm font-medium text-muted-foreground">Nyckelfaktorer</p>
                                    {ev.detail.factors.map(f => (
                                      <div key={f.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                          <span className="text-muted-foreground/60 w-[125px] shrink-0">{f.name}</span>
                                          <span className="text-foreground">{f.value}</span>
                                        </div>
                                        <span className="text-muted-foreground/60">Krav: {f.limit}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {ev.type === 'ai' && ev.detail.sources?.length > 0 && (
                                  <div className="flex flex-col gap-1.5 mt-1">
                                    <p className="text-sm font-medium text-muted-foreground">Datakällor</p>
                                    {ev.detail.sources.map(s => (
                                      <div key={s.name} className="flex items-center justify-between">
                                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-xs font-medium ${s.status === 'stale' ? 'bg-dq-stale-bg border-dq-stale-border text-dq-stale-fg'
                                          : 'bg-muted border-border text-muted-foreground'
                                          }`}>
                                          {s.name}
                                          {s.status === 'stale'
                                            ? <AlertTriangle size={12} className="shrink-0" />
                                            : <FileText size={12} className="shrink-0" />}
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${s.status === 'stale' ? 'text-dq-stale-fg' : 'text-muted-foreground'
                                            }`}>
                                            <div className={`w-1 h-1 rounded-full ${s.status === 'stale' ? 'bg-dq-stale-solid' : 'bg-dq-missing-solid'
                                              }`} />
                                            {s.status === 'stale' ? 'Inaktuell' : 'Aktuell'}
                                          </span>
                                          <span className="text-muted-foreground/60">{s.date}</span>
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
                <div className="bg-card border border-border rounded-2xl px-6 py-5 flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle size={16} className="text-conf-high-solid shrink-0" />
                  Tack – din feedback har loggats
                </div>
              ) : (
                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xl font-bold text-foreground">Var AI:ns rekommendation korrekt?</p>
                    <p className="text-sm text-muted-foreground">Din feedback används för att förbättra AI-modellen. Loggat med tidsstämpel och handläggare-ID.</p>
                  </div>

                  {/* Segmented control */}
                  <div className="bg-muted flex gap-0.5 items-center p-0.5 rounded-md w-full">
                    {[
                      { id: 'rätt', label: 'Rätt' },
                      { id: 'fel', label: 'Fel' },
                      { id: 'vet_inte', label: 'Vet inte' },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => setFeedbackChoice(id)}
                        className={`flex flex-1 items-center justify-center px-3 py-2 rounded text-base font-medium transition-all border ${feedbackChoice === id
                          ? 'bg-card border-border text-foreground shadow-sm'
                          : 'bg-muted border-transparent text-muted-foreground hover:bg-muted/80'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Textarea */}
                  <div className="flex flex-col gap-2">
                    <p className="text-base font-medium text-foreground">Ge din feedback</p>
                    <textarea
                      value={feedbackComment}
                      onChange={e => setFeedbackComment(e.target.value.slice(0, 500))}
                      placeholder="Valfri kommentar - vad tyckte du om AI:ns rekommendation?"
                      className="w-full h-[182px] text-base text-foreground placeholder-muted-foreground/60 border border-border rounded px-2 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-card"
                    />
                    <div className="text-right text-sm text-muted-foreground/60">{feedbackComment.length}/500 tecken</div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end">
                    <Button onClick={() => setFeedbackSent(true)}>
                      Skicka feedback
                    </Button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pb-6">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
                  <Download size={14} /> Exportera logg
                </button>
                <button onClick={onClose} className="text-sm text-accent-strong hover:text-accent-strong/80 font-medium transition-colors">
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
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <PageHeader d={d} />
        <main className="flex-1 overflow-y-auto p-6 pt-4">
          <div className="max-w-[760px] flex flex-col gap-5">

            {/* Confirmation banner */}
            <div className="bg-conf-high-solid text-white rounded-xl px-6 py-5 flex items-start gap-4">
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Kreditansökan godkänd – ärende avslutat</p>
                <p className="text-sm text-white/80 mt-0.5">{today} · {d.officer} · {d.id}</p>
              </div>
            </div>

            {/* Decision summary */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/40">
                <p className="text-sm font-semibold text-muted-foreground">Beslutssummering</p>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-muted-foreground/60 mb-1.5">AI rekommenderade</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-lg font-bold ${d.aiRecommendation === 'GODKÄNN' ? 'text-conf-high-fg' : 'text-conf-low-fg'}`}>{d.aiRecommendation}</span>
                    <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-sm border ${confBadge.cls}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${confBadge.dot}`} />
                      {confBadge.label}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/60 mb-1.5">Saras beslut</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-foreground">GODKÄNN</span>
                    <span className="text-xs text-conf-high-fg bg-conf-high-bg border border-conf-high-border px-2 py-0.5 rounded-sm">Följde AI-rekommendation</span>
                  </div>
                </div>
                <div className="col-span-2 border-t border-border pt-3 flex justify-between text-xs text-muted-foreground/60">
                  <span>Handläggare: {d.officer}</span>
                  <span>{today} · {timeNow}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pb-6">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
                <Download size={14} /> Exportera logg
              </button>
              <button onClick={onClose} className="text-sm text-accent-strong hover:text-accent-strong/80 font-medium transition-colors">
                ← Tillbaka till ärendelistan
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

// ── SpårloggTab ───────────────────────────────────────────────────────────────

function SpårloggTag({ type = 'system' }) {
  const map = {
    system: { cls: 'bg-muted border-border text-muted-foreground', label: 'System' },
    ai: { cls: 'bg-accent-subtle border-accent-border text-accent-strong', label: 'AI' },
    handlaggare: { cls: 'bg-accent-subtle border-accent-border text-accent-strong', label: 'Handläggare' },
    granskning: { cls: 'bg-muted border-border text-muted-foreground', label: 'Granskning' },
  }
  const { cls, label } = map[type]
  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-sm border text-[12px] leading-[20px] font-semibold shrink-0 ${cls}`}
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {label}
    </span>
  )
}

function SpårloggIcon({ type }) {
  const grey = 'w-6 h-6 rounded-xl flex items-center justify-center border shrink-0 bg-muted border-border'
  if (type === 'ai') return (
    <div className="w-6 h-6 rounded-xl flex items-center justify-center border shrink-0 bg-accent-subtle border-accent-border">
      <Sparkles size={12} className="text-accent-strong" />
    </div>
  )
  if (type === 'empty') return <div className="w-6 h-6 rounded-xl border border-border bg-card shrink-0" />
  const icons = {
    'clipboard': <ClipboardList size={12} className="text-muted-foreground" />,
    'file-search': <FileText size={12} className="text-muted-foreground" />,
    'user': <User size={12} className="text-muted-foreground" />,
    'search': <Search size={12} className="text-muted-foreground" />,
  }
  return <div className={grey}>{icons[type] ?? <ClipboardList size={12} className="text-muted-foreground" />}</div>
}

function SpårloggTab({ d }) {
  const cb = getConfidenceBadge(d.confidence)
  const confShortLabel = cb.label.split(' ')[0]

  const sourceDisplayName = (name) =>
    name === 'Branschdata (SNI 41.20)' ? 'Branschdata API (SNI 41.20)' : name

  const sourceStatusUI = (src) => {
    if (src.status === 'current') return (
      <span className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground">
        <span className="w-[5px] h-[5px] rounded-full bg-dq-missing-solid inline-block shrink-0" />
        Ej flaggad
      </span>
    )
    if (src.status === 'stale') return (
      <span className="flex items-center gap-1 text-[12px] font-medium text-dq-stale-fg">
        <AlertTriangle size={12} className="shrink-0" /> Oreviderad
      </span>
    )
    return (
      <span className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground">
        <CircleMinus size={12} className="shrink-0" /> Otillgänglig
      </span>
    )
  }

  const events = [
    { id: 1, type: 'system', icon: 'clipboard', time: '27 feb 2026 · 10:46', title: 'Ärende öppnat' },
    { id: 2, type: 'system', icon: 'file-search', time: '27 feb 2026 · 10:46', title: 'Datahämtning' },
    { id: 3, type: 'ai', icon: 'ai', time: '27 feb 2026 · 10:46', title: 'AI-analys genomförd' },
    { id: 4, type: 'handlaggare', icon: 'user', time: '27 feb 2026 · 11:05', title: 'Granskning påbörjad' },
    { id: 5, type: 'granskning', icon: 'search', time: '27 feb 2026 · 11:12', title: 'Kritisk källa granskad' },
  ]

  return (
    <div className="bg-card border border-border rounded-xlg p-6 flex flex-col gap-6">

      {/* Header med divider */}
      <div className="border-b border-border pb-[13px] flex items-center justify-between">
        <p className="text-xlg font-semibold text-foreground">Spårlogg</p>
        <div className="flex items-center gap-1 bg-accent-subtle border border-accent-border text-accent-strong text-[12px] font-medium px-2 py-0.5 rounded-sm">
          <Sparkles size={12} />
          <span>AI-modell: Kreditrisk v2.3 - Tränad nov 2024</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-3">
        {events.map((ev, i) => (
          <div key={ev.id} className="flex gap-4 items-start">

            {/* Ikonkolumn */}
            <div className="flex flex-col items-center w-6 shrink-0 pt-1">
              <SpårloggIcon type={ev.icon} />
              {i < events.length - 1 && (
                <div className="w-px flex-1 bg-border mt-2 min-h-6" />
              )}
            </div>

            {/* Innehåll */}
            <div className={`flex-1 min-w-0 flex flex-col gap-2 ${i < events.length - 1 ? 'pb-3' : ''}`}>

              {/* Tag + titel + tidsstämpel */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SpårloggTag type={ev.type} />
                  <p className="text-sm font-semibold text-foreground">{ev.title}</p>
                </div>
                <p className="text-[12px] text-muted-foreground shrink-0">{ev.time}</p>
              </div>

              {/* Event 1 – Ärende öppnat */}
              {ev.id === 1 && (
                <p className="text-sm text-muted-foreground">
                  Kreditlimitökning {d.id} skapades och tilldelades{' '}
                  <strong className="font-semibold text-foreground">{d.officer}</strong>.
                </p>
              )}

              {/* Event 2 – Datahämtning */}
              {ev.id === 2 && (
                <>
                  <p className="text-sm text-muted-foreground">3 av 4 datakällor hämtades. 1 källa otillgänglig.</p>
                  <div className="bg-muted border border-border rounded-md overflow-hidden">
                    {d.dataSources.map((src, si) => (
                      <div
                        key={src.name}
                        className={`flex items-center justify-between px-4 h-[37px] text-sm ${si < d.dataSources.length - 1 ? 'border-b border-border' : ''}`}
                      >
                        <span className="text-foreground">{sourceDisplayName(src.name)}</span>
                        {sourceStatusUI(src)}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Event 3 – AI-analys */}
              {ev.id === 3 && (
                <>
                  <div className="flex items-center gap-3 flex-wrap text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Rekommendation:</span>
                      <span className="font-semibold text-foreground ml-1">
                        {d.aiRecommendation.charAt(0) + d.aiRecommendation.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <span className="text-muted-foreground/60">·</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Konfidensgrad:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-[12px] font-medium ${cb.cls}`}>
                        <span className={`w-1 h-1 rounded-full ${cb.dot}`} />
                        {confShortLabel}
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted border border-border rounded-md p-[13px] flex flex-col gap-1.5">
                    {[
                      { label: 'Modell', value: 'Kreditrisk v2.3' },
                      { label: 'Faktorer analyserade', value: '4 (2 aktiva, 1 oreviderad, 1 saknad)' },
                      { label: 'Konfidensnedsättning', value: 'Oreviderat bokslut + saknad branschdata' },
                    ].map(row => (
                      <div key={row.label} className="flex items-center gap-4 text-[12px]">
                        <span className="text-muted-foreground w-40 shrink-0">{row.label}</span>
                        <span className="text-foreground font-medium">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Event 4 – Granskning påbörjad */}
              {ev.id === 4 && (
                <p className="text-sm text-muted-foreground">
                  {d.officer} öppnade ärendet och påbörjade granskning av AI-underlag.
                </p>
              )}

              {/* Event 5 – Kritisk källa granskad */}
              {ev.id === 5 && (
                <>
                  <p className="text-sm text-muted-foreground">
                    {d.officer} granskade Bokslut (oreviderat) · Jan–Dec 2022.
                  </p>
                  <div className="inline-flex items-center">
                    <span className="inline-flex items-center gap-1 bg-muted border border-border text-muted-foreground text-[12px] font-medium px-2 py-0.5 rounded-sm">
                      Bokslut <FileText size={12} />
                    </span>
                    <span className="inline-flex items-center gap-1 text-dq-stale-fg text-[12px] font-medium px-2 py-0.5">
                      <AlertTriangle size={12} /> Oreviderad
                    </span>
                  </div>
                </>
              )}

            </div>
          </div>
        ))}

        {/* Väntar på beslut */}
        <div className="flex gap-4 items-center">
          <div className="w-6 flex justify-center shrink-0 pt-1">
            <SpårloggIcon type="empty" />
          </div>
          <p className="text-sm text-muted-foreground italic">Väntar på beslut från {d.officer}</p>
        </div>

      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [aiReviewed, setAiReviewed] = useState(false)
  const [activeTab, setActiveTab] = useState('overblick')
  const [showAIBanner, setShowAIBanner] = useState(true)

  // Tema (ljust/mörkt) – init från localStorage, annars systeminställning
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('theme')
      ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

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

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
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
          <PageHeader d={CASE} theme={theme} onToggleTheme={toggleTheme} />

          <main className="flex-1 overflow-y-auto p-6 pt-2">
            <div className="flex gap-6 items-start max-w-[1400px]">

              {/* ── Vänster kolumn ─────────────────────────────────────── */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === 'overblick' && (
                  <>
                    <CaseInfoCard d={CASE} />
                    {showAIBanner && <AIBanner onClose={() => setShowAIBanner(false)} />}
                    <RecommendationCard d={CASE} confidence={liveConfidence} />
                    <WhyDecisionCard factors={liveFactors} d={CASE} />
                    <ConfidenceImpactCard factors={liveFactors} />
                  </>
                )}

                {activeTab === 'underlag' && (
                  <>
                    <UnderlandOverviewCard sources={liveSources} />
                    <h2 className="text-[20px] font-bold text-foreground leading-7">Nyckeldata</h2>
                    <div className="flex flex-col gap-4">
                      {[
                        ...liveFactors.filter(f => f.direction === 'negativ' && f.status !== 'unavailable'),
                        ...liveFactors.filter(f => f.direction === 'positiv'),
                        ...liveFactors.filter(f => f.status === 'unavailable'),
                      ].map((factor, i) => (
                        <MetricCard
                          key={i}
                          factor={factor}
                          onGranska={() => setActiveDrawerMetric(factor)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {activeTab === 'sparlogg' && (
                  <SpårloggTab d={CASE} />
                )}
              </div>

              {/* ── Höger kolumn ───────────────────────────────────────── */}
              <div className="w-[360px] flex-shrink-0 sticky top-6">
                <DecisionPanel
                  d={CASE}
                  aiReviewed={aiReviewed}
                  onUnlocked={setAiReviewed}
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

