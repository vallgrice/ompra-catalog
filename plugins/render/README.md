# Render connector for Ompra

Inspect Render service and deployment context and use supported resource tools with your own API key.

> Independent Ompra connection definition for the provider-hosted MCP service. Not a provider endorsement or a redistribution of its service.

## Connection

- Endpoint: `https://mcp.render.com/mcp`
- Transport: native Streamable HTTP.
- Discovered server name: `render:api`.
- Local runtime: no extra Node.js, Python, Docker or MCP bridge. Git is needed to fetch the package.
- Authentication: Render API key entered in a local User MCP entry; account required.

## Set up in Ompra

1. Install this connector from the Ompra catalog and open or reload an agent session.
2. Open **Settings → MCP → Add server**.
3. Set **Name** to `render:api`, **Transport** to **HTTP**, and **Scope** to **User**.
4. Set **URL** to `https://mcp.render.com/mcp`.
5. Add the **Authorization** header. Its value is the word `Bearer`, one space, and your own Render API key. Paste the real token locally; this repository supplies no credentials.
6. Test the assembled configuration, save it, and confirm that the server is connected with a nonzero tool count.

The User entry overrides the installed `render:api` definition. It is independent of the package: uninstalling or disabling the package alone does not remove the override or its token. Remove the local User entry as well to disconnect completely.

User-entered headers are stored in the local MCP configuration; this is not a promise of operating-system credential-vault storage. Never commit that configuration or share the portable data profile containing it.

## Scope and limits

The hosted service does not advertise dynamic OAuth client registration. Select the intended workspace. Account permissions, resource billing and database network restrictions apply.

## Try it

> Use Render to inspect the selected service's latest deployment logs and summarize the cause of a failure without triggering a deployment.

## Verification

Verified 2026-10-10: unauthenticated HTTP returned 401; protected-resource and authorization-server metadata were retrieved. No DCR endpoint was advertised. Provider documents the user-token setup; authenticated discovery and account operations were not tested.

The package contains only manifests, this documentation and a license. It has no executable scripts, dependencies, hooks or bundled secrets. Connected tools and availability can change independently of this package. A successful installation is distinct from a successful account connection.

## Sources

- [render.com/docs/mcp-server](https://render.com/docs/mcp-server)
- [github.com/render-oss/render-mcp-server](https://github.com/render-oss/render-mcp-server)

## License

The Ompra-authored connector definition and documentation are [MIT](LICENSE). The provider service, branding, account access, quotas, billing and terms are separate. No provider server code or third-party OAuth client identity is copied into this package.
