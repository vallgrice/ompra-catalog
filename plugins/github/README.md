# GitHub connector for Ompra

Inspect repositories, issues, pull requests and supported GitHub resources with a user-supplied personal access token.

> Independent Ompra connection definition for the provider-hosted MCP service. Not a provider endorsement or a redistribution of its service.

## Connection

- Endpoint: `https://api.githubcopilot.com/mcp/`
- Transport: native Streamable HTTP.
- Discovered server name: `github:api`.
- Local runtime: no extra Node.js, Python, Docker or MCP bridge. Git is needed to fetch the package.
- Authentication: GitHub personal access token entered in a local User MCP entry; account required.

## Set up in Ompra

1. Install this connector from the Ompra catalog and open or reload an agent session.
2. Open **Settings → MCP → Add server**.
3. Set **Name** to `github:api`, **Transport** to **HTTP**, and **Scope** to **User**.
4. Set **URL** to `https://api.githubcopilot.com/mcp/`.
5. Add the **Authorization** header. Its value is the word `Bearer`, one space, and your own GitHub personal access token. Paste the real token locally; this repository supplies no credentials.
6. Test the assembled configuration, save it, and confirm that the server is connected with a nonzero tool count.

The User entry overrides the installed `github:api` definition. It is independent of the package: uninstalling or disabling the package alone does not remove the override or its token. Remove the local User entry as well to disconnect completely.

User-entered headers are stored in the local MCP configuration; this is not a promise of operating-system credential-vault storage. Never commit that configuration or share the portable data profile containing it.

## Scope and limits

The hosted server does not advertise dynamic OAuth client registration. Ompra does not reuse another client's credentials. Token permissions and organization policies determine available actions.

## Try it

> Use GitHub to inspect this repository's open pull requests and issues, then summarize the most relevant items without changing them.

## Verification

Verified 2026-10-10: unauthenticated HTTP returned 401; protected-resource and authorization-server metadata were retrieved. No DCR endpoint was advertised. Provider documents the user-token setup; authenticated discovery and account operations were not tested.

The package contains only manifests, this documentation and a license. It has no executable scripts, dependencies, hooks or bundled secrets. Connected tools and availability can change independently of this package. A successful installation is distinct from a successful account connection.

## Sources

- [github.com/github/github-mcp-server](https://github.com/github/github-mcp-server)
- [github.com/github/github-mcp-server/blob/main/docs/host-integration.md](https://github.com/github/github-mcp-server/blob/main/docs/host-integration.md)

## License

The Ompra-authored connector definition and documentation are [MIT](LICENSE). The provider service, branding, account access, quotas, billing and terms are separate. No provider server code or third-party OAuth client identity is copied into this package.
