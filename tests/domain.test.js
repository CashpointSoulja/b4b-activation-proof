import test from 'node:test';
import assert from 'node:assert/strict';
import * as domain from '../src/domain.js';
import {runEvaluations} from '../src/evaluation.js';

const report = runEvaluations();
test('evaluation matrix executes at least twenty failure and boundary cases', () => {
  assert.ok(report.total >= 20);
  assert.equal(new Set(report.cases.map(item => item.id)).size, report.total);
});
for (const item of report.cases) test(item.title, () => {
  assert.equal(item.pass, true, `${item.id}: expected ${JSON.stringify(item.expected)}, actual ${JSON.stringify(item.actual)}`);
});
test('intentionally broken extraction rule produces RED through dependency injection', () => {
  const broken = runEvaluations({broken: true});
  assert.equal(broken.status, 'RED');
  assert.ok(broken.failed >= 1);
  assert.equal(broken.cases.find(item => item.id === 'extraction-hallucinated').pass, false);
  const injected = runEvaluations({domain: {...domain, validateExtraction: () => ({valid: true, errors: []})}});
  assert.equal(injected.status, 'RED');
});
test('repeated evaluations are deterministic and do not mutate frozen fixture data', () => {
  const sources = JSON.stringify(domain.SOURCE_CATALOG);
  const fixtures = JSON.stringify(domain.FIXTURES);
  assert.deepEqual(runEvaluations(), runEvaluations());
  assert.equal(JSON.stringify(domain.SOURCE_CATALOG), sources);
  assert.equal(JSON.stringify(domain.FIXTURES), fixtures);
  assert.equal(domain.seedState().now, '2026-10-13T12:00:00.000Z');
});
test('all accepted domain commands preserve their input state', () => {
  const state = domain.seedState(); const snapshot = structuredClone(state);
  const result = domain.applyCommand(state, {type: 'resolve_prerequisite', accountId: 'uk-lumen', prerequisite: 'billing', expectedRevision: 0});
  assert.equal(result.ok, true);
  assert.deepEqual(state, snapshot);
  assert.notEqual(result.state, state);
  assert.equal(result.state.accounts.find(item => item.id === 'uk-lumen').readiness.ready, true);
});
test('ordinary event accumulation hits the serialized state cap atomically', () => {
  let state = domain.seedState(); let rejected;
  for (let index = 0; index < domain.LIMITS.receipts; index++) {
    const snapshot = structuredClone(state);
    const outcome = domain.applyCommand(state, {type: 'simulate_order', accountId: 'uk-harbor', eventId: `state-cap-event-${index}`, expectedRevision: state.revision});
    if (!outcome.ok) {
      rejected = outcome;
      assert.equal(outcome.error.code, 'LIMIT_REACHED');
      assert.match(outcome.error.message, /state size cap/);
      assert.equal(outcome.state, state);
      assert.deepEqual(state, snapshot);
      assert.ok(state.receipts.length < domain.LIMITS.receipts, 'serialized byte cap is reached before receipt count cap');
      break;
    }
    state = outcome.state;
    assert.ok(new TextEncoder().encode(JSON.stringify(state)).byteLength <= domain.LIMITS.stateBytes);
  }
  assert.ok(rejected, 'real bounded commands reach the serialized state cap');
});
test('audit retention trims exactly the oldest entry and counts the trim', () => {
  const state = domain.seedState();
  state.audit = Array.from({length: domain.LIMITS.audit}, (_, index) => ({id: `audit-existing-${index}`, at: domain.SIMULATION_START, type: 'select_market', result: {marketId: 'uk'}}));
  const originalAudit = structuredClone(state.audit);
  const result = domain.applyCommand(state, {type: 'select_market', marketId: 'lt', expectedRevision: state.revision});
  assert.equal(result.ok, true);
  assert.equal(result.state.audit.length, domain.LIMITS.audit);
  assert.equal(result.state.auditTrimmed, 1);
  assert.equal(result.state.audit[0].id, 'audit-existing-1');
  assert.equal(result.state.audit.at(-1).type, 'select_market');
  assert.equal(result.state.audit.at(-1).result.marketId, 'lt');
  assert.deepEqual(state.audit, originalAudit);
});
