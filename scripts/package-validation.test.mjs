import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { validateBundledSkill, validateBundledSkills, verifyImmutablePackage } from './package-validation.mjs';

const packagePath = 'plugins/demo';
const skill = (name = 'ompra-demo', description = 'Read the requested data safely.') => `---\nname: ${name}\ndescription: ${description}\nlicense: MIT\nmetadata:\n  author: Ompra contributors\n  version: 1.0.0\n---\n\n# Demo\n\n## Deliverable\n\nReport results and coverage.\n`;

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ompra-catalog-validation-'));
  t.after(async () => {
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('ompra-catalog-validation-'));
    await rm(root, { recursive: true, force: true });
  });
  const gitEnv = {
    ...Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_'))),
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: path.join(root, 'no-global-config'),
  };
  const git = (...args) => execFileSync('git', args, { cwd: root, env: gitEnv, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  git('init', '-q');
  git('config', 'user.name', 'Catalog validation fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'core.autocrlf', 'false');
  const emptyHooks = path.join(root, 'empty-hooks');
  await mkdir(emptyHooks);
  git('config', 'core.hooksPath', emptyHooks);
  git('config', 'commit.gpgSign', 'false');
  const directory = path.join(root, packagePath);
  await mkdir(directory, { recursive: true });
  const write = async (filename, content) => {
    const target = path.join(directory, filename);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content);
  };
  const commit = () => {
    git('add', '--', packagePath);
    git('commit', '-qm', 'Synthetic package fixture');
    return git('rev-parse', 'HEAD');
  };
  await write('package.json', '{"name":"@ompra/mcp-demo"}\n');
  return { root, directory, git, gitEnv, write, commit, verify: sha => verifyImmutablePackage(root, packagePath, sha, gitEnv) };
}

test('a manifest-only MCP package needs no skill', async t => {
  const f = await fixture(t);
  const sha = f.commit();
  await f.verify(sha);
  assert.deepEqual(await validateBundledSkills(f.directory), []);
});

test('an old pin rejects a newly bundled MCP skill', async t => {
  const f = await fixture(t);
  const sha = f.commit();
  await f.write('skills/ompra-demo/SKILL.md', skill());
  await assert.rejects(f.verify(sha), /files differ from immutable commit/);
  assert.deepEqual(await validateBundledSkills(f.directory), ['ompra-demo']);
  await f.verify(f.commit());
});

test('a pin rejects changed skill contents and a locally missing skill', async t => {
  const f = await fixture(t);
  await f.write('skills/ompra-demo/SKILL.md', skill());
  const sha = f.commit();
  await f.write('skills/ompra-demo/SKILL.md', skill('ompra-demo', 'Changed instructions.'));
  await assert.rejects(f.verify(sha), /SKILL\.md differs from immutable commit/);
  await rm(path.join(f.directory, 'skills', 'ompra-demo', 'SKILL.md'));
  await assert.rejects(f.verify(sha), /files differ from immutable commit/);
});

test('all package files are checked, with Windows text line endings tolerated', async t => {
  const f = await fixture(t);
  await f.write('skills/ompra-demo/SKILL.md', skill());
  await f.write('skills/ompra-demo/references/example.json', '{"description":"First\\nSecond"}\n');
  const sha = f.commit();
  await f.write('skills/ompra-demo/SKILL.md', skill().replaceAll('\n', '\r\n'));
  await f.verify(sha);
  await f.write('skills/ompra-demo/references/example.json', '{"description":"Changed"}\n');
  await assert.rejects(f.verify(sha), /example\.json differs from immutable commit/);
});

test('binary package files are compared without line-ending normalization', async t => {
  const f = await fixture(t);
  await f.write('fixture.bin', Buffer.from([0, 13, 10]));
  const sha = f.commit();
  await f.write('fixture.bin', Buffer.from([0, 10]));
  await assert.rejects(f.verify(sha), /fixture\.bin differs from immutable commit/);
});

test('build junk in local and committed packages is rejected', async t => {
  const f = await fixture(t);
  const sha = f.commit();
  await f.write('node_modules/example/package.json', '{}\n');
  await assert.rejects(f.verify(sha), /Forbidden package path: node_modules/);
  await assert.rejects(validateBundledSkills(f.directory), /Forbidden package path: node_modules/);
  const junkSha = f.commit();
  await assert.rejects(f.verify(junkSha), /Forbidden package path: node_modules/);
});

test('committed symlinks are rejected without following their targets', async t => {
  const f = await fixture(t);
  f.commit();
  const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], { cwd: f.root, env: f.gitEnv, input: '../../outside\n', encoding: 'utf8' }).trim();
  f.git('update-index', '--add', '--cacheinfo', `120000,${blob},${packagePath}/escape`);
  f.git('commit', '-qm', 'Synthetic symlink fixture');
  await assert.rejects(f.verify(f.git('rev-parse', 'HEAD')), /Committed package entry must be a regular file: escape/);
});

test('local directory links cannot escape a package during verification or skill validation', async t => {
  const f = await fixture(t);
  const sha = f.commit();
  const outside = path.join(f.root, 'outside-package');
  await mkdir(outside);
  await writeFile(path.join(outside, 'SKILL.md'), skill('escape'));
  await symlink(outside, path.join(f.directory, 'escape'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(f.verify(sha), /Package symlinks are not allowed: escape/);
  await assert.rejects(validateBundledSkills(f.directory), /Package symlinks are not allowed: escape/);
});

test('valid canonical, quoted and folded skill descriptions are accepted', () => {
  assert.equal(validateBundledSkill(skill(), 'ompra-demo'), 'ompra-demo');
  assert.equal(validateBundledSkill(skill('ompra-demo', '"Read: the requested data safely."'), 'ompra-demo'), 'ompra-demo');
  assert.equal(validateBundledSkill(skill('ompra-demo', ">-\n  Read the requested data\n  and report coverage."), 'ompra-demo'), 'ompra-demo');
});

test('invalid bundled skill frontmatter and empty Deliverable are rejected', () => {
  for (const [content, pattern] of [
    [skill('other-name'), /name must match its directory/],
    [skill('ompra-demo', ''), /description must contain/],
    [skill('ompra-demo', '# no description'), /description must contain/],
    [skill('ompra-demo', 'true'), /must be a string/],
    [skill('ompra-demo', '123'), /must be a string/],
    [skill().replace('name: ompra-demo\n', ''), /requires one name/],
    [skill().replace('name: ompra-demo\n', 'name: ompra-demo\nname: ompra-demo\n'), /requires one name/],
    [skill().replace('license: MIT', 'alwaysApply: true'), /Unsupported skill frontmatter/],
    [skill().replace('license: MIT', 'malformed line'), /Malformed top-level skill frontmatter/],
    [skill().replace('Report results and coverage.', ''), /nonempty Deliverable/],
    [skill().replace('## Deliverable', '## Output'), /nonempty Deliverable/],
    [skill().replace(/^---\n/, ''), /Missing skill frontmatter/],
  ]) assert.throws(() => validateBundledSkill(content, 'ompra-demo'), pattern);
});

test('the current repository catalog passes its schema and package checks', async () => {
  const directory = path.dirname(fileURLToPath(import.meta.url));
  const validator = path.join(directory, 'validate.mjs');
  assert.ok((await readFile(validator, 'utf8')).includes('validateBundledSkills'));
  execFileSync(process.execPath, [validator], { cwd: path.dirname(directory), stdio: 'pipe' });
});
