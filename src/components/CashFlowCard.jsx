import { useState } from 'react'
import { Info, ArrowRight, AlertTriangle, FileText, CheckCircle } from 'lucide-react'

// Specialiserad dämpad pill för detta osäkerhetskort
function MutedPill({ children, color = 'orange', icon: Icon = AlertTriangle }) {
    const bg = color === 'orange' ? '#FFF7ED' : '#F3F4F6'
    const text = color === 'orange' ? '#C2410C' : '#4B5563'
    const border = color === 'orange' ? '#FFEDD5' : '#E5E7EB'
    return (
        <span
            className="inline-flex items-center gap-1.5 font-medium"
            style={{
                fontSize: 11,
                padding: '2px 9px',
                borderRadius: 9999,
                background: bg,
                color: text,
                border: `1px solid ${border}`,
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
            className="card-enter"
            style={{
                background: 'var(--c-white)',
                border: '1px solid var(--c-border)',
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
                    <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--c-ink-2)', margin: 0, letterSpacing: '0.02em' }}>
                        Kassaflöde (rörelseresultat)
                    </h3>
                    <div className="group relative" style={{ display: 'flex', cursor: 'help' }}>
                        <Info size={14} style={{ color: 'var(--c-ink-4)' }} />
                        {/* Tooltip */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block"
                            style={{
                                width: 240,
                                background: 'var(--c-ink)',
                                color: 'white',
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
                                    borderTop: '5px solid var(--c-ink)',
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 500,
                            padding: '2px 8px',
                            borderRadius: 9999,
                            background: '#EEF2FF',
                            color: '#4338CA',
                            border: '1px solid #C7D2FE',
                        }}
                    >
                        ✦ AI-analys
                    </span>
                </div>
            </div>

            {/* Zon 2: Värde och status */}
            <div style={{ padding: '0 16px 16px' }}>
                <div style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: 'var(--c-ink)',
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
                    <span style={{ fontSize: 11, color: 'var(--c-ink-4)' }}>Vikt i beslut</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {[1, 2, 3].map(i => (
                            <span key={i} style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: i <= 3 ? 'var(--c-indigo)' : 'var(--c-border-strong)'
                            }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Zon 3b: Källrad med varningar */}
            <div style={{
                background: isSourceCurrent ? 'transparent' : '#FFFBEB',
                borderTop: `1px solid ${isSourceCurrent ? 'var(--c-border)' : '#FEF3C7'}`,
                padding: '12px 16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: isSourceCurrent ? 0 : 4 }}>
                    <FileText size={12} style={{ color: 'var(--c-ink-3)' }} />
                    <span style={{ fontSize: 12, color: 'var(--c-ink-2)' }}>{sourceName}</span>
                    {isSourceCurrent ? (
                        <span
                            style={{
                                fontSize: 10,
                                fontWeight: 500,
                                padding: '2px 6px',
                                borderRadius: 9999,
                                background: 'var(--c-green-light)',
                                color: 'var(--c-green)',
                                border: '1px solid var(--c-green-border)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3
                            }}
                        >
                            <CheckCircle size={10} /> Aktuell
                        </span>
                    ) : (
                        <span
                            style={{
                                fontSize: 10,
                                fontWeight: 500,
                                padding: '2px 6px',
                                borderRadius: 9999,
                                background: '#FFF7ED',
                                color: '#C2410C',
                                border: '1px solid #FFEDD5',
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
                    <div style={{ fontSize: 11, color: 'var(--c-orange-text)', marginLeft: 18 }}>
                        Bankens policy: max 12 månader. Uppdaterad data behövs.
                    </div>
                )}
            </div>

            {/* Zon 4: Åtgärdsknappar */}
            <div style={{ borderTop: '1px solid var(--c-border)', padding: '12px 16px', display: 'flex', gap: 8 }}>
                <button
                    style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--c-ink-3)',
                        background: 'var(--c-white)',
                        border: '1px solid var(--c-border)',
                        borderRadius: 6,
                        opacity: 0.7, // Dämpad beräkningsknapp
                        cursor: 'not-allowed',
                    }}
                >
                    Visa beräkning
                </button>
                <button
                    onClick={onOpenSources}
                    style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'white',
                        background: 'var(--c-orange)',
                        border: '1px solid var(--c-orange-border)',
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
