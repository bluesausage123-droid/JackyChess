# 觀棋心徑 — Google Play 上架指南

## 概觀:整體路線(預估 4–8 小時 + $25 USD 一次性)

我們選擇 **TWA (Trusted Web Activity)** 路線把網頁包成 APK,因為:
- 你目前是 single-HTML + React/Tailwind CDN 的架構,改成原生 App 工程過大。
- TWA 做出來的 APK 跟原生 App 在 Play Store 上**無法區分**(沒有「PWA」標記)。
- 程式碼維護一份就好,網頁改了 APP 也跟著改(下次發版只需重打包,不必改 Java/Kotlin)。

## 已經幫你做完的部分 ✅

1. `site/index.html` — 加入 PWA `<link rel="manifest">`、`<meta name="theme-color">`、SW 註冊
2. `site/manifest.json` — Web App Manifest,含 icon 與 screenshot 規範
3. `site/service-worker.js` — 離線快取(同源 network-first、CDN cache-first)
4. 移除「隨喜贊助」按鈕與帳號視窗

## 剩下需要你手動完成的步驟

---

## 步驟 1:準備 App 圖示(必要,需自己出圖或請人/AI 生成)

需要以下尺寸的 PNG,放在 `site/icons/`:

| 檔名 | 尺寸 | 用途 |
|------|------|------|
| `icon-72.png` | 72×72 | Android |
| `icon-96.png` | 96×96 | Android |
| `icon-128.png` | 128×128 | Android |
| `icon-144.png` | 144×144 | Android |
| `icon-152.png` | 152×152 | iOS |
| `icon-192.png` | 192×192 | Android(常用) |
| `icon-384.png` | 384×384 | Android |
| `icon-512.png` | 512×512 | Play Store 商品頁 **(必要)** |
| `icon-maskable-512.png` | 512×512 | Android 自適應圖示 **(必要)** |

**最快的做法**:畫一張 1024×1024 的源圖,丟到 <https://www.pwabuilder.com/imageGenerator> 一次自動產生全部尺寸。

**maskable 圖**特別注意:重要視覺要在中央 80% 範圍內(外圍 20% 會被裁切成圓形/橢圓)。

設計建議:
- 主色用 `#7f1d1d`(深紅)+ `#f2f0e9`(米白底),呼應現有網頁風格
- 中央放一顆「帥」棋子或「觀」字
- 你的 `333858.jpg` 如果是 logo,可以直接用作源圖

## 步驟 2:準備上架素材(Play Console 必填)

需要以下素材(放在 `site/screenshots/` 與 Play Console 上傳區):

| 項目 | 規格 | 要求 |
|------|------|------|
| **App icon** | 512×512 PNG | 同上 icon-512 |
| **Feature graphic** | 1024×500 PNG | 商品頁頂部橫幅 |
| **手機截圖** | 1080×1920 或 1080×2400 PNG/JPG | **至少 2 張**,建議 4–8 張 |
| **平板截圖** | 7吋與10吋(可選) | 若想支援平板 |
| **Privacy Policy URL** | 公開可達網址 | **必填** |
| **App 描述** | 短(80字)+ 長(4000字) | 中文 zh-TW |

截圖建議拍:
1. 首頁(性別/婚姻/類別/問題輸入)
2. 洗牌動畫(中央旋轉那刻)
3. 抽卦結果(5 個棋子已就位)
4. 解析報告(中段內容)

**Privacy Policy** 最簡版:可直接用 <https://app-privacy-policy-generator.firebaseapp.com> 生成,因為你的 App **不收集任何使用者資料**(全部在前端計算),寫起來會非常短。完成後可發布到任何免費網頁服務(GitHub Pages / Netlify / Notion 公開頁)。

## 步驟 3:把網站上線到 HTTPS(免費)

TWA **必須**指向一個 HTTPS 網址。最簡單的免費方案:

### 選項 A:GitHub Pages(推薦)
```bash
# 1. 把 site/ 內容推到 GitHub repo(例如 jacky-chess/guanqi)
# 2. 在 repo Settings → Pages → 啟用,選 main branch / root
# 3. 取得網址:https://jacky-chess.github.io/guanqi/
```

### 選項 B:Netlify(更穩,有自動 HTTPS)
1. 註冊 <https://netlify.com>
2. 把 `site/` 拖進「Drag & drop」區
3. 立即取得 `https://xxxxx.netlify.app` 網址,可改成自定子網域

