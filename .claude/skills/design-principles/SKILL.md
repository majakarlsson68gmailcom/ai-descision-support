---
name: design-principles
description: Reference design principles and guidelines for AI interfaces in high-risk domains. Use when creating, evaluating, or discussing any UI component or design decision in this project.
---

# Designprinciper – AI-beslutsstöd i högriskdomäner

> **Aktiveras när:** En UI-komponent skapas, utvärderas eller diskuteras. Läs alltid igenom relevanta delar innan du föreslår eller implementerar något. Om du saknar tillräcklig grund för ett beslut – sök på nätet efter relevant forskning eller riktlinjer innan du föreslår.

---

## 1. Projektkontext

**Domäner:** Finans (kredit)
**Kärnproblem:** Användare kan inte avgöra när AI har fel → övertillit (automation bias) eller undertillit (algorithm aversion).
**Mål:** Göra AI förklarbart, kontrollerbart och säkert i beslut med höga konsekvenser.

---

## 2. Mina designkrav (primär källa)

> Dessa krav är hämtade ur projektets egna riktlinjer (CLAUDE.md + Notion). De väger tyngst.

### Transparens
- Systemet ska tydligt **skilja på AI-genererat innehåll och källdata/fakta**
- Systemet ska visa **källor/proveniens och datafärskhet** (datum/tid) för centrala datapunkter
- Systemet ska kunna visa en kort **"Varför?"-förklaring** – vilka faktorer/antaganden som påverkat rekommendationen
- Komponenter: AI Recommendation Card, Source/Provenance Panel, Why/Explanation Drawer, Assumption & Limitations Banner

### Osäkerhet
- Systemet ska visa **konfidens/osäkerhet med orsak** – aldrig bara en siffra
- Systemet ska markera vilka **datapunkter som bidrar till osäkerhet** (inaktuell, saknad, konflikt)
- Vid låg tillförlitlighet ska systemet visa **nästa steg** (kontrollera, begär komplettering, eskalera)
- Komponenter: Confidence Indicator, Uncertainty Reasons List, Data Quality Inline Tag, Next Best Action Chip(s)

### Human-in-the-loop (HITL)
- Användaren ska kunna **acceptera, redigera eller avvisa** AI:s förslag
- Systemet ska kräva **aktivt val** innan beslut blir slutgiltigt – ingen autopilot
- Systemet ska stödja att användaren kan lägga till **domänkontext** snabbt
- Komponenter: Decision Action Bar, Review Gate, Override Flow, Add Context / Observation Input

### Spårbarhet
- Systemet ska **logga** input/underlag, AI-output, användarens beslut, tidsstämpel och användaridentitet
- Systemet ska kunna visa **AI-förslag vs slutbeslut** (diff/versionshistorik)
- Systemet ska ha en **audit trail-vy** och möjlighet till export
- Komponenter: Decision Log (Timeline), Version & Model Info Block, Diff View, Export Control

### Felhantering & eskalering
- Vid systemfel ska systemet erbjuda **manual mode i samma vy**
- Systemet ska erbjuda tydlig **eskaleringsväg** (ansvarig handläggare/kliniker)
- Åtgärder i felläge ska **loggas i audit trail**
- Komponenter: AI Failure State Card, Manual Mode Panel, Escalation CTA, Incident/Unavailable Tag

### Kontroll/constraints
- Systemet ska tydligt visa **vad AI får göra** (sammanfatta, föreslå, ställa frågor)
- Vid låg konfidens/hög risk ska systemet **begränsa AI:s output** och styra mot säkrare flöde
- Komponenter: AI Mode Selector, Risk Gate Rules, Permission & Role Badge

---

## 3. Externa riktlinjer och forskning

> Dessa sammanfattningar är baserade på källmaterial från projektets forskningsbibliotek. Filerna finns i `Artiklar och research/`.

---

### Amershi et al. (2019) – "Guidelines for Human-AI Interaction"
> CHI 2019, Microsoft Research. Fil: `Guidelines-for-Human-AI-Interaction-camera-ready.pdf`

18 evidensbaserade riktlinjer organiserade i fyra faser:

**Initialt (vad systemet kan/vet):**
- G1: Gör tydligt vad systemet kan göra
- G2: Gör tydligt hur väl det kan göra det (kommunicera begränsningar)
- G3: Tajma AI-interaktioner kontextuellt – bryt inte koncentration i onödan
- G4: Visa kontextuellt relevant information

**Under interaktion:**
- G5: Matcha relevanta sociala normer
- G6: Motverka sociala biaser
- G7: Stöd effektiv aktivering av AI-funktioner
- G8: Stöd effektiv avfärdning (enkelt att säga nej)
- G9: Stöd effektiv korrigering av AI-output
- G10: Begränsa tjänster vid osäkerhet – var försiktig när AI inte vet

