using CommunityToolkit.Maui.Views;
using Converto.Models.Conversion;
using Converto.Services.Conversion;
using Microsoft.Maui.Controls;
using Microsoft.Maui.Storage;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Converto.Features.Converter;

public partial class ConverterPage : ContentPage
{
    private readonly IBackendConversionService _backendConversionService;

    private FormatCategory _selectedCategory = FormatCategory.Video;
    private string? _selectedFilePath;
    private string? _selectedFileName;
    private string? _selectedInputExtension;
    private string? _selectedTarget;
    private string? _convertedFilePath;
    private CancellationTokenSource? _cts;
    private bool _isBusy;

    public ConverterPage(IBackendConversionService backendConversionService)
    {
        InitializeComponent();
        _backendConversionService = backendConversionService;

        SetCategory(FormatCategory.Video);
        ResetPreview();
        UpdateResultButtons();
    }

    private void OnVideoCategoryClicked(object sender, EventArgs e) => SetCategory(FormatCategory.Video);
    private void OnAudioCategoryClicked(object sender, EventArgs e) => SetCategory(FormatCategory.Audio);
    private void OnImageCategoryClicked(object sender, EventArgs e) => SetCategory(FormatCategory.Image);
    private void OnDocumentCategoryClicked(object sender, EventArgs e) => SetCategory(FormatCategory.Document);

    private void SetCategory(FormatCategory category)
    {
        if (_isBusy)
            return;

        _selectedCategory = category;
        _selectedTarget = null;

        ResetCategoryButtons();
        HighlightSelectedCategoryButton(category);
        BuildTargetButtons();

        SelectedTargetLabel.Text = "Selected target: -";
        UpdateConvertButtonState();
        StatusLabel.Text = $"{category} category selected.";
    }

    private void ResetCategoryButtons()
    {
        ResetChip(VideoCategoryButton);
        ResetChip(AudioCategoryButton);
        ResetChip(ImageCategoryButton);
        ResetChip(DocumentCategoryButton);
    }

    private void HighlightSelectedCategoryButton(FormatCategory category)
    {
        var button = category switch
        {
            FormatCategory.Video => VideoCategoryButton,
            FormatCategory.Audio => AudioCategoryButton,
            FormatCategory.Image => ImageCategoryButton,
            FormatCategory.Document => DocumentCategoryButton,
            _ => null
        };

        if (button != null)
        {
            button.BackgroundColor = Color.FromArgb("#7C3AED");
            button.TextColor = Colors.White;
            button.BorderWidth = 0;
        }
    }

    private static void ResetChip(Button button)
    {
        button.BackgroundColor = Color.FromArgb("#14FFFFFF");
        button.TextColor = Color.FromArgb("#CCFFFFFF");
        button.BorderColor = Color.FromArgb("#1AFFFFFF");
        button.BorderWidth = 1;
    }

    private void BuildTargetButtons()
    {
        TargetsLayout.Children.Clear();

        var targets = FormatRegistry.GetTargets(_selectedCategory);

        foreach (var target in targets)
        {
            var btn = new Button
            {
                Text = target.Label,
                CornerRadius = 999,
                Padding = new Thickness(14, 10),
                Margin = new Thickness(0, 0, 10, 10),
                BackgroundColor = Color.FromArgb("#14FFFFFF"),
                TextColor = Color.FromArgb("#CCFFFFFF"),
                BorderColor = Color.FromArgb("#1AFFFFFF"),
                BorderWidth = 1,
                FontSize = 13,
                FontAttributes = FontAttributes.Bold
            };

            btn.Clicked += (_, __) => SelectTarget(target.Key, btn);
            TargetsLayout.Children.Add(btn);
        }
    }

    private void SelectTarget(string targetKey, Button selectedButton)
    {
        if (_isBusy)
            return;

        _selectedTarget = targetKey;

        foreach (var child in TargetsLayout.Children.OfType<Button>())
            ResetDynamicTargetChip(child);

        selectedButton.BackgroundColor = Colors.White;
        selectedButton.TextColor = Colors.Black;
        selectedButton.BorderWidth = 0;

        SelectedTargetLabel.Text = $"Selected target: {targetKey.ToUpperInvariant()}";
        StatusLabel.Text = "Target selected.";
        UpdateConvertButtonState();
    }

    private static void ResetDynamicTargetChip(Button button)
    {
        button.BackgroundColor = Color.FromArgb("#14FFFFFF");
        button.TextColor = Color.FromArgb("#CCFFFFFF");
        button.BorderColor = Color.FromArgb("#1AFFFFFF");
        button.BorderWidth = 1;
    }

    private async void OnPickFileClicked(object sender, EventArgs e)
    {
        if (_isBusy)
            return;

        try
        {
            var result = await FilePicker.Default.PickAsync();

            if (result == null)
            {
                StatusLabel.Text = "File pick canceled.";
                return;
            }

            _selectedFilePath = result.FullPath;
            _selectedFileName = result.FileName;
            _selectedInputExtension = Path.GetExtension(result.FileName)?.ToLowerInvariant();
            _convertedFilePath = null;

            SelectedFileNameLabel.Text = $"Selected file: {_selectedFileName}";
            DetectedInputLabel.Text = $"Detected input: {_selectedInputExtension ?? "-"}";

            UpdatePreview();
            UpdateConvertButtonState();
            UpdateResultButtons();

            StatusLabel.Text = "File selected.";
            ConvertProgressBar.Progress = 0;
        }
        catch (Exception ex)
        {
            StatusLabel.Text = $"Pick failed: {ex.Message}";
        }
    }

