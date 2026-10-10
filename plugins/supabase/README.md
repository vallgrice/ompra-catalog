# Supabase connector for Ompra

Inspect database schemas, project information, logs and supported diagnostics through the official hosted MCP.

> Independent Ompra connection definition for the provider-hosted MCP service. Not a provider endorsement or a redistribution of its service.

## Connection

- Endpoint: `https://mcp.supabase.com/mcp?read_only=true`
- Transport: native Streamable HTTP.
- Discovered server name: `supabase:api`.
- Local runtime: no extra Node.js, Python, Docker or MCP bridge. Git is needed to fetch the package.
- Authentication: browser OAuth via Reauthorize; provider account required.

## Set up in Ompra

1. Install this connector from the Ompra catalog and open or reload an agent session.
2. Open **Settings → MCP** and select `supabase:api`.
3. Choose **Reauthorize**, finish the provider sign-in in your browser, and review the requested access.
4. Return to Ompra, reconnect or reload the session if needed, and confirm the server is connected with a nonzero tool count.

No shared OAuth client credentials or tokens are bundled. Installation adds the connection definition; it does not log in to an account. Provider registration policy, administrator approval and account permissions can still restrict the flow.

## Scope and limits

The starter URL explicitly enables read_only=true. Select the intended organization; add project_ref in a separate local configuration to scope a project. Provider quotas and permissions apply.

The advertised OAuth token authentication methods are secret-based. OMP supports a dynamically returned client secret, but its registration request asks for a public native client. The full provider registration/consent/token exchange has not been tested; an advertised DCR endpoint alone does not guarantee success.

## Try it

> Use Supabase to inspect the selected project schema and relevant diagnostics, then explain potential issues without changing data.

## Verification

Verified 2026-10-10: unauthenticated HTTP returned 401; protected-resource and authorization-server metadata advertise DCR and S256 PKCE. Client registration, account login, consent, authenticated tools and account operations were not tested. Provider policy may still restrict registration.

The package contains only manifests, this documentation and a license. It has no executable scripts, dependencies, hooks or bundled secrets. Connected tools and availability can change independently of this package. A successful installation is distinct from a successful account connection.

## Sources

- [supabase.com/docs/guides/ai-tools/mcp](https://supabase.com/docs/guides/ai-tools/mcp)
- [github.com/supabase/mcp](https://github.com/supabase/mcp)

## License

The Ompra-authored connector definition and documentation are [MIT](LICENSE). The provider service, branding, account access, quotas, billing and terms are separate. No provider server code or third-party OAuth client identity is copied into this package.
