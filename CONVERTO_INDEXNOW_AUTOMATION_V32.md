# Converto V32 — IndexNow deployment automation

## Added

- A root-level IndexNow verification file:
  - `/6431845eec2daa82d9317c165681ec0f.txt`
- A production deployment marker:
  - `/api/deployment-version`
- A dependency-free IndexNow submission script:
  - `scripts/submit-indexnow.mjs`
- A GitHub Actions workflow:
  - `.github/workflows/indexnow.yml`
- An npm command for manual checks:
  - `npm run indexnow:submit`

## How it works

1. A push reaches `main` or `master`.
2. Vercel starts the production deployment as usual.
3. GitHub Actions polls `/api/deployment-version` until the live production SHA matches the pushed commit.
4. The workflow fetches the live sitemap.
5. It maps changed project files to affected public URLs.
6. Only relevant sitemap URLs are submitted to the global IndexNow endpoint.

The workflow does not require a private API secret. IndexNow ownership is verified through the public root key file, as required by the protocol.

## Notes

- Documentation-only commits do not trigger URL submissions.
- Global SEO/canonical/sitemap changes submit the full sitemap.
- Shared converter-content changes submit the converter hub and indexable converter pages.
- IndexNow notification is a discovery signal; it does not guarantee crawling or indexing.
