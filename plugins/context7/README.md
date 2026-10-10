# Context7 connector for Ompra

Resolve a library and retrieve relevant documentation for the version used by your project.

> Independent Ompra connection definition for the provider-hosted MCP service. Not a provider endorsement or a redistribution of its service.

## Connection

- Endpoint: `https://mcp.context7.com/mcp`
- Transport: native Streamable HTTP.
- Discovered server name: `context7:api`.
- Local runtime: no extra Node.js, Python, Docker or MCP bridge. Git is needed to fetch the package.
- Authentication: keyless starter; no account required.

## Set up in Ompra

1. Install this connector from the Ompra catalog.
2. Open or reload an agent session.
3. Open **Settings → MCP**, find `context7:api`, and confirm a connected state and a nonzero tool count.
4. Start with a public-information request such as the example below.

No account or API key is required for this starter mode. The verified tool surface is: `resolve-library-id`, `query-docs`.

## Scope and limits

Keyless access is rate limited. No account or API key is required for the starter connection.

## Try it

> Use Context7 to find documentation for this project's library versions and cite the relevant API examples.

## Verification

Verified 2026-10-10: unauthenticated HTTP initialize and tools/list returned 2 tools with MCP 2025-11-25. No tool was invoked. Package install is checked separately; future availability, output quality and security are not certified.

The package contains only manifests, this documentation and a license. It has no executable scripts, dependencies, hooks or bundled secrets. Connected tools and availability can change independently of this package. A successful installation is distinct from a successful account connection.

## Sources

- [github.com/upstash/context7](https://github.com/upstash/context7)
- [context7.com/docs/resources/mcp-client-setup](https://context7.com/docs/resources/mcp-client-setup)

## License

The Ompra-authored connector definition and documentation are [MIT](LICENSE). The provider service, branding, account access, quotas, billing and terms are separate. No provider server code or third-party OAuth client identity is copied into this package.
