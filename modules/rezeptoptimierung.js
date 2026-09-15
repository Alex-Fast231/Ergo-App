// Ergotherapie-Heilmittelkatalog (Fassung "FaSt App Ergo").
// Diagnosegruppen, vorrangige Heilmittel, Höchstmengen und orientierende
// Behandlungsmengen sind 1:1 aus dem vom Nutzer bereitgestellten Katalog
// "Maßnahmen der Ergotherapie" übernommen (Abschnitte IV.1-3: SB1-3, EN1-3,
// PS1-4). Die ICD-10-Zuordnung je Diagnosegruppe ist KEINE offizielle
// Anlage-2-Liste (die lag nicht vor) - sie wurde anhand der im Katalog
// genannten Beispieldiagnosen mit gängigen ICD-10-GM-Codes nachgebildet und
// sollte vor produktivem/abrechnungsrelevantem Einsatz von der Praxis
// geprüft/ergänzt werden. LHB- (langfristiger Heilmittelbedarf) und
// BVB-Kennzeichnungen sind mangels vorliegender Anlage-2-Diagnoseliste für
// Ergotherapie bewusst nicht gesetzt (immer "nein") - anders als im
// Physio-Modul, wo diese Angaben belegt vorlagen.

export const HEILMITTEL_KATALOG = {
  SB1: {
    label: "Erkrankungen der Wirbelsäule, Gelenke und Extremitäten (motorisch-funktionelle Schädigung)",
    vorrangig: ["MF"],
    maxProVO: 10,
    orientierendeMenge: 20
  },
  SB2: {
    label: "Erkrankungen der Wirbelsäule, Gelenke und Extremitäten (sensomotorisch-perzeptive Schädigung)",
    vorrangig: ["MF", "SP"],
    maxProVO: 10,
    orientierendeMenge: 30
  },
  SB3: {
    label: "System- und Autoimmunerkrankungen (Bindegewebe, Muskeln, Gefäße)",
    vorrangig: ["MF", "SP"],
    maxProVO: 10,
    orientierendeMenge: 30
  },
  EN1: {
    label: "ZNS-Erkrankungen (Gehirn) / Entwicklungsstörungen",
    vorrangig: ["SP", "MF", "HL", "PF"],
    maxProVO: 10,
    orientierendeMenge: 60,
    hinweis: "Orientierende Menge längstens bis zur Vollendung des 18. Lebensjahres."
  },
  EN2: {
    label: "ZNS-Erkrankungen (Rückenmark) / neuromuskuläre Erkrankungen",
    vorrangig: ["SP", "MF", "PF"],
    maxProVO: 10,
    orientierendeMenge: 40
  },
  EN3: {
    label: "Periphere Nervenläsionen / Muskelerkrankungen",
    vorrangig: ["SP", "MF"],
    maxProVO: 10,
    orientierendeMenge: 20
  },
  PS1: {
    label: "Entwicklungs-, Verhaltens- und emotionale Störungen (Beginn in Kindheit/Jugend)",
    vorrangig: ["PF", "HL"],
    maxProVO: 10,
    orientierendeMenge: 40,
    hinweis: "Verordnung nur aufgrund einer kinder- und jugendpsychiatrischen, neuropädiatrischen oder jugendlichen psychotherapeutischen Eingangsdiagnostik."
  },
  PS2: {
    label: "Neurotische, Belastungs-, somatoforme und Persönlichkeitsstörungen",
    vorrangig: ["PF"],
    maxProVO: 20,
    orientierendeMenge: 40,
    hinweis: "Verordnung nur aufgrund einer psychiatrischen, neurologischen oder psychotherapeutischen Eingangsdiagnostik."
  },
  PS3: {
    label: "Wahnhafte und affektive Störungen / Abhängigkeitserkrankungen",
    vorrangig: ["PF", "HL"],
    maxProVO: 20,
    orientierendeMenge: 40,
    hinweis: "Verordnung nur aufgrund einer psychiatrischen, neurologischen oder psychotherapeutischen Eingangsdiagnostik."
  },
  PS4: {
    label: "Dementielle Syndrome",
    vorrangig: ["HL", "PF"],
    maxProVO: 10,
    orientierendeMenge: 40,
    hinweis: "Verordnung nur aufgrund einer psychiatrischen, neurologischen oder neuropsychologischen Eingangsdiagnostik."
  }
};

export const VERGUETUNG = {
  MF: { label: "Motorisch-funktionelle Behandlung" },
  SP: { label: "Sensomotorisch-perzeptive Behandlung" },
  HL: { label: "Hirnleistungstraining / neuropsychologisch orientierte Behandlung" },
  PF: { label: "Psychisch-funktionelle Behandlung" }
};

