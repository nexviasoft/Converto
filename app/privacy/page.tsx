export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14">
        <a href="/" className="text-sm text-white/70 hover:text-white transition">
          ← Back to home
        </a>

        <h1 className="mt-4 text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-white/70">
          We keep data collection minimal and focus on temporary processing only.
        </p>

        <div className="mt-8 space-y-6">

          <section className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Files & Processing</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/70">
              <li>Mobile app conversions are processed on-device whenever possible.</li>
              <li>Online demo conversions run directly in your browser.</li>
              <li>Server-based conversions may temporarily upload files for processing.</li>
            </ul>
          </section>

          <section className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Temporary Storage</h2>
            <p className="mt-3 text-sm text-white/70">
              Files uploaded for server-side processing are stored only temporarily
              and automatically deleted after a short processing window. We do not
              keep or archive user files.
            </p>
          </section>

          <section className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Ads (Google AdSense)</h2>
            <p className="mt-3 text-sm text-white/70">
              We may display advertisements to support the free version of our
              service. Third-party vendors, including Google, may use cookies or
              device identifiers to serve ads based on prior visits to this or
              other websites. Users can manage or disable personalized ads in
              their Google Ads settings.
            </p>
          </section>

          <section className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Data Collection</h2>
            <p className="mt-3 text-sm text-white/70">
              We collect minimal technical information such as browser type,
              device type, and basic usage analytics to maintain service
              stability and improve the product.
            </p>
          </section>

          <section className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Contact</h2>
            <p className="mt-3 text-sm text-white/70">
              support@converto.tools
            </p>
          </section>

          <p className="text-xs text-white/50">
            Last updated: March 2026
          </p>

        </div>
      </div>
    </main>
  );
}