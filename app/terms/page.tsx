export default function TermsPage() {
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

        <h1 className="mt-4 text-3xl font-semibold">Terms of Service</h1>
        <p className="mt-2 text-sm text-white/70">
          By using this service you agree to the following rules.
        </p>

        <div className="mt-8 space-y-6">

          <section className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Acceptable Use</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/70">
              <li>Do not upload illegal content.</li>
              <li>Do not upload files you do not have the right to process.</li>
              <li>Do not attempt to abuse, overload, or attack the service.</li>
            </ul>
          </section>

          <section className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">User Responsibility</h2>
            <p className="mt-3 text-sm text-white/70">
              Users are responsible for ensuring they have the necessary rights
              to upload and convert files. We do not verify file ownership.
            </p>
          </section>

          <section className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Service Limits</h2>
            <p className="mt-3 text-sm text-white/70">
              To maintain stability, limits such as file size, conversion rate,
              or daily usage may be applied.
            </p>
          </section>

          <section className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Disclaimer</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/70">
              <li>Conversions are provided “as is”.</li>
              <li>Output quality may vary depending on codec and device.</li>
              <li>We are not responsible for data loss — keep backups.</li>
            </ul>
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