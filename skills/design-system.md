---
# Skill: CRM Design Language
## AI-beslutsstöd inbyggt i professionellt kredithandläggarsystem

Detta skill definierar hur alla UI-komponenter ska se ut och bete sig.
Följ dessa regler exakt när du bygger eller uppdaterar komponenter i projektet.

---

## Designfilosofi

Gränssnittet är ett **professionellt arbetsverktyg**, inte en konsumentapp.
Designmålet är: **låg kognitiv belastning, hög informationstäthet, professionell trovärdighet.**

Inspirationskälla: Front, Linear, Salesforce Lightning.
- Avskalat och funktionellt – varje element motiverar sin plats
- Inget som "skriker" eller drar onödig uppmärksamhet
- Färg används sparsamt och alltid med semantisk mening
- AI-elementen är integrerade som ett lager i systemet, inte som ett separat verktyg

---

## Layout – tre zoner (alltid)

```
┌─────────────────────────────────────────────────────┐
│  TOPBAR (48px)                                       │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ SIDEBAR  │  HUVUDINNEHÅLL                           │
│ (220px)  │  (resterande bredd, max 1280px)          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Sidebar
- Bredd: 220px, fast
- Bakgrund: `#F3F4F6`
- Höger kant: `border-right: 1px solid #E5E7EB`
- Systemnamn överst: 14px font-semibold text-gray-900, padding 16px
- Menygrupper med rubriker: 11px uppercase tracking-widest text-gray-400, padding 16px 16px 4px
- Menyrader: 13px text-gray-600, padding 6px 12px, rounded-md, mx-2
- Aktiv rad: bg-indigo-50 text-indigo-700 font-medium
- Hover: bg-gray-100
- Ikoner: 16px, lucide-react, mr-2, samma färg som text

### Topbar
- Höjd: 48px
- Bakgrund: white
- Kant: `border-bottom: 1px solid #E5E7EB`
- Vänster: Breadcrumb i 13px – föräldraled i gray-400, aktuell sida i gray-900 font-medium
- Höger: Statusbadge + användarnamn + avatar-initialer (32px cirkel, bg-indigo-100 text-indigo-700)

### Huvudinnehåll
- Padding: 24px
- Bakgrund: `#F9FAFB`
- Max-width: 1280px
- Kolumnlayout med CSS grid eller flexbox, gap-6
- Rekommenderat för Sara State 2: tre kolumner (flex-grow | 300px | 220px)

---

## Färgpalett

### Bas
| Namn | Hex | Tailwind | Användning |
|------|-----|----------|------------|
| Bakgrund sida | #F9FAFB | bg-gray-50 | Sidans bakgrund |
| Bakgrund kort | #FFFFFF | bg-white | Alla kort |
| Kant kort | #E5E7EB | border-gray-200 | Alla kort |
| Bakgrund sidebar | #F3F4F6 | bg-gray-100 | Sidebar |
| Text primär | #111827 | text-gray-900 | Rubriker, viktig data |
| Text sekundär | #6B7280 | text-gray-500 | Beskrivningar, etiketter |
| Text tertiär | #9CA3AF | text-gray-400 | Metadata, timestamps |

### Semantiska färger
| Namn | Hex | Tailwind | Användning |
|------|-----|----------|------------|
| Primär/indigo | #4F46E5 | indigo-600 | Aktiva element, primärknapp |
| Primär ljus | #EEF2FF | indigo-50 | Aktiv bakgrund i nav |
| Varning/osäkerhet | #F97316 | orange-500 | Inaktuell data, låg konfidens |
| Varning ljus | #FFF7ED | orange-50 | Badge-bakgrund för varning |
| Fel/avslag | #DC2626 | red-600 | Avslag-knapp, kritiskt fel |
| Fel ljus | #FEF2F2 | red-50 | Avslag-badge bakgrund |
| OK/aktuell | #10B981 | emerald-500 | Aktuell datakälla, godkänd |
| OK ljus | #ECFDF5 | emerald-50 | OK-badge bakgrund |

### Regler för färganvändning
- Färg är ALDRIG den enda signalen – alltid ikon + text + färg tillsammans
- Orange används ENDAST på ikoner, badges och text – aldrig som stor bakgrundsfärg
- Röd bakgrund används aldrig – röd text eller röd kant max
- Indigofärgen är systemets enda "brand"-färg

---

## Typografi

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

