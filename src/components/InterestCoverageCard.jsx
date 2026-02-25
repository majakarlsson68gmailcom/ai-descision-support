import { useState } from 'react'
import { Info, ArrowRight } from 'lucide-react'

function Pill({ children, color = 'indigo', pulse = false }) {
    const styles = {
        indigo: { bg: 'var(--c-indigo-light)', text: 'var(--c-indigo)', border: 'var(--c-indigo-border)' },
        orange: { bg: 'var(--c-orange-light)', text: 'var(--c-orange-text)', border: 'var(--c-orange-border)' },
        red: { bg: 'var(--c-red-light)', text: 'var(--c-red)', border: 'var(--c-red-border)' },
        green: { bg: 'var(--c-green-light)', text: 'var(--c-green)', border: 'var(--c-green-border)' },
    }
    const s = styles[color]
    return (
        <span
            className="inline-flex items-center gap-1.5 font-medium"
            style={{
                fontSize: 11,
                padding: '2px 9px',
                borderRadius: 9999,
                background: s.bg,
                color: s.text,
                border: `1px solid ${s.border}`,
            }}
        >
            {pulse && (
                <span
                    className="pulse-dot flex-shrink-0"
                    style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: color === 'orange' ? 'var(--c-orange)' : 'var(--c-indigo)',
                    }}
                />
            )}
            {children}
        </span>
    )
}

export default function InterestCoverageCard({
    value = 0.8,
    requirement = 1.2,
    impactPct = 45,
    onOpenSources = () => { },
    delay = 0,
}) {
    const isCritical = value < requirement
    const delta = (value - requirement).toFixed(1).replace('.', ',')
    const formattedValue = value.toFixed(1).replace('.', ',')
    const formattedReq = requirement.toFixed(1).replace('.', ',')

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
                        Räntetäckningsgrad
                    </h3>
                    <div className="group relative" style={{ display: 'flex', cursor: 'help' }}>
                        <Info size={14} style={{ color: 'var(--c-ink-4)' }} />
                        {/* Tooltip */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block"
                            style={{
                                width: 220,
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
                            Bankens lägsta accepterade nivå är {formattedReq}. Under 1,0 täcker rörelseresultatet inte räntekostnaderna.
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
                            background: '#EEF2FF', // var(--c-indigo-light) equivalent
                            color: '#4338CA', // var(--c-indigo) equivalent
                            border: '1px solid #C7D2FE',
                        }}
                    >
                        ✦ AI-analys
                    </span>
                </div>
            </div>

            {/* Zon 2: Värde och status */}
            <div style={{ padding: '0 16px 16px' }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--c-ink)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 8 }}>
                    {formattedValue}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {isCritical ? (
                        <Pill color="red">↓ Under kritisk gräns</Pill>
                    ) : (
                        <Pill color="green">✓ Godkänd nivå</Pill>
                    )}
                    <span style={{ fontSize: 11, color: 'var(--c-ink-4)' }}>
                        Krav: {formattedReq} · Delta: {delta > 0 ? '+' : ''}{delta}
                    </span>
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
                                background: i <= 2 ? 'var(--c-indigo)' : 'var(--c-border-strong)'
                            }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Källa rad */}
            <div style={{
                borderTop: '1px solid var(--c-border)',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 6
            }}>
                <span style={{ fontSize: 11, color: 'var(--c-ink-4)' }}>📄 Årsredovisning 2024</span>
                <Pill color="green">✓ Aktuell</Pill>
            </div>

            {/* Zon 4: Åtgärdsknappar */}
            <div style={{ borderTop: '1px solid var(--c-border)', padding: '12px 16px', display: 'flex', gap: 8 }}>
                <button
                    style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--c-ink-2)',
                        background: 'var(--c-white)',
                        border: '1px solid var(--c-border-strong)',
                        borderRadius: 6,
                        cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--c-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--c-white)'}
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
                        background: 'var(--c-indigo)',
                        border: '1px solid var(--c-indigo)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--c-indigo-mid)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--c-indigo)'}
                >
                    Visa källor <ArrowRight size={14} />
                </button>
            </div>

        </div>
    )
}