**När det går fel:**
- G11: Gör tydligt varför systemet agerade som det gjorde
- G12: Kom ihåg senaste interaktioner (kontext)
- G13: Lär från användarbeteende

**Över tid:**
- G14: Uppdatera och anpassa försiktigt
- G15: Uppmuntra granulär feedback
- G16: Kommunicera konsekvenser av användarens val
- G17: Erbjud globala kontroller
- G18: Informera om förändringar

**Designimplikationer för projektet:**
- G2 → Confidence Indicator + Uncertainty Reasons List ska kommunicera *varför* konfidens är låg
- G8/G9 → Override Flow ska vara friktionsfri, inte defensiv
- G10 → Disabled Godkänn-knapp med förklaring är ett direkt G10-mönster
- G11 → Why/Explanation Drawer täcker detta krav
- G16 → Review Gate ska visa konsekvensen av ett beslut innan det låses

---

### Ribeiro, Singh & Guestrin (2016) – "Why Should I Trust You?"
> KDD 2016. Fil: `Why Should I Trust You.pdf`

Introducerar LIME (Local Interpretable Model-Agnostic Explanations). Kärninsikt: **globala förklaringar räcker inte** – användare behöver lokala förklaringar för det *specifika fallet* de arbetar med.

**Tre krav på en användbar förklaring:**
1. **Lokal trohet** – förklaringen ska vara korrekt för just det här fallet, inte AI-systemet i allmänhet
2. **Tolkbarhet** – presenteras i termer användaren förstår (inte modellens interna representation)
3. **Modellagnostisk** – oberoende av underliggande modell

**Designimplikationer:**
- Why/Explanation Drawer ska visa top-3 faktorer *för just det här ärendet* – inte generella förklaringar om vad modellen brukar göra
- Faktorvikter (hög/medel) ska kopplas till faktiska värden i ärendet ("Skuldsättningsgrad 2.4x – hög negativ faktor"), inte abstrakta poäng
- "Varför?" ska svara på: vad i *det här underlaget* drev rekommendationen?

---

### Bansal et al. (2019) – "Beyond Accuracy: The Role of Mental Models in Human-AI Team Performance"
> CHI 2019. Fil: `Beyond Accuracy- The Role of Mental Models in Human-AI Team Performance.pdf`

**Kärnfynd:** Teamprestation (människa + AI) beror inte bara på AI-noggrannhet – utan på **om användaren har en korrekt mental modell av när AI har rätt och när den har fel.**

- Övertillit (övertro på AI) leder till sämre resultat även med hög AI-noggrannhet
- Undertillit (ignorerar AI) eliminerar fördelen med AI-stödet
- **Kalibrerat förtroende** ("appropriate reliance") är målet: följ AI när den sannolikt har rätt, avvik när den sannolikt har fel

**Mental modell-bildning kräver:**
- Tydliga signaler om AI:s styrkor och svagheter
- Feedback när AI:s rekommendation var rätt/fel
- Exponering för AI:s misslyckanden – inte bara framgångar

**Designimplikationer:**
- Confidence Indicator är inte bara UX-estetik – det är det primära verktyget för kalibrerat förtroende
- Uncertainty Reasons List ska konkret beskriva *vilken typ* av fall AI är osäker på
- Audit trail (S1) kan långsiktigt hjälpa användare att kalibrera sin förståelse av AI:s begränsningar
- Att visa när Godkänn är disabled motverkar övertillit i just det ärende där det är viktigast

---

### Liao, Gruen & Miller (2020) – "Questioning the AI: Informing Design Practices for Explainable AI User Experiences"
> CHI 2020. Fil: `Designerly Understanding- Information Needs for Model Transparency to Support Design Ideation for AI-Powered User Experience.pdf`

Undersöker vad UX-designers behöver veta om AI-modeller för att designa bra AI-upplevelser. Identifierar ett **XAI Question Bank** – vilka frågor slutanvändare typiskt har om AI-system.

**De vanligaste användarfrågorna om AI:**
- *Vad kan systemet göra?* (capability)
- *Varför gav det det här svaret?* (local explanation)
- *Hur säker är det?* (confidence/uncertainty)
- *Vad händer om jag ändrar X?* (counterfactual)
- *Stämmer det med data jag ser?* (consistency)

**Fynd om designers:** Utan tillräcklig modellinformation tenderar designers att antingen överlova AI-kapabilitet eller designa generiska gränssnitt som inte matchar faktisk modellbeteende.

**Designimplikationer:**
- Varje komponent bör svara på en eller flera av dessa frågor – dokumentera vilken
- Why/Explanation Drawer (T3) → svarar på "varför?" och "hur säker?"
- Source/Provenance Panel (T2) → svarar på "stämmer det med data?"
- Confidence Indicator (U1) → svarar på "hur säker?"
- Next Best Action Chip (U4) → svarar på "vad gör jag nu?"

