(function (global) {
  'use strict';
  const ns = global.NDPV2 = global.NDPV2 || {};
  const config = ns.config || (typeof require === 'function' ? require('./config.js') : null);

  class LocalRepository {
    constructor(storage) { this.storage = storage || global.localStorage || null; }
    getRaw(key, fallback = null) {
      try { const value = this.storage?.getItem(key); return value ? JSON.parse(value) : fallback; } catch (_) { return fallback; }
    }
    setRaw(key, value) { this.storage?.setItem(key, JSON.stringify(value)); return value; }
    remove(key) { this.storage?.removeItem(key); }
    getText(key, fallback = '') { try { return this.storage?.getItem(key) ?? fallback; } catch (_) { return fallback; } }
    setText(key, value) { this.storage?.setItem(key, String(value)); }
    audit(event, payload = {}) {
      const rows = this.getRaw(config.storage.auditKey, []);
      rows.unshift({ id: `AUD-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, timestamp: new Date().toISOString(), event, payload });
      this.setRaw(config.storage.auditKey, rows.slice(0, 500));
    }
    migrateLegacy(keys = {}) {
      const meta = this.getRaw(config.storage.metaKey, { schemaVersion: 1 });
      if (Number(meta.schemaVersion) >= config.schemaVersion) return { migrated: false, from: meta.schemaVersion, to: config.schemaVersion };
      const backup = {};
      for (const key of Object.values(keys)) if (typeof key === 'string') backup[key] = this.getRaw(key, this.getText(key, null));
      this.setRaw(config.storage.backupKey, { created_at: new Date().toISOString(), schemaVersion: meta.schemaVersion || 1, data: backup });
      if (keys.tracks) {
        const tracks = this.getRaw(keys.tracks, []);
        for (const track of tracks) {
          track.ndtVersion ||= config.ndt.version;
          track.fingerprintVersion ||= config.adna.version;
          if (!Array.isArray(track.provenance)) track.provenance = track.parent ? [{ source_track: track.parent, derived_track: track.id, relation_type: String(track.relationType || track.type || 'other').toLowerCase(), share: Number(track.relationShare || 0), license: track.licenseNote || null, verification: 'demo' }] : [];
          if (!track.aiPolicy && ns.aiPolicyFromLegacy) track.aiPolicy = ns.aiPolicyFromLegacy(track.aiLicense);
        }
        this.setRaw(keys.tracks, tracks);
      }
      this.setRaw(config.storage.metaKey, { schemaVersion: config.schemaVersion, appVersion: config.appVersion, migrated_at: new Date().toISOString() });
      this.audit('StorageMigrated', { from: meta.schemaVersion || 1, to: config.schemaVersion });
      return { migrated: true, from: meta.schemaVersion || 1, to: config.schemaVersion };
    }
    exportBackup(keys = {}) {
      const data = {};
      for (const [name, key] of Object.entries(keys)) {
        if (typeof key !== 'string') continue;
        const raw = this.storage?.getItem(key);
        data[name] = raw == null ? null : (() => { try { return JSON.parse(raw); } catch (_) { return raw; } })();
      }
      data.audit = this.getRaw(config.storage.auditKey, []);
      return { format: 'NDP Backup', backup_version: 1, app_version: config.appVersion, schema_version: config.schemaVersion, exported_at: new Date().toISOString(), data };
    }
    importBackup(backup, keys = {}) {
      if (!backup || backup.format !== 'NDP Backup' || typeof backup.data !== 'object') throw new Error('INVALID_NDP_BACKUP');
      for (const [name, key] of Object.entries(keys)) {
        if (typeof key !== 'string' || !(name in backup.data) || backup.data[name] == null) continue;
        const value = backup.data[name];
        if (typeof value === 'string') this.setText(key, value); else this.setRaw(key, value);
      }
      if (Array.isArray(backup.data.audit)) this.setRaw(config.storage.auditKey, backup.data.audit);
      this.setRaw(config.storage.metaKey, { schemaVersion: config.schemaVersion, appVersion: config.appVersion, imported_at: new Date().toISOString() });
      this.audit('BackupImported', { backup_version: backup.backup_version || 1 });
      return true;
    }
  }

  ns.LocalRepository = LocalRepository;
  if (typeof module !== 'undefined' && module.exports) module.exports = { LocalRepository };
})(typeof window !== 'undefined' ? window : globalThis);
