---
name: ompra-refactoring
description: Refactor a focused area while preserving observable behavior, public contracts, and repository conventions. Use for structural code cleanup.
license: MIT
metadata:
  author: Ompra contributors
  version: 1.0.0
---

# Safe refactoring

Treat preservation of existing behavior as an explicit constraint.

1. Understand the requested structural problem and its boundaries. Read project instructions, consumers, exports, types, configuration, and relevant tests.
2. State what will improve and which observable contracts must remain compatible. Keep bug fixes or behavior changes separate unless the user requested both.
3. Choose the smallest coherent transformation. Prefer existing project patterns and direct code over speculative abstractions.
4. Follow references before renaming or moving symbols. Use an available language server or repository search and check generated files, dynamic imports, configuration strings, and documentation.
5. Make a focused change without touching unrelated formatting or discarding existing modifications.
6. Run relevant type, lint, build, or test checks. Compare behavior at the original entry points, including errors and cancellation when affected.

Do not introduce a new dependency, framework, or broad architecture migration merely to remove a small duplication. If preserving compatibility is impossible, make the breaking contract and migration requirement explicit before dependent work proceeds.

## Deliverable

Describe the structural improvement, affected interfaces, verification results, and any compatibility limits.

