import { generateId } from "../core/utils.js";

export const APP_SCHEMA_VERSION = 3;
export const APP_VERSION = "1.1.0-ergo";
export const APP_MODULE = "ergo";

export const PRACTICE_ADDRESS = `Ergo Strobl
Schlüterstraße 3a
85057 Ingolstadt`;
export const PRACTICE_PHONE = "0841-45674267";

export function createEmptyAppData() {
  const now = new Date().toISOString();

  return {
    schemaVersion: APP_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    module: APP_MODULE,
    viewerCompatible: true,
    exportTimestamp: "",

    settings: {
      therapistId: generateId("therapist"),
      therapistName: "",
      therapistFax: "",
      practicePhone: PRACTICE_PHONE,
      practiceAddress: PRACTICE_ADDRESS,
      workDays: [],
      weeklyHours: "",
      fastStartDatum: "",
      stundenStartsaldoMinuten: 0,
      jahresurlaubTage: 0,
      fastiEnabled: true,
      supportUrl: "",
      buero: {
        email: ""
      },
      assessmentIntervalMonths: 3,
      createdAt: now,
      updatedAt: now
    },

    homes: [],

    doku: {
      version: 1
    },

    zeit: {
      version: 1,
      therapists: [],
      workModels: [],
      timeEntries: [],
      approvals: [],
      kilometer: [],
      reports: []
    },

    kilometer: {
      startPoint: {
        label: "",
        address: ""
      },
      knownRoutes: [],
      travelLog: [],
      kmExports: []
    },

    abwesenheiten: [],
    specialDays: [],
    stundenAbgleiche: [],
    aerzte: [],
    freikuvertHistory: [],

    abgabeHistory: [],
    nachbestellHistory: [],
    autoExportHistory: [],

    security: {
      log: [],
      lastSecurityChangeAt: ""
    },

    ui: {
      lastBackupAt: "",
      lastAutoExportAt: "",
      lastAutoBackupDownloadAt: "",
      lastDataChangeAt: "",
      lastFastiWeeklySummaryAt: ""
    }
  };
}