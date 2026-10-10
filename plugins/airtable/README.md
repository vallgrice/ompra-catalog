# Airtable connector for Ompra

Discover bases and schemas, read records and perform permitted record or schema changes.

> Independent Ompra connection definition for the provider-hosted MCP service. Not a provider endorsement or a redistribution of its service.

## Connection

- Endpoint: `https://mcp.airtable.com/mcp`
- Transport: native Streamable HTTP.
- Discovered server name: `airtable:api`.
- Local runtime: no extra Node.js, Python, Docker or MCP bridge. Git is needed to fetch the package.
- Authentication: browser OAuth via Reauthorize; provider account required.

## Set up in Ompra

1. Install this connector from the Ompra catalog and open or reload an agent session.
2. Open **Settings → MCP** and select `airtable:api`.
3. Choose **Reauthorize**, finish the provider sign-in in your browser, and review the requested access.
4. Return to Ompra, reconnect or reload the session if needed, and confirm the server is connected with a nonzero tool count.

No shared OAuth client credentials or tokens are bundled. Installation adds the connection definition; it does not log in to an account. Provider registration policy, administrator approval and account permissions can still restrict the flow.

## Scope and limits

Authorize only the bases or interfaces you need. Airtable permissions, API quotas and administrator policies apply. Automation activation still requires the Airtable UI.

## Try it

> Use Airtable to inspect the schema of an authorized base and summarize its tables and relationships without changing records.

## Verification

Verified 2026-10-10: unauthenticated HTTP returned 401; protected-resource and authorization-server metadata advertise DCR and S256 PKCE. Client registration, account login, consent, authenticated tools and account operations were not tested. Provider policy may still restrict registration.

The package contains only manifests, this documentation and a license. It has no executable scripts, dependencies, hooks or bundled secrets. Connected tools and availability can change independently of this package. A successful installation is distinct from a successful account connection.

## Sources

- [airtable.com/developers/agents/mcp/getting-started](https://airtable.com/developers/agents/mcp/getting-started)
- [airtable.com/developers/agents/mcp/other](https://airtable.com/developers/agents/mcp/other)

## License

The Ompra-authored connector definition and documentation are [MIT](LICENSE). The provider service, branding, account access, quotas, billing and terms are separate. No provider server code or third-party OAuth client identity is copied into this package.
