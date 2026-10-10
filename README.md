# 🧩 Ompra Catalog

**English** · [Українська](README.uk.md)

**Curated plugins and skills for your Ompra workspace.**

[![License: MIT](https://img.shields.io/badge/license-MIT-64748b?style=flat-square)](LICENSE)
[![Catalog: independent updates](https://img.shields.io/badge/catalog-independent_updates-64748b?style=flat-square)](#updates)

This repository hosts Ompra's storefront metadata, native OMP marketplace, and
starter skill packages. The catalog is maintained independently of desktop app
releases.

- **A fresh selection:** discover catalog updates without replacing the app.
- **Updates you control:** review and confirm plugin installations and updates.
- **Offline access:** use the last working catalog or the bundled selection.

## 📑 Contents

- [Quick start](#quick-start)
- [Starter skills](#starter-skills)
- [Planned integrations](#planned-integrations)
- [Maintaining the catalog](#maintaining)
- [Publishing updates](#updates)
- [Validation](#validation)
- [License](#license)

<a id="quick-start"></a>

## 🚀 Quick start

In an Ompra version with remote catalog support:

1. Open **Settings → Plugins → Sources** and select the default catalog.
2. Select **Refresh catalog** and review the available plugin cards.
3. Choose a plugin and confirm its installation.

To configure the source manually, use this **storefront URL**:

```text
https://raw.githubusercontent.com/vallgrice/ompra-catalog/main/catalog.json
```

| Source | Purpose |
|---|---|
| [Storefront catalog](https://raw.githubusercontent.com/vallgrice/ompra-catalog/main/catalog.json) | Names, descriptions, requirements, and example prompts shown in Ompra |
| [OMP marketplace](https://raw.githubusercontent.com/vallgrice/ompra-catalog/main/.omp-plugin/marketplace.json) | Package versions and immutable installation sources |

**Requirements:** downloading packages from this repository needs Git and an
internet connection. No separate GitHub account or token is required. The agent
uses the model provider configured in Ompra.

> **Refreshing the catalog does not update installed plugin code.** Installation
> and updates require confirmation.

The saved catalog appears immediately, followed by a GitHub refresh. Offline,
Ompra keeps the last working copy or uses the bundled selection. In **Sources**,
you can enter a custom URL, restore the default, or choose the bundled offline
selection.

If you previously installed the bundled `ompra-starter` selection, connecting
this source switches it to this marketplace while preserving plugin IDs,
installations, package code, settings, and enabled states.

<a id="starter-skills"></a>

## 🧰 Starter skills

Six Ompra-authored skills are currently available:

| Package | Skill | Purpose |
|---|---|---|
| 👀 `review` | `ompra-review` | Review changes and check for regressions |
| 🧪 `testing` | `ompra-testing` | Test observable behavior |
| 🐛 `debugging` | `ompra-debugging` | Identify and verify the root cause of a bug |
| 🧹 `refactoring` | `ompra-refactoring` | Refactor while preserving behavior |
| 📚 `documentation` | `ompra-documentation` | Document the current code |
| 🛡️ `security` | `ompra-security` | Review trust boundaries and abuse paths |

These skills are text instructions with no executable hooks or additional npm
dependencies. Structural validation does not certify security or the quality of
model responses.

<a id="planned-integrations"></a>

## 🗺️ Planned integrations

The [expanded selection inspired by OpenAI's catalog](CURATED.md) (in Russian)
proposes **34 cards covering 28 integrations**, with primary sources, connection
requirements, and priorities. Its machine-readable draft is [curation.json](curation.json).

> **Research draft:** these proposals are separate from the installable catalog.
> An integration is published only after its package and connection flow pass
> compatibility checks.

<a id="maintaining"></a>

## 🛠️ Maintaining the catalog

| File | What to edit |
|---|---|
| [catalog.json](catalog.json) | Storefront names, descriptions, requirements, links, and example prompts |
| [.omp-plugin/marketplace.json](.omp-plugin/marketplace.json) | Published package versions and installation sources |
| `plugins/<name>/skills/ompra-<name>/SKILL.md` | The content of an Ompra-authored skill |
| [curation.json](curation.json) and [research/](research/) | Proposed integrations and supporting research; separate from installation feeds |

Keep the `ompra-starter` name and package and skill names stable across updates.
Do not reuse an existing ID for a different author or product. Before adding a
third-party plugin, check OMP compatibility, licensing, supported platforms,
actual dependencies, and authentication. Never publish keys, tokens, or private
URLs.

<a id="updates"></a>

## 🔄 Publishing updates

### Metadata changes

For description-only changes, edit `catalog.json`, increment the catalog
version, update `updatedAt`, run validation, and commit and push the changes to
`main`.

### Skill changes

1. Edit `SKILL.md` and increment `version` in `plugin.json` and `package.json`,
   including the nested `omp.version` field in `package.json`.
2. Commit the packages. The full commit SHA will identify the new package contents.
3. In `.omp-plugin/marketplace.json`, update the package version and set
   `source.sha` to the SHA from step 2. The `git-subdir` source points to
   `plugins/<name>`.
4. Match the package version in `catalog.json`, increment the catalog version,
   and update `updatedAt`.
5. Run `node scripts/validate.mjs`, commit the index changes, and push both
   commits to `main`. Never replace the contents of an already published package
   version.
6. In Ompra, select **Refresh catalog**, review the card, and confirm **Update**.

The SHA pins the package contents regardless of later branch changes. The
storefront and marketplace URLs stay the same.

<a id="validation"></a>

## ✅ Validation

From the repository root, run:

```sh
node scripts/validate.mjs
```

The script checks consistency between both indexes and local packages, immutable
Git references, licenses, and required translations. Ompra also validates the
downloaded JSON against the full schema before displaying or saving it.

<a id="license"></a>

## 📄 License

Ompra-authored packages and documentation in this repository are distributed
under the [MIT License](LICENSE). Third-party code retains its own license;
each plugin card must identify it separately. Access to external services is
subject to their own terms, account permissions, and plans.
