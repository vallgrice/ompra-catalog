import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const junk = new Set(['.git', 'node_modules', 'build', 'dist', 'coverage', 'tmp', 'target', '__pycache__', '.cache', '.DS_Store', 'Thumbs.db']);
const allowedFrontmatter = new Set(['name', 'description', 'license', 'allowed-tools', 'metadata', 'compatibility']);

function checkPackagePath(relative) {
  assert.ok(relative.split('/').every(part => part && part !== '.' && part !== '..' && !junk.has(part)), `Forbidden package path: ${relative}`);
}

async function packageFiles(directory, relative = '') {
  const stat = await lstat(directory);
  assert.ok(stat.isDirectory() && !stat.isSymbolicLink(), `Package directory must not be a symlink: ${directory}`);
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = relative ? `${relative}/${entry.name}` : entry.name;
    checkPackagePath(name);
    assert.ok(!entry.isSymbolicLink(), `Package symlinks are not allowed: ${name}`);
    if (entry.isDirectory()) files.push(...await packageFiles(path.join(directory, entry.name), name));
    else {
      assert.ok(entry.isFile(), `Package entry must be a regular file: ${name}`);
      files.push(name);
    }
  }
  return files.sort();
}

function comparableBytes(bytes) {
  // A Windows checkout may have CRLF while its Git blob has LF. Never alter binary files.
  const text = bytes.toString('utf8');
  return !bytes.includes(0) && Buffer.from(text, 'utf8').equals(bytes)
    ? Buffer.from(text.replaceAll('\r\n', '\n'), 'utf8')
    : bytes;
}

/** Compare every shipped file with the exact package tree addressed by the immutable pin. */
export async function verifyImmutablePackage(root, packagePath, sha, gitEnv = process.env) {
  assert.match(sha, /^[0-9a-f]{40}$/, 'Use a complete immutable commit SHA');
  assert.match(packagePath, /^plugins\/[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a package directly under plugins/');
  const plugins = await lstat(path.join(root, 'plugins'));
  assert.ok(plugins.isDirectory() && !plugins.isSymbolicLink(), 'The plugins directory must not be a symlink');
  const prefix = `${packagePath}/`;
  const records = execFileSync('git', ['ls-tree', '-rz', '--full-tree', sha, '--', packagePath], { cwd: root, env: gitEnv, encoding: 'utf8' });
  const committedFiles = new Map();
  for (const record of records.split('\0').filter(Boolean)) {
    const separator = record.indexOf('\t');
    const [mode, kind] = record.slice(0, separator).split(' ');
    const filename = record.slice(separator + 1);
    assert.ok(filename.startsWith(prefix), `Unexpected committed package path: ${filename}`);
    const relative = filename.slice(prefix.length);
    checkPackagePath(relative);
    assert.ok(kind === 'blob' && ['100644', '100755'].includes(mode), `Committed package entry must be a regular file: ${relative}`);
    committedFiles.set(relative, filename);
  }
  assert.ok(committedFiles.size, `Immutable commit has no package: ${packagePath}`);
  const localFiles = await packageFiles(path.join(root, packagePath));
  assert.deepEqual(localFiles, [...committedFiles.keys()].sort(), `${packagePath} files differ from immutable commit`);
  for (const [relative, filename] of committedFiles) {
    const committed = execFileSync('git', ['show', `${sha}:${filename}`], { cwd: root, env: gitEnv, maxBuffer: 16 * 1024 * 1024 });
    const local = await readFile(path.join(root, packagePath, relative));
    assert.ok(comparableBytes(committed).equals(comparableBytes(local)), `${filename} differs from immutable commit`);
  }
}

function scalar(frontmatter, key) {
  const lines = frontmatter.split(/\r?\n/);
  const matches = lines.flatMap((line, index) => line.startsWith(`${key}:`) ? [index] : []);
  assert.equal(matches.length, 1, `Skill requires one ${key} field`);
  const index = matches[0];
  const value = lines[index].slice(key.length + 1).trim();
  if (/^[|>][+-]?$/.test(value)) {
    assert.equal(key, 'description', 'Skill name must be a scalar on one line');
    const block = [];
    for (let i = index + 1; i < lines.length && (/^\s/.test(lines[i]) || !lines[i]); i++) block.push(lines[i].trim());
    return block.join(' ').trim();
  }
  if (value.startsWith('"')) return JSON.parse(value);
  if (value.startsWith("'")) {
    assert.match(value, /^'(?:[^']|'')*'$/, `Invalid quoted skill ${key}`);
    return value.slice(1, -1).replaceAll("''", "'");
  }
  const plain = value.replace(/(?:^|\s+)#.*$/, '').trim();
  assert.ok(!/^[\[\]{}&*!]|:(?:\s|$)/.test(plain), `Use a plain or quoted scalar for skill ${key}`);
  assert.ok(!/^(?:null|~|true|false|[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?|[-+]?\.(?:inf|nan))$/i.test(plain), `Skill ${key} must be a string; quote non-text YAML scalars`);
  return plain;
}

/** Validate the catalog's canonical skill frontmatter; native discovery remains the YAML authority. */
export function validateBundledSkill(content, directoryName) {
  const parsed = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  assert.ok(parsed, `Missing skill frontmatter: ${directoryName}`);
  const [, frontmatter, body] = parsed;
  for (const line of frontmatter.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#') || /^\s/.test(line)) continue;
    const key = line.match(/^([^\s:#][^:]*):/);
    assert.ok(key, 'Malformed top-level skill frontmatter');
    assert.ok(allowedFrontmatter.has(key[1]), `Unsupported skill frontmatter field: ${key[1]}`);
  }
  const name = scalar(frontmatter, 'name');
  assert.equal(name, directoryName, 'Skill name must match its directory');
  assert.match(name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(name.length <= 64, 'Skill name exceeds 64 characters');
  const description = scalar(frontmatter, 'description');
  assert.ok(typeof description === 'string' && description.trim() && description.length <= 1024, 'Skill description must contain 1–1024 characters');
  const section = body.match(/^## Deliverable[ \t]*\r?\n([\s\S]*?)(?=^#{1,2} |$(?![\s\S]))/m);
  assert.ok(section?.[1].trim(), `Skill requires a nonempty Deliverable section: ${directoryName}`);
  return name;
}

/** Agent Plugins discovers one skill per immediate skills/ child, for MCP and skill packages alike. */
export async function validateBundledSkills(directory) {
  const files = await packageFiles(directory);
  const names = [];
  for (const filename of files) {
    const match = filename.match(/^skills\/([^/]+)\/SKILL\.md$/);
    if (match) names.push(validateBundledSkill(await readFile(path.join(directory, filename), 'utf8'), match[1]));
  }
  return names;
}
