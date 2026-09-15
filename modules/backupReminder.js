import { finalizeAppStructure } from "../data/normalization.js";
import { mutateRuntimeData, queuePersistRuntimeData } from "../core/app-core.js";

// Regelmäßige Erinnerung an das Viewer-Backup. Vorher (bis inkl. Session 7)
// wurde die Backup-ZIP automatisch im Hintergrund per EmailJS verschickt -
// das ließ sich aus der Entwicklungsumgebung heraus nie gegen den echten
// EmailJS-Dienst verifizieren und blieb bei echten Fehlschlägen für den
// Therapeuten unsichtbar. Auf Nutzerwunsch komplett entfernt: EmailJS wird
// nirgends mehr in der App verwendet. Stattdessen zeigt die App beim
// Öffnen eine Erinnerung an, die der Therapeut per Klick selbst erledigt
// (Backup herunterladen und/oder E-Mail-Programm mit vorbereitetem
// Anhangs-Hinweis öffnen) - dadurch gibt es keinen unsichtbaren
// Fehlschlagpfad mehr, der Therapeut sieht direkt, ob das Backup
// tatsächlich erstellt wurde.
//
// Vorgabe des Nutzers: nach abgeschlossenem Testbetrieb auf alle 4 Wochen
// umgestellt (vorher täglich zum Testen) - die Kalendertag-Zählung in
// isBackupReminderDue() funktioniert unverändert für jeden Intervallwert.
const BACKUP_REMINDER_INTERVAL_DAYS = 28;

// Vorausgefüllte Zieladresse für den mailto-Link (Vorgabe des Nutzers,
// unverändert aus der vorherigen EmailJS-Version). Der Therapeut kann sie
// im geöffneten E-Mail-Programm bei Bedarf noch ändern.
const BACKUP_REMINDER_TARGET_EMAIL = "physio_fast@gmx.de";

// PIN, mit der die heruntergeladene ZIP-Datei im Viewer entsperrt werden
// kann (Vorgabe des Nutzers: PIN 1550) - unverändert aus der vorherigen
// Version, nur der Zustellweg hat sich geändert (Download/mailto statt
// automatischem EmailJS-Versand).
const BACKUP_ZIP_PIN = "1550";

// Zählt volle Kalendertage zwischen zwei Zeitpunkten (lokale Zeitzone),
// nicht volle 24-Stunden-Intervalle - damit die Erinnerung z.B. um 23:50
// Uhr und die nächste schon um 00:10 Uhr (nur 20 Minuten später, aber nach
// Mitternacht) bereits fällig ist, statt eines starren 24h-Countdowns ab
// der letzten Erledigung.
function daysBetweenLocalDates(earlier, later) {
  const a = new Date(earlier.getFullYear(), earlier.getMonth(), earlier.getDate());
  const b = new Date(later.getFullYear(), later.getMonth(), later.getDate());
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function isBackupReminderDue(data) {
  const lastAt = data?.ui?.lastAutoExportAt;
  if (!lastAt) return true;

  const lastDate = new Date(lastAt);
  if (Number.isNaN(lastDate.getTime())) return true;

  return daysBetweenLocalDates(lastDate, new Date()) >= BACKUP_REMINDER_INTERVAL_DAYS;
}

function requireZip() {
  if (!globalThis.zip) {
    throw new Error("ZIP Bibliothek ist nicht geladen");
  }
  return globalThis.zip;
}

function sanitizeFilenamePart(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Baut die Viewer-Backup-ZIP: enthält eine einzige Datei (appData.json)
// mit dem vollständigen, unverschlüsselten JSON-Stand aller App-Daten -
// anders als das manuelle Backup in den Einstellungen keine appData.enc/
// cryptoMeta.json, da der Viewer die Daten direkt (nur per ZIP-PIN
// geschützt) lesen soll, ohne den Praxispasswort-Krypto-Stack der App zu
// benötigen.
export async function buildBackupZip(runtimeData) {
  const normalized = finalizeAppStructure(runtimeData);
  const zipLib = requireZip();
  const writer = new zipLib.ZipWriter(new zipLib.BlobWriter("application/zip"));
  await writer.add(
    "appData.json",
    new zipLib.TextReader(JSON.stringify(normalized, null, 2)),
    { password: BACKUP_ZIP_PIN, encryptionStrength: 3 }
  );

  const blob = await writer.close();
  const stamp = normalized.exportTimestamp.replace(/[:T]/g, "-").slice(0, 16);
  const therapistSlug = sanitizeFilenamePart(normalized.settings?.therapistName) || "therapeut";
  const filename = `FaSt-Doku-Viewer-Backup-${therapistSlug}-${stamp}.zip`;
  return { blob, filename };
}

// mailto kann aus Sicherheitsgründen keine Dateianhänge setzen - die ZIP
// muss vorher separat heruntergeladen und dann vom Therapeuten manuell an
// die geöffnete E-Mail angehängt werden. Der Text weist darauf explizit hin.
export function buildBackupReminderMailtoLink({ filename, therapistName }) {
  const subject = `Backup ${therapistName || "Therapeut"}`;
  const body = `Bitte die soeben heruntergeladene Datei "${filename}" manuell anhängen.`;
  return `mailto:${BACKUP_REMINDER_TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function pushBackupReminderHistory(data, status, message) {
  if (!Array.isArray(data.autoExportHistory)) data.autoExportHistory = [];
  data.autoExportHistory.unshift({
    id: `autoexport_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
    status,
    message: String(message || "")
  });
  data.autoExportHistory = data.autoExportHistory.slice(0, 20);
}

// Wird aufgerufen, sobald der Therapeut die Erinnerung tatsächlich erledigt
// hat (Backup heruntergeladen und/oder E-Mail-Programm geöffnet). Setzt den
// Fälligkeitszeitpunkt zurück, damit die Erinnerung erst nach dem nächsten
// vollen Intervall erneut erscheint.
export async function markBackupReminderHandled(message) {
  mutateRuntimeData((data) => {
    data.ui.lastAutoExportAt = new Date().toISOString();
    pushBackupReminderHistory(data, "handled", message);
  });
  await queuePersistRuntimeData();
}

// Wird aufgerufen, wenn der Therapeut die Erinnerung wegklickt, ohne ein
// Backup zu erstellen - der Fälligkeitszeitpunkt bleibt bewusst
// unverändert, damit die Erinnerung beim nächsten Öffnen der App erneut
// erscheint statt für ein ganzes Intervall zu verschwinden.
export async function markBackupReminderPostponed() {
  mutateRuntimeData((data) => {
    pushBackupReminderHistory(data, "postponed", "Erinnerung verschoben - erscheint beim nächsten Öffnen der App erneut.");
  });
  await queuePersistRuntimeData();
}
