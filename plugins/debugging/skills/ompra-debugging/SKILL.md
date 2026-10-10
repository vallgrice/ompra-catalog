---
name: ompra-debugging
description: Investigate reproducible failures by testing hypotheses and verifying a focused root-cause fix. Use for bugs, crashes, and unexpected behavior.
license: MIT
metadata:
  author: Ompra contributors
  version: 1.0.0
---

# Root-cause debugging

Work from evidence. Label assumptions and do not claim that a plausible explanation is a confirmed cause.

1. Capture the symptom, expected behavior, environment, exact error, and smallest available reproduction. Inspect existing diagnostics and recent relevant changes.
2. Identify the failing boundary: input, state transition, filesystem, subprocess, network, rendering, or lifecycle. Form a small ranked set of hypotheses.
3. Test one hypothesis at a time using the least invasive useful check. Record what each observation rules in or out. Avoid broad rewrites and speculative dependency upgrades.
4. Reduce the reproduction. Compare the success and failure paths, including concurrency, cancellation, missing data, stale state, and platform differences when relevant.
5. Implement a minimal correction at the cause. Preserve public behavior outside the failing case and protect existing user work.
6. Run the reproduction again and a relevant regression check. Remove temporary instrumentation that is no longer useful.

Do not log tokens, passwords, full private payloads, or unrelated user data. Do not reset databases, delete profiles, disable protections, or make production changes merely to make a reproduction pass. If required evidence is unavailable, report the precise missing observation.

## Deliverable

State the confirmed cause, the trigger, the correction, and verification. Keep remaining hypotheses clearly separate from established facts.

