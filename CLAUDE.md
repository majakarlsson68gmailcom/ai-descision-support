# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Aktiva skills

Följande skills är alltid aktiva i det här projektet. Läs dem i angiven ordning vid sessionsstart:

1. **`design-advisor`** – styr Claudes roll som proaktiv designrådgivare. Alltid aktiv. Formulera alltid förslag enligt det format som anges där, och implementera aldrig utan explicit godkännande.
2. **`design-principles`** – referensbank för designkrav och extern forskning. Läs relevanta delar innan du föreslår eller motiverar något.
3. **`component-implementation`** – aktiveras när en komponent ska byggas eller modifieras. Följ alltid arbetsflödet där.

## Projektöversikt

React-baserat designsystem och prototypbibliotek för AI-beslutsstöd i kritiska domäner (kredit, vård). Målet är att göra AI förklarbart, kontrollerbart och säkert i beslut med höga konsekvenser.

**Stack:** React + Vite + Tailwind CSS. Allt mockdata hårdkodat – inga API-anrop.

**Kärnproblem:** Användare kan inte avgöra när AI har fel → leder till övertillit (automation bias) eller undertillit (algorithm aversion).

---

## Kommandon

```bash
npm install       # installera beroenden
npm run dev       # starta dev-server (Vite)
npm run build     # bygg för produktion
npm run preview   # förhandsgranska bygge
```

---

## Arkitektur

- Alla komponenter är isolerade React-funktionskomponenter
- Props-driven med mockdata från `constants.js`
- Design tokens (färger, typografi, spacing) i `tokens.js`
- Tailwind utility classes – inga custom CSS-filer
- Desktop-first, min-width 1280px
- Tillgänglighet: färg är aldrig enda signal (alltid ikon + text vid status)

---

## De fyra pelarna (designprinciper)

### 1. Transparens
- Skilj tydligt på AI-genererat innehåll och källdata/fakta
- Visa källor/proveniens och datafärskhet (datum/tid) per datapunkt
- Erbjud "Varför?"-förklaring med Top 3 faktorer + antaganden

### 2. Osäkerhet
- Visa konfidens med orsak (aldrig bara en siffra)
- Markera vilka datapunkter som bidrar till osäkerhet (inaktuell/saknad/konflikt)
- Vid låg tillförlitlighet: visa konkret nästa steg (begär komplettering, eskalera)

### 3. Human-in-the-loop
- Användaren kan acceptera, redigera eller avvisa AI:s förslag
- Kräv aktivt val innan beslut slutförs – ingen autopilot
- Override kräver obligatorisk kategori + valfri fritext (låg friktion)

### 4. Spårbarhet
- Logga input, AI-output, beslut, tidsstämpel, användaridentitet
- Audit trail läsbar av tredje part (compliance) i skrivskyddat läge
- Exportmöjlighet (PDF/CSV)

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

---

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

## Scenarios – Sara (aktuell prototyp: State 2)

| State | Beskrivning | Nyckelkomponenter |
|-------|-------------|-------------------|
| 1 – Normalfallet | AI avslag, konfidens hög, alla källor aktuella | Grundflödet |
| **2 – Osäkerhetsfallet** | **AI avslag, konfidens medium, en källa >6 mån gammal** | **T2, U1, U3, U4, H1 (Godkänn disabled)** |
| 3 – Override-fallet | Sara godkänner trots AI-avslag | H3, H2, S1 |
| 4 – Audit-fallet | Compliance-vy, skrivskyddad | S1, S2, S3, S4 |

---

## Mockdata – Sara State 2

```javascript
const CASE = {
  id: "KR-2024-0847",
  company: "Lindqvist Bygg AB",
  orgNr: "556712-3344",
  amount: 2500000,
  purpose: "Rörelsekapital och maskinköp",
  officer: "Sara Lindgren",
  aiRecommendation: "AVSLAG",
  confidence: "medium",
  confidenceLevel: "medium", // high > 80, medium 70-80, low < 70
  uncertaintyReasons: [
    "Årsredovisning är äldre än 6 månader",
    "Kassaflödesdata saknas för Q3 2024",
  ],
  dataSources: [
    { name: "Kreditupplysning UC", date: "2024-12-15", status: "ok", daysOld: 2 },
    { name: "Skatteregistret", date: "2024-10-20", status: "ok", daysOld: 57 },
    { name: "Årsredovisning 2022", date: "2024-04-10", status: "stale", daysOld: 250 },
  ],
  topFactors: [
    { factor: "Skuldsättningsgrad", value: "2.4x", weight: "hög", direction: "negativ" },
    { factor: "Omsättningstillväxt", value: "+12%", weight: "medel", direction: "positiv" },
    { factor: "Likviditetsgrad", value: "0.8", weight: "hög", direction: "negativ" },
  ],
};
```

---

## Designbeslut & constraints

- **Konfidensgradfärger:** grön = hög, orange = medel, rött = låg. Rött används ENBART för konfidensgrad "low" – inte för datakvalitetstatus (stale, missing = orange)
- **Datakvalitetsfärger:** orange = inaktuell/osäker, grå = saknas, rött = konflikt
- **Godkänn-knapp disabled:** ska alltid ha synlig förklaring direkt under/bredvid knappen
- **Proveniens:** alltid synlig i huvudvy för kredit-domänen (inte bakom drawer)
- **Override:** 3–5 förifyllda kategorialternativ + fritextfält, max 2 klick
- **Konfidens:** visas alltid med orsak, aldrig som ensam procentsiffra
- **Audit trail:** loggas automatiskt vid varje statebyte, kan inte stängas av av normalanvändare
