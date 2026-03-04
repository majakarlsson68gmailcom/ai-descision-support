---
name: component-implementation
description: Rules and workflow for implementing React components in the AI interface design system. Use when building, modifying, or reviewing any component.
---

# Component Implementation – Regler och arbetsflöde

> **Aktiveras när:** En komponent ska byggas, modifieras eller granskas. Läs igenom dessa regler **innan** du skriver en rad kod. Implementera aldrig utan explicit godkännande.

---

## Komponentbibliotek (16 komponenter)

### Transparens
| ID | Komponent | Syfte |
|----|-----------|-------|
| T1 | AI Recommendation Card | Visa AI-förslag tydligt som förslag (inte sanning). Label "AI-förslag" alltid synlig. |
| T2 | Source/Provenance Panel | Visa källa + datum per datapunkt. Flagga inaktuell/saknas. |
| T3 | Why/Explanation Drawer | 3-sek-sammanfattning (Top 3 faktorer). Mer detaljer vid behov. |
| T4 | Assumption & Limitations Banner | Visas när underlag saknas/konflikt. Beskriver vad som saknas + nästa steg. |

### Osäkerhet
| ID | Komponent | Syfte |
|----|-----------|-------|
| U1 | Confidence Indicator | Nivåer hög/medel/låg + tooltip "varför". Aldrig ensam utan kontext. |
| U2 | Uncertainty Reasons List | Max 3 orsaker i huvudvy, resten i drawer. |
| U3 | Data Quality Inline Tag | Status: ok / osäker / saknas / inaktuell / konflikt – direkt på datapunkten. |
| U4 | Next Best Action Chip | Vid låg/medel konfidens: 1–2 föreslagna åtgärder (kontrollera, begär, eskalera). |

### Human-in-the-loop
| ID | Komponent | Syfte |
|----|-----------|-------|
| H1 | Decision Action Bar | Godkänn/Avslå/Begär komplettering. Alltid synlig. Kan vara disabled + förklaring. |
| H2 | Review Gate | Bekräftelsesteg innan slutbeslut. Max 1 steg i tidspresskläge. |
| H3 | Override Flow | Avvika från AI: obligatorisk kategori + valfri fritext. Ska inte kännas som "försvara sig". |
| H4 | Add Context Input | Snabbval (chips) + kort text. Lägga till domänsignal AI saknar. Loggas. |

### Spårbarhet
| ID | Komponent | Syfte |
|----|-----------|-------|
| S1 | Decision Log Timeline | Händelsekedja: input → AI-analys → beslut → motivering. Tidsstämplar + användaridentitet. |
| S2 | Version & Model Info Block | Vilken modell/version/dataset användes. Alltid i audit-vy. |
| S3 | Diff View | Skillnad mellan AI-förslag och slutbeslut. Visas efter beslut eller i audit-vy. |
| S4 | Export Control | Exportera logg (PDF/CSV). Skrivskyddat läge. Inkluderar ID + datum + version. |

## Byggsordning

1. `tokens.js` – design tokens
2. T2 Source/Provenance Panel + U3 Data Quality Tag
3. U1 Confidence Indicator + U2 Uncertainty Reasons
4. T1 AI Recommendation Card (beror på U1)
5. U4 Next Best Action Chip
6. H1 Decision Action Bar (med disabled-logik)
7. T3 Why/Explanation Drawer
8. H3 Override Flow
9. S1 Decision Log Timeline
10. S4 Export Control

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
- **Domänstöd:** Stödja finans (Sara)
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
// Alltid: callback-props för användaråtgärder som loggas

const ComponentName = ({
  domain = 'finance',       // 'finance'
  data,                     // domändata från constants.js eller mockdata
  onAction,                 // callback – loggas i audit trail
  isDisabled = false,       // alltid med förklaring om disabled
  disabledReason = '',      // obligatorisk om isDisabled är true
}) => { ... }
```



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
  aria-label="Konfidensindikator: "låg"
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
- Hög → emerald, Medel → orange, Låg → red
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
