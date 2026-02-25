import React, { useState, useEffect } from 'react'
import { X, Upload, FileText, ArrowUpRight, HelpCircle, ArrowRight, Trash2, Copy, Info, AlertTriangle, ExternalLink, ChevronRight, ChevronsRight, Maximize2 } from 'lucide-react'

// Helper component for AI Badge
function AIBadge() {
    return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold tracking-wider uppercase">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
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
                    < div className="bg-[#FFF4E5] text-amber-800 text-sm font-medium py-3 px-6 flex items-center justify-center gap-2 m-6 mt-8 rounded-md" >
                        <AlertTriangle size={16} className="text-amber-600" />
                        Denna analys behöver manuell granskning
                    </div >

                    <div className="px-8 pb-8 flex flex-col gap-10">

                        {/* Header Section */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">Kassaflödesanalys</h1>
                                <AIBadge />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Ärende</div>
                                    <div className="text-sm font-medium text-gray-900">KR-2026-0847</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Företag</div>
                                    <div className="text-sm font-medium text-gray-900">Bergström & Co AB</div>
                                </div>
                            </div>

                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">AI-rekommendation</h2>
                                    <div className="text-4xl font-bold text-[#D03027]">Avslag</div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
                                        Konfidensgrad <Info size={12} />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-[#B95000] bg-[#FFF4E5] px-3 py-1 rounded-full border border-[#FED7AA]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#EA580C]"></div>
                                        Medel konfidens
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-500">
                                <div className="flex gap-[3px]">
                                    <div className="w-2 h-2 rounded-full bg-blue-700"></div>
                                    <div className="w-2 h-2 rounded-full bg-blue-700"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
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
                                Kassaflödet täcker inte skuldservicen vid det ansökta lånebeloppet. Rekommendationen lutar tungt åt avslag baserat på svag räntetäckningsgrad och hög samlad skuldbörda.
                            </p>
                            <p className="text-base text-gray-700 leading-relaxed mb-6">
                                Analysen baseras på årsredovisningen 2022. Nyare data saknas.
                            </p>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Varför är konfidensen inte högre?</h3>
                            <p className="text-base text-gray-700 leading-relaxed">
                                Eftersom kassaflödesdatan är gammal kan en plötslig förbättring där inte uteslutas. Osäkerheten kring aktuell kassaflödesstatus sänker därför den totala konfidensen till medel.
                            </p>
                        </div>

                        {/* Underlag för analysen */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Underlag för analysen</h2>

                            <div className="flex flex-col text-sm border-t border-gray-300">
                                <div className="flex justify-between py-3.5 border-b border-gray-300">
                                    <span className="text-gray-600">Operativt kassaflöde (snitt/kvartal)</span>
                                    <span className="font-medium text-gray-900">-240 000 kr</span>
                                </div>
                                <div className="flex justify-between py-3.5 border-b border-gray-300 bg-gray-50/50">
                                    <span className="text-gray-600">Bankens krav:</span>
                                    <span className="font-medium text-gray-900">≥ 0 kr</span>
                                </div>
                                <div className="flex justify-between py-3.5 border-b border-gray-300">
                                    <span className="text-gray-600">Avvikelse från krav:</span>
                                    <span className="font-medium text-gray-900">-240 000 kr</span>
                                </div>
                                <div className="flex justify-between py-3.5 border-b border-gray-300 items-start">
                                    <span className="text-gray-600 mt-0.5">Trend</span>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">Ej beräkningsbar</div>
                                        <div className="text-xs text-gray-500 italic mt-0.5">(data saknas för 2023–2024)</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-6 text-xs text-gray-500 italic">
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
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Använd källa</h2>

                            <div className="flex items-center gap-3 mb-4 text-sm">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-gray-800 shadow-sm font-medium">
                                    <FileText size={16} className="text-gray-400" />
                                    Årsredovisning 2022
                                </div>
                                <span className="text-gray-500">Hämtad via UC (Upplysningscentralen) • 3 år gammal</span>
                            </div>

                            <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-5">
                                <AlertTriangle size={16} />
                                Överstiger policygräns (max 12 månader)
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Kassaflödesanalys använd för detta underlag
                                </div>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-700 border border-indigo-200 hover:bg-indigo-50 bg-white rounded transition-colors">
                                    Öppna källa <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200"></div>

                        <h2 className="text-xl font-semibold text-gray-900 -mb-2">
                            Vad vill du göra med underlaget?
                        </h2>

                        {/* ACTION 1: Ladda upp nytt (Recommended) */}
                        <div
                            className={`bg-white rounded-xl p-5 border cursor-pointer transition-colors relative overflow-hidden ${selectedAction === 'upload' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/20' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                            onClick={() => setSelectedAction('upload')}
                        >
                            <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg">
                                Rekommenderat steg
                            </div>
                            <div className="flex items-start gap-3 mb-1">
                                <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${selectedAction === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <Upload size={16} />
                                </div>
                                <div>
                                    <h3 className={`font-semibold text-base mb-1 ${selectedAction === 'upload' ? 'text-blue-900' : 'text-gray-900'}`}>Ersätt källdata</h3>
                                    <p className="text-sm text-gray-500 mb-0">
                                        Ladda upp ett nyare dokument som ersätter den nuvarande källan i analysen. Förbättrar konfidensgraden.
                                    </p>
                                </div>
                            </div>

                            {/* Expanded Area for Upload */}
                            {selectedAction === 'upload' && (
                                <div className="mt-4 pt-4 border-t border-gray-100 animate-[fadeIn_0.2s_ease-out]">
                                    {/* Upload Dropzone */}
                                    <div className="border border-dashed border-blue-200 bg-blue-50/50 rounded-lg p-6 flex flex-col items-center justify-center mb-4">
                                        <Upload className="text-gray-600 mb-2" size={20} />
                                        <div className="text-sm text-center">
                                            <span className="text-blue-600 font-medium">Välj fil</span> <span className="text-gray-600">eller dra och släpp här</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2 text-center">
                                            Godkända format: PDF, Excel, CSV<br />Max filstorlek: 20 MB
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
                                            Hjälp <HelpCircle size={12} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                                                Avbryt
                                            </button>
                                            <button onClick={() => onUpload?.()} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-1.5">
                                                Importera källor <Upload size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Current File */}
                                    <div className="pt-2">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Nuvarande underlag</div>
                                        <div className="flex items-center justify-between border border-gray-200 bg-white rounded-lg p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded bg-gray-50 shrink-0">
                                                    <FileText size={16} className="text-gray-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Årsredovisning-2022.pdf</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">15 MB • Uppladdad via UC</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1.5">
                                                <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Öppna källa">
                                                    <ExternalLink size={16} />
                                                </button>
                                                <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Ta bort">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ACTION 2: Simulera */}
                        <div
                            className={`bg-white rounded-xl p-5 border cursor-pointer transition-colors ${selectedAction === 'simulate' ? 'border-gray-500 ring-1 ring-gray-600 bg-gray-50/50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}
                            onClick={() => setSelectedAction('simulate')}
                        >
                            <div className="flex items-start gap-3 mb-1">
                                <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${selectedAction === 'simulate' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <ArrowUpRight size={16} />
                                </div>
                                <div>
                                    <h3 className={`font-semibold text-base mb-1 ${selectedAction === 'simulate' ? 'text-gray-900' : 'text-gray-900'}`}>Simulera framtid</h3>
                                    <p className="text-sm text-gray-500 mb-0">
                                        Genomför en fiktiv vad-om-analys. Påverkar varken beslutet eller loggen för ärendet.
                                    </p>
                                </div>
                            </div>

                            {selectedAction === 'simulate' && (
                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center animate-[fadeIn_0.2s_ease-out]">
                                    <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
                                        Hur fungerar simulering? <HelpCircle size={12} />
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSimulate(); }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 shadow-sm flex items-center gap-1.5"
                                    >
                                        Öppna simuleringsvy <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ACTION 3: Godkänn utan uppladdning (Override/Undantag) */}
                        <div
                            className={`bg-white rounded-xl p-5 border cursor-pointer transition-colors ${selectedAction === 'approve' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/20' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40'}`}
                            onClick={() => setSelectedAction('approve')}
                        >
                            <div className="flex items-start gap-3 mb-1">
                                <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${selectedAction === 'approve' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <AlertTriangle size={16} />
                                </div>
                                <div>
                                    <h3 className={`font-semibold text-base mb-1 ${selectedAction === 'approve' ? 'text-indigo-900' : 'text-gray-900'}`}>Godkänn befintligt underlag</h3>
                                    <p className="text-sm text-gray-500 mb-0">
                                        Behåll varningen om gammal data och motivera ett undantag. Låser den befintliga källan för rekommendationen.
                                    </p>
                                </div>
                            </div>

                            {/* Expanded Area for Override */}
                            {selectedAction === 'approve' && (
                                <div className="mt-4 pt-4 border-t border-indigo-100 animate-[fadeIn_0.2s_ease-out]">
                                    <div className="bg-white rounded-lg p-5 border border-indigo-200 ring-4 ring-indigo-50 shadow-sm">
                                        <h4 className="font-semibold text-gray-900 text-sm mb-3">Varför godkänns underlaget trots hög ålder?</h4>

                                        {/* Structured Override Chips */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <button className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 rounded-md hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200 transition-colors">
                                                Beslut grundas ej på detta underlag
                                            </button>
                                            <button className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 rounded-md hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200 transition-colors">
                                                Avvikelsen marginell (verifierat)
                                            </button>
                                            <button className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 rounded-md hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200 transition-colors">
                                                Ny data bekräftad muntligt
                                            </button>
                                        </div>

                                        <textarea
                                            className="w-full h-24 p-3 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 mb-2 resize-none"
                                            placeholder='Valfritt: Skriv en djupare motivering här. (Ex: "Telefon med VD styrker kassaflöde")'
                                        ></textarea>

                                        <div className="flex justify-between items-center pt-2">
                                            <div className="text-xs text-indigo-700 w-2/3 flex items-center gap-1.5 font-medium leading-tight">
                                                <Info size={14} className="shrink-0" /> Din motivering loggas i ärendets historik och krävs inför beslut.
                                            </div>
                                            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm shrink-0 whitespace-nowrap transition-colors">
                                                Spara undantag
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Evaluation Section */}
                        <div className="mt-2">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">Din bedömning av kassaflödet</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Markera hur du bedömer kassaflödet efter granskningen. Uppdaterar ärendets samlade AI-bedömning.
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
                        Sara Lindgren • 2025-02-23 • 14:32
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
