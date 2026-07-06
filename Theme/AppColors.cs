using Microsoft.Maui.Graphics;

namespace Converto.Theme;

public static class AppColors
{
    public static readonly Color PageBackground = Color.FromArgb("#151233");
    public static readonly Color PageBackgroundAlt = Color.FromArgb("#1B1740");

    public static readonly Color CardBackground = Color.FromRgba(255, 255, 255, 0.10f);
    public static readonly Color CardBorder = Color.FromRgba(255, 255, 255, 0.10f);

    public static readonly Color TextPrimary = Colors.White;
    public static readonly Color TextSecondary = Color.FromRgba(255, 255, 255, 0.65f);
    public static readonly Color TextMuted = Color.FromRgba(255, 255, 255, 0.45f);

    public static readonly Color Accent = Color.FromArgb("#A855F7");
    public static readonly Color AccentSoft = Color.FromRgba(168, 85, 247, 0.22f);
    public static readonly Color AccentBlueSoft = Color.FromRgba(59, 130, 246, 0.18f);

    public static readonly Color PrimaryButtonBackground = Colors.White;
    public static readonly Color PrimaryButtonText = Colors.Black;

    public static readonly Color SecondaryChipBackground = Color.FromRgba(255, 255, 255, 0.08f);
    public static readonly Color SecondaryChipBorder = Color.FromRgba(255, 255, 255, 0.10f);
    public static readonly Color SecondaryChipText = Color.FromRgba(255, 255, 255, 0.80f);

    public static readonly Color Divider = Color.FromRgba(255, 255, 255, 0.08f);
}