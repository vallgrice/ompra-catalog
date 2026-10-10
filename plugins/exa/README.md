# Exa connector for Ompra

Search the web and read known URLs using explicitly selected search and fetch tools.

> Independent Ompra connection definition for the provider-hosted MCP service. Not a provider endorsement or a redistribution of its service.

## Connection

- Endpoint: `https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa`
- Transport: native Streamable HTTP.
- Discovered server name: `exa:api`.
- Local runtime: no extra Node.js, Python, Docker or MCP bridge. Git is needed to fetch the package.
- Authentication: keyless starter; no account required.

## Set up in Ompra

1. Install this connector from the Ompra catalog.
2. Open or reload an agent session.
3. Open **Settings → MCP**, find `exa:api`, and confirm a connected state and a nonzero tool count.
4. Start with a public-information request such as the example below.

No account or API key is required for this starter mode. The verified tool surface is: `web_search_exa`, `web_fetch_exa`.

## Scope and limits

The keyless starter is rate limited. Its explicit tools list includes web_fetch_exa so OMP keeps this connection alongside native search. Account-only research-agent tools are not included.

The explicit `tools=web_search_exa,web_fetch_exa` URL preserves the fetch tool alongside OMP's native search. Optional advanced search and authenticated `agent_run` are not enabled by this package.

## Try it

> Use Exa to search public sources for this technical question, fetch the most relevant pages and answer with links.

## Verification

Verified 2026-10-10: unauthenticated HTTP initialize and tools/list returned 2 tools with MCP 2025-11-25. No tool was invoked. Package install is checked separately; future availability, output quality and security are not certified.

The package contains only manifests, this documentation and a license. It has no executable scripts, dependencies, hooks or bundled secrets. Connected tools and availability can change independently of this package. A successful installation is distinct from a successful account connection.

## Sources

- [exa.ai/docs/get-started/exa-mcp](https://exa.ai/docs/get-started/exa-mcp)
- [github.com/exa-labs/exa-mcp-server](https://github.com/exa-labs/exa-mcp-server)

## License

The Ompra-authored connector definition and documentation are [MIT](LICENSE). The provider service, branding, account access, quotas, billing and terms are separate. No provider server code or third-party OAuth client identity is copied into this package.
