import React, { useState, useEffect } from 'react'
import { X, Upload, FileText, ArrowUpRight, HelpCircle, ArrowRight, Trash2, Copy, Info, AlertTriangle, ExternalLink, ChevronRight, ChevronsRight, Maximize2, FileSearch, ShieldAlert, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Helper component for AI Badge
function AIBadge() {
    return (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-accent-subtle border border-accent-border text-accent-strong text-xs font-medium">
            <Sparkles size={14} />
            AI
        </div>
    )
}

export default function CashFlowSourceDrawer({ isOpen, onClose, onSimulate, onUpload }) {
    const [selectedAction, setSelectedAction] = useState(null) // 'upload', 'simulate', 'approve'
    const [evaluation, setEvaluation] = useState(null) // 'approved', 'questioned', 'insufficient'
    const [drawerWidth, setDrawerWidth] = useState(600)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (!isDragging) return

        const handleMouseMove = (e) => {
            const newWidth = window.innerWidth - e.clientX
            if (newWidth > 400 && newWidth < window.innerWidth - 50) {
                setDrawerWidth(newWidth)
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        // Prevent iframes/selection issues while dragging
        document.body.style.userSelect = 'none'

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.body.style.userSelect = ''
        }
    }, [isDragging])

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-gray-900/20 z-40"
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 bottom-0 bg-background shadow-2xl z-50 flex flex-col ${!isDragging ? 'animate-[slideInRight_0.3s_ease-out_forwards]' : ''}`}
                style={{ width: drawerWidth }}
            >
                {/* Resizer Handle */}
                <div
                    onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }}
                    className="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-accent-strong/10 transition-colors z-[60] flex flex-col items-center justify-center group"
                >
                    <div className="w-1 h-12 rounded-full bg-border group-hover:bg-accent-strong transition-colors"></div>
                </div>

                {/* Content Container (Scrollable) */}
                <div className="flex-1 overflow-y-auto flex flex-col w-full relative">
                    {/* Sticky Header (Nav + Tabs) */}
                    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pt-4 border-b border-border">
                        {/* Top Nav */}
                        <div className="flex justify-between items-center px-4">
                            <button
                                onClick={onClose}
                                className="p-1.5 text-muted-foreground bg-card border border-border hover:bg-muted rounded transition-colors shadow-sm"
                            >
                                <ChevronsRight size={16} />
                            </button>
                            <div className="flex gap-2">
                                <button className="p-1.5 text-muted-foreground bg-card border border-border hover:bg-muted rounded transition-colors shadow-sm">
                                    <Maximize2 size={16} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 text-muted-foreground bg-card border border-border hover:bg-muted rounded transition-colors shadow-sm"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex px-6 mt-4">
                            <button className="px-5 py-2.5 text-sm font-medium text-accent-strong border-b-2 border-accent-strong mb-[-1px]">
                                Granskning
                            </button>
                            <button className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent mb-[-1px]">
                                Simulering
                            </button>
                        </div>
                    </div>

                    {/* Warning Banner */}
                    < div className="bg-dq-stale-bg text-dq-stale-fg text-sm font-medium py-3 px-6 flex items-center justify-center gap-2 m-6 mt-8 rounded-md" >
                        <AlertTriangle size={16} className="text-dq-stale-fg" />
                        Denna analys behöver manuell granskning
                    </div >

                    <div className="px-8 pb-8 flex flex-col gap-10">

                        {/* Header Section */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-4xl font-bold text-foreground leading-tight tracking-tight">Kassaflödesanalys</h1>
                                <AIBadge />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Ärende</div>
                                    <div className="text-sm font-medium text-foreground">KR-2026-0847</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Företag</div>
                                    <div className="text-sm font-medium text-foreground">Bergström & Co AB</div>
                                </div>
                            </div>

                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground mb-2">AI-rekommendation</h2>
                                    <div className="text-4xl font-bold text-conf-low-fg">Avslag</div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                                        Konfidensgrad <Info size={12} />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-dq-stale-fg bg-dq-stale-bg px-3 py-1 rounded-sm border border-dq-stale-border">
                                        <div className="w-1.5 h-1.5 rounded-full bg-dq-stale-solid"></div>
                                        Medel konfidens
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
                                <div className="flex gap-[3px]">
                                    <div className="w-2 h-2 rounded-full bg-accent-strong"></div>
                                    <div className="w-2 h-2 rounded-full bg-accent-strong"></div>
                                    <div className="w-2 h-2 rounded-full bg-border"></div>
                                </div>
                                <span className="ml-1 flex items-center gap-1">Påverkan <Info size={12} /></span>
                            </div>
                        </div>

                        {/* AI Analysis */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold text-foreground">AI-Analys</h2>
                                <AIBadge />
                            </div>
                            <p className="text-base text-muted-foreground leading-relaxed mb-4">
                                Kassaflödet täcker inte skuldservicen vid det ansökta lånebeloppet. Rekommendationen lutar tungt åt avslag baserat på svag räntetäckningsgrad och hög samlad skuldbörda.
                            </p>
                            <p className="text-base text-muted-foreground leading-relaxed mb-6">
                                Analysen baseras på årsredovisningen 2022. Nyare data saknas.
                            </p>

                            <h3 className="text-lg font-semibold text-foreground mb-2">Varför är konfidensen inte högre?</h3>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                Eftersom kassaflödesdatan är gammal kan en plötslig förbättring där inte uteslutas. Osäkerheten kring aktuell kassaflödesstatus sänker därför den totala konfidensen till medel.
                            </p>
                        </div>

                        {/* Underlag för analysen */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-4">Underlag för analysen</h2>

                            <div className="flex flex-col text-sm border-t border-border">
                                <div className="flex justify-between py-3.5 border-b border-border">
                                    <span className="text-muted-foreground">Operativt kassaflöde (snitt/kvartal)</span>
                                    <span className="font-medium text-foreground">-240 000 kr</span>
                                </div>
                                <div className="flex justify-between py-3.5 border-b border-border bg-muted/50">
                                    <span className="text-muted-foreground">Bankens krav:</span>
                                    <span className="font-medium text-foreground">≥ 0 kr</span>
                                </div>
                                <div className="flex justify-between py-3.5 border-b border-border">
                                    <span className="text-muted-foreground">Avvikelse från krav:</span>
                                    <span className="font-medium text-foreground">-240 000 kr</span>
                                </div>
                                <div className="flex justify-between py-3.5 border-b border-border items-start">
                                    <span className="text-muted-foreground mt-0.5">Trend</span>
                                    <div className="text-right">
                                        <div className="font-semibold text-foreground">Ej beräkningsbar</div>
                                        <div className="text-xs text-muted-foreground italic mt-0.5">(data saknas för 2023–2024)</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-6 text-xs text-muted-foreground italic">
                                <div className="max-w-[170px] leading-relaxed">
                                    Bransch jämförelse (Detaljhandel, 10-50 anst.):
                                </div>
                                <div className="leading-relaxed">
                                    <div>Median kassaflöde: +340 000 kr/år.</div>
                                    <div>Kundens kassaflöde: -240 000 kr/år (171% under medianen)</div>
                                </div>
                            </div>
                        </div>

                        {/* Använd källa */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-4">Använd källa</h2>

                            <div className="flex items-center gap-3 mb-4 text-sm">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-md text-foreground shadow-sm font-medium">
                                    <FileText size={16} className="text-muted-foreground/60" />
                                    Årsredovisning 2022
                                </div>
                                <span className="text-muted-foreground">Hämtad via UC (Upplysningscentralen) • 3 år gammal</span>
                            </div>

                            <div className="flex items-center gap-2 text-dq-stale-fg text-sm font-medium mb-5">
                                <AlertTriangle size={16} />
                                Överstiger policygräns (max 12 månader)
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Kassaflödesanalys använd för detta underlag
                                </div>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-accent-strong border border-accent-border hover:bg-accent-subtle bg-card rounded transition-colors">
                                    Öppna källa <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-border"></div>

                        <h2 className="text-xl font-semibold text-foreground -mb-2">
                            Vad vill du göra med underlaget?
                        </h2>

                        {/* ACTION 1: Ladda upp nytt (Recommended) */}
                        <div
                            className={`bg-card rounded-xl p-5 border cursor-pointer transition-colors relative overflow-hidden flex flex-col gap-4 ${selectedAction === 'upload' ? 'border-accent-strong ring-1 ring-accent-strong bg-accent-surface/20' : 'border-border hover:border-accent-border hover:bg-muted'}`}
                            onClick={() => setSelectedAction('upload')}
                        >
                            <div className="absolute top-0 right-0 bg-accent-subtle text-accent-strong text-xs font-medium px-4 py-1.5 rounded-bl-[10px]">
                                Rekommenderat
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded border border-border bg-muted text-muted-foreground shrink-0 mt-0.5">
                                    <Upload size={22} strokeWidth={1.5} />
                                </div>
                                <div className="pr-16">
                                    <h3 className={`font-semibold text-base mb-1.5 ${selectedAction === 'upload' ? 'text-foreground' : 'text-foreground'}`}>Ladda upp ett nytt underlag</h3>
                                    <p className="text-[14px] text-muted-foreground leading-relaxed mb-0">
                                        Ladda upp ett nyare dokument som ersätter den nuvarande källan i analysen
                                    </p>
                                </div>
                            </div>

                            {/* Expanded Area for Upload */}
                            {selectedAction === 'upload' && (
                                <div className="mt-2 pt-5 border-t border-border animate-[fadeIn_0.2s_ease-out]">
                                    {/* Upload Dropzone */}
                                    <div className="border border-dashed border-accent-border bg-accent-surface/50 rounded-lg p-6 flex flex-col items-center justify-center mb-4">
                                        <Upload className="text-muted-foreground mb-2" size={24} strokeWidth={1.5} />
                                        <div className="text-sm text-center">
                                            <span className="text-accent-strong font-medium">Välj fil</span> <span className="text-muted-foreground">eller dra och släpp här</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2 text-center">
                                            Godkända format: PDF, Excel, CSV<br />Max filstorlek: 20 MB
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer font-medium">
                                            Hjälp <HelpCircle size={14} />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="shadow-sm">
                                                Avbryt
                                            </Button>
                                            <Button onClick={() => onUpload?.()} className="shadow-sm">
                                                Importera källor <Upload size={16} strokeWidth={2} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ACTION 2: Simulera */}
                        <div
                            className={`bg-card rounded-xl p-5 border cursor-pointer transition-colors mt-4 flex flex-col gap-4 ${selectedAction === 'simulate' ? 'border-accent-strong ring-1 ring-accent-strong bg-card shadow-sm' : 'border-border hover:border-border hover:bg-muted'}`}
                            onClick={() => setSelectedAction('simulate')}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded border border-border bg-muted text-muted-foreground shrink-0 mt-0.5">
                                    <FileSearch size={22} strokeWidth={1.5} />
                                </div>
                                <div className="pr-4">
                                    <h3 className={`font-semibold text-base mb-1.5 ${selectedAction === 'simulate' ? 'text-foreground' : 'text-foreground'}`}>Simulera med en annan källa</h3>
                                    <p className="text-[14px] text-muted-foreground leading-relaxed mb-0">
                                        Se hur AI:ns rekommendation och konfidens skulle ändras om du väljer ett annat underlag. Inget beslut registreras.
                                    </p>
                                </div>
                            </div>

                            {selectedAction === 'simulate' && (
                                <div className="mt-2 pt-5 border-t border-border flex justify-between items-center animate-[fadeIn_0.2s_ease-out]">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer font-medium">
                                        Hur fungerar simulering? <HelpCircle size={14} />
                                    </div>
                                    <Button
                                        onClick={(e) => { e.stopPropagation(); onSimulate(); }}
                                        className="shadow-sm"
                                    >
                                        Öppna simuleringsvy <ArrowUpRight size={16} />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* ACTION 3: Godkänn utan uppladdning (Override/Undantag) */}
                        <div
                            className={`bg-card rounded-xl p-5 border cursor-pointer transition-colors mt-4 flex flex-col gap-4 ${selectedAction === 'approve' ? 'border-accent-strong ring-1 ring-accent-strong bg-card shadow-sm' : 'border-border hover:border-border hover:bg-muted'}`}
                            onClick={() => setSelectedAction('approve')}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded border border-border bg-muted text-muted-foreground shrink-0 mt-0.5">
                                    <ShieldAlert size={22} strokeWidth={1.5} />
                                </div>
                                <div className="pr-4">
                                    <h3 className={`font-semibold text-base mb-1.5 ${selectedAction === 'approve' ? 'text-foreground' : 'text-foreground'}`}>Godkänn utan uppladdning</h3>
                                    <p className="text-[14px] text-muted-foreground leading-relaxed mb-0">
                                        Godkänn granskning utan nytt underlag. Använd om du har tillgång till information som inte kan laddas upp i systemet.
                                    </p>
                                </div>
                            </div>

                            {/* Expanded Area for Override */}
                            {selectedAction === 'approve' && (
                                <div className="mt-2 pt-5 border-t border-border animate-[fadeIn_0.2s_ease-out]">
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-foreground text-[15px] mb-1">Godkänn befintligt underlag (undantag)</h4>
                                        <p className="text-muted-foreground text-[13px] italic mb-0">
                                            Du godkänner granskningen utan att ladda upp nytt underlag. Varningen kvarstår och ditt skäl loggas för spårbarhet.
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold text-foreground text-sm mb-3">Varför godkänner du trots att underlaget är gammalt?</h4>

                                        {/* Structured Override Chips */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <button className="px-3 py-1.5 text-[13px] font-medium bg-muted text-muted-foreground rounded-sm hover:bg-muted border border-border transition-colors">
                                                Gammal datakälla
                                            </button>
                                            <button className="px-3 py-1.5 text-[13px] font-medium bg-muted text-muted-foreground rounded-sm hover:bg-muted border border-border transition-colors">
                                                Avvikelsen är liten och verifierad
                                            </button>
                                            <button className="px-3 py-1.5 text-[13px] font-medium bg-muted text-muted-foreground rounded-sm hover:bg-muted border border-border transition-colors">
                                                Ny information verifierad utanför systemet
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <h4 className="text-[14px] text-foreground mb-2">Motivering (valfritt men rekommenderas)</h4>
                                        <textarea
                                            className="w-full h-32 p-3 border border-border rounded-md text-[14px] text-muted-foreground bg-card focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring resize-none mb-1 shadow-inner"
                                            placeholder='Beskriv kort vad som verifierats och hur. Ex: "Kontakt med VD 2026-02-24. Kassaflöde bekräftat mot bankutdrag."'
                                        ></textarea>
                                        <div className="flex justify-between items-start mt-1">
                                            <p className="text-[13px] text-muted-foreground leading-snug w-2/3">
                                                Din motivering loggas i ärendets historik och kan granskas i efterhand.
                                            </p>
                                            <span className="text-[13px] text-muted-foreground">0/500 tecken</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <Button className="shadow-sm">
                                            Spara underlag
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Evaluation Section */}
                        <div className="mt-2">
                            <h3 className="font-semibold text-foreground text-lg mb-1">Din bedömning av kassaflödet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Markera hur du bedömer kassaflödet efter granskningen. Uppdaterar ärendets samlade AI-bedömning.
                            </p>

                            {/* Segmented Control / Toggle Group */}
                            <div className="flex rounded-md border border-border overflow-hidden mb-3 bg-muted">
                                <button
                                    onClick={() => setEvaluation('approved')}
                                    className={`flex-1 py-2 px-4 text-sm font-medium transition-colors border-r border-border last:border-r-0 focus:z-10 focus:outline-none
                                    ${evaluation === 'approved'
                                            ? 'bg-conf-high-solid text-white'
                                            : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    Godkänt
                                </button>
                                <button
                                    onClick={() => setEvaluation('questioned')}
                                    className={`flex-1 py-2 px-4 text-sm font-medium transition-colors border-r border-border last:border-r-0 focus:z-10 focus:outline-none
                                    ${evaluation === 'questioned'
                                            ? 'bg-dq-stale-solid text-white'
                                            : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    Ifrågasatt
                                </button>
                                <button
                                    onClick={() => setEvaluation('insufficient')}
                                    className={`flex-1 py-2 px-4 text-sm font-medium transition-colors focus:z-10 focus:outline-none
                                    ${evaluation === 'insufficient'
                                            ? 'bg-conf-low-solid text-white'
                                            : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    Otillräckligt
                                </button>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Info size={12} className="text-muted-foreground shrink-0" />
                                Det slutgiltiga beslutet (Godkänn/Avslå) tas på ärendesidan med fullständig bild
                            </div>
                        </div>


                    </div>
                </div>{/* End of scrollable content container */}

                {/* Footer Area (Fixed at bottom) */}
                <div className="border-t border-border p-6 flex justify-between items-center bg-background flex-shrink-0 relative z-[51]">
                    <div className="text-xs text-muted-foreground">
                        <div className="font-medium text-foreground">Granskning loggas automatiskt</div>
                        Sara Lindgren • 2025-02-23 • 14:32
                    </div>
                    <Button size="sm">
                        Händelselogg för detta underlag <ArrowRight size={14} />
                    </Button>
                </div>
            </div> {/* End of Drawer Container */}

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
        </>
    )
}
