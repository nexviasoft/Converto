export type GuideTable = {
  headers: string[];
  rows: string[][];
};

export type GuideSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: GuideTable;
  note?: {
    title: string;
    text: string;
  };
};

export type EditorialGuide = {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  summary: string;
  readingTime: string;
  updated: string;
  highlights: string[];
  sections: GuideSection[];
  faq: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string; description: string }[];
};

export const editorialGuides: Record<string, EditorialGuide> = {
  "how-converto-handles-files": {
    slug: "how-converto-handles-files",
    title: "How Converto handles uploaded files",
    shortTitle: "How uploaded files are handled",
    metaTitle: "How Converto Handles Uploaded Files",
    metaDescription:
      "Learn how browser-based and server-assisted conversions handle files, what temporary processing means, and how to make safer upload choices.",
    eyebrow: "Privacy & processing guide",
    summary:
      "A practical explanation of where conversion work happens, why some formats need server assistance, and what users should check before uploading personal or confidential material.",
    readingTime: "7 min read",
    updated: "July 6, 2026",
    highlights: [
      "Browser processing is preferred where the workflow supports it.",
      "Some heavier conversions require temporary server-assisted processing.",
      "Sensitive or irreplaceable files should always be handled with extra care.",
    ],
    sections: [
      {
        id: "two-processing-paths",
        title: "Two processing paths: browser and server",
        paragraphs: [
          "Not every file conversion can be completed in exactly the same way. Small image, document, and selected media tasks may be handled inside the browser when the required conversion engine is available. In that case, the file stays within the active browser session while the conversion runs.",
          "Other routes need codecs or processing resources that are not practical to ship entirely to a web browser. Those jobs can use a server-assisted workflow: the selected file is uploaded, processed for the requested output, and returned as a downloadable result.",
          "Converto presents the same simple upload-and-download interface for both paths, but the privacy implications are different. Browser processing limits how far the file travels. Server-assisted processing sends the file across the network for the duration of the job.",
        ],
        table: {
          headers: ["Workflow", "Where work happens", "Best suited to", "What the user should know"],
          rows: [
            ["Browser-based", "Inside the active browser session", "Supported lightweight conversions", "Closing or refreshing the page can clear the in-memory job"],
            ["Server-assisted", "On Converto processing infrastructure", "Codec-heavy or larger media workflows", "The file must be uploaded temporarily to complete the requested conversion"],
          ],
        },
      },
      {
        id: "temporary-processing",
        title: "What temporary processing means",
        paragraphs: [
          "Temporary processing means a file is used to complete the conversion rather than stored as a permanent personal library. The service is designed around short-lived jobs: receive the input, generate the requested output, make the result available, and clear working data after the processing window.",
          "Temporary does not mean that an upload is magically invisible. Network transmission and server processing still take place for server-assisted routes. That is why users should make a sensible decision based on the content of the file, not only on the convenience of the tool.",
        ],
        note: {
          title: "Good rule of thumb",
          text: "Use online conversion for everyday files you are comfortable transmitting. Avoid uploading passwords, identity documents, private legal records, unreleased business material, medical records, or files you are not authorized to process.",
        },
      },
      {
        id: "before-uploading",
        title: "A safer upload checklist",
        bullets: [
          "Confirm that you own the file or have permission to convert it.",
          "Keep an original copy before changing formats, compression, dimensions, or metadata.",
          "Remove confidential metadata when sharing images or documents publicly.",
          "Check the destination format before uploading so you do not repeat the job unnecessarily.",
          "Download and open the result before deleting the source file from your own device.",
          "Use local desktop software for highly confidential or regulated material.",
        ],
      },
      {
        id: "downloads-and-links",
        title: "Downloads, generated links, and browser storage",
        paragraphs: [
          "A finished conversion is typically delivered through a temporary download action in the browser. The browser may hold a generated object URL or a short-lived server response long enough for the result to be saved. These links should not be treated as permanent cloud storage.",
          "Your browser can also store small preference or quota values, depending on the workflow. Those values are different from the uploaded file itself. Clearing site data may remove local preferences, while clearing your Downloads folder is a separate device-level action.",
        ],
      },
      {
        id: "failed-jobs",
        title: "What happens when a conversion fails",
        paragraphs: [
          "A conversion can fail because the file is damaged, mislabeled, encrypted, too large, or encoded with an unsupported codec. A failed job should not be retried endlessly with sensitive material. First check whether the file opens normally on your device and whether its extension matches the actual format.",
          "For common media, trying a well-supported output such as MP3, MP4, JPG, PNG, or WEBP can help isolate compatibility problems. If the source itself is corrupt, changing the target format will not repair missing data.",
        ],
      },
      {
        id: "transparency",
        title: "Where to find the formal policy",
        paragraphs: [
          "This guide explains the workflow in practical language. The Privacy Policy describes data handling, cookies, advertising, analytics, and contact information in the formal site policy. The Terms page covers acceptable use and user responsibilities.",
        ],
      },
    ],
    faq: [
      {
        question: "Does every Converto job upload my file to a server?",
        answer:
          "No. Supported browser-based workflows can run inside the active browser session. Codec-heavy or server-assisted routes require an upload to complete the requested conversion.",
      },
      {
        question: "Can I use Converto as permanent file storage?",
        answer:
          "No. Conversion outputs and working files should be treated as temporary. Save the result to your own device or storage service after the job finishes.",
      },
      {
        question: "Should I upload confidential documents?",
        answer:
          "For highly confidential, regulated, or irreplaceable material, local offline software is the safer choice. Online tools are best reserved for files you are comfortable transmitting for processing.",
      },
    ],
    relatedLinks: [
      { href: "/privacy", label: "Privacy Policy", description: "Read the formal data-handling and advertising policy." },
      { href: "/terms", label: "Terms of Use", description: "Review acceptable use and user responsibilities." },
      { href: "/converter", label: "Open converter", description: "Start a supported browser or server-assisted workflow." },
    ],
  },

  "audio-bitrate-sample-rate": {
    slug: "audio-bitrate-sample-rate",
    title: "How to choose audio bitrate and sample rate",
    shortTitle: "Audio bitrate and sample rate",
    metaTitle: "Audio Bitrate and Sample Rate Guide",
    metaDescription:
      "Choose practical bitrate and sample-rate settings for music, speech, podcasts, editing, and everyday audio conversion without wasting file size.",
    eyebrow: "Audio settings guide",
    summary:
      "Bitrate controls how much compressed audio data is used over time, while sample rate describes how often audio is measured. The right choice depends on the source and the final use—not on selecting the largest number.",
    readingTime: "9 min read",
    updated: "July 6, 2026",
    highlights: [
      "128–192 kbps is often enough for speech and casual listening.",
      "256–320 kbps is a practical MP3 range when quality matters more than size.",
      "44.1 kHz fits music delivery; 48 kHz is common for video workflows.",
    ],
    sections: [
      {
        id: "bitrate-basics",
        title: "Bitrate: quality, size, and compression",
        paragraphs: [
          "Audio bitrate is the amount of compressed audio data used for each second of playback. It is commonly shown in kilobits per second, such as 128 kbps, 192 kbps, or 320 kbps. A higher bitrate usually gives a lossy encoder more room to preserve detail, but it also creates a larger file.",
          "Bitrate is not a universal quality score. A modern codec can sound better than an older codec at the same number, and a poor source cannot be repaired by exporting it at a higher bitrate. Converting a 128 kbps MP3 to 320 kbps only makes a larger file; it does not recreate information already removed from the source.",
        ],
      },
      {
        id: "sample-rate-basics",
        title: "Sample rate: 44.1 kHz, 48 kHz, and beyond",
        paragraphs: [
          "Sample rate describes how many times per second a digital audio signal is measured. A rate of 44.1 kHz means 44,100 samples per second. It is a long-standing standard for music delivery. A rate of 48 kHz is common in video, broadcast, and many editing workflows.",
          "Higher rates such as 88.2 kHz or 96 kHz can be useful during specialized recording and production, but they are rarely necessary for everyday listening files. Upsampling a low-rate source does not add real detail. For conversion, preserving the source rate or matching the destination workflow is usually the cleanest choice.",
        ],
        table: {
          headers: ["Use case", "Suggested format", "Practical bitrate", "Sample rate"],
          rows: [
            ["Voice notes and lectures", "MP3 or AAC", "96–128 kbps mono / 128 kbps stereo", "44.1 or 48 kHz"],
            ["Podcasts", "MP3 or AAC", "128–192 kbps", "44.1 or 48 kHz"],
            ["Casual music listening", "MP3 or AAC", "192–256 kbps", "44.1 kHz"],
            ["High-quality portable music", "MP3, AAC, or OPUS", "256–320 kbps for MP3", "44.1 kHz"],
            ["Video editing", "WAV or AAC", "Lossless working file or platform target", "48 kHz"],
            ["Archiving a lossless source", "FLAC or WAV", "Not expressed like lossy MP3 bitrate", "Preserve source rate"],
          ],
        },
      },
      {
        id: "constant-variable",
        title: "Constant versus variable bitrate",
        paragraphs: [
          "Constant bitrate uses roughly the same data rate throughout the file. It is predictable and widely compatible. Variable bitrate spends more data on complex passages and less on simple passages, which can improve efficiency at a similar average size.",
          "For most modern players, either approach is fine. Constant bitrate can be useful when a platform or legacy device expects a predictable stream. Variable bitrate is a sensible choice for general music when the encoder and playback environment support it.",
        ],
      },
      {
        id: "source-quality",
        title: "Match the setting to the source",
        bullets: [
          "Do not export above the useful quality of the original file just to display a larger number.",
          "Keep a lossless master if you expect to edit or convert the audio again later.",
          "For speech, mono can reduce size when there is no meaningful stereo information.",
          "For video projects, 48 kHz avoids unnecessary sample-rate conversion in many editors.",
          "For everyday music delivery, 44.1 kHz is usually sufficient.",
          "Test a short representative section before converting a large library.",
        ],
        note: {
          title: "Avoid generation loss",
          text: "Repeatedly converting between lossy formats can introduce additional artifacts. Return to the best available original whenever you need a new export.",
        },
      },
      {
        id: "recommendations",
        title: "Simple recommendations that work",
        paragraphs: [
          "For a podcast or spoken lecture, start around 128 kbps and listen for clear consonants and background noise. For everyday MP3 music, 192 or 256 kbps offers a strong balance. Use 320 kbps when you prefer a conservative quality-first MP3 export and the extra size is acceptable.",
          "Choose 44.1 kHz for music-focused delivery and 48 kHz for video-focused workflows. If you are converting a good lossless source for archiving, keep it lossless rather than selecting a very high lossy bitrate.",
        ],
      },
      {
        id: "quality-check",
        title: "How to check the result",
        paragraphs: [
          "Listen with the equipment and environment your audience will actually use. Pay attention to cymbals, applause, sharp consonants, stereo ambience, and quiet background details. Those areas often reveal aggressive compression first.",
          "Also compare file size and playback compatibility. A technically excellent export is not useful if the destination app rejects it or the file is too large for the intended upload limit.",
        ],
      },
    ],
    faq: [
      {
        question: "Is 320 kbps always better than 192 kbps?",
        answer:
          "It usually uses more data and can preserve more detail from a strong source, but the audible difference depends on the codec, source, listener, and playback equipment. It cannot repair a low-quality original.",
      },
      {
        question: "Should I choose 44.1 kHz or 48 kHz?",
        answer:
          "Use 44.1 kHz for typical music delivery and 48 kHz for video or broadcast-oriented work. Preserving the source rate is also a good default when no destination requirement exists.",
      },
      {
        question: "Does converting MP3 to WAV improve quality?",
        answer:
          "No. WAV can be easier to edit, but it does not restore audio information removed during MP3 compression.",
      },
    ],
    relatedLinks: [
      { href: "/formats/mp3", label: "MP3 format guide", description: "Understand MP3 compression, compatibility, and common uses." },
      { href: "/formats/flac", label: "FLAC format guide", description: "Learn when lossless compression is a better fit." },
      { href: "/compare/mp3-vs-wav", label: "MP3 vs WAV", description: "Compare portable delivery with editing-focused audio." },
    ],
  },

  "image-compression-formats": {
    slug: "image-compression-formats",
    title: "Image compression: JPG, PNG, WEBP, and AVIF explained",
    shortTitle: "JPG, PNG, WEBP, and AVIF",
    metaTitle: "JPG vs PNG vs WEBP vs AVIF Image Guide",
    metaDescription:
      "Compare JPG, PNG, WEBP, and AVIF for photographs, transparency, web performance, compatibility, editing, and image compression.",
    eyebrow: "Image format guide",
    summary:
      "The best image format depends on whether you need photographic compression, transparency, sharp interface graphics, broad compatibility, or the smallest practical web download.",
    readingTime: "10 min read",
    updated: "July 6, 2026",
    highlights: [
      "JPG remains a safe choice for photographs and broad compatibility.",
      "PNG is strong for transparency, screenshots, and crisp graphics.",
      "WEBP and AVIF can reduce web image size, but workflow support should be checked.",
    ],
    sections: [
      {
        id: "format-overview",
        title: "Four formats, four different priorities",
        paragraphs: [
          "JPG, PNG, WEBP, and AVIF are often presented as direct competitors, but they solve different problems. JPG is a mature lossy format for photographs. PNG provides lossless storage and reliable transparency. WEBP combines lossy, lossless, and transparency options in a web-friendly format. AVIF aims for very efficient modern compression and can preserve transparency and high dynamic range information in supported workflows.",
          "Choosing the newest format is not automatically correct. The destination platform, editing software, transparency requirements, image type, and acceptable processing time all matter.",
        ],
        table: {
          headers: ["Format", "Compression", "Transparency", "Strongest use", "Compatibility"],
          rows: [
            ["JPG", "Lossy", "No", "Photographs and universal sharing", "Very high"],
            ["PNG", "Lossless", "Yes", "Screenshots, logos, interface graphics", "Very high"],
            ["WEBP", "Lossy or lossless", "Yes", "Modern web delivery", "High"],
            ["AVIF", "Lossy or lossless", "Yes", "Small modern web images and advanced color workflows", "Growing"],
          ],
        },
      },
      {
        id: "jpg",
        title: "When JPG is the practical choice",
        paragraphs: [
          "JPG works especially well for photographs, gradients, and images with many colors. Its lossy compression can reduce size dramatically, and virtually every browser, phone, editor, and publishing platform understands it.",
          "JPG is a poor choice for transparent graphics, text-heavy screenshots, and logos with sharp flat-color edges. Repeatedly saving a JPG can add visible artifacts, so keep an original or lossless master when future editing is likely.",
        ],
      },
      {
        id: "png",
        title: "When PNG earns the larger file size",
        paragraphs: [
          "PNG is lossless and supports alpha transparency, making it reliable for logos, screenshots, diagrams, interface elements, and graphics that need crisp edges. It preserves exact pixel values better than a typical lossy photo export.",
          "The trade-off is size. A large photographic PNG can be many times heavier than a well-compressed JPG, WEBP, or AVIF file. Use PNG because its properties are needed, not simply because it sounds higher quality.",
        ],
      },
      {
        id: "webp-avif",
        title: "WEBP and AVIF for modern web delivery",
        paragraphs: [
          "WEBP is a flexible format that supports lossy and lossless compression, transparency, and animation. It is a strong general-purpose option for modern websites because it can replace both JPG and PNG in many delivery scenarios.",
          "AVIF can achieve excellent compression, especially for photographic content, but encoding can take longer and support in older tools may be less predictable. It is best used when the publishing stack, browser targets, and content workflow have been tested.",
        ],
        note: {
          title: "Keep a source master",
          text: "For a website, export optimized WEBP or AVIF copies from a high-quality original. Do not make a heavily compressed delivery file your only master copy.",
        },
      },
      {
        id: "choose-by-content",
        title: "Choose by image content",
        bullets: [
          "Photograph for broad sharing: JPG.",
          "Photograph for a modern website: WEBP or AVIF, with a tested fallback strategy where needed.",
          "Transparent logo or interface element: PNG or lossless WEBP.",
          "Screenshot with small text: PNG or lossless WEBP.",
          "Animated web graphic: animated WEBP or another format supported by the target platform.",
          "Long-term editable source: keep the original project file or a lossless master.",
        ],
      },
      {
        id: "dimensions-quality",
        title: "Dimensions often matter more than a tiny quality change",
        paragraphs: [
          "An image that is 4000 pixels wide but displayed at 900 pixels wastes bandwidth regardless of format. Resize to the largest dimension the design genuinely needs, then choose compression quality. This usually produces a bigger improvement than moving a quality slider by a few points.",
          "For responsive sites, multiple image sizes allow small screens to download smaller files. File format, dimensions, quality, and caching work together; no single setting solves every performance problem.",
        ],
      },
      {
        id: "conversion-cautions",
        title: "What conversion can and cannot do",
        paragraphs: [
          "Converting PNG to JPG can reduce file size, but transparent areas must be replaced with a solid background. Converting JPG to PNG does not recover lost detail; it only stores the existing pixels in a lossless container. Converting an old image to AVIF can improve delivery size, but the final quality still depends on the source.",
          "Always preview transparent edges, small text, gradients, skin tones, and dark areas after conversion. These details expose unsuitable settings quickly.",
        ],
      },
    ],
    faq: [
      {
        question: "Is WEBP always better than JPG?",
        answer:
          "WEBP is often more efficient for web delivery, but JPG has broader support across older tools and external workflows. The best choice depends on where the image will be opened and edited.",
      },
      {
        question: "Does converting JPG to PNG improve quality?",
        answer:
          "No. PNG prevents additional lossy compression after conversion, but it cannot restore detail already removed from the JPG source.",
      },
      {
        question: "Which format should I use for transparency?",
        answer:
          "PNG is the safest universal choice. WEBP and AVIF also support transparency in modern workflows, but the destination platform should be checked.",
      },
    ],
    relatedLinks: [
      { href: "/formats/webp", label: "WEBP format guide", description: "Explore WEBP use cases and common conversions." },
      { href: "/compare/png-vs-jpg", label: "PNG vs JPG", description: "Compare transparency, size, and image type." },
      { href: "/convert/png-to-webp", label: "PNG to WEBP", description: "Create a modern web-friendly version of a PNG file." },
    ],
  },
};

export const allEditorialGuides = Object.values(editorialGuides);
