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
                className="bg-gray-900/20"
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 40,
                }}
            />

            {/* Drawer */}
            <div
                className="bg-card"
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '35%',
                    minWidth: 400,
                    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideInRight 0.3s ease-out forwards',
                }}
            >
                {/* Header */}
                <div
                    className="border-b border-border"
                    style={{
                        padding: '20px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                    <h2 className="text-foreground" style={{ fontSize: 16, fontWeight: 600 }}>
                        Källor — Räntetäckningsgrad
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:bg-muted"
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: 4, borderRadius: 4,
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>

                    {/* Active Source */}
                    <div
                        className="border border-border bg-muted"
                        style={{
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 16,
                        }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div
                                className="bg-accent-subtle text-accent-strong"
                                style={{
                                    width: 32, height: 32, borderRadius: 6,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                <FileText size={16} />
                            </div>

                            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 className="text-foreground" style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                                        Årsredovisning 2024 — Bergström & Co AB
                                    </h4>
                                    <div className="text-muted-foreground/60" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                                        <span>Hämtad 12 jan 2025</span>
                                        <span>·</span>
                                        <span className="text-muted-foreground" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <CheckCircle size={10} className="text-conf-high-fg" />
                                            Tillförlitlighet: Hög
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="text-muted-foreground bg-card border border-border hover:bg-muted"
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: 12,
                                        fontWeight: 500,
                                        borderRadius: 6,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Ersätt källa
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Add secondary source link */}
                    <button
                        className="text-accent-strong hover:opacity-80"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            fontSize: 13, fontWeight: 500,
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '6px 0'
                        }}
                    >
                        <Plus size={14} />
                        Lägg till alternativ källa
                    </button>
                </div>

                {/* Footer Area */}
                <div
                    className="border-t border-border bg-muted"
                    style={{
                        padding: 24,
                    }}>
                    <button
                        onClick={onSimulate}
                        className="text-muted-foreground bg-card border border-border hover:border-accent-strong"
                        style={{
                            width: '100%',
                            padding: '10px 0',
                            fontSize: 13,
                            fontWeight: 500,
                            borderRadius: 6,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                        }}
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
