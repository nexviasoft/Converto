using Microsoft.Maui.Storage;
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace Converto.Services.Conversion;

public sealed class BackendConversionService : IBackendConversionService
{
    private readonly BackendConversionOptions _options;
    private readonly HttpClient _httpClient;

    public BackendConversionService(BackendConversionOptions options)
    {
        _options = options;
        _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromMinutes(15)
        };
    }

    public async Task<(bool ok, string message, string? savedFilePath)> ConvertFileAsync(
        string inputFilePath,
        string originalFileName,
        string targetFormat,
        CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(inputFilePath) || !File.Exists(inputFilePath))
                return (false, "Input file not found.", null);

            if (string.IsNullOrWhiteSpace(originalFileName))
                originalFileName = Path.GetFileName(inputFilePath);

            if (string.IsNullOrWhiteSpace(targetFormat))
                return (false, "Target format is empty.", null);

            var url = $"{_options.BaseUrl.TrimEnd('/')}/convert";

            await using var fileStream = File.OpenRead(inputFilePath);
            using var fileContent = new StreamContent(fileStream);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            using var form = new MultipartFormDataContent();
            form.Add(fileContent, "file", originalFileName);
            form.Add(new StringContent(targetFormat.ToUpperInvariant()), "target");

            using var response = await _httpClient.PostAsync(url, form, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
                return (false, $"Server error: {(int)response.StatusCode}\n{errorBody}", null);
            }

            var outputExtension = targetFormat.Trim().TrimStart('.').ToLowerInvariant();
            var safeBaseName = Path.GetFileNameWithoutExtension(originalFileName);
            var outputFileName = $"{safeBaseName}_converto.{outputExtension}";

            var outputDir = Path.Combine(FileSystem.CacheDirectory, "converted");
            Directory.CreateDirectory(outputDir);

            var outputPath = Path.Combine(outputDir, outputFileName);

            await using var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
            await using var outputStream = File.Create(outputPath);
            await responseStream.CopyToAsync(outputStream, cancellationToken);

            if (!File.Exists(outputPath))
                return (false, "Converted file could not be saved.", null);

            return (true, "Conversion completed.", outputPath);
        }
        catch (OperationCanceledException)
        {
            return (false, "Conversion canceled.", null);
        }
        catch (Exception ex)
        {
            return (false, ex.Message, null);
        }
    }
}