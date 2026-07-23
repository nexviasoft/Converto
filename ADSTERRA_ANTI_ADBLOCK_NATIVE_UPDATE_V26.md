# Adsterra Anti-Adblock Native Update V26

## Yapılan değişiklik

- Aktif Native Banner placement kimliği korunmuştur: `fd6601ae4f261958321eb11878687973`.
- Native reklam scripti panelde verilen güncel adrese geçirilmiştir:
  - Eski: `https://pl30462932.effectivecpmnetwork.com/.../invoke.js`
  - Yeni: `https://thorpejoy.com/.../invoke.js`
- Vercel ortam değişkeninde eski script adresi kalmışsa kod artık bu eski değeri yok sayar ve yeni scripti kullanır.
- Native container kimliği değiştirilmemiştir.
- Standart 728x90, 320x50 ve 300x250 banner birimleri kapalı kalmaya devam eder; aktif reklam türü Native Banner'dır.

## Vercel notu

`NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_SRC` tanımlıysa yeni `thorpejoy.com` adresine güncellenmesi önerilir. Kod eski `effectivecpmnetwork.com` değerini güvenli biçimde yok saysa da panel ile ortam değişkeninin aynı tutulması yönetimi kolaylaştırır.
