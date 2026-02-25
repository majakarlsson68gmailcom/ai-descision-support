export const CASE = {
  id: "KR-2026-0847",
  company: "Bergström & Co AB",
  orgNr: "556712-3344",
  amount: 2500000,
  purpose: "Rörelsekapital och maskinköp",
  officer: "Sara Lindgren",
  aiRecommendation: "AVSLAG",
  confidence: 61,
  confidenceLevel: "medium", // high > 80, medium 60–80, low < 60
  uncertaintyReasons: [
    "Årsredovisning är äldre än 6 månader",
    "Kassaflödesdata saknas för Q3 2024",
  ],
  topFactors: [
    {
      factor: "Räntetäckningsgrad",
      value: "↓ 0.8x",
      weight: "hög",
      direction: "negativ",
      description:
        "Räntetäckningsgraden (0.8) understiger bankens minimikrav på 1.2, vilket innebär att bolaget inte kan täcka sina räntekostnader med nuvarande rörelseresultat.",
      source: "Årsredovisning 2025 +1",
      sourceCount: 0,
      period: "Jan - Dec 2025",
      limit: "1.2x",
      diff: "-0.4x",
      diffDirection: "under",
      stale: false,
    },
    {
      factor: "Kassaflöde (rörelseresultat)",
      value: "-240 000kr",
      weight: "medel",
      direction: "negativ",
      description:
        "Kassaflödesdata från 2022 kan inte verifieras och återbetalningsförmågan går därför inte att fastställa med tillräcklig säkerhet.",
      source: "Årsredovisning 2022",
      sourceCount: 0,
      period: "Jan - Dec 2022",
      limit: "0 kr",
      diff: "-240 000 kr",
      diffDirection: "under",
      stale: true,
    },
    {
      factor: "Skuldkvot",
      value: "↑ 1.2x",
      weight: "hög",
      direction: "negativ",
      description:
        "Skuldkvoten (3.0x) överstiger gränsvärdet med +1.2x och indikerar en skuldbörda som inte är proportionerlig mot intjäningsförmågan.",
      source: "Årsredovisning 2025 +2",
      sourceCount: 0,
      period: "Jan - Dec 2025",
      limit: "1.8x",
      diff: "+1.2x",
      diffDirection: "över",
      stale: false,
    },
  ],
  dataSources: [
    { name: "Årsredovisning 2025", period: "Januari – December 2025", status: "ok" },
    { name: "Kreditupplysning", period: "Januari – December 2025", status: "ok" },
    { name: "Lånehistorik", period: "Januari – December 2025", status: "ok" },
    { name: "Årsredovisning 2022", period: "Januari – December 2022", status: "stale" },
  ],
  nextBestActions: [
    "Begär kompletterande underlag för kassaflöde (senaste 12 månader)",
  ],
  aiSummaryShort:
    "3 centrala underlag är aktuella, men kassaflödesunderlaget är inaktuellt",
  aiSummary:
    "AI rekommenderar avslag främst på grund av låg räntetäckningsgrad (0.8x, under bankens krav 1.2x) och hög skuldkvot (4.2x, över intern gräns). Kassaflödesunderlaget är föråldrat, vilket sänker konfidensen och gör att AI-rekommendationen bör bedömas manuellt innan slutligt beslut.",
};

export const DISABLED_APPROVE_REASON = "Låst tills kritisk granskning är genomförd.";
export const DISABLED_SUPPLEMENT_REASON = "Låst tills AI-underlaget har granskats.";
export const REJECT_WARNING = "Kräver motivering om granskning ej genomförts";
