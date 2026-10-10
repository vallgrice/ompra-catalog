# 🧩 Ompra Catalog

**English** · [Українська](README.uk.md)

**Curated plugins and skills for your Ompra workspace.**

[![License: MIT](https://img.shields.io/badge/license-MIT-64748b?style=flat-square)](LICENSE)
[![Catalog: independent updates](https://img.shields.io/badge/catalog-independent_updates-64748b?style=flat-square)](#updates)

This repository hosts Ompra's storefront metadata, native OMP marketplace, and
installable packages. **Catalog 1.1.1 contains 22 cards: 16 remote MCP connectors
and six Ompra-authored skills.** The catalog updates independently of desktop app
releases; existing versions with remote catalog support can fetch this selection.

- **A fresh selection:** discover catalog updates without replacing the app.
- **Updates you control:** review and confirm plugin installations and updates.
- **Offline access:** use the last working catalog or the bundled selection.

## 📑 Contents

- [Quick start](#quick-start)
- [Available connectors](#connectors)
- [Connect an account](#connect-account)
- [Starter skills](#starter-skills)
- [Selection and roadmap](#planned-integrations)
- [Maintaining the catalog](#maintaining)
- [Publishing updates](#updates)
- [Validation](#validation)
- [License](#license)

<a id="quick-start"></a>

## 🚀 Quick start

In an Ompra version with remote catalog support:

1. Open **Settings → Plugins → Sources** and select the default catalog.
2. Select **Refresh catalog** and review the available plugin cards.
3. The online selection should show **22 cards**. Choose a plugin and confirm its
   installation.
4. For an account-based connector, follow [Connect an account](#connect-account).

**Already have Ompra installed?** Refresh the remote catalog in your current app;
you do not need a new EXE just to download these cards. If you still see six
skills, check **Sources**: the bundled offline selection and a custom URL do not
automatically become the current GitHub catalog. Select the default online
source, confirm its connection if prompted, then refresh. A network failure can
leave the last saved selection visible.

To configure the source manually, use this **storefront URL**:

```text
https://raw.githubusercontent.com/vallgrice/ompra-catalog/main/catalog.json
```

| Source | Purpose |
|---|---|
| [Storefront catalog](https://raw.githubusercontent.com/vallgrice/ompra-catalog/main/catalog.json) | Names, descriptions, requirements, and example prompts shown in Ompra |
| [Storefront presentation](presentation.json) | Thematic sections, their order, and supported service-logo identifiers |
| [OMP marketplace](https://raw.githubusercontent.com/vallgrice/ompra-catalog/main/.omp-plugin/marketplace.json) | Package versions and immutable installation sources |

### 🎨 Browse by topic

The updated storefront groups all 22 cards into **Development**, **Knowledge and
data**, **Projects and teams**, **Search and web**, **Business and analytics**,
and **Coding skills**. Select a section heading to browse that category, or search
across the catalog. Airtable is in **Knowledge and data**.

Service logos appear in the catalog, plugin details, and installed sidebar. SVG
assets are bundled with Ompra, so displaying them makes no requests to image
providers. Skills use distinct colored icons. Both light and dark themes are
supported.

**The new layout and logos require the updated desktop build.** Older builds can
still refresh all 22 cards through the unchanged V1 catalog format. Compatible
builds also read `presentation.json` from this repository and retain its last
working copy offline; future category names, ordering, and assignments can be
updated here without replacing the app.

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

<a id="connectors"></a>

## 🔌 Available connectors

These are real, installable Agent Plugin packages with root `plugin.json` and
`mcp.json` files, pinned to immutable Git commits. They connect to remote services
over HTTP and do not bundle Node, Python, browsers, or the providers' server code.

| Connector | Use it for | First connection |
|---|---|---|
| 📚 Context7 | Library documentation and examples | Limited keyless mode |
| 🔎 Firecrawl | Web search, page extraction, file parsing | Limited keyless mode |
| 🗂️ [Airtable](docs/AIRTABLE.md) | Bases, records, schemas, and supported automation drafts | Browser OAuth |
| 📝 Notion | Pages, databases, and workspace knowledge | Browser OAuth |
| 📋 Linear | Issues, projects, and comments | Browser OAuth |
| 🗄️ Supabase | Database structure and project diagnostics | Browser OAuth; package uses read-only mode |
| 🔗 Atlassian | Jira and Confluence | Browser OAuth; organization policies apply |
| 🐛 Sentry | Application errors and diagnostics | Browser OAuth |
| 🛫 Plane | Work items, projects, and cycles | Browser OAuth |
| 🧾 Jotform | Forms and submissions | Browser OAuth |
| 📊 PostHog | Product analytics and feature flags | Browser OAuth |
| 🚆 Railway | Services, projects, and deployment context | Browser OAuth |
| 💳 Stripe | Payment and subscription context | Browser OAuth |
| 🌐 Exa | Web search and page content | Limited keyless mode; explicit extra tool avoids OMP's native-only filter |
| 🐙 GitHub | Repositories, issues, PRs, and Actions | Local personal access token setup |
| ☁️ Render | Services, deployments, logs, and metrics | Local API key setup |

Keyless availability still has service limits. OAuth consent, scopes, resource
selection, account plans, and administrator policies remain the provider's
responsibility. MIT applies to our connector definitions, not to the hosted SaaS
services. Ompra is not claiming provider endorsement.

<a id="connect-account"></a>

## 🔐 Connect an account

### Browser OAuth

1. Install the connector and let Ompra reload plugins if prompted.
2. Open **Settings → MCP**, find **`<package>:api`** (for example,
   **`airtable:api`**), and select **Reauthorize** from its action menu.
3. Complete the provider's browser consent and choose the resources it may access.
4. Return to Ompra, wait for reconnection, and check the status and tool count.
   Start with a harmless read request.

**Installed ≠ connected.** A package can be installed while its server is
disconnected, has zero tools, or awaits authorization. Some discovered servers
also lack an auth badge before first consent. The package's installation state
does not prove that your account is connected.

### GitHub and Render: local key setup

Their packages contain no credentials. After installation, add a **User** MCP
server with the exact name **`github:api`** or **`render:api`**. Select HTTP and use:

| Connector | URL | Local header |
|---|---|---|
| GitHub | `https://api.githubcopilot.com/mcp/` | `Authorization`: `Bearer ` followed by your PAT |
| Render | `https://mcp.render.com/mcp` | `Authorization`: `Bearer ` followed by your API key |

This local entry overrides the package's connection definition. Use the smallest
permissions needed. Enter the actual credential locally; standard package
headers do not expand `${TOKEN}`. The header is local MCP configuration, not a
promise of operating-system vault storage. Do not commit it, share it, or put it
in this repository. Use the key-based connection rather than **Reauthorize**.

> **Removing a package does not remove a separate User override.** Remove that
> MCP entry too if you no longer want its tools available. Revoke credentials or
> OAuth access with the provider separately.

For plugin-discovered servers, the pinned engine's named **Test** action can
report “Server not found” even though discovery works. Check connection status
and tool count instead of interpreting that message as proof of a bad account.

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

## 🗺️ Selection and roadmap

The [expanded selection inspired by OpenAI's catalog](CURATED.md) (in Russian)
tracks **35 cards covering 29 integrations**, including Airtable, with primary
sources, requirements, and publication status. **Sixteen integration wrappers are
in the installable feed; the remaining proposals are not installable.** Seven
Google cards describe one planned community Workspace connector. The six starter
skills are counted in the runtime catalog, not in this research selection.
Machine-readable tracking: [curation.json](curation.json).

> The app reads **`catalog.json`**, not `curation.json`. Publishing research or a
> README does not add a card to Ompra. New cards require real packages and updates
> to both installation indexes.

<a id="maintaining"></a>

## 🛠️ Maintaining the catalog

| File | What to edit |
|---|---|
| [presentation.json](presentation.json) | Thematic group names, ordering, card membership, and supported local logos |
| [catalog.json](catalog.json) | Storefront names, descriptions, requirements, links, and example prompts |
| [connectors.json](connectors.json) | Authored metadata for the 16 MCP connector cards; input to the index builder |
| [.omp-plugin/marketplace.json](.omp-plugin/marketplace.json) | Published package versions and installation sources |
| `plugins/<name>/skills/ompra-<name>/SKILL.md` | The content of an Ompra-authored skill |
| `plugins/<name>/mcp.json` | A remote connector's portable MCP definition; no secrets |
| [curation.json](curation.json) and [research/](research/) | Published-wrapper tracking, planned integrations, and evidence; separate from installation feeds |

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

For category changes, edit `presentation.json`: update group titles, ordering,
and `pluginIds`, then increment its own `version`. Keep plugin IDs stable and
assign each published card once. `brands` accepts supported, locally bundled
logo identifiers only; arbitrary image URLs and executable content are rejected.
Adding a new logo asset requires a new desktop build. Run `npm run check` before
publishing; **Refresh catalog** fetches both metadata files in compatible builds.

### Package changes

1. Edit the skill or MCP definition and increment `version` in `plugin.json` and `package.json`,
   including the nested `omp.version` field in `package.json`.
2. Commit the packages. The full commit SHA will identify the new package contents.
3. For the MCP collection, update card metadata in `connectors.json`, then run
   `node scripts/publish-index.mjs <packageSHA> <catalogVersion>` with the full
   SHA from step 2 and the next catalog version (for example, `1.2.0`).
   The builder checks committed package contents and writes both indexes.
   For a skill update, change its marketplace version and `source.sha` manually;
   the `git-subdir` source points to `plugins/<name>`.
4. Review matching package versions, the catalog version, and `updatedAt`.
   A skill update also requires the matching version in `catalog.json`.
5. Run `npm run check`, commit the index and documentation changes, and push both
   commits to `main`. Never replace the contents of an already published package
   version.
6. In Ompra, select **Refresh catalog**, review the card, and confirm **Update**.

The SHA pins the package contents regardless of later branch changes. The
storefront and marketplace URLs stay the same.

<a id="validation"></a>

## ✅ Validation

From the repository root, run:

```sh
npm run check
```

The script checks consistency between both indexes and local packages, immutable
Git references, licenses, and required translations. Ompra also validates the
downloaded JSON against the full schema before displaying or saving it.
You can run the same validator directly with `node scripts/validate.mjs`.

[Unauthenticated remote probes](research/remote-probes.json) verified
`initialize` and `tools/list` for the keyless Context7, Firecrawl, and Exa
endpoints. OAuth metadata advertises DCR for the 11 OAuth-first connectors;
[Airtable's results](research/airtable.json) are recorded separately. These checks
do not perform account consent, token exchange, or a provider tool call.
Authenticated account access and provider-specific write behavior have not been
claimed as tested. Catalog validation is not a security certification.

The local User-override mechanism and its persistence after package removal were
checked against bundled OMP with a synthetic test server. This checks local
configuration behavior, not GitHub or Render account authorization.

A separate native run passed 32 targeted checks using bundled `omp.exe`, including
installation from the public GitHub commit. All 16 MCP packages installed
and appeared as servers. Native connection tests returned 2 Context7, 3 Firecrawl,
and 2 Exa tools. One real public Context7 library lookup for React completed
through compiled OMP, using a local model stub and no real model-provider key.
Selected enable/disable and uninstall scenarios also passed. This native check
does not establish authenticated OAuth access to the account-based services.
See the [native verification summary](research/native-validation.json) for the
engine hash, package commit and tested boundaries.

<a id="license"></a>

## 📄 License

Ompra-authored packages and documentation in this repository are distributed
under the [MIT License](LICENSE). Third-party code retains its own license;
each plugin card must identify it separately. Access to external services is
subject to their own terms, account permissions, and plans.
