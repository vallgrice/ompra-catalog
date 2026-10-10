# Firecrawl connector for Ompra

Search public pages and extract readable content for research and implementation.

> Independent Ompra connection definition for the provider-hosted MCP service. Not a provider endorsement or a redistribution of its service.

## Connection

- Endpoint: `https://mcp.firecrawl.dev/v2/mcp`
- Transport: native Streamable HTTP.
- Discovered server name: `firecrawl:api`.
- Local runtime: no extra Node.js, Python, Docker or MCP bridge. Git is needed to fetch the package.
- Authentication: keyless starter; no account required.

## Set up in Ompra

1. Install this connector from the Ompra catalog.
2. Open or reload an agent session.
3. Open **Settings → MCP**, find `firecrawl:api`, and confirm a connected state and a nonzero tool count.
4. Start with a public-information request such as the example below.

No account or API key is required for this starter mode. The verified tool surface is: `firecrawl_scrape`, `firecrawl_search`, `firecrawl_parse`.

## Scope and limits

The keyless starter exposes search, scrape and parse with service limits. Account-only crawl, map and research tools are not included.

For account-backed tools, configure a separate User-scoped HTTP override named `firecrawl:api` with `https://mcp.firecrawl.dev/v2/mcp-oauth`, then use Reauthorize. Remove that local override as well when disconnecting. The package deliberately keeps the keyless tool surface.

## Try it

> Use Firecrawl to research the public documentation for this feature and summarize the relevant pages with sources.

## Verification

Verified 2026-10-10: unauthenticated HTTP initialize and tools/list returned 3 tools with MCP 2025-11-25. No tool was invoked. Package install is checked separately; future availability, output quality and security are not certified.

The package contains only manifests, this documentation and a license. It has no executable scripts, dependencies, hooks or bundled secrets. Connected tools and availability can change independently of this package. A successful installation is distinct from a successful account connection.

## Sources

- [docs.firecrawl.dev/mcp-server](https://docs.firecrawl.dev/mcp-server)
- [docs.firecrawl.dev/mcp-server/keyless](https://docs.firecrawl.dev/mcp-server/keyless)

## License

The Ompra-authored connector definition and documentation are [MIT](LICENSE). The provider service, branding, account access, quotas, billing and terms are separate. No provider server code or third-party OAuth client identity is copied into this package.