// Anders als in der Physio-Version entsprechen die Empfehlungscodes hier
// bereits 1:1 den Leistungswerten im Rezeptformular (REZEPT_ITEM_OPTIONS in
// ui/views.js) - eine Umbenennungstabelle ist nicht nötig, die Identitäts-
// abbildung bleibt aber bestehen, damit bestehende Aufrufstellen (die einen
// EMPFEHLUNG_ZU_ITEM_TYPE-Lookup erwarten) unverändert funktionieren.
export const EMPFEHLUNG_ZU_ITEM_TYPE = { MF: "MF", SP: "SP", HL: "HL", PF: "PF" };

const PRAEFIX_REGELN = [
  // SB1 - Wirbelsäule/Gelenke, motorisch-funktionell
  { praefix: "M15", gruppe: "SB1", diagnose: "Polyarthrose" },
  { praefix: "M16", gruppe: "SB1", diagnose: "Koxarthrose (Hüfte)" },
  { praefix: "M17", gruppe: "SB1", diagnose: "Gonarthrose (Knie)" },
  { praefix: "M18", gruppe: "SB1", diagnose: "Rhizarthrose (Daumen)" },
  { praefix: "M19", gruppe: "SB1", diagnose: "Sonstige Arthrose" },
  { praefix: "M45", gruppe: "SB1", diagnose: "Spondylitis ankylosans (M. Bechterew)" },
  { praefix: "M02", gruppe: "SB1", diagnose: "Reaktive Arthritis" },
  { praefix: "M05", gruppe: "SB1", diagnose: "Seropositive rheumatoide Arthritis" },
  { praefix: "M06", gruppe: "SB1", diagnose: "Seronegative rheumatoide Arthritis" },
  { praefix: "M07", gruppe: "SB1", diagnose: "Arthritis psoriatica" },
  { praefix: "M75", gruppe: "SB1", diagnose: "Schultersteife / Schulterläsion" },
  { praefix: "Q74", gruppe: "SB1", diagnose: "Arthrogryposis multiplex congenita" },
  { praefix: "Z96", gruppe: "SB1", diagnose: "Zustand nach Endoprothesenimplantation" },
  { praefix: "S12", gruppe: "SB1", diagnose: "Fraktur Halswirbelsäule" },
  { praefix: "S22", gruppe: "SB1", diagnose: "Fraktur Brustwirbel / Rippe" },
  { praefix: "S32", gruppe: "SB1", diagnose: "Fraktur Lendenwirbelsäule / Becken" },

  // SB2 - Wirbelsäule/Gelenke, sensomotorisch-perzeptiv
  { praefix: "M50", gruppe: "SB2", diagnose: "Bandscheibenschaden Halswirbelsäule (radikulär)" },
  { praefix: "M51", gruppe: "SB2", diagnose: "Bandscheibenschaden LWS/BWS (radikulär)" },
  { praefix: "M54.1", gruppe: "SB2", diagnose: "Radikulopathie" },
  { praefix: "Z98.1", gruppe: "SB2", diagnose: "Zustand nach Arthrodese / Spondylodese" },
  { praefix: "T95", gruppe: "SB2", diagnose: "Folgen von Verbrennungen/Verätzungen (Kontrakturen/Narben)" },
  { praefix: "Z89", gruppe: "SB2", diagnose: "Amputationszustand" },
  { praefix: "T79.6", gruppe: "SB2", diagnose: "Traumatisches Kompartmentsyndrom" },
  { praefix: "M24", gruppe: "SB2", diagnose: "Traumatisch bedingte Gelenkerkrankung / Operationsfolge" },
  { praefix: "Q73", gruppe: "SB2", diagnose: "Angeborene Fehlbildung der Extremitäten (Dysmelie)" },
  { praefix: "M89.0", gruppe: "SB2", diagnose: "Sympathische Reflexdystrophie (CRPS)" },

  // SB3 - Bindegewebe/Muskeln/Gefäße
  { praefix: "M34", gruppe: "SB3", diagnose: "Systemische Sklerose (Sklerodermie)" },
  { praefix: "M32", gruppe: "SB3", diagnose: "Systemischer Lupus erythematodes" },
  { praefix: "M33", gruppe: "SB3", diagnose: "Polymyositis / Dermatomyositis" },
  { praefix: "M35.1", gruppe: "SB3", diagnose: "Mischkollagenose (Sharp-Syndrom)" },
  { praefix: "G70", gruppe: "SB3", diagnose: "Myasthenia gravis" },
  { praefix: "G71.1", gruppe: "SB3", diagnose: "Myotonie" },
  { praefix: "G71.0", gruppe: "SB3", diagnose: "Muskeldystrophie" },

  // EN1 - ZNS Gehirn / Entwicklungsstörungen
  { praefix: "G80", gruppe: "EN1", diagnose: "Infantile Zerebralparese" },
  { praefix: "Q90", gruppe: "EN1", diagnose: "Trisomie 21 (Down-Syndrom)" },
  { praefix: "Q03", gruppe: "EN1", diagnose: "Angeborener Hydrozephalus" },
  { praefix: "I63", gruppe: "EN1", diagnose: "Hirninfarkt" },
  { praefix: "I61", gruppe: "EN1", diagnose: "Intrazerebrale Blutung" },
  { praefix: "C71", gruppe: "EN1", diagnose: "Bösartige Neubildung des Gehirns" },
  { praefix: "S06", gruppe: "EN1", diagnose: "Schädel-Hirn-Trauma" },
  { praefix: "G04", gruppe: "EN1", diagnose: "Enzephalitis / Meningoenzephalitis" },
  { praefix: "G20", gruppe: "EN1", diagnose: "Morbus Parkinson" },
  { praefix: "G35", gruppe: "EN1", diagnose: "Multiple Sklerose" },
  { praefix: "G12.2", gruppe: "EN1", diagnose: "Amyotrophe Lateralsklerose" },

  // EN2 - ZNS Rückenmark / neuromuskulär
  { praefix: "Q05", gruppe: "EN2", diagnose: "Spina bifida" },
  { praefix: "G82", gruppe: "EN2", diagnose: "Querschnittssyndrom (Para-/Tetraparese)" },
  { praefix: "B91", gruppe: "EN2", diagnose: "Folgezustand nach Poliomyelitis" },
  { praefix: "G12.0", gruppe: "EN2", diagnose: "Spinale Muskelatrophie" },

  // EN3 - Periphere Nervenläsionen / Muskelerkrankungen
  { praefix: "G58", gruppe: "EN3", diagnose: "Periphere Mononeuropathie / Parese" },
  { praefix: "G54", gruppe: "EN3", diagnose: "Plexusparese" },
  { praefix: "G61", gruppe: "EN3", diagnose: "Polyneuropathie (z.B. Guillain-Barré)" },
  { praefix: "G72", gruppe: "EN3", diagnose: "Myopathie (metabolisch/entzündlich)" },

  // PS1 - Kindheit/Jugend
  { praefix: "F90", gruppe: "PS1", diagnose: "ADHS" },
  { praefix: "F84.0", gruppe: "PS1", diagnose: "Frühkindlicher Autismus" },
  { praefix: "F91", gruppe: "PS1", diagnose: "Störung des Sozialverhaltens" },
  { praefix: "F50.0", gruppe: "PS1", diagnose: "Anorexia nervosa" },
  { praefix: "F93", gruppe: "PS1", diagnose: "Emotionale Störung des Kindesalters" },

  // PS2 - Neurotisch/Belastung/Persönlichkeit
  { praefix: "F41", gruppe: "PS2", diagnose: "Angststörung" },
  { praefix: "F42", gruppe: "PS2", diagnose: "Zwangsstörung" },
  { praefix: "F50.9", gruppe: "PS2", diagnose: "Essstörung, nicht näher bezeichnet" },
  { praefix: "F60.31", gruppe: "PS2", diagnose: "Borderline-Persönlichkeitsstörung" },

  // PS3 - Wahnhaft/affektiv/Abhängigkeit
  { praefix: "F20.5", gruppe: "PS3", diagnose: "Schizophrenes Residuum" },
  { praefix: "F20.8", gruppe: "PS3", diagnose: "Sonstige Schizophrenie" },
  { praefix: "F32", gruppe: "PS3", diagnose: "Depressive Episode" },
  { praefix: "F19.2", gruppe: "PS3", diagnose: "Abhängigkeitssyndrom" },

  // PS4 - Demenz
  { praefix: "F00", gruppe: "PS4", diagnose: "Demenz bei Alzheimer-Krankheit" }
];

