(function (global) {
  'use strict';
  const ns = global.NDPV2 = global.NDPV2 || {};

  class ServerApi {
    constructor(baseUrl = ns.config.api.baseUrl) { this.baseUrl = String(baseUrl || '').replace(/\/$/, ''); }
    async request(path, options = {}) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), ns.config.adna.upload.timeoutMs);
      try {
        const response = await fetch(`${this.baseUrl}${path}`, { ...options, signal: controller.signal, headers: { Accept: 'application/json', ...(options.headers || {}) } });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          const error = new Error(body?.error?.message || `HTTP_${response.status}`);
          error.code = body?.error?.code || `HTTP_${response.status}`;
          error.requestId = body?.error?.request_id || null;
          throw error;
        }
        return body;
      } finally { clearTimeout(timer); }
    }
    stats() { return this.request('/oracle/stats'); }
    identifyFile(file) { const data = new FormData(); data.append('file', file, 'audio-upload'); return this.request('/oracle/identify_file', { method: 'POST', body: data }); }
    identify(adna, version = 'v1') { return this.request('/api/v1/adna/identify', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ adna, fingerprint_version: version }) }); }
    compare(left, right, version = 'v1') { return this.request('/api/v1/adna/compare', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ left, right, version }) }); }
    getTrack(id) { return this.request(`/api/v1/registry/tracks/${encodeURIComponent(id)}`); }
    getRights(id) { return this.request(`/api/v1/rights/${encodeURIComponent(id)}`); }
    getGraph(id) { return this.request(`/api/v1/graph/${encodeURIComponent(id)}`); }
    calculateRoyalty(event) { return this.request('/api/v1/royalties/calculate', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(event) }); }
  }

  ns.ServerApi = ServerApi;
  if (typeof module !== 'undefined' && module.exports) module.exports = { ServerApi };
})(typeof window !== 'undefined' ? window : globalThis);
