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
    let conclusionClass = ""

    if (!removedCurrentSource && !addedNewSource) {
        conclusionText = "Med denna förändring: rekommendationen förblir Avslag"
        conclusionClass = "text-muted-foreground border-border"
    } else if (removedCurrentSource && !addedNewSource) {
        conclusionText = "Varning: Ingen beräkningsdata vald"
        conclusionClass = "text-dq-stale-fg border-dq-stale-border"
    } else if (removedCurrentSource && addedNewSource) {
        conclusionText = "Med denna förändring: rekommendationen ändras till Godkänn"
        conclusionClass = "text-conf-high-fg border-conf-high-border"
    }

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
                        Simulera källpåverkan
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
                        <span className="bg-conf-low-bg text-conf-low-fg rounded-sm" style={{ fontSize: 11, padding: '2px 6px' }}>
                            Avslag
                        </span>
                    </h2>

                    <div style={{ opacity: 0.9, pointerEvents: 'none' }}>
                        <InterestCoverageCard value={0.8} impactPct={45} delay={0} />
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
                                <div className="text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Årsredovisning 2024</div>
                                <div className="text-muted-foreground/60" style={{ fontSize: 11, marginTop: 2 }}>Bergström & Co AB</div>
                            </div>
                            <CheckCircle size={16} className="text-conf-high-fg" />
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <div className="bg-border" style={{ width: 1, alignSelf: 'stretch' }} />

                {/* Hypotetiskt läge (Höger) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h2 className="text-accent-strong" style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        Hypotetiskt läge
                        {removedCurrentSource && addedNewSource && (
                            <span className="bg-conf-high-bg text-conf-high-fg rounded-sm" style={{ fontSize: 11, padding: '2px 6px' }}>
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
                    <div
                        className="bg-card border border-border"
                        style={{ marginTop: 8, padding: 16, borderRadius: 8 }}
                    >
                        <h3 className="text-muted-foreground/60" style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', marginBottom: 12 }}>AI-bedömning</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span className="text-muted-foreground" style={{ fontSize: 13 }}>Konfidensgrad</span>
                            {removedCurrentSource && addedNewSource ? (
                                <span className="text-accent-strong bg-accent-subtle" style={{ fontSize: 13, fontWeight: 500, padding: '2px 8px', borderRadius: 9999 }}>Hög konfidens</span>
                            ) : (
                                <span className="text-conf-low-fg bg-conf-low-bg" style={{ fontSize: 13, fontWeight: 500, padding: '2px 8px', borderRadius: 9999 }}>Låg konfidens</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="text-muted-foreground" style={{ fontSize: 13 }}>Rekommendation</span>
                            {removedCurrentSource && addedNewSource ? (
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
                        <h3 className="text-muted-foreground/60" style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', marginBottom: 12 }}>Valda Källor (Simulerade)</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {!removedCurrentSource ? (
                                <div className="bg-muted" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 6 }}>
                                    <div>
                                        <div className="text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Årsredovisning 2024</div>
                                        <div className="text-muted-foreground/60" style={{ fontSize: 11, marginTop: 2 }}>Bergström & Co AB</div>
                                    </div>
                                    <button
                                        onClick={() => setRemovedCurrentSource(true)}
                                        className="text-conf-low-fg"
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer', padding: 4
                                        }}
                                        title="Ta bort i simulering"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-muted-foreground/60" style={{ textAlign: 'center', padding: '16px 0', fontSize: 13 }}>
                                    <s>Årsredovisning 2024 (Bergström & Co AB)</s> borttagen.
                                </div>
                            )}

                            {addedNewSource && (
                                <div className="card-enter bg-muted border border-border" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 6 }}>
                                    <div>
                                        <div className="text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Preliminärt bokslut Q3 2024</div>
                                        <div className="text-muted-foreground/60" style={{ fontSize: 11, marginTop: 2 }}>Bergström & Co AB (Interimsrapport)</div>
                                    </div>
                                    <button
                                        onClick={() => setAddedNewSource(false)}
                                        className="text-conf-low-fg"
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer', padding: 4
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}

                            {!addedNewSource && (
                                <button
                                    onClick={() => setAddedNewSource(true)}
                                    className="bg-card border border-dashed border-accent-border text-accent-strong hover:bg-accent-subtle"
                                    style={{
                                        width: '100%',
                                        padding: '10px 0',
                                        borderRadius: 6,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        marginTop: 8
                                    }}
                                >
                                    + Konvertera "Kassaflödesdata Q3" till källa
                                </button>
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
