// Design tokens – tema-reaktiva (ljust/mörkt via CSS-variabler i index.css)
// Klassnamnen mappar mot semantiska + domän-färger i tailwind.config.js.
// Princip: orange = varning/agera, rött ENDAST för låg konfidens / konflikt.
// OBS: export-formerna hålls oförändrade så befintliga konsumenter inte bryts.

// ---------------------------------------------------------------------------
// Konfidens (ai/confidence/*)
// ---------------------------------------------------------------------------
export const confidence = {
  high: {
    bg:     "bg-conf-high-bg",
    border: "border-conf-high-border",
    text:   "text-conf-high-fg",
    dot:    "bg-conf-high-solid",
    label:  "Hög konfidens",
  },
  medium: {
    bg:     "bg-conf-medium-bg",
    border: "border-conf-medium-border",
    text:   "text-conf-medium-fg",
    dot:    "bg-conf-medium-solid",
    label:  "Medel konfidens",
  },
  low: {
    // Rött – reserverat för låg konfidensgrad (ej för datakvalitetsstatus)
    bg:     "bg-conf-low-bg",
    border: "border-conf-low-border",
    text:   "text-conf-low-fg",
    dot:    "bg-conf-low-solid",
    label:  "Låg konfidens",
  },
};

// ---------------------------------------------------------------------------
// Datakvalitet (U3 Data Quality Tag)
// ---------------------------------------------------------------------------
export const dataQuality = {
  ok:      { bg: "bg-dq-ok-bg",       text: "text-dq-ok-fg",       border: "border-dq-ok-border",       dot: "bg-dq-ok-solid"       }, // Aktuell
  stale:   { bg: "bg-dq-stale-bg",    text: "text-dq-stale-fg",    border: "border-dq-stale-border",    dot: "bg-dq-stale-solid"    }, // Inaktuell (orange)
  missing: { bg: "bg-dq-missing-bg",  text: "text-dq-missing-fg",  border: "border-dq-missing-border",  dot: "bg-dq-missing-solid"  }, // Saknas (blekare)
  conflict:{ bg: "bg-dq-conflict-bg", text: "text-dq-conflict-fg", border: "border-dq-conflict-border", dot: "bg-dq-conflict-solid" }, // Konflikt (röd)
};

// ---------------------------------------------------------------------------
// Status (generella statusfärger)
// ---------------------------------------------------------------------------
export const status = {
  success: { bg: "bg-conf-high-bg",   text: "text-conf-high-fg",   border: "border-conf-high-border",   dot: "bg-conf-high-solid"   },
  warning: { bg: "bg-dq-stale-bg",    text: "text-dq-stale-fg",    border: "border-dq-stale-border",    dot: "bg-dq-stale-solid"    },
  error:   { bg: "bg-conf-low-bg",    text: "text-conf-low-fg",    border: "border-conf-low-border",    dot: "bg-conf-low-solid"    },
  info:    { bg: "bg-accent-subtle",  text: "text-accent-strong",  border: "border-accent-border",      dot: "bg-accent-strong"     },
  neutral: { bg: "bg-dq-ok-bg",       text: "text-dq-ok-fg",       border: "border-dq-ok-border",       dot: "bg-dq-ok-solid"       },
};

// ---------------------------------------------------------------------------
// Ytor (surface/*)
// ---------------------------------------------------------------------------
export const surface = {
  raised:  "bg-card",          // Kort, paneler
  default: "bg-background",     // Sidans bakgrund
  sunken:  "bg-muted",         // Indragna sektioner, tabeller
};

// ---------------------------------------------------------------------------
// Override-flöde (ai/override/*) – steg 2, legacy-palett tills vidare
// ---------------------------------------------------------------------------
export const override = {
  bg:     "bg-purple-50",
  border: "border-purple-500",
  text:   "text-purple-700",
};

// ---------------------------------------------------------------------------
// Audit-vy (audit/*) – steg 2, legacy-palett tills vidare
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
    default:  "bg-primary text-primary-foreground hover:bg-primary/90",
    disabled: "bg-muted text-muted-foreground cursor-not-allowed",
  },
  danger: {
    default: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  ghost: {
    default: "bg-background border border-input text-foreground hover:bg-accent hover:text-accent-foreground",
  },
};

// ---------------------------------------------------------------------------
// Text (text/*)
// ---------------------------------------------------------------------------
export const text = {
  primary:   "text-foreground",
  secondary: "text-foreground/80",
  subtle:    "text-muted-foreground",
  disabled:  "text-muted-foreground/60",
  inverse:   "text-background",
};

// ---------------------------------------------------------------------------
// Borders (border/*)
// ---------------------------------------------------------------------------
export const border = {
  default: "border-border",
  strong:  "border-border",
  subtle:  "border-border",
  focus:   "border-ring",
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