### 選項 C:Cloudflare Pages
1. 註冊 <https://pages.cloudflare.com>
2. 連 GitHub repo 自動部署
3. 預設 HTTPS + 全球 CDN

驗證網站上線後:
- 在手機 Chrome 開網址,確認 PWA 可運作
- Lighthouse 跑分:`PWA` 類目要 ≥ 90 分(這份程式應該都過)

## 步驟 4:用 PWABuilder 生成 APK(免寫 Java)

最簡單的工具:**<https://www.pwabuilder.com>**

1. 進站,輸入你的網址(步驟 3 的 HTTPS URL)
2. 等它分析完成,看看分數(理想 ≥ 80)
3. 若有 Score 警告,通常是 manifest 缺欄位(我們已預先處理大部分)
4. 點 **「Package For Stores」→「Android」**
5. 選 「Other」→「Generate Package」
6. 下載得到:
   - `*.aab` 檔(送 Play Store 用)
   - `*.apk` 檔(本機測試用)
   - `assetlinks.json`(下一步要用)

## 步驟 5:設定 Digital Asset Links(讓 TWA 不顯示瀏覽器網址列)

1. 把 PWABuilder 給的 `assetlinks.json` 放到網站根目錄的 `.well-known/` 資料夾
   - 完整路徑:`https://你的網址/.well-known/assetlinks.json`
2. 用瀏覽器開該網址確認可看到 JSON 內容
3. 沒設這步驟,App 開啟時頂部會顯示 Chrome 網址列,看起來不像原生 App

## 步驟 6:Play Console 註冊與上架($25 USD 一次性)

1. 註冊開發者帳號:<https://play.google.com/console>
2. 完成驗證(信用卡 + 個人/公司資料)
3. 建立新應用程式 → 名稱:「觀棋心徑」
4. 必填設定:
   - 應用程式類型:應用程式
   - 免費或付費:**免費**
   - 主要類別:生活風格 (Lifestyle) 或 娛樂 (Entertainment)
   - 內容分級問卷:依實際內容回答
   - 目標客群:13+(占卜內容無不適宜)
   - 隱私權政策:貼步驟 2 的 URL
5. 上傳:
   - App Bundle (`.aab`)
   - Feature graphic + Screenshots + Icon
   - 短描述 + 長描述
6. 提交審核 → 等 1–7 天

## 步驟 7:首次發布之後

- 推 release track:先選「**內部測試**」拉幾個朋友裝,確認可開
- 確認沒問題 → 升級到「正式版本」
- 更新策略:之後改網頁就行,APK 通常**不必重打包**(TWA 是動態載入網址),只有 manifest 重大變更才需重發版

## 常見坑

| 問題 | 解法 |
|------|------|
| 開 APP 看到 Chrome 網址列 | `assetlinks.json` 沒放對位置或內容錯 |
| 圖示模糊 | maskable 圖視覺要在中央 80% 範圍內 |
| Play 審核打回票:無 Privacy Policy | 必須有公開可達 URL |
| 離線打不開 | service-worker 沒註冊成功(F12 看 Application → SW) |
| 中文字體跑掉 | 確認 `Noto Serif TC` CDN 在 SW 快取裡 |

## 我可以接續幫你做什麼

只要你先完成步驟 1(圖示)+ 步驟 3(網站上線),回頭告訴我網址,我可以:
- 幫你檢查 PWA 評分,修補 manifest 與 SW
- 確認 `assetlinks.json` 路徑正確
- 把上架文案(短/長描述)寫好
- 寫一份簡版 Privacy Policy(中文 + 英文)

---

## 估時與成本總覽

| 項目 | 時間 | 費用 |
|------|------|------|
| 圖示設計(自做) | 1–2 小時 | $0(用 PWABuilder 生成器) |
| 網站上線 | 30 分 | $0(GitHub Pages / Netlify) |
| PWABuilder 出 APK | 30 分 | $0 |
| Asset Links 設定 | 15 分 | $0 |
| Play Console 註冊 | 30 分 | **$25 USD 一次性** |
| 商品頁素材(截圖+描述) | 1–2 小時 | $0 |
| 審核等待 | 1–7 天 | — |
| **小計** | **約 4–6 小時** | **$25 USD** |

審核通過後,「觀棋心徑」就會出現在 Play Store 上,使用者搜尋「觀棋」「象棋卜卦」「Jacky」都能找到。
