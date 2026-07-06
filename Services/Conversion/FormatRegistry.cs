using Converto.Models.Conversion;
using System.Collections.Generic;

namespace Converto.Services.Conversion;

public static class FormatRegistry
{
    public static readonly List<FormatOption> VideoTargets =
    [
        new() { Key = "mp4", Label = "MP4", Category = FormatCategory.Video },
        new() { Key = "mov", Label = "MOV", Category = FormatCategory.Video },
        new() { Key = "webm", Label = "WEBM", Category = FormatCategory.Video },
        new() { Key = "mkv", Label = "MKV", Category = FormatCategory.Video },
        new() { Key = "avi", Label = "AVI", Category = FormatCategory.Video },
        new() { Key = "mp3", Label = "MP3", Category = FormatCategory.Audio },
        new() { Key = "wav", Label = "WAV", Category = FormatCategory.Audio },
        new() { Key = "aac", Label = "AAC", Category = FormatCategory.Audio },
        new() { Key = "m4a", Label = "M4A", Category = FormatCategory.Audio },
    ];

    public static readonly List<FormatOption> AudioTargets =
    [
        new() { Key = "mp3", Label = "MP3", Category = FormatCategory.Audio },
        new() { Key = "wav", Label = "WAV", Category = FormatCategory.Audio },
        new() { Key = "flac", Label = "FLAC", Category = FormatCategory.Audio },
        new() { Key = "aac", Label = "AAC", Category = FormatCategory.Audio },
        new() { Key = "m4a", Label = "M4A", Category = FormatCategory.Audio },
        new() { Key = "ogg", Label = "OGG", Category = FormatCategory.Audio },
        new() { Key = "opus", Label = "OPUS", Category = FormatCategory.Audio },
    ];

    public static readonly List<FormatOption> ImageTargets =
    [
        new() { Key = "png", Label = "PNG", Category = FormatCategory.Image },
        new() { Key = "jpg", Label = "JPG", Category = FormatCategory.Image },
        new() { Key = "webp", Label = "WEBP", Category = FormatCategory.Image },
        new() { Key = "bmp", Label = "BMP", Category = FormatCategory.Image },
        new() { Key = "tiff", Label = "TIFF", Category = FormatCategory.Image },
        new() { Key = "ico", Label = "ICO", Category = FormatCategory.Image },
        new() { Key = "avif", Label = "AVIF", Category = FormatCategory.Image },
    ];

    public static readonly List<FormatOption> DocumentTargets =
    [
        new() { Key = "pdf", Label = "PDF", Category = FormatCategory.Document },
        new() { Key = "docx", Label = "DOCX", Category = FormatCategory.Document },
        new() { Key = "txt", Label = "TXT", Category = FormatCategory.Document },
    ];

    public static List<FormatOption> GetTargets(FormatCategory category) =>
        category switch
        {
            FormatCategory.Video => VideoTargets,
            FormatCategory.Audio => AudioTargets,
            FormatCategory.Image => ImageTargets,
            FormatCategory.Document => DocumentTargets,
            _ => []
        };
}