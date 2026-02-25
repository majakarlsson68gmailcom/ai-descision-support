import { X, FileText, CheckCircle, ArrowRight, Plus } from 'lucide-react'

export default function SourceDrawer({
    isOpen,
    onClose,
    onSimulate,
}) {
    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(17, 24, 39, 0.2)',
                    zIndex: 40,
                }}
            />

            {/* Drawer */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '35%',
                    minWidth: 400,
                    backgroundColor: 'var(--c-white)',
                    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideInRight 0.3s ease-out forwards',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--c-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--c-ink)' }}>
                        Källor — Räntetäckningsgrad
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--c-ink-4)', padding: 4, borderRadius: 4,
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--c-bg)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>

                    {/* Active Source */}
                    <div style={{
                        border: '1px solid var(--c-border)',
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 16,
                        background: 'var(--c-bg)'
                    }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 6,
                                background: 'var(--c-indigo-light)', color: 'var(--c-indigo)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <FileText size={16} />
                            </div>

                            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-ink)', marginBottom: 4 }}>
                                        Årsredovisning 2024 — Bergström & Co AB
                                    </h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--c-ink-4)' }}>
                                        <span>Hämtad 12 jan 2025</span>
                                        <span>·</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--c-ink-2)' }}>
                                            <CheckCircle size={10} style={{ color: 'var(--c-green)' }} />
                                            Tillförlitlighet: Hög
                                        </span>
                                    </div>
                                </div>

                                <button
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: 12,
                                        fontWeight: 500,
                                        color: 'var(--c-ink-3)',
                                        background: 'var(--c-white)',
                                        border: '1px solid var(--c-border-strong)',
                                        borderRadius: 6,
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--c-bg)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'var(--c-white)'}
                                >
                                    Ersätt källa
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Add secondary source link */}
                    <button
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            fontSize: 13, fontWeight: 500, color: 'var(--c-indigo)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '6px 0'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--c-indigo-mid)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--c-indigo)'}
                    >
                        <Plus size={14} />
                        Lägg till alternativ källa
                    </button>
                </div>

                {/* Footer Area */}
                <div style={{
                    padding: 24,
                    borderTop: '1px solid var(--c-border)',
                    background: 'var(--c-bg)'
                }}>
                    <button
                        onClick={onSimulate}
                        style={{
                            width: '100%',
                            padding: '10px 0',
                            fontSize: 13,
                            fontWeight: 500,
                            color: 'var(--c-ink-2)',
                            background: 'var(--c-white)',
                            border: '1px solid var(--c-border-strong)',
                            borderRadius: 6,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--c-indigo)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-border-strong)'}
                    >
                        Simulera med andra källor <ArrowRight size={14} />
                    </button>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
        </>
    )
}