    private void UpdateConvertButtonState()
    {
        ConvertButton.IsEnabled =
            !_isBusy &&
            !string.IsNullOrWhiteSpace(_selectedFileName) &&
            !string.IsNullOrWhiteSpace(_selectedTarget);
    }

    private void UpdateResultButtons()
    {
        var hasResult = !_isBusy &&
                        !string.IsNullOrWhiteSpace(_convertedFilePath) &&
                        File.Exists(_convertedFilePath);

        DownloadButton.IsEnabled = hasResult;
        ShareButton.IsEnabled = hasResult;
    }

    private void SetBusy(bool busy, string? status = null)
    {
        _isBusy = busy;

        if (status != null)
            StatusLabel.Text = status;

        UpdateConvertButtonState();
        UpdateResultButtons();
    }

    private void ResetPreview()
    {
        PreviewImage.IsVisible = false;
        PreviewMedia.IsVisible = false;
        PreviewPlaceholder.IsVisible = true;
        PreviewImage.Source = null;
        PreviewMedia.Source = null;
    }

    private void UpdatePreview()
    {
        ResetPreview();

        if (string.IsNullOrWhiteSpace(_selectedFilePath) || !File.Exists(_selectedFilePath))
            return;

        if (_selectedCategory == FormatCategory.Image)
        {
            PreviewImage.Source = ImageSource.FromFile(_selectedFilePath);
            PreviewImage.IsVisible = true;
            PreviewPlaceholder.IsVisible = false;
            return;
        }

        if (_selectedCategory == FormatCategory.Video || _selectedCategory == FormatCategory.Audio)
        {
            PreviewMedia.Source = _selectedFilePath;
            PreviewMedia.IsVisible = true;
            PreviewPlaceholder.IsVisible = false;
            return;
        }
    }

    private async void OnConvertClicked(object sender, EventArgs e)
    {
        if (_isBusy)
            return;

        if (string.IsNullOrWhiteSpace(_selectedFilePath) || !File.Exists(_selectedFilePath))
        {
            StatusLabel.Text = "Please select a valid file first.";
            return;
        }

        if (string.IsNullOrWhiteSpace(_selectedFileName))
        {
            StatusLabel.Text = "File name is missing.";
            return;
        }

        if (string.IsNullOrWhiteSpace(_selectedTarget))
        {
            StatusLabel.Text = "Please select a target format.";
            return;
        }

        _cts?.Cancel();
        _cts?.Dispose();
        _cts = new CancellationTokenSource();
        _convertedFilePath = null;
        UpdateResultButtons();

        try
        {
            SetBusy(true, "Uploading file to server...");
            ConvertProgressBar.Progress = 0.12;

            var result = await _backendConversionService.ConvertFileAsync(
                inputFilePath: _selectedFilePath,
                originalFileName: _selectedFileName,
                targetFormat: _selectedTarget,
                cancellationToken: _cts.Token);

            ConvertProgressBar.Progress = 1.0;

            if (!result.ok || string.IsNullOrWhiteSpace(result.savedFilePath))
            {
                SetBusy(false, "Conversion failed.");
                StatusLabel.Text = result.message;
                ConvertProgressBar.Progress = 0;
                return;
            }

            _convertedFilePath = result.savedFilePath;

            SetBusy(false, "Done.");
            StatusLabel.Text = $"Converted successfully: {Path.GetFileName(_convertedFilePath)}";
            UpdateResultButtons();
        }
        catch (Exception ex)
        {
            SetBusy(false, "Unexpected error.");
            StatusLabel.Text = ex.Message;
            ConvertProgressBar.Progress = 0;
        }
        finally
        {
            _cts?.Dispose();
            _cts = null;
        }
    }

    private async void OnDownloadClicked(object sender, EventArgs e)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(_convertedFilePath) || !File.Exists(_convertedFilePath))
            {
                StatusLabel.Text = "Converted file not found.";
                return;
            }

#if ANDROID
            var fileName = Path.GetFileName(_convertedFilePath);
            var savedPath = await Converto.Platforms.Android.AndroidDownloadSaver
                .SaveToDownloadsAsync(_convertedFilePath, fileName);

            StatusLabel.Text = $"Saved to: {savedPath}";
#else
            StatusLabel.Text = $"File ready: {_convertedFilePath}";
#endif
        }
        catch (Exception ex)
        {
            StatusLabel.Text = $"Download failed: {ex.Message}";
        }
    }

    private async void OnShareClicked(object sender, EventArgs e)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(_convertedFilePath) || !File.Exists(_convertedFilePath))
            {
                StatusLabel.Text = "Converted file not found.";
                return;
            }

            await Share.Default.RequestAsync(new ShareFileRequest
            {
                Title = "Share converted file",
                File = new ShareFile(_convertedFilePath)
            });
        }
        catch (Exception ex)
        {
            StatusLabel.Text = $"Share failed: {ex.Message}";
        }
    }
}