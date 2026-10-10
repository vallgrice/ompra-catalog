# 🗂️ Airtable for Ompra

Connect Ompra to [Airtable's official hosted MCP server](https://airtable.com/developers/agents/mcp/getting-started). The catalog package supplies a connection definition; Airtable hosts the tools and controls account access. This independent Ompra package does not imply Airtable endorsement.

## 🚀 Connect your account

1. Install **Airtable** from Ompra's plugin catalog. Allow Ompra to reload plugins if prompted.
2. Stay on the **Airtable** detail page. Under **Applications**, use **Connect → Open browser**.
3. The page displays the real connection status and tool count. While authorization is pending, you can cancel it here or use the inline manual-code fallback.
4. Complete Airtable's browser authorization. Choose the bases, apps, or workspaces that Ompra may access.
5. Return to Ompra and wait for the server to reconnect. Confirm it is connected and exposes tools before asking the agent to use Airtable.

Older Ompra builds use **Settings → MCP → `airtable:api` → Reauthorize** instead. Updating catalog metadata does not add the new interface to an older EXE.

Try a read operation first: “List the Airtable bases I authorized, then describe the tables in my Project Tracker base.” After checking the result, request edits explicitly.

The initial state may show disconnected and zero tools. Installing a package does not sign you in. In this OMP version, a missing auth badge also does not prove that authorization is unnecessary.

## 🔌 Connection details

| Setting | Value |
| --- | --- |
| Provider | Airtable |
| Endpoint | `https://mcp.airtable.com/mcp` |
| Transport | Streamable HTTP |
| Package / server | `airtable` / `airtable:api` |
| Recommended authorization | Browser OAuth with dynamic client registration |
| Extra runtime | None for the remote MCP connection |

[Airtable supports generic MCP clients](https://airtable.com/developers/agents/mcp/other) using DCR. Ompra can request its own client registration through the existing OAuth flow. The package contains no access token, client secret, or client ID borrowed from OpenAI or another application.

## 🔐 Access and account requirements

The service is available on all Airtable plans. Your authorized resources and existing Airtable permissions determine what the agent can do. Organization policies may require an administrator to approve the integration. MCP usage follows the plan's API and base limits; Airtable currently documents no extra MCP charge. See [Airtable's permissions and limits](https://support.airtable.com/articles/9897799762-using-the-airtable-mcp-server).

You can inspect permitted records and schemas, update records where allowed, and work with supported automation drafts. Creating a base requires workspace Creator or Owner access. Activating automations, editing Script actions, and some interface changes still require Airtable's UI.

Manage or revoke the connection from [Airtable → Third-party integrations](https://airtable.com/?integrations=thirdParty). Disabling or uninstalling the Ompra package removes its tools from Ompra; revoke Airtable access separately when you no longer want the authorization.

## 🛠️ If connection fails

- **Browser consent was canceled:** run **Reauthorize** again. Check the selected Airtable account and resources.
- **Your organization blocks the integration:** ask its administrator to approve it. Organizations that prohibit DCR can register their own static OAuth client; this requires a local OMP MCP configuration with that client's details. Static OAuth is not a field in the portable package manifest.
- **No bases are visible:** check the resources selected during consent and your account's base or interface permissions.
- **A tool reports insufficient permission:** narrow the request or update access in Airtable. Package installation cannot grant extra rights.
- **Test says “Server not found”:** the pinned engine's named Test action has a known limitation for plugin-discovered servers. Check the server's connection status and tool count, then use a harmless read request. Do not treat that Test error alone as an Airtable authentication failure.

## ⚙️ Advanced: personal access token

OAuth is the default path. Airtable also documents [PAT authorization](https://airtable.com/developers/agents/mcp/other) for scripts and managed setups.

If you deliberately choose a PAT, disable the package's MCP server and add a **separate local HTTP server** in Ompra's MCP wizard. Use the endpoint above and enter an `Authorization` header with `Bearer ` followed by your own token. Restrict its scopes and resources to the task. Local header configuration contains the credential; do not commit, share, or attach it to reports, and do not assume it is stored in an operating-system vault. Avoid the OAuth Reauthorize action for this PAT configuration.

**Do not copy `Bearer ${AIRTABLE_PAT}` into this package.** OMP's standard plugin headers are literal and do not expand that variable. Never put a PAT in the public catalog or shared `mcp.json`.

## 🧪 Verification

Checked on **2026-10-10**: official documentation, the public protected-resource and authorization-server metadata, advertised DCR/public-client/PKCE support, and the unauthenticated MCP `initialize` challenge (`401`). No client registration, sign-in, account data, or authenticated tool call was performed. An authenticated session remains necessary to validate the selected account and tools.

Full findings: [research/airtable.json](../research/airtable.json).
