"use client";

type ConverterShellProps = {
  title: string;
  description: string;
};

export default function ConverterShell({
  title,
  description,
}: ConverterShellProps) {
  return (
    <main className="min-h-screen bg-[#151233] px-4 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-3 text-white/70">{description}</p>
      </div>
    </main>
  );
}