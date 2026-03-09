import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Supported File Formats",
  description:
    "List of supported audio, video and image formats you can convert with Converto.",
};

export default function FormatsPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Supported Formats</h1>

        <p className="text-white/70 mb-10">
          Converto supports a wide range of audio, video and image formats.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Audio</h2>
            <ul className="space-y-2 text-white/70">
              <li>MP3</li>
              <li>WAV</li>
              <li>AAC</li>
              <li>FLAC</li>
              <li>M4A</li>
              <li>OGG</li>
              <li>OPUS</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Video</h2>
            <ul className="space-y-2 text-white/70">
              <li>MP4</li>
              <li>WEBM</li>
              <li>MOV</li>
              <li>GIF</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link
                  href="/convert/mp4-to-mp3"
                  className="hover:text-purple-400 transition"
                >
                  MP4 to MP3
                </Link>
              </li>
              <li>
                <Link
                  href="/convert/mp3-to-wav"
                  className="hover:text-purple-400 transition"
                >
                  MP3 to WAV
                </Link>
              </li>
              <li>
                <Link
                  href="/convert/mp4-to-gif"
                  className="hover:text-purple-400 transition"
                >
                  MP4 to GIF
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}