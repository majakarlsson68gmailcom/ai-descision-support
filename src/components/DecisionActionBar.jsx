import React, { useState } from 'react'

export default function DecisionActionBar({ approveDisabled, approveDisabledReason }) {
  const [rejected, setRejected] = useState(false)
  const [requested, setRequested] = useState(false)

  if (rejected) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-center gap-3">
        <span className="text-red-500 text-lg">✕</span>
        <p className="text-sm font-medium text-red-700">Ansökan avslagen. Åtgärden loggad.</p>
      </div>
    )
  }

  if (requested) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-center gap-3">
        <span className="text-blue-500 text-lg">↺</span>
        <p className="text-sm font-medium text-blue-700">Komplettering begärd. Ärendet pausat.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Ditt beslut
      </p>
      <div className="flex flex-wrap gap-3">
        {/* Approve – disabled */}
        <div className="flex flex-col gap-1">
          <button
            disabled
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
            aria-disabled="true"
          >
            <span>✓</span> Godkänn
          </button>
          {approveDisabled && (
            <p className="text-xs text-orange-600 max-w-[220px] leading-snug" role="note">
              ⚠ {approveDisabledReason}
            </p>
          )}
        </div>

        {/* Reject */}
        <button
          onClick={() => setRejected(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <span>✕</span> Avslå
        </button>

        {/* Request supplement */}
        <button
          onClick={() => setRequested(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <span>↺</span> Begär komplettering
        </button>
      </div>
    </div>
  )
}
