(function (global) {
  'use strict';

  const ns = global.NDPV2 = global.NDPV2 || {};
  const runtime = global.NDP_RUNTIME || { mode: 'demo', apiBaseUrl: '' };
  const config = Object.freeze({
    appVersion: '2.0.0',
    schemaVersion: 2,
    ndt: Object.freeze({ version: '1.0', standard: 'NDP NDT' }),
    api: Object.freeze({ version: 'v1', baseUrl: String(runtime.apiBaseUrl || ''), mode: runtime.mode === 'server' ? 'server' : 'demo' }),
    adna: Object.freeze({
      version: 'v1',
      fingerprintBytes: 256,
      thresholds: Object.freeze({ same: 0.90, derivative: 0.75 }),
      upload: Object.freeze({ maxBytes: 32 * 1024 * 1024, timeoutMs: 15000 })
    }),
    graph: Object.freeze({ maxDepth: 10 }),
    storage: Object.freeze({
      metaKey: 'ndp_v2_meta',
      auditKey: 'ndp_v2_audit',
      backupKey: 'ndp_v2_migration_backup'
    })
  });

  ns.config = config;
  if (typeof module !== 'undefined' && module.exports) module.exports = config;
})(typeof window !== 'undefined' ? window : globalThis);
