import { openDatabase } from "../storage/indexeddb.js";
import { hasSecuritySetup, loadCryptoMeta, loadSecurityState } from "../storage/secure-store.js";
import { setCryptoMeta, setSecurityState, getRuntimeData } from "./app-core.js";
import { createAutoLockController } from "../security/lock.js";
import { APP_VERSION } from "../data/schema.js";
import { isBackupReminderDue } from "../modules/backupReminder.js";
import {
  showSetupView,
  showLoginView,
  showDashboardView,
  performLock,
  resumeCurrentView,
  showBackupReminderModal
} from "../ui/views.js";

let autoLockController = null;

// Die App ist kein Offline-PWA mehr (Service Worker wurde entfernt, App
// funktioniert nur mit aktiver Internetverbindung). Bei Geräten, auf denen
// noch ein alter Service Worker aus einer früheren Version installiert ist,
// wird dieser hier deaktiviert, damit keine veralteten Dateien mehr aus
// einem Cache ausgeliefert werden.
async function removeLegacyServiceWorker() {
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
    if ("caches" in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }
  } catch (err) {
    console.error("Alter Service Worker konnte nicht entfernt werden:", err);
  }
}

function showVersionLabel() {
  const versionLabel = document.getElementById("appVersionLabel");
  if (versionLabel) {
    versionLabel.textContent = APP_VERSION;
  }
}

async function ensurePersistentStorage() {
  try {
    if (!navigator.storage || typeof navigator.storage.persist !== "function") {
      return { supported: false, persisted: false };
    }

    const alreadyPersisted = typeof navigator.storage.persisted === "function"
      ? await navigator.storage.persisted()
      : false;

    if (alreadyPersisted) {
      return { supported: true, persisted: true };
    }

    const granted = await navigator.storage.persist();
    return { supported: true, persisted: granted };
  } catch (err) {
    console.error("Persistent Storage Anfrage fehlgeschlagen:", err);
    return { supported: true, persisted: false, error: err };
  }
}

async function determineStartupState() {
  const setupExists = await hasSecuritySetup();
  return setupExists ? "login" : "setup";
}

function lockApp() {
  if (autoLockController) {
    autoLockController.stop();
  }

  performLock({
    onLocked: async () => {
      const state = await loadSecurityState();
      setSecurityState(state);
      showLoginView({ onSuccess: handleUnlocked });
    }
  });
}

function ensureAutoLock() {
  if (!autoLockController) {
    autoLockController = createAutoLockController(() => lockApp());
    autoLockController.bindActivityEvents();
  }
  autoLockController.start();
}

function handleUnlocked() {
  ensureAutoLock();
  resumeCurrentView({ onLock: lockApp });
  maybeShowBackupReminder();
}

// Zeigt beim Entsperren eine Erinnerung an das Viewer-Backup, sobald das
// konfigurierte Intervall abgelaufen ist (Vorgabe des Nutzers: aktuell im
// Testbetrieb täglich, künftig alle 4 Wochen - siehe
// modules/backupReminder.js). Kein automatischer Versand mehr (EmailJS
// wurde komplett entfernt): der Therapeut erledigt das Backup per Klick
// selbst (Download und/oder E-Mail-Programm mit vorbereitetem
// Anhangs-Hinweis öffnen), dadurch gibt es keinen unsichtbaren
// Fehlschlagpfad mehr.
function maybeShowBackupReminder() {
  const runtimeData = getRuntimeData();
  if (!runtimeData) {
    console.warn("Backup-Erinnerung: übersprungen, da beim Entsperren keine App-Daten im Speicher waren (runtimeData ist leer).");
    return;
  }

  if (!isBackupReminderDue(runtimeData)) return;

  // Das Modal blockiert währenddessen jede Interaktion mit der
  // dahinterliegenden Ansicht (volle Bildschirmüberdeckung), daher kann
  // sich dort in der Zwischenzeit nichts geändert haben - ein erneutes
  // resumeCurrentView() nach dem Schließen ist somit gefahrlos möglich und
  // sorgt dafür, dass z.B. die "Backup-Erinnerung"-Historie im Dashboard
  // sofort den gerade erledigten/verschobenen Stand zeigt, statt erst nach
  // der nächsten Navigation.
  showBackupReminderModal({ onDone: () => resumeCurrentView({ onLock: lockApp }) });
}

async function bootstrapApp() {
  showVersionLabel();
  await removeLegacyServiceWorker();

  const persistResult = await ensurePersistentStorage();
  if (persistResult.supported && !persistResult.persisted) {
    console.warn(
      "Persistenter Speicher wurde vom Browser nicht gewährt. " +
      "Die App-Daten könnten bei Speicherdruck vom System gelöscht werden. " +
      "Regelmäßige Backups werden dringend empfohlen."
    );
  }

  await openDatabase();

  const startupState = await determineStartupState();

  if (startupState === "setup") {
    showSetupView({
      onSuccess: handleUnlocked
    });
    return;
  }

  const cryptoMeta = await loadCryptoMeta();
  const securityState = await loadSecurityState();

  setCryptoMeta(cryptoMeta);
  setSecurityState(securityState);

  showLoginView({
    onSuccess: handleUnlocked
  });
}

bootstrapApp().catch((err) => {
  console.error(err);
  document.getElementById("app").innerHTML = `
    <div class="card">
      <h2>Startfehler</h2>
      <p>Die App konnte nicht gestartet werden.</p>
      <p class="error">${String(err?.message || err)}</p>
    </div>
  `;
});