| Nivå | Storlek | Vikt | Färg | Användning |
|------|---------|------|------|------------|
| Sektionsrubrik | 11px | 500 | gray-400 | uppercase tracking-wider, ALLA KATEGORIER |
| Kortnamn | 14px | 600 | gray-900 | Rubrik på ett kort |
| Datavärde stort | 24–32px | 700 | gray-900 | Nyckeltal, beslut |
| Brödtext | 13px | 400 | gray-700 | Löpande text |
| Metadata | 12px | 400 | gray-400 | Datum, versioner |
| Badge-text | 11px | 500 | (semantisk) | Statusbadges |
| Knapptext | 13px | 500 | (semantisk) | Alla knappar |

---

## Kortkomponent (bas för allt)

```jsx
// Standard kort
<div className="bg-white border border-gray-200 rounded-lg p-4">
  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
    SEKTIONSRUBRIK
  </h3>
  {/* innehåll */}
</div>
```

**Regler:**
- Ingen box-shadow – bara border
- Border-radius: rounded-lg (8px)
- Padding: p-4 (16px) standard, p-3 för kompakta kort
- Ingen färgad bakgrund på kort (undantag: disabled-tillstånd)

---

## Badges & statusindikator

```jsx
// Aktuell (grön)
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
  <CheckCircle size={10} /> Aktuell
</span>

// Varning (orange)
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
  <AlertTriangle size={10} /> Inaktuell
</span>

// AI-förslag (indigo, outlined)
<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-indigo-300 text-indigo-700 bg-indigo-50">
  AI-förslag
</span>
```

---

## Konfidensindikator

Konfidens visas ALDRIG som ett eget stort kort. Det är ett **inline-element** nära AI-rekommendationen.

```jsx
// Låg konfidens (< 70%)
<div className="flex items-center gap-2 mt-2">
  <div className="w-2 h-2 rounded-full bg-orange-500" />
  <span className="text-xs text-gray-500">Konfidens</span>
  <span className="text-sm font-semibold text-orange-600">61%</span>
  <span className="text-xs text-orange-600 font-medium">· Låg</span>
</div>
```

Nivåer:
- Hög (≥80%): grön punkt, `text-emerald-600`
- Medel (70–79%): gul punkt, `text-yellow-600`
- Låg (<70%): orange punkt, `text-orange-600`

---

## Knappar

```jsx
// Primär (Begär komplettering)
<button className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 
  hover:bg-indigo-700 rounded-lg transition-colors">
  Begär komplettering
</button>

// Destructive (Avslå)
<button className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 
  hover:bg-red-700 rounded-lg transition-colors">
  Avslå
</button>

// Disabled (Godkänn – blockerad)
<button disabled className="w-full px-4 py-2 text-sm font-medium text-gray-400 
  bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed">
  Godkänn
</button>
// + förklaringstext direkt under:
<p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
  <AlertTriangle size={10} /> Kräver uppdaterat underlag
</p>
```

**Regler:**
- Knappar i beslutspanelen är alltid full bredd (w-full)
- Staplas vertikalt med gap-2
- Primär action överst, destructive i mitten, disabled nederst
- Disabled har ALLTID en förklaring direkt under

---

## Tabell (för datakällor/proveniens)

```jsx
<table className="w-full text-sm">
  <thead>
    <tr className="border-b border-gray-100">
      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-2">Källa</th>
      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-2">Datum</th>
      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-2">Status</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-50">
    {/* rader */}
  </tbody>
</table>
```

**Regler:**
- Ingen zebra-striping
- Tunn separator: `divide-y divide-gray-50`
- Datum alltid på en rad: "15 dec 2024 (2 dagar)" – aldrig radbruten
- Status alltid som badge (se Badges ovan)

---

## AI-specifika regler

1. **AI-rekommendationskort** ska alltid ha label "AI-förslag" som indigo badge överst till vänster, följt av "– inte ett beslut" i gray-400 italic
2. **Konfidens** är alltid inline nära rekommendationen, aldrig isolerad
3. **Nästa steg-chips** är pill-knappar med `→`-prefix, outline-stil (border border-gray-300), hover: border-indigo-400 text-indigo-600
4. **Om AI-analysen**-blocket (modellversion, dataset) är alltid i ett eget litet kort längst ner i höger kolumn, 12px text, diskret
5. **Proveniens** visas alltid i huvudvy för kreditdomänen – aldrig gömd bakom en drawer

---

## Vad du ska UNDVIKA

- ❌ Orange eller röd bakgrundsfärg på stora ytor
- ❌ Uppercase rubriker i orange/rött
- ❌ Stora isolerade konfidensblock
- ❌ Box-shadow på kort
- ❌ Färg som enda signal (alltid ikon + text)
- ❌ Datumformatering som radbryts (t.ex. "2024-\n12-15")
- ❌ Gradient, animation eller dekorativa element
- ❌ Mer än tre accentfärger i samma vy