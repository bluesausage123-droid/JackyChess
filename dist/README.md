# dist/ — 上架產出

## 已產出檔案

- `guanqi-xinjing-1.0.0.aab` — Google Play 上傳用,8.47 MB,**已簽名 release**
- `PLAY_STORE_LISTING.md` — 商品頁素材(短/長描述、截圖清單、分級答覆)

## 重 build .aab 的方式

修改網頁內容後重新打包:

```powershell
# 1. 重 build 網頁(icon、CDN、JSX 編譯)
npm run build:web

# 2. 把最新 site/ 同步到 android/
npx cap sync android

# 3. build .aab
.\tools\build_aab.ps1
```

新版本上架前記得:
- 升 [android/app/build.gradle](../android/app/build.gradle) 的 `versionCode`(整數,每次 +1)與 `versionName`(語意版號,如 1.0.1)
- 升 [site/service-worker.js](../site/service-worker.js) 的 `CACHE_VERSION` 末尾數字 +1

## ⚠️ 簽名金鑰備份

`android/keystore/guanqi-release.jks` 是這個 App 的**唯一身分**。

- **遺失就無法更新 Play Store 上的這個 App**(只能改包名重發)
- 密碼:`SEE_PASSWORD_MANAGER`(別忘了改強密碼,並用 1Password / Bitwarden 備份)
- 強烈建議:把 `keystore/` 整個資料夾上傳到加密雲碟(Drive / Dropbox)備份

如果開了 Google Play App Signing,Google 會幫你保管 production key,但你還是得保管好 upload key(就是這把)。

## 下一步:Play Console 上架流程

1. 註冊 Play Console($25 美元一次性):<https://play.google.com/console>
2. 建立新應用程式 → 名稱「觀棋心徑」
3. 上傳 `guanqi-xinjing-1.0.0.aab`
4. 把 [PLAY_STORE_LISTING.md](PLAY_STORE_LISTING.md) 的素材逐項貼進去
5. **先發「內部測試」軌道**,拉 3-5 個朋友安裝,確認可開、無白屏
6. 通過後升正式版本,等審核 1-7 天

## 上架前缺什麼?

- [x] App icon(512×512、maskable 都有)
- [x] 已簽名 .aab
- [x] 隱私權政策(html)
- [ ] **網站 HTTPS 部署**(要把 `site/privacy-policy.html` 部署成公開網址,Play Console 才能填)
- [ ] **Feature graphic**(1024×500 PNG)
- [ ] **手機截圖**(至少 2 張,建議 6 張,1080×2400 PNG)
- [ ] Play Console 開發者帳號($25)
