import { useState } from 'react'
import { Info, ArrowRight } from 'lucide-react'

function Pill({ children, color = 'indigo', pulse = false }) {
    const styles = {
        indigo: { bg: 'hsl(var(--accent-subtle))', text: 'hsl(var(--accent-strong))', border: 'hsl(var(--accent-border))' },
        orange: { bg: 'hsl(var(--dq-stale-bg))', text: 'hsl(var(--dq-stale-fg))', border: 'hsl(var(--dq-stale-border))' },
        red: { bg: 'hsl(var(--conf-low-bg))', text: 'hsl(var(--conf-low-fg))', border: 'hsl(var(--conf-low-border))' },
        green: { bg: 'hsl(var(--conf-high-bg))', text: 'hsl(var(--conf-high-fg))', border: 'hsl(var(--conf-high-border))' },
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
                        background: color === 'orange' ? 'hsl(var(--dq-stale-solid))' : 'hsl(var(--accent-strong))',
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
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
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
                    <h3 style={{ fontSize: 12, fontWeight: 500, color: 'hsl(var(--muted-foreground))', margin: 0, letterSpacing: '0.02em' }}>
                        Räntetäckningsgrad
                    </h3>
                    <div className="group relative" style={{ display: 'flex', cursor: 'help' }}>
                        <Info size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
                        {/* Tooltip */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block"
                            style={{
                                width: 220,
                                background: 'hsl(var(--foreground))',
                                color: 'hsl(var(--card))',
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
                                    borderTop: '5px solid hsl(var(--foreground))',
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
                            background: 'hsl(var(--accent-subtle))',
                            color: 'hsl(var(--accent-strong))',
                            border: '1px solid hsl(var(--accent-border))',
                        }}
                    >
                        ✦ AI-analys
                    </span>
                </div>
            </div>

            {/* Zon 2: Värde och status */}
            <div style={{ padding: '0 16px 16px' }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: 'hsl(var(--foreground))', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 8 }}>
                    {formattedValue}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {isCritical ? (
                        <Pill color="red">↓ Under kritisk gräns</Pill>
                    ) : (
                        <Pill color="green">✓ Godkänd nivå</Pill>
                    )}
                    <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>
                        Krav: {formattedReq} · Delta: {delta > 0 ? '+' : ''}{delta}
                    </span>
                </div>
            </div>

            {/* Zon 3: Påverkanindikator */}
            <div style={{ padding: '0 16px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>Vikt i beslut</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {[1, 2, 3].map(i => (
                            <span key={i} style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: i <= 2 ? 'hsl(var(--accent-strong))' : 'hsl(var(--border))'
                            }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Källa rad */}
            <div style={{
                borderTop: '1px solid hsl(var(--border))',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 6
            }}>
                <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>📄 Årsredovisning 2024</span>
                <Pill color="green">✓ Aktuell</Pill>
            </div>

            {/* Zon 4: Åtgärdsknappar */}
            <div style={{ borderTop: '1px solid hsl(var(--border))', padding: '12px 16px', display: 'flex', gap: 8 }}>
                <button
                    style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'hsl(var(--foreground))',
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 6,
                        cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'hsl(var(--muted))'}
                    onMouseLeave={e => e.currentTarget.style.background = 'hsl(var(--card))'}
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
                        color: 'hsl(var(--primary-foreground))',
                        background: 'hsl(var(--primary))',
                        border: '1px solid hsl(var(--primary))',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'hsl(var(--primary) / 0.9)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'hsl(var(--primary))'}
                >
                    Visa källor <ArrowRight size={14} />
                </button>
            </div>

        </div>
    )
}
