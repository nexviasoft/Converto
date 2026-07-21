# Converto conversion logic and completion panel v13

## Completion panel
- Replaced “Download again” with “Download file”.
- Clarified that conversion is complete but the result still needs to be downloaded.
- Added the generated filename, clearer primary/secondary actions, and a compact completion state.
- Reduced follow-up suggestions to three relevant routes.
- Same-format and unrelated follow-up cards are no longer generated.

## Conversion rules
- Same-format routes such as MP4 to MP4 and JPG to JPG are blocked.
- TIFF and ICO are temporarily removed from public upload and output options.
- Audio inputs can only convert to other audio formats.
- Video inputs can convert to audio, other video formats, GIF, PNG, JPG, or WEBP.
- Image inputs can only convert to other supported image formats.
- Unsupported direct URLs such as MPEG to ICO return a not-found response instead of opening a misleading converter.
- Batch output options are reduced to formats compatible with every selected file.

## Content safety
- Format and comparison pages automatically hide conversion links that are no longer supported.
- Landing-page format support copy now reflects the reliable public format set.

## Verification
- TypeScript check completed successfully.
- Next.js production build completed successfully with 106 generated pages.
- Route checks confirmed valid and invalid conversion combinations behave as intended.
