---
name: component-implementation
description: Rules and workflow for implementing React components in the AI interface design system. Use when building, modifying, or reviewing any component.
---

# Component Implementation – Regler och arbetsflöde

> **Aktiveras när:** En komponent ska byggas, modifieras eller granskas. Läs igenom dessa regler **innan** du skriver en rad kod. Implementera aldrig utan explicit godkännande.

---

## 0. Obligatoriskt arbetsflöde

```
1. Läs design-principles skill
2. Förstå problemet (vad ska komponenten lösa? vilket designkrav täcker det?)
3. Visa förslag inkl. skiss/pseudokod (se design-advisor skill för format)
4. Få explicit godkännande från Maja
5. Implementera
6. Verifiera mot reglerna nedan
```

> **Inget steg får hoppas över.** Om du är osäker på om ett förslag är godkänt – fråga igen.

---

## 1. Komponentidentitet – varje komponent måste ha

- **Syfte:** En mening som kopplar komponenten till ett designkrav (transparens / osäkerhet / HITL / spårbarhet / felhantering / kontroll)
- **ID:** Följa namnkonventionen nedan (T1, U2, H3, S4 etc.)
- **Domänstöd:** Stödja antingen vård (Maya), finans (Sara) eller båda
- **Tillstånd:** Dokumentera vilka states komponenten har (default, disabled, error, etc.)

---

## 2. Namnkonventioner

### Komponent-ID-system

| Prefix | Kategori | Exempel |
|--------|----------|---------|
| T | Transparens | T1–T4 |
| U | Osäkerhet | U1–U4 |
| H | Human-in-the-loop | H1–H4 |
| S | Spårbarhet | S1–S4 |
| F | Felhantering & eskalering | F1–F4 |
| C | Kontroll/constraints | C1–C3 |

### Filnamngivning

```
src/components/
  transparency/
    AIRecommendationCard.jsx        # T1
    SourceProvenancePanel.jsx       # T2
    WhyExplanationDrawer.jsx        # T3
    AssumptionLimitationsBanner.jsx # T4
  uncertainty/
    ConfidenceIndicator.jsx         # U1
    UncertaintyReasonsList.jsx      # U2
    DataQualityInlineTag.jsx        # U3
    NextBestActionChip.jsx          # U4
  human-in-loop/
    DecisionActionBar.jsx           # H1
    ReviewGate.jsx                  # H2
    OverrideFlow.jsx                # H3
    AddContextInput.jsx             # H4
  traceability/
    DecisionLogTimeline.jsx         # S1
    VersionModelInfoBlock.jsx       # S2
    DiffView.jsx                    # S3
    ExportControl.jsx               # S4
  error-handling/
    AIFailureStateCard.jsx          # F1
    ManualModePanel.jsx             # F2
    EscalationCTA.jsx               # F3
    IncidentUnavailableTag.jsx      # F4
  control/
    AIModeSelector.jsx              # C1
    RiskGateRules.jsx               # C2
    PermissionRoleBadge.jsx         # C3
```

### Komponentnamn (PascalCase)

- Använd **beskrivande namn** från designsystemet
- Inga förkortningar (inte `ConfInd` utan `ConfidenceIndicator`)
- Domänvarianter hanteras via `domain`-prop, inte separata filer

---

## 3. Props-struktur

### Generella regler

```jsx
// Alltid: tydliga prop-typer med PropTypes eller JSDoc
// Alltid: domän som prop om komponenten skiljer sig per domän
// Alltid: callback-props för användaråtgärder som loggas

const ComponentName = ({
  domain = 'finance',       // 'finance' | 'healthcare'
  data,                     // domändata från constants.js eller mockdata
  onAction,                 // callback – loggas i audit trail
  isDisabled = false,       // alltid med förklaring om disabled
  disabledReason = '',      // obligatorisk om isDisabled är true
}) => { ... }
```

### Domänvarianter via props (inte separata komponenter)

```jsx
// Rätt – en komponent, domänbeteende via prop
<ConfidenceIndicator
  domain="healthcare"    // kompakt inline-variant
  confidence={72}
  reasons={[...]}
/>

<ConfidenceIndicator
  domain="finance"       // mer detaljerad variant med drill-down
  confidence={61}
  reasons={[...]}
/>

// Fel – separata komponenter per domän
<HealthcareConfidenceIndicator />
<FinanceConfidenceIndicator />
```

