# Recorded synthetic fixtures

All twelve account records are invented and frozen in `src/domain.js` as `FIXTURES`. `makeExtraction()` produces the recorded extraction contract for an allowlisted fixture. The demo does not call an inference service. Account facts come from synthetic fixtures; the verified public excerpt catalog supports company-pay capabilities only, not real customer eligibility, market availability, setup success or commercial outcomes.

The three profiles vary assumed language, setup and support. They do not describe actual market policy. Company-pay app rides are in scope. Employee-pay and Ride Booker are excluded.

`record_extraction` validates exact source/claim/excerpt references, mandatory fields and fixture facts. Unknown fields, unsupported evidence, conflicting facts and instruction-like text are rejected and recorded in the synthetic review log. Confidence is displayed metadata; it cannot override missing provenance. Evidence older than seven simulated days or dated in the future escalates to an owner.