---

### Jung et al. (2025) – "An Explanation User Interface for AI-Supported Mechanical Ventilation Optimization"
> JAMIA / formative usability study. Fil: `An Explanation User Interface for Artificial Intelligence–Supported Mechanical Ventilation Optimization for Clinicians.pdf`

Formativ usability-studie av ett XAI-gränssnitt för kliniker (intensivvård). Designade och testade ett förklaringsgränssnitt för AI-rekommendationer om mekanisk ventilation.

**Nyckelresultat:**
- Kliniker ville se **rekommendation + förklaring i samma vy** – inte i separat flik/drawer om de befinner sig i kritisk fas
- **Konfidens utan förklaring** skapar förvirring och misstro – kliniker behöver veta *varför*
- Förklaringar bör använda **klinisk terminologi**, inte modellintern notation
- **Kortare förklaringar** föredras under tidspress – expanderbar detalj fungerar
- Audit trail upplevdes som viktigt av chefsläkare/koordinatorer, men avlastande för operativa kliniker

**Designimplikationer:**
- Vård-domänen: konfidens och top-faktorer ska vara **inline i huvudkort**, inte i drawer
- Finans-domänen: expanderbar drawer är acceptabel (mer tid)
- Terminologi ska matchas till användarens domän (Sara: kredittermer, Maya: kliniska termer)
- Principen "3-sek-sammanfattning + expandera" är empiriskt validerad

---

### Horsky et al. (2012) – "Interface Design Principles for Usable Decision Support"
> Fil: `Interface design principles for usable decision support- A targeted review of best practices for clinical prescribing interventions.pdf`

Riktad granskning av designprinciper för kliniska beslutsstödssystem (CDSS), med fokus på ordination/prescribing. Identifierar 10 designprinciper för användbara beslutsstöd.

**De 10 principerna (sammanfattade):**
1. **Relevant information i rätt tid** – visa bara vad som behövs för det aktuella beslutet
2. **Prioritera varningar efter allvarlighetsgrad** – inte alla varningar är lika viktiga
3. **Minimera avbrott** – undvik att bryta arbetsflödet för låg-prioritets-information
4. **Ge handlingsbara rekommendationer** – inte bara "möjligt problem" utan "gör X"
5. **Designa för specifika användarroller** – kliniker vs administratör vs chef
6. **Stöd override med minimal friktion** – obligatorisk motivering ska inte vara ett hinder
7. **Integrera i arbetsflödet** – beslutsstöd som kräver byte av vy används inte
8. **Kommunicera osäkerhet tydligt** – binär varning räcker inte
9. **Visa källan/evidensen** – användare behöver bedöma trovärdighet
10. **Lär av användarbeteende** – loggning ger återkoppling för systemförbättring

**Designimplikationer:**
- Princip 2 → Uncertainty Reasons List: max 3 orsaker i hauptvy (prioriterade)
- Princip 3 → Assumption Banner ska inte visas vid varje laddning – bara när data faktiskt saknas
- Princip 4 → Next Best Action Chip(s) är direkt svar på denna princip
- Princip 6 → Override Flow: obligatorisk kategori är minimal motivering, fritext är valfri
- Princip 9 → Source/Provenance Panel är obligatorisk i kreditdomänen

---

### "Problem och osäkerhet i användares interaktion med AI-system"
> Fil: `Problem och osäkerhet i användares interaktion med AI-system.pdf`

Sammanfattar centrala problemkategorier i human-AI interaction, med fokus på osäkerhetshantering.

**Problemkategorier:**
- **Kalibreringsproblem:** Användare vet inte hur säker de bör vara på AI:s output
- **Transparensproblem:** "Black box"-AI skapar misstro eller övertillit
- **Kontrolloproblem:** Känsla av att inte kunna påverka eller förstå systemet
- **Feedbackproblem:** Ingen återkoppling på om användarens beslut var rätt/fel

**Osäkerhetstyper som behöver kommuniceras:**
- *Epistemic osäkerhet* (bristande data/kunskap) → kan reduceras med mer info
- *Aleatorisk osäkerhet* (inneboende variation) → kan inte reduceras

**Designimplikationer:**
- Uncertainty Reasons List ska skilja på "data saknas" (epistemic – kan åtgärdas) vs "naturlig variation" (aleatorisk)
- Next Best Action Chip "Begär komplettering" är ett direkt svar på epistemic osäkerhet
- Data Quality Inline Tag kommunicerar källan till osäkerheten – inte bara att den finns

---

### Mayer et al. – "Why and How to Approach UX in Safety-Critical Domains"
> Fil: `Why and How to Approach User Experience in Safety-Critical Domains_ The Example of Health Care.pdf`

