import React, { useState, useEffect } from 'react'
import { X, Upload, FileText, ArrowUpRight, HelpCircle, ArrowRight, Trash2, Copy, Info, AlertTriangle, ExternalLink, ChevronRight, ChevronsRight, Maximize2, FileSearch, ShieldAlert, Sparkles } from 'lucide-react'

// Helper component for AI Badge
function AIBadge() {
    return (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#f0eafb] border border-[#d6c3f3] text-[#451b88] text-xs font-medium">
            <Sparkles size={14} />
            AI
        </div>
    )
}

export default function KeyMetricSourceDrawer({ isOpen, onClose, onSimulate, onUpload, metric, caseData, onOpenSource }) {
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

        document.body.style.userSelect = 'none'

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.body.style.userSelect = ''
        }
    }, [isDragging])

    if (!isOpen || !metric || !caseData) return null

    const cleanValue = metric.value ? metric.value.replace(/↑|↓/g, '').trim() : 'Okänt'
    const isStale = metric.stale
    const isUnavailable = metric.status === 'unavailable'

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-gray-900/20 z-40"
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 bottom-0 bg-gray-50 shadow-2xl z-50 flex flex-col ${!isDragging ? 'animate-[slideInRight_0.3s_ease-out_forwards]' : ''}`}
                style={{ width: drawerWidth }}
            >
                {/* Resizer Handle */}
                <div
                    onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }}
                    className="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-blue-500/10 transition-colors z-[60] flex flex-col items-center justify-center group"
                >
                    <div className="w-1 h-12 rounded-full bg-gray-300 group-hover:bg-blue-600 transition-colors"></div>
                </div>

                {/* Content Container (Scrollable) */}
                <div className="flex-1 overflow-y-auto flex flex-col w-full relative">
                    {/* Sticky Header (Nav + Tabs) */}
                    <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm pt-4 border-b border-gray-300">
                        {/* Top Nav */}
                        <div className="flex justify-between items-center px-4">
                            <button
                                onClick={onClose}
                                className="p-1.5 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded transition-colors shadow-sm"
                            >
                                <ChevronsRight size={16} />
                            </button>
                            <div className="flex gap-2">
                                <button className="p-1.5 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded transition-colors shadow-sm">
                                    <Maximize2 size={16} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded transition-colors shadow-sm"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex px-6 mt-4">
                            <button className="px-5 py-2.5 text-sm font-medium text-blue-700 border-b-2 border-blue-700 mb-[-1px]">
                                Granskning
                            </button>
                            <button className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent mb-[-1px]">
                                Simulering
                            </button>
                        </div>
                    </div>

                    {/* Warning Banner */}
                    {(isStale || isUnavailable) && (
                        <div className="bg-[#FFF4E5] text-amber-800 text-sm font-medium py-3 px-6 flex items-center justify-center gap-2 m-6 mt-8 rounded-md">
                            <AlertTriangle size={16} className="text-amber-600" />
                            {isUnavailable ? 'Källa saknas eller är otillgänglig för detta nyckeltal' : `Denna analys behöver manuell granskning (${metric.factor === 'Omsättningsdata' ? 'källan är oreviderad' : 'föråldrad data'})`}
                        </div>
                    )}

                    <div className={`px-8 pb-8 flex flex-col gap-10 ${!(isStale || isUnavailable) ? 'mt-8' : ''}`}>

                        {/* Header Section */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">{metric.factor}</h1>
                                <AIBadge />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Ärende</div>
                                    <div className="text-sm font-medium text-gray-900">{caseData.id}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Företag</div>
                                    <div className="text-sm font-medium text-gray-900">{caseData.company}</div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Aktuellt värde</h2>
                                <div className="text-4xl font-bold text-gray-900">
                                    {cleanValue}
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-500">
                                <div className="flex gap-[3px]">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i <= (metric.weight === 'hög' ? 3 : metric.weight === 'medel' ? 2 : 1) ? 'bg-blue-700' : 'bg-gray-300'}`}></div>
                                    ))}
                                </div>
                                <span className="ml-1 flex items-center gap-1">Påverkan <Info size={12} /></span>
                            </div>
                        </div>

                        {/* AI Analysis */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">AI-Analys</h2>
                                <AIBadge />
                            </div>
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                                {metric.description}
                            </p>
                            {(isStale || isUnavailable) && (
                                <>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">Varför är konfidensen inte högre?</h3>
                                    <p className="text-base text-gray-700 leading-relaxed">
                                        {isUnavailable ? 'Osäkerheten kring denna faktor försämrar den sammantagna konfidensgraden, då aktuell branschdata ej kunde inhämtas.' : 'Eftersom datan är över 12 månader gammal kan en plötslig förändring inte uteslutas. Osäkerheten kring den aktuella finansiella statusen sänker därför den totala konfidensen.'}
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Underlag för analysen */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Underlag för analysen</h2>

                            <div className="flex flex-col text-sm border-t border-gray-300">
                                <div className="flex justify-between py-3.5 border-b border-gray-300">
                                    <span className="text-gray-600">Aktuellt värde ({metric.period})</span>
                                    <span className="font-medium text-gray-900">{cleanValue}</span>
                                </div>
                                <div className="flex justify-between py-3.5 border-b border-gray-300 bg-gray-50/50">
                                    <span className="text-gray-600">Bankens {metric.limitLabel?.toLowerCase() || 'krav'}:</span>
                                    <span className="font-medium text-gray-900">{metric.limit}</span>
                                </div>
                                <div className="flex justify-between py-3.5 border-b border-gray-300">
                                    <span className="text-gray-600">Avvikelse:</span>
                                    <span className="font-medium text-gray-900">{metric.diff}</span>
                                </div>
                            </div>
                        </div>

                        {/* Använd källa */}
                        {!isUnavailable && (
                            <>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Använd källa</h2>

                                    <div className="flex items-center gap-3 mb-4 text-sm">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-gray-800 shadow-sm font-medium">
                                            <FileText size={16} className="text-gray-400" />
                                            {metric.source}
                                        </div>
                                    </div>

                                    {isStale && (
                                        <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-5">
                                            <AlertTriangle size={16} />
                                            {metric.staleReason || (metric.factor === 'Omsättningsdata' ? 'Källan är oreviderad – siffrorna är ej externt granskade' : 'Överstiger policygräns (max 12 månader)')}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-sm text-gray-700">
                                            Källa använd för detta nyckeltal
                                        </div>
                                        <button
                                            onClick={() => { onOpenSource?.({ metric }); onClose() }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-700 border border-indigo-200 hover:bg-indigo-50 bg-white rounded transition-colors">
                                            Öppna källa <ArrowUpRight size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-gray-200"></div>
                            </>
                        )}

                        <h2 className="text-xl font-semibold text-gray-900 -mb-2">
                            Vad vill du göra med underlaget?
                        </h2>

                        {/* ACTION 1: Ladda upp nytt (Recommended) */}
                        <div
                            className={`bg-white rounded-xl p-5 border cursor-pointer transition-colors relative overflow-hidden flex flex-col gap-4 ${selectedAction === 'upload' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/20' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                            onClick={() => setSelectedAction('upload')}
                        >
                            {isStale && (
                                <div className="absolute top-0 right-0 bg-[#E8EFFC] text-[#24488A] text-xs font-medium px-4 py-1.5 rounded-bl-[10px]">
                                    Rekommenderat
                                </div>
                            )}
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded border border-gray-200 bg-gray-50 text-gray-700 shrink-0 mt-0.5">
                                    <Upload size={22} strokeWidth={1.5} />
                                </div>
                                <div className="pr-16">
                                    <h3 className={`font-semibold text-base mb-1.5 text-gray-900`}>Ladda upp ett nytt underlag</h3>
                                    <p className="text-[14px] text-gray-600 leading-relaxed mb-0">
                                        Ladda upp ett nyare dokument som ersätter den nuvarande källan i analysen
                                    </p>
                                </div>
                            </div>

                            {/* Expanded Area for Upload */}
                            {selectedAction === 'upload' && (
                                <div className="mt-2 pt-5 border-t border-gray-100 animate-[fadeIn_0.2s_ease-out]">
                                    {/* Upload Dropzone */}
                                    <div className="border border-dashed border-blue-200 bg-blue-50/50 rounded-lg p-6 flex flex-col items-center justify-center mb-4">
                                        <Upload className="text-gray-600 mb-2" size={24} strokeWidth={1.5} />
                                        <div className="text-sm text-center">
                                            <span className="text-blue-600 font-medium">Välj fil</span> <span className="text-gray-600">eller dra och släpp här</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2 text-center">
                                            Godkända format: PDF, Excel, CSV<br />Max filstorlek: 20 MB
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer font-medium">
                                            Hjälp <HelpCircle size={14} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition-colors">
                                                Avbryt
                                            </button>
                                            <button onClick={() => onUpload?.()} className="px-4 py-2 text-sm font-medium text-white bg-[#3059CE] rounded-md hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-colors">
                                                Importera källor <Upload size={16} strokeWidth={2} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ACTION 2: Simulera */}
                        <div
                            className={`bg-white rounded-xl p-5 border cursor-pointer transition-colors mt-4 flex flex-col gap-4 ${selectedAction === 'simulate' ? 'border-blue-500 ring-1 ring-blue-500 bg-white shadow-sm' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}
                            onClick={() => setSelectedAction('simulate')}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded border border-gray-200 bg-gray-50 text-gray-700 shrink-0 mt-0.5">
                                    <FileSearch size={22} strokeWidth={1.5} />
                                </div>
                                <div className="pr-4">
                                    <h3 className={`font-semibold text-base mb-1.5 text-gray-900`}>Simulera med en annan källa</h3>
                                    <p className="text-[14px] text-gray-600 leading-relaxed mb-0">
                                        Se hur AI:ns rekommendation och konfidens skulle ändras om du väljer ett annat underlag. Inget beslut registreras.
                                    </p>
                                </div>
                            </div>

                            {selectedAction === 'simulate' && (
                                <div className="mt-2 pt-5 border-t border-gray-200 flex justify-between items-center animate-[fadeIn_0.2s_ease-out]">
                                    <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer font-medium">
                                        Hur fungerar simulering? <HelpCircle size={14} />
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSimulate(); }}
                                        className="px-4 py-2 text-[14px] font-medium text-white bg-[#3059CE] border border-transparent rounded-md hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-colors"
                                    >
                                        Öppna simuleringsvy <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ACTION 3: Godkänn utan uppladdning (Override/Undantag) */}
                        <div
                            className={`bg-white rounded-xl p-5 border cursor-pointer transition-colors mt-4 flex flex-col gap-4 ${selectedAction === 'approve' ? 'border-blue-500 ring-1 ring-blue-500 bg-white shadow-sm' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}
                            onClick={() => setSelectedAction('approve')}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded border border-gray-200 bg-gray-50 text-gray-700 shrink-0 mt-0.5">
                                    <ShieldAlert size={22} strokeWidth={1.5} />
                                </div>
                                <div className="pr-4">
                                    <h3 className={`font-semibold text-base mb-1.5 text-gray-900`}>Godkänn utan uppladdning</h3>
                                    <p className="text-[14px] text-gray-600 leading-relaxed mb-0">
                                        Godkänn granskning utan nytt underlag. Använd om du har tillgång till information som inte kan laddas upp i systemet.
                                    </p>
                                </div>
                            </div>

                            {/* Expanded Area for Override */}
                            {selectedAction === 'approve' && (
                                <div className="mt-2 pt-5 border-t border-gray-200 animate-[fadeIn_0.2s_ease-out]">
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 text-[15px] mb-1">Godkänn befintligt underlag (undantag)</h4>
                                        <p className="text-gray-500 text-[13px] italic mb-0">
                                            Du godkänner granskningen utan att ladda upp nytt underlag. Varningen kvarstår och ditt skäl loggas för spårbarhet.
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 text-sm mb-3">Varför godkänner du trots att underlaget är gammalt?</h4>

                                        {/* Structured Override Chips */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <button className="px-3 py-1.5 text-[13px] font-medium bg-[#EAEAEA] text-gray-800 rounded hover:bg-gray-300 border border-gray-300 transition-colors">
                                                Gammal datakälla
                                            </button>
                                            <button className="px-3 py-1.5 text-[13px] font-medium bg-[#EAEAEA] text-gray-800 rounded hover:bg-gray-300 border border-gray-300 transition-colors">
                                                Avvikelsen är liten och verifierad
                                            </button>
                                            <button className="px-3 py-1.5 text-[13px] font-medium bg-[#EAEAEA] text-gray-800 rounded hover:bg-gray-300 border border-gray-300 transition-colors">
                                                Ny information verifierad utanför systemet
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <h4 className="text-[14px] text-gray-800 mb-2">Motivering (valfritt men rekommenderas)</h4>
                                        <textarea
                                            className="w-full h-32 p-3 border border-gray-300 rounded-md text-[14px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none mb-1 shadow-inner"
                                            placeholder='Beskriv kort vad som verifierats och hur. Ex: "Kontakt med VD 2026-02-24. Kassaflöde bekräftat mot bankutdrag."'
                                        ></textarea>
                                        <div className="flex justify-between items-start mt-1">
                                            <p className="text-[13px] text-gray-600 leading-snug w-2/3">
                                                Din motivering loggas i ärendets historik och kan granskas i efterhand.
                                            </p>
                                            <span className="text-[13px] text-gray-500">0/500 tecken</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <button className="px-4 py-2 text-[14px] font-medium text-white bg-[#3059CE] border border-transparent rounded hover:bg-blue-700 shadow-sm transition-colors">
                                            Spara underlag
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Evaluation Section */}
                        <div className="mt-2">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">Din bedömning av aktuellt nyckeltal</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Markera hur du bedömer nyckeltalet efter granskningen. Uppdaterar ärendets samlade AI-bedömning.
                            </p>

                            {/* Segmented Control / Toggle Group */}
                            <div className="flex rounded-md border border-gray-300 overflow-hidden mb-3 bg-gray-100">
                                <button
                                    onClick={() => setEvaluation('approved')}
                                    className={`flex-1 py-2 px-4 text-sm font-medium transition-colors border-r border-gray-300 last:border-r-0 focus:z-10 focus:outline-none
                                    ${evaluation === 'approved'
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Godkänt
                                </button>
                                <button
                                    onClick={() => setEvaluation('questioned')}
                                    className={`flex-1 py-2 px-4 text-sm font-medium transition-colors border-r border-gray-300 last:border-r-0 focus:z-10 focus:outline-none
                                    ${evaluation === 'questioned'
                                            ? 'bg-amber-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Ifrågasatt
                                </button>
                                <button
                                    onClick={() => setEvaluation('insufficient')}
                                    className={`flex-1 py-2 px-4 text-sm font-medium transition-colors focus:z-10 focus:outline-none
                                    ${evaluation === 'insufficient'
                                            ? 'bg-red-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Otillräckligt
                                </button>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <Info size={12} className="text-gray-600 shrink-0" />
                                Det slutgiltiga beslutet (Godkänn/Avslå) tas på ärendesidan med fullständig bild
                            </div>
                        </div>

                    </div>
                </div>{/* End of scrollable content container */}

                {/* Footer Area (Fixed at bottom) */}
                <div className="border-t border-gray-200 p-6 flex justify-between items-center bg-gray-50 flex-shrink-0 relative z-[51]">
                    <div className="text-xs text-gray-500">
                        <div className="font-medium text-gray-800">Granskning loggas automatiskt</div>
                        Sara Lindgren • {new Date().toLocaleDateString('sv-SE')}
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
                        Händelselogg för detta underlag <ArrowRight size={14} />
                    </button>
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