// Freitext-Startwörterbuch für gängige Diagnosebezeichnungen. Der
// automatische Textabgleich (siehe matchFreitext) deckt darüber hinaus auch
// Formulierungen ab, die nicht 1:1 hier stehen.
const FREITEXT_SYNONYME = {
  "parkinson": "G20",
  "morbus parkinson": "G20",
  "ms": "G35",
  "multiple sklerose": "G35",
  "als": "G12.2",
  "amyotrophe lateralsklerose": "G12.2",
  "schlaganfall": "I63",
  "apoplex": "I63",
  "hirninfarkt": "I63",
  "hirnblutung": "I61",
  "alzheimer": "F00",
  "demenz": "F00",
  "adhs": "F90",
  "ads": "F90",
  "autismus": "F84.0",
  "frühkindlicher autismus": "F84.0",
  "depression": "F32",
  "depressive episode": "F32",
  "borderline": "F60.31",
  "anorexie": "F50.0",
  "magersucht": "F50.0",
  "bulimie": "F50.9",
  "essstörung": "F50.9",
  "schizophrenie": "F20.8",
  "arthrose knie": "M17",
  "kniearthrose": "M17",
  "gonarthrose": "M17",
  "hüftarthrose": "M16",
  "arthrose hüfte": "M16",
  "koxarthrose": "M16",
  "rheuma": "M06",
  "rheumatoide arthritis": "M06",
  "sklerodermie": "M34",
  "lupus": "M32",
  "myasthenie": "G70",
  "muskeldystrophie": "G71.0",
  "spina bifida": "Q05",
  "querschnittslähmung": "G82",
  "querschnittlähmung": "G82",
  "polyneuropathie": "G61",
  "guillain barre": "G61",
  "guillain-barré": "G61",
  "cerebralparese": "G80",
  "zerebralparese": "G80",
  "infantile zerebralparese": "G80",
  "trisomie 21": "Q90",
  "down syndrom": "Q90",
  "down-syndrom": "Q90",
  "hydrozephalus": "Q03",
  "sht": "S06",
  "schädel hirn trauma": "S06",
  "schädel-hirn-trauma": "S06",
  "amputation": "Z89",
  "endoprothese": "Z96",
  "bechterew": "M45",
  "frozen shoulder": "M75",
  "schultersteife": "M75",
  "angststörung": "F41",
  "zwangsstörung": "F42",
  "crps": "M89.0",
  "sudecksyndrom": "M89.0",
  "sudeck": "M89.0"
};

