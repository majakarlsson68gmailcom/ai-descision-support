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
    let conclusionColor = ""

    if (selectedOption === 'none') {
        conclusionText = "Vänta på val av hypotetisk källa..."
        conclusionColor = "var(--c-ink-4)"
    } else if (selectedOption === '2023') {
        conclusionText = "Med detta underlag skulle AI:ns konfidensgrad öka till ca 78%"
        conclusionColor = "var(--c-indigo)"
        simulatedIsSourceCurrent = true
    } else if (selectedOption === '6mo') {
        conclusionText = "Med detta underlag skulle AI:ns konfidensgrad öka till ca 72%"
        conclusionColor = "var(--c-indigo)"
        simulatedValue = 171400
        simulatedIsValueVerified = true
        simulatedIsSourceCurrent = true
    } else if (selectedOption === 'auditor') {
        conclusionText = "Med detta underlag skulle AI:ns konfidensgrad öka till ca 85%"
        conclusionColor = "var(--c-indigo)"
        simulatedIsSourceCurrent = true
    } else if (selectedOption === 'remove') {
        conclusionText = "Utan kassaflödesdata kan AI:n inte göra en fullständig bedömning. Rekommendationen baseras då enbart på räntetäckning och skuldsättning."
        conclusionColor = "var(--c-orange-text)"
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
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'var(--c-bg)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            {/* Simulation Banner */}
            <div style={{
                backgroundColor: '#FEF3C7',
                borderBottom: '1px solid #FDE68A',
                padding: '12px 24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                color: '#92400E',
                fontSize: 13,
                fontWeight: 500,
            }}>
                <Info size={16} />
                Simulering — inga ändringar sparas i ärendet
            </div>

            {/* Header */}
            <div style={{
                padding: '16px 32px',
                borderBottom: '1px solid var(--c-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--c-white)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'var(--c-bg)', border: '1px solid var(--c-border-strong)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 32, height: 32, borderRadius: 6, cursor: 'pointer',
                            color: 'var(--c-ink-2)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--c-border)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--c-bg)'}
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--c-ink)' }}>
                        Simulera källpåverkan: Kassaflöde
                    </h1>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        padding: '8px 16px',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--c-ink-2)',
                        background: 'var(--c-white)',
                        border: '1px solid var(--c-border-strong)',
                        borderRadius: 6,
                        cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--c-bg)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--c-white)'}
                >
                    Avsluta simulering
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: 32, display: 'flex', gap: 32, overflowY: 'auto' }}>

                {/* Nuläge (Vänster) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 500, color: 'var(--c-ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        Nuläge
                        <span style={{ fontSize: 11, background: 'var(--c-orange-light)', color: 'var(--c-orange-text)', padding: '2px 6px', borderRadius: 4 }}>
                            Osäker (18mån)
                        </span>
                    </h2>

                    <div style={{ opacity: 0.9, pointerEvents: 'none' }}>
                        <CashFlowCard value={-240000} impactPct={20} delay={0} />
                    </div>

                    {/* AI Bedömning (Nuläge) */}
                    <div style={{
                        marginTop: 8, padding: 16, background: 'var(--c-white)', border: '1px solid var(--c-border)', borderRadius: 8
                    }}>
                        <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--c-ink-4)', textTransform: 'uppercase', marginBottom: 12 }}>AI-bedömning</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, color: 'var(--c-ink-2)' }}>Konfidensgrad</span>
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-red)', background: 'var(--c-red-light)', padding: '2px 8px', borderRadius: 9999 }}>Låg konfidens</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: 'var(--c-ink-2)' }}>Rekommendation</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-red)' }}>Avslag</span>
                        </div>
                    </div>

                    <div style={{
                        border: '1px solid var(--c-border)', borderRadius: 8, padding: 16, background: 'var(--c-white)', opacity: 0.9
                    }}>
                        <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--c-ink-4)', textTransform: 'uppercase', marginBottom: 12 }}>Valda Källor</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--c-bg)', borderRadius: 6 }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-ink-2)' }}>Årsredovisning 2022</div>
                                <div style={{ fontSize: 11, color: 'var(--c-ink-4)', marginTop: 2 }}>Bergström & Co AB</div>
                            </div>
                            <CheckCircle size={16} style={{ color: 'var(--c-orange-text)' }} />
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <div style={{ width: 1, background: 'var(--c-border)', alignSelf: 'stretch' }} />

                {/* Hypotetiskt läge (Höger) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-indigo)', display: 'flex', alignItems: 'center', gap: 6 }}>
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
                    <div style={{
                        marginTop: 8, padding: 16, background: 'var(--c-white)', border: '1px solid var(--c-border)', borderRadius: 8, opacity: selectedOption === 'remove' ? 0.3 : 1
                    }}>
                        <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--c-ink-4)', textTransform: 'uppercase', marginBottom: 12 }}>AI-bedömning</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, color: 'var(--c-ink-2)' }}>Konfidensgrad</span>
                            {selectedOption === '2023' || selectedOption === '6mo' || selectedOption === 'auditor' ? (
                                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-orange-text)', background: 'var(--c-orange-light)', padding: '2px 8px', borderRadius: 9999 }}>Medel konfidens</span>
                            ) : (
                                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-red)', background: 'var(--c-red-light)', padding: '2px 8px', borderRadius: 9999 }}>Låg konfidens</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: 'var(--c-ink-2)' }}>Rekommendation</span>
                            {selectedOption === 'auditor' ? (
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-green)' }}>Godkänn</span>
                            ) : (
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-red)' }}>Avslag</span>
                            )}
                        </div>
                    </div>

                    <div style={{
                        border: '2px dashed var(--c-border-strong)', borderRadius: 8, padding: 16, background: 'var(--c-white)'
                    }}>
                        <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--c-ink-4)', textTransform: 'uppercase', marginBottom: 12 }}>Ersätt källa</h3>

                        {/* Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    background: 'var(--c-bg)',
                                    border: '1px solid var(--c-border-strong)',
                                    borderRadius: 6,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: 13,
                                    color: 'var(--c-ink)',
                                    cursor: 'pointer'
                                }}
                            >
                                {activeOptionLabel}
                                <ChevronDown size={14} style={{ color: 'var(--c-ink-4)' }} />
                            </button>

                            {isDropdownOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    marginTop: 4,
                                    background: 'var(--c-white)',
                                    border: '1px solid var(--c-border)',
                                    borderRadius: 6,
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                    zIndex: 20
                                }}>
                                    {options.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                setSelectedOption(opt.id)
                                                setIsDropdownOpen(false)
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                textAlign: 'left',
                                                background: 'none',
                                                border: 'none',
                                                borderBottom: '1px solid var(--c-border)',
                                                fontSize: 13,
                                                color: opt.dangerous ? 'var(--c-red)' : 'var(--c-ink-2)',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--c-bg)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    <div style={{
                        marginTop: 'auto',
                        padding: 16,
                        background: 'var(--c-bg)',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 500,
                        color: conclusionColor,
                        textAlign: 'center',
                        border: `1px solid ${conclusionColor.replace('var(--c-', 'var(--c-').replace(')', '-light)') || 'var(--c-border-strong)'}`
                    }}>
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
