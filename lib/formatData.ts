export type FormatCategory = "audio" | "video" | "image";

export type FormatDataItem = {
  slug: string;
  label: string;
  category: FormatCategory;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  whyUse: string[];
  bestFor: string[];
  commonConversions: { href: string; label: string }[];
  relatedFormats: { href: string; label: string }[];
};

export const formatData: Record<string, FormatDataItem> = {
  mp3: {
    slug: "mp3",
    label: "MP3",
    category: "audio",
    title: "MP3 File Format",
    metaTitle: "MP3 File Format",
    metaDescription:
      "Learn about the MP3 audio format, how it works, and how to convert MP3 files to WAV, AAC, FLAC, and other formats with Converto.",
    intro:
      "MP3 is one of the most widely used digital audio formats. It uses lossy compression to reduce file size while keeping audio quality good enough for everyday listening, streaming, downloads, and portable playback.",
    whyUse: [
      "Very broad compatibility across phones, laptops, browsers, apps, and older devices.",
      "Small file sizes compared with lossless formats like WAV or FLAC.",
      "Useful for music libraries, podcasts, voice clips, and fast file sharing.",
    ],
    bestFor: [
      "Everyday listening",
      "Portable music files",
      "General compatibility",
    ],
    commonConversions: [
      { href: "/convert/mp3-to-wav", label: "MP3 → WAV" },
      { href: "/convert/mp3-to-flac", label: "MP3 → FLAC" },
      { href: "/convert/mp3-to-aac", label: "MP3 → AAC" },
      { href: "/convert/mp3-to-m4a", label: "MP3 → M4A" },
    ],
    relatedFormats: [
      { href: "/formats/wav", label: "WAV" },
      { href: "/formats/aac", label: "AAC" },
      { href: "/formats/flac", label: "FLAC" },
      { href: "/formats/m4a", label: "M4A" },
    ],
  },

  wav: {
    slug: "wav",
    label: "WAV",
    category: "audio",
    title: "WAV File Format",
    metaTitle: "WAV File Format",
    metaDescription:
      "Learn about the WAV audio format, when to use it, and how to convert WAV files to MP3, FLAC, AAC, and other formats with Converto.",
    intro:
      "WAV is a high-quality audio format often used for recording, editing, mastering, and archiving. It usually stores uncompressed audio, which makes it larger than MP3 or AAC but stronger for professional workflows.",
    whyUse: [
      "Excellent quality for editing, mixing, and production work.",
      "Common in studio, broadcast, and post-production workflows.",
      "Good choice when preserving raw or near-raw audio matters more than file size.",
    ],
    bestFor: [
      "Editing and mastering",
      "Studio workflows",
      "High-quality source files",
    ],
    commonConversions: [
      { href: "/convert/wav-to-mp3", label: "WAV → MP3" },
      { href: "/convert/wav-to-flac", label: "WAV → FLAC" },
      { href: "/convert/wav-to-aac", label: "WAV → AAC" },
      { href: "/convert/wav-to-opus", label: "WAV → OPUS" },
    ],
    relatedFormats: [
      { href: "/formats/mp3", label: "MP3" },
      { href: "/formats/flac", label: "FLAC" },
      { href: "/formats/aiff", label: "AIFF" },
      { href: "/formats/aac", label: "AAC" },
    ],
  },

  aac: {
    slug: "aac",
    label: "AAC",
    category: "audio",
    title: "AAC File Format",
    metaTitle: "AAC File Format",
    metaDescription:
      "Learn about the AAC audio format, how it compares with MP3, and when to convert AAC files with Converto.",
    intro:
      "AAC is a modern lossy audio format designed to deliver efficient compression and strong perceived sound quality at relatively modest bitrates. It is common in mobile devices, streaming, and Apple-related workflows.",
    whyUse: [
      "Often more efficient than MP3 at similar bitrates.",
      "Common in streaming, apps, and mobile playback.",
      "Useful when you want compact files with modern compatibility.",
    ],
    bestFor: [
      "Streaming audio",
      "Modern lossy compression",
      "Mobile and app playback",
    ],
    commonConversions: [
      { href: "/convert/aac-to-mp3", label: "AAC → MP3" },
      { href: "/convert/aac-to-wav", label: "AAC → WAV" },
      { href: "/convert/aac-to-flac", label: "AAC → FLAC" },
      { href: "/convert/aac-to-m4a", label: "AAC → M4A" },
    ],
    relatedFormats: [
      { href: "/formats/mp3", label: "MP3" },
      { href: "/formats/m4a", label: "M4A" },
      { href: "/formats/opus", label: "OPUS" },
      { href: "/formats/flac", label: "FLAC" },
    ],
  },

  m4a: {
    slug: "m4a",
    label: "M4A",
    category: "audio",
    title: "M4A File Format",
    metaTitle: "M4A File Format",
    metaDescription:
      "Learn about the M4A audio format, how it works, and when to convert M4A files to MP3, WAV, AAC, and more with Converto.",
    intro:
      "M4A is an audio container commonly associated with AAC-encoded audio and Apple-friendly ecosystems. It is widely used for music, downloads, podcasts, and compact listening files.",
    whyUse: [
      "Often used in Apple-related music and audio workflows.",
      "Compact file sizes with modern compression.",
      "Good for music libraries, podcasts, and mobile playback.",
    ],
    bestFor: [
      "Apple-oriented audio",
      "Compact listening files",
      "Music and podcast storage",
    ],
    commonConversions: [
      { href: "/convert/m4a-to-mp3", label: "M4A → MP3" },
      { href: "/convert/m4a-to-wav", label: "M4A → WAV" },
      { href: "/convert/m4a-to-aac", label: "M4A → AAC" },
      { href: "/convert/m4a-to-flac", label: "M4A → FLAC" },
    ],
    relatedFormats: [
      { href: "/formats/aac", label: "AAC" },
      { href: "/formats/mp3", label: "MP3" },
      { href: "/formats/wav", label: "WAV" },
      { href: "/formats/opus", label: "OPUS" },
    ],
  },

  ogg: {
    slug: "ogg",
    label: "OGG",
    category: "audio",
    title: "OGG File Format",
    metaTitle: "OGG File Format",
    metaDescription:
      "Learn about the OGG audio format, where it is used, and how to convert OGG files with Converto.",
    intro:
      "OGG usually refers to audio stored in the Ogg container, often with Vorbis compression. It is common in open-source ecosystems, web audio, and some games or software tools.",
    whyUse: [
      "Useful in open and web-friendly audio workflows.",
      "Can offer good compression and quality balance.",
      "Seen in apps, tools, game assets, and browser-related use cases.",
    ],
    bestFor: [
      "Open audio workflows",
      "Web-related audio",
      "Compact general-purpose audio",
    ],
    commonConversions: [
      { href: "/convert/ogg-to-mp3", label: "OGG → MP3" },
      { href: "/convert/ogg-to-wav", label: "OGG → WAV" },
      { href: "/convert/ogg-to-opus", label: "OGG → OPUS" },
      { href: "/convert/ogg-to-flac", label: "OGG → FLAC" },
    ],
    relatedFormats: [
      { href: "/formats/opus", label: "OPUS" },
      { href: "/formats/mp3", label: "MP3" },
      { href: "/formats/aac", label: "AAC" },
      { href: "/formats/flac", label: "FLAC" },
    ],
  },

  opus: {
    slug: "opus",
    label: "OPUS",
    category: "audio",
    title: "OPUS File Format",
    metaTitle: "OPUS File Format",
    metaDescription:
      "Learn about the OPUS audio format, where it performs well, and how to convert OPUS files with Converto.",
    intro:
      "OPUS is a highly efficient modern audio format designed for streaming, voice, and general audio delivery. It performs well at lower bitrates and is widely respected for quality efficiency.",
    whyUse: [
      "Strong quality-to-size efficiency at lower bitrates.",
      "Useful for voice, communication, streaming, and web delivery.",
      "A modern option when compact audio matters.",
    ],
    bestFor: [
      "Streaming and voice",
      "Efficient compression",
      "Modern compact audio",
    ],
    commonConversions: [
      { href: "/convert/opus-to-mp3", label: "OPUS → MP3" },
      { href: "/convert/opus-to-wav", label: "OPUS → WAV" },
      { href: "/convert/opus-to-flac", label: "OPUS → FLAC" },
      { href: "/convert/opus-to-aac", label: "OPUS → AAC" },
    ],
    relatedFormats: [
      { href: "/formats/ogg", label: "OGG" },
      { href: "/formats/aac", label: "AAC" },
      { href: "/formats/mp3", label: "MP3" },
      { href: "/formats/flac", label: "FLAC" },
    ],
  },

  flac: {
    slug: "flac",
    label: "FLAC",
    category: "audio",
    title: "FLAC File Format",
    metaTitle: "FLAC File Format",
    metaDescription:
      "Learn about the FLAC audio format, why it is popular for lossless audio, and how to convert FLAC files with Converto.",
    intro:
      "FLAC is a lossless audio format that preserves audio quality while still compressing file size more efficiently than uncompressed formats like WAV. It is popular for archiving, serious listening, and high-quality libraries.",
    whyUse: [
      "Lossless quality for preserving detail.",
      "Smaller than uncompressed WAV while keeping audio intact.",
      "Useful for archiving, collecting, and higher-quality listening.",
    ],
    bestFor: [
      "Lossless listening",
      "Archiving audio",
      "High-quality music collections",
    ],
    commonConversions: [
      { href: "/convert/flac-to-mp3", label: "FLAC → MP3" },
      { href: "/convert/flac-to-wav", label: "FLAC → WAV" },
      { href: "/convert/flac-to-aac", label: "FLAC → AAC" },
      { href: "/convert/flac-to-opus", label: "FLAC → OPUS" },
    ],
    relatedFormats: [
      { href: "/formats/wav", label: "WAV" },
      { href: "/formats/mp3", label: "MP3" },
      { href: "/formats/aiff", label: "AIFF" },
      { href: "/formats/opus", label: "OPUS" },
    ],
  },

  aiff: {
    slug: "aiff",
    label: "AIFF",
    category: "audio",
    title: "AIFF File Format",
    metaTitle: "AIFF File Format",
    metaDescription:
      "Learn about the AIFF audio format, when it is used, and how to convert AIFF files to MP3, WAV, FLAC, and more with Converto.",
    intro:
      "AIFF is a high-quality audio format closely associated with Apple and professional media workflows. It is often uncompressed, which makes it suitable for editing and preservation but heavier than compressed listening formats.",
    whyUse: [
      "Useful for higher-quality source audio.",
      "Common in editing, production, and Apple-related workflows.",
      "Better suited for quality-first work than small-file distribution.",
    ],
    bestFor: [
      "Editing and production",
      "Apple-oriented workflows",
      "High-quality source audio",
    ],
    commonConversions: [
      { href: "/convert/aiff-to-mp3", label: "AIFF → MP3" },
      { href: "/convert/aiff-to-wav", label: "AIFF → WAV" },
      { href: "/convert/aiff-to-flac", label: "AIFF → FLAC" },
      { href: "/convert/aiff-to-aac", label: "AIFF → AAC" },
    ],
    relatedFormats: [
      { href: "/formats/wav", label: "WAV" },
      { href: "/formats/flac", label: "FLAC" },
      { href: "/formats/mp3", label: "MP3" },
      { href: "/formats/m4a", label: "M4A" },
    ],
  },

  wma: {
    slug: "wma",
    label: "WMA",
    category: "audio",
    title: "WMA File Format",
    metaTitle: "WMA File Format",
    metaDescription:
      "Learn about the WMA audio format, where it is still relevant, and how to convert WMA files with Converto.",
    intro:
      "WMA is a Microsoft-oriented audio format that appears in some older libraries, legacy software, and Windows-centered workflows. Today it is mostly relevant for compatibility with older files and devices.",
    whyUse: [
      "Useful when dealing with older Windows media libraries.",
      "Relevant for legacy compatibility and archived audio collections.",
      "Often converted into more universal modern formats.",
    ],
    bestFor: [
      "Legacy Windows audio",
      "Older media libraries",
      "Compatibility cleanup",
    ],
    commonConversions: [
      { href: "/convert/wma-to-mp3", label: "WMA → MP3" },
      { href: "/convert/wma-to-wav", label: "WMA → WAV" },
      { href: "/convert/wma-to-aac", label: "WMA → AAC" },
      { href: "/convert/wma-to-flac", label: "WMA → FLAC" },
    ],
    relatedFormats: [
      { href: "/formats/mp3", label: "MP3" },
      { href: "/formats/wav", label: "WAV" },
      { href: "/formats/aac", label: "AAC" },
      { href: "/formats/amr", label: "AMR" },
    ],
  },

  amr: {
    slug: "amr",
    label: "AMR",
    category: "audio",
    title: "AMR File Format",
    metaTitle: "AMR File Format",
    metaDescription:
      "Learn about the AMR audio format, what it is used for, and how to convert AMR files with Converto.",
    intro:
      "AMR is a narrow-band voice-oriented audio format strongly associated with older mobile phone and telephony workflows. It is useful for legacy voice recordings, but it is not designed for high-fidelity music playback.",
    whyUse: [
      "Relevant for older phone recordings and voice archives.",
      "Useful in telephony and legacy mobile audio scenarios.",
      "Usually converted into MP3 or WAV for wider compatibility.",
    ],
    bestFor: [
      "Voice recordings",
      "Legacy phone audio",
      "Telephony-oriented files",
    ],
    commonConversions: [
      { href: "/convert/amr-to-mp3", label: "AMR → MP3" },
      { href: "/convert/amr-to-wav", label: "AMR → WAV" },
      { href: "/convert/wav-to-amr", label: "WAV → AMR" },
      { href: "/convert/mp3-to-amr", label: "MP3 → AMR" },
    ],
    relatedFormats: [
      { href: "/formats/wma", label: "WMA" },
      { href: "/formats/mp3", label: "MP3" },
      { href: "/formats/wav", label: "WAV" },
      { href: "/formats/aac", label: "AAC" },
    ],
  },

  mp4: {
    slug: "mp4",
    label: "MP4",
    category: "video",
    title: "MP4 File Format",
    metaTitle: "MP4 File Format",
    metaDescription:
      "Learn what MP4 is, why it is widely supported, and how to convert MP4 files to MP3, WEBM, MOV, GIF, and more with Converto.",
    intro:
      "MP4 is one of the most common video formats in the world. It is widely supported across browsers, phones, laptops, apps, and platforms, which makes it a strong default choice for general playback and sharing.",
    whyUse: [
      "Excellent compatibility across devices and websites.",
      "Useful for playback, uploads, sharing, and general video delivery.",
      "A common output target when converting other video formats.",
    ],
    bestFor: [
      "Universal playback",
      "Sharing and uploads",
      "General-purpose video delivery",
    ],
    commonConversions: [
      { href: "/convert/mp4-to-mp3", label: "MP4 → MP3" },
      { href: "/convert/mp4-to-webm", label: "MP4 → WEBM" },
      { href: "/convert/mp4-to-mov", label: "MP4 → MOV" },
      { href: "/convert/mp4-to-gif", label: "MP4 → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/webm", label: "WEBM" },
      { href: "/formats/mov", label: "MOV" },
      { href: "/formats/mkv", label: "MKV" },
      { href: "/formats/gif", label: "GIF" },
    ],
  },

  webm: {
    slug: "webm",
    label: "WEBM",
    category: "video",
    title: "WEBM File Format",
    metaTitle: "WEBM File Format",
    metaDescription:
      "Learn about the WEBM video format, when it is useful, and how to convert WEBM files with Converto.",
    intro:
      "WEBM is a web-oriented video format designed for browser use, lightweight delivery, and modern online playback. It is a strong option when web compatibility and efficient delivery are important.",
    whyUse: [
      "Useful for browser and web playback scenarios.",
      "Can be efficient for online video delivery.",
      "Often compared with MP4 for compatibility versus web focus.",
    ],
    bestFor: [
      "Web delivery",
      "Browser playback",
      "Online video workflows",
    ],
    commonConversions: [
      { href: "/convert/webm-to-mp4", label: "WEBM → MP4" },
      { href: "/convert/webm-to-mp3", label: "WEBM → MP3" },
      { href: "/convert/webm-to-mov", label: "WEBM → MOV" },
      { href: "/convert/webm-to-gif", label: "WEBM → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/mp4", label: "MP4" },
      { href: "/formats/mov", label: "MOV" },
      { href: "/formats/mkv", label: "MKV" },
      { href: "/formats/gif", label: "GIF" },
    ],
  },

  mov: {
    slug: "mov",
    label: "MOV",
    category: "video",
    title: "MOV File Format",
    metaTitle: "MOV File Format",
    metaDescription:
      "Learn about the MOV video format, where it is commonly used, and how to convert MOV files with Converto.",
    intro:
      "MOV is a video container strongly associated with Apple and editing-oriented workflows. It is common in media creation pipelines, exports, camera footage, and situations where editing support matters.",
    whyUse: [
      "Useful for Apple-related and editing-heavy workflows.",
      "Common in exports and production pipelines.",
      "Often converted into MP4 for broader sharing compatibility.",
    ],
    bestFor: [
      "Editing workflows",
      "Apple-oriented video",
      "Production exports",
    ],
    commonConversions: [
      { href: "/convert/mov-to-mp4", label: "MOV → MP4" },
      { href: "/convert/mov-to-webm", label: "MOV → WEBM" },
      { href: "/convert/mov-to-mp3", label: "MOV → MP3" },
      { href: "/convert/mov-to-gif", label: "MOV → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/mp4", label: "MP4" },
      { href: "/formats/webm", label: "WEBM" },
      { href: "/formats/mkv", label: "MKV" },
      { href: "/formats/avi", label: "AVI" },
    ],
  },

  mkv: {
    slug: "mkv",
    label: "MKV",
    category: "video",
    title: "MKV File Format",
    metaTitle: "MKV File Format",
    metaDescription:
      "Learn about the MKV video format, where it is useful, and how to convert MKV files with Converto.",
    intro:
      "MKV is a flexible video container often used for high-quality video files, multiple streams, subtitles, and archival-style media collections. It is powerful but not always the most universally supported format for quick sharing.",
    whyUse: [
      "Useful for rich container features and larger media collections.",
      "Common in downloaded and archived video libraries.",
      "Often converted to MP4 for easier playback and sharing.",
    ],
    bestFor: [
      "Archival-style video storage",
      "Rich container support",
      "Subtitle and multi-stream workflows",
    ],
    commonConversions: [
      { href: "/convert/mkv-to-mp4", label: "MKV → MP4" },
      { href: "/convert/mkv-to-webm", label: "MKV → WEBM" },
      { href: "/convert/mkv-to-mp3", label: "MKV → MP3" },
      { href: "/convert/mkv-to-gif", label: "MKV → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/mp4", label: "MP4" },
      { href: "/formats/mov", label: "MOV" },
      { href: "/formats/webm", label: "WEBM" },
      { href: "/formats/avi", label: "AVI" },
    ],
  },

  avi: {
    slug: "avi",
    label: "AVI",
    category: "video",
    title: "AVI File Format",
    metaTitle: "AVI File Format",
    metaDescription:
      "Learn about the AVI video format, where it still appears, and how to convert AVI files with Converto.",
    intro:
      "AVI is an older video container that still appears in legacy media libraries, archives, camera exports, and older Windows workflows. Today it is often converted into MP4 or WEBM for smoother playback and sharing.",
    whyUse: [
      "Relevant for older media files and legacy video libraries.",
      "Useful when cleaning up archives and older downloads.",
      "Often converted to newer containers for easier compatibility.",
    ],
    bestFor: [
      "Legacy video compatibility",
      "Archive cleanup",
      "Older Windows-era media files",
    ],
    commonConversions: [
      { href: "/convert/avi-to-mp4", label: "AVI → MP4" },
      { href: "/convert/avi-to-webm", label: "AVI → WEBM" },
      { href: "/convert/avi-to-mp3", label: "AVI → MP3" },
      { href: "/convert/avi-to-gif", label: "AVI → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/mp4", label: "MP4" },
      { href: "/formats/mkv", label: "MKV" },
      { href: "/formats/mov", label: "MOV" },
      { href: "/formats/wmv", label: "WMV" },
    ],
  },

  wmv: {
    slug: "wmv",
    label: "WMV",
    category: "video",
    title: "WMV File Format",
    metaTitle: "WMV File Format",
    metaDescription:
      "Learn about the WMV video format, why it matters for older Windows media, and how to convert WMV files with Converto.",
    intro:
      "WMV is a Microsoft-oriented video format often seen in legacy Windows media files, older downloads, and compatibility-heavy archives. In modern workflows it is commonly converted into MP4 or WEBM.",
    whyUse: [
      "Relevant for older Windows media collections.",
      "Useful when dealing with legacy video compatibility issues.",
      "Often converted to more universal playback formats.",
    ],
    bestFor: [
      "Legacy Windows video",
      "Archive migration",
      "Older compatibility workflows",
    ],
    commonConversions: [
      { href: "/convert/wmv-to-mp4", label: "WMV → MP4" },
      { href: "/convert/wmv-to-webm", label: "WMV → WEBM" },
      { href: "/convert/wmv-to-mp3", label: "WMV → MP3" },
      { href: "/convert/wmv-to-gif", label: "WMV → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/mp4", label: "MP4" },
      { href: "/formats/avi", label: "AVI" },
      { href: "/formats/mkv", label: "MKV" },
      { href: "/formats/flv", label: "FLV" },
    ],
  },

  flv: {
    slug: "flv",
    label: "FLV",
    category: "video",
    title: "FLV File Format",
    metaTitle: "FLV File Format",
    metaDescription:
      "Learn about the FLV video format, where it still appears, and how to convert FLV files with Converto.",
    intro:
      "FLV is an older web video format that was once common in Flash-based delivery. Today it mostly shows up in legacy content and older archives that need conversion into modern formats.",
    whyUse: [
      "Relevant for older web video and archived media.",
      "Useful when migrating outdated formats into modern containers.",
      "Often converted into MP4 for compatibility.",
    ],
    bestFor: [
      "Legacy web video",
      "Archive migration",
      "Old embedded media cleanup",
    ],
    commonConversions: [
      { href: "/convert/flv-to-mp4", label: "FLV → MP4" },
      { href: "/convert/flv-to-webm", label: "FLV → WEBM" },
      { href: "/convert/flv-to-mp3", label: "FLV → MP3" },
      { href: "/convert/flv-to-gif", label: "FLV → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/mp4", label: "MP4" },
      { href: "/formats/webm", label: "WEBM" },
      { href: "/formats/wmv", label: "WMV" },
      { href: "/formats/m4v", label: "M4V" },
    ],
  },

  m4v: {
    slug: "m4v",
    label: "M4V",
    category: "video",
    title: "M4V File Format",
    metaTitle: "M4V File Format",
    metaDescription:
      "Learn about the M4V video format, where it appears, and how to convert M4V files with Converto.",
    intro:
      "M4V is a video format closely related to MP4 and commonly associated with Apple-related video workflows. It usually behaves similarly to MP4 but may appear in more platform-specific ecosystems.",
    whyUse: [
      "Useful in Apple-related video workflows.",
      "Often very close to MP4 in general use.",
      "Commonly converted to MP4 for broader compatibility.",
    ],
    bestFor: [
      "Apple-related video files",
      "Compatibility cleanup",
      "General playback migration",
    ],
    commonConversions: [
      { href: "/convert/m4v-to-mp4", label: "M4V → MP4" },
      { href: "/convert/m4v-to-webm", label: "M4V → WEBM" },
      { href: "/convert/m4v-to-mp3", label: "M4V → MP3" },
      { href: "/convert/m4v-to-gif", label: "M4V → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/mp4", label: "MP4" },
      { href: "/formats/mov", label: "MOV" },
      { href: "/formats/webm", label: "WEBM" },
      { href: "/formats/mkv", label: "MKV" },
    ],
  },

  mpg: {
    slug: "mpg",
    label: "MPG",
    category: "video",
    title: "MPG File Format",
    metaTitle: "MPG File Format",
    metaDescription:
      "Learn about the MPG video format, where it is still used, and how to convert MPG files with Converto.",
    intro:
      "MPG is a legacy video format tied to MPEG-era delivery and older media systems. It still appears in archives, discs, exports, and older collections that often need modernization.",
    whyUse: [
      "Relevant in older video archives and MPEG-era collections.",
      "Useful when modernizing older files for easier playback.",
      "Often converted to MP4 or WEBM.",
    ],
    bestFor: [
      "Older MPEG video files",
      "Archive cleanup",
      "Legacy format migration",
    ],
    commonConversions: [
      { href: "/convert/mpg-to-mp4", label: "MPG → MP4" },
      { href: "/convert/mpg-to-webm", label: "MPG → WEBM" },
      { href: "/convert/mpg-to-mp3", label: "MPG → MP3" },
      { href: "/convert/mpg-to-gif", label: "MPG → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/mpeg", label: "MPEG" },
      { href: "/formats/mp4", label: "MP4" },
      { href: "/formats/mkv", label: "MKV" },
      { href: "/formats/avi", label: "AVI" },
    ],
  },

  mpeg: {
    slug: "mpeg",
    label: "MPEG",
    category: "video",
    title: "MPEG File Format",
    metaTitle: "MPEG File Format",
    metaDescription:
      "Learn about the MPEG video format, what it is used for, and how to convert MPEG files with Converto.",
    intro:
      "MPEG is a broad legacy video naming convention that still appears in older video collections, archived exports, and compatibility-heavy media environments. It is often converted into MP4 for easier daily use.",
    whyUse: [
      "Common in older video and media archives.",
      "Useful when dealing with legacy playback formats.",
      "Often converted to more modern containers for convenience.",
    ],
    bestFor: [
      "Legacy video collections",
      "Old exports and archives",
      "Compatibility migration",
    ],
    commonConversions: [
      { href: "/convert/mpeg-to-mp4", label: "MPEG → MP4" },
      { href: "/convert/mpeg-to-webm", label: "MPEG → WEBM" },
      { href: "/convert/mpeg-to-mp3", label: "MPEG → MP3" },
      { href: "/convert/mpeg-to-gif", label: "MPEG → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/mpg", label: "MPG" },
      { href: "/formats/mp4", label: "MP4" },
      { href: "/formats/mov", label: "MOV" },
      { href: "/formats/webm", label: "WEBM" },
    ],
  },

  "3gp": {
    slug: "3gp",
    label: "3GP",
    category: "video",
    title: "3GP File Format",
    metaTitle: "3GP File Format",
    metaDescription:
      "Learn about the 3GP video format, where it comes from, and how to convert 3GP files with Converto.",
    intro:
      "3GP is a compact mobile-oriented video format associated with older phones and lightweight device workflows. It is mainly relevant today for legacy compatibility and archived mobile media.",
    whyUse: [
      "Useful for legacy phone videos and older mobile media.",
      "Relevant when modernizing older compact files.",
      "Usually converted into MP4 for easier everyday playback.",
    ],
    bestFor: [
      "Older phone videos",
      "Legacy mobile media",
      "Compatibility cleanup",
    ],
    commonConversions: [
      { href: "/convert/3gp-to-mp4", label: "3GP → MP4" },
      { href: "/convert/3gp-to-webm", label: "3GP → WEBM" },
      { href: "/convert/3gp-to-mp3", label: "3GP → MP3" },
      { href: "/convert/3gp-to-gif", label: "3GP → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/mp4", label: "MP4" },
      { href: "/formats/mov", label: "MOV" },
      { href: "/formats/m4v", label: "M4V" },
      { href: "/formats/wmv", label: "WMV" },
    ],
  },

  gif: {
    slug: "gif",
    label: "GIF",
    category: "image",
    title: "GIF File Format",
    metaTitle: "GIF File Format",
    metaDescription:
      "Learn about the GIF format, what it is used for, and how to convert GIF files with Converto.",
    intro:
      "GIF is a lightweight image format best known for short looping animations on the web. It remains popular for memes, quick reactions, simple animated clips, and highly shareable visual snippets.",
    whyUse: [
      "Useful for short looping animations and web sharing.",
      "Very common in messaging, social content, and reaction media.",
      "Often converted from video clips or converted into static image formats.",
    ],
    bestFor: [
      "Short loops",
      "Animated web snippets",
      "Reaction and meme content",
    ],
    commonConversions: [
      { href: "/convert/gif-to-png", label: "GIF → PNG" },
      { href: "/convert/gif-to-jpg", label: "GIF → JPG" },
      { href: "/convert/gif-to-webp", label: "GIF → WEBP" },
      { href: "/convert/mp4-to-gif", label: "MP4 → GIF" },
    ],
    relatedFormats: [
      { href: "/formats/png", label: "PNG" },
      { href: "/formats/webp", label: "WEBP" },
      { href: "/formats/jpg", label: "JPG" },
      { href: "/formats/mp4", label: "MP4" },
    ],
  },

  png: {
    slug: "png",
    label: "PNG",
    category: "image",
    title: "PNG File Format",
    metaTitle: "PNG File Format",
    metaDescription:
      "Learn about the PNG image format, where it works best, and how to convert PNG files with Converto.",
    intro:
      "PNG is a popular image format known for clean quality and transparency support. It is widely used for UI elements, logos, screenshots, illustrations, and web graphics that need crisp edges.",
    whyUse: [
      "Excellent for transparency and clean graphic edges.",
      "Great for screenshots, logos, UI assets, and web graphics.",
      "A strong default when image clarity matters more than tiny file size.",
    ],
    bestFor: [
      "Transparent graphics",
      "Screenshots and UI assets",
      "Logos and illustrations",
    ],
    commonConversions: [
      { href: "/convert/png-to-jpg", label: "PNG → JPG" },
      { href: "/convert/png-to-webp", label: "PNG → WEBP" },
      { href: "/convert/png-to-bmp", label: "PNG → BMP" },
      { href: "/convert/png-to-avif", label: "PNG → AVIF" },
    ],
    relatedFormats: [
      { href: "/formats/jpg", label: "JPG" },
      { href: "/formats/webp", label: "WEBP" },
      { href: "/formats/bmp", label: "BMP" },
      { href: "/formats/avif", label: "AVIF" },
    ],
  },

  jpg: {
    slug: "jpg",
    label: "JPG",
    category: "image",
    title: "JPG File Format",
    metaTitle: "JPG File Format",
    metaDescription:
      "Learn about the JPG image format, why it is widely used, and how to convert JPG files with Converto.",
    intro:
      "JPG is one of the most widely used image formats for photos and general web sharing. It uses lossy compression, which helps reduce file size and makes it practical for uploads, websites, and everyday photography.",
    whyUse: [
      "Very common for photos and general image sharing.",
      "Smaller file sizes than many lossless image formats.",
      "Strong compatibility across websites, devices, and apps.",
    ],
    bestFor: [
      "Photos",
      "Web uploads",
      "General image sharing",
    ],
    commonConversions: [
      { href: "/convert/jpg-to-png", label: "JPG → PNG" },
      { href: "/convert/jpg-to-webp", label: "JPG → WEBP" },
      { href: "/convert/jpg-to-bmp", label: "JPG → BMP" },
      { href: "/convert/jpg-to-avif", label: "JPG → AVIF" },
    ],
    relatedFormats: [
      { href: "/formats/png", label: "PNG" },
      { href: "/formats/webp", label: "WEBP" },
      { href: "/formats/bmp", label: "BMP" },
      { href: "/formats/tiff", label: "TIFF" },
    ],
  },

  webp: {
    slug: "webp",
    label: "WEBP",
    category: "image",
    title: "WEBP File Format",
    metaTitle: "WEBP File Format",
    metaDescription:
      "Learn about the WEBP image format, where it is useful, and how to convert WEBP files with Converto.",
    intro:
      "WEBP is a modern image format designed for web delivery, smaller file sizes, and efficient online performance. It is commonly used to reduce weight on websites while keeping visual quality strong.",
    whyUse: [
      "Useful for lightweight web image delivery.",
      "Often smaller than PNG or JPG at similar visual quality.",
      "A strong option for websites, apps, and modern online workflows.",
    ],
    bestFor: [
      "Web optimization",
      "Smaller image delivery",
      "Modern browser-friendly graphics",
    ],
    commonConversions: [
      { href: "/convert/webp-to-png", label: "WEBP → PNG" },
      { href: "/convert/webp-to-jpg", label: "WEBP → JPG" },
      { href: "/convert/webp-to-bmp", label: "WEBP → BMP" },
      { href: "/convert/webp-to-avif", label: "WEBP → AVIF" },
    ],
    relatedFormats: [
      { href: "/formats/png", label: "PNG" },
      { href: "/formats/jpg", label: "JPG" },
      { href: "/formats/avif", label: "AVIF" },
      { href: "/formats/gif", label: "GIF" },
    ],
  },

  bmp: {
    slug: "bmp",
    label: "BMP",
    category: "image",
    title: "BMP File Format",
    metaTitle: "BMP File Format",
    metaDescription:
      "Learn about the BMP image format, where it still appears, and how to convert BMP files with Converto.",
    intro:
      "BMP is a classic bitmap image format associated with older Windows graphics workflows and raw-looking image storage. It is still relevant for some compatibility scenarios, but it is usually heavier than modern formats.",
    whyUse: [
      "Relevant in legacy graphics and older Windows workflows.",
      "Useful when opening or converting older image assets.",
      "Often converted into PNG, JPG, or WEBP to reduce size and improve flexibility.",
    ],
    bestFor: [
      "Legacy bitmap graphics",
      "Older Windows image compatibility",
      "Image cleanup workflows",
    ],
    commonConversions: [
      { href: "/convert/bmp-to-png", label: "BMP → PNG" },
      { href: "/convert/bmp-to-jpg", label: "BMP → JPG" },
      { href: "/convert/bmp-to-webp", label: "BMP → WEBP" },
      { href: "/convert/bmp-to-avif", label: "BMP → AVIF" },
    ],
    relatedFormats: [
      { href: "/formats/png", label: "PNG" },
      { href: "/formats/jpg", label: "JPG" },
      { href: "/formats/webp", label: "WEBP" },
      { href: "/formats/tiff", label: "TIFF" },
    ],
  },

  tiff: {
    slug: "tiff",
    label: "TIFF",
    category: "image",
    title: "TIFF File Format",
    metaTitle: "TIFF File Format",
    metaDescription:
      "Learn about the TIFF image format, where it is commonly used, and how to convert TIFF files with Converto.",
    intro:
      "TIFF is a high-quality image format commonly used in scanning, publishing, archiving, and print-related workflows. It is usually heavier than web-first image formats but valued for quality and detail retention.",
    whyUse: [
      "Useful for scanning, print, and archival image workflows.",
      "Can preserve strong image detail and quality.",
      "Often converted into JPG, PNG, or WEBP for easier everyday use.",
    ],
    bestFor: [
      "Scanning and print",
      "Archiving images",
      "High-detail source files",
    ],
    commonConversions: [
      { href: "/convert/tiff-to-png", label: "TIFF → PNG" },
      { href: "/convert/tiff-to-jpg", label: "TIFF → JPG" },
      { href: "/convert/tiff-to-webp", label: "TIFF → WEBP" },
      { href: "/convert/tiff-to-bmp", label: "TIFF → BMP" },
    ],
    relatedFormats: [
      { href: "/formats/png", label: "PNG" },
      { href: "/formats/jpg", label: "JPG" },
      { href: "/formats/bmp", label: "BMP" },
      { href: "/formats/avif", label: "AVIF" },
    ],
  },

  ico: {
    slug: "ico",
    label: "ICO",
    category: "image",
    title: "ICO File Format",
    metaTitle: "ICO File Format",
    metaDescription:
      "Learn about the ICO image format, where it is used, and how to convert ICO files with Converto.",
    intro:
      "ICO is the icon format commonly used for app icons, favicons, and Windows-style icon assets. It is mostly relevant for interface assets, branding, and compatibility with icon-based systems.",
    whyUse: [
      "Useful for favicons and icon-related design work.",
      "Relevant for Windows icons and small branded assets.",
      "Often created from PNG or converted back into PNG for editing.",
    ],
    bestFor: [
      "Favicons",
      "App and website icons",
      "Small interface assets",
    ],
    commonConversions: [
      { href: "/convert/ico-to-png", label: "ICO → PNG" },
      { href: "/convert/ico-to-jpg", label: "ICO → JPG" },
      { href: "/convert/png-to-ico", label: "PNG → ICO" },
      { href: "/convert/webp-to-ico", label: "WEBP → ICO" },
    ],
    relatedFormats: [
      { href: "/formats/png", label: "PNG" },
      { href: "/formats/jpg", label: "JPG" },
      { href: "/formats/webp", label: "WEBP" },
      { href: "/formats/avif", label: "AVIF" },
    ],
  },

  avif: {
    slug: "avif",
    label: "AVIF",
    category: "image",
    title: "AVIF File Format",
    metaTitle: "AVIF File Format",
    metaDescription:
      "Learn about the AVIF image format, why it is useful for modern compression, and how to convert AVIF files with Converto.",
    intro:
      "AVIF is a modern image format designed for strong compression efficiency and smaller file sizes while maintaining very good visual quality. It is increasingly relevant in modern web and performance-focused image workflows.",
    whyUse: [
      "Useful for modern image compression and lighter delivery.",
      "Strong option for web performance and modern optimization.",
      "Often compared with WEBP and JPG in lightweight image workflows.",
    ],
    bestFor: [
      "Modern image compression",
      "Web performance",
      "Smaller high-quality image delivery",
    ],
    commonConversions: [
      { href: "/convert/avif-to-png", label: "AVIF → PNG" },
      { href: "/convert/avif-to-jpg", label: "AVIF → JPG" },
      { href: "/convert/avif-to-webp", label: "AVIF → WEBP" },
      { href: "/convert/png-to-avif", label: "PNG → AVIF" },
    ],
    relatedFormats: [
      { href: "/formats/webp", label: "WEBP" },
      { href: "/formats/jpg", label: "JPG" },
      { href: "/formats/png", label: "PNG" },
      { href: "/formats/tiff", label: "TIFF" },
    ],
  },
};

export const allFormats = Object.values(formatData);

export const audioFormats = allFormats.filter((item) => item.category === "audio");
export const videoFormats = allFormats.filter((item) => item.category === "video");
export const imageFormats = allFormats.filter((item) => item.category === "image");