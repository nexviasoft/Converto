namespace Converto.Features.Home;

public partial class HomePage : ContentPage
{
    public HomePage()
    {
        InitializeComponent();
    }

    private async void OnOpenVideoClicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync("//converter");
    }

    private async void OnOpenProClicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync("//pro");
    }
}