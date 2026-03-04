# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Aktiva skills

**Alltid aktiv:**
1. **`design-advisor`** – styr Claudes roll som proaktiv designrådgivare. Formulera alltid förslag enligt det format som anges där, och implementera aldrig utan explicit godkännande.

**Villkorliga (läs bara vid behov):**
2. **`design-principles`** – läs när du utvärderar, motiverar eller föreslår designbeslut. Inte vid varje sessionsstart.
3. **`component-implementation`** – aktiveras när en komponent ska byggas, modifieras eller granskas. Följ alltid arbetsflödet där.

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

## Komponentbibliotek

16 komponenter i fyra pelare (T1–T4, U1–U4, H1–H4, S1–S4). Fullständig lista med syfte och byggsordning finns i `component-implementation`-skilen.

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

Mockdata finns i `src/constants.js` (exporteras som `CASE`). Redigera där – inte här.

---

## Designbeslut & constraints

- **Konfidensgradfärger:** grön = hög, orange = medel, rött = låg. Rött används ENBART för konfidensgrad "low" – inte för datakvalitetstatus (stale, missing = orange)
- **Datakvalitetsfärger:** orange = inaktuell/osäker, grå = saknas, rött = konflikt
- **Godkänn-knapp disabled:** ska alltid ha synlig förklaring direkt under/bredvid knappen
- **Proveniens:** alltid synlig i huvudvy för kredit-domänen (inte bakom drawer)
- **Override:** 3–5 förifyllda kategorialternativ + fritextfält, max 2 klick
- **Konfidens:** visas alltid med orsak, aldrig som ensam procentsiffra
- **Audit trail:** loggas automatiskt vid varje statebyte, kan inte stängas av av normalanvändare
