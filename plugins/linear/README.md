# Linear connector for Ompra

Find project context, inspect issues and summarize progress using the official read-only MCP endpoint.

> Independent Ompra connection definition for the provider-hosted MCP service. Not a provider endorsement or a redistribution of its service.

## Connection

- Endpoint: `https://mcp.linear.app/mcp/readonly`
- Transport: native Streamable HTTP.
- Discovered server name: `linear:api`.
- Local runtime: no extra Node.js, Python, Docker or MCP bridge. Git is needed to fetch the package.
- Authentication: browser OAuth via Reauthorize; provider account required.

## Set up in Ompra

1. Install this connector from the Ompra catalog and open or reload an agent session.
2. Open **Settings → MCP** and select `linear:api`.
3. Choose **Reauthorize**, finish the provider sign-in in your browser, and review the requested access.
4. Return to Ompra, reconnect or reload the session if needed, and confirm the server is connected with a nonzero tool count.

No shared OAuth client credentials or tokens are bundled. Installation adds the connection definition; it does not log in to an account. Provider registration policy, administrator approval and account permissions can still restrict the flow.

## Scope and limits

The starter endpoint only exposes read tools and advertises the read OAuth scope. Creating or updating issues requires an explicit separate read-write configuration.

## Try it

> Use Linear to read the current project issues and summarize blockers and priorities without changing them.

## Verification

Verified 2026-10-10: unauthenticated HTTP returned 401; protected-resource and authorization-server metadata advertise DCR and S256 PKCE. Client registration, account login, consent, authenticated tools and account operations were not tested. Provider policy may still restrict registration.

The package contains only manifests, this documentation and a license. It has no executable scripts, dependencies, hooks or bundled secrets. Connected tools and availability can change independently of this package. A successful installation is distinct from a successful account connection.

## Sources

- [linear.app/docs/mcp](https://linear.app/docs/mcp)

## License

The Ompra-authored connector definition and documentation are [MIT](LICENSE). The provider service, branding, account access, quotas, billing and terms are separate. No provider server code or third-party OAuth client identity is copied into this package.
