import { useState } from 'react'
import { ArrowLeft, Trash2, CheckCircle, Info } from 'lucide-react'
import InterestCoverageCard from './InterestCoverageCard'

export default function SimulationView({
    onClose,
}) {
    const [removedCurrentSource, setRemovedCurrentSource] = useState(false)
    const [addedNewSource, setAddedNewSource] = useState(false)

    // Nuläge: 0.8
    // Tänkt nytt läge (om källan byts): säg 1.4

    const simulatedValue = removedCurrentSource ? (addedNewSource ? 1.4 : 0.0) : 0.8;
    const simulatedImpact = removedCurrentSource ? (addedNewSource ? 15 : 0) : 45;

    let conclusionText = ""
    let conclusionColor = ""

    if (!removedCurrentSource && !addedNewSource) {
        conclusionText = "Med denna förändring: rekommendationen förblir Avslag"
        conclusionColor = "var(--c-ink-2)"
    } else if (removedCurrentSource && !addedNewSource) {
        conclusionText = "Varning: Ingen beräkningsdata vald"
        conclusionColor = "var(--c-orange-text)"
    } else if (removedCurrentSource && addedNewSource) {
        conclusionText = "Med denna förändring: rekommendationen ändras till Godkänn"
        conclusionColor = "var(--c-green)"
    }

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
                backgroundColor: '#FEF3C7', // yellow-100
                borderBottom: '1px solid #FDE68A', // yellow-200
                padding: '12px 24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                color: '#92400E', // yellow-800
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
                        Simulera källpåverkan
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
                        <span style={{ fontSize: 11, background: 'var(--c-red-light)', color: 'var(--c-red)', padding: '2px 6px', borderRadius: 4 }}>
                            Avslag
                        </span>
                    </h2>

                    <div style={{ opacity: 0.9, pointerEvents: 'none' }}>
                        <InterestCoverageCard value={0.8} impactPct={45} delay={0} />
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
                                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-ink-2)' }}>Årsredovisning 2024</div>
                                <div style={{ fontSize: 11, color: 'var(--c-ink-4)', marginTop: 2 }}>Bergström & Co AB</div>
                            </div>
                            <CheckCircle size={16} style={{ color: 'var(--c-green)' }} />
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <div style={{ width: 1, background: 'var(--c-border)', alignSelf: 'stretch' }} />

                {/* Hypotetiskt läge (Höger) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-indigo)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        Hypotetiskt läge
                        {removedCurrentSource && addedNewSource && (
                            <span style={{ fontSize: 11, background: 'var(--c-green-light)', color: 'var(--c-green)', padding: '2px 6px', borderRadius: 4 }}>
                                Godkänn
                            </span>
                        )}
                    </h2>

                    <div>
                        <InterestCoverageCard
                            value={simulatedValue}
                            impactPct={simulatedImpact}
                            delay={0}
                        />
                    </div>

                    {/* AI Bedömning (Hypotetiskt) */}
                    <div style={{
                        marginTop: 8, padding: 16, background: 'var(--c-white)', border: '1px solid var(--c-border)', borderRadius: 8
                    }}>
                        <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--c-ink-4)', textTransform: 'uppercase', marginBottom: 12 }}>AI-bedömning</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, color: 'var(--c-ink-2)' }}>Konfidensgrad</span>
                            {removedCurrentSource && addedNewSource ? (
                                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-indigo)', background: 'var(--c-indigo-light)', padding: '2px 8px', borderRadius: 9999 }}>Hög konfidens</span>
                            ) : (
                                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-red)', background: 'var(--c-red-light)', padding: '2px 8px', borderRadius: 9999 }}>Låg konfidens</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: 'var(--c-ink-2)' }}>Rekommendation</span>
                            {removedCurrentSource && addedNewSource ? (
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-green)' }}>Godkänn</span>
                            ) : (
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-red)' }}>Avslag</span>
                            )}
                        </div>
                    </div>

                    <div style={{
                        border: '2px dashed var(--c-border-strong)', borderRadius: 8, padding: 16, background: 'var(--c-white)'
                    }}>
                        <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--c-ink-4)', textTransform: 'uppercase', marginBottom: 12 }}>Valda Källor (Simulerade)</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {!removedCurrentSource ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--c-bg)', borderRadius: 6 }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-ink-2)' }}>Årsredovisning 2024</div>
                                        <div style={{ fontSize: 11, color: 'var(--c-ink-4)', marginTop: 2 }}>Bergström & Co AB</div>
                                    </div>
                                    <button
                                        onClick={() => setRemovedCurrentSource(true)}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-red)', padding: 4
                                        }}
                                        title="Ta bort i simulering"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 13, color: 'var(--c-ink-4)' }}>
                                    <s>Årsredovisning 2024 (Bergström & Co AB)</s> borttagen.
                                </div>
                            )}

                            {addedNewSource && (
                                <div className="card-enter" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--c-bg)', borderRadius: 6, border: '1px solid var(--c-border)' }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-ink-2)' }}>Preliminärt bokslut Q3 2024</div>
                                        <div style={{ fontSize: 11, color: 'var(--c-ink-4)', marginTop: 2 }}>Bergström & Co AB (Interimsrapport)</div>
                                    </div>
                                    <button
                                        onClick={() => setAddedNewSource(false)}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-red)', padding: 4
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}

                            {!addedNewSource && (
                                <button
                                    onClick={() => setAddedNewSource(true)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 0',
                                        background: 'var(--c-white)',
                                        border: '1px dashed var(--c-indigo)',
                                        color: 'var(--c-indigo)',
                                        borderRadius: 6,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        marginTop: 8
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--c-indigo-light)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--c-white)'}
                                >
                                    + Konvertera "Kassaflödesdata Q3" till källa
                                </button>
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
                        border: `1px solid ${conclusionColor.replace('var(--c-', 'var(--c-').replace(')', '-light)') || 'var(--c-border-strong)'}` // rough hack for border tint
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
