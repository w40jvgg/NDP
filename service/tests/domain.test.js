const assert = require('assert');
global.NDPV2 = {};
require('../core/config.js');
const d = require('../core/domain.js');

const policy = new d.SimilarityPolicy();
const same = global.NDPV2.config.adna.thresholds.same;
const derivative = global.NDPV2.config.adna.thresholds.derivative;
assert.equal(policy.verdict(same), 'same');
assert.equal(policy.verdict(same - 0.0001), 'derivative');
assert.equal(policy.verdict(derivative), 'derivative');
assert.equal(policy.verdict(derivative - 0.0001), 'different');

for (const [splits, ok] of [
  [[{name:'A',share:70},{name:'B',share:30}], true],
  [[{name:'A',share:50},{name:'B',share:50}], true],
  [[{name:'A',share:70},{name:'B',share:31}], false],
  [[{name:'A',share:70},{name:'B',share:20}], false],
  [[{name:'A',share:-1},{name:'B',share:101}], false]
]) assert.equal(d.RightsValidator.validate(splits).valid, ok);

const tracks = [
  {id:'A', title:'A', artist:'A', splits:[{name:'A', role:'author', share:100}]},
  {id:'B', title:'B', artist:'B', parent:'A', relationShare:10, splits:[{name:'B', role:'author', share:100}]},
  {id:'C', title:'C', artist:'C', parent:'B', relationShare:20, splits:[{name:'C', role:'author', share:100}]}
];
const graph = new d.ProvenanceGraphService(tracks);
assert.equal(graph.canAddEdge({source_track:'C', derived_track:'A'}).ok, false);
assert.equal(graph.canAddEdge({source_track:'A', derived_track:'C'}).ok, true);

const ndt = d.NDTFactory.fromTrack({id:'ND-1',title:'Track',artist:'Artist',splits:[{name:'Artist',role:'author',share:100}],aiLicense:'С условиями'});
assert.equal(d.NDTValidator.validate(ndt).valid, true);

const statement = new d.RoyaltyEngine().calculate({event:{event_id:'EV-1',gross_amount:1000,currency:'RUB'},track:tracks[2],tracks});
assert.equal(statement.total_amount_cents, 100000);
assert.equal(statement.status, 'Calculated');


// Configured max depth must reject the next edge beyond the allowed chain.
const maxDepth = global.NDPV2.config.graph.maxDepth;
const deepTracks = Array.from({ length: maxDepth }, (_, i) => ({
  id: `D${i}`,
  splits: [{ name: `P${i}`, role: 'author', share: 100 }],
  provenance: i === 0 ? [] : [{ source_track: `D${i-1}`, derived_track: `D${i}`, relation_type: 'derivative', share: 0 }]
}));
const deepGraph = new d.ProvenanceGraphService(deepTracks, maxDepth);
assert.equal(deepGraph.canAddEdge({ source_track: `D${maxDepth-1}`, derived_track: 'D_NEXT', relation_type: 'derivative', share: 0 }).reason, 'GRAPH_MAX_DEPTH');

console.log('NDP V2 domain tests: OK');
