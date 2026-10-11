import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('reviewed engine metadata points to an immutable official asset', async () => {
  const channel = JSON.parse(await readFile(new URL('../omp-engine-channel.json', import.meta.url), 'utf8'));
  assert.equal(channel.schema, 1);
  assert.equal(channel.source, 'official');
  assert.equal(channel.feedUrl, null);
  const release = channel.release;
  assert.match(release.id, /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$/);
  assert.match(release.version, /^\d+\.\d+\.\d+$/);
  assert.match(release.minAppVersion, /^\d+\.\d+\.\d+$/);
  assert.equal(release.platform, 'win32-x64');
  assert.equal(release.abi, 'omp-official-rpc-1');
  assert.ok(Number.isSafeInteger(release.revision) && release.revision > 0);
  assert.ok(Number.isSafeInteger(release.bytes) && release.bytes > 0 && release.bytes <= 600_000_000);
  assert.match(release.sha256, /^[a-f0-9]{64}$/);
  assert.equal(release.url, `https://github.com/can1357/oh-my-pi/releases/download/v${release.version}/omp-windows-x64.exe`);
});
