---
name: ompra-testing
description: Plan and implement meaningful tests for observable behavior, failure modes, and regressions. Use when the user asks for testing or test coverage.
license: MIT
metadata:
  author: Ompra contributors
  version: 1.0.0
---

# Meaningful tests

Start from what the user or caller should observe, not from the implementation's internal branches.

1. Read project instructions, test configuration, nearby tests, and the affected public interface. Use the existing framework and helpers.
2. Write a compact list of cases: a successful flow, the regression trigger, relevant boundary values, and realistic failure or cancellation paths. Include only cases justified by the change.
3. Prefer assertions on returned values, persisted state, accessibility, or visible output. Avoid tests that merely restate a private helper or snapshot incidental formatting.
4. Keep network, filesystem, clocks, subprocesses, and user profiles isolated. Never use real account credentials or production resources. Mock only external boundaries whose behavior is outside the test's scope.
5. Add the smallest useful set of tests. When fixing a bug, demonstrate that the regression test fails for the original behavior if practical and safe.
6. Run the most relevant suite and required type or lint checks. Expand testing only when a failure, shared dependency, or unresolved concern justifies it.

For trivial reversible presentation changes, a focused manual or render check may be more valuable than new unit tests. Explain this choice when relevant. Do not install dependencies or start costly integration services without scope support.

## Deliverable

Summarize behavior covered, commands run, actual results, and remaining gaps. Mark skipped or unavailable checks explicitly.

