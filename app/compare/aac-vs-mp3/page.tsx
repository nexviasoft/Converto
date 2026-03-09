import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "AAC vs MP3",
  description:
    "Compare AAC vs MP3 for audio quality, file size, compatibility, and streaming use. Learn when to use each format and convert between them with Converto.",
  alternates: {
    canonical: `${siteUrl}/compare/aac-vs-mp3`,
  },
  openGraph: {
    title: "AAC vs MP3 | Converto",
    description:
      "Compare AAC vs MP3 for quality, size, and compatibility.",
    url: `${siteUrl}/compare/aac-vs-mp3`,
    siteName: "Converto",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "AAC vs MP3 | Converto",
    description:
      "Compare AAC vs MP3 for quality, size, and compatibility.",
  },
};

export default function AACVsMP3Page() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-4xl font-bold">AAC vs MP3</h1>

        <p className="mt-4 text-white/70">
          AAC and MP3 are both lossy audio formats built for compact file sizes,
          but AAC is generally considered more efficient at similar bitrates.
          MP3 remains one of the most universal formats, while AAC is often
          preferred in modern streaming and Apple-centered ecosystems.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/convert/aac-to-mp3"
            className="rounded-full bg-white px-5 py-2.5 text-black"
          >
            Convert AAC to MP3
          </Link>

          <Link
            href="/convert/mp3-to-aac"
            className="rounded-full bg-white/10 px-5 py-2.5"
          >
            Convert MP3 to AAC
          </Link>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-2xl font-semibold">What is AAC?</h2>
            <p className="mt-3 text-white/70">
              AAC (Advanced Audio Coding) is a modern lossy audio format designed
              to deliver better perceived sound quality than MP3 at similar file
              sizes. It is commonly used by streaming platforms, mobile devices,
              and Apple products.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>• Modern lossy compression</li>
              <li>• Efficient at lower bitrates</li>
              <li>• Common in streaming and mobile apps</li>
            </ul>
          </div>

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-2xl font-semibold">What is MP3?</h2>
            <p className="mt-3 text-white/70">
              MP3 is one of the most recognized audio formats in the world. It
              offers small file sizes, strong compatibility, and simple playback
              across almost every platform and device.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>• Very high compatibility</li>
              <li>• Small and portable files</li>
              <li>• Standard everyday listening format</li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">AAC vs MP3: Key Differences</h2>

          <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 text-sm">
            <div className="bg-white/10 p-4 font-semibold">Feature</div>
            <div className="bg-white/10 p-4 font-semibold">AAC</div>
            <div className="bg-white/10 p-4 font-semibold">MP3</div>

            <div className="p-4">Compression</div>
            <div className="p-4">Lossy</div>
            <div className="p-4">Lossy</div>

            <div className="p-4">Quality at similar bitrate</div>
            <div className="p-4">Often better</div>
            <div className="p-4">Usually lower</div>

            <div className="p-4">Compatibility</div>
            <div className="p-4">High</div>
            <div className="p-4">Very high</div>

            <div className="p-4">Best use</div>
            <div className="p-4">Streaming, modern devices</div>
            <div className="p-4">Playback, sharing, broad support</div>

            <div className="p-4">Portability</div>
            <div className="p-4">Excellent</div>
            <div className="p-4">Excellent</div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-xl font-semibold">When to use AAC</h2>
            <p className="mt-3 text-white/70">
              Use AAC when you want efficient compression, strong sound quality
              at modest bitrates, or a format that fits modern streaming and
              mobile ecosystems well.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-xl font-semibold">When to use MP3</h2>
            <p className="mt-3 text-white/70">
              Use MP3 when you want the most universally compatible option for
              music playback, easy sharing, downloads, and older devices.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-xl bg-white/10 p-6">
          <h2 className="text-2xl font-semibold">Convert between AAC and MP3</h2>

          <p className="mt-3 text-white/70">
            Convert AAC to MP3 when you need broader compatibility. Convert MP3
            to AAC when you want a more modern compressed format for certain
            devices or workflows.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/convert/aac-to-mp3"
              className="rounded-full bg-white px-5 py-2 text-black"
            >
              AAC to MP3
            </Link>

            <Link
              href="/convert/mp3-to-aac"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              MP3 to AAC
            </Link>

            <Link
              href="/formats/aac"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              AAC format guide
            </Link>

            <Link
              href="/formats/mp3"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              MP3 format guide
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}