function stripDiacritics(value) {
  return String(value || "").normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const FREITEXT_STOPWORDS = new Set([
  "der", "die", "das", "des", "dem", "den", "und", "mit", "bei", "von", "vom", "zum", "zur",
  "auf", "nach", "seit", "wegen", "durch", "ohne", "im", "am",
  "verdacht", "va", "zn", "stn", "st", "re", "li",
  "chronisch", "chronische", "chronischer", "chronisches",
  "akut", "akute", "akuter", "akutes",
  "links", "rechts", "beidseits", "beidseitig", "syndrom"
]);

function significantWords(text) {
  return stripDiacritics(String(text || "").toLowerCase())
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !FREITEXT_STOPWORDS.has(w));
}

export function normalisiereICD(code) {
  return String(code || "").trim().toUpperCase().replace(/\s/g, "");
}

// ICD-10 AUTO-FORMAT: A00.00
export function formatICD(val) {
  const bereinigt = String(val || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6);
  if (bereinigt.length <= 1) return bereinigt;
  if (!/^[A-Z]/.test(bereinigt)) return bereinigt.slice(0, 1);
  const buchstabe = bereinigt[0];
  const zahlen = bereinigt.slice(1).replace(/[^0-9]/g, "");
  if (zahlen.length <= 2) return buchstabe + zahlen;
  return buchstabe + zahlen.slice(0, 2) + "." + zahlen.slice(2);
}

function isIcdLike(value) {
  return /^[A-Za-z]\d{2}/.test(String(value || "").trim());
}

export function findeRegelFuerICD(code) {
  const norm = normalisiereICD(code);
  if (!norm) return null;
  const sorted = [...PRAEFIX_REGELN].sort((a, b) => b.praefix.length - a.praefix.length);
  return sorted.find((r) => norm.startsWith(r.praefix)) || null;
}

