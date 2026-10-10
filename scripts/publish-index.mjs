/** Build the V1 app/native indexes after committing package contents. Does not commit or push. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha = process.argv[2];
assert.match(sha ?? '', /^[0-9a-f]{40}$/, 'Pass the immutable package commit SHA');
const version = process.argv[3];
assert.match(version ?? '', /^\d+\.\d+\.\d+$/, 'Pass the new catalog version as the second argument');
const read = async file => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const catalog = await read('catalog.json');
const marketplace = await read('.omp-plugin/marketplace.json');
const connectors = await read('connectors.json');
assert.equal(connectors.schemaVersion, 1);
assert.ok(connectors.plugins.length > 0 && connectors.plugins.length <= 100);
const names = new Set(connectors.plugins.map(card => card.name));
assert.equal(names.size, connectors.plugins.length, 'Duplicate connector names');
for (const card of connectors.plugins) {
  assert.match(card.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.equal(card.id, `ompra-starter/${card.name}`);
  assert.equal(card.marketplace, marketplace.name);
  assert.equal(card.kind, 'mcp');
  for (const file of ['plugin.json', 'mcp.json', 'package.json', 'README.md', 'LICENSE']) {
    const committed = execFileSync('git', ['show', `${sha}:plugins/${card.name}/${file}`], { cwd: root, encoding: 'utf8' });
    assert.equal(committed.replaceAll('\r\n', '\n'), (await readFile(path.join(root, 'plugins', card.name, file), 'utf8')).replaceAll('\r\n', '\n'), `${card.name}/${file} differs from immutable commit`);
  }
}
catalog.plugins = [...catalog.plugins.filter(card => !names.has(card.name)), ...connectors.plugins];
catalog.version = version;
catalog.updatedAt = new Date().toISOString();
marketplace.metadata.version = catalog.version;
marketplace.metadata.description = 'Curated Ompra skills and remote MCP integrations. Packages are pinned to immutable Git commits; account connections are configured locally.';
marketplace.plugins = [
  ...marketplace.plugins.filter(plugin => !names.has(plugin.name)),
  ...connectors.plugins.map(card => ({
    name: card.name,
    source: { source: 'git-subdir', url: 'https://github.com/vallgrice/ompra-catalog.git', path: `plugins/${card.name}`, sha },
    description: card.summary.en,
    version: card.version,
    author: { name: card.author },
    license: card.license,
    category: card.category,
    tags: ['ompra', 'mcp', 'remote', 'git-install'],
    repository: card.repository,
    homepage: card.homepage,
  })),
];
assert.ok(catalog.plugins.length <= 100);
assert.equal(catalog.plugins.length, marketplace.plugins.length);
await writeFile(path.join(root, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
await writeFile(path.join(root, '.omp-plugin/marketplace.json'), JSON.stringify(marketplace, null, 2) + '\n');
console.log(`Built catalog ${catalog.version}: ${catalog.plugins.length} packages; ${connectors.plugins.length} MCP wrappers pinned to ${sha}. Run npm run check before publishing.`);
