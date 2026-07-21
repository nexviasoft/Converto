# Adsterra standard banner fix (v6)

- Replaced `srcDoc` (`about:srcdoc`) banner documents with same-origin static HTML pages under `/public/adsterra/`.
- Each static page contains the Adsterra banner code in the HTML body without changing the supplied ad options.
- Standard banner containers remain off-screen while loading and are removed after a timeout when no creative is returned, preventing empty ad boxes.
- Native banner integration is unchanged.