Argumenterar för user experience-arbete i säkerhetskritiska domäner (vård som fallstudie). Utmanar antagandet att säkerhet och användbarhet är varandras motpoler.

**Kärnargument:**
- Dålig UX i säkerhetskritiska system leder direkt till **säkerhetsrisker** – inte tvärtom
- "Workarounds" (improviserade lösningar) uppstår när systemet är oanvändbart → undviker säkerhetskontroller
- Iterativ, användarcentrerad design är inte lyx – det är en säkerhetsstrategi

**Unika UX-utmaningar i säkerhetskritiska domäner:**
- Höga insatser: fel kan ha livsfarliga konsekvenser
- Tidspress: beslut måste fattas snabbt med ofullständig info
- Experter: användarna är domänexperter som inte ska behöva lära sig IT-system
- Reglering: compliance-krav påverkar vad som kan visas/göras

**Designimplikationer:**
- Varje komponent ska utvärderas mot frågan: "Vad händer om användaren missförstår det här under stress?"
- Override Flow måste vara kognitiv lätt – obligatorisk motivering får inte skapa "tunnelseende" kring att motivera sig
- Eskalering (F3) måste alltid vara synlig och aldrig kräva navigering

---

### EU AI Act (2024, tillämpas från aug 2026)
> Källa: https://artificialintelligenceact.eu

**Risk-baserad klassificering:**
Kredit- och vårdbeslutsstöd faller under **högrisk-AI** (Annex III) – de strängaste kraven gäller.

| Artikel | Krav | Designimplikation |
|---------|------|-------------------|
| Art. 13 | Transparens: systemen måste vara förståeliga för användare; klar dokumentation om kapaciteter och begränsningar | AI-label obligatorisk; konfidens + förklaring är lagkrav |
| Art. 14 | Mänsklig tillsyn: interface-stöd för effektiv tillsyn; möjlighet att *inte* följa AI; stop-möjlighet | Override Flow, Review Gate, Disabled Godkänn = Art. 14-compliance |
| Art. 12 | Loggning: automatisk loggning av input/output/beslut; 6 månaders retention | Audit Trail är compliance-krav, inte bara UX |
| Art. 26 | Driftsättaransvar: utbilda användare i AI-systemets begränsningar | Version & Model Info Block, Assumption Banner |

---

### NIST AI RMF 1.0 (2023)
> Källa: https://www.nist.gov/itl/ai-risk-management-framework

**De sju egenskaperna för pålitlig AI:**
1. Giltig och tillförlitlig, 2. Säker, 3. Säker och resilient, 4. **Ansvarig och transparent**, 5. **Förklarbar och tolkbar**, 6. Integritetsförstärkande, 7. Rättvis

**Nyckeltriad för designsystemet:**
- **Transparens** → "Vad hände?" (logg, spårbarhet) → S1 Decision Log
- **Förklarbarhet** → "Hur togs beslutet?" (faktorer, vikt) → T3 Why Drawer
- **Tolkbarhet** → "Vad betyder det för mig?" (konsekvens i domänkontext) → T3 + U4

**Automation bias-varning (NIST):** Användare riskerar övertro på AI med tid → direktmotivering för Review Gate och disabled-state-mönstret.

---

### Ytterligare källor att söka på vid behov

- **WHO Ethics and Governance of AI for Health (2021)** – vård-specifika etiska principer
- **Cai et al. (2019) "Human-centered tools for coping with imperfect algorithms" (CHI)** – hur användare hanterar AI-fel
- **Kaur et al. (2020) "Interpreting Interpretability" (CHI)** – hur data scientists faktiskt använder XAI-verktyg
- **Lai & Tan (2019) "On Human Predictions with Explanations"** – effekt av förklaringar på beslutsqualitet

> **Sökstrategi:** Sök `[titel] site:dl.acm.org` eller `site:arxiv.org`, alternativt Google Scholar. Sammanfatta nyckelresultat och koppla direkt till designproblemet.

---

## 5. Designbeslut & constraints (projektspecifika regler)

| Beslut | Regel |
|--------|-------|
| Godkänn disabled | Alltid synlig förklaring direkt under/bredvid knappen |
| Proveniens | Alltid synlig i huvudvy (kredit) – aldrig bakom drawer |
| Override | 3–5 förifyllda kategorier + fritextfält, max 2 klick |
| Konfidens | Alltid med orsak – aldrig ensam procentsiffra |
| Audit trail | Loggas automatiskt vid varje statebyte – kan inte stängas av |
| Färg som signal | Aldrig ensam – alltid ikon + text + färg |

---

## 6. Komponentlistan är förslag, inte krav

> De komponenter som listas i designkraven är ett **förslag**. Om du ser ett bättre eller mer effektivt sätt att lösa ett problem – föreslå det och motivera utifrån principerna ovan. Se `design-advisor` skill för hur förslag ska formuleras.
