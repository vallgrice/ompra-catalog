import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const json = async file => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const catalog = await json('catalog.json');
const marketplace = await json('.omp-plugin/marketplace.json');
const repo = 'https://github.com/vallgrice/ompra-catalog.git';
const source = 'https://raw.githubusercontent.com/vallgrice/ompra-catalog/main/.omp-plugin/marketplace.json';
assert.equal(catalog.schemaVersion, 1);
assert.ok(Buffer.byteLength(JSON.stringify(catalog)) <= 256 * 1024, 'Catalog exceeds app size limit');
assert.ok(Number.isFinite(Date.parse(catalog.updatedAt)), 'Invalid catalog date');
assert.equal(marketplace.name, 'ompra-starter', 'Preserve installed plugin IDs');
const sources = new Map();
for (const entry of catalog.marketplaces) {
  assert.ok(!sources.has(entry.id), `Duplicate marketplace: ${entry.id}`);
  const url = new URL(entry.source);
  assert.equal(url.protocol, 'https:');
  assert.ok(!url.username && !url.password && !url.hash, 'Use public HTTPS source URLs without credentials');
  assert.equal(entry.bundledPath, undefined, 'Remote metadata must not reference app-local paths');
  sources.set(entry.id, entry.source);
}
assert.equal(sources.get(marketplace.name), source);
assert.equal(catalog.plugins.filter(card => card.marketplace === marketplace.name).length, marketplace.plugins.length);
const names = new Set();
for (const card of catalog.plugins) {
  assert.match(card.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(!names.has(card.id), `Duplicate plugin: ${card.id}`);
  names.add(card.id);
  assert.equal(card.id, `${card.marketplace}/${card.name}`);
  assert.ok(sources.has(card.marketplace), `Unknown marketplace: ${card.marketplace}`);
  assert.ok(card.license?.trim(), 'Declare the actual license');
  for (const language of ['en', 'zh']) {
    for (const field of ['title', 'summary', 'description']) assert.ok(card[field]?.[language]?.trim());
    assert.ok(card.prompts?.[language]?.length > 0);
  }
  assert.equal(typeof card.requirements.account, 'boolean');
  assert.equal(typeof card.requirements.network, 'boolean');
  assert.ok(card.requirements.runtimes.every(runtime => ['node', 'bun', 'python', 'git'].includes(runtime)));
  if (card.marketplace !== marketplace.name) continue;
  const entry = marketplace.plugins.find(plugin => plugin.name === card.name);
  assert.ok(entry, `Missing native entry for ${card.name}`);
  assert.equal(entry.version, card.version);
  assert.equal(entry.license, card.license);
  assert.equal(entry.source.source, 'git-subdir');
  assert.equal(entry.source.url, repo);
  assert.equal(entry.source.path, `plugins/${card.name}`);
  assert.match(entry.source.sha, /^[0-9a-f]{40}$/, `Pin ${card.name} to a complete package commit SHA`);
  assert.deepEqual(card.requirements.runtimes, ['git']);
  assert.equal(card.requirements.network, true);
  const directory = `plugins/${card.name}`;
  const plugin = await json(`${directory}/plugin.json`);
  const pkg = await json(`${directory}/package.json`);
  assert.equal(plugin.version, card.version);
  assert.equal(pkg.version, card.version);
  assert.equal(pkg.omp.version, card.version);
  assert.equal(pkg.name, `@ompra/${card.kind === 'mcp' ? 'mcp' : 'skill'}-${card.name}`);
  assert.equal(plugin.license, card.license);
  assert.equal(pkg.license, card.license);
  for (const key of ['dependencies', 'devDependencies', 'optionalDependencies', 'scripts']) {
    assert.equal(pkg[key], undefined, 'Catalog packages must not download dependencies or execute scripts');
  }
  if (card.kind === 'mcp') {
    assert.equal(plugin.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
    assert.equal(plugin.name, card.name);
    const mcp = await json(`${directory}/mcp.json`);
    assert.equal(mcp.$schema, 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json');
    assert.deepEqual(Object.keys(mcp).sort(), ['$schema', 'mcpServers']);
    assert.deepEqual(Object.keys(mcp.mcpServers), ['api']);
    const server = mcp.mcpServers.api;
    assert.deepEqual(Object.keys(server).sort(), ['type', 'url'], 'Public wrappers must not contain keys, headers or executable commands');
    assert.equal(server.type, 'streamable-http');
    const endpoint = new URL(server.url);
    assert.equal(endpoint.protocol, 'https:');
    assert.ok(!endpoint.username && !endpoint.password && !endpoint.hash);
    for (const key of endpoint.searchParams.keys()) assert.ok(!/token|key|secret|password/i.test(key), 'Never publish credentials in MCP URLs');
    if (card.name === 'supabase') assert.equal(endpoint.searchParams.get('read_only'), 'true');
    if (card.name === 'linear') assert.equal(endpoint.pathname, '/mcp/readonly');
    if (card.name === 'exa') assert.ok(endpoint.searchParams.get('tools')?.split(',').includes('web_fetch_exa'), 'Keep Exa discoverable alongside native web search');
    const readme = await readFile(path.join(root, directory, 'README.md'), 'utf8');
    assert.ok(readme.includes(`${card.name}:api`), 'Document the actual discovered server name');
    assert.ok(readme.includes(server.url), 'Document the endpoint used by this package');
  } else {
    assert.equal(card.kind, 'skill');
    assert.equal(card.requirements.account, false);
    const skill = await readFile(path.join(root, directory, `skills/ompra-${card.name}/SKILL.md`), 'utf8');
    assert.ok(skill.includes(`name: ompra-${card.name}`));
    assert.ok(skill.includes('## Deliverable'));
  }
  assert.ok((await readFile(path.join(root, directory, 'LICENSE'), 'utf8')).includes('MIT License'));
}
console.log(`Validated catalog ${catalog.version}: ${names.size} cards, ${marketplace.plugins.length} immutable Ompra packages.`);
