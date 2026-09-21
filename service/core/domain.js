(function (global) {
  'use strict';

  const ns = global.NDPV2 = global.NDPV2 || {};
  const config = ns.config || (typeof require === 'function' ? require('./config.js') : null);

  class SimilarityPolicy {
    constructor(thresholds = config.adna.thresholds) {
      this.same = Number(thresholds.same);
      this.derivative = Number(thresholds.derivative);
      if (!(this.same > this.derivative && this.derivative >= 0 && this.same <= 1)) throw new Error('INVALID_SIMILARITY_POLICY');
    }
    verdict(value) {
      const similarity = Number(value);
      if (!Number.isFinite(similarity) || similarity < 0 || similarity > 1) throw new Error('INVALID_SIMILARITY');
      if (similarity >= this.same) return 'same';
      if (similarity >= this.derivative) return 'derivative';
      return 'different';
    }
    explain(verdict) {
      return {
        same: 'Высокая степень технического сходства.',
        derivative: 'Обнаружено техническое сходство, потенциально соответствующее производному произведению.',
        different: 'Сходство ниже установленного технического порога.'
      }[verdict] || 'Технический результат сравнения.';
    }
    toJSON() { return { same: this.same, derivative: this.derivative, different: `< ${this.derivative}` }; }
  }

  class RightsValidator {
    static validate(splits) {
      const errors = [];
      if (!Array.isArray(splits) || !splits.length) return { valid: false, total: 0, errors: ['RIGHTS_SPLITS_REQUIRED'] };
      let total = 0;
      for (const [index, split] of splits.entries()) {
        const share = Number(split.share);
        if (!Number.isFinite(share)) errors.push(`SPLIT_${index}_NOT_NUMBER`);
        else if (share < 0 || share > 100) errors.push(`SPLIT_${index}_OUT_OF_RANGE`);
        else total += share;
        if (!String(split.name || split.party_id || '').trim()) errors.push(`SPLIT_${index}_PARTY_REQUIRED`);
      }
      total = Math.round(total * 10000) / 10000;
      if (Math.abs(total - 100) > 0.0001) errors.push('RIGHTS_TOTAL_MUST_EQUAL_100');
      return { valid: errors.length === 0, total, errors };
    }
  }

  function aiPolicyFromLegacy(value) {
    const denied = value === 'Запрещено';
    const conditional = value === 'С условиями';
    return {
      training_allowed: !denied && !conditional,
      generation_allowed: !denied && !conditional,
      embedding_allowed: !denied,
      attribution_required: true,
      commercial_allowed: !denied,
      license_required: conditional || denied
    };
  }

  class NDTFactory {
    static fromTrack(track) {
      const provenance = Array.isArray(track.provenance) ? track.provenance : (track.parent ? [{
        source_track: track.parent,
        derived_track: track.id,
        relation_type: String(track.relationType || track.type || 'other').toLowerCase(),
        share: Number(track.relationShare || 0),
        license: track.licenseNote || null,
        created_at: track.created || null,
        verification: 'demo'
      }] : []);
      return {
        ndt_version: track.ndtVersion || config.ndt.version,
        ndt_standard: config.ndt.standard,
        identity: {
          ndp_id: track.id,
          title: track.title,
          artist: track.artist,
          isrc: track.isrc || null,
          label: track.label || null,
          release: track.release || null
        },
        music: {
          duration: track.duration || null,
          bpm: track.bpm ?? null,
          key: track.key || null,
          genre: track.genre || null,
          format: track.format || null
        },
        integrity: {
          fingerprint_version: track.fingerprintVersion || config.adna.version,
          fingerprint_status: String(track.fingerprint || '').includes('ДЕМО') || String(track.fingerprint || '').includes('DEMO') ? 'demo' : 'declared',
          fingerprint: track.fingerprint || null
        },
        rights: {
          splits: (track.splits || []).map((split, index) => ({
            party_id: split.party_id || `party-${index + 1}`,
            name: split.name || null,
            role: split.role || 'unknown',
            share: Number(split.share || 0),
            payment_reference: split.payment_reference || null,
            license_reference: split.license_reference || null
          }))
        },
        licenses: Array.isArray(track.licenses) ? track.licenses : (track.licenseNote ? [{ type: 'note', terms: track.licenseNote }] : []),
        provenance,
        ai_policy: track.aiPolicy || aiPolicyFromLegacy(track.aiLicense),
        status: track.status || 'Draft'
      };
    }
  }

  class NDTValidator {
    static validate(ndt) {
      const errors = [];
      if (!ndt || typeof ndt !== 'object') return { valid: false, errors: ['NDT_REQUIRED'] };
      if (ndt.ndt_version !== config.ndt.version) errors.push('NDT_VERSION_UNSUPPORTED');
      if (!ndt.identity?.ndp_id) errors.push('NDP_ID_REQUIRED');
      if (!ndt.identity?.title) errors.push('TITLE_REQUIRED');
      const rights = RightsValidator.validate(ndt.rights?.splits);
      errors.push(...rights.errors);
      if (!ndt.ai_policy || typeof ndt.ai_policy !== 'object') errors.push('AI_POLICY_REQUIRED');
      return { valid: errors.length === 0, errors, rightsTotal: rights.total };
    }
  }

  class ProvenanceGraphService {
    constructor(tracks = [], maxDepth = config.graph.maxDepth) {
      this.maxDepth = maxDepth;
      this.nodes = new Map(tracks.map(track => [track.id, track]));
      this.edges = [];
      for (const track of tracks) {
        const explicit = Array.isArray(track.provenance) ? track.provenance : [];
        if (explicit.length) {
          for (const edge of explicit) this.edges.push({ ...edge, derived_track: edge.derived_track || track.id });
        } else if (track.parent) {
          this.edges.push({ source_track: track.parent, derived_track: track.id, relation_type: String(track.relationType || track.type || 'other').toLowerCase(), share: Number(track.relationShare || 0), verification: 'demo' });
        }
      }
    }
    parents(id) { return this.edges.filter(e => e.derived_track === id).map(e => ({ edge: e, track: this.nodes.get(e.source_track) })).filter(x => x.track); }
    children(id) { return this.edges.filter(e => e.source_track === id).map(e => ({ edge: e, track: this.nodes.get(e.derived_track) })).filter(x => x.track); }
    hasPath(from, to, seen = new Set()) {
      if (from === to) return true;
      if (seen.has(from)) return false;
      seen.add(from);
      return this.children(from).some(({ track }) => this.hasPath(track.id, to, seen));
    }
    depthFrom(id, seen = new Set()) {
      if (seen.has(id)) return Infinity;
      const next = new Set(seen); next.add(id);
      const children = this.children(id);
      if (!children.length) return 1;
      return 1 + Math.max(...children.map(({ track }) => this.depthFrom(track.id, next)));
    }
    canAddEdge(edge) {
      if (!edge?.source_track || !edge?.derived_track) return { ok: false, reason: 'EDGE_ENDPOINT_REQUIRED' };
      if (edge.source_track === edge.derived_track || this.hasPath(edge.derived_track, edge.source_track)) return { ok: false, reason: 'GRAPH_CYCLE' };
      const clone = new ProvenanceGraphService([...this.nodes.values()], this.maxDepth);
      if (!clone.nodes.has(edge.source_track)) clone.nodes.set(edge.source_track, { id: edge.source_track });
      if (!clone.nodes.has(edge.derived_track)) clone.nodes.set(edge.derived_track, { id: edge.derived_track });
      clone.edges = [...this.edges, edge];
      const roots = [...clone.nodes.keys()].filter(id => clone.parents(id).length === 0);
      const max = roots.length ? Math.max(...roots.map(id => clone.depthFrom(id))) : 1;
      if (max > this.maxDepth) return { ok: false, reason: 'GRAPH_MAX_DEPTH' };
      return { ok: true };
    }
    lineage(id) {
      const out = [];
      const walkParents = (current, depth, seen) => {
        if (depth > this.maxDepth || seen.has(current)) return;
        const next = new Set(seen); next.add(current);
        for (const p of this.parents(current)) { walkParents(p.track.id, depth + 1, next); out.push({ ...p, direction: 'ancestor', depth }); }
      };
      walkParents(id, 1, new Set());
      out.push({ track: this.nodes.get(id), edge: null, direction: 'selected', depth: 0 });
      const seenChildren = new Set([id]);
      const queue = this.children(id).map(x => ({ ...x, depth: 1 }));
      while (queue.length) {
        const item = queue.shift();
        if (!item.track || seenChildren.has(item.track.id) || item.depth > this.maxDepth) continue;
        seenChildren.add(item.track.id); out.push({ ...item, direction: 'descendant' });
        queue.push(...this.children(item.track.id).map(x => ({ ...x, depth: item.depth + 1 })));
      }
      return out;
    }
  }

  class RoyaltyEngine {
    static _allocate(amountCents, splits) {
      const validation = RightsValidator.validate(splits);
      if (!validation.valid) throw new Error(validation.errors.join(','));
      let allocated = 0;
      return splits.map((split, index) => {
        const cents = index === splits.length - 1 ? amountCents - allocated : Math.round(amountCents * Number(split.share) / 100);
        allocated += cents;
        return { ...split, amount_cents: cents };
      });
    }
    calculate({ event, track, tracks = [] }) {
      if (!event || !track) throw new Error('ROYALTY_INPUT_REQUIRED');
      const amountCents = Math.round(Number(event.gross_amount) * 100);
      if (!Number.isFinite(amountCents) || amountCents < 0) throw new Error('INVALID_GROSS_AMOUNT');
      const graph = new ProvenanceGraphService(tracks);
      const upstream = graph.parents(track.id).filter(({ edge }) => Number(edge.share) > 0);
      const upstreamPct = upstream.reduce((sum, x) => sum + Number(x.edge.share || 0), 0);
      if (upstreamPct > 100) throw new Error('PROVENANCE_SHARE_OVER_100');
      const breakdown = [];
      let upstreamCents = 0;
      for (const { edge, track: source } of upstream) {
        const pool = Math.round(amountCents * Number(edge.share) / 100); upstreamCents += pool;
        const allocations = RoyaltyEngine._allocate(pool, source.splits || []);
        for (const row of allocations) breakdown.push({ level: 'provenance', source_track: source.id, relation_type: edge.relation_type, party: row.name, role: row.role, share_of_pool: row.share, amount_cents: row.amount_cents });
      }
      const directPool = amountCents - upstreamCents;
      for (const row of RoyaltyEngine._allocate(directPool, track.splits || [])) breakdown.push({ level: 'track', source_track: track.id, party: row.name, role: row.role, share_of_pool: row.share, amount_cents: row.amount_cents });
      return {
        statement_id: `RST-${String(event.event_id || 'DEMO').replace(/[^A-Z0-9-]/gi, '')}`,
        status: 'Calculated',
        currency: event.currency || 'RUB',
        gross_amount_cents: amountCents,
        breakdown,
        total_amount_cents: breakdown.reduce((s, r) => s + r.amount_cents, 0),
        explanation: { upstream_percent: upstreamPct, direct_pool_percent: 100 - upstreamPct }
      };
    }
  }

  class DemoFingerprintEngine {
    constructor(policy = new SimilarityPolicy()) { this.policy = policy; this.version = config.adna.version; }
    resultForSeed(seed, tracks) {
      const list = Array.isArray(tracks) ? tracks : [];
      if (!list.length) return { track: null, similarity: 0, verdict: 'different' };
      const track = list[Math.abs(seed) % list.length];
      const similarity = seed % 5 === 0 ? 0.68 : (seed % 3 === 0 ? 0.83 : Math.min(0.99, 0.93 + (seed % 6) / 100));
      return { track, similarity, verdict: this.policy.verdict(similarity), fingerprint_version: this.version, demo: true };
    }
  }

  class DemoPaymentProvider {
    prepare(statement) { return { provider: 'demo', status: 'Payment Prepared', demo: true, statement_id: statement.statement_id }; }
  }
  class SbpPaymentProvider { prepare() { throw new Error('SBP_PRODUCTION_INTEGRATION_REQUIRED'); } }
  class DigitalRubleProvider { prepare() { throw new Error('DIGITAL_RUBLE_PRODUCTION_INTEGRATION_REQUIRED'); } }

  Object.assign(ns, { SimilarityPolicy, RightsValidator, NDTFactory, NDTValidator, ProvenanceGraphService, RoyaltyEngine, DemoFingerprintEngine, DemoPaymentProvider, SbpPaymentProvider, DigitalRubleProvider, aiPolicyFromLegacy });
  if (typeof module !== 'undefined' && module.exports) module.exports = { SimilarityPolicy, RightsValidator, NDTFactory, NDTValidator, ProvenanceGraphService, RoyaltyEngine, DemoFingerprintEngine, DemoPaymentProvider, SbpPaymentProvider, DigitalRubleProvider, aiPolicyFromLegacy };
})(typeof window !== 'undefined' ? window : globalThis);
