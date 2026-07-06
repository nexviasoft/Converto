namespace Converto.Models.Conversion;

public sealed class FormatOption
{
    public string Key { get; set; } = "";
    public string Label { get; set; } = "";
    public FormatCategory Category { get; set; } = FormatCategory.Unknown;
}