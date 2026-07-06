using System.Threading;
using System.Threading.Tasks;

namespace Converto.Services.Conversion;

public interface IBackendConversionService
{
    Task<(bool ok, string message, string? savedFilePath)> ConvertFileAsync(
        string inputFilePath,
        string originalFileName,
        string targetFormat,
        CancellationToken cancellationToken);
}