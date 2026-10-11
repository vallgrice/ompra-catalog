# Reviewed OMP engine compatibility

[`omp-engine-channel.json`](../omp-engine-channel.json) is a small Ompra compatibility record, independent of plugin catalog versions. It contains no executable or engine source. The referenced Windows x64 asset is downloaded directly from the official `can1357/oh-my-pi` release.

Ompra discovers this optional file through the existing public repository index. Older apps and plugin catalog consumers are unaffected. If the file is not published yet, the app uses its shipped verified baseline without requesting a nonexistent raw URL.

Before updating the record:

1. Obtain the official asset, LICENSE, THIRD-PARTY-NOTICES.txt and SHA256SUMS.txt for an exact upstream tag.
2. Verify byte length and SHA-256 before execution. Keep the direct official asset URL.
3. Run Ompra's isolated RPC, streaming, cancellation, multiple tabs/folders, portable persistence and restart tests against the candidate, using a local model fixture and no real credentials.
4. Validate stored data compatibility and executable rollback. Set a higher `minAppVersion` when a new app adapter is needed.
5. Use a new immutable `id` and strictly increasing `revision`. Never change an already published identity's version, ABI, size, or checksum.
6. Run `npm test`, then publish reviewed metadata through normal owner-approved review. Do not upload engine binaries to this repository.

The current reviewed baseline is official OMP **18.9.1**, package revision **2**, ABI **omp-official-rpc-1**, minimum Ompra **0.1.0**. Unknown upstream releases are not automatically approved from their version number or a smoke test alone. Updates are staged for next launch and retain the previous verified executable. The desktop application and this metadata have separate release cycles.
