# Converto V25 — SEO foundation + conversion format lock

This package is based on `converto-site_stale-result-clear_v24` and carries the
V24 SEO/indexing foundation forward without removing the newer stale-result fix.

## Preserved current-version fix

- A completed file remains tied to the exact output format used for that conversion.
- Changing the output format after completion clears the old result instead of
  relabelling the same blob with a different extension.

## Output format lock

- The Single and Batch output-format selectors are disabled while a conversion
  is loading/processing.
- An active conversion closes any open format menu immediately.
- The selector shows a lock icon and disabled cursor/state during processing.
- Format-option click handlers also contain a defensive lock guard.
- The selector unlocks after success or error, so a new conversion can be prepared.

## SEO/indexing foundation carried over

- Canonical production origin: `https://www.converto.tools`.
- One-step HTTPS + `www` permanent redirect for production requests.
- Route-specific canonicals and duplicate `| Converto` title cleanup.
- `/convert/png-to-ico` and `/convert/tiff-to-jpg` are indexable and include
  unique content, FAQs, metadata, sitemap entries, and internal links.
- Microsoft Clarity events cover file selection/rejection, conversion start,
  success/failure, and download clicks.

## Validation

- TypeScript/TSX syntax-transpile validation completed for 92 source files.
- The uploaded package's current stale-result-clear behavior remains present.
- ZIP integrity is checked after packaging.
