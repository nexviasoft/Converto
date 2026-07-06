#if ANDROID
using Android.Content;
using Android.OS;
using Android.Provider;
using Microsoft.Maui.ApplicationModel;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Converto.Platforms.Android;

public static class AndroidDownloadSaver
{
    public static async Task<string> SaveToDownloadsAsync(string sourceFilePath, string fileName)
    {
        if (string.IsNullOrWhiteSpace(sourceFilePath) || !File.Exists(sourceFilePath))
            throw new System.IO.FileNotFoundException("Source file not found.", sourceFilePath);

        if (string.IsNullOrWhiteSpace(fileName))
            fileName = Path.GetFileName(sourceFilePath);

        var context = Platform.AppContext;

        if (Build.VERSION.SdkInt >= BuildVersionCodes.Q)
        {
            var values = new ContentValues();
            values.Put(MediaStore.IMediaColumns.DisplayName, fileName);
            values.Put(MediaStore.IMediaColumns.MimeType, GetMimeType(fileName));
            values.Put(MediaStore.IMediaColumns.RelativePath, "Download/Converto");
            values.Put(MediaStore.IMediaColumns.IsPending, 1);

            var collection = MediaStore.Downloads.ExternalContentUri;
            var resolver = context.ContentResolver;
            var itemUri = resolver.Insert(collection, values);

            if (itemUri == null)
                throw new Exception("Could not create download entry.");

            await using (var input = File.OpenRead(sourceFilePath))
            await using (var output = resolver.OpenOutputStream(itemUri) ?? throw new Exception("Could not open output stream."))
            {
                await input.CopyToAsync(output);
            }

            values.Clear();
            values.Put(MediaStore.IMediaColumns.IsPending, 0);
            resolver.Update(itemUri, values, null, null);

            return $"Downloads/Converto/{fileName}";
        }
        else
        {
            var downloads = global::Android.OS.Environment.GetExternalStoragePublicDirectory(
    global::Android.OS.Environment.DirectoryDownloads);
            var convertoDir = Path.Combine(downloads.AbsolutePath, "Converto");

            if (!Directory.Exists(convertoDir))
                Directory.CreateDirectory(convertoDir);

            var destinationPath = Path.Combine(convertoDir, fileName);
            File.Copy(sourceFilePath, destinationPath, true);

            return destinationPath;
        }
    }

    private static string GetMimeType(string fileName)
    {
        var ext = Path.GetExtension(fileName)?.ToLowerInvariant();

        return ext switch
        {
            ".mp3" => "audio/mpeg",
            ".wav" => "audio/wav",
            ".m4a" => "audio/mp4",
            ".aac" => "audio/aac",
            ".ogg" => "audio/ogg",
            ".opus" => "audio/ogg",
            ".flac" => "audio/flac",
            ".mp4" => "video/mp4",
            ".mov" => "video/quicktime",
            ".webm" => "video/webm",
            ".mkv" => "video/x-matroska",
            ".avi" => "video/x-msvideo",
            ".wmv" => "video/x-ms-wmv",
            ".flv" => "video/x-flv",
            ".png" => "image/png",
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".webp" => "image/webp",
            ".bmp" => "image/bmp",
            ".gif" => "image/gif",
            ".tiff" => "image/tiff",
            ".ico" => "image/x-icon",
            ".avif" => "image/avif",
            ".pdf" => "application/pdf",
            ".txt" => "text/plain",
            _ => "application/octet-stream"
        };
    }
}
#endif