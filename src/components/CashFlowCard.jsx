import { useState } from 'react'
import { Info, ArrowRight, AlertTriangle, FileText, CheckCircle } from 'lucide-react'

// Specialiserad dämpad pill för detta osäkerhetskort
function MutedPill({ children, color = 'orange', icon: Icon = AlertTriangle }) {
    const cls = color === 'orange'
        ? 'bg-dq-stale-bg text-dq-stale-fg border-dq-stale-border'
        : 'bg-muted text-muted-foreground border-border'
    return (
        <span
            className={`inline-flex items-center gap-1.5 font-medium rounded-sm border ${cls}`}
            style={{
                fontSize: 11,
                padding: '2px 9px',
            }}
        >
            <Icon size={10} style={{ flexShrink: 0 }} />
            {children}
        </span>
    )
}

export default function CashFlowCard({
    value = -240000,
    impactPct = 20,
    sourceName = "Årsredovisning 2022",
    isValueVerified = false,
    isSourceCurrent = false,
    onOpenSources = () => { },
    delay = 0,
}) {
    const formattedValue = value ? value.toLocaleString('sv-SE') : '-'

    return (
        <div
            className="card-enter bg-card border border-border"
            style={{
                borderRadius: 8,
                animationDelay: `${delay}ms`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Zon 1: Rubrik & Badges */}
            <div style={{ padding: '16px 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <h3 className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500, margin: 0, letterSpacing: '0.02em' }}>
                        Kassaflöde (rörelseresultat)
                    </h3>
                    <div className="group relative" style={{ display: 'flex', cursor: 'help' }}>
                        <Info size={14} className="text-muted-foreground/60" />
                        {/* Tooltip */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-foreground text-background"
                            style={{
                                width: 240,
                                fontSize: 11,
                                padding: '8px 10px',
                                borderRadius: 6,
                                lineHeight: 1.4,
                                zIndex: 10,
                                whiteSpace: 'normal',
                                textAlign: 'center',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            }}
                        >
                            Operativt kassaflöde används för att bedöma om bolaget genererar tillräckligt med likviditet för att täcka lånekostnaden. Bankens riktlinje kräver underlag som är max 12 månader gammalt.
                            <div
                                className="absolute left-1/2 -translate-x-1/2 top-full"
                                style={{
                                    borderLeft: '5px solid transparent',
                                    borderRight: '5px solid transparent',
                                    borderTop: '5px solid hsl(var(--foreground))',
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <span
                        className="bg-accent-subtle text-accent-strong border border-accent-border rounded-sm"
                        style={{
                            fontSize: 11,
                            fontWeight: 500,
                            padding: '2px 8px',
                        }}
                    >
                        ✦ AI-analys
                    </span>
                </div>
            </div>

            {/* Zon 2: Värde och status */}
            <div style={{ padding: '0 16px 16px' }}>
                <div className="text-foreground" style={{
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    marginBottom: 8,
                    opacity: isValueVerified ? 1 : 0.4
                }}>
                    {(value > 0 ? '+' : '')}{formattedValue} kr
                </div>
                <div>
                    {isValueVerified ? (
                        <MutedPill color="gray" icon={CheckCircle}>Neutral OK</MutedPill>
                    ) : (
                        <MutedPill color="orange" icon={AlertTriangle}>Kan inte verifieras</MutedPill>
                    )}
                </div>
            </div>


            {/* Zon 3: Påverkanindikator */}
            <div style={{ padding: '0 16px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-muted-foreground/60" style={{ fontSize: 11 }}>Vikt i beslut</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {[1, 2, 3].map(i => (
                            <span key={i} className={i <= 3 ? 'bg-accent-strong' : 'bg-border'} style={{
                                width: 6, height: 6, borderRadius: '50%',
                            }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Zon 3b: Källrad med varningar */}
            <div
                className={isSourceCurrent ? 'border-t border-border' : 'bg-dq-stale-bg border-t border-dq-stale-border'}
                style={{
                    padding: '12px 16px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: isSourceCurrent ? 0 : 4 }}>
                    <FileText size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>{sourceName}</span>
                    {isSourceCurrent ? (
                        <span
                            className="bg-conf-high-bg text-conf-high-fg border border-conf-high-border rounded-sm"
                            style={{
                                fontSize: 10,
                                fontWeight: 500,
                                padding: '2px 6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3
                            }}
                        >
                            <CheckCircle size={10} /> Aktuell
                        </span>
                    ) : (
                        <span
                            className="bg-dq-stale-bg text-dq-stale-fg border border-dq-stale-border rounded-sm"
                            style={{
                                fontSize: 10,
                                fontWeight: 500,
                                padding: '2px 6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3
                            }}
                        >
                            <AlertTriangle size={10} /> 18 mån gammal
                        </span>
                    )}
                </div>
                {!isSourceCurrent && (
                    <div className="text-dq-stale-fg" style={{ fontSize: 11, marginLeft: 18 }}>
                        Bankens policy: max 12 månader. Uppdaterad data behövs.
                    </div>
                )}
            </div>

            {/* Zon 4: Åtgärdsknappar */}
            <div className="border-t border-border" style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                <button
                    className="bg-card text-muted-foreground border border-border"
                    style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 13,
                        fontWeight: 500,
                        borderRadius: 6,
                        opacity: 0.7, // Dämpad beräkningsknapp
                        cursor: 'not-allowed',
                    }}
                >
                    Visa beräkning
                </button>
                <button
                    onClick={onOpenSources}
                    className="bg-dq-stale-solid text-background border border-dq-stale-border"
                    style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 13,
                        fontWeight: 500,
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    Visa källor <ArrowRight size={14} />
                </button>
            </div>

        </div>
    )
}
