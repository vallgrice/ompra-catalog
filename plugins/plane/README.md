# Plane connector for Ompra

Inspect work items and project context, then use supported planning and update tools within your workspace permissions.

> Independent Ompra connection definition for the provider-hosted MCP service. Not a provider endorsement or a redistribution of its service.

## Connection

- Endpoint: `https://mcp.plane.so/http/mcp`
- Transport: native Streamable HTTP.
- Discovered server name: `plane:api`.
- Local runtime: no extra Node.js, Python, Docker or MCP bridge. Git is needed to fetch the package.
- Authentication: browser OAuth via Reauthorize; provider account required.

## Set up in Ompra

1. Install this connector from the Ompra catalog and open or reload an agent session.
2. Open **Settings → Plugins → Plane → Applications**.
3. Choose **Connect → Open browser**, finish the provider sign-in, and review the requested access. Existing connections offer **Reauthorize** on the same page. Older Ompra builds expose these controls in **Settings → MCP → plane:api**.
4. Return to Ompra, reconnect or reload the session if needed, and confirm the server is connected with a nonzero tool count.

No shared OAuth client credentials or tokens are bundled. Installation adds the connection definition; it does not log in to an account. Provider registration policy, administrator approval and account permissions can still restrict the flow.

## Scope and limits

Choose a Plane Cloud workspace during consent. Plan and role limits apply. This hosted endpoint is not a bridge to a private self-hosted Plane instance and does not enforce read-only access.

The advertised OAuth token authentication methods are secret-based. OMP supports a dynamically returned client secret, but its registration request asks for a public native client. The full provider registration/consent/token exchange has not been tested; an advertised DCR endpoint alone does not guarantee success.

## Try it

> Use Plane to read the selected project's work items and summarize the next priorities and current blockers.

## Included skill: Plane

The package includes [ompra-plane](skills/ompra-plane/SKILL.md), an agent instruction skill for paginated requests and reliable result handling. OMP discovers `skills/ompra-plane/SKILL.md` alongside `mcp.json` after installation and session reload; no extra runtime is needed. The skill does not grant account access or permission to change records.

For lists, the skill starts with a small page (`per_page: 20`) and a sparse CSV `fields` selection when the live tool schema supports those parameters. Full descriptions are fetched for selected items with `retrieve`; counts and aggregates use `count` and supported PQL filters when appropriate. Pagination cursors and continuation flags are preserved, and incomplete scans are reported as partial results.

Inside Ompra's JS `eval`, the agent calls the discovered session tool, normally `await tool.mcp__plane_api_workitem(args)`, then processes `response.details.structuredContent` before displaying a compact answer. The observed page is under `structuredContent.result` with a `results` array and pagination metadata; a direct page envelope is also possible. The current schema and actual response remain authoritative.

### Large and historical results

Large model-visible output is saved to a session artifact with a bounded preview. A preview from `read()` or the `read` tool can include line numbers, a partial JSON line, and a truncation notice. `:raw` suppresses formatting but does not remove size limits. Such text is not a machine-readable JSON export.

To recover an earlier result, the agent reads the artifact's physical backing file directly inside eval (`Bun.file(path).text()` or Python `Path(path).read_text(encoding="utf-8")`) and projects the data without printing the whole file. The artifact itself may contain several text blocks, such as a compact JSON page followed by a fenced structured result. It must identify and parse a complete payload rather than treating the whole file as one JSON document or counting duplicate records twice.

MCP text blocks may legitimately contain Markdown. Their formatting does not prove that the MCP transport returned invalid JSON. The skill avoids blanket escape replacement, stripping control characters, and Python `strict=False`; it distinguishes source serialization errors from truncated presentation text.

## Verification

Initial endpoint probe on 2026-10-10: unauthenticated HTTP returned 401; protected-resource and authorization-server metadata advertise DCR and S256 PKCE. That probe did not perform client registration, account login, consent or authenticated account operations. Provider policy may still restrict registration.

For this package update, eight synthetic data-path checks passed against the pinned engine, including escaped characters, large-result spill, intact structured content, sparse projection and strict recovery from the full artifact. Nine compiled-sidecar checks passed for local installation, skill discovery, enable/disable, restart persistence and a sparse paginated MCP call. These checks used isolated profiles, a local model stub and a loopback MCP server; they do not establish provider OAuth or model compliance with the skill. See the [verification summary](https://github.com/vallgrice/ompra-catalog/blob/main/research/plane-validation.json).

The package contains only manifests, documentation, one instruction skill and a license. It has no executable scripts, dependencies, hooks or bundled secrets. Connected tools and availability can change independently of this package. A successful installation is distinct from a successful account connection.

## Sources

- [developers.plane.so/dev-tools/mcp-server](https://developers.plane.so/dev-tools/mcp-server)
- [github.com/makeplane/plane-mcp-server](https://github.com/makeplane/plane-mcp-server)

## License

The Ompra-authored connector definition and documentation are [MIT](LICENSE). The provider service, branding, account access, quotas, billing and terms are separate. No provider server code or third-party OAuth client identity is copied into this package.
