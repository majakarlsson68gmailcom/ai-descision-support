import React, { useState } from 'react'

export default function DecisionActionBar({ approveDisabled, approveDisabledReason }) {
  const [rejected, setRejected] = useState(false)
  const [requested, setRequested] = useState(false)

  if (rejected) {
    return (
      <div className="rounded-lg border border-conf-low-border bg-conf-low-surface p-4 flex items-center gap-3">
        <span className="text-conf-low-fg text-lg">✕</span>
        <p className="text-sm font-medium text-conf-low-fg">Ansökan avslagen. Åtgärden loggad.</p>
      </div>
    )
  }

  if (requested) {
    return (
      <div className="rounded-lg border border-accent-border bg-accent-surface p-4 flex items-center gap-3">
        <span className="text-accent-strong text-lg">↺</span>
        <p className="text-sm font-medium text-accent-strong">Komplettering begärd. Ärendet pausat.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        Ditt beslut
      </p>
      <div className="flex flex-wrap gap-3">
        {/* Approve – disabled */}
        <div className="flex flex-col gap-1">
          <button
            disabled
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-muted text-muted-foreground border border-border cursor-not-allowed"
            aria-disabled="true"
          >
            <span>✓</span> Godkänn
          </button>
          {approveDisabled && (
            <p className="text-xs text-dq-stale-fg max-w-[220px] leading-snug" role="note">
              ⚠ {approveDisabledReason}
            </p>
          )}
        </div>

        {/* Reject */}
        <button
          onClick={() => setRejected(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive/60"
        >
          <span>✕</span> Avslå
        </button>

        {/* Request supplement */}
        <button
          onClick={() => setRequested(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-card text-foreground border border-border hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <span>↺</span> Begär komplettering
        </button>
      </div>
    </div>
  )
}
