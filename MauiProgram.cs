using CommunityToolkit.Maui;
using CommunityToolkit.Maui.MediaElement;
using Converto.Features.Converter;
using Converto.Features.Home;
using Converto.Features.Pro;
using Converto.Features.Settings;
using Converto.Services.Conversion;
using Microsoft.Extensions.Logging;

namespace Converto;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();

        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit()
            .UseMauiCommunityToolkitMediaElement()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        builder.Services.AddSingleton(new BackendConversionOptions
        {
            BaseUrl = "https://converto-wmqb.onrender.com"
        });

        builder.Services.AddSingleton<IBackendConversionService, BackendConversionService>();

        builder.Services.AddSingleton<AppShell>();

        builder.Services.AddTransient<HomePage>();
        builder.Services.AddTransient<ConverterPage>();
        builder.Services.AddTransient<ProPage>();
        builder.Services.AddTransient<SettingsPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}