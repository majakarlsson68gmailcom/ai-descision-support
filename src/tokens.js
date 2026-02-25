// Design tokens – mappade från Figma Foundations + Semantic
// Figma-fil: AI-gränssnitt · Foundations.json + Semantic.json
// Princip: orange = varning/agera, aldrig rött för osäkerhet

// ---------------------------------------------------------------------------
// Konfidens (ai/confidence/*)
// Alt A: low = stark orange (ej rött), i linje med CLAUDE.md
// ---------------------------------------------------------------------------
export const confidence = {
  high: {
    bg:     "bg-green-50",
    border: "border-green-100",
    text:   "text-green-700",
    dot:    "bg-green-500",
    label:  "Hög konfidens",
  },
  medium: {
    bg:     "bg-orange-50",
    border: "border-orange-100",
    text:   "text-orange-700",
    dot:    "bg-orange-500",
    label:  "Medel konfidens",
  },
  low: {
    // Rött – reserverat för låg konfidensgrad (ej för datakvalitetsstatus)
    bg:     "bg-red-50",
    border: "border-red-100",
    text:   "text-red-700",
    dot:    "bg-red-500",
    label:  "Låg konfidens",
  },
};

// ---------------------------------------------------------------------------
// Datakvalitet (U3 Data Quality Tag)
// ---------------------------------------------------------------------------
export const dataQuality = {
  ok:      { bg: "bg-grey-50",   text: "text-grey-600",   border: "border-grey-100"   }, // Neutral – källa aktuell och giltig
  stale:   { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100" }, // Inaktuell
  missing: { bg: "bg-grey-50",   text: "text-grey-400",   border: "border-grey-100"   }, // Saknas – blekare än ok
  conflict:{ bg: "bg-red-50",    text: "text-red-700",    border: "border-red-100"    }, // Konflikt
};

// ---------------------------------------------------------------------------
// Status (generella statusfärger)
// ---------------------------------------------------------------------------
export const status = {
  success: { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-100",  dot: "bg-green-500"  },
  warning: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100", dot: "bg-orange-500" },
  error:   { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-100",    dot: "bg-red-500"    },
  info:    { bg: "bg-blue-50",   text: "text-blue-800",   border: "border-blue-100",   dot: "bg-blue-500"   },
  neutral: { bg: "bg-grey-50",   text: "text-grey-700",   border: "border-grey-100",   dot: "bg-grey-400"   },
};

// ---------------------------------------------------------------------------
// Ytor (surface/*)
// ---------------------------------------------------------------------------
export const surface = {
  raised:  "bg-white",        // Kort, paneler
  default: "bg-grey-50",      // Sidans bakgrund
  sunken:  "bg-grey-100",     // Indragna sektioner, tabeller
};

// ---------------------------------------------------------------------------
// Override-flöde (ai/override/*)
// ---------------------------------------------------------------------------
export const override = {
  bg:     "bg-purple-50",
  border: "border-purple-500",
  text:   "text-purple-700",
};

// ---------------------------------------------------------------------------
// Audit-vy (audit/*)
// ---------------------------------------------------------------------------
export const audit = {
  bg:     "bg-yellow-100",
  border: "border-yellow-400",
  text:   "text-yellow-800",
};

// ---------------------------------------------------------------------------
// Interaktiva element (interactive/*)
// ---------------------------------------------------------------------------
export const interactive = {
  primary: {
    default:  "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
    disabled: "bg-grey-300 text-white cursor-not-allowed",
  },
  danger: {
    default: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
  },
  ghost: {
    default: "bg-transparent border border-grey-300 text-grey-700 hover:bg-grey-50",
  },
};

// ---------------------------------------------------------------------------
// Text (text/*)
// ---------------------------------------------------------------------------
export const text = {
  primary:   "text-grey-900",
  secondary:  "text-grey-700",
  subtle:    "text-grey-600",
  disabled:  "text-grey-400",
  inverse:   "text-grey-25",
};

// ---------------------------------------------------------------------------
// Borders (border/*)
// ---------------------------------------------------------------------------
export const border = {
  default: "border-grey-200",
  strong:  "border-grey-400",
  subtle:  "border-grey-100",
  focus:   "border-blue-500",
};

// ---------------------------------------------------------------------------
// Bakåtkompatibilitet – behåller export 'colors' och 'statusLabels'
// ---------------------------------------------------------------------------
export const colors = {
  high:     confidence.high,
  medium:   confidence.medium,
  low:      confidence.low,
  ok:       dataQuality.ok,
  stale:    dataQuality.stale,
  missing:  dataQuality.missing,
  conflict: dataQuality.conflict,
};

export const statusLabels = {
  ok:       "Aktuell",
  stale:    "Inaktuell",
  missing:  "Saknas",
  conflict: "Konflikt",
};