**Undantag:** Om domänvarianterna är fundamentalt olika till struktur (t.ex. Triage Compact View vs Case Review View), kan separata komponenter motiveras. Presentera alltid skälet och få godkännande.

---

## 4. Tillgänglighet (ARIA)

### Obligatoriska attribut

```jsx
// Alla interaktiva element
<button
  aria-label="Avslå kreditansökan för Lindqvist Bygg AB"
  aria-disabled={isDisabled}
>

// Status-element (badges, indikatorer)
<span
  role="status"
  aria-live="polite"
  aria-label="Konfidensindikator: 61% – låg"
>

// Dialoger/drawers
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="drawer-title"
>

// Felmeddelanden och förklaringar
<p
  id="disabled-reason"
  aria-live="assertive"
  role="alert"
>

// Koppling disabled-knapp → förklaring
<button
  aria-disabled="true"
  aria-describedby="disabled-reason"
>
```

### Färg är aldrig enda signal

```jsx
// Rätt – ikon + text + färg
<span className="flex items-center gap-1 text-orange-600">
  <AlertTriangle size={12} aria-hidden="true" />
  <span>Inaktuell</span>  {/* text ALLTID med */}
</span>

// Fel – bara färg
<span className="bg-orange-500 w-2 h-2 rounded-full" />
```

### Tangentbordsnavigering

- Alla interaktiva element ska nås med Tab
- Drawers/modaler: fokus-trap vid öppning, återgång vid stängning
- Escape stänger alltid drawers/modaler

---

## 5. Designsystemregler (från design-system skill)

> Se `skills/design-system.md` för fullständiga detaljer. Dessa är de viktigaste:

### Färger
```
Varning/osäkerhet:   orange-500 (#F97316)
Primär/indigo:       indigo-600 (#4F46E5)
Fel/avslag:          red-600 (#DC2626)
OK/aktuell:          emerald-500 (#10B981)
```

### Knappar i Decision Action Bar
```
- Alltid full bredd (w-full)
- Vertikal stack med gap-2
- Primär action överst, destructive i mitten, disabled sist
- Disabled HAR ALLTID förklaring direkt under
```

### Konfidens
```
- Aldrig isolerat block
- Alltid inline nära rekommendationen
- Hög ≥80% → emerald, Medel 70-79% → yellow, Låg <70% → orange
```

---

## 6. Mockdata & state

- All data hämtas från `src/constants.js` (eller motsvarande mockdata-fil)
- **Inga API-anrop** – allt är hårdkodat
- Lokalt UI-state (drawer öppen/stängd, override-modal etc.) hanteras med `useState`
- Global state (beslut, logg) hanteras med Redux Toolkit eller context

---

## 7. Audit trail-krav per komponent

Följande händelser **måste** loggas när de inträffar:

| Händelse | Vad loggas |
|----------|------------|
| Beslut fattat | Typ (godkänn/avslå/begär), tidsstämpel, användaridentitet |
| Override initierad | Kategori, fritext, tidsstämpel, användaridentitet |
| Context tillagd | Snabbval + fritext, tidsstämpel |
| "Varför?" visad | Vilken komponent, tidsstämpel (analytik) |
| Eskalering | Typ, tidsstämpel |
| AI-fel | Typ av fel, tidsstämpel, fallback-åtgärd |

---

## 8. Verifieringschecklista (kör alltid efter implementation)

```
[ ] Komponenten har ett tydligt syfte kopplat till ett designkrav
[ ] Komponent-ID och filnamn följer konventionen
[ ] Props är dokumenterade inkl. domän-prop
[ ] ARIA-attribut är korrekt implementerade
[ ] Färg används aldrig som enda signal
[ ] Disabled-states har alltid förklaring
[ ] Audit trail-loggar relevant händelse
[ ] Fungerar i desktop-first (min-width 1280px)
[ ] Domänvarianter hanteras via props (eller motiverat undantag)
[ ] Inga API-anrop – allt mockdata
```

---

## 9. Komponentlistan är förslag, inte hugget i sten

> Listan på komponenter i designkraven är ett **utgångsläge**. Om du ser ett bättre sätt att lösa ett designproblem – exempelvis att kombinera två komponenter, ersätta med ett mer effektivt mönster, eller dela upp en komponent – **ska du föreslå det**.

> Formulera förslaget enligt `design-advisor` skill. Implementera aldrig utan godkännande.
