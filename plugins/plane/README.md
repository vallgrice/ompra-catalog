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
2. Open **Settings → MCP** and select `plane:api`.
3. Choose **Reauthorize**, finish the provider sign-in in your browser, and review the requested access.
4. Return to Ompra, reconnect or reload the session if needed, and confirm the server is connected with a nonzero tool count.

No shared OAuth client credentials or tokens are bundled. Installation adds the connection definition; it does not log in to an account. Provider registration policy, administrator approval and account permissions can still restrict the flow.

## Scope and limits

Choose a Plane Cloud workspace during consent. Plan and role limits apply. This hosted endpoint is not a bridge to a private self-hosted Plane instance and does not enforce read-only access.

The advertised OAuth token authentication methods are secret-based. OMP supports a dynamically returned client secret, but its registration request asks for a public native client. The full provider registration/consent/token exchange has not been tested; an advertised DCR endpoint alone does not guarantee success.

## Try it

> Use Plane to read the selected project's work items and summarize the next priorities and current blockers.

## Verification

Verified 2026-10-10: unauthenticated HTTP returned 401; protected-resource and authorization-server metadata advertise DCR and S256 PKCE. Client registration, account login, consent, authenticated tools and account operations were not tested. Provider policy may still restrict registration.

The package contains only manifests, this documentation and a license. It has no executable scripts, dependencies, hooks or bundled secrets. Connected tools and availability can change independently of this package. A successful installation is distinct from a successful account connection.

## Sources

- [developers.plane.so/dev-tools/mcp-server](https://developers.plane.so/dev-tools/mcp-server)
- [github.com/makeplane/plane-mcp-server](https://github.com/makeplane/plane-mcp-server)

## License

The Ompra-authored connector definition and documentation are [MIT](LICENSE). The provider service, branding, account access, quotas, billing and terms are separate. No provider server code or third-party OAuth client identity is copied into this package.
