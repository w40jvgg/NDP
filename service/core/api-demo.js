(function (global) {
  'use strict';
  const ns = global.NDPV2 = global.NDPV2 || {};
  class DemoApi {
    constructor({ getTracks }) { this.getTracks = getTracks; this.policy = new ns.SimilarityPolicy(); this.engine = new ns.DemoFingerprintEngine(this.policy); }
    stats() { const tracks = this.getTracks(); return { mode: 'demo', registry_size: tracks.length, fingerprint_version: ns.config.adna.version, thresholds: this.policy.toJSON() }; }
    identify(seed) { const tracks = this.getTracks(); const match = this.engine.resultForSeed(Number(seed) || 0, tracks); return { registry_size: tracks.length, fingerprint_version: ns.config.adna.version, match }; }
    compare(similarity) { const value = Number(similarity); return { similarity: value, verdict: this.policy.verdict(value), explanation: this.policy.explain(this.policy.verdict(value)) }; }
    getTrack(id) { const track = this.getTracks().find(t => t.id === id || t.isrc === id); return track ? ns.NDTFactory.fromTrack(track) : null; }
    getRights(id) { return this.getTrack(id)?.rights || null; }
    getGraph(id) { return new ns.ProvenanceGraphService(this.getTracks()).lineage(id); }
    calculateRoyalty(input) { const tracks = this.getTracks(); const track = tracks.find(t => t.id === input.track_id); if (!track) throw new Error('TRACK_NOT_FOUND'); return new ns.RoyaltyEngine().calculate({ event: input, track, tracks }); }
  }
  ns.DemoApi = DemoApi;
  if (typeof module !== 'undefined' && module.exports) module.exports = { DemoApi };
})(typeof window !== 'undefined' ? window : globalThis);
