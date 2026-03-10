import type { Metadata } from "next";
import ConverterPageContent from "@/components/converter/ConverterPageContent";

export const metadata: Metadata = {
  title: "Convert Files Online Free | Converto",
  description:
    "Free online file converter for audio, video, and everyday format changes.",
};

export default function ConverterPage() {
  return (
    <ConverterPageContent
      seoTitle="Convert files online"
      seoDescription="Free online file converter for audio, video, and everyday format changes."
    />
  );
}