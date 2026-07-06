# Converto v8 — AdSense hazırlık paketi

Bu sürüm `Converto_home_visuals_v8_new_compare_logo.zip` üzerine uygulanmıştır. Yeni compare tasarımları, logo/görseller, converter özellikleri, Pro sayfası, sign-in sayfası, waitlist API'leri, ödeme/üyelik kodları ve batch rotaları silinmemiştir.

## AdSense için yapılanlar

- Sitemap yaklaşık 988 programatik URL yerine 94 seçilmiş URL ile sınırlandı.
- Yalnızca elle hazırlanmış özgün içeriğe sahip 15 converter rotası indexe açık bırakıldı.
- Bu 15 rota `lib/converterContent.ts` içindeki rota bazlı özgün içeriklere bağlandı.
- Diğer converter rotaları çalışmaya devam eder, fakat `noindex, follow` durumundadır.
- Tüm batch rotaları çalışmaya devam eder, fakat `noindex, follow` durumundadır.
- Noindex converter ve batch rotalarında reklam rayları kapatıldı.
- AdSense scripti/Auto Ads yalnızca bitmiş, içerik açısından güçlü rotalarda yüklenir.
- Pro ve sign-in sayfaları dosyada durur; varsayılan olarak menüden gizli ve arama motorlarına kapalıdır.
- Ana sayfadaki tamamlanmamış Pro, Android uygulaması ve waitlist tanıtımları feature flag ile pasif durumda tutulur.
- Görünür `coming soon`, `during beta`, `server beta` ve benzeri yapım aşaması metinleri indexe açık sayfalardan temizlendi.
- `ads.txt` korundu ve yayıncı kimliği ile uyumludur.
- `robots.txt` API rotalarını taramaya kapatır; noindex sayfalar engellenmediği için Google noindex etiketlerini görebilir.
- Büyük/küçük harf farkıyla bulunan `Components` ve `components` klasörlerinin hiçbiri silinmedi. Büyük harfli yedek klasör `tsconfig.json` üzerinden derlemeden hariç tutuldu; böylece Vercel/Linux casing hatası önlendi.
- Otomatik oluşturulmuş `.clerk/.tmp` yerel anahtar dosyası güvenlik nedeniyle paketten çıkarıldı. Clerk bağımlılıkları, sayfaları ve entegrasyon kodları korunmuştur; gerçek anahtarlar Vercel environment variables üzerinden kullanılmalıdır.

## Indexe açık converter rotaları

- mp4-to-mp3
- webm-to-mp3
- mov-to-mp4
- mkv-to-mp4
- png-to-jpg
- webp-to-png
- jpg-to-png
- mp4-to-gif
- flac-to-mp3
- wav-to-mp3
- avi-to-mp4
- mp4-to-wav
- mov-to-mp3
- png-to-webp
- jpg-to-webp

## Pasif özellikleri yeniden açma

Vercel Project Settings → Environment Variables bölümüne ihtiyacın olan değişkeni `true` olarak ekleyip yeniden deploy et:

```env
NEXT_PUBLIC_ENABLE_PRO=true
NEXT_PUBLIC_ENABLE_SIGN_IN=true
NEXT_PUBLIC_ENABLE_ANDROID_APP=true
NEXT_PUBLIC_ENABLE_WAITLIST=true
```

- `NEXT_PUBLIC_ENABLE_PRO=true`: Header/footer Pro bağlantısını, ana sayfadaki Pro bölümünü açar; Pro sayfasını indexe ve sitemap'e otomatik ekler.
- `NEXT_PUBLIC_ENABLE_SIGN_IN=true`: Sign-in bağlantısını açar. Sign-in sayfası hesap sayfası olduğu için noindex kalır.
- `NEXT_PUBLIC_ENABLE_ANDROID_APP=true`: Android uygulaması tanıtım düğmelerini açar.
- `NEXT_PUBLIC_ENABLE_WAITLIST=true`: Ana sayfadaki erken erişim/waitlist bölümünü ve ilgili API çağrılarını açar.

