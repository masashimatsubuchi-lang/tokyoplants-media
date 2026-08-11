// Instagram・Facebook・LINE などのアプリ内ブラウザ（WKWebView）かどうかを判定する。
//
// これらのブラウザは https://apps.apple.com への遷移が黙って失敗する。
// Appleが返す `301 Location: itms-appss://...` を処理できないため、
// タップしても何も起きない（2026-08-12にオーナー環境で再現）。
// 判定できた場合だけ、App Storeのスキームに切り替える。
//
// UA判定は将来のバージョンで外れる可能性がある。外れても「通常のブラウザ扱い」に
// 戻るだけで、それ以前と同じ挙動になる（悪化はしない）。
const IN_APP_UA = /Instagram|FBAN|FBAV|FB_IAB|Line\/|KAKAOTALK|Twitter/i;

export function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return IN_APP_UA.test(navigator.userAgent);
}
