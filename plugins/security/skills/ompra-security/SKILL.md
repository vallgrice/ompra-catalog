---
name: ompra-security
description: Perform a defensive source review of trust boundaries, authorization, input handling, and sensitive data. Use when the user requests a security review.
license: MIT
metadata:
  author: Ompra contributors
  version: 1.0.0
---

# Security review

Perform a defensive review within the user's authorized project scope. This skill is guidance, not a security certification.

1. Identify assets, actors, entry points, trust boundaries, and the code paths affected by the change.
2. Trace untrusted input to sensitive operations: command execution, file paths, database queries, network destinations, HTML rendering, deserialization, and authorization checks.
3. Check authentication and authorization separately. Consider default behavior, missing or stale credentials, cross-user state, error paths, and permission changes.
4. Check secret handling and sensitive logs. Inspect storage and transport of credentials without printing their values or reading unrelated user profiles.
5. Validate suspected issues with source evidence or a small isolated reproduction using synthetic inputs. Do not probe third-party services, exploit production systems, or collect real personal data.
6. Rank confirmed issues by realistic impact and reachable preconditions. Recommend the smallest practical mitigation and a regression check.

Separate exploitable defects, hardening suggestions, and unavailable evidence. Do not infer safety solely from a dependency name, a passing test suite, or a scanner's lack of findings. Do not disable existing controls to make a workflow succeed.

## Deliverable

For each concrete finding, include the affected boundary, preconditions, impact, a narrow file reference, and the recommended mitigation. State the scope and validation limits.