Özellik tamamen hazır olmadan ilgili değişkeni açma.

## Doğrulama

- `npm run build`: başarılı
- Sitemap URL sayısı: 94
- Sitemap'teki 94 sayfanın tamamı tarandı
- Sitemap içinde noindex sayfa: 0
- Sitemap sayfalarında eksik H1: 0
- Sitemap sayfalarında görünür coming soon/beta/waitlist sinyali: 0
- Özgün converter örneği: `index, follow` ve AdSense scripti açık
- Genel programatik converter örneği: `noindex, follow` ve AdSense scripti kapalı
- Batch converter örneği: `noindex, follow` ve AdSense scripti kapalı
- Pro/sign-in/yasal sayfalar: AdSense scripti kapalı

## Deploy sonrası

1. Paketi Vercel'e deploy et.
2. `https://www.converto.tools/sitemap.xml` dosyasının 94 URL gösterdiğini kontrol et.
3. Search Console'da sitemap'i yeniden gönder.
4. Eski programatik URL'lerin zamanla index dışına çıkmasını bekle.
5. AdSense → Privacy & messaging bölümünden Google CMP/Avrupa düzenlemeleri mesajını etkinleştir.
6. Site, converter ve yasal sayfaları canlı ortamda kontrol edip AdSense incelemesine gönder.

AdSense onayı Google'ın manuel/otomatik incelemesine bağlıdır ve garanti edilemez.

## Final visual consistency update

- The HEIC/HEIF guide chip was removed from the home-page Format Guides card only. The `/formats/heic` guide and all related functionality remain in the project.
- All non-home routes now use the shared purple-accent navigation bar. The home page keeps its original landing-page header.
- Converter, format, compare, legal, support, sign-in, and Pro routes now use the same detailed footer as the home page.
- Compare detail pages were visually aligned with the format hub/detail system: violet glass cards, matching gradients, borders, buttons, table styling, spacing, and typography.
- No converter, batch, PDF, account, Pro, Android, waitlist, billing, or format-guide feature was deleted.
- Production build and key-route HTTP checks completed successfully after these changes.

## Visual and PDF maturity update

- PDF Tools remains fully present and functional; only the public Beta/New badges were removed.
- The secondary-page navbar was compacted without removing any links.
- PDF route discovery now uses the same violet glass card system as the format and compare areas.
- Format hero artwork was moved fully inside its container to prevent clipping.
- Practical-setting cards now use route-aware, varied icons and no decorative status dot.
- Public-facing planned/beta wording was replaced with production-ready privacy and reliability wording.
- No route, component, API, conversion mode, billing integration, or feature file was deleted.

## Pro promotion visibility during review

The converter's locked Pro controls, upgrade modal, and batch upgrade prompts are now conditionally hidden while `NEXT_PUBLIC_ENABLE_PRO=false`.

No Pro component, route, billing dependency, entitlement logic, or advanced-control implementation was removed. Set the Vercel environment variable below and redeploy to restore the complete Pro promotion UI:

```env
NEXT_PUBLIC_ENABLE_PRO=true
```

## 2026-07-06 editorial-value update

- Preserved every converter, PDF, batch, Pro, account, payment, Android and waitlist feature file.
- Disabled public Pro and sign-in routes now redirect to the finished converter while their feature switches are false. Setting the matching environment variable to `true` restores the original route.
- Closed interstitial content no longer remains hidden in rendered HTML, and sponsor/development wording was replaced with a neutral external-link notice.
- Added a hand-written Guides hub and three substantial editorial guides:
  - How Converto handles uploaded files
  - How to choose audio bitrate and sample rate
  - JPG, PNG, WEBP and AVIF image compression guide
- Added guide metadata, Article/Breadcrumb/FAQ structured data, internal navigation, sitemap entries and AdSense eligibility.
- Updated homepage and footer links so the editorial guides are easy to discover.
- Kept the 15 hand-written converter routes as the only indexable programmatic converter pages.

