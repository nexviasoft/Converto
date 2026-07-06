# Converto fix notes

Applied fixes:

- Restored the previous Converto logo asset.
- Removed Clerk UI/runtime usage from the public site so local/preview does not show “Missing environment keys”.
- Kept the Sign in chip as a simple /pro link for now; no auth modal is required for ad review.
- Added compact desktop density through html font-size instead of CSS zoom, so buttons/dropdowns keep normal click behavior.
- Reduced header logo dimensions so the old logo feels closer to the original layout.
- Renamed `Components` to `components` for case-sensitive Vercel/Linux builds.
- Removed `node_modules`, `.next`, `.vs`, `bin`, `obj`, and `.clerk` from this package.

After extracting:

```powershell
npm install
npm run dev
```

For preview branch:

```powershell
git checkout main
git pull origin main
git checkout -B ad-ready-preview
git add .
git commit -m "Fix ad-ready preview layout"
git push -u origin ad-ready-preview
```
