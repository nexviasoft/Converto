"use client";

import AdsterraBanner728x90 from "@/components/ads/AdsterraBanner728x90";
import AdsterraBanner320x50 from "@/components/ads/AdsterraBanner320x50";

export default function AdsterraResponsiveBanner({
  className = "",
}: {
  className?: string;
}) {
  return (
    <>
      <AdsterraBanner728x90 className={className} />
      <AdsterraBanner320x50 className={className} />
    </>
  );
}
