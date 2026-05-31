import { useState } from 'react'
import { ArrowLeft, Trash2, CheckCircle, Info, ChevronDown } from 'lucide-react'
import CashFlowCard from './CashFlowCard'

export default function CashFlowSimulationView({
    onClose,
}) {
    // Option: 'none', '2023', '6mo', 'auditor', 'remove'
    const [selectedOption, setSelectedOption] = useState('none')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    // Nuläge: value -240000, 20% påverkan
    let simulatedValue = -240000
    let simulatedImpact = 20
    let simulatedIsValueVerified = false
    let simulatedIsSourceCurrent = false
    let conclusionText = ""
    let conclusionClass = ""

    if (selectedOption === 'none') {
        conclusionText = "Vänta på val av hypotetisk källa..."
        conclusionClass = "text-muted-foreground/60 border-border"
    } else if (selectedOption === '2023') {
        conclusionText = "Med detta underlag skulle AI:ns konfidensgrad öka till ca 78%"
        conclusionClass = "text-accent-strong border-accent-border"
        simulatedIsSourceCurrent = true
    } else if (selectedOption === '6mo') {
        conclusionText = "Med detta underlag skulle AI:ns konfidensgrad öka till ca 72%"
        conclusionClass = "text-accent-strong border-accent-border"
        simulatedValue = 171400
        simulatedIsValueVerified = true
        simulatedIsSourceCurrent = true
    } else if (selectedOption === 'auditor') {
        conclusionText = "Med detta underlag skulle AI:ns konfidensgrad öka till ca 85%"
        conclusionClass = "text-accent-strong border-accent-border"
        simulatedIsSourceCurrent = true
    } else if (selectedOption === 'remove') {
        conclusionText = "Utan kassaflödesdata kan AI:n inte göra en fullständig bedömning. Rekommendationen baseras då enbart på räntetäckning och skuldsättning."
        conclusionClass = "text-dq-stale-fg border-dq-stale-border"
        simulatedValue = null // Or handle removed completely
        simulatedImpact = 0
    }

    const options = [
        { id: '2023', label: 'Årsredovisning 2023' },
        { id: '6mo', label: 'Bankutdrag senaste 6 månader' },
        { id: 'auditor', label: 'Revisorsintyg' },
        { id: 'remove', label: 'Ta bort faktorn', dangerous: true }
    ]

    const activeOptionLabel = options.find(o => o.id === selectedOption)?.label || 'Välj ersättande källa...'

    return (
        <div
            className="bg-background"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            {/* Simulation Banner */}
            <div
                className="bg-dq-stale-bg text-dq-stale-fg border-dq-stale-border"
                style={{
                    borderBottom: '1px solid',
                    padding: '12px 24px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 500,
                }}
            >
                <Info size={16} />
                Simulering — inga ändringar sparas i ärendet
            </div>

            {/* Header */}
            <div
                className="bg-card border-border"
                style={{
                    padding: '16px 32px',
                    borderBottom: '1px solid',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                        onClick={onClose}
                        className="bg-background border border-border text-muted-foreground hover:bg-muted"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 32, height: 32, borderRadius: 6, cursor: 'pointer',
                        }}
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <h1 className="text-foreground" style={{ fontSize: 18, fontWeight: 600 }}>
                        Simulera källpåverkan: Kassaflöde
                    </h1>
                </div>
                <button
                    onClick={onClose}
                    className="text-muted-foreground bg-card border border-border hover:bg-muted"
                    style={{
                        padding: '8px 16px',
                        fontSize: 13,
                        fontWeight: 500,
                        borderRadius: 6,
                        cursor: 'pointer',
                    }}
                >
                    Avsluta simulering
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: 32, display: 'flex', gap: 32, overflowY: 'auto' }}>

                {/* Nuläge (Vänster) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h2 className="text-muted-foreground" style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                        Nuläge
                        <span className="bg-dq-stale-bg text-dq-stale-fg rounded-sm" style={{ fontSize: 11, padding: '2px 6px' }}>
                            Osäker (18mån)
                        </span>
                    </h2>

                    <div style={{ opacity: 0.9, pointerEvents: 'none' }}>
                        <CashFlowCard value={-240000} impactPct={20} delay={0} />
                    </div>

                    {/* AI Bedömning (Nuläge) */}
                    <div
                        className="bg-card border border-border"
                        style={{ marginTop: 8, padding: 16, borderRadius: 8 }}
                    >
                        <h3 className="text-muted-foreground/60" style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', marginBottom: 12 }}>AI-bedömning</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span className="text-muted-foreground" style={{ fontSize: 13 }}>Konfidensgrad</span>
                            <span className="text-conf-low-fg bg-conf-low-bg" style={{ fontSize: 13, fontWeight: 500, padding: '2px 8px', borderRadius: 9999 }}>Låg konfidens</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="text-muted-foreground" style={{ fontSize: 13 }}>Rekommendation</span>
                            <span className="text-conf-low-fg" style={{ fontSize: 13, fontWeight: 600 }}>Avslag</span>
                        </div>
                    </div>

                    <div
                        className="border border-border bg-card"
                        style={{ borderRadius: 8, padding: 16, opacity: 0.9 }}
                    >
                        <h3 className="text-muted-foreground/60" style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', marginBottom: 12 }}>Valda Källor</h3>
                        <div className="bg-muted" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 6 }}>
                            <div>
                                <div className="text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Årsredovisning 2022</div>
                                <div className="text-muted-foreground/60" style={{ fontSize: 11, marginTop: 2 }}>Bergström & Co AB</div>
                            </div>
                            <CheckCircle size={16} className="text-dq-stale-fg" />
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <div className="bg-border" style={{ width: 1, alignSelf: 'stretch' }} />

                {/* Hypotetiskt läge (Höger) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h2 className="text-accent-strong" style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        Hypotetiskt läge
                    </h2>

                    <div style={{ opacity: selectedOption === 'remove' ? 0.3 : 1 }}>
                        <CashFlowCard
                            value={simulatedValue}
                            impactPct={simulatedImpact}
                            sourceName={activeOptionLabel !== 'Välj ersättande källa...' && selectedOption !== 'remove' ? activeOptionLabel : 'N/A'}
                            isValueVerified={simulatedIsValueVerified}
                            isSourceCurrent={simulatedIsSourceCurrent}
                            delay={0}
                        />
                    </div>

                    {/* AI Bedömning (Hypotetiskt) */}
                    <div
                        className="bg-card border border-border"
                        style={{ marginTop: 8, padding: 16, borderRadius: 8, opacity: selectedOption === 'remove' ? 0.3 : 1 }}
                    >
                        <h3 className="text-muted-foreground/60" style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', marginBottom: 12 }}>AI-bedömning</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span className="text-muted-foreground" style={{ fontSize: 13 }}>Konfidensgrad</span>
                            {selectedOption === '2023' || selectedOption === '6mo' || selectedOption === 'auditor' ? (
                                <span className="text-dq-stale-fg bg-dq-stale-bg" style={{ fontSize: 13, fontWeight: 500, padding: '2px 8px', borderRadius: 9999 }}>Medel konfidens</span>
                            ) : (
                                <span className="text-conf-low-fg bg-conf-low-bg" style={{ fontSize: 13, fontWeight: 500, padding: '2px 8px', borderRadius: 9999 }}>Låg konfidens</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="text-muted-foreground" style={{ fontSize: 13 }}>Rekommendation</span>
                            {selectedOption === 'auditor' ? (
                                <span className="text-conf-high-fg" style={{ fontSize: 13, fontWeight: 600 }}>Godkänn</span>
                            ) : (
                                <span className="text-conf-low-fg" style={{ fontSize: 13, fontWeight: 600 }}>Avslag</span>
                            )}
                        </div>
                    </div>

                    <div
                        className="border-2 border-dashed border-border bg-card"
                        style={{ borderRadius: 8, padding: 16 }}
                    >
                        <h3 className="text-muted-foreground/60" style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', marginBottom: 12 }}>Ersätt källa</h3>

                        {/* Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-muted border border-border text-foreground"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: 6,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: 13,
                                    cursor: 'pointer'
                                }}
                            >
                                {activeOptionLabel}
                                <ChevronDown size={14} className="text-muted-foreground/60" />
                            </button>

                            {isDropdownOpen && (
                                <div
                                    className="bg-card border border-border"
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        marginTop: 4,
                                        borderRadius: 6,
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                        zIndex: 20
                                    }}
                                >
                                    {options.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                setSelectedOption(opt.id)
                                                setIsDropdownOpen(false)
                                            }}
                                            className={`border-b border-border hover:bg-muted ${opt.dangerous ? 'text-conf-low-fg' : 'text-muted-foreground'}`}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                textAlign: 'left',
                                                background: 'none',
                                                fontSize: 13,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    <div
                        className={`bg-muted border ${conclusionClass}`}
                        style={{
                            marginTop: 'auto',
                            padding: 16,
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            textAlign: 'center',
                        }}
                    >
                        {conclusionText}
                    </div>

                </div>

            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
        </div>
    )
}