export function matchFreitext(text) {
  const raw = stripDiacritics(String(text || "").trim().toLowerCase());
  if (!raw) return null;
  const rawNoSpace = raw.replace(/\s+/g, "");
  const eingabeWoerter = significantWords(text);

  for (const [keyword, praefix] of Object.entries(FREITEXT_SYNONYME)) {
    const keywordNorm = stripDiacritics(keyword);
    if (raw.includes(keywordNorm) || rawNoSpace.includes(keywordNorm.replace(/\s+/g, ""))) {
      const regel = PRAEFIX_REGELN.find((r) => r.praefix === praefix);
      if (regel) return regel;
    }
  }

  if (eingabeWoerter.length === 0) return null;

  function woerterGleich(w1, w2) {
    if (w1 === w2) return true;
    const kurz = w1.length <= w2.length ? w1 : w2;
    const lang = w1.length <= w2.length ? w2 : w1;
    return kurz.length >= 6 && lang.startsWith(kurz);
  }

  let bester = null;
  let besterScore = 0;
  for (const regel of PRAEFIX_REGELN) {
    const labelWoerter = significantWords(regel.diagnose);
    if (labelWoerter.length === 0) continue;

    const kuerzer = eingabeWoerter.length <= labelWoerter.length ? eingabeWoerter : labelWoerter;
    const laenger = eingabeWoerter.length <= labelWoerter.length ? labelWoerter : eingabeWoerter;
    const vollstaendigEnthalten = kuerzer.every((w) => laenger.some((lw) => woerterGleich(w, lw)));

    if (vollstaendigEnthalten && kuerzer.length > besterScore) {
      bester = regel;
      besterScore = kuerzer.length;
    }
  }
  if (bester) return bester;

  const treffer = PRAEFIX_REGELN.find((r) => {
    const diagnoseLower = stripDiacritics(r.diagnose.toLowerCase());
    return diagnoseLower.includes(raw) || raw.includes(diagnoseLower);
  });

  return treffer || null;
}

export function resolveDiagnoseInput(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;

  if (isIcdLike(raw)) {
    return { icd10: normalisiereICD(raw), eingabe: raw, quelle: "icd10" };
  }

  const regel = matchFreitext(raw);
  if (regel) {
    return { icd10: regel.praefix, eingabe: raw, quelle: "freitext" };
  }

  return { icd10: normalisiereICD(raw), eingabe: raw, quelle: "freitext-unbekannt" };
}

// Kernlogik: aus einer Liste ICD-10-Codes (oder {icd10, eingabe, quelle}
// Objekten) die passende Diagnosegruppe + vorrangiges Heilmittel ermitteln.
// Anders als in der Physio-Version gibt es keine Zertifikatsprüfung mehr -
// es wird immer das erste (vorrangige) Heilmittel der Gruppe empfohlen.
export function berechneOptimum(icdCodes) {
  const ergebnisse = [];

  for (const rawEntry of icdCodes || []) {
    const entry = typeof rawEntry === "string" ? { icd10: rawEntry } : (rawEntry || {});
    const code = normalisiereICD(entry.icd10);
    const eingabe = entry.eingabe || code;
    const quelle = entry.quelle || "icd10";
    const regel = findeRegelFuerICD(code);

    if (!regel) {
      ergebnisse.push({ icd: code, eingabe, quelle, unbekannt: true });
      continue;
    }

    const gruppe = regel.gruppe;
    const katalog = HEILMITTEL_KATALOG[gruppe];
    if (!katalog) continue;

    const empfehlung = katalog.vorrangig[0];

    ergebnisse.push({
      icd: code,
      eingabe,
      quelle,
      diagnose: regel.diagnose,
      gruppe,
      gruppeLabel: katalog.label,
      empfehlung,
      alternativHeilmittel: katalog.vorrangig.slice(1),
      maxProVO: katalog.maxProVO,
      orientierendeMenge: katalog.orientierendeMenge,
      hinweis: katalog.hinweis || null,
      lhb: false,
      bvb: null,
      unbekannt: false
    });
  }

  return ergebnisse;
}

// High-Level-Einstieg für die UI: nimmt rohe Diagnose-Eingaben (Freitext ODER
// ICD-10), löst sie auf und berechnet die Empfehlung je Eingabe.
export function optimiereVerordnung(diagnoseInputs) {
  const resolved = (diagnoseInputs || []).map(resolveDiagnoseInput).filter(Boolean);
  return berechneOptimum(resolved);
}

// Leitsymptomatik ist bewusst vereinfacht auf drei generische Optionen A/B/C
// (siehe LEITSYMPTOMATIK_OPTIONEN in ui/views.js) statt eigener Formulierung
// je Diagnosegruppe. Als Vorbelegung wird die naheliegendste Option gewählt;
// der Therapeut kann sie im Formular per Checkbox anpassen/ergänzen.
export function getDefaultLeitsymptomatik(gruppe) {
  const g = String(gruppe || "");
  if (g.startsWith("PS")) return "c) Schädigung der mentalen/psychischen Funktion";
  if (g.startsWith("EN")) return "b) Schädigung der Sinnesfunktion / Wahrnehmung (sensomotorisch-perzeptiv)";
  return "a) Schädigung der Bewegungsfunktion (Motorik, Kraft, Koordination)";
